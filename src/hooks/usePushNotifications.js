import { useEffect } from "react";
import { Platform } from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_URL } from "../constants/api";
import { useAuthStore } from "../store/authStore";
import useNotificationsStore from "../store/notificationsStore";
import { authHeaders } from "../utils/api";

// الإشعارات الخارجية (push) مش بتشتغل في Expo Go على أندرويد، بتشتغل في الـ APK / development build
// عشان كده بنحمّل expo-notifications بس لو مش داخل Expo Go
const IS_EXPO_GO = Constants.executionEnvironment === "storeClient";
const Notifications = IS_EXPO_GO ? null : require("expo-notifications");
const TOKEN_KEY = "push_token";

if (Notifications) {
  // الإشعار يظهر حتى والتطبيق مفتوح
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// بيسجّل جهاز المستخدم في الباك بعد تسجيل الدخول
async function registerForPush() {
  if (!Notifications) return;
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "الإشعارات",
        importance: Notifications.AndroidImportance.HIGH,
        lightColor: "#2f5d3a",
      });
    }
    let { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") ({ status } = await Notifications.requestPermissionsAsync());
    if (status !== "granted") return;

    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    const { data: pushToken } = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );

    await axios.post(
      `${API_URL}/notifications/token`,
      { token: pushToken, platform: Platform.OS },
      { headers: authHeaders() },
    );
    await AsyncStorage.setItem(TOKEN_KEY, pushToken);
  } catch (error) {
    console.log("push registration failed:", error.message);
  }
}

// بيمسح توكن الجهاز من الباك (نادّيه قبل تسجيل الخروج)
export async function unregisterPush() {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) return;
    await axios.post(`${API_URL}/notifications/token/remove`, { token }, { headers: authHeaders() });
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.log("push unregister failed:", error.message);
  }
}

// استخدمه مرة واحدة في app/_layout.jsx
// ready = التطبيق خلّص التحقق من تسجيل الدخول
export default function usePushNotifications(ready) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);

  // تسجيل الجهاز بعد الدخول
  useEffect(() => {
    if (token) registerForPush();
  }, [token]);

  // فتح الطلب لما المستخدم يضغط على الإشعار
  useEffect(() => {
    if (!Notifications || !ready) return;

    const open = (response) => {
      const data = response?.notification?.request?.content?.data;
      if (!data?.orderId || !useAuthStore.getState().token) return;
      const isAdmin = useAuthStore.getState().user?.role === "admin";
      router.push({
        pathname: isAdmin ? "/admin-order/[id]" : "/order/[id]",
        params: { id: data.orderId },
      });
    };

    // التطبيق كان مقفول وفتح من إشعار
    const last = Notifications.getLastNotificationResponse?.();
    if (last) open(last);

    // إشعار وصل والتطبيق مفتوح: نحدّث العداد
    const received = Notifications.addNotificationReceivedListener(() => {
      if (useAuthStore.getState().token) useNotificationsStore.getState().fetch();
    });
    const tapped = Notifications.addNotificationResponseReceivedListener(open);

    return () => {
      received.remove();
      tapped.remove();
    };
  }, [ready, role]);
}
