import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem } from "./shop";

const KEY = "narayan-cart-v1";

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: CartItem) => void;
  remove: (id: string, size: string | null) => void;
  setQty: (id: string, size: string | null, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const value = useMemo<CartCtx>(() => {
    const same = (a: CartItem, id: string, size: string | null) => a.id === id && a.size === size;
    return {
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.qty * i.price, 0),
      add: (item) =>
        setItems((prev) => {
          const found = prev.find((p) => same(p, item.id, item.size));
          if (found) {
            return prev.map((p) => (same(p, item.id, item.size) ? { ...p, qty: p.qty + item.qty } : p));
          }
          return [...prev, item];
        }),
      remove: (id, size) => setItems((prev) => prev.filter((p) => !same(p, id, size))),
      setQty: (id, size, qty) =>
        setItems((prev) =>
          prev.map((p) => (same(p, id, size) ? { ...p, qty: Math.max(1, qty) } : p)),
        ),
      clear: () => setItems([]),
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
