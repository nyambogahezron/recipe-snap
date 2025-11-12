import React, { createContext, useContext, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/fonts';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface AlertConfig {
	type: AlertType;
	title: string;
	message?: string;
	duration?: number;
	onPress?: () => void;
}

interface AlertContextType {
	showAlert: (config: AlertConfig) => void;
	hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
	const context = useContext(AlertContext);
	if (!context) {
		throw new Error('useAlert must be used within an AlertProvider');
	}
	return context;
};

const { width: screenWidth } = Dimensions.get('window');

interface AlertComponentProps {
	config: AlertConfig | null;
	onHide: () => void;
}

const AlertComponent: React.FC<AlertComponentProps> = ({ config, onHide }) => {
	const slideAnim = useRef(new Animated.Value(-100)).current;
	const opacityAnim = useRef(new Animated.Value(0)).current;

	React.useEffect(() => {
		if (config) {
			// Show animation
			Animated.parallel([
				Animated.timing(slideAnim, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(opacityAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();

			// Auto hide after duration
			const timer = setTimeout(() => {
				hideAlert();
			}, config.duration || 3000);

			return () => clearTimeout(timer);
		} else {
			hideAlert();
		}
	}, [config]);

	const hideAlert = () => {
		Animated.parallel([
			Animated.timing(slideAnim, {
				toValue: -100,
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.timing(opacityAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}),
		]).start(() => {
			onHide();
		});
	};

	if (!config) return null;

	const getAlertStyle = () => {
		switch (config.type) {
			case 'success':
				return {
					backgroundColor: '#4CAF50',
					iconName: 'checkmark-circle-outline' as const,
				};
			case 'error':
				return {
					backgroundColor: '#F44336',
					iconName: 'close-circle-outline' as const,
				};
			case 'warning':
				return {
					backgroundColor: '#FF9800',
					iconName: 'warning-outline' as const,
				};
			case 'info':
			default:
				return {
					backgroundColor: '#2196F3',
					iconName: 'information-circle-outline' as const,
				};
		}
	};

	const alertStyle = getAlertStyle();

	return (
		<Animated.View
			style={[
				styles.alertContainer,
				{
					backgroundColor: alertStyle.backgroundColor,
					transform: [{ translateY: slideAnim }],
					opacity: opacityAnim,
				},
			]}
		>
			<View style={styles.alertContent}>
				<Ionicons
					name={alertStyle.iconName}
					size={24}
					color={COLORS.white}
					style={styles.alertIcon}
				/>
				<View style={styles.alertText}>
					<Text style={styles.alertTitle}>{config.title}</Text>
					{config.message && (
						<Text style={styles.alertMessage}>{config.message}</Text>
					)}
				</View>
			</View>
		</Animated.View>
	);
};

interface AlertProviderProps {
	children: React.ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
	const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);

	const showAlert = (config: AlertConfig) => {
		setAlertConfig(config);
	};

	const hideAlert = () => {
		setAlertConfig(null);
	};

	return (
		<AlertContext.Provider value={{ showAlert, hideAlert }}>
			{children}
			<View style={styles.alertOverlay} pointerEvents='none'>
				<AlertComponent config={alertConfig} onHide={hideAlert} />
			</View>
		</AlertContext.Provider>
	);
};

const styles = StyleSheet.create({
	alertOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 1000,
		pointerEvents: 'none',
	},
	alertContainer: {
		marginHorizontal: 16,
		marginTop: 60, // Account for status bar and notch
		borderRadius: 12,
		shadowColor: COLORS.shadow,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	alertContent: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
	},
	alertIcon: {
		marginRight: 12,
	},
	alertText: {
		flex: 1,
	},
	alertTitle: {
		fontSize: 16,
		fontFamily: FONTS.semibold,
		color: COLORS.white,
	},
	alertMessage: {
		fontSize: 14,
		fontFamily: FONTS.regular,
		color: COLORS.white,
		marginTop: 4,
		opacity: 0.9,
	},
});
