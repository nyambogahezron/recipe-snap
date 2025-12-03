import { aiStyles } from '@/assets/styles/ai.styles';
import SafeScreen from '@/components/SafeScreen';
import RecipeBottomSheet from '@/components/RecipeBottomSheet';
import RecipeLoading from '@/components/RecipeLoading';
import RecipeResults from '@/components/RecipeResults';
import { COLORS } from '@/constants/colors';
import { GUEST_USER_ID } from '@/constants/guestUser';
import { aiService } from '@/services/ai/aiService';
import { cacheService } from '@/services/cacheService';
import { toast } from '@/services/toastService';
import {
	AIFeature,
	GenerateRecipeFromImageOutput,
	IdentifyDishFromImageOutput,
} from '@/types/ai';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

export default function AIScreen() {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [results, setResults] = useState<{
		type: AIFeature;
		data: GenerateRecipeFromImageOutput | IdentifyDishFromImageOutput;
	} | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [showBottomSheet, setShowBottomSheet] = useState(false);
	const [currentFeature, setCurrentFeature] = useState<AIFeature | null>(null);

	const requestCameraPermissions = async () => {
		const { status } = await ImagePicker.requestCameraPermissionsAsync();
		if (status !== 'granted') {
			toast.warning(
				'Permission Required',
				'Camera permission is required to take photos. Please enable it in your device settings.'
			);
			return false;
		}
		return true;
	};

	const requestMediaLibraryPermissions = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			toast.warning(
				'Permission Required',
				'Media library permission is required to select photos. Please enable it in your device settings.'
			);
			return false;
		}
		return true;
	};

	const takePhoto = async () => {
		try {
			const hasPermission = await requestCameraPermissions();
			if (!hasPermission) return;

			const result = await ImagePicker.launchCameraAsync({
				mediaTypes: 'images' as ImagePicker.MediaType,
				allowsEditing: true,
				aspect: [1, 1] as [number, number],
				quality: 0.7,
			});

			if (!result.canceled && result.assets[0]) {
				setSelectedImage(result.assets[0].uri);
				setResults(null);
				setError(null);
			}
		} catch (error) {
			console.error('Error taking photo:', error);
			toast.error('Failed to take photo', 'Please try again.');
		}
	};

	const pickImage = async () => {
		try {
			const hasPermission = await requestMediaLibraryPermissions();
			if (!hasPermission) return;

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: 'images' as ImagePicker.MediaType,
				allowsEditing: true,
				aspect: [1, 1] as [number, number],
				quality: 0.7,
			});

			if (!result.canceled && result.assets[0]) {
				setSelectedImage(result.assets[0].uri);
				setResults(null);
				setError(null);
			}
		} catch (error) {
			console.error('Error picking image:', error);
			toast.error('Failed to select image', 'Please try again.');
		}
	};

	const processImage = async (feature: AIFeature) => {
		if (!selectedImage) {
			toast.warning('No Image', 'Please select or take a photo first.');
			return;
		}

		setCurrentFeature(feature);
		setIsLoading(true);
		setError(null);
		setResults(null);
		setShowBottomSheet(true);

		try {
			// Convert image to data URI
			const dataUri = await aiService.convertImageToDataUri(selectedImage);

			let response;
			if (feature === 'identify-dish') {
				response = await aiService.identifyDishFromImage({
					photoDataUri: dataUri,
				});
			} else {
				response = await aiService.generateRecipeFromImage({
					photoDataUri: dataUri,
				});
			}

			if (response.success && response.data) {
				setResults({ type: feature, data: response.data });
			} else {
				setError(response.error || 'An unexpected error occurred');
			}
		} catch (error) {
			console.error('Error processing image:', error);
			setError('Failed to process image. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const resetScreen = () => {
		setSelectedImage(null);
		setResults(null);
		setError(null);
		setShowBottomSheet(false);
		setCurrentFeature(null);
	};

	const closeBottomSheet = () => {
		setShowBottomSheet(false);
		setIsLoading(false);
		setError(null);
	};

	const saveRecipe = async () => {
		if (!results || !selectedImage || results.type !== 'generate-recipe') {
			toast.error('No recipe to save', 'Please generate a recipe first');
			return;
		}

		setIsSaving(true);

		try {
			// Convert image to data URI
			const dataUri = await aiService.convertImageToDataUri(selectedImage);

			// Extract base64 data and MIME type from data URI
			const [header, base64Data] = dataUri.split(',');
			const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/jpeg';

			const recipe = results.data as GenerateRecipeFromImageOutput;

			const saveResponse = await aiService.saveAIRecipe({
				userId: GUEST_USER_ID,
				recipeName: recipe.recipeName,
				ingredients: recipe.ingredients,
				instructions: recipe.instructions,
				imageData: base64Data,
				imageMimeType: mimeType,
			});

			if (saveResponse.success) {
				toast.success(
					'Recipe saved successfully!',
					'You can find it in your favorites.'
				);

				// Invalidate AI recipes cache to force refresh
				await cacheService.invalidateCache('AI_RECIPES', GUEST_USER_ID);
				await cacheService.invalidateCache('FAVORITES', GUEST_USER_ID);
			} else {
				throw new Error(saveResponse.error || 'Failed to save recipe');
			}
		} catch (error) {
			console.error('Error saving recipe:', error);
			toast.error('Failed to save recipe', 'Please try again later');
		} finally {
			setIsSaving(false);
		}
	};


	return (
		<SafeScreen>
			<ScrollView
				style={aiStyles.container}
				contentContainerStyle={aiStyles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={aiStyles.surfaceCard}>
					<View style={aiStyles.commandRow}>
						<TouchableOpacity style={aiStyles.primaryButton} onPress={takePhoto}>
							<Ionicons name='camera' size={18} color={COLORS.white} />
							<Text style={aiStyles.primaryButtonText}>Capture photo</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[aiStyles.primaryButton, aiStyles.ghostButton]}
							onPress={pickImage}
						>
							<Ionicons name='images' size={18} color={COLORS.white} />
							<Text style={aiStyles.primaryButtonText}>Choose gallery</Text>
						</TouchableOpacity>
					</View>

					<View style={aiStyles.previewShell}>
						{selectedImage ? (
							<Image
								source={{ uri: selectedImage }}
								style={aiStyles.previewImage}
							/>
						) : (
							<View style={aiStyles.dropzone}>
								<Ionicons name='cloud-upload-outline' size={32} color={COLORS.text} />
								<Text style={aiStyles.dropzoneTitle}>Awaiting your photo</Text>
								<Text style={aiStyles.dropzoneSubtitle}>
									Add a dish snapshot to unlock AI actions below.
								</Text>
							</View>
						)}
					</View>

					{selectedImage && (
						<TouchableOpacity
							style={aiStyles.resetGhostButton}
							onPress={resetScreen}
						>
							<Ionicons name='close-circle' size={16} color={COLORS.text} />
							<Text style={aiStyles.resetGhostText}>Remove image</Text>
						</TouchableOpacity>
					)}
				</View>

				<View style={aiStyles.surfaceCard}>
					<View style={aiStyles.cardHeader}>
						<Text style={aiStyles.cardLabel}>AI Actions</Text>
						<Text style={aiStyles.cardDescription}>
							{selectedImage
								? 'Pick a mode and the assistant responds instantly.'
								: 'Add a photo to enable the assistant modes.'}
						</Text>
					</View>

					<View style={aiStyles.featureStack}>
						<TouchableOpacity
							style={[
								aiStyles.featureButton,
								currentFeature === 'identify-dish' && aiStyles.featureButtonActive,
								(!selectedImage || isLoading) && aiStyles.featureButtonDisabled,
							]}
							onPress={() => processImage('identify-dish')}
							disabled={!selectedImage || isLoading}
						>
							<View style={aiStyles.featureIcon}>
								<Ionicons name='search' size={18} color={COLORS.white} />
							</View>
							<View style={aiStyles.featureCopy}>
								<Text style={aiStyles.featureTitle}>Identify dish</Text>
								
							</View>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								aiStyles.featureButton,
								currentFeature === 'generate-recipe' && aiStyles.featureButtonActive,
								(!selectedImage || isLoading) && aiStyles.featureButtonDisabled,
							]}
							onPress={() => processImage('generate-recipe')}
							disabled={!selectedImage || isLoading}
						>
							<View style={aiStyles.featureIcon}>
								<Ionicons name='restaurant' size={18} color={COLORS.white} />
							</View>
							<View style={aiStyles.featureCopy}>
								<Text style={aiStyles.featureTitle}>Generate recipe</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>

			<RecipeBottomSheet
				isVisible={showBottomSheet}
				isLoading={isLoading}
				onClose={closeBottomSheet}
				title={
					currentFeature === 'identify-dish'
						? 'Dish Identification'
						: 'Recipe Generation'
				}
			>
				{isLoading ? (
					<RecipeLoading
						message={
							currentFeature === 'identify-dish'
								? 'Identifying dish...'
								: 'Generating recipe...'
						}
					/>
				) : error ? (
					<View style={aiStyles.errorContainer}>
						<Text style={aiStyles.errorText}>{error}</Text>
						<TouchableOpacity
							style={aiStyles.resetButton}
							onPress={closeBottomSheet}
						>
							<Text style={aiStyles.resetButtonText}>Try Again</Text>
						</TouchableOpacity>
					</View>
				) : results ? (
					<RecipeResults
						results={results}
						onSaveRecipe={
							results.type === 'generate-recipe' ? saveRecipe : undefined
						}
						isSaving={isSaving}
					/>
				) : null}
			</RecipeBottomSheet>
		</SafeScreen>
	);
}
