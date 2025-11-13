import React, { useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const { height: screenHeight } = Dimensions.get('window');

interface RecipeBottomSheetProps {
  isVisible: boolean;
  isLoading: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title?: string;
}

export default function RecipeBottomSheet({
  isVisible,
  isLoading,
  onClose,
  children,
  title = 'Recipe Result',
}: RecipeBottomSheetProps) {
  const translateY = useSharedValue(screenHeight);
  const context = useSharedValue({ y: 0 });
  const opacity = useSharedValue(0);

  // Calculate heights
  const loadingHeight = screenHeight * 0.3; // 30% for loading state
  const fullHeight = screenHeight * 0.9; // 90% for full content (leaving some space at top)
  const targetHeight = isLoading ? loadingHeight : fullHeight;

  useEffect(() => {
    if (isVisible) {
      // Show the bottom sheet
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(screenHeight - targetHeight, {
        damping: 50,
        stiffness: 300,
      });
    } else {
      // Hide the bottom sheet
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withSpring(screenHeight, {
        damping: 50,
        stiffness: 300,
      });
    }
  }, [isVisible, targetHeight, opacity, translateY]);

  // Update height when loading state changes
  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(screenHeight - targetHeight, {
        damping: 50,
        stiffness: 300,
      });
    }
  }, [isLoading, targetHeight, isVisible, translateY]);

  const pan = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      const newTranslateY = context.value.y + event.translationY;
      // Only allow dragging down
      if (newTranslateY >= screenHeight - fullHeight) {
        translateY.value = newTranslateY;
      }
    })
    .onEnd((event) => {
      const currentHeight = screenHeight - translateY.value;
      const velocityThreshold = 500;
      const positionThreshold = isLoading ? loadingHeight * 0.5 : fullHeight * 0.3;

      if (event.velocityY > velocityThreshold || currentHeight < positionThreshold) {
        // Close the bottom sheet
        translateY.value = withSpring(screenHeight, {
          damping: 50,
          stiffness: 300,
        });
        opacity.value = withTiming(0, { duration: 300 });
        runOnJS(onClose)();
      } else {
        // Snap back to appropriate position
        translateY.value = withSpring(screenHeight - targetHeight, {
          damping: 50,
          stiffness: 300,
        });
      }
    });

  const bottomSheetAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handleBackdropPress = () => {
    onClose();
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
        <Pressable style={styles.backdropPressable} onPress={handleBackdropPress} />
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.bottomSheet, bottomSheetAnimatedStyle]}>
          {/* Handle Bar */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {children}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropPressable: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: screenHeight,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.textLight,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});