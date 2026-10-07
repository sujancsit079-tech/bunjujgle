"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  defaultSettings, dict, seedOrders, seedProducts,
  type Address, type Locale, type Order, type OrderStatus, type Product, type Settings, type TKey,
} from "@/data/ecommerce";

export type CartItem = { key: string; productId: number; color: string; size: string; qty: number };
export type User = { name: string; email: string; password: string; phone?: string; joined: string };
export type Review = { productId: number; name: string; rating: number; title: string; text: string; date: string };
type Toast = { id: number; message: string; image?: string };

/** Tiny persisted state hook. Loads after mount to keep SSR/hydration stable. */
function usePersisted<T>(key: string, initial: T, ready: boolean, setLoaded: (k: string) => void) {
  const [value, setValue] = useState<T>(initial);
  const loaded = useRef(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(key); if (raw !== null) setValue(JSON.parse(raw)); } catch {}
    loaded.current = true; setLoaded(key);
  }, [key, setLoaded]);
  useEffect(() => { if (loaded.current && ready) localStorage.setItem(key, JSON.stringify(value)); }, [key, value, ready]);
  return [value, setValue] as const;
}

const KEYS = ["cart", "wishlist", "products", "orders", "users", "session", "addresses", "reviews", "recent", "searches", "theme", "locale", "settings"] as const;
const k = (s: string) => `lumen-${s}`;

function useStoreState() {
  const [loadedKeys, setLoadedKeys] = useState<Set<string>>(new Set());
  const markLoaded = useCallback((key: string) => setLoadedKeys((s) => (s.has(key) ? s : new Set(s).add(key))), []);
  const ready = loadedKeys.size >= KEYS.length;

  const [cart, setCart] = usePersisted<CartItem[]>(k("cart"), [], ready, markLoaded);
  const [wishlist, setWishlist] = usePersisted<number[]>(k("wishlist"), [], ready, markLoaded);
  const [products, setProducts] = usePersisted<Product[]>(k("products"), seedProducts, ready, markLoaded);
  const [orders, setOrders] = usePersisted<Order[]>(k("orders"), seedOrders, ready, markLoaded);
  const [users, setUsers] = usePersisted<User[]>(k("users"), [], ready, markLoaded);
  const [session, setSession] = usePersisted<string | null>(k("session"), null, ready, markLoaded);
  const [addresses, setAddresses] = usePersisted<Address[]>(k("addresses"), [], ready, markLoaded);
  const [reviews, setReviews] = usePersisted<Review[]>(k("reviews"), [], ready, markLoaded);
  const [recent, setRecent] = usePersisted<number[]>(k("recent"), [], ready, markLoaded);
  const [searches, setSearches] = usePersisted<string[]>(k("searches"), [], ready, markLoaded);
  const [theme, setTheme] = usePersisted<"light" | "dark">(k("theme"), "light", ready, markLoaded);
  const [locale, setLocale] = usePersisted<Locale>(k("locale"), "en", ready, markLoaded);
  const [settings, setSettings] = usePersisted<Settings>(k("settings"), defaultSettings, ready, markLoaded);

  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickView, setQuickView] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    document.body.style.overflow = cartOpen || searchOpen || quickView !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen, searchOpen, quickView]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearchOpen((v) => !v); }
      if (e.key === "Escape") { setSearchOpen(false); setQuickView(null); setCartOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toast = useCallback((message: string, image?: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, image }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const t = useCallback((key: TKey) => dict[locale]?.[key] ?? dict.en[key] ?? key, [locale]);
  const user = users.find((u) => u.email === session) ?? null;
  const getProduct = useCallback((slug: string) => products.find((x) => x.slug === slug), [products]);
  const byId = useCallback((id: number) => products.find((x) => x.id === id), [products]);

  const addToCart = useCallback((pr: Product, opts: { color?: string; size?: string; qty?: number; silent?: boolean } = {}) => {
    const color = opts.color ?? pr.colors[0].name;
    const size = opts.size ?? pr.sizes[Math.min(2, pr.sizes.length - 1)];
    const qty = opts.qty ?? 1;
    const key = `${pr.id}-${color}-${size}`;
    setCart((cs) => cs.find((x) => x.key === key) ? cs.map((x) => (x.key === key ? { ...x, qty: x.qty + qty } : x)) : [...cs, { key, productId: pr.id, color, size, qty }]);
    if (!opts.silent) toast(`${pr.name} added to bag`, pr.images[0]);
  }, [setCart, toast]);

  const toggleWishlist = useCallback((id: number) => {
    const pr = products.find((x) => x.id === id);
    const has = wishlist.includes(id);
    setWishlist((w) => (has ? w.filter((x) => x !== id) : [...w, id]));
    if (pr) toast(has ? `Removed ${pr.name} from wishlist` : `Saved ${pr.name} to wishlist`, pr.images[0]);
  }, [products, wishlist, setWishlist, toast]);

  const lines = cart.flatMap((x) => { const product = products.find((pr) => pr.id === x.productId); return product ? [{ ...x, product }] : []; });
  const subtotal = lines.reduce((s, l) => s + l.qty * l.product.price, 0);

  const register = (u: Omit<User, "joined">) => {
    if (users.some((x) => x.email.toLowerCase() === u.email.toLowerCase())) return "An account with this email already exists.";
    setUsers((us) => [...us, { ...u, joined: new Date().toISOString() }]);
    setSession(u.email); toast(`Welcome, ${u.name.split(" ")[0]}!`);
    return null;
  };
  const login = (email: string, password: string) => {
    const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u || u.password !== password) return "Incorrect email or password.";
    setSession(u.email); toast(`Welcome back, ${u.name.split(" ")[0]}!`);
    return null;
  };
  const logout = () => { setSession(null); toast("You have been signed out."); };
  const updateUser = (patch: Partial<User>) => setUsers((us) => us.map((x) => (x.email === session ? { ...x, ...patch } : x)));

  const placeOrder = (o: Omit<Order, "id" | "date" | "status">) => {
    const next = Math.max(1048, ...orders.map((x) => parseInt(x.id.replace(/\D/g, ""), 10) || 0)) + 1;
    const full: Order = { ...o, id: `LW-${next}`, date: new Date().toISOString(), status: "Processing" };
    setOrders((os) => [full, ...os]);
    setProducts((ps) => ps.map((pr) => { const it = o.items.filter((x) => x.productId === pr.id).reduce((s, x) => s + x.qty, 0); return it ? { ...pr, stock: Math.max(0, pr.stock - it), sold: pr.sold + it } : pr; }));
    setCart([]);
    return full;
  };
  const setOrderStatus = (id: string, status: OrderStatus) => setOrders((os) => os.map((x) => (x.id === id ? { ...x, status } : x)));

  const pushRecent = useCallback((id: number) => setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 8)), [setRecent]);
  const pushSearch = (q: string) => q.trim() && setSearches((s) => [q.trim(), ...s.filter((x) => x.toLowerCase() !== q.trim().toLowerCase())].slice(0, 5));

  const resetDemo = () => { KEYS.forEach((x) => localStorage.removeItem(k(x))); window.location.reload(); };

  return {
    ready, t, locale, setLocale, theme, setTheme, settings, setSettings,
    products, setProducts, getProduct, byId,
    cart, lines, subtotal, cartCount: cart.reduce((s, x) => s + x.qty, 0), addToCart,
    updateQty: (key: string, qty: number) => setCart((cs) => cs.map((x) => (x.key === key ? { ...x, qty: Math.max(1, qty) } : x))),
    removeFromCart: (key: string) => setCart((cs) => cs.filter((x) => x.key !== key)),
    wishlist, toggleWishlist, inWishlist: (id: number) => wishlist.includes(id),
    user, users, register, login, logout, updateUser,
    addresses, saveAddress: (a: Address) => setAddresses((as) => (as.some((x) => x.id === a.id) ? as.map((x) => (x.id === a.id ? a : x)) : [...as, a])),
    removeAddress: (id: string) => setAddresses((as) => as.filter((x) => x.id !== id)),
    orders, placeOrder, setOrderStatus,
    reviews, addReview: (r: Review) => { setReviews((rs) => [r, ...rs]); toast("Thanks for your review!"); },
    recent, pushRecent, searches, pushSearch, clearSearches: () => setSearches([]),
    cartOpen, setCartOpen, searchOpen, setSearchOpen, quickView, setQuickView,
    toasts, toast, resetDemo,
  };
}

export type StoreState = ReturnType<typeof useStoreState>;
const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const value = useStoreState();
  const memo = useMemo(() => value, [value]);
  return <StoreContext.Provider value={memo}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
