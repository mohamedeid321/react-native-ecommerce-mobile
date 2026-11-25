import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "recent_searches";
const MAX = 8;

// آخر عمليات بحث (محفوظة على الجهاز)
export default function useRecentSearches() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {}
    })();
  }, []);

  const persist = async (next) => {
    setItems(next);
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  const add = useCallback(
    (term) => {
      const t = term.trim();
      if (!t) return;
      persist([t, ...items.filter((x) => x !== t)].slice(0, MAX));
    },
    [items],
  );
  const remove = (term) => persist(items.filter((x) => x !== term));
  const clear = () => persist([]);

  return { items, add, remove, clear };
}
