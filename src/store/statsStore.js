import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../constants/api";
import { authHeaders, errorMessage } from "../utils/api";

// إحصائيات الـ admin (range = 7 أو 30 يوم)
const useStatsStore = create((set, get) => ({
  range: 7,
  data: null,
  loading: false,
  error: null,

  fetch: async (range = get().range) => {
    set({ range, loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/stats?range=${range}`, { headers: authHeaders() });
      if (get().range === range) set({ data: res.data, loading: false });
    } catch (error) {
      set({ loading: false, error: errorMessage(error, "تعذر تحميل الإحصائيات") });
    }
  },
}));

export default useStatsStore;
