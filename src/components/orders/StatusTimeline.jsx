import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { ROW } from "../../constants/layout";
import { STAGES, STAGE_INDEX } from "../../constants/orderStatus";
import { formatDay, formatTime } from "../../utils/format";

const NODE = 46;

// مراحل الطلب: الدواير على اليمين وكارت كل مرحلة على الشمال
// المراحل اللي عدّت = أخضر ✓، والحالية = أخضر بأيقونتها، والجاية = رمادي
export default function StatusTimeline({ status, history = [] }) {
  const cancelled = status === "cancelled";
  const current = cancelled ? -1 : STAGE_INDEX[status] ?? 0;
  const timeOf = (key) => history.find((h) => h.status === key)?.at;

  return (
    <View>
      {STAGES.map((stage, i) => {
        const done = i < current || (i === current && status === "delivered");
        const active = i === current && !done;
        const reached = i <= current;
        const at = timeOf(stage.key);
        const last = i === STAGES.length - 1;

        return (
          <View key={stage.key} style={styles.row}>
            {/* العمود اللي فيه الدايرة والخط */}
            <View style={styles.nodeColumn}>
              <View
                style={[
                  styles.node,
                  reached && styles.nodeReached,
                  active && styles.nodeActive,
                ]}
              >
                <Ionicons
                  name={done ? "checkmark" : stage.icon}
                  size={22}
                  color={reached ? COLORS.white : COLORS.textSecondary}
                />
              </View>
              {!last && <View style={[styles.line, i < current && styles.lineDone]} />}
            </View>

            {/* كارت المرحلة */}
            <View style={[styles.card, reached && styles.cardReached, active && styles.cardActive]}>
              <Text style={[styles.title, !reached && styles.muted]}>{stage.title}</Text>
              <Text style={[styles.desc, !reached && styles.muted]}>{stage.desc}</Text>
              <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                <Text style={styles.time}>
                  {reached && at ? `${formatDay(at)} - ${formatTime(at)}` : "قريباً"}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: ROW, alignItems: "stretch", gap: 12 },
  nodeColumn: { width: NODE, alignItems: "center" },
  node: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  nodeReached: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  nodeActive: {
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  line: { flex: 1, width: 3, backgroundColor: COLORS.border, marginVertical: 2 },
  lineDone: { backgroundColor: COLORS.primary },
  card: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  cardReached: { backgroundColor: "#eef5e8", borderColor: "#d3e3c9" },
  cardActive: { backgroundColor: "#e4efdf", borderColor: COLORS.accent },
  title: { fontSize: 16, fontWeight: "800", color: COLORS.textDark, textAlign: "right" },
  desc: { fontSize: 13, color: COLORS.textPrimary, textAlign: "right", marginTop: 2 },
  muted: { color: COLORS.textSecondary },
  timeRow: { flexDirection: ROW, alignItems: "center", gap: 4, marginTop: 6 },
  time: { fontSize: 12, color: COLORS.textSecondary },
});
