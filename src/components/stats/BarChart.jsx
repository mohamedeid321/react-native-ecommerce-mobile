import React from "react";
import { View, Text, StyleSheet } from "react-native";
import COLORS from "../../constants/colors";
import { ROW } from "../../constants/layout";

const HEIGHT = 130;

// رسم أعمدة بسيط لإيراد كل يوم (آخر يوم على الشمال)
export default function BarChart({ data }) {
  const max = Math.max(1, ...data.map((d) => d.revenue));
  const dense = data.length > 10;

  return (
    <View>
      <View style={styles.plot}>
        {data.map((d, i) => {
          const h = d.revenue > 0 ? Math.max(4, (d.revenue / max) * HEIGHT) : 2;
          const last = i === data.length - 1;
          return (
            <View key={d.date} style={styles.col}>
              {!dense && d.revenue > 0 && <Text style={styles.value}>{Math.round(d.revenue)}</Text>}
              <View
                style={[
                  styles.bar,
                  { height: h },
                  d.revenue === 0 && styles.barEmpty,
                  last && styles.barLast,
                ]}
              />
            </View>
          );
        })}
      </View>
      <View style={styles.labels}>
        {data.map((d, i) => (
          <Text key={d.date} style={styles.label}>
            {dense && i % 5 !== 0 && i !== data.length - 1 ? "" : String(Number(d.date.slice(8)))}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // آخر يوم على الشمال: الترتيب من اليمين للشمال = الأحدث ثم الأقدم، فبنعكس الصف
  plot: { flexDirection: ROW, alignItems: "flex-end", height: HEIGHT + 18, gap: 3 },
  col: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  bar: { width: "100%", maxWidth: 28, borderRadius: 6, backgroundColor: "#a9c7a3" },
  barLast: { backgroundColor: COLORS.primary },
  barEmpty: { backgroundColor: COLORS.border },
  value: { fontSize: 9, color: COLORS.textSecondary, marginBottom: 2, fontWeight: "700" },
  labels: { flexDirection: ROW, gap: 3, marginTop: 6 },
  label: { flex: 1, textAlign: "center", fontSize: 10, color: COLORS.textSecondary },
});
