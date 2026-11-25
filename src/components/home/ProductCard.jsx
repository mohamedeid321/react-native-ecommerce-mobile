import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/productCard.styles";
import useProductActions from "../../hooks/useProductActions";
import useWishlistStore from "../../store/wishlistStore";

const round2 = (n) => Math.round(n * 100) / 100;

// كارت منتج واحد (بيتداس عليه ويفتح صفحة المنتج)
// الأسعار جاية من الباك: price = قبل الخصم، finalPrice = بعد الخصم
export default function ProductCard({ item, onPress }) {
  const imageUri = item.image?.url || item.image;
  const { addToCart, toggleLike } = useProductActions();
  const liked = useWishlistStore((s) => s.ids.includes(item._id));

  const price = Number(item.price) || 0;
  const discount = Number(item.discount) || 0;
  const finalPrice =
    item.finalPrice != null
      ? Number(item.finalPrice)
      : round2(price * (1 - discount / 100));
  const hasDiscount = discount > 0 && finalPrice < price;
  const unit = item.unit ? ` / ${item.unit}` : "";

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {/* شارة الخصم (شمال) + القلب (يمين) */}
      <View style={styles.topRow}>
        {hasDiscount ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>خصم {discount}%</Text>
          </View>
        ) : (
          <View />
        )}
        <TouchableOpacity style={styles.heartButton} onPress={() => toggleLike(item)}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={17}
            color={liked ? COLORS.danger : COLORS.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}

      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>

      <View style={styles.priceRow}>
        <View style={styles.priceBlock}>
          <Text style={styles.priceLine}>
            <Text style={styles.price}>{finalPrice.toFixed(2)}</Text>
            <Text style={styles.currency}> ج.م{unit}</Text>
          </Text>
          {hasDiscount && (
            <Text style={styles.oldPrice}>{price.toFixed(2)} ج.م</Text>
          )}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
          <Ionicons name="cart-outline" size={17} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
