import { authService } from '@/database/services/authService';

export async function POST(request: Request) {
	try {
		const url = new URL(request.url);
		const action = url.searchParams.get('action');
		const body = await request.json();

		switch (action) {
			case 'register': {
				const { email, password, name } = body;

				if (!email || !password) {
					return Response.json(
						{ error: 'email and password are required' },
						{ status: 400 }
					);
				}

				const result = await authService.register(email, password, name);

				if (!result.success) {
					return Response.json({ error: result.error }, { status: 400 });
				}

				// After registration, log the user in to create a session
				const loginResult = await authService.login(email, password);

				if (!loginResult.success) {
					return Response.json(
						{ error: 'Registration successful but login failed' },
						{ status: 500 }
					);
				}

				return Response.json(
					{
						user: loginResult.user,
						token: loginResult.token,
					},
					{ status: 201 }
				);
			}

			case 'login': {
				const { email, password } = body;

				if (!email || !password) {
					return Response.json(
						{ error: 'email and password are required' },
						{ status: 400 }
					);
				}

				const result = await authService.login(email, password);

				if (!result.success) {
					return Response.json({ error: result.error }, { status: 401 });
				}

				return Response.json(
					{
						user: result.user,
						token: result.token,
					},
					{ status: 200 }
				);
			}

			case 'logout': {
				await authService.logout();

				return Response.json(
					{ message: 'Logged out successfully' },
					{ status: 200 }
				);
			}

			case 'verify-session': {
				const { token } = body;

				if (!token) {
					return Response.json({ error: 'token is required' }, { status: 400 });
				}

				const user = await authService.getCurrentUser();

				if (!user) {
					return Response.json(
						{ error: 'Invalid or expired session' },
						{ status: 401 }
					);
				}

				return Response.json({ user }, { status: 200 });
			}

			default:
				return Response.json(
					{
						error:
							'Invalid action. Supported actions: register, login, logout, verify-session',
					},
					{ status: 400 }
				);
		}
	} catch (error) {
		console.error('Auth API error:', error);
		return Response.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(request: Request) {
	try {
		const url = new URL(request.url);
		const action = url.searchParams.get('action');
		const body = await request.json();

		switch (action) {
			case 'update-profile': {
				const { userId, name, email } = body;

				if (!userId) {
					return Response.json(
						{ error: 'userId is required' },
						{ status: 400 }
					);
				}

				const updatedUser = await authService.updateProfile(userId, {
					name,
					email,
				});

				if (!updatedUser) {
					return Response.json({ error: 'User not found' }, { status: 404 });
				}

				return Response.json({ user: updatedUser }, { status: 200 });
			}

			case 'change-password': {
				const { userId, currentPassword, newPassword } = body;

				if (!userId || !currentPassword || !newPassword) {
					return Response.json(
						{ error: 'userId, currentPassword, and newPassword are required' },
						{ status: 400 }
					);
				}

				const result = await authService.changePassword(
					userId,
					currentPassword,
					newPassword
				);

				if (!result.success) {
					return Response.json({ error: result.error }, { status: 400 });
				}

				return Response.json(
					{ message: 'Password changed successfully' },
					{ status: 200 }
				);
			}

			default:
				return Response.json(
					{
						error:
							'Invalid action. Supported actions: update-profile, change-password',
					},
					{ status: 400 }
				);
		}
	} catch (error) {
		console.error('Auth API error:', error);
		return Response.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function DELETE(request: Request) {
	try {
		const url = new URL(request.url);
		const userId = url.searchParams.get('userId');

		if (!userId) {
			return Response.json({ error: 'userId is required' }, { status: 400 });
		}

		await authService.deleteAccount(userId);

		return Response.json(
			{ message: 'Account deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Auth API error:', error);
		return Response.json({ error: 'Internal server error' }, { status: 500 });
	}
}
