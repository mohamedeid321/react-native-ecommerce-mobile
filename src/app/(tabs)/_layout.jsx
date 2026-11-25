import { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, Pressable, StyleSheet } from "react-native";
import COLORS from "../../constants/colors";
import { ROW } from "../../constants/layout";
import {
  TABS_BY_ROLE,
  ROLE_ROUTES,
  AUTH_ROUTE,
  getRole,
} from "../../constants/tabs";
import { useAuthStore } from "../../store/authStore";

const BAR_HEIGHT = 62; // ارتفاع التابات (من غير الـ safe area)

// تاب واحد: أيقونة + الاسم تحتها، والمختار بيتلون
function TabItem({ focused, label, icon, onPress }) {
  const color = focused ? COLORS.primary : COLORS.textSecondary;

  return (
    <Pressable
      style={styles.tabItem}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
    >
      <Ionicons
        name={focused ? icon.active : icon.inactive}
        size={24}
        color={color}
      />
      <Text
        style={[styles.label, { color }, focused && styles.labelActive]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// الـ Tab Bar: بيعرض تابات الدور الحالي بس، من اليمين للشمال
function CustomTabBar({ state, navigation, role }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const tabs = TABS_BY_ROLE[role];
  const currentName = state.routes[state.index]?.name;

  // لو الدور اتغير (دخول/خروج) وكنا واقفين على شاشة مش بتاعته، نرجّعه لأول تاب
  useEffect(() => {
    const isForbidden =
      ROLE_ROUTES.has(currentName) &&
      !tabs.some((t) => t.route === currentName);
    if (isForbidden) navigation.navigate(tabs[0].route);
  }, [role, currentName]);

  return (
    <View
      style={[
        styles.bar,
        { height: BAR_HEIGHT + insets.bottom, paddingBottom: insets.bottom },
      ]}
    >
      {tabs.map((tab) => {
        const route = state.routes.find((r) => r.name === tab.route);
        if (!route) return null;

        // تاب "تسجيل الدخول" عمره ما بيبقى مختار لأنه بيفتح شاشة الدخول
        const focused = !tab.opensAuth && currentName === tab.route;

        const onPress = () => {
          if (tab.opensAuth) {
            router.push(AUTH_ROUTE);
            return;
          }
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TabItem
            key={tab.label}
            focused={focused}
            label={tab.label}
            icon={tab.icon}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const { token, user } = useAuthStore();
  const role = getRole({ token, user });

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} role={role} />}
      screenOptions={{ headerShown: false }}
    >
      {/* الكل */}
      <Tabs.Screen name="index" options={{ title: "الرئيسية" }} />
      <Tabs.Screen name="categories" options={{ title: "الأقسام" }} />
      <Tabs.Screen name="cart" options={{ title: "السلة" }} />
      <Tabs.Screen name="orders" options={{ title: "الطلبات" }} />
      <Tabs.Screen name="profile" options={{ title: "الحساب" }} />
      {/* admin */}
      <Tabs.Screen name="create" options={{ title: "أضف منتج" }} />
      <Tabs.Screen name="products" options={{ title: "المنتجات" }} />
      <Tabs.Screen name="stats" options={{ title: "الإحصائيات" }} />
      {/* شاشات مش ظاهرة في التابات حالياً */}
      <Tabs.Screen name="search" options={{ title: "البحث" }} />
      <Tabs.Screen name="wishlist" options={{ title: "المفضلة" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: ROW, // أول تاب على اليمين
    backgroundColor: COLORS.cardBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
  },
  labelActive: {
    fontWeight: "800",
  },
});
