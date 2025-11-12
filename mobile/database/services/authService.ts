import { eq, and } from 'drizzle-orm';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { db } from '../index';
import {
	users,
	sessions,
	type User,
	type NewUser,
	type Session,
} from '../schema';

/**
 * Local authentication service
 * Handles user registration, login, logout, and session management
 */
export class AuthService {
	private static readonly SESSION_KEY = 'auth_session_token';
	private static readonly SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

	/**
	 * Generate a UUID v4
	 */
	private generateUUID(): string {
		return Crypto.randomUUID();
	}

	/**
	 * Hash password using SHA-256
	 */
	private async hashPassword(password: string): Promise<string> {
		const hash = await Crypto.digestStringAsync(
			Crypto.CryptoDigestAlgorithm.SHA256,
			password
		);
		return hash;
	}

	/**
	 * Generate a secure random token
	 */
	private generateToken(): string {
		return Crypto.randomUUID() + '-' + Date.now();
	}

	/**
	 * Register a new user
	 */
	async register(
		email: string,
		password: string,
		name?: string
	): Promise<{ success: boolean; user?: User; error?: string }> {
		try {
			// Validate email format
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				return { success: false, error: 'Invalid email format' };
			}

			// Validate password strength
			if (password.length < 6) {
				return {
					success: false,
					error: 'Password must be at least 6 characters',
				};
			}

			// Check if user already exists
			const existingUser = await db
				.select()
				.from(users)
				.where(eq(users.email, email.toLowerCase()))
				.limit(1);

			if (existingUser.length > 0) {
				return { success: false, error: 'Email already registered' };
			}

			// Hash password
			const passwordHash = await this.hashPassword(password);

			// Create user
			const userId = this.generateUUID();
			const newUser: NewUser = {
				id: userId,
				email: email.toLowerCase(),
				passwordHash,
				name: name || null,
			};

			const result = await db.insert(users).values(newUser).returning();
			const user = result[0];

			return { success: true, user };
		} catch (error) {
			console.error('Error registering user:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Registration failed',
			};
		}
	}

	/**
	 * Login user
	 */
	async login(
		email: string,
		password: string
	): Promise<{
		success: boolean;
		user?: User;
		token?: string;
		error?: string;
	}> {
		try {
			// Find user by email
			const result = await db
				.select()
				.from(users)
				.where(eq(users.email, email.toLowerCase()))
				.limit(1);

			if (result.length === 0) {
				return { success: false, error: 'Invalid email or password' };
			}

			const user = result[0];

			// Verify password
			const passwordHash = await this.hashPassword(password);
			if (passwordHash !== user.passwordHash) {
				return { success: false, error: 'Invalid email or password' };
			}

			// Create session
			const sessionId = this.generateUUID();
			const token = this.generateToken();
			const expiresAt = new Date(Date.now() + AuthService.SESSION_DURATION);

			await db.insert(sessions).values({
				id: sessionId,
				userId: user.id,
				token,
				expiresAt,
			});

			// Store token securely
			await SecureStore.setItemAsync(AuthService.SESSION_KEY, token);

			return { success: true, user, token };
		} catch (error) {
			console.error('Error logging in:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Login failed',
			};
		}
	}

	/**
	 * Logout user
	 */
	async logout(): Promise<void> {
		try {
			// Get current token
			const token = await SecureStore.getItemAsync(AuthService.SESSION_KEY);

			if (token) {
				// Delete session from database
				await db.delete(sessions).where(eq(sessions.token, token));

				// Remove token from secure storage
				await SecureStore.deleteItemAsync(AuthService.SESSION_KEY);
			}
		} catch (error) {
			console.error('Error logging out:', error);
			throw error;
		}
	}

	/**
	 * Get current user from session
	 */
	async getCurrentUser(): Promise<User | null> {
		try {
			// Get stored token
			const token = await SecureStore.getItemAsync(AuthService.SESSION_KEY);

			if (!token) {
				return null;
			}

			// Find session
			const sessionResult = await db
				.select()
				.from(sessions)
				.where(eq(sessions.token, token))
				.limit(1);

			if (sessionResult.length === 0) {
				// Invalid session
				await SecureStore.deleteItemAsync(AuthService.SESSION_KEY);
				return null;
			}

			const session = sessionResult[0];

			// Check if session expired
			if (session.expiresAt < new Date()) {
				// Session expired
				await db.delete(sessions).where(eq(sessions.id, session.id));
				await SecureStore.deleteItemAsync(AuthService.SESSION_KEY);
				return null;
			}

			// Get user
			const userResult = await db
				.select()
				.from(users)
				.where(eq(users.id, session.userId))
				.limit(1);

			if (userResult.length === 0) {
				return null;
			}

			return userResult[0];
		} catch (error) {
			console.error('Error getting current user:', error);
			return null;
		}
	}

	/**
	 * Update user profile
	 */
	async updateProfile(
		userId: string,
		updates: { name?: string; email?: string }
	): Promise<{ success: boolean; user?: User; error?: string }> {
		try {
			// If email is being updated, check if it's already taken
			if (updates.email) {
				const existingUser = await db
					.select()
					.from(users)
					.where(
						and(
							eq(users.email, updates.email.toLowerCase()),
							eq(users.id, userId)
						)
					)
					.limit(1);

				if (existingUser.length > 0 && existingUser[0].id !== userId) {
					return { success: false, error: 'Email already in use' };
				}
			}

			const updateData: any = {
				updatedAt: new Date(),
			};

			if (updates.name !== undefined) updateData.name = updates.name;
			if (updates.email !== undefined)
				updateData.email = updates.email.toLowerCase();

			const result = await db
				.update(users)
				.set(updateData)
				.where(eq(users.id, userId))
				.returning();

			if (result.length === 0) {
				return { success: false, error: 'User not found' };
			}

			return { success: true, user: result[0] };
		} catch (error) {
			console.error('Error updating profile:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Update failed',
			};
		}
	}

	/**
	 * Change password
	 */
	async changePassword(
		userId: string,
		currentPassword: string,
		newPassword: string
	): Promise<{ success: boolean; error?: string }> {
		try {
			// Get user
			const userResult = await db
				.select()
				.from(users)
				.where(eq(users.id, userId))
				.limit(1);

			if (userResult.length === 0) {
				return { success: false, error: 'User not found' };
			}

			const user = userResult[0];

			// Verify current password
			const currentPasswordHash = await this.hashPassword(currentPassword);
			if (currentPasswordHash !== user.passwordHash) {
				return { success: false, error: 'Current password is incorrect' };
			}

			// Validate new password
			if (newPassword.length < 6) {
				return {
					success: false,
					error: 'New password must be at least 6 characters',
				};
			}

			// Hash new password
			const newPasswordHash = await this.hashPassword(newPassword);

			// Update password
			await db
				.update(users)
				.set({
					passwordHash: newPasswordHash,
					updatedAt: new Date(),
				})
				.where(eq(users.id, userId));

			return { success: true };
		} catch (error) {
			console.error('Error changing password:', error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Password change failed',
			};
		}
	}

	/**
	 * Delete user account
	 */
	async deleteAccount(
		userId: string
	): Promise<{ success: boolean; error?: string }> {
		try {
			// Delete user (cascade will delete sessions, favorites, ai_recipes)
			await db.delete(users).where(eq(users.id, userId));

			// Clear session
			await SecureStore.deleteItemAsync(AuthService.SESSION_KEY);

			return { success: true };
		} catch (error) {
			console.error('Error deleting account:', error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Account deletion failed',
			};
		}
	}

	/**
	 * Clean up expired sessions
	 */
	async cleanupExpiredSessions(): Promise<void> {
		try {
			const now = new Date();
			await db.delete(sessions).where(eq(sessions.expiresAt, now));
		} catch (error) {
			console.error('Error cleaning up expired sessions:', error);
		}
	}
}

export const authService = new AuthService();
