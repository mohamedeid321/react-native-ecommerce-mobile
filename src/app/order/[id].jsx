import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, Image, Alert, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../../constants/colors";
import { ROW, SCREEN_PADDING } from "../../constants/layout";
import { CAN_CUSTOMER_CANCEL, STATUS_META } from "../../constants/orderStatus";
import ScreenHeader from "../../components/common/ScreenHeader";
import StatusTimeline from "../../components/orders/StatusTimeline";
import useOrdersStore from "../../store/ordersStore";
import { formatDate, money, addressLine } from "../../utils/format";

const str = (v) => (Array.isArray(v) ? v[0] : v) ?? "";
const POLL_MS = 15000; // تحديث الحالة تلقائي (الـ admin ممكن يغيّرها)

// تتبع الطلب: مراحل الطلب + ملخصه + زرار الإلغاء (بيختفي لما الطلب يخرج للتوصيل)
export default function OrderTrackingScreen() {
  const id = str(useLocalSearchParams().id);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const order = useOrdersStore((s) => s.orders.find((o) => o._id === id));
  const { fetchOne, cancel } = useOrdersStore.getState();
  const [loading, setLoading] = useState(!order);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    await fetchOne(id);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
    const timer = setInterval(load, POLL_MS);
    return () => clearInterval(timer);
  }, [load]);

  const handleCancel = () => {
    Alert.alert("إلغاء الطلب", "هل أنت متأكد من إلغاء الطلب؟", [
      { text: "رجوع", style: "cancel" },
      {
        text: "إلغاء الطلب",
        style: "destructive",
        onPress: async () => {
          setCancelling(true);
          const result = await cancel(id);
          setCancelling(false);
          Alert.alert(result.ok ? "تم" : "تنبيه", result.message);
        },
      },
    ]);
  };

  if (!order) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="تتبع الطلب" onBackPress={() => router.back()} />
        <View style={styles.center}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <Text style={styles.muted}>الطلب غير موجود</Text>
          )}
        </View>
      </View>
    );
  }

  const meta = STATUS_META[order.status];
  const cancelled = order.status === "cancelled";
  const canCancel = CAN_CUSTOMER_CANCEL.includes(order.status);

  return (
    <View style={styles.container}>
      <ScreenHeader title="تتبع الطلب" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {cancelled && (
          <View style={styles.cancelBanner}>
            <Ionicons name="close-circle" size={22} color={COLORS.danger} />
            <Text style={styles.cancelText}>تم إلغاء هذا الطلب</Text>
          </View>
        )}

        <StatusTimeline status={order.status} history={order.statusHistory} />

        {/* ملخص الطلب */}
        <View style={styles.summary}>
          <View style={styles.summaryTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.number}>رقم الطلب #{order.orderNumber}</Text>
              <Text style={styles.date}>تاريخ الطلب: {formatDate(order.createdAt)}</Text>
            </View>
            <View style={[styles.chip, { backgroundColor: meta.bg }]}>
              <Text style={[styles.chipText, { color: meta.color }]}>{meta.label}</Text>
            </View>
          </View>

          <View style={styles.divider} />
          {order.items.map((i, idx) => (
            <View key={idx} style={styles.itemRow}>
              {i.image ? <Image source={{ uri: i.image }} style={styles.itemImage} /> : <View style={styles.itemImage} />}
              <Text style={styles.itemName} numberOfLines={1}>{i.name}</Text>
              <Text style={styles.itemQty}>{i.quantity}{i.unit ? ` ${i.unit}` : ""}</Text>
              <Text style={styles.itemTotal}>{money(i.lineTotal)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>الإجمالي (شامل التوصيل)</Text>
            <Text style={styles.totalValue}>{money(order.total)}</Text>
          </View>
          <View style={styles.address}>
            <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.addressText}>{addressLine(order.delivery)}</Text>
          </View>
        </View>
      </ScrollView>

      {canCancel && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={cancelling}
            activeOpacity={0.85}
          >
            {cancelling ? (
              <ActivityIndicator color={COLORS.danger} />
            ) : (
              <Text style={styles.cancelButtonText}>إلغاء الطلب</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { color: COLORS.textSecondary, fontSize: 15 },
  content: { padding: SCREEN_PADDING, paddingBottom: 24 },
  cancelBanner: {
    flexDirection: ROW,
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fde1dd",
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  cancelText: { fontSize: 15, fontWeight: "800", color: COLORS.danger },
  summary: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginTop: 4,
  },
  summaryTop: { flexDirection: ROW, alignItems: "center", gap: 10 },
  number: { fontSize: 16, fontWeight: "900", color: COLORS.textDark, textAlign: "right" },
  date: { fontSize: 12, color: COLORS.textSecondary, textAlign: "right", marginTop: 2 },
  chip: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 12, fontWeight: "800" },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 10 },
  itemRow: { flexDirection: ROW, alignItems: "center", gap: 10, marginBottom: 8 },
  itemImage: { width: 40, height: 40, borderRadius: 10, backgroundColor: COLORS.primaryLight, resizeMode: "contain" },
  itemName: { flex: 1, fontSize: 14, fontWeight: "700", color: COLORS.textDark, textAlign: "right" },
  itemQty: { fontSize: 12, color: COLORS.textSecondary },
  itemTotal: { fontSize: 13, fontWeight: "800", color: COLORS.primary, minWidth: 70, textAlign: "left" },
  totalRow: { flexDirection: ROW, justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 14, color: COLORS.textPrimary, fontWeight: "700" },
  totalValue: { fontSize: 18, fontWeight: "900", color: COLORS.textDark },
  address: { flexDirection: ROW, gap: 6, marginTop: 10, alignItems: "flex-start" },
  addressText: { flex: 1, fontSize: 12, color: COLORS.textSecondary, textAlign: "right" },
  footer: {
    paddingHorizontal: SCREEN_PADDING + 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  cancelButton: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    backgroundColor: "#fdecea",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: { color: COLORS.danger, fontSize: 16, fontWeight: "800" },
});
