import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import useDeliveryStore from "../store/deliveryStore";
import useOrdersStore from "../store/ordersStore";
import useNotificationsStore from "../store/notificationsStore";

// بيجيب بيانات العميل (سلة، مفضلة، توصيل، طلبات، إشعارات) أول ما يسجل دخول،
// وبيمسحها من الذاكرة أول ما يخرج
// استخدمه مرة واحدة في app/_layout.jsx
export default function useSyncUserData() {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);

  useEffect(() => {
    if (!token) {
      useCartStore.getState().reset();
      useWishlistStore.getState().reset();
      useDeliveryStore.getState().reset();
      useOrdersStore.getState().reset();
      useNotificationsStore.getState().reset();
      return;
    }
    useNotificationsStore.getState().fetch();
    if (role === "admin") return; // الـ admin ملوش سلة ولا مفضلة
    useCartStore.getState().fetch();
    useWishlistStore.getState().fetch();
    useDeliveryStore.getState().fetch();
    useOrdersStore.getState().fetch();
  }, [token, role]);
}
