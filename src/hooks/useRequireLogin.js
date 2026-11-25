import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { AUTH_ROUTE } from "../constants/tabs";

// الزائر مينفعش يضيف للسلة أو للمفضلة: بيطلعله رسالة وزرار يوديه لتسجيل الدخول
// الاستخدام: const requireLogin = useRequireLogin();  requireLogin(() => { ...الإجراء... })
export default function useRequireLogin() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  return (action) => {
    if (token) {
      action();
      return true;
    }
    Alert.alert("تسجيل الدخول", "رجاء قم بتسجيل الدخول", [
      { text: "إلغاء", style: "cancel" },
      { text: "تسجيل الدخول", onPress: () => router.push(AUTH_ROUTE) },
    ]);
    return false;
  };
}
