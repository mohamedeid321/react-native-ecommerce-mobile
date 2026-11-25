import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSegments } from "expo-router";
import COLORS from "../constants/colors";

// الشاشات اللي صورتها بتبدأ من أعلى الشاشة فعلاً (تحت النوتش)
const FULL_BLEED_ROUTES = ["product", "welcome", "(auth)"];

// بيلون الشاشة كلها (من فوق النوتش لتحت) وبيحط مسافة تحت النوتش بس
// المسافة اللي تحت بتتظبط في التاب بار نفسه، فمش بنحط padding تحت هنا
export default function SafeScreen({ children }) {
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const isHome = segments[0] === "(tabs)" && (segments.length === 1 || segments[1] === "index");
  const fullBleed = FULL_BLEED_ROUTES.includes(segments[0]) || isHome;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: fullBleed ? 0 : insets.top,
      }}
    >
      {children}
    </View>
  );
}
