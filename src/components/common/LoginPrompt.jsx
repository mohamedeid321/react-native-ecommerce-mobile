import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import COLORS from "../../constants/colors";
import { AUTH_ROUTE } from "../../constants/tabs";

// شاشة الزائر في السلة والطلبات: بتطلب منه تسجيل الدخول
export default function LoginPrompt({ icon = "lock-closed-outline", title, message }) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={44} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message || "رجاء قم بتسجيل الدخول"}</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push(AUTH_ROUTE)}>
        <Text style={styles.buttonText}>تسجيل الدخول</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "800", color: COLORS.textDark, textAlign: "center" },
  message: { fontSize: 15, color: COLORS.textSecondary, marginTop: 8, textAlign: "center" },
  button: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
  },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: "800" },
});
