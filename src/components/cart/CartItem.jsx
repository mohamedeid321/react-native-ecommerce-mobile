import React, { memo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/cart.styles";
import { money } from "../../utils/format";

const MAX_QTY = 99;

// كارت منتج في السلة: صورة (يمين) + اسم + سعر الوحدة + خصم + عداد بالوحدة + إجمالي المنتج
function CartItem({ item, onChangeQuantity, onRemove, onPress }) {
  const hasDiscount = item.discount > 0 && item.unitPrice < item.price;
  const unit = item.unit ? ` / ${item.unit}` : "";
  const max = Math.min(MAX_QTY, item.stock || MAX_QTY);

  return (
    <TouchableOpacity style={styles.item} activeOpacity={0.9} onPress={() => onPress?.(item)}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      ) : (
        <View style={styles.itemImage} />
      )}

      <View style={styles.itemBody}>
        <View style={styles.itemTopRow}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <TouchableOpacity
            style={styles.trashButton}
            onPress={() => onRemove(item)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={19} color={COLORS.danger} />
          </TouchableOpacity>
        </View>

        <View style={styles.unitPriceRow}>
          <Text style={styles.unitPrice}>
            {money(item.unitPrice)}
            {unit}
          </Text>
          {hasDiscount && (
            <>
              <Text style={styles.oldPrice}>{item.price.toFixed(2)}</Text>
              <View style={styles.discountChip}>
                <Text style={styles.discountChipText}>-{item.discount}%</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.itemBottomRow}>
          <Text style={styles.lineTotal}>{money(item.lineTotal ?? item.unitPrice * item.quantity)}</Text>

          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => onChangeQuantity(item, Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1}
            >
              <Ionicons
                name="remove"
                size={18}
                color={item.quantity <= 1 ? COLORS.border : COLORS.textDark}
              />
            </TouchableOpacity>
            <Text style={styles.stepperValue}>
              {item.quantity}
              {item.unit ? ` ${item.unit}` : ""}
            </Text>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => onChangeQuantity(item, Math.min(max, item.quantity + 1))}
              disabled={item.quantity >= max}
            >
              <Ionicons
                name="add"
                size={18}
                color={item.quantity >= max ? COLORS.border : COLORS.textDark}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(CartItem);
