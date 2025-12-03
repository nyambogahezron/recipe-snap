import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { ArrowRight } from "lucide-react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function Welcome() {
  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  const scaleAnim = useSharedValue(0.8);
  const rotateAnim = useSharedValue(-10);

  // Individual text animation values
  const text1Opacity = useSharedValue(0);
  const text1TranslateY = useSharedValue(30);
  const text2Opacity = useSharedValue(0);
  const text2TranslateY = useSharedValue(30);
  const text3Opacity = useSharedValue(0);
  const text3TranslateY = useSharedValue(30);
  const text4Opacity = useSharedValue(0);
  const text4TranslateY = useSharedValue(30);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 15 });
    scaleAnim.value = withSpring(1, { damping: 12 });
    rotateAnim.value = withSpring(0, { damping: 15 });

    // Staggered text animations
    setTimeout(() => {
      text1Opacity.value = withTiming(1, { duration: 600 });
      text1TranslateY.value = withSpring(0, { damping: 15 });
    }, 300);

    setTimeout(() => {
      text2Opacity.value = withTiming(1, { duration: 600 });
      text2TranslateY.value = withSpring(0, { damping: 15 });
    }, 500);

    setTimeout(() => {
      text3Opacity.value = withTiming(1, { duration: 600 });
      text3TranslateY.value = withSpring(0, { damping: 15 });
    }, 700);

    setTimeout(() => {
      text4Opacity.value = withTiming(1, { duration: 600 });
      text4TranslateY.value = withSpring(0, { damping: 15 });
    }, 900);
  }, [
    fadeAnim,
    rotateAnim,
    scaleAnim,
    slideAnim,
    text1Opacity,
    text1TranslateY,
    text2Opacity,
    text2TranslateY,
    text3Opacity,
    text3TranslateY,
    text4Opacity,
    text4TranslateY,
  ]);

  // Individual text animated styles
  const text1Style = useAnimatedStyle(() => ({
    opacity: text1Opacity.value,
    transform: [{ translateY: text1TranslateY.value }],
  }));

  const text2Style = useAnimatedStyle(() => ({
    opacity: text2Opacity.value,
    transform: [{ translateY: text2TranslateY.value }],
  }));

  const text3Style = useAnimatedStyle(() => ({
    opacity: text3Opacity.value,
    transform: [{ translateY: text3TranslateY.value }],
  }));

  const text4Style = useAnimatedStyle(() => ({
    opacity: text4Opacity.value,
    transform: [{ translateY: text4TranslateY.value }],
  }));

  const heroImageStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [
      { scale: scaleAnim.value },
      { rotate: `${rotateAnim.value}deg` },
    ],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <BlurView intensity={40} style={{ ...StyleSheet.absoluteFillObject }}>
        <Image
          source={require("@/assets/images/bg1.jpeg")}
          style={styles.backgroundImage}
          blurRadius={20}
        />

        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />

        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Animated.Text style={[styles.heroTitle, text1Style]}>
              Delicious
            </Animated.Text>
            <Animated.Text style={[styles.heroTitle, text2Style]}>
              Food is Waiting
            </Animated.Text>
            <Animated.Text style={[styles.heroTitle, text3Style]}>
              For you
            </Animated.Text>
            <Animated.Text style={[styles.heroSubtitle, text4Style]}>
              Recipe • Nutrition • AI-Powered
            </Animated.Text>
            <TouchableOpacity
              style={styles.viewMenuButton}
              activeOpacity={0.8}
              onPress={() => router.push("/(tabs)")}
            >
              <Text style={styles.viewMenuText}>Get Started</Text>
              <ArrowRight size={20} color="#fff" style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>

          <Animated.View style={[styles.heroImageContainer, heroImageStyle]}>
            <View style={styles.foodPlate}>
              <Image
                source={require("@/assets/images/food.jpeg")}
                style={{ width: 200, height: 200, borderRadius: 100 }}
              />
            </View>
            <View style={[styles.floatingItem, { top: -20, right: 20 }]}>
              <Text style={styles.floatingEmoji}>🍅</Text>
            </View>
            <Animated.View
              style={[
                styles.floatingItem,
                {
                  bottom: 0,
                  left: 20,
                  animationName: {
                    "100%": {
                      transform: [{ translateX: 100 }],
                    },
                  },
                  animationDuration: "300ms",
                },
              ]}
            >
              <Animated.Text style={styles.floatingEmoji}>🥬</Animated.Text>
            </Animated.View>
          </Animated.View>
        </View>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    width: width,
    backgroundColor: COLORS.background,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    opacity: 0.7,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    zIndex: 1,
  },
  heroSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 60,
    paddingTop: 100,
    zIndex: 2,
    justifyContent: "center",
  },
  heroContent: {
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 54,
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily: FONTS.mono,
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  viewMenuButton: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
  },
  viewMenuText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
    fontFamily: FONTS.mono,
  },
  arrowIcon: {
    marginLeft: 4,
  },
  heroImageContainer: {
    alignItems: "center",
    position: "relative",
    marginTop: 20,
  },
  foodPlate: {
    width: 280,
    height: 280,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingItem: {
    position: "absolute",
  },
  floatingEmoji: {
    fontSize: 40,
  },
});
