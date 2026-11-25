import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import styles from "../../assets/styles/auth.styles";
import COLORS from "../../constants/colors";
import { useAuthStore } from "../../store/authStore";
import AuthScreen from "../../components/auth/AuthScreen";
import AuthField from "../../components/auth/AuthField";
import { markWelcomeSeen } from "../../utils/welcome";
import {
  normalizeEmail,
  validateEmail,
  validatePassword,
  translateAuthError,
} from "../../utils/validation";

// حجم الصورة: غيّر الرقمين دول بس (العرض والارتفاع)
const IMAGE_WIDTH = "100%";
const IMAGE_HEIGHT = 300;

// تسجيل الدخول (عربي، من اليمين للشمال)
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({});
  const { isLoading, login, isCheckingAuth } = useAuthStore();

  const errors = {
    email: validateEmail(email),
    // في الدخول مش بنفرض طول معين، بس لازم تكون مكتوبة
    password: password ? null : "اكتب كلمة المرور",
  };
  const show = (field) => (touched[field] ? errors[field] : null);
  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const handleLogin = async () => {
    setTouched({ email: true, password: true });
    if (errors.email || errors.password) return;

    const result = await login(normalizeEmail(email), password);
    if (!result.success) {
      Alert.alert("تعذر تسجيل الدخول", translateAuthError(result.error));
      return;
    }
    markWelcomeSeen();
  };

  if (isCheckingAuth) return null;

  return (
    <AuthScreen
      title="خش الحق الكميه هتخلص"
      subtitle="سجّل دخولك والحق العروض وألقطها بسرعة"
      illustration={require("../../assets/images/auth-image.png")}
      illustrationStyle={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
    >
      <AuthField
        label="البريد الإلكتروني"
        icon="mail-outline"
        placeholder="eamil@gmail.com"
        value={email}
        onChangeText={setEmail}
        onBlur={() => touch("email")}
        error={show("email")}
        keyboardType="email-address"
        autoComplete="email"
        returnKeyType="next"
      />

      <AuthField
        label="كلمة المرور"
        icon="lock-closed-outline"
        placeholder="اكتب كلمة المرور"
        value={password}
        onChangeText={setPassword}
        onBlur={() => touch("password")}
        error={show("password")}
        secure
        autoComplete="password"
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={isLoading}
        activeOpacity={0.85}
      >
        {isLoading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>تسجيل الدخول</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>ليس لديك حساب؟</Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.link}>إنشاء حساب</Text>
        </TouchableOpacity>
      </View>
    </AuthScreen>
  );
}
