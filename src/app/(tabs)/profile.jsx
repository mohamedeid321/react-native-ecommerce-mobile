import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import COLORS from "../../constants/colors";
import { ROW, SCREEN_PADDING } from "../../constants/layout";
import { useAuthStore } from "../../store/authStore";
import useWishlistStore from "../../store/wishlistStore";
import useOrdersStore from "../../store/ordersStore";
import useGoToProduct from "../../hooks/useGoToProduct";
import ProfileHeader from "../../components/profile/ProfileHeader";
import HorizontalSection from "../../components/profile/HorizontalSection";
import ProductCard from "../../components/home/ProductCard";
import OrderTicket from "../../components/orders/OrderTicket";
import useNotificationsStore from "../../store/notificationsStore";
import { unregisterPush } from "../../hooks/usePushNotifications";

// الحساب: بيانات العميل → تسجيل الخروج → معلومات التوصيل → منتجات أعجبتك → سجل الطلبات
export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const goToProduct = useGoToProduct();
  const liked = useWishlistStore((s) => s.products);
  const orders = useOrdersStore((s) => s.orders);
  const isAdmin = user?.role === "admin";
  const unread = useNotificationsStore((s) => s.unreadCount);

  const handleLogout = () => {
    Alert.alert("تسجيل الخروج", "هل تريد تسجيل الخروج؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "تسجيل الخروج",
        style: "destructive",
                onPress: async () => {
          await unregisterPush(); // الجهاز يبطل يستقبل إشعارات الحساب ده
          await logout();
          // بعد الخروج (عميل أو admin) نرجع لشاشة البداية: يكمل كضيف أو يسجل دخول
          router.replace("/welcome");
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ProfileHeader user={user} />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deliveryButton}
        onPress={() => router.push("/notifications")}
        activeOpacity={0.85}
      >
        <View style={styles.deliveryIcon}>
          <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
        </View>
        <Text style={styles.deliveryText}>الإشعارات</Text>
        {unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unread > 9 ? "9+" : unread}</Text>
          </View>
        )}
        <Ionicons name="chevron-back" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>

      {!isAdmin && (
        <>
          <TouchableOpacity
            style={styles.deliveryButton}
            onPress={() => router.push("/delivery-info")}
            activeOpacity={0.85}
          >
            <View style={styles.deliveryIcon}>
              <Ionicons name="location-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.deliveryText}>معلومات التوصيل</Text>
            <Ionicons name="chevron-back" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <HorizontalSection
            title="منتجات أعجبتك"
            data={liked}
            keyExtractor={(p) => p._id}
            emptyText="لم تضف أي منتجات للمفضلة بعد"
            renderItem={({ item }) => (
              <ProductCard item={item} onPress={() => goToProduct(item)} />
            )}
          />

          <HorizontalSection
            title="سجل الطلبات"
            data={orders}
            keyExtractor={(o) => o._id}
            emptyText="لا توجد طلبات بعد"
            renderItem={({ item, index }) => (
              <OrderTicket
                order={item}
                index={index}
                onPress={(o) => router.push({ pathname: "/order/[id]", params: { id: o._id } })}
              />
            )}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SCREEN_PADDING, paddingTop: 12, paddingBottom: 32 },
  logoutButton: {
    flexDirection: ROW,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f3c4bf",
    backgroundColor: "#fdecea",
    marginTop: 12,
  },
  logoutText: { fontSize: 15, fontWeight: "800", color: COLORS.danger },
  deliveryButton: {
    flexDirection: ROW,
    alignItems: "center",
    gap: 12,
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  deliveryIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadBadge: { minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 6, backgroundColor: COLORS.danger, justifyContent: "center", alignItems: "center" },
  unreadText: { color: COLORS.white, fontSize: 11, fontWeight: "800" },
  deliveryText: { flex: 1, fontSize: 15, fontWeight: "700", color: COLORS.textDark, textAlign: "right" },
});
