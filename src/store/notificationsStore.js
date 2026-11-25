import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../constants/api";
import { authHeaders } from "../utils/api";

// إشعارات داخل التطبيق + عداد الجرس
const useNotificationsStore = create((set, get) => ({
  items: [],
  unreadCount: 0,
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_URL}/notifications`, { headers: authHeaders() });
      set({ items: res.data.notifications, unreadCount: res.data.unreadCount });
    } catch (error) {
      console.log("notifications fetch error", error.message);
    } finally {
      set({ loading: false });
    }
  },

  markRead: async (id) => {
    const { items, unreadCount } = get();
    const target = items.find((n) => n._id === id);
    if (!target || target.read) return;
    set({
      items: items.map((n) => (n._id === id ? { ...n, read: true } : n)),
      unreadCount: Math.max(0, unreadCount - 1),
    });
    try {
      await axios.post(`${API_URL}/notifications/${id}/read`, null, { headers: authHeaders() });
    } catch {
      get().fetch();
    }
  },

  markAllRead: async () => {
    set({ items: get().items.map((n) => ({ ...n, read: true })), unreadCount: 0 });
    try {
      await axios.post(`${API_URL}/notifications/read-all`, null, { headers: authHeaders() });
    } catch {
      get().fetch();
    }
  },

  reset: () => set({ items: [], unreadCount: 0 }),
}));

export default useNotificationsStore;
