import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { authService } from '@/database/services';
import type { User } from '@/database/schema';

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isSignedIn: boolean;
	signIn: (
		email: string,
		password: string
	) => Promise<{
		success: boolean;
		error?: string;
	}>;
	signUp: (
		email: string,
		password: string,
		name?: string
	) => Promise<{
		success: boolean;
		error?: string;
	}>;
	signOut: () => Promise<void>;
	updateProfile: (updates: { name?: string; email?: string }) => Promise<{
		success: boolean;
		error?: string;
	}>;
	changePassword: (
		currentPassword: string,
		newPassword: string
	) => Promise<{
		success: boolean;
		error?: string;
	}>;
	deleteAccount: () => Promise<{ success: boolean; error?: string }>;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Load user session on mount
	useEffect(() => {
		loadUser();
	}, []);

	const loadUser = async () => {
		try {
			setIsLoading(true);
			const currentUser = await authService.getCurrentUser();
			setUser(currentUser);
		} catch (error) {
			console.error('Error loading user:', error);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	const signIn = async (
		email: string,
		password: string
	): Promise<{ success: boolean; error?: string }> => {
		try {
			const result = await authService.login(email, password);
			if (result.success && result.user) {
				setUser(result.user);
				return { success: true };
			}
			return { success: false, error: result.error };
		} catch (error) {
			console.error('Error signing in:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Sign in failed',
			};
		}
	};

	const signUp = async (
		email: string,
		password: string,
		name?: string
	): Promise<{ success: boolean; error?: string }> => {
		try {
			const result = await authService.register(email, password, name);
			if (result.success && result.user) {
				// Auto login after registration
				const loginResult = await authService.login(email, password);
				if (loginResult.success && loginResult.user) {
					setUser(loginResult.user);
					return { success: true };
				}
			}
			return { success: false, error: result.error };
		} catch (error) {
			console.error('Error signing up:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Sign up failed',
			};
		}
	};

	const signOut = async (): Promise<void> => {
		try {
			await authService.logout();
			setUser(null);
		} catch (error) {
			console.error('Error signing out:', error);
			throw error;
		}
	};

	const updateProfile = async (updates: {
		name?: string;
		email?: string;
	}): Promise<{ success: boolean; error?: string }> => {
		if (!user) {
			return { success: false, error: 'No user logged in' };
		}

		try {
			const result = await authService.updateProfile(user.id, updates);
			if (result.success && result.user) {
				setUser(result.user);
				return { success: true };
			}
			return { success: false, error: result.error };
		} catch (error) {
			console.error('Error updating profile:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Update failed',
			};
		}
	};

	const changePassword = async (
		currentPassword: string,
		newPassword: string
	): Promise<{ success: boolean; error?: string }> => {
		if (!user) {
			return { success: false, error: 'No user logged in' };
		}

		try {
			return await authService.changePassword(
				user.id,
				currentPassword,
				newPassword
			);
		} catch (error) {
			console.error('Error changing password:', error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Password change failed',
			};
		}
	};

	const deleteAccount = async (): Promise<{
		success: boolean;
		error?: string;
	}> => {
		if (!user) {
			return { success: false, error: 'No user logged in' };
		}

		try {
			const result = await authService.deleteAccount(user.id);
			if (result.success) {
				setUser(null);
				return { success: true };
			}
			return { success: false, error: result.error };
		} catch (error) {
			console.error('Error deleting account:', error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Account deletion failed',
			};
		}
	};

	const refreshUser = async (): Promise<void> => {
		await loadUser();
	};

	const value: AuthContextType = {
		user,
		isLoading,
		isSignedIn: !!user,
		signIn,
		signUp,
		signOut,
		updateProfile,
		changePassword,
		deleteAccount,
		refreshUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use the auth context
 * Replaces Clerk's useUser hook
 */
export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}

/**
 * Custom hook for backwards compatibility with Clerk's useUser
 */
export function useUser() {
	const { user, isLoading } = useAuth();
	return { user, isLoaded: !isLoading };
}
