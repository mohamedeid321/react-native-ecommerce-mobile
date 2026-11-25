import React, { useCallback } from "react";
import { View, Text, FlatList, RefreshControl, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import COLORS from "../../constants/colors";
import { SCREEN_PADDING } from "../../constants/layout";
import { useAuthStore } from "../../store/authStore";
import useOrdersStore from "../../store/ordersStore";
import LoginPrompt from "../../components/common/LoginPrompt";
import OrderTicket from "../../components/orders/OrderTicket";
import AdminOrders from "../../components/admin/AdminOrders";

// الطلبات: الزائر → تسجيل دخول | العميل → تيكتات طلباته | الـ admin → جدول الطلبات
export default function OrdersScreen() {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);

  if (!token) {
    return (
      <LoginPrompt
        icon="receipt-outline"
        title="الطلبات"
        message="رجاء قم بتسجيل الدخول لمتابعة طلباتك"
      />
    );
  }
  if (role === "admin") return <AdminOrders />;
  return <CustomerOrders />;
}

function CustomerOrders() {
  const router = useRouter();
  const orders = useOrdersStore((s) => s.orders);
  const loading = useOrdersStore((s) => s.loading);
  const loaded = useOrdersStore((s) => s.loaded);
  const fetch = useOrdersStore.getState().fetch;

  // نحدّث الحالات كل ما العميل يفتح التاب
  useFocusEffect(
    useCallback(() => {
      fetch();
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>طلباتي</Text>

      {!loaded && loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={orders}
          numColumns={2}
          keyExtractor={(o) => o._id}
          columnWrapperStyle={styles.columns}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading && loaded}
              onRefresh={fetch}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          renderItem={({ item, index }) => (
            <OrderTicket
              order={item}
              index={index}
              width={156}
              onPress={(o) => router.push({ pathname: "/order/[id]", params: { id: o._id } })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <View style={styles.emptyIcon}>
                <Ionicons name="receipt-outline" size={44} color={COLORS.primary} />
              </View>
              <Text style={styles.emptyTitle}>لا توجد طلبات بعد</Text>
              <Text style={styles.emptyText}>طلباتك هتظهر هنا بعد أول عملية شراء</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: { fontSize: 22, fontWeight: "800", color: COLORS.textDark, textAlign: "center", paddingTop: 12, paddingBottom: 8 },
  list: { paddingHorizontal: SCREEN_PADDING, paddingTop: 10, paddingBottom: 20, flexGrow: 1 },
  columns: { justifyContent: "space-evenly", flexDirection: "row-reverse" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 60 },
  emptyIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textDark },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, marginTop: 6 },
});
