import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  View,
  Image,
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
  validateUsername,
  translateAuthError,
} from "../../utils/validation";

// تحكم في الشكل من هنا:
const TOP_PADDING = 56; // المسافة من فوق لحد كلمة "إنشاء حساب جديد" (بتحرك كل العناصر)
const IMAGE_WIDTH = "100%"; // عرض الصورة اللي تحت
const IMAGE_HEIGHT = 300; // ارتفاع الصورة اللي تحت

// إنشاء حساب (عربي، من اليمين للشمال) — الإيميل لازم يكون فيه @ وشكله حقيقي
export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({});
  const { isLoading, register } = useAuthStore();

  const errors = {
    username: validateUsername(username),
    email: validateEmail(email),
    password: validatePassword(password),
  };
  const show = (field) => (touched[field] ? errors[field] : null);
  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const handleSignUp = async () => {
    setTouched({ username: true, email: true, password: true });
    if (errors.username || errors.email || errors.password) return;

    const result = await register(
      username.trim(),
      normalizeEmail(email),
      password,
    );
    if (!result.success) {
      Alert.alert("تعذر إنشاء الحساب", translateAuthError(result.error));
      return;
    }
    markWelcomeSeen();
  };

  return (
    <AuthScreen
      title="إنشاء حساب جديد"
      subtitle="انضم للقطة واطلب فواكهك وخضارك بأسعار لقطة"
      topPadding={TOP_PADDING}
    >
      <AuthField
        label="الاسم"
        icon="person-outline"
        placeholder="اكتب اسمك هنا"
        value={username}
        onChangeText={setUsername}
        onBlur={() => touch("username")}
        error={show("username")}
        autoCapitalize="words"
        autoComplete="name"
        returnKeyType="next"
      />

      <AuthField
        label="البريد الإلكتروني"
        icon="mail-outline"
        placeholder="email@gmail.com"
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
        placeholder="6 أحرف على الأقل"
        value={password}
        onChangeText={setPassword}
        onBlur={() => touch("password")}
        error={show("password")}
        secure
        autoComplete="new-password"
        returnKeyType="done"
        onSubmitEditing={handleSignUp}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && { opacity: 0.7 }]}
        onPress={handleSignUp}
        disabled={isLoading}
        activeOpacity={0.85}
      >
        {isLoading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>إنشاء حساب</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>لديك حساب بالفعل؟</Text>
        <TouchableOpacity
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/")
          }
        >
          <Text style={styles.link}>تسجيل الدخول</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={require("../../assets/images/signup-image.png")}
        style={{
          width: IMAGE_WIDTH,
          height: IMAGE_HEIGHT,
          alignSelf: "center",
          marginTop: 24,
        }}
        resizeMode="contain"
      />
    </AuthScreen>
  );
}
