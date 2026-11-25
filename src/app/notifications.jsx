import React, { useEffect } from "react";
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import COLORS from "../constants/colors";
import { ROW, SCREEN_PADDING } from "../constants/layout";
import ScreenHeader from "../components/common/ScreenHeader";
import useNotificationsStore from "../store/notificationsStore";
import { useAuthStore } from "../store/authStore";
import { formatDay, formatTime } from "../utils/format";

// قايمة الإشعارات: الجديد بخلفية مميزة، والضغط عليه بيفتح الطلب
export default function NotificationsScreen() {
  const router = useRouter();
  const isAdmin = useAuthStore((s) => s.user?.role === "admin");
  const { items, unreadCount, loading } = useNotificationsStore();
  const { fetch, markRead, markAllRead } = useNotificationsStore.getState();

  useEffect(() => {
    fetch();
  }, []);

  const open = (n) => {
    markRead(n._id);
    if (n.data?.orderId) {
      router.push({
        pathname: isAdmin ? "/admin-order/[id]" : "/order/[id]",
        params: { id: n.data.orderId },
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="الإشعارات"
        onBackPress={() => router.back()}
        actionIcon={unreadCount > 0 ? "checkmark-done-outline" : undefined}
        onActionPress={markAllRead}
      />

      <FlatList
        data={items}
        keyExtractor={(n) => n._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading && items.length > 0} onRefresh={fetch} tintColor={COLORS.primary} colors={[COLORS.primary]} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, !item.read && styles.cardUnread]}
            activeOpacity={0.85}
            onPress={() => open(item)}
          >
            <View style={[styles.icon, !item.read && styles.iconUnread]}>
              <Ionicons name="receipt-outline" size={20} color={item.read ? COLORS.textSecondary : COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              {!!item.body && <Text style={styles.body}>{item.body}</Text>}
              <Text style={styles.time}>
                {formatDay(item.createdAt)} - {formatTime(item.createdAt)}
              </Text>
            </View>
            {!item.read && <View style={styles.dot} />}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons name="notifications-outline" size={44} color={COLORS.primary} />
              </View>
              <Text style={styles.emptyTitle}>لا توجد إشعارات</Text>
              <Text style={styles.emptyText}>هنبلغك هنا بأي تحديث على طلباتك</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SCREEN_PADDING, paddingBottom: 30, flexGrow: 1 },
  card: { flexDirection: ROW, alignItems: "center", gap: 12, backgroundColor: COLORS.cardBackground, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 12, marginBottom: 10 },
  cardUnread: { backgroundColor: "#eef5e8", borderColor: "#d3e3c9" },
  icon: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.border, justifyContent: "center", alignItems: "center" },
  iconUnread: { backgroundColor: COLORS.primaryLight },
  title: { fontSize: 15, fontWeight: "800", color: COLORS.textDark, textAlign: "right" },
  body: { fontSize: 13, color: COLORS.textPrimary, textAlign: "right", marginTop: 2 },
  time: { fontSize: 11, color: COLORS.textSecondary, textAlign: "right", marginTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.danger },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 80 },
  emptyIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textDark },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, marginTop: 6 },
});
