import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { ROW } from "../../constants/layout";
import { STATUS_META } from "../../constants/orderStatus";
import { formatDate, money } from "../../utils/format";

// تيكت الطلب: ورقة بدبوس من فوق ومايلة شوية (الميلان بيتبدل حسب index)
// onPress: بيفتح شاشة تتبع الطلب
export default function OrderTicket({ order, index = 0, width = 168, onPress }) {
  const meta = STATUS_META[order.status] || STATUS_META.placed;
  const tilt = index % 2 === 0 ? "-2.2deg" : "2.2deg";
  const shown = order.items.slice(0, 3);
  const extra = order.items.length - shown.length;
  const inactive = order.status === "cancelled" || order.status === "delivered";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress?.(order)}
      style={[styles.wrapper, { width, transform: [{ rotate: tilt }] }]}
    >
      {/* الدبوس */}
      <View style={styles.pinWrap}>
        <View style={styles.pinHead} />
        <View style={styles.pinShadow} />
      </View>

      <View style={[styles.paper, inactive && { opacity: 0.85 }]}>
        <View style={styles.numberRow}>
          <Text style={styles.number}>#{order.orderNumber}</Text>
          <Ionicons name="receipt-outline" size={16} color={COLORS.textSecondary} />
        </View>
        <Text style={styles.date}>{formatDate(order.createdAt)}</Text>

        <View style={styles.thumbs}>
          {shown.map((i, idx) =>
            i.image ? (
              <Image key={idx} source={{ uri: i.image }} style={styles.thumb} />
            ) : (
              <View key={idx} style={styles.thumb} />
            ),
          )}
          {extra > 0 && (
            <View style={[styles.thumb, styles.more]}>
              <Text style={styles.moreText}>+{extra}</Text>
            </View>
          )}
        </View>

        {/* خط التقطيع */}
        <View style={styles.perforation}>
          <View style={[styles.notch, { left: -width * 0.0 - 22 }]} />
          <View style={styles.dash} />
          <View style={[styles.notch, { right: -22 }]} />
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.total}>{money(order.total)}</Text>
          <View style={[styles.status, { backgroundColor: meta.bg }]}>
            <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 10, marginBottom: 14 },
  pinWrap: { position: "absolute", top: -9, left: 0, right: 0, alignItems: "center", zIndex: 3 },
  pinHead: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.danger,
    borderWidth: 2,
    borderColor: "#f5b7b1",
  },
  pinShadow: {
    width: 6,
    height: 3,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.15)",
    marginTop: 1,
  },
  paper: {
    backgroundColor: "#fffdf6",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  numberRow: { flexDirection: ROW, justifyContent: "space-between", alignItems: "center" },
  number: { fontSize: 15, fontWeight: "900", color: COLORS.textDark },
  date: { fontSize: 11, color: COLORS.textSecondary, textAlign: "right", marginTop: 2 },
  thumbs: { flexDirection: ROW, marginTop: 10, height: 40 },
  thumb: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1.5,
    borderColor: "#fffdf6",
    marginLeft: -8,
    resizeMode: "contain",
  },
  more: { justifyContent: "center", alignItems: "center", backgroundColor: COLORS.border },
  moreText: { fontSize: 11, fontWeight: "800", color: COLORS.textPrimary },
  perforation: { flexDirection: "row", alignItems: "center", marginVertical: 10, height: 12 },
  dash: {
    flex: 1,
    borderTopWidth: 1.5,
    borderStyle: "dashed",
    borderColor: COLORS.border,
  },
  notch: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    top: -4,
  },
  bottomRow: { alignItems: "flex-end", gap: 6 },
  total: { fontSize: 15, fontWeight: "800", color: COLORS.primary },
  status: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 11, fontWeight: "800" },
});
