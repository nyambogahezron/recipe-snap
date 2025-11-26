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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SafeScreen from '@/components/SafeScreen';
import RecipeBottomSheet from '@/components/RecipeBottomSheet';
import { profileStyles } from '@/assets/styles/profile.styles';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import toast from '@/services/toastService';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeDate = (
	value?: Date | number | string | null
): Date | null => {
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

const getRelativeTime = (
	value?: Date | number | string | null
): string => {
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

const formatFullDate = (
	value?: Date | number | string | null
): string => {
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
	const [activeEditField, setActiveEditField] = useState<'name' | 'email' | null>(null);
	const [draftValue, setDraftValue] = useState('');
	const [editError, setEditError] = useState<string | null>(null);

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

	const emailIsValid = useMemo(
		() => emailRegex.test(email.trim()),
		[email]
	);

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

	const openEditSheet = (field: 'name' | 'email') => {
		setEditError(null);
		setDraftValue(field === 'name' ? name : email);
		setActiveEditField(field);
	};

	const closeEditSheet = () => {
		setActiveEditField(null);
		setDraftValue('');
		setEditError(null);
	};

	const handleApplyDraft = () => {
		if (!activeEditField) return;
		const trimmedValue = draftValue.trim();

		if (activeEditField === 'name') {
			if (trimmedValue.length < 2) {
				setEditError('Please enter at least 2 characters.');
				return;
			}
			setName(trimmedValue);
		} else {
			if (!emailRegex.test(trimmedValue)) {
				setEditError('Enter a valid email address.');
				return;
			}
			setEmail(trimmedValue);
		}

		setStatusMessage('Draft ready — tap Save changes');
		closeEditSheet();
	};

	const sheetTitle =
		activeEditField === 'name'
			? 'Update full name'
			: activeEditField === 'email'
			? 'Update email address'
			: '';

	const sheetPlaceholder =
		activeEditField === 'name' ? 'Enter your full name' : 'name@biteapp.io';

	const stats = [
		{ label: 'Member since', value: memberSince },
		{ label: 'Last updated', value: lastUpdatedRelative },
		{ label: 'Account ID', value: userIdPreview },
	];

	if (!user) return null;

	return (
		<SafeScreen>
			<AnimatedScrollView
				contentContainerStyle={[profileStyles.container, profileStyles.scrollContent]}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps='handled'
			>
				<Animated.View
					style={profileStyles.heroCard}
					entering={FadeInDown.duration(600).springify()}
				>
					<LinearGradient
						colors={['rgba(241, 111, 38, 0.35)', 'rgba(10, 7, 6, 0.9)']}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={profileStyles.heroGradient}
					/>

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
					entering={FadeInUp.delay(100).duration(500)}
				>
					<View style={profileStyles.cardHeader}>
						<View>
							<Text style={profileStyles.cardTitle}>Account insights</Text>
							<Text style={profileStyles.cardSubtitle}>
								Your identity at a glance
							</Text>
						</View>
						<Ionicons name='pulse-outline' size={22} color={COLORS.primary} />
					</View>

					<View style={profileStyles.statsGrid}>
						{stats.map((stat, index) => (
							<Animated.View
								key={stat.label}
								entering={FadeInDown.delay(200 + index * 80).duration(450)}
								style={profileStyles.statCard}
							>
								<Text style={profileStyles.statLabel}>{stat.label}</Text>
								<Text style={profileStyles.statValue}>{stat.value}</Text>
							</Animated.View>
						))}
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
						<Ionicons
							name='create-outline'
							size={20}
							color={COLORS.primary}
						/>
					</View>

					<View style={profileStyles.editRow}>
						<View style={{ flex: 1 }}>
							<Text style={profileStyles.fieldLabel}>Full name</Text>
							<Text style={profileStyles.fieldValue}>
								{name.trim() || 'Add your name'}
							</Text>
						</View>
						<TouchableOpacity
							style={profileStyles.editPill}
							onPress={() => openEditSheet('name')}
						>
							<Ionicons name='create-outline' size={16} color={COLORS.white} />
							<Text style={profileStyles.editPillText}>Edit</Text>
						</TouchableOpacity>
					</View>

					<View style={profileStyles.editRow}>
						<View style={{ flex: 1 }}>
							<Text style={profileStyles.fieldLabel}>Email address</Text>
							<Text style={profileStyles.fieldValue}>{email || 'Add email'}</Text>
						</View>
						<TouchableOpacity
							style={profileStyles.editPill}
							onPress={() => openEditSheet('email')}
						>
							<Ionicons name='mail-outline' size={16} color={COLORS.white} />
							<Text style={profileStyles.editPillText}>Edit</Text>
						</TouchableOpacity>
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
						<TouchableOpacity
							style={[
								profileStyles.button,
								profileStyles.primaryButton,
								!canSave && { opacity: 0.5 },
							]}
							onPress={handleUpdateProfile}
							disabled={!canSave}
						>
							{isSaving ? (
								<ActivityIndicator color={COLORS.white} />
							) : (
								<Text style={profileStyles.buttonText}>Save changes</Text>
							)}
						</TouchableOpacity>
					</View>

					<Text style={profileStyles.formFooterText}>
						Edits happen in bottom sheets so you can focus field-by-field, then
						use Save changes to sync them securely.
					</Text>
				</Animated.View>
			</AnimatedScrollView>

			<RecipeBottomSheet
				isVisible={Boolean(activeEditField)}
				isLoading={false}
				onClose={closeEditSheet}
				title={sheetTitle}
			>
				<View style={profileStyles.sheetContent}>
					<Text style={profileStyles.sheetLabel}>
						{activeEditField === 'name' ? 'Full name' : 'Email address'}
					</Text>
					<TextInput
						value={draftValue}
						onChangeText={setDraftValue}
						placeholder={sheetPlaceholder}
						placeholderTextColor='rgba(0,0,0,0.4)'
						style={[
							profileStyles.sheetInput,
							activeEditField === 'email' && !emailRegex.test(draftValue.trim())
								? { borderColor: 'rgba(255,87,87,0.4)' }
								: null,
						]}
						autoCapitalize={activeEditField === 'email' ? 'none' : 'words'}
						keyboardType={
							activeEditField === 'email' ? 'email-address' : 'default'
						}
					/>
					{editError && (
						<Text style={profileStyles.sheetError}>{editError}</Text>
					)}

					<View style={profileStyles.sheetActions}>
						<TouchableOpacity
							style={[profileStyles.sheetButton, profileStyles.sheetGhostButton]}
							onPress={closeEditSheet}
						>
							<Text style={profileStyles.sheetButtonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[profileStyles.sheetButton, profileStyles.sheetPrimaryButton]}
							onPress={handleApplyDraft}
						>
							<Text style={profileStyles.sheetButtonText}>Apply</Text>
						</TouchableOpacity>
					</View>
				</View>
			</RecipeBottomSheet>
		</SafeScreen>
	);
};

export default ProfileScreen;

