import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../constants/api";

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 350;

// بحث بالاسم والوصف مع صفحات (Pagination) وتأخير بسيط أثناء الكتابة
export default function useSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(false);
  const requestRef = useRef(0);
  const queryRef = useRef("");

  const run = useCallback(async (q, page) => {
    const myId = ++requestRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${API_URL}/products/search?q=${encodeURIComponent(q)}&page=${page}&limit=${PAGE_SIZE}`,
      );
      if (myId !== requestRef.current) return;
      pageRef.current = page;
      hasMoreRef.current = !!res.data.hasMore;
      setResults((prev) => {
        if (page === 1) return res.data.products;
        const ids = new Set(prev.map((p) => p._id));
        return [...prev, ...res.data.products.filter((p) => !ids.has(p._id))];
      });
    } catch {
      if (myId === requestRef.current) setError("تعذر البحث، حاول تاني");
    } finally {
      if (myId === requestRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = query.trim();
    queryRef.current = q;
    if (!q) {
      requestRef.current++; // نلغي أي طلب شغال
      setResults([]);
      setLoading(false);
      setError(null);
      hasMoreRef.current = false;
      return;
    }
    const timer = setTimeout(() => run(q, 1), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, run]);

  const loadMore = () => {
    if (!loading && hasMoreRef.current && queryRef.current) {
      run(queryRef.current, pageRef.current + 1);
    }
  };

  return { results, loading, error, loadMore, searched: !!query.trim() };
}
