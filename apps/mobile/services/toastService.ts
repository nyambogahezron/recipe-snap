import { Alert } from 'react-native';
import { AlertType } from '../components/AlertProvider';

export interface ToastConfig {
	type: AlertType;
	title: string;
	message?: string;
}

class ToastService {
	/**
	 * Show a success toast
	 */
	success(title: string, message?: string) {
		this.show({ type: 'success', title, message });
	}

	/**
	 * Show an error toast
	 */
	error(title: string, message?: string) {
		this.show({ type: 'error', title, message });
	}

	/**
	 * Show an info toast
	 */
	info(title: string, message?: string) {
		this.show({ type: 'info', title, message });
	}

	/**
	 * Show a warning toast
	 */
	warning(title: string, message?: string) {
		this.show({ type: 'warning', title, message });
	}

	/**
	 * Generic show method
	 */
	private show(config: ToastConfig) {
		const { title, message } = config;
		const fullMessage = message ? `${title}\n\n${message}` : title;

		Alert.alert(
			this.getAlertTitle(config.type),
			fullMessage,
			[{ text: 'OK' }],
			{ cancelable: true }
		);
	}

	/**
	 * Get alert title based on type
	 */
	private getAlertTitle(type: AlertType): string {
		switch (type) {
			case 'success':
				return '✅ Success';
			case 'error':
				return '❌ Error';
			case 'warning':
				return '⚠️ Warning';
			case 'info':
			default:
				return '💡 Info';
		}
	}

	/**
	 * Show confirmation dialog
	 */
	confirm(
		title: string,
		message: string,
		onConfirm: () => void,
		onCancel?: () => void
	) {
		Alert.alert(
			title,
			message,
			[
				{
					text: 'Cancel',
					style: 'cancel',
					onPress: onCancel,
				},
				{
					text: 'Confirm',
					style: 'default',
					onPress: onConfirm,
				},
			],
			{ cancelable: true }
		);
	}

	/**
	 * Show destructive confirmation dialog
	 */
	confirmDestructive(
		title: string,
		message: string,
		confirmText: string,
		onConfirm: () => void,
		onCancel?: () => void
	) {
		Alert.alert(
			title,
			message,
			[
				{
					text: 'Cancel',
					style: 'cancel',
					onPress: onCancel,
				},
				{
					text: confirmText,
					style: 'destructive',
					onPress: onConfirm,
				},
			],
			{ cancelable: true }
		);
	}
}

// Export singleton instance
export const toast = new ToastService();
export default toast;
