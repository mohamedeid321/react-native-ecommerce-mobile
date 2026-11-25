import React, { useEffect, useRef } from "react";
import { View, Text, Modal, Pressable, Animated, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../../constants/colors";
import { ROW } from "../../constants/layout";
import { TABS_BY_ROLE, AUTH_ROUTE, getRole } from "../../constants/tabs";
import { useAuthStore } from "../../store/authStore";

const PANEL_WIDTH = Math.min(300, Dimensions.get("window").width * 0.78);

// القايمة الجانبية: بتفتح من اليمين وفيها نفس عناصر شريط التابات حسب دور المستخدم
export default function SideMenu({ visible, onClose }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token, user } = useAuthStore();
  const role = getRole({ token, user });
  const tabs = TABS_BY_ROLE[role];
  const slide = useRef(new Animated.Value(PANEL_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: visible ? 0 : PANEL_WIDTH,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const go = (tab) => {
    onClose();
    if (tab.opensAuth) router.push(AUTH_ROUTE);
    else router.navigate(tab.route === "index" ? "/(tabs)" : `/(tabs)/${tab.route}`);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        {/* التعتيم (بس شكل) */}
        <View style={styles.backdrop} pointerEvents="none" />
        <Animated.View
          style={[
            styles.panel,
            { width: PANEL_WIDTH, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 16, transform: [{ translateX: slide }] },
          ]}
        >
          <View style={styles.head}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={26} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.hello} numberOfLines={1}>
                {user?.username ? `أهلاً ${user.username}` : "أهلاً بيك في لقطة"}
              </Text>
              {!token && <Text style={styles.sub}>سجّل دخولك للاستفادة من كل المميزات</Text>}
            </View>
          </View>

          <View style={styles.divider} />

          {tabs.map((tab) => (
            <TouchableOpacity key={tab.label} style={styles.item} activeOpacity={0.7} onPress={() => go(tab)}>
              <View style={styles.itemIcon}>
                <Ionicons name={tab.icon.inactive} size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.itemText}>{tab.label}</Text>
              <Ionicons name="chevron-back" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* باقي الشاشة على الشمال: أي ضغطة عليه تقفل القايمة */}
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: "row-reverse" }, // اللوحة على اليمين
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  panel: {
    height: "100%",
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,
    paddingHorizontal: 18,
  },
  head: { flexDirection: ROW, alignItems: "center", gap: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center" },
  hello: { fontSize: 17, fontWeight: "800", color: COLORS.textDark, textAlign: "right" },
  sub: { fontSize: 12, color: COLORS.textSecondary, textAlign: "right", marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 18 },
  item: { flexDirection: ROW, alignItems: "center", gap: 12, paddingVertical: 12 },
  itemIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center" },
  itemText: { flex: 1, fontSize: 16, fontWeight: "700", color: COLORS.textDark, textAlign: "right" },
});
