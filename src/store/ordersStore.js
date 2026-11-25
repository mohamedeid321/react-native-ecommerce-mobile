import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../constants/api";
import { authHeaders, errorMessage } from "../utils/api";
import useCartStore from "./cartStore";

const upsert = (list, order) => {
  const exists = list.some((o) => o._id === order._id);
  return exists ? list.map((o) => (o._id === order._id ? order : o)) : [order, ...list];
};

// طلبات العميل
const useOrdersStore = create((set, get) => ({
  orders: [],
  loading: false,
  loaded: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_URL}/orders/my?limit=50`, { headers: authHeaders() });
      set({ orders: res.data.orders, loaded: true });
    } catch (error) {
      console.log("orders fetch error", error.message);
    } finally {
      set({ loading: false });
    }
  },

  // تأكيد الطلب من السلة الحالية
  place: async () => {
    try {
      const res = await axios.post(`${API_URL}/orders`, null, { headers: authHeaders() });
      set({ orders: upsert(get().orders, res.data.order) });
      useCartStore.getState().reset(); // السلة اتفضت في الباك
      useCartStore.getState().fetch();
      return { ok: true, order: res.data.order };
    } catch (error) {
      return {
        ok: false,
        code: error.response?.data?.code,
        message: errorMessage(error, "تعذر تأكيد الطلب"),
      };
    }
  },

  // بيجيب طلب واحد (لشاشة التتبع) ويحدّثه في القايمة
  fetchOne: async (id) => {
    try {
      const res = await axios.get(`${API_URL}/orders/${id}`, { headers: authHeaders() });
      set({ orders: upsert(get().orders, res.data.order) });
      return res.data.order;
    } catch {
      return null;
    }
  },

  cancel: async (id) => {
    try {
      const res = await axios.patch(`${API_URL}/orders/${id}/cancel`, null, {
        headers: authHeaders(),
      });
      set({ orders: upsert(get().orders, res.data.order) });
      return { ok: true, message: res.data.message };
    } catch (error) {
      await get().fetchOne(id); // نجيب الحالة الحالية (ممكن الـ admin غيّرها)
      return { ok: false, message: errorMessage(error, "تعذر إلغاء الطلب") };
    }
  },

  reset: () => set({ orders: [], loaded: false }),
}));

export default useOrdersStore;
