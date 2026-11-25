import { useEffect } from "react";
import { Alert, AppState } from "react-native";
import * as Updates from "expo-updates";

// بيشوف لو في تحديث جديد (OTA) وبيسأل المستخدم: تحديث / لاحقاً
// بيشتغل في النسخة المبنية بس (مش في Expo Go ولا وضع التطوير)
export default function useAppUpdate() {
  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled) return;

    let asking = false;

    const check = async () => {
      if (asking) return;
      try {
        const res = await Updates.checkForUpdateAsync();
        if (!res.isAvailable) return;

        asking = true;
        Alert.alert(
          "تحديث جديد متاح",
          "في نسخة جديدة من لقطة فيها تحسينات. تحب تحدّث دلوقتي؟",
          [
            { text: "لاحقاً", style: "cancel", onPress: () => (asking = false) },
            {
              text: "تحديث",
              onPress: async () => {
                try {
                  await Updates.fetchUpdateAsync();
                  await Updates.reloadAsync(); // بيعيد تشغيل التطبيق بالنسخة الجديدة
                } catch {
                  asking = false;
                  Alert.alert("تعذر التحديث", "حاول تاني بعد شوية");
                }
              },
            },
          ],
          { cancelable: false }
        );
      } catch {
        // مفيش نت أو سيرفر التحديثات مش متاح: نتجاهل
      }
    };

    check(); // عند فتح التطبيق
    const sub = AppState.addEventListener("change", (s) => s === "active" && check()); // وعند الرجوع له
    return () => sub.remove();
  }, []);
}
