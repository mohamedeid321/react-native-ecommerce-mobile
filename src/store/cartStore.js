import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../constants/api";
import { authHeaders, errorMessage, round2 } from "../utils/api";

const EMPTY = { items: [], count: 0, subtotal: 0, deliveryFee: 0, total: 0 };

// بيحسب الإجماليات محلياً (للتعديل الفوري قبل رد الباك)
const withTotals = (items, deliveryFee) => {
  const subtotal = round2(items.reduce((s, i) => s + i.unitPrice * i.quantity, 0));
  const fee = items.length ? deliveryFee || 0 : 0;
  return { items, count: items.length, subtotal, deliveryFee: fee, total: round2(subtotal + fee) };
};

// سلة العميل (متخزنة في الباك)
const useCartStore = create((set, get) => ({
  ...EMPTY,
  baseFee: 0, // سعر التوصيل اللي الباك بعته
  loading: false,
  loaded: false,

  apply: (cart) => set({ ...cart, baseFee: cart.deliveryFee || get().baseFee, loaded: true }),

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_URL}/cart`, { headers: authHeaders() });
      get().apply(res.data.cart);
    } catch (error) {
      console.log("cart fetch error", error.message);
    } finally {
      set({ loading: false });
    }
  },

  add: async (productId, quantity = 1) => {
    try {
      const res = await axios.post(
        `${API_URL}/cart`,
        { productId, quantity },
        { headers: authHeaders() },
      );
      get().apply(res.data.cart);
      return { ok: true, message: res.data.message };
    } catch (error) {
      return { ok: false, message: errorMessage(error, "تعذرت الإضافة إلى السلة") };
    }
  },

  // تعديل الكمية: بيتغير فوراً وبيتبعت للباك، ولو فشل بنرجع لحالة الباك
  setQuantity: async (productId, quantity) => {
    const { items, baseFee } = get();
    const next = items.map((i) => (i.product === productId ? { ...i, quantity } : i));
    set(withTotals(next, baseFee));
    try {
      await axios.put(`${API_URL}/cart/${productId}`, { quantity }, { headers: authHeaders() });
      return { ok: true };
    } catch (error) {
      await get().fetch();
      return { ok: false, message: errorMessage(error, "تعذر تعديل الكمية") };
    }
  },

  remove: async (productId) => {
    const { items, baseFee } = get();
    set(withTotals(items.filter((i) => i.product !== productId), baseFee));
    try {
      await axios.delete(`${API_URL}/cart/${productId}`, { headers: authHeaders() });
      return { ok: true };
    } catch (error) {
      await get().fetch();
      return { ok: false, message: errorMessage(error, "تعذر حذف المنتج") };
    }
  },

  reset: () => set({ ...EMPTY, baseFee: 0, loaded: false }),
}));

export default useCartStore;
