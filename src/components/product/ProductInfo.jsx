import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import CATEGORIES from "../../constants/categories";
import styles from "../../assets/styles/product.styles";

const formatCount = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);

// الاسم، التقييم، السعر، الخصم، الوصف
// price = السعر قبل الخصم، finalPrice = بعد الخصم (جاي من الباك)
// التقييم والخصم والوحدة والوصف بيظهروا بس لو موجودين في بيانات المنتج
export default function ProductInfo({ product }) {
  const {
    name,
    category,
    price,
    finalPrice,
    rating,
    reviewsCount,
    discount,
    unit,
    description,
  } = product;

  const categoryName = CATEGORIES.find((c) => c.id === category)?.ar ?? category;
  const hasPrice = finalPrice != null;
  const hasDiscount = hasPrice && price != null && discount > 0 && finalPrice < price;

  return (
    <View>
      <Text style={styles.name}>{name}</Text>
      {!!categoryName && <Text style={styles.category}>{categoryName}</Text>}

      {/* منتج طازج (يمين) + التقييم (شمال) */}
      <View style={styles.metaRow}>
        <View style={styles.freshChip}>
          <Text style={styles.freshChipText}>منتج طازج</Text>
        </View>

        {rating > 0 && (
          <View style={styles.ratingRow}>
            <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
            <Ionicons name="star" size={16} color={COLORS.orange} />
            {reviewsCount > 0 && (
              <Text style={styles.ratingCount}> ({formatCount(reviewsCount)})</Text>
            )}
          </View>
        )}
      </View>

      {/* السعر بعد الخصم (يمين) + شارة الخصم (شمال) */}
      {hasPrice && (
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>
              {finalPrice.toFixed(2)} ج.م{unit ? ` / ${unit}` : ""}
            </Text>
            {hasDiscount && (
              <Text style={styles.oldPrice}>{price.toFixed(2)} ج.م</Text>
            )}
          </View>

          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>خصم {discount}%</Text>
            </View>
          )}
        </View>
      )}

      {!!description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}
