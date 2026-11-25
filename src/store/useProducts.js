import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../constants/api";
import { useAuthStore } from "./authStore.js";

const PAGE_SIZE = 6; // عدد المنتجات في كل تحميل

// بيجيب المنتجات من الباك 6 بـ 6 (Pagination) + Pull to refresh
export default function useProducts() {
  const { token } = useAuthStore();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);
  const productsRef = useRef([]);

  const fetchPage = useCallback(
    async (pageNumber, { append = false, isRefresh = false } = {}) => {
      if (loadingRef.current) return;
      if (append && !hasMoreRef.current) return;

      loadingRef.current = true;
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const response = await axios.get(
          `${API_URL}/products?page=${pageNumber}&limit=${PAGE_SIZE}`,
          // الزائر (guest) ممكن يتفرج من غير توكن
          { headers: token ? { Authorization: `Bearer ${token}` } : {} },
        );
        const data = response.data.products || response.data;

        const current = append ? productsRef.current : [];
        const ids = new Set(current.map((p) => p._id));
        const fresh = data.filter((p) => !ids.has(p._id));

        // لو مفيش حاجة جديدة نوقف التحميل
        if (data.length < PAGE_SIZE || fresh.length === 0) {
          hasMoreRef.current = false;
        }

        pageRef.current = pageNumber;
        productsRef.current = [...current, ...fresh];
        setProducts(productsRef.current);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Error fetching products:", error);
        }
      } finally {
        loadingRef.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token],
  );

  // أول تحميل (وإعادة التحميل لما التوكن يتغير)
  useEffect(() => {
    hasMoreRef.current = true;
    pageRef.current = 1;
    fetchPage(1);
  }, [token]);

  const refresh = () => {
    hasMoreRef.current = true;
    fetchPage(1, { isRefresh: true });
  };

  const loadMore = () => {
    fetchPage(pageRef.current + 1, { append: true });
  };

  return { products, loading, refreshing, loadMore, refresh };
}
