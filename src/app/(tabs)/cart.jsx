import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/cart.styles";
import { useAuthStore } from "../../store/authStore";
import useCartStore from "../../store/cartStore";
import LoginPrompt from "../../components/common/LoginPrompt";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import useGoToProduct from "../../hooks/useGoToProduct";

// السلة: المنتجات بتتسكرول، والمجموع + التوصيل + الإجمالي + زرار الطلب ثابتين تحت
export default function CartScreen() {
  const token = useAuthStore((s) => s.token);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const goToProduct = useGoToProduct();

  const { items, count, subtotal, deliveryFee, total, loading, loaded } = useCartStore();
  const { fetch, setQuantity, remove } = useCartStore.getState();

  const handleQuantity = useCallback(async (item, quantity) => {
    const result = await setQuantity(item.product, quantity);
    if (!result.ok) Alert.alert("تنبيه", result.message);
  }, []);

  const handleRemove = useCallback((item) => {
    Alert.alert("حذف من السلة", `هل تريد حذف "${item.name}" من السلة؟`, [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => remove(item.product) },
    ]);
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <CartItem
        item={item}
        onChangeQuantity={handleQuantity}
        onRemove={handleRemove}
        onPress={(i) =>
          goToProduct({ _id: i.product, name: i.name, category: i.category, price: i.price,
            discount: i.discount, finalPrice: i.unitPrice, image: i.image, unit: i.unit })
        }
      />
    ),
    [handleQuantity, handleRemove],
  );

  if (!token) {
    return (
      <LoginPrompt
        icon="cart-outline"
        title="السلة"
        message="رجاء قم بتسجيل الدخول لإضافة المنتجات إلى السلة"
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>سلة التسوق</Text>
        {count > 0 && (
          <Text style={styles.subtitle}>
            {count} {count === 1 ? "منتج" : count === 2 ? "منتجان" : count <= 10 ? "منتجات" : "منتج"}
          </Text>
        )}
      </View>

      {!loaded && loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.product}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading && loaded}
              onRefresh={fetch}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <View style={styles.emptyIcon}>
                <Ionicons name="cart-outline" size={44} color={COLORS.primary} />
              </View>
              <Text style={styles.emptyTitle}>السلة فاضية</Text>
              <Text style={styles.emptyText}>أضف منتجات من الرئيسية وابدأ التسوق</Text>
            </View>
          }
        />
      )}

      {count > 0 && (
        <View style={styles.footer}>
          <CartSummary subtotal={subtotal} deliveryFee={deliveryFee} total={total} />
          <TouchableOpacity
            style={styles.orderButton}
            activeOpacity={0.85}
            onPress={() => router.push("/checkout")}
          >
            <Text style={styles.orderButtonText}>طلب الأوردر</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
