import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../constants/api";
import { authHeaders, errorMessage } from "../utils/api";

// المنتجات اللي عجبت العميل (القلب الأحمر)
const useWishlistStore = create((set, get) => ({
  ids: [],
  products: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_URL}/wishlist`, { headers: authHeaders() });
      set({ ids: res.data.ids, products: res.data.products });
    } catch (error) {
      console.log("wishlist fetch error", error.message);
    } finally {
      set({ loading: false });
    }
  },

  // القلب بيتلون فوراً، ولو الباك فشل بيرجع
  // product: بيانات المنتج (عشان تظهر في كروت الحساب فوراً)
  toggle: async (product) => {
    const id = product._id;
    const { ids, products } = get();
    const liked = ids.includes(id);

    set(
      liked
        ? { ids: ids.filter((x) => x !== id), products: products.filter((p) => p._id !== id) }
        : { ids: [id, ...ids], products: [product, ...products] },
    );

    try {
      const res = liked
        ? await axios.delete(`${API_URL}/wishlist/${id}`, { headers: authHeaders() })
        : await axios.post(`${API_URL}/wishlist/${id}`, null, { headers: authHeaders() });
      set({ ids: res.data.ids, products: res.data.products });
      return { ok: true };
    } catch (error) {
      set({ ids, products });
      return { ok: false, message: errorMessage(error, "تعذر تحديث المفضلة") };
    }
  },

  reset: () => set({ ids: [], products: [] }),
}));

export default useWishlistStore;
