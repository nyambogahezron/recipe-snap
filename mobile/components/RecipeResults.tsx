import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { GenerateRecipeFromImageOutput, IdentifyDishFromImageOutput, AIFeature } from '@/types/ai';

interface RecipeResultsProps {
  results: {
    type: AIFeature;
    data: GenerateRecipeFromImageOutput | IdentifyDishFromImageOutput;
  };
  onSaveRecipe?: () => void;
  isSaving?: boolean;
}

export default function RecipeResults({ results, onSaveRecipe, isSaving = false }: RecipeResultsProps) {
  if (results.type === 'identify-dish') {
		const data = results.data as IdentifyDishFromImageOutput;
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headerIcon}>🍽️</Text>
					<Text style={styles.headerTitle}>Dish Identified!</Text>
				</View>
				<Text style={styles.dishName}>{data.dishName}</Text>
				<View style={styles.confidenceContainer}>
					<Text style={styles.confidenceLabel}>Confidence:</Text>
					<Text style={styles.confidenceValue}>
						{Math.round(data.confidence * 100)}%
					</Text>
				</View>
			</View>
		);
	}

	const data = results.data as GenerateRecipeFromImageOutput;
	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.headerIcon}>👨‍🍳</Text>
				<Text style={styles.headerTitle}>Recipe Generated!</Text>
			</View>

			{/* Recipe Name */}
			<Text style={styles.recipeName}>{data.recipeName}</Text>

			{/* Ingredients */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Ingredients</Text>
				{data.ingredients && data.ingredients.length > 0 ? (
					data.ingredients.map((ingredient, index) => (
						<View key={index} style={styles.listItem}>
							<Text style={styles.listItemBullet}>•</Text>
							<Text style={styles.listItemText}>{ingredient}</Text>
						</View>
					))
				) : (
					<Text style={styles.emptyText}>No ingredients available</Text>
				)}
			</View>

			{/* Instructions */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Instructions</Text>
				{data.instructions && data.instructions.length > 0 ? (
					data.instructions.map((instruction, index) => (
						<View key={index} style={styles.instructionItem}>
							<View style={styles.stepNumber}>
								<Text style={styles.stepNumberText}>{index + 1}</Text>
							</View>
							<Text style={styles.instructionText}>{instruction}</Text>
						</View>
					))
				) : (
					<Text style={styles.emptyText}>No instructions available</Text>
				)}
			</View>

			{/* Save Button */}
			{onSaveRecipe && (
				<TouchableOpacity
					style={[styles.saveButton, isSaving && styles.savingButton]}
					onPress={onSaveRecipe}
					disabled={isSaving}
				>
					{isSaving ? (
						<ActivityIndicator size='small' color={COLORS.white} />
					) : (
						<Ionicons name='bookmark' size={20} color={COLORS.white} />
					)}
					<Text style={styles.saveButtonText}>
						{isSaving ? 'Saving...' : 'Save Recipe'}
					</Text>
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		// No flex: 1 needed since parent ScrollView handles scrolling
	},
	header: {
		alignItems: 'center',
		marginBottom: 20,
		paddingBottom: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#f0f0f0',
	},
	headerIcon: {
		fontSize: 48,
		marginBottom: 8,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: COLORS.text,
		textAlign: 'center',
	},
	dishName: {
		fontSize: 28,
		fontWeight: 'bold',
		color: COLORS.primary,
		textAlign: 'center',
		marginBottom: 16,
	},
	confidenceContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f8f9fa',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 12,
		marginTop: 16,
	},
	confidenceLabel: {
		fontSize: 16,
		color: COLORS.textLight,
		marginRight: 8,
	},
	confidenceValue: {
		fontSize: 18,
		fontWeight: 'bold',
		color: COLORS.primary,
	},
	recipeName: {
		fontSize: 28,
		fontWeight: 'bold',
		color: COLORS.primary,
		textAlign: 'center',
		marginBottom: 24,
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: COLORS.text,
		marginBottom: 12,
	},
	listItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 8,
	},
	listItemBullet: {
		fontSize: 16,
		color: COLORS.primary,
		marginRight: 12,
		marginTop: 2,
	},
	listItemText: {
		fontSize: 16,
		color: COLORS.text,
		flex: 1,
		lineHeight: 22,
	},
	instructionItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 16,
	},
	stepNumber: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: COLORS.primary,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
		marginTop: 2,
	},
	stepNumberText: {
		fontSize: 14,
		fontWeight: 'bold',
		color: COLORS.white,
	},
	instructionText: {
		fontSize: 16,
		color: COLORS.text,
		flex: 1,
		lineHeight: 22,
	},
	emptyText: {
		fontSize: 16,
		color: COLORS.textLight,
		fontStyle: 'italic',
		textAlign: 'center',
		paddingVertical: 20,
	},
	saveButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#4CAF50',
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderRadius: 12,
		marginTop: 16,
		marginBottom: 32,
	},
	savingButton: {
		opacity: 0.7,
	},
	saveButtonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: COLORS.white,
		marginLeft: 8,
	},
});