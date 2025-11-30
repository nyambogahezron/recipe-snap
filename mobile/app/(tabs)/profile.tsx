import React, { useMemo, useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import Animated, {
	FadeInDown,
	FadeInUp,
	ZoomIn,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import RecipeBottomSheet from '@/components/RecipeBottomSheet';
import { profileStyles } from '@/assets/styles/profile.styles';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import toast from '@/services/toastService';
import BackgroundWrapper from '@/components/BackgroundWrapper';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeDate = (value?: Date | number | string | null): Date | null => {
	if (!value) return null;
	if (value instanceof Date) return value;

	if (typeof value === 'number') {
		const millis = value < 1e12 ? value * 1000 : value;
		const parsed = new Date(millis);
		return Number.isNaN(parsed.getTime()) ? null : parsed;
	}

	const timestamp = Number(value);
	if (!Number.isNaN(timestamp)) {
		const millis = timestamp < 1e12 ? timestamp * 1000 : timestamp;
		const parsed = new Date(millis);
		if (!Number.isNaN(parsed.getTime())) return parsed;
	}

	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getRelativeTime = (value?: Date | number | string | null): string => {
	const date = normalizeDate(value);
	if (!date) return 'Never updated';

	const diffMs = Date.now() - date.getTime();
	if (diffMs < 60 * 1000) return 'Just now';
	const diffMinutes = Math.floor(diffMs / (60 * 1000));
	if (diffMinutes < 60) return `${diffMinutes}m ago`;
	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) return `${diffHours}h ago`;
	const diffDays = Math.floor(diffHours / 24);
	return `${diffDays}d ago`;
};

const formatFullDate = (value?: Date | number | string | null): string => {
	const date = normalizeDate(value);
	if (!date) return '—';
	return date.toLocaleDateString(undefined, {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
};

const ProfileScreen = (): React.ReactElement | null => {
	const { user, updateProfile, signOut } = useAuth();
	const [name, setName] = useState(user?.name ?? '');
	const [email, setEmail] = useState(user?.email ?? '');
	const [isSaving, setIsSaving] = useState(false);
	const [isSigningOut, setIsSigningOut] = useState(false);
	const [statusMessage, setStatusMessage] = useState<string | null>(null);
	const [sheetVisible, setSheetVisible] = useState(false);
	const [draftName, setDraftName] = useState('');
	const [draftEmail, setDraftEmail] = useState('');
	const [sheetError, setSheetError] = useState<string | null>(null);

	useEffect(() => {
		setName(user?.name ?? '');
		setEmail(user?.email ?? '');
	}, [user?.name, user?.email]);

	useEffect(() => {
		if (!statusMessage) return;
		const timeout = setTimeout(() => setStatusMessage(null), 4000);
		return () => clearTimeout(timeout);
	}, [statusMessage]);

	const initials = useMemo(() => {
		if (user?.name) {
			const [first = '', second = ''] = user.name.split(' ');
			return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase() || '🍽️';
		}
		return user?.email?.charAt(0).toUpperCase() ?? '🍽️';
	}, [user?.name, user?.email]);

	const memberSince = useMemo(
		() => formatFullDate(user?.createdAt),
		[user?.createdAt]
	);

	const lastUpdatedRelative = useMemo(
		() => getRelativeTime(user?.updatedAt),
		[user?.updatedAt]
	);

	const userIdPreview = useMemo(() => {
		if (!user?.id) return 'Not available';
		return `${user.id.slice(0, 6)}…${user.id.slice(-4)}`;
	}, [user?.id]);

	const emailIsValid = useMemo(() => emailRegex.test(email.trim()), [email]);

	const isDirty = useMemo(() => {
		const baseName = user?.name ?? '';
		const baseEmail = user?.email ?? '';
		return (
			name.trim() !== (baseName || '') || email.trim() !== (baseEmail || '')
		);
	}, [name, email, user?.name, user?.email]);

	const canSave = isDirty && emailIsValid && !isSaving;

	const handleUpdateProfile = async () => {
		if (!user) return;
		if (!emailIsValid) {
			toast.error('Invalid email', 'Please enter a valid email address.');
			return;
		}

		try {
			setIsSaving(true);
			const result = await updateProfile({
				name: name.trim(),
				email: email.trim(),
			});

			if (result.success) {
				toast.success('Profile updated', 'Your info is now synced.');
				setStatusMessage('Changes synced just now');
			} else {
				toast.error('Update failed', result.error ?? 'Please try again.');
			}
		} catch (error) {
			toast.error(
				'Unexpected error',
				error instanceof Error ? error.message : 'Try again shortly.'
			);
		} finally {
			setIsSaving(false);
		}
	};

	const handleSignOut = async () => {
		try {
			setIsSigningOut(true);
			await signOut();
		} catch (error) {
			toast.error(
				'Sign out failed',
				error instanceof Error ? error.message : 'Please try again.'
			);
		} finally {
			setIsSigningOut(false);
		}
	};
	const openEditSheet = () => {
		setSheetError(null);
		setDraftName(name);
		setDraftEmail(email);
		setSheetVisible(true);
	};

	const closeEditSheet = () => {
		setSheetVisible(false);
		setDraftName('');
		setDraftEmail('');
		setSheetError(null);
	};

	const handleSaveFromSheet = async () => {
		const trimmedName = draftName.trim();
		const trimmedEmail = draftEmail.trim();

		if (trimmedName.length < 2) {
			setSheetError('Please enter at least 2 characters for name.');
			return;
		}
		if (!emailRegex.test(trimmedEmail)) {
			setSheetError('Please enter a valid email address.');
			return;
		}

		try {
			setIsSaving(true);
			const result = await updateProfile({ name: trimmedName, email: trimmedEmail });

			if (result.success) {
				setName(trimmedName);
				setEmail(trimmedEmail);
				toast.success('Profile updated', 'Your info is now synced.');
				setStatusMessage('Changes synced just now');
				closeEditSheet();
			} else {
				setSheetError(result.error ?? 'Update failed — please try again.');
			}
		} catch (error) {
			setSheetError(error instanceof Error ? error.message : 'Unexpected error');
		} finally {
			setIsSaving(false);
		}
	};

	// Unified sheet - placeholders and title handled inline

	if (!user) return null;

	return (
		<BackgroundWrapper statusBarStyle='light-content' overlayOpacity={0.4}>
			<AnimatedScrollView
				contentContainerStyle={[
					profileStyles.container,
					profileStyles.scrollContent,
				]}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps='handled'
			>
				<Animated.View
					style={profileStyles.heroCard}
					entering={FadeInDown.duration(600).springify()}
				>
					<View style={profileStyles.heroContent}>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								columnGap: 18,
							}}
						>
							<View style={profileStyles.avatar}>
								<Text style={profileStyles.avatarText}>{initials}</Text>
							</View>
							<View style={{ flex: 1 }}>
								<Text style={profileStyles.nameText}>
									{name.trim() || 'Add your name'}
								</Text>
								<Text style={profileStyles.emailText}>{email}</Text>
							</View>
						</View>

						<View style={profileStyles.statusPills}>
							<Animated.View
								entering={ZoomIn.springify().delay(150)}
								style={profileStyles.statusPill}
							>
								<Ionicons
									name='shield-checkmark'
									size={16}
									color={COLORS.white}
								/>
								<Text style={profileStyles.statusPillText}>Secure session</Text>
							</Animated.View>
							<Animated.View
								entering={ZoomIn.springify().delay(250)}
								style={profileStyles.statusPill}
							>
								<Ionicons name='time' size={16} color={COLORS.white} />
								<Text style={profileStyles.statusPillText}>
									{statusMessage ?? `Synced ${lastUpdatedRelative}`}
								</Text>
							</Animated.View>
						</View>
					</View>
				</Animated.View>

				<Animated.View
					style={profileStyles.card}
					entering={FadeInUp.delay(180).duration(500)}
				>
					<View style={profileStyles.cardHeader}>
						<View>
							<Text style={profileStyles.cardTitle}>Profile details</Text>
							<Text style={profileStyles.cardSubtitle}>
								Update your personal info anytime
							</Text>
						</View>
						<TouchableOpacity onPress={openEditSheet} style={{padding:6}}>
							<Ionicons name='create-outline' size={20} color={COLORS.primary} />
						</TouchableOpacity>
					</View>

					<View style={profileStyles.editRow}>
						<View style={{ flex: 1 }}>
							<Text style={profileStyles.fieldLabel}>Full name</Text>
							<Text style={profileStyles.fieldValue}>
								{name.trim() || 'Add your name'}
							</Text>
						</View>
						{/* Single edit entry now available via header Edit button */}
					</View>

					<View style={profileStyles.editRow}>
						<View style={{ flex: 1 }}>
							<Text style={profileStyles.fieldLabel}>Email address</Text>
							<Text style={profileStyles.fieldValue}>
								{email || 'Add email'}
							</Text>
						</View>
						{/* Single edit entry now available via header Edit button */}
					</View>

					{!emailIsValid && email.length > 0 && (
						<Text style={profileStyles.errorText}>
							Please enter a valid email address.
						</Text>
					)}

					<View style={profileStyles.divider} />

					<View style={profileStyles.buttonRow}>
						<TouchableOpacity
							style={[profileStyles.button, profileStyles.secondaryButton]}
							onPress={handleSignOut}
							disabled={isSigningOut}
						>
							{isSigningOut ? (
								<ActivityIndicator color={COLORS.white} />
							) : (
								<Text style={profileStyles.buttonText}>Sign out</Text>
							)}
						</TouchableOpacity>
					</View>

					{/* app version and development info */}
				</Animated.View>
			</AnimatedScrollView>
			<View style={profileStyles.appInfo}>
				<Text style={profileStyles.appInfoText}>
					Bite v1.0.0 
				</Text>
			</View>

			<RecipeBottomSheet
				isVisible={sheetVisible}
				isLoading={isSaving}
				onClose={closeEditSheet}
				title={'Edit profile'}
			>
				<View style={profileStyles.sheetContent}>
					<Text style={profileStyles.sheetLabel}>Full name</Text>
					<TextInput
						value={draftName}
						onChangeText={setDraftName}
						placeholder={'Enter your full name'}
						placeholderTextColor='rgba(0,0,0,0.4)'
						style={[profileStyles.sheetInput]}
						autoCapitalize={'words'}
						keyboardType={'default'}
					/>

					<Text style={[profileStyles.sheetLabel, { marginTop: 12 }]}>Email address</Text>
					<TextInput
						value={draftEmail}
						onChangeText={setDraftEmail}
						placeholder={'name@biteapp.io'}
						placeholderTextColor='rgba(0,0,0,0.4)'
						style={[
							profileStyles.sheetInput,
							!emailRegex.test(draftEmail.trim()) && draftEmail.length > 0
								? { borderColor: 'rgba(255,87,87,0.4)' }
								: null,
						]}
						autoCapitalize={'none'}
						keyboardType={'email-address'}
					/>

					{sheetError && <Text style={profileStyles.sheetError}>{sheetError}</Text>}

					<View style={profileStyles.sheetActions}>
						<TouchableOpacity
							style={[profileStyles.sheetButton, profileStyles.sheetGhostButton]}
							onPress={closeEditSheet}
							disabled={isSaving}
						>
							<Text style={profileStyles.sheetButtonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[profileStyles.sheetButton, profileStyles.sheetPrimaryButton]}
							onPress={handleSaveFromSheet}
							disabled={isSaving}
						>
							<Text style={profileStyles.sheetButtonText}>{isSaving ? 'Saving…' : 'Save'}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</RecipeBottomSheet>
		</BackgroundWrapper>
	);
};

export default ProfileScreen;
