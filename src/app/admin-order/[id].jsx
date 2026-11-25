import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, Image, Alert, Linking, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../../constants/colors";
import { ROW, SCREEN_PADDING } from "../../constants/layout";
import {
  CAN_ADMIN_CANCEL,
  NEXT_STATUS,
  NEXT_STATUS_LABEL,
  STATUS_META,
} from "../../constants/orderStatus";
import ScreenHeader from "../../components/common/ScreenHeader";
import useAdminOrdersStore from "../../store/adminOrdersStore";
import { formatDate, formatTime, money } from "../../utils/format";

const str = (v) => (Array.isArray(v) ? v[0] : v) ?? "";

// صف معلومة (عنوان + قيمة)
function Info({ icon, label, value, onPress }) {
  if (!value) return null;
  return (
    <TouchableOpacity style={styles.infoRow} disabled={!onPress} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={18} color={COLORS.textSecondary} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, onPress && { color: COLORS.primary }]}>{value}</Text>
    </TouchableOpacity>
  );
}

// تفاصيل الطلب للـ admin + تغيير الحالة (والعميل بيشوف التغيير في التتبع)
export default function AdminOrderScreen() {
  const id = str(useLocalSearchParams().id);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const { fetchOne, updateStatus } = useAdminOrdersStore.getState();

  const load = useCallback(async () => {
    setLoading(true);
    setOrder(await fetchOne(id));
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const change = (status, message) => {
    Alert.alert("تأكيد", message, [
      { text: "رجوع", style: "cancel" },
      {
        text: "تأكيد",
        onPress: async () => {
          setBusy(true);
          const result = await updateStatus(id, status);
          setBusy(false);
          if (result.ok) setOrder(result.order);
          else {
            Alert.alert("تنبيه", result.message);
            load();
          }
        },
      },
    ]);
  };

  if (!order) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="تفاصيل الطلب" onBackPress={() => router.back()} />
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
  const next = NEXT_STATUS[order.status];
  const canCancel = CAN_ADMIN_CANCEL.includes(order.status);
  const d = order.delivery || {};
  const call = (phone) => Linking.openURL(`tel:${phone}`);

  return (
    <View style={styles.container}>
      <ScreenHeader title="تفاصيل الطلب" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* رقم الطلب والحالة */}
        <View style={styles.card}>
          <View style={styles.topRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.number}>#{order.orderNumber}</Text>
              <Text style={styles.date}>
                {formatDate(order.createdAt)} - {formatTime(order.createdAt)}
              </Text>
            </View>
            <View style={[styles.chip, { backgroundColor: meta.bg }]}>
              <Text style={[styles.chipText, { color: meta.color }]}>{meta.label}</Text>
            </View>
          </View>
          {order.status === "cancelled" && (
            <Text style={styles.cancelNote}>
              ألغاه {order.cancelledBy === "customer" ? "العميل" : "الـ admin"} (المخزون رجع تلقائياً)
            </Text>
          )}
        </View>

        {/* العميل والتوصيل */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>بيانات العميل والتوصيل</Text>
          <Info icon="person-outline" label="الاسم" value={order.customer?.username} />
          <Info icon="mail-outline" label="الإيميل" value={order.customer?.email} />
          <Info icon="location-outline" label="المدينة" value={`${d.city} - ${d.governorate}`} />
          <Info icon="grid-outline" label="مجاورة" value={String(d.neighborhood || "")} />
          <Info icon="business-outline" label="عمارة / شقة / دور" value={`${d.building} / ${d.apartment} / ${d.floor}`} />
          <Info icon="trail-sign-outline" label="الشارع" value={d.street} />
          <Info icon="flag-outline" label="علامة مميزة" value={d.landmark} />
          <Info icon="call-outline" label="هاتف 1" value={d.phone1} onPress={() => call(d.phone1)} />
          <Info icon="call-outline" label="هاتف 2" value={d.phone2} onPress={() => call(d.phone2)} />
        </View>

        {/* المنتجات */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>المنتجات ({order.items.length})</Text>
          {order.items.map((i, idx) => (
            <View key={idx} style={styles.itemRow}>
              {i.image ? <Image source={{ uri: i.image }} style={styles.itemImage} /> : <View style={styles.itemImage} />}
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName} numberOfLines={1}>{i.name}</Text>
                <Text style={styles.itemSub}>
                  {i.quantity}{i.unit ? ` ${i.unit}` : ""} × {i.unitPrice.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.itemTotal}>{money(i.lineTotal)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}><Text style={styles.totalLabel}>المجموع الفرعي</Text><Text style={styles.totalValue}>{money(order.subtotal)}</Text></View>
          <View style={styles.totalRow}><Text style={styles.totalLabel}>رسوم التوصيل</Text><Text style={styles.totalValue}>{money(order.deliveryFee)}</Text></View>
          <View style={styles.divider} />
          <View style={styles.totalRow}><Text style={styles.grandLabel}>الإجمالي</Text><Text style={styles.grandValue}>{money(order.total)}</Text></View>
        </View>
      </ScrollView>

      {(next || canCancel) && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          {next && (
            <TouchableOpacity
              style={[styles.primaryButton, busy && { opacity: 0.6 }]}
              disabled={busy}
              activeOpacity={0.85}
              onPress={() => change(next, `تغيير حالة الطلب إلى "${STATUS_META[next].label}"؟`)}
            >
              {busy ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.primaryText}>{NEXT_STATUS_LABEL[order.status]}</Text>}
            </TouchableOpacity>
          )}
          {canCancel && (
            <TouchableOpacity
              style={styles.cancelButton}
              disabled={busy}
              onPress={() => change("cancelled", "إلغاء الطلب وإرجاع الكميات للمخزون؟")}
            >
              <Text style={styles.cancelText}>إلغاء الطلب</Text>
            </TouchableOpacity>
          )}
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
  card: { backgroundColor: COLORS.cardBackground, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 12 },
  topRow: { flexDirection: ROW, alignItems: "center", gap: 10 },
  number: { fontSize: 22, fontWeight: "900", color: COLORS.textDark, textAlign: "right" },
  date: { fontSize: 12, color: COLORS.textSecondary, textAlign: "right", marginTop: 2 },
  chip: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5 },
  chipText: { fontSize: 13, fontWeight: "800" },
  cancelNote: { fontSize: 12, color: COLORS.danger, textAlign: "right", marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: COLORS.textDark, textAlign: "right", marginBottom: 8 },
  infoRow: { flexDirection: ROW, alignItems: "center", gap: 8, paddingVertical: 6 },
  infoLabel: { fontSize: 13, color: COLORS.textSecondary, width: 96, textAlign: "right" },
  infoValue: { flex: 1, fontSize: 14, fontWeight: "700", color: COLORS.textDark, textAlign: "right" },
  itemRow: { flexDirection: ROW, alignItems: "center", gap: 10, marginBottom: 10 },
  itemImage: { width: 46, height: 46, borderRadius: 12, backgroundColor: COLORS.primaryLight, resizeMode: "contain" },
  itemName: { fontSize: 14, fontWeight: "700", color: COLORS.textDark, textAlign: "right" },
  itemSub: { fontSize: 12, color: COLORS.textSecondary, textAlign: "right", marginTop: 2 },
  itemTotal: { fontSize: 14, fontWeight: "800", color: COLORS.primary },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  totalRow: { flexDirection: ROW, justifyContent: "space-between", paddingVertical: 2 },
  totalLabel: { fontSize: 13, color: COLORS.textSecondary },
  totalValue: { fontSize: 13, fontWeight: "700", color: COLORS.textDark },
  grandLabel: { fontSize: 16, fontWeight: "800", color: COLORS.textDark },
  grandValue: { fontSize: 18, fontWeight: "900", color: COLORS.textDark },
  footer: { paddingHorizontal: SCREEN_PADDING + 4, paddingTop: 12, gap: 10, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.background },
  primaryButton: { height: 54, borderRadius: 16, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center" },
  primaryText: { color: COLORS.white, fontSize: 16, fontWeight: "800" },
  cancelButton: { height: 46, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.danger, backgroundColor: "#fdecea", justifyContent: "center", alignItems: "center" },
  cancelText: { color: COLORS.danger, fontSize: 15, fontWeight: "800" },
});
