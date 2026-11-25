import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../constants/api";
import { authHeaders, errorMessage } from "../utils/api";

// معلومات التوصيل (جزء من حساب العميل)
const useDeliveryStore = create((set) => ({
  info: null,
  loaded: false,
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_URL}/delivery-info`, { headers: authHeaders() });
      set({ info: res.data.deliveryInfo, loaded: true });
    } catch (error) {
      console.log("delivery fetch error", error.message);
    } finally {
      set({ loading: false });
    }
  },

  save: async (values) => {
    try {
      const res = await axios.put(`${API_URL}/delivery-info`, values, { headers: authHeaders() });
      set({ info: res.data.deliveryInfo, loaded: true });
      return { ok: true, message: res.data.message };
    } catch (error) {
      return { ok: false, message: errorMessage(error, "تعذر حفظ معلومات التوصيل") };
    }
  },

  reset: () => set({ info: null, loaded: false }),
}));

export default useDeliveryStore;
