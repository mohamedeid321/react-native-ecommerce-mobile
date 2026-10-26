import { useEffect, useRef, useState } from "react";
import { Tabs } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, StyleSheet, Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

// ---------- الإعدادات (عدّل فيها براحتك) ----------
// easeInOutCubic: بداية ونهاية ناعمة جداً (قريبة من power2/power3.inOut في GSAP)
const TIMING_CONFIG = {
  duration: 400,
  easing: Easing.bezier(0.65, 0, 0.35, 1),
};

const BAR_HEIGHT = 50; // ارتفاع الـ bar (من غير الـ safe area)
const SIDE_PADDING = 15; // مسافة من الجانبين قبل أول وآخر تاب
const OUTER_RADIUS = 25; // انحناء أركان الـ bar من فوق
const CIRCLE_SIZE = 55; // حجم الدايرة
const NOTCH_GAP = 10; // المسافة بين الدايرة وحافة الحفرة
const FILLET = 15; // انحناء "الكتف" عند بداية الحفرة

// ---------- حسابات شكل الحفرة (متساوية حوالين الدايرة) ----------
const NOTCH_R = CIRCLE_SIZE / 2 + NOTCH_GAP; // نصف قطر الحفرة
const XF = Math.sqrt(NOTCH_R * NOTCH_R + 2 * NOTCH_R * FILLET);
const TX = (XF * NOTCH_R) / (NOTCH_R + FILLET);
const TY = (FILLET * NOTCH_R) / (NOTCH_R + FILLET);

// الأيقونة المختارة بتطلع لحد مركز الدايرة (على خط حافة الـ bar العليا)
const LIFT = BAR_HEIGHT / 2;

// أيقونة كل تاب (الاسم لازم يطابق اسم الـ screen)
const TAB_ICONS = {
  index: { Icon: Ionicons, name: "home-outline" },
  search: { Icon: Feather, name: "search" },
  create: { Icon: Ionicons, name: "add" },
  wishlist: { Icon: Ionicons, name: "heart-outline" },
  profile: { Icon: Ionicons, name: "person-outline" },
};

// بيرسم شكل الـ bar: أركان مدورة + حفرة نص دايرة عند cx
function buildPath(cx, w) {
  "worklet";
  const rl = Math.max(0, Math.min(OUTER_RADIUS, cx - XF));
  const rr = Math.max(0, Math.min(OUTER_RADIUS, w - cx - XF));
  const BIG = 400; // القاع بيتقص تلقائي بحدود الـ Svg
  return (
    `M 0 ${rl} A ${rl} ${rl} 0 0 1 ${rl} 0 ` +
    `L ${cx - XF} 0 ` +
    `A ${FILLET} ${FILLET} 0 0 1 ${cx - TX} ${TY} ` +
    `A ${NOTCH_R} ${NOTCH_R} 0 0 0 ${cx + TX} ${TY} ` +
    `A ${FILLET} ${FILLET} 0 0 1 ${cx + XF} 0 ` +
    `L ${w - rr} 0 ` +
    `A ${rr} ${rr} 0 0 1 ${w} ${rr} ` +
    `L ${w} ${BIG} L 0 ${BIG} Z`
  );
}

// أيقونة التاب: لما تتختار بتطلع وتكبر جوه الدايرة
function TabItem({ focused, onPress, onLongPress, Icon, name }) {
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, TIMING_CONFIG);
  }, [focused]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -LIFT * progress.value },
      { scale: 1 + 0.15 * progress.value },
    ],
  }));

  return (
    <Pressable
      style={styles.tabItem}
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
    >
      <Animated.View style={iconStyle}>
        <Icon
          name={name}
          size={24}
          color={focused ? COLORS.primary : COLORS.white}
        />
      </Animated.View>
    </Pressable>
  );
}

// الـ Tab Bar المخصص
function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom > 0 ? insets.bottom : 10;
  const totalHeight = BAR_HEIGHT + bottomPad;

  const [barWidth, setBarWidth] = useState(0);
  const widthSV = useSharedValue(0);
  const cx = useSharedValue(0); // مركز الدايرة/الحفرة (أفقياً)
  const initialized = useRef(false);

  const tabWidth = (barWidth - SIDE_PADDING * 2) / state.routes.length;

  useEffect(() => {
    if (!tabWidth || tabWidth < 0) return;
    const target = SIDE_PADDING + state.index * tabWidth + tabWidth / 2;
    if (!initialized.current) {
      cx.value = target; // أول مرة من غير حركة
      initialized.current = true;
    } else {
      cx.value = withTiming(target, TIMING_CONFIG);
    }
  }, [state.index, tabWidth]);

  // شكل الـ bar بيتغير مع حركة الحفرة
  const pathProps = useAnimatedProps(() => ({
    d: buildPath(cx.value, widthSV.value),
  }));

  // الدايرة بتتحرك مع الحفرة
  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cx.value - CIRCLE_SIZE / 2 }],
  }));

  return (
    <View
      style={{ height: totalHeight }}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        widthSV.value = w;
        setBarWidth(w);
      }}
    >
      {barWidth > 0 && (
        <Svg
          width={barWidth}
          height={totalHeight}
          style={StyleSheet.absoluteFill}
        >
          <AnimatedPath animatedProps={pathProps} fill={COLORS.primary} />
        </Svg>
      )}

      <View style={styles.row}>
        {/* الدايرة المتحركة (ورا الأيقونات) */}
        {barWidth > 0 && <Animated.View style={[styles.circle, circleStyle]} />}

        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const config = TAB_ICONS[route.name];
          if (!config) return null;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: "tabLongPress", target: route.key });
          };

          return (
            <TabItem
              key={route.key}
              focused={focused}
              onPress={onPress}
              onLongPress={onLongPress}
              Icon={config.Icon}
              name={config.name}
            />
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="create" options={{ title: "Create" }} />
      <Tabs.Screen name="wishlist" options={{ title: "Wishlist" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    height: BAR_HEIGHT,
    paddingHorizontal: SIDE_PADDING,
  },
  tabItem: {
    flex: 1,
    height: BAR_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    position: "absolute",
    top: -CIRCLE_SIZE / 2, // مركز الدايرة على حافة الـ bar العليا
    left: 0,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: COLORS.white, // الدايرة فاتحة
  },
});
