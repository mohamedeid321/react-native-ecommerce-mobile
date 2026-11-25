import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../constants/api";
import { useAuthStore } from "./authStore";

const PAGE_SIZE = 15; // عدد المنتجات في كل تحميل بالجدول

const authHeaders = () => {
  const { token } = useAuthStore.getState();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

// عشان لو الفلتر اتغير والرد القديم وصل متأخر نتجاهله
let requestId = 0;

// مخزن منتجات الـ admin: الجلب بالصفحات + فلتر القسم + الحذف + المميز + التحديث
const useAdminProducts = create((set, get) => ({
  products: [],
  category: null, // null = كل الأقسام
  page: 0,
  hasMore: true,
  loading: false,
  refreshing: false,
  error: null,

  fetchPage: async (pageNumber, { append = false, refresh = false } = {}) => {
    const state = get();
    if (append && (state.loading || state.refreshing || !state.hasMore)) return;

    const myId = ++requestId;
    set(refresh ? { refreshing: true, error: null } : { loading: true, error: null });

    try {
      let url = `${API_URL}/products?page=${pageNumber}&limit=${PAGE_SIZE}`;
      if (state.category) url += `&category=${encodeURIComponent(state.category)}`;

      const response = await axios.get(url, { headers: authHeaders() });
      if (myId !== requestId) return;

      const data = response.data.products || response.data || [];
      const current = append ? get().products : [];
      const ids = new Set(current.map((p) => p._id));
      const fresh = data.filter((p) => !ids.has(p._id));

      set({
        products: [...current, ...fresh],
        page: pageNumber,
        hasMore: data.length >= PAGE_SIZE && fresh.length > 0,
        loading: false,
        refreshing: false,
      });
    } catch (error) {
      if (myId !== requestId) return;
      set({
        loading: false,
        refreshing: false,
        error: errorMessage(error, "تعذر تحميل المنتجات"),
      });
    }
  },

  load: () => get().fetchPage(1),
  refresh: () => get().fetchPage(1, { refresh: true }),
  loadMore: () => get().fetchPage(get().page + 1, { append: true }),

  setCategory: (category) => {
    if (get().category === category) return;
    set({ category, products: [], page: 0, hasMore: true });
    get().fetchPage(1);
  },

  // بيضيف منتج جديد أو بيحدّث الموجود (بعد الإضافة / التعديل)
  upsertProduct: (product) => {
    if (!product?._id) return;
    const { category, products } = get();
    const exists = products.some((p) => p._id === product._id);
    const matchesFilter = !category || product.category === category;

    if (exists) {
      set({
        products: matchesFilter
          ? products.map((p) => (p._id === product._id ? product : p))
          : products.filter((p) => p._id !== product._id),
      });
    } else if (matchesFilter) {
      set({ products: [product, ...products] });
    }
  },

  // الحذف: الصف بيختفي فوراً، ولو الباك رفض بنرجعه مكانه
  removeProduct: async (id) => {
    const before = get().products;
    const index = before.findIndex((p) => p._id === id);
    const item = before[index];

    set({ products: before.filter((p) => p._id !== id) });

    try {
      await axios.delete(`${API_URL}/products/${id}`, { headers: authHeaders() });
      return { ok: true };
    } catch (error) {
      if (item) {
        set((state) => {
          if (state.products.some((p) => p._id === id)) return state;
          const list = [...state.products];
          list.splice(Math.min(index, list.length), 0, item);
          return { products: list };
        });
      }
      return { ok: false, message: errorMessage(error, "تعذر حذف المنتج") };
    }
  },

  // تمييز المنتج (isFeatured): بيتغير فوراً وبيرجع لو فشل
  toggleFeatured: async (id) => {
    const flip = (value) =>
      set((state) => ({
        products: state.products.map((p) =>
          p._id === id ? { ...p, isFeatured: value } : p,
        ),
      }));

    const current = get().products.find((p) => p._id === id);
    if (!current) return { ok: false };
    const previous = !!current.isFeatured;

    flip(!previous);
    try {
      await axios.patch(`${API_URL}/products/${id}/featured`, null, {
        headers: authHeaders(),
      });
      return { ok: true };
    } catch (error) {
      flip(previous);
      return { ok: false, message: errorMessage(error, "تعذر تحديث التمييز") };
    }
  },
}));

export default useAdminProducts;
