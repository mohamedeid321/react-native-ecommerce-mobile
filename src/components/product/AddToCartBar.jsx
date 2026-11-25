import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/product.styles";

const MIN_QTY = 1;
const MAX_QTY = 99;

// الشريط الثابت تحت:
// السعر الإجمالي (في النص وبخط كبير) + زرار "أضف إلى السلة" (يمين) + العداد بوحدة المنتج (شمال)
// unitPrice = سعر الوحدة بعد الخصم، والإجمالي = unitPrice × الكمية
export default function AddToCartBar({
  quantity,
  onChangeQuantity,
  onAddToCart,
  unit,
  unitPrice,
}) {
  const insets = useSafeAreaInsets();
  const total =
    unitPrice != null ? Math.round(unitPrice * quantity * 100) / 100 : null;

  return (
    <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
      {total !== null && (
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>السعر الإجمالي</Text>
          <Text style={styles.totalValue}>{total.toFixed(2)} ج.م</Text>
        </View>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.85}
          onPress={onAddToCart}
        >
          <Text style={styles.addButtonText}>أضف إلى السلة</Text>
        </TouchableOpacity>

        <View style={styles.stepper}>
          <TouchableOpacity
            style={styles.stepperButton}
            onPress={() => onChangeQuantity(Math.max(MIN_QTY, quantity - 1))}
          >
            <Ionicons name="remove" size={20} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.stepperValue}>
            {quantity}
            {unit ? ` ${unit}` : ""}
          </Text>
          <TouchableOpacity
            style={styles.stepperButton}
            onPress={() => onChangeQuantity(Math.min(MAX_QTY, quantity + 1))}
          >
            <Ionicons name="add" size={20} color={COLORS.textDark} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.featuresRow}>
        <View style={styles.feature}>
          <Ionicons name="leaf" size={16} color={COLORS.primary} />
          <Text style={styles.featureText}>طازجة يومياً</Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="leaf" size={16} color={COLORS.primary} />
          <Text style={styles.featureText}>من المزرعة مباشرة</Text>
        </View>
      </View>
    </View>
  );
}
