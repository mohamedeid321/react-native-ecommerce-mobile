import React, { memo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import CATEGORIES from "../../constants/categories";
import styles from "../../assets/styles/adminProducts.styles";

const money = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

// صف واحد في جدول المنتجات: الاسم | السعر | الفئة | تعديل | حذف
function ProductRow({ item, index, onEdit, onDelete, onToggleFeatured }) {
  const categoryName =
    CATEGORIES.find((c) => c.id === item.category)?.ar ?? item.category ?? "-";
  const final = item.finalPrice ?? item.price;
  const hasDiscount = item.discount > 0 && final < item.price;

  return (
    <View style={[styles.row, index % 2 === 1 && styles.rowAlt]}>
      {/* الاسم + الصورة + نجمة التمييز */}
      <View style={styles.nameCell}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder]} />
        )}
        <View style={styles.nameTextBox}>
          <Text style={styles.nameText} numberOfLines={2}>
            {item.name}
          </Text>
          <TouchableOpacity
            onPress={() => onToggleFeatured(item)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.starButton}
          >
            <Ionicons
              name={item.isFeatured ? "star" : "star-outline"}
              size={15}
              color={item.isFeatured ? COLORS.orange : COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* السعر (بعد الخصم) */}
      <View style={styles.priceCell}>
        <Text style={styles.priceText}>{money(final)}</Text>
        {hasDiscount && <Text style={styles.oldPriceText}>{money(item.price)}</Text>}
      </View>

      {/* الفئة */}
      <View style={styles.categoryCell}>
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText} numberOfLines={2}>
            {categoryName}
          </Text>
        </View>
      </View>

      {/* تعديل */}
      <View style={styles.actionCell}>
        <TouchableOpacity
          style={[styles.iconButton, styles.editButton]}
          onPress={() => onEdit(item)}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* حذف */}
      <View style={styles.actionCell}>
        <TouchableOpacity
          style={[styles.iconButton, styles.deleteButton]}
          onPress={() => onDelete(item)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(ProductRow);
