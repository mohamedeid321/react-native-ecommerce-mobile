import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { SCREEN_PADDING } from "../constants/layout";

// حط الصورة هنا: src/assets/images/confirm-order.png
const CONFIRM_IMAGE = require("../assets/images/confirm-order.png");

// شاشة "تم استلام طلبك" بعد تأكيد الطلب
export default function OrderSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={CONFIRM_IMAGE} style={styles.image} />
        <Text style={styles.title}>تم استلام طلبك!</Text>
        <Text style={styles.message}>سنقوم بتجهيز طلبك في أقرب وقت ونبقيك بالتحديثات.</Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.buttonText}>العودة للرئيسية</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/orders")}>
          <Text style={styles.link}>يمكنك تتبع طلبك من صفحة الطلبات</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SCREEN_PADDING + 12,
  },
  image: { width: 260, height: 260, resizeMode: "contain" },
  title: { fontSize: 30, fontWeight: "900", color: COLORS.primary, marginTop: 12, textAlign: "center" },
  message: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 26,
  },
  footer: { paddingHorizontal: SCREEN_PADDING + 4, alignItems: "center" },
  button: {
    width: "100%",
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: COLORS.white, fontSize: 17, fontWeight: "800" },
  link: { color: COLORS.textSecondary, fontSize: 13, marginTop: 14 },
});
