"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { products, type Product } from "@/data/ecommerce";

export type CartItem = { key: string; productId: number; color: string; size: string; qty: number };
type Toast = { id: number; message: string; image?: string };

type StoreState = {
  cart: CartItem[];
  wishlist: number[];
  cartOpen: boolean;
  searchOpen: boolean;
  toasts: Toast[];
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  addToCart: (p: Product, opts?: { color?: string; size?: string; qty?: number }) => void;
  updateQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: number) => void;
  inWishlist: (id: number) => boolean;
  cartCount: number;
  subtotal: number;
  lines: (CartItem & { product: Product })[];
};

const StoreContext = createContext<StoreState | null>(null);
const CART_KEY = "lumen-cart";
const WISH_KEY = "lumen-wishlist";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem(CART_KEY) || "[]"));
      setWishlist(JSON.parse(localStorage.getItem(WISH_KEY) || "[]"));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart, ready]);
  useEffect(() => { if (ready) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist)); }, [wishlist, ready]);
  useEffect(() => {
    document.body.style.overflow = cartOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen, searchOpen]);

  const toast = useCallback((message: string, image?: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, image }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const addToCart: StoreState["addToCart"] = useCallback((p, opts = {}) => {
    const color = opts.color ?? p.colors[0].name;
    const size = opts.size ?? p.sizes[Math.min(2, p.sizes.length - 1)];
    const qty = opts.qty ?? 1;
    const key = `${p.id}-${color}-${size}`;
    setCart((c) => {
      const found = c.find((i) => i.key === key);
      return found ? c.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i)) : [...c, { key, productId: p.id, color, size, qty }];
    });
    toast(`${p.name} added to bag`, p.images[0]);
  }, [toast]);

  const toggleWishlist = useCallback((id: number) => {
    setWishlist((w) => {
      const has = w.includes(id);
      const p = products.find((x) => x.id === id);
      if (p) toast(has ? `Removed ${p.name} from wishlist` : `Saved ${p.name} to wishlist`, p.images[0]);
      return has ? w.filter((x) => x !== id) : [...w, id];
    });
  }, [toast]);

  const value = useMemo<StoreState>(() => {
    const lines = cart.flatMap((i) => {
      const product = products.find((p) => p.id === i.productId);
      return product ? [{ ...i, product }] : [];
    });
    return {
      cart, wishlist, cartOpen, searchOpen, toasts, setCartOpen, setSearchOpen, addToCart, toggleWishlist,
      updateQty: (key, qty) => setCart((c) => c.map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i))),
      removeFromCart: (key) => setCart((c) => c.filter((i) => i.key !== key)),
      clearCart: () => setCart([]),
      inWishlist: (id) => wishlist.includes(id),
      cartCount: cart.reduce((s, i) => s + i.qty, 0),
      subtotal: lines.reduce((s, l) => s + l.qty * l.product.price, 0),
      lines,
    };
  }, [cart, wishlist, cartOpen, searchOpen, toasts, addToCart, toggleWishlist]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
