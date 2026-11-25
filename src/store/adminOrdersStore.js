import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../constants/api";
import { authHeaders, errorMessage } from "../utils/api";

const PAGE_SIZE = 15;
let requestId = 0; // نتجاهل الردود القديمة لما التبويب يتغير

// طلبات الـ admin: scope = current (الافتراضي) | finished
const useAdminOrdersStore = create((set, get) => ({
  scope: "current",
  orders: [],
  currentCount: 0,
  finishedCount: 0,
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
      const res = await axios.get(
        `${API_URL}/orders?scope=${state.scope}&page=${pageNumber}&limit=${PAGE_SIZE}`,
        { headers: authHeaders() },
      );
      if (myId !== requestId) return;

      const data = res.data.orders || [];
      const current = append ? get().orders : [];
      const ids = new Set(current.map((o) => o._id));
      const fresh = data.filter((o) => !ids.has(o._id));

      set({
        orders: [...current, ...fresh],
        currentCount: res.data.currentCount,
        finishedCount: res.data.finishedCount,
        page: pageNumber,
        hasMore: data.length >= PAGE_SIZE && fresh.length > 0,
        loading: false,
        refreshing: false,
      });
    } catch (error) {
      if (myId !== requestId) return;
      set({ loading: false, refreshing: false, error: errorMessage(error, "تعذر تحميل الطلبات") });
    }
  },

  load: () => get().fetchPage(1),
  refresh: () => get().fetchPage(1, { refresh: true }),
  loadMore: () => get().fetchPage(get().page + 1, { append: true }),

  setScope: (scope) => {
    if (get().scope === scope) return;
    set({ scope, orders: [], page: 0, hasMore: true });
    get().fetchPage(1);
  },

  fetchOne: async (id) => {
    try {
      const res = await axios.get(`${API_URL}/orders/${id}`, { headers: authHeaders() });
      return res.data.order;
    } catch {
      return null;
    }
  },

  // تغيير الحالة؛ لو الطلب خرج من التبويب الحالي (اتسلّم/اتلغى) بنشيله من القايمة
  updateStatus: async (id, status) => {
    try {
      const res = await axios.patch(
        `${API_URL}/orders/${id}/status`,
        { status },
        { headers: authHeaders() },
      );
      const order = res.data.order;
      const finished = order.status === "delivered" || order.status === "cancelled";
      const { scope, orders, currentCount, finishedCount } = get();
      const wasFinishedScope = scope === "finished";

      if (finished && !wasFinishedScope) {
        set({
          orders: orders.filter((o) => o._id !== id),
          currentCount: Math.max(0, currentCount - 1),
          finishedCount: finishedCount + 1,
        });
      } else {
        set({ orders: orders.map((o) => (o._id === id ? order : o)) });
      }
      return { ok: true, order, message: res.data.message };
    } catch (error) {
      return { ok: false, message: errorMessage(error, "تعذر تحديث الحالة") };
    }
  },
}));

export default useAdminOrdersStore;
