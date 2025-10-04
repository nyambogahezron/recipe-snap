import React, { useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import SafeScreen from '../../components/SafeScreen';
import { aiService } from '../../services/ai/aiService';
import { cacheService } from '../../services/cacheService';
import { toast } from '../../services/toastService';
import { aiStyles } from '../../assets/styles/ai.styles';
import { COLORS } from '@/constants/colors';
import {
	AIFeature,
	GenerateRecipeFromImageOutput,
	IdentifyDishFromImageOutput,
} from '../../types/ai';

export default function AIScreen() {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [results, setResults] = useState<{
		type: AIFeature;
		data: GenerateRecipeFromImageOutput | IdentifyDishFromImageOutput;
	} | null>(null);
	const [error, setError] = useState<string | null>(null);

	// For demo purposes, using a hardcoded user ID
	// In a real app, this would come from authentication
	const userId = 'user123';

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

		setIsLoading(true);
		setError(null);
		setResults(null);

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
				userId,
				recipeName: recipe.recipeName,
				ingredients: recipe.ingredients,
				instructions: recipe.instructions,
				imageData: base64Data,
				imageMimeType: mimeType,
			});

			if (saveResponse.success) {
				toast.success(
					'Recipe saved successfully! 🎉',
					'You can find it in your favorites.'
				);

				// Invalidate AI recipes cache to force refresh
				await cacheService.invalidateCache('AI_RECIPES', userId);
				await cacheService.invalidateCache('FAVORITES', userId);
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

	const renderResults = () => {
		if (!results) return null;

		if (results.type === 'identify-dish') {
			const data = results.data as IdentifyDishFromImageOutput;
			return (
				<View style={aiStyles.resultsContainer}>
					<Text style={aiStyles.resultTitle}>Dish Identified! 🍽️</Text>
					<Text style={aiStyles.dishName}>{data.dishName}</Text>
					<Text style={aiStyles.confidence}>
						Confidence: {Math.round(data.confidence * 100)}%
					</Text>
				</View>
			);
		} else {
			const data = results.data as GenerateRecipeFromImageOutput;
			return (
				<View style={aiStyles.resultsContainer}>
					<Text style={aiStyles.resultTitle}>Recipe Generated! 👨‍🍳</Text>
					<Text style={aiStyles.recipeName}>{data.recipeName}</Text>

					<Text style={aiStyles.sectionTitle}>Ingredients:</Text>
					{data.ingredients && data.ingredients.length > 0 ? (
						data.ingredients.map((ingredient, index) => (
							<Text key={index} style={aiStyles.ingredientItem}>
								• {ingredient}
							</Text>
						))
					) : (
						<Text style={aiStyles.ingredientItem}>
							No ingredients available
						</Text>
					)}

					<Text style={aiStyles.sectionTitle}>Instructions:</Text>
					{data.instructions && data.instructions.length > 0 ? (
						data.instructions.map((instruction, index) => (
							<Text key={index} style={aiStyles.instructionItem}>
								<Text style={aiStyles.instructionNumber}>{index + 1}.</Text>{' '}
								{instruction}
							</Text>
						))
					) : (
						<Text style={aiStyles.instructionItem}>
							No instructions available
						</Text>
					)}

					{/* Save Recipe Button */}
					<TouchableOpacity
						style={[
							aiStyles.actionButton,
							{
								backgroundColor: '#4CAF50', // Green color for save
								marginTop: 20,
								opacity: isSaving ? 0.7 : 1,
							},
						]}
						onPress={saveRecipe}
						disabled={isSaving}
					>
						{isSaving ? (
							<ActivityIndicator size='small' color={COLORS.white} />
						) : (
							<Ionicons name='bookmark' size={20} color={COLORS.white} />
						)}
						<Text style={aiStyles.buttonText}>
							{isSaving ? 'Saving...' : 'Save Recipe'}
						</Text>
					</TouchableOpacity>
				</View>
			);
		}
	};

	return (
		<SafeScreen>
			<ScrollView
				style={aiStyles.container}
				showsVerticalScrollIndicator={false}
			>
				<Text style={aiStyles.title}>AI Recipe Assistant</Text>
				<Text style={aiStyles.subtitle}>
					Upload or take a photo to identify dishes or generate recipes using AI
				</Text>

				<View style={aiStyles.buttonContainer}>
					<TouchableOpacity style={aiStyles.actionButton} onPress={takePhoto}>
						<Ionicons name='camera' size={24} color={COLORS.white} />
						<Text style={aiStyles.buttonText}>Take Photo</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[aiStyles.actionButton, aiStyles.secondaryButton]}
						onPress={pickImage}
					>
						<Ionicons name='images' size={24} color={COLORS.primary} />
						<Text style={[aiStyles.buttonText, aiStyles.secondaryButtonText]}>
							Choose from Gallery
						</Text>
					</TouchableOpacity>
				</View>

				{selectedImage && (
					<View style={aiStyles.imageContainer}>
						<Image
							source={{ uri: selectedImage }}
							style={aiStyles.selectedImage}
						/>

						<View
							style={[
								aiStyles.buttonContainer,
								{ marginTop: 20, marginBottom: 0 },
							]}
						>
							<TouchableOpacity
								style={aiStyles.actionButton}
								onPress={() => processImage('identify-dish')}
								disabled={isLoading}
							>
								<Ionicons name='search' size={20} color={COLORS.white} />
								<Text style={aiStyles.buttonText}>Identify Dish</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[aiStyles.actionButton, aiStyles.secondaryButton]}
								onPress={() => processImage('generate-recipe')}
								disabled={isLoading}
							>
								<Ionicons name='restaurant' size={20} color={COLORS.primary} />
								<Text
									style={[aiStyles.buttonText, aiStyles.secondaryButtonText]}
								>
									Generate Recipe
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}

				{!selectedImage && (
					<View style={aiStyles.imageContainer}>
						<View style={aiStyles.imagePlaceholder}>
							<Ionicons name='image' size={48} color={COLORS.textLight} />
							<Text style={aiStyles.placeholderText}>
								No image selected{'\n'}Take a photo or choose from gallery
							</Text>
						</View>
					</View>
				)}

				{isLoading && (
					<View style={aiStyles.loadingContainer}>
						<ActivityIndicator size='large' color={COLORS.primary} />
						<Text style={aiStyles.loadingText}>
							{results?.type === 'identify-dish'
								? 'Identifying dish...'
								: 'Generating recipe...'}
						</Text>
					</View>
				)}

				{error && (
					<View style={aiStyles.errorContainer}>
						<Text style={aiStyles.errorText}>{error}</Text>
						<TouchableOpacity
							style={aiStyles.resetButton}
							onPress={resetScreen}
						>
							<Text style={aiStyles.resetButtonText}>Try Again</Text>
						</TouchableOpacity>
					</View>
				)}

				{renderResults()}

				{(selectedImage || results || error) && (
					<TouchableOpacity style={aiStyles.resetButton} onPress={resetScreen}>
						<Text style={aiStyles.resetButtonText}>Start Over</Text>
					</TouchableOpacity>
				)}
			</ScrollView>
		</SafeScreen>
	);
}
