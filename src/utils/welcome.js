import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "welcome_seen";

// هل المستخدم شاف شاشة البداية قبل كده؟
export const hasSeenWelcome = async () => {
  try {
    return (await AsyncStorage.getItem(KEY)) === "1";
  } catch {
    return true; // لو فشلت القراءة ماننزلوش شاشة البداية كل مرة
  }
};

export const markWelcomeSeen = async () => {
  try {
    await AsyncStorage.setItem(KEY, "1");
  } catch {}
};
