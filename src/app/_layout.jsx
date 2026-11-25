import {
  Stack,
  useRouter,
  useSegments,
  useRootNavigationState,
} from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import SafeScreen from "../components/SafeScreen";
import COLORS from "../constants/colors";
import { useAuthStore } from "../store/authStore";
import useSyncUserData from "../hooks/useSyncUserData";
import usePushNotifications from "../hooks/usePushNotifications";
import { hasSeenWelcome } from "../utils/welcome";
import useAppUpdate from "../hooks/useAppUpdate";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  useAppUpdate();
  const { checkAuth, user, token, isCheckingAuth } = useAuthStore();

  // سلة / مفضلة / معلومات توصيل / طلبات العميل
  useSyncUserData();

  // إشعارات الموبايل (push): تسجيل الجهاز + فتح الطلب من الإشعار
  usePushNotifications(!isCheckingAuth);

  // لون خلفية النافذة نفسها (بيظهر تحت وفوق لو في أي فراغ)
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(COLORS.background);
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  // أول مرة يفتح التطبيق (ومش مسجل دخول): نوديه لشاشة البداية
  const navState = useRootNavigationState();
  const [welcomeChecked, setWelcomeChecked] = useState(false);
  useEffect(() => {
    if (isCheckingAuth || !navState?.key || welcomeChecked) return;
    (async () => {
      const seen = await hasSeenWelcome();
      if (!seen && !token) router.replace("/welcome");
      setWelcomeChecked(true);
    })();
  }, [isCheckingAuth, navState?.key, welcomeChecked]);

  // اللي مسجل دخول مايفضلش في شاشات الدخول
  // الزائر (guest) حر يتصفح، وبيروح للدخول بس لما يدوس تاب "تسجيل الدخول"
  useEffect(() => {
    if (isCheckingAuth) return;
    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (isSignedIn && inAuthScreen) {
      // نمسح شاشة البداية والدخول من الـ stack عشان الرجوع مايرجعش لهم
      if (router.canDismiss()) router.dismissAll();
      router.replace("/(tabs)");
    }
  }, [user, token, segments, isCheckingAuth]);

  // نستنى نعرف حالة تسجيل الدخول عشان ماتظهرش تابات الزائر للحظة
  if (isCheckingAuth) return null;

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="product/[id]" />
          <Stack.Screen name="edit-product/[id]" />
          <Stack.Screen name="delivery-info" />
          <Stack.Screen name="search-products" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="checkout" />
          <Stack.Screen
            name="order-success"
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="order/[id]" />
          <Stack.Screen name="admin-order/[id]" />
        </Stack>
        {/* غطا بسيط لحد ما نعرف هل نعرض شاشة البداية (عشان الرئيسية ماتلمعش لحظة) */}
        {!welcomeChecked && (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: COLORS.background },
            ]}
          />
        )}
      </SafeScreen>
      {/* أيقونات النوتش (الساعة والبطارية والإشعارات) غامقة على الخلفية الفاتحة */}
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
