import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/auth.styles";

// إطار شاشات الدخول والتسجيل: تدرج أخضر → أبيض + هيدر + كارت للحقول
export default function AuthScreen({
  title,
  subtitle,
  illustration,
  illustrationStyle,
  topPadding = 10,
  children,
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const goBack = () =>
    router.canGoBack() ? router.back() : router.replace("/welcome");

  return (
    <View style={styles.flex}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[COLORS.gradientTop, COLORS.gradientBottom]}
        locations={[0, 0.7]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[styles.header, { paddingTop: insets.top + topPadding }]}
          >
            <TouchableOpacity
              style={[styles.backButton, { top: insets.top + 8 }]}
              onPress={goBack}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={22} color={COLORS.textDark} />
            </TouchableOpacity>

            {!!illustration && (
              <Image
                source={illustration}
                style={[styles.illustration, illustrationStyle]}
                resizeMode="contain"
              />
            )}
            <Text style={styles.headerTitle}>{title}</Text>
            {!!subtitle && (
              <Text style={styles.headerSubtitle}>{subtitle}</Text>
            )}
          </View>

          <View style={styles.card}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
