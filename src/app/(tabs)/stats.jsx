import React, { useCallback } from "react";
import { View, Text, ScrollView, Image, RefreshControl, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import COLORS from "../../constants/colors";
import { ROW, SCREEN_PADDING } from "../../constants/layout";
import { STATUS_META } from "../../constants/orderStatus";
import useStatsStore from "../../store/statsStore";
import BarChart from "../../components/stats/BarChart";
import { money } from "../../utils/format";

// مربع رقم (الإيرادات، الطلبات...)
function StatCard({ icon, label, value, tint = COLORS.primary, bg = COLORS.primaryLight }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={20} color={tint} />
      </View>
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// إحصائيات الـ admin: الإيرادات، الطلبات، رسم يومي، أكتر المنتجات مبيعاً، والمخزون المنخفض
export default function StatsScreen() {
  const { range, data, loading, error } = useStatsStore();
  const fetch = useStatsStore.getState().fetch;

  useFocusEffect(
    useCallback(() => {
      fetch();
    }, []),
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={loading && !!data}
          onRefresh={() => fetch()}
          tintColor={COLORS.primary}
          colors={[COLORS.primary]}
        />
      }
    >
      <Text style={styles.title}>الإحصائيات</Text>

      {/* الفترة */}
      <View style={styles.rangeRow}>
        {[7, 30].map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.rangeButton, range === r && styles.rangeActive]}
            onPress={() => fetch(r)}
            activeOpacity={0.85}
          >
            <Text style={[styles.rangeText, range === r && styles.rangeTextActive]}>
              آخر {r} {r === 7 ? "أيام" : "يوم"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {!data && loading && <ActivityIndicator style={{ marginTop: 60 }} size="large" color={COLORS.primary} />}
      {!!error && !data && (
        <View style={styles.errorBox}>
          <Text style={styles.muted}>{error}</Text>
          <TouchableOpacity style={styles.retry} onPress={() => fetch()}>
            <Text style={styles.retryText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      )}

      {!!data && (
        <>
          <View style={styles.grid}>
            <StatCard icon="cash-outline" label="الإيرادات" value={money(data.revenue)} />
            <StatCard icon="receipt-outline" label="الطلبات" value={String(data.ordersCount)} />
            <StatCard icon="stats-chart-outline" label="متوسط الطلب" value={money(data.avgOrder)} tint={COLORS.orange} bg="#fdebd7" />
            <StatCard icon="people-outline" label="العملاء" value={String(data.customersCount)} tint={COLORS.orange} bg="#fdebd7" />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>الإيراد اليومي</Text>
            <BarChart data={data.daily} />
          </View>

          {/* حالات الطلبات (الإجمالي كله) */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>حالات الطلبات</Text>
            <View style={styles.statusWrap}>
              {Object.entries(data.byStatus).map(([key, count]) => (
                <View key={key} style={[styles.statusChip, { backgroundColor: STATUS_META[key].bg }]}>
                  <Text style={[styles.statusCount, { color: STATUS_META[key].color }]}>{count}</Text>
                  <Text style={[styles.statusLabel, { color: STATUS_META[key].color }]}>{STATUS_META[key].label}</Text>
                </View>
              ))}
            </View>
            {data.cancelledCount > 0 && (
              <Text style={styles.note}>{data.cancelledCount} طلب ملغي في الفترة دي (مش محسوب في الإيرادات)</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>الأكثر مبيعاً</Text>
            {data.topProducts.length === 0 ? (
              <Text style={styles.muted}>لا توجد مبيعات في هذه الفترة</Text>
            ) : (
              data.topProducts.map((p, i) => (
                <View key={i} style={styles.listRow}>
                  <Text style={styles.rank}>{i + 1}</Text>
                  {p.image ? <Image source={{ uri: p.image }} style={styles.thumb} /> : <View style={styles.thumb} />}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.listName} numberOfLines={1}>{p.name}</Text>
                    <Text style={styles.listSub}>{p.quantity}{p.unit ? ` ${p.unit}` : ""} مبيعات</Text>
                  </View>
                  <Text style={styles.listValue}>{money(p.revenue)}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.cardTitle}>مخزون منخفض</Text>
              <Text style={styles.listSub}>{data.productsCount} منتج في المتجر</Text>
            </View>
            {data.lowStock.length === 0 ? (
              <Text style={styles.muted}>كل المنتجات مخزونها كافي</Text>
            ) : (
              data.lowStock.map((p) => (
                <View key={p._id} style={styles.listRow}>
                  {p.image ? <Image source={{ uri: p.image }} style={styles.thumb} /> : <View style={styles.thumb} />}
                  <Text style={[styles.listName, { flex: 1 }]} numberOfLines={1}>{p.name}</Text>
                  <View style={[styles.stockChip, p.stock === 0 && styles.stockOut]}>
                    <Text style={[styles.stockText, p.stock === 0 && { color: COLORS.danger }]}>
                      {p.stock === 0 ? "نفد" : `${p.stock}${p.unit ? ` ${p.unit}` : ""}`}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SCREEN_PADDING, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: "800", color: COLORS.textDark, textAlign: "right", marginTop: 4, marginBottom: 12 },
  rangeRow: { flexDirection: ROW, gap: 8, marginBottom: 14 },
  rangeButton: { flex: 1, height: 42, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.cardBackground, justifyContent: "center", alignItems: "center" },
  rangeActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  rangeText: { fontSize: 14, fontWeight: "700", color: COLORS.textPrimary },
  rangeTextActive: { color: COLORS.white },
  grid: { flexDirection: ROW, flexWrap: "wrap", gap: 10, marginBottom: 12 },
  statCard: { width: "48%", flexGrow: 1, backgroundColor: COLORS.cardBackground, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, padding: 14, alignItems: "flex-end" },
  statIcon: { width: 38, height: 38, borderRadius: 19, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  statValue: { fontSize: 22, fontWeight: "900", color: COLORS.textDark, maxWidth: "100%" },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  card: { backgroundColor: COLORS.cardBackground, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 12 },
  cardHead: { flexDirection: ROW, justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 16, fontWeight: "800", color: COLORS.textDark, textAlign: "right", marginBottom: 12 },
  statusWrap: { flexDirection: ROW, flexWrap: "wrap", gap: 8 },
  statusChip: { flexDirection: ROW, alignItems: "center", gap: 6, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  statusCount: { fontSize: 16, fontWeight: "900" },
  statusLabel: { fontSize: 12, fontWeight: "700" },
  note: { fontSize: 12, color: COLORS.textSecondary, textAlign: "right", marginTop: 10 },
  listRow: { flexDirection: ROW, alignItems: "center", gap: 10, marginBottom: 10 },
  rank: { width: 20, textAlign: "center", fontSize: 14, fontWeight: "900", color: COLORS.primary },
  thumb: { width: 42, height: 42, borderRadius: 12, backgroundColor: COLORS.primaryLight, resizeMode: "contain" },
  listName: { fontSize: 14, fontWeight: "700", color: COLORS.textDark, textAlign: "right" },
  listSub: { fontSize: 12, color: COLORS.textSecondary, textAlign: "right", marginTop: 2 },
  listValue: { fontSize: 13, fontWeight: "800", color: COLORS.primary },
  stockChip: { backgroundColor: "#fdebd7", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  stockOut: { backgroundColor: "#fde1dd" },
  stockText: { fontSize: 12, fontWeight: "800", color: COLORS.orange },
  muted: { fontSize: 14, color: COLORS.textSecondary, textAlign: "right", paddingVertical: 6 },
  errorBox: { alignItems: "center", paddingVertical: 40 },
  retry: { marginTop: 14, backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 22, borderRadius: 12 },
  retryText: { color: COLORS.white, fontWeight: "700" },
});
