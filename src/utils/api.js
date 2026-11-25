import { useAuthStore } from "../store/authStore";

// هيدر التوكن للطلبات اللي محتاجة تسجيل دخول
export const authHeaders = () => {
  const { token } = useAuthStore.getState();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// رسالة الخطأ اللي جاية من الباك (أو رسالة بديلة)
export const errorMessage = (error, fallback = "حصلت مشكلة، حاول تاني") =>
  error?.response?.data?.message || fallback;

export const round2 = (n) => Math.round(n * 100) / 100;
