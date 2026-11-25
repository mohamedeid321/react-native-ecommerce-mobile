import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import styles from "../assets/styles/receipt.styles";
import ScreenHeader from "../components/common/ScreenHeader";
import Receipt from "../components/orders/Receipt";
import useCartStore from "../store/cartStore";
import useDeliveryStore from "../store/deliveryStore";
import useOrdersStore from "../store/ordersStore";
import { useAuthStore } from "../store/authStore";

// الفاتورة قبل التأكيد: المنتجات والإجماليات + زرار "تأكيد الطلب"
export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const { items, subtotal, deliveryFee, total, fetch: fetchCart } = useCartStore();
  const { info, loaded, fetch: fetchDelivery } = useDeliveryStore();
  const place = useOrdersStore((s) => s.place);
  const [submitting, setSubmitting] = useState(false);
  const [now] = useState(() => new Date());

  // نحدّث السلة ومعلومات التوصيل (ممكن اتغيروا)
  useEffect(() => {
    fetchCart();
    fetchDelivery();
  }, []);

  const goToDeliveryInfo = () => router.push("/delivery-info");
  const canConfirm = items.length > 0 && !!info && !submitting;

  const handleConfirm = async () => {
    setSubmitting(true);
    const result = await place();
    setSubmitting(false);

    if (result.ok) {
      router.replace({
        pathname: "/order-success",
        params: { id: result.order._id },
      });
      return;
    }
    if (result.code === "NO_DELIVERY_INFO") {
      Alert.alert("معلومات التوصيل", result.message, [
        { text: "إلغاء", style: "cancel" },
        { text: "إكمال المعلومات", onPress: goToDeliveryInfo },
      ]);
      return;
    }
    Alert.alert("تعذر تأكيد الطلب", result.message);
    fetchCart(); // ممكن الكميات اتغيرت
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="الفاتورة" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Receipt
          items={items}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          customerName={user?.username}
          delivery={info}
          date={now}
        />

        {loaded && !info && (
          <View style={styles.warning}>
            <Ionicons name="location-outline" size={24} color={COLORS.orange} />
            <Text style={styles.warningText}>أكمل معلومات التوصيل عشان نقدر نوصّل طلبك</Text>
            <TouchableOpacity style={styles.warningButton} onPress={goToDeliveryInfo}>
              <Text style={styles.warningButtonText}>إكمال</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[styles.confirmButton, !canConfirm && { opacity: 0.5 }]}
          activeOpacity={0.85}
          disabled={!canConfirm}
          onPress={handleConfirm}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.confirmText}>تأكيد الطلب</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
