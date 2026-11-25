import React from "react";
import { View, Text } from "react-native";
import styles from "../../assets/styles/cart.styles";
import { money } from "../../utils/format";

// المجموع الفرعي + رسوم التوصيل + الإجمالي (نفس الشكل في السلة وغيرها)
export default function CartSummary({ subtotal, deliveryFee, total }) {
  return (
    <View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>المجموع الفرعي</Text>
        <Text style={styles.summaryValue}>{money(subtotal)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>رسوم التوصيل</Text>
        <Text style={styles.summaryValue}>{money(deliveryFee)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>الإجمالي</Text>
        <Text style={styles.totalValue}>{money(total)}</Text>
      </View>
    </View>
  );
}
