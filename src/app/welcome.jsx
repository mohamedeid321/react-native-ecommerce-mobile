import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts, ArefRuqaa_700Bold } from "@expo-google-fonts/aref-ruqaa";
import COLORS from "../constants/colors";
import { ROW } from "../constants/layout";
import { markWelcomeSeen } from "../utils/welcome";

// حط الصورة هنا: src/assets/images/get-started.png
const HERO = require("../assets/images/get-started.png");

const { height } = Dimensions.get("window");

// شاشة البداية: بتظهر أول مرة، وبعد أي تسجيل خروج
export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({ ArefRuqaa_700Bold });

  const go = async (action) => {
    await markWelcomeSeen();
    action();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[COLORS.gradientTop, COLORS.gradientBottom]}
        locations={[0, 0.62]}
        style={StyleSheet.absoluteFill}
      />

      {/* الصورة */}
      <View style={[styles.imageBox, { paddingTop: insets.top + 30 }]}>
        <Image source={HERO} style={styles.image} resizeMode="contain" />
      </View>

      {/* الاسم + الوصف */}
      <View style={styles.textBox}>
        <Text
          style={[
            styles.appName,
            fontsLoaded && { fontFamily: "ArefRuqaa_700Bold" },
          ]}
        >
          لقطة
        </Text>
        <Text style={styles.description}>
          طازج، سريع، وبسعر لقطة{"\n"}فاكهتك وخضارك توصلك لحد بيتك
        </Text>
      </View>

      {/* الأزرار */}
      <View style={[styles.actions, { paddingBottom: insets.bottom + 24 }]}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => go(() => router.push("/(auth)"))}
        >
          <Text style={styles.primaryText}>تسجيل الدخول</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.85}
          onPress={() => go(() => router.push("/(auth)/signup"))}
        >
          <Text style={styles.secondaryText}>إنشاء حساب</Text>
        </TouchableOpacity>

        {/* دخول كضيف: كلام + سهم مش زرار */}
        <TouchableOpacity
          style={styles.guestRow}
          activeOpacity={0.6}
          onPress={() => go(() => router.replace("/(tabs)"))}
        >
          <Text style={styles.guestText}>
            الدخول كـ <Text style={styles.guestWord}>ضيف</Text>
          </Text>
          <Ionicons name="arrow-back" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gradientBottom },
  imageBox: {
    flex: 1.25,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  image: {
    marginLeft: 55,
    width: "130%",
    height: "130%",
    maxHeight: height * 0.62,
  },
  textBox: { alignItems: "center", paddingHorizontal: 28, paddingTop: 8 },
  appName: {
    fontSize: 54,
    lineHeight: 78,
    color: COLORS.primary,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginTop: 4,
  },
  actions: { paddingHorizontal: 28, paddingTop: 28, gap: 12 },
  primaryButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryText: { color: COLORS.white, fontSize: 17, fontWeight: "800" },
  secondaryButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#dfe5e1",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryText: { color: COLORS.textDark, fontSize: 17, fontWeight: "800" },
  guestRow: {
    flexDirection: ROW,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
  },
  guestText: { fontSize: 15, color: COLORS.textSecondary, fontWeight: "600" },
  guestWord: { color: COLORS.primary, fontWeight: "800" },
});
