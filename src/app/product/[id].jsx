import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import styles from "../../assets/styles/product.styles";
import ProductHero from "../../components/product/ProductHero";
import ProductInfo from "../../components/product/ProductInfo";
import AddToCartBar from "../../components/product/AddToCartBar";
import useProductActions from "../../hooks/useProductActions";
import useWishlistStore from "../../store/wishlistStore";

// expo-router بيرجع الـ params كنصوص (أو مصفوفة)
const str = (v) => (Array.isArray(v) ? v[0] : v) ?? "";
const num = (v) => {
  const n = Number(str(v));
  return str(v) !== "" && !Number.isNaN(n) ? n : null;
};

export default function ProductDetailsScreen() {
  const params = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);

  const price = num(params.price);
  const discount = num(params.discount) || 0;

  const product = {
    name: str(params.name),
    category: str(params.category),
    description: str(params.description),
    unit: str(params.unit),
    price,
    // السعر بعد الخصم جاي من الباك (لو مش موجود بنحسبه)
    finalPrice:
      num(params.finalPrice) ??
      (price != null ? Math.round(price * (1 - discount / 100) * 100) / 100 : null),
    discount,
    rating: num(params.rating) || 0,
    reviewsCount: num(params.reviewsCount) || 0,
  };

  const { addToCart, toggleLike } = useProductActions();
  const productId = str(params.id);
  const liked = useWishlistStore((s) => s.ids.includes(productId));

  // بيانات المنتج (بتتبعت للمفضلة عشان تظهر في كروت الحساب)
  const productData = {
    _id: productId,
    name: product.name,
    category: product.category,
    description: product.description,
    unit: product.unit,
    price: product.price,
    discount: product.discount,
    finalPrice: product.finalPrice,
    image: str(params.image),
    detailImage: str(params.detailImage),
    rating: product.rating,
    reviewsCount: product.reviewsCount,
  };

  // بيضيف بالكمية اللي العميل اختارها
  const handleAddToCart = () => addToCart(productData, quantity);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* صورة التفاصيل، ولو مش موجودة صورة الكارت */}
        <ProductHero
          image={str(params.detailImage) || str(params.image)}
          liked={liked}
          onToggleLike={() => toggleLike(productData)}
        />
        <View style={styles.sheet}>
          <ProductInfo product={product} />
        </View>
      </ScrollView>

      <AddToCartBar
        quantity={quantity}
        onChangeQuantity={setQuantity}
        onAddToCart={handleAddToCart}
        unit={product.unit}
        unitPrice={product.finalPrice}
      />
    </View>
  );
}
