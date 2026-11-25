import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import COLORS from "../../constants/colors";
import { ROW, SCREEN_PADDING } from "../../constants/layout";
import { STATUS_META } from "../../constants/orderStatus";
import useAdminOrdersStore from "../../store/adminOrdersStore";
import { formatDate, formatTime, money } from "../../utils/format";

// جدول طلبات الـ admin: تبويبين (الحالية = الافتراضي | المنتهية)
export default function AdminOrders() {
  const router = useRouter();
  const orders = useAdminOrdersStore((s) => s.orders);
  const scope = useAdminOrdersStore((s) => s.scope);
  const currentCount = useAdminOrdersStore((s) => s.currentCount);
  const finishedCount = useAdminOrdersStore((s) => s.finishedCount);
  const loading = useAdminOrdersStore((s) => s.loading);
  const refreshing = useAdminOrdersStore((s) => s.refreshing);
  const error = useAdminOrdersStore((s) => s.error);
  const { load, refresh, loadMore, setScope } = useAdminOrdersStore.getState();

  useEffect(() => {
    load();
  }, []);

  // لما يرجع من شاشة التفاصيل نحدّث (الطلب ممكن اتغير)
  useFocusEffect(
    useCallback(() => {
      if (useAdminOrdersStore.getState().orders.length) refresh();
    }, []),
  );

  const renderItem = ({ item, index }) => {
    const meta = STATUS_META[item.status];
    return (
      <TouchableOpacity
        style={[styles.row, index % 2 === 1 && styles.rowAlt]}
        activeOpacity={0.8}
        onPress={() => router.push({ pathname: "/admin-order/[id]", params: { id: item._id } })}
      >
        <View style={styles.numberCell}>
          <Text style={styles.numberText}>#{item.orderNumber}</Text>
          <Text style={styles.subText}>{formatDate(item.createdAt)}</Text>
          <Text style={styles.subText}>{formatTime(item.createdAt)}</Text>
        </View>
        <View style={styles.customerCell}>
          <Text style={styles.nameText} numberOfLines={1}>{item.customer?.username || "-"}</Text>
          <Text style={styles.subText} numberOfLines={1}>{item.delivery?.city}</Text>
        </View>
        <View style={styles.totalCell}>
          <Text style={styles.totalText}>{item.total.toFixed(0)}</Text>
          <Text style={styles.subText}>{item.items.length} صنف</Text>
        </View>
        <View style={styles.statusCell}>
          <View style={[styles.chip, { backgroundColor: meta.bg }]}>
            <Text style={[styles.chipText, { color: meta.color }]} numberOfLines={2}>{meta.label}</Text>
          </View>
        </View>
        <View style={styles.viewCell}>
          <View style={styles.viewButton}>
            <Ionicons name="eye-outline" size={18} color={COLORS.primary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>الطلبات</Text>

      {/* التبويبين */}
      <View style={styles.tabs}>
        {[
          { key: "current", label: "الطلبات الحالية", count: currentCount },
          { key: "finished", label: "طلبات منتهية", count: finishedCount },
        ].map((t) => {
          const active = scope === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setScope(t.key)}
              activeOpacity={0.85}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.label}</Text>
              <View style={[styles.badge, active && styles.badgeActive]}>
                <Text style={[styles.badgeText, active && styles.badgeTextActive]}>{t.count}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <View style={styles.numberCell}><Text style={styles.headText}>الطلب</Text></View>
          <View style={styles.customerCell}><Text style={styles.headText}>العميل</Text></View>
          <View style={styles.totalCell}><Text style={styles.headText}>الإجمالي</Text></View>
          <View style={styles.statusCell}><Text style={styles.headText}>الحالة</Text></View>
          <View style={styles.viewCell}><Text style={styles.headText}>عرض</Text></View>
        </View>

        <FlatList
          data={orders}
          keyExtractor={(o) => o._id}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          ListEmptyComponent={
            !loading && !refreshing ? (
              <View style={styles.center}>
                <Text style={styles.emptyText}>
                  {error || (scope === "current" ? "لا توجد طلبات حالية" : "لا توجد طلبات منتهية")}
                </Text>
                {!!error && (
                  <TouchableOpacity style={styles.retry} onPress={load}>
                    <Text style={styles.retryText}>إعادة المحاولة</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : null
          }
          ListFooterComponent={
            loading && !refreshing ? (
              <View style={{ paddingVertical: 16 }}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SCREEN_PADDING },
  title: { fontSize: 24, fontWeight: "800", color: COLORS.textDark, marginTop: 12, marginBottom: 10, textAlign: "right" },

  tabs: {
    flexDirection: ROW,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    flexDirection: ROW,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: "700", color: COLORS.textPrimary },
  tabTextActive: { color: COLORS.white },
  badge: { minWidth: 22, height: 20, borderRadius: 10, paddingHorizontal: 6, backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center" },
  badgeActive: { backgroundColor: "rgba(255,255,255,0.25)" },
  badgeText: { fontSize: 11, fontWeight: "800", color: COLORS.primary },
  badgeTextActive: { color: COLORS.white },

  table: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    marginBottom: 12,
  },
  tableHeader: { flexDirection: ROW, alignItems: "center", backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 8 },
  headText: { color: COLORS.white, fontSize: 12, fontWeight: "800", textAlign: "center" },
  row: { flexDirection: ROW, alignItems: "center", paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowAlt: { backgroundColor: "#f8f4ea" },

  numberCell: { width: 84, alignItems: "center" },
  customerCell: { flex: 1, alignItems: "center", paddingHorizontal: 2 },
  totalCell: { width: 58, alignItems: "center" },
  statusCell: { width: 78, alignItems: "center" },
  viewCell: { width: 44, alignItems: "center" },

  numberText: { fontSize: 13, fontWeight: "900", color: COLORS.textDark },
  nameText: { fontSize: 13, fontWeight: "700", color: COLORS.textDark },
  subText: { fontSize: 10, color: COLORS.textSecondary, marginTop: 1 },
  totalText: { fontSize: 13, fontWeight: "800", color: COLORS.primary },
  chip: { borderRadius: 8, paddingVertical: 4, paddingHorizontal: 6 },
  chipText: { fontSize: 10, fontWeight: "800", textAlign: "center" },
  viewButton: { width: 32, height: 32, borderRadius: 10, backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center" },

  center: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 48, paddingHorizontal: 24 },
  emptyText: { fontSize: 15, color: COLORS.textSecondary, textAlign: "center" },
  retry: { marginTop: 14, backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 22, borderRadius: 12 },
  retryText: { color: COLORS.white, fontWeight: "700" },
});
