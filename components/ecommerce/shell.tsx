"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, ChevronDown, CornerDownLeft, Heart, History, LayoutDashboard, LogOut, Menu, Minus, Moon, Package,
  Plus, Search, ShoppingBag, Sun, Trash2, Truck, User, X, Facebook, Instagram, Youtube, CreditCard, Wallet, Banknote, Languages,
} from "lucide-react";
import { categories, dict, formatPrice, type TKey } from "@/data/ecommerce";
import { useStore } from "./store";
import { Stars, btnPrimary } from "./ui";

/* ------------------------------------------------------------------ Frame */

export function StoreFrame({ children }: { children: React.ReactNode }) {
  const { theme, locale } = useStore();
  useEffect(() => { document.documentElement.lang = locale === "ne" ? "ne" : "en"; }, [locale]);
  return <div className={`lumen ${theme === "dark" ? "dark" : ""} min-h-screen bg-l-bg text-l-fg transition-colors duration-500`}>{children}</div>;
}

const isAdmin = (p: string) => p.startsWith("/ecommerce/admin");

/* ------------------------------------------------------------------ Header */

type Mega = { key: TKey; href: string; cat?: string };
const megaNav: Mega[] = [
  { key: "shop", href: "/ecommerce/shop" },
  { key: "women", href: "/ecommerce/shop?category=women", cat: "women" },
  { key: "men", href: "/ecommerce/shop?category=men", cat: "men" },
  { key: "accessories", href: "/ecommerce/shop?category=accessories", cat: "accessories" },
];
const flatNav: Mega[] = [{ key: "newArrivals", href: "/ecommerce/shop?sort=newest" }, { key: "sale", href: "/ecommerce/shop?sale=1" }];

export function StoreHeader() {
  const { cartCount, wishlist, setCartOpen, setSearchOpen, t, settings } = useStore();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mega, setMega] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { setMenu(false); setMega(null); }, [pathname]);
  if (isAdmin(pathname)) return null;

  const open = (i: number) => { clearTimeout(closeTimer.current); setMega(i); };
  const close = () => { closeTimer.current = setTimeout(() => setMega(null), 140); };

  return <>
    <div className="overflow-hidden bg-[#111] py-2 text-center text-[11px] font-semibold uppercase tracking-[.18em] text-white">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .6 }} className="flex items-center justify-center gap-2 px-4"><Truck size={13} className="shrink-0" /> <span className="truncate">{settings.announcement}</span></motion.div>
    </div>
    <header onMouseLeave={close} className={`sticky top-0 z-40 border-b transition-all duration-300 ${scrolled || mega !== null ? "border-l-fg/10 bg-l-surface/95 shadow-sm backdrop-blur-lg" : "border-transparent bg-l-bg"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:h-20 lg:px-8">
        <div className="flex items-center gap-2">
          <button aria-label="Open menu" onClick={() => setMenu(true)} className="grid size-10 place-items-center rounded-full hover:bg-l-fg/5 lg:hidden"><Menu size={20} /></button>
          <Link href="/ecommerce" className="font-serif text-2xl font-bold tracking-tight lg:text-3xl">{settings.storeName}<span className="text-l-accent">.</span></Link>
        </div>
        <nav className="hidden items-center gap-1 lg:flex">
          {megaNav.map((m, i) => <div key={m.key} onMouseEnter={() => open(i)}>
            <Link href={m.href} className={`flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-semibold transition ${mega === i ? "bg-l-fg/5 text-l-fg" : "text-l-fg/70 hover:text-l-fg"}`}>
              {t(m.key)}<motion.span animate={{ rotate: mega === i ? 180 : 0 }}><ChevronDown size={14} /></motion.span>
            </Link>
          </div>)}
          {flatNav.map((m) => <Link key={m.key} href={m.href} onMouseEnter={close} className={`rounded-full px-3 py-2 text-[13px] font-semibold transition hover:text-l-fg ${m.key === "sale" ? "text-l-accent" : "text-l-fg/70"}`}>{t(m.key)}</Link>)}
        </nav>
        <div className="flex items-center gap-0.5">
          <button onClick={() => setSearchOpen(true)} className="mr-1 hidden items-center gap-2 rounded-full border border-l-fg/10 bg-l-surface px-3 py-2 text-xs text-l-fg/50 transition hover:border-l-fg/30 md:flex">
            <Search size={15} /> {t("search")} <kbd className="rounded bg-l-fg/5 px-1.5 py-0.5 font-sans text-[10px] font-bold">Ctrl K</kbd>
          </button>
          <IconBtn label={t("search")} onClick={() => setSearchOpen(true)} className="md:hidden"><Search size={19} /></IconBtn>
          <ThemeToggle />
          <LocaleToggle />
          <AccountMenu />
          <Link href="/ecommerce/wishlist" aria-label={t("wishlist")} className="relative hidden size-10 place-items-center rounded-full transition hover:bg-l-fg/5 sm:grid"><Heart size={19} /><Badge n={wishlist.length} /></Link>
          <MiniBag onOpen={() => setCartOpen(true)} count={cartCount} />
        </div>
      </div>
      <AnimatePresence>
        {mega !== null && <MegaPanel key="mega" item={megaNav[mega]} onEnter={() => open(mega)} />}
      </AnimatePresence>
    </header>
    <MobileMenu open={menu} onClose={() => setMenu(false)} />
  </>;
}

function MegaPanel({ item, onEnter }: { item: Mega; onEnter: () => void }) {
  const { products, t } = useStore();
  const cat = categories.find((c) => c.slug === item.cat);
  const pool = cat ? products.filter((p) => p.category === cat.slug) : products;
  const picks = [...pool].sort((a, b) => b.sold - a.sold).slice(0, 2);
  const cols: { title: string; links: [string, string][] }[] = cat
    ? [{ title: t("categories"), links: cat.types.map((ty) => [ty, `/ecommerce/shop?category=${cat.slug}&type=${encodeURIComponent(ty)}`]) },
       { title: t("collections"), links: [[t("newArrivals"), `/ecommerce/shop?category=${cat.slug}&sort=newest`], [t("bestSellers"), `/ecommerce/shop?category=${cat.slug}&sort=best`], [t("sale"), `/ecommerce/shop?category=${cat.slug}&sale=1`]] }]
    : [{ title: t("categories"), links: [...categories.map((c) => [c.name, `/ecommerce/shop?category=${c.slug}`] as [string, string]), [t("categories") + " →", "/ecommerce/categories"]] },
       { title: t("collections"), links: [[t("allProducts"), "/ecommerce/shop"], [t("newArrivals"), "/ecommerce/shop?sort=newest"], [t("bestSellers"), "/ecommerce/shop?sort=best"], [t("featured"), "/ecommerce/shop?featured=1"], [t("sale"), "/ecommerce/shop?sale=1"]] }];
  return <motion.div onMouseEnter={onEnter} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .22 }} className="absolute inset-x-0 top-full hidden border-b border-l-fg/10 bg-l-surface shadow-xl lg:block">
    <div className="mx-auto grid max-w-7xl grid-cols-[1fr_1fr_2fr] gap-10 px-8 py-8">
      {cols.map((col, ci) => <div key={col.title}>
        <p className="text-[11px] font-bold uppercase tracking-[.2em] text-l-fg/40">{col.title}</p>
        <ul className="mt-4 grid gap-2.5">{col.links.map(([l, h], li) => <motion.li key={h} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ci * .05 + li * .03 }}>
          <Link href={h} className="group flex items-center gap-2 text-sm font-semibold text-l-fg/75 transition hover:text-l-fg">{l}<ArrowRight size={13} className="-translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" /></Link>
        </motion.li>)}</ul>
      </div>)}
      <div className="grid grid-cols-2 gap-4">
        {picks.map((p, i) => <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 + i * .06 }}>
          <Link href={`/ecommerce/product/${p.slug}`} className="group block">
            <div className="relative overflow-hidden rounded-2xl bg-l-muted"><img src={p.images[0]} alt={p.name} className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black">{t("trending")}</span></div>
            <p className="mt-2 text-sm font-semibold">{p.name}</p><p className="text-xs text-l-fg/55">{formatPrice(p.price)}</p>
          </Link>
        </motion.div>)}
      </div>
    </div>
  </motion.div>;
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, user } = useStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  return <AnimatePresence>
    {open && <>
      <motion.div key="m-bg" className="fixed inset-0 z-50 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.aside key="m-panel" className="fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-l-surface p-6" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>
        <div className="flex items-center justify-between"><span className="font-serif text-2xl font-bold">Menu</span><IconBtn label="Close menu" onClick={onClose}><X size={20} /></IconBtn></div>
        <nav className="mt-6 grid">
          <Link href="/ecommerce" className="border-b border-l-fg/5 py-3 text-lg font-semibold">{t("home")}</Link>
          {categories.map((c) => <div key={c.slug} className="border-b border-l-fg/5">
            <button onClick={() => setExpanded(expanded === c.slug ? null : c.slug)} className="flex w-full items-center justify-between py-3 text-lg font-semibold">{t(c.slug as TKey)}<motion.span animate={{ rotate: expanded === c.slug ? 180 : 0 }}><ChevronDown size={18} /></motion.span></button>
            <AnimatePresence initial={false}>{expanded === c.slug && <motion.ul initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
              <li><Link href={`/ecommerce/shop?category=${c.slug}`} className="block py-2 pl-3 text-sm font-semibold text-l-accent">{t("viewAll")}</Link></li>
              {c.types.map((ty) => <li key={ty}><Link href={`/ecommerce/shop?category=${c.slug}&type=${encodeURIComponent(ty)}`} className="block py-2 pl-3 text-sm text-l-fg/70">{ty}</Link></li>)}
            </motion.ul>}</AnimatePresence>
          </div>)}
          {([["newArrivals", "/ecommerce/shop?sort=newest"], ["sale", "/ecommerce/shop?sale=1"], ["categories", "/ecommerce/categories"], ["trackOrder", "/ecommerce/track-order"], ["about", "/ecommerce/about"], ["faq", "/ecommerce/faq"], ["contact", "/ecommerce/contact"]] as [TKey, string][]).map(([key, h]) =>
            <Link key={key} href={h} className="border-b border-l-fg/5 py-3 text-lg font-semibold">{t(key)}</Link>)}
        </nav>
        <div className="mt-6 grid gap-2 text-sm font-semibold text-l-fg/70">
          <Link href={user ? "/ecommerce/account" : "/ecommerce/account/login"} className="flex items-center gap-2 py-1.5"><User size={16} /> {user ? t("myAccount") : t("signIn")}</Link>
          <Link href="/ecommerce/wishlist" className="flex items-center gap-2 py-1.5"><Heart size={16} /> {t("wishlist")}</Link>
          <Link href="/ecommerce/admin" className="flex items-center gap-2 py-1.5"><LayoutDashboard size={16} /> {t("admin")}</Link>
          <Link href="/" className="flex items-center gap-2 py-1.5"><ArrowLeft size={16} /> Back to Ban Jungle</Link>
        </div>
      </motion.aside>
    </>}
  </AnimatePresence>;
}

function ThemeToggle() {
  const { theme, setTheme, t } = useStore();
  const dark = theme === "dark";
  return <button aria-label={dark ? t("lightMode") : t("darkMode")} title={dark ? t("lightMode") : t("darkMode")} onClick={() => setTheme(dark ? "light" : "dark")} className="relative grid size-10 place-items-center overflow-hidden rounded-full transition hover:bg-l-fg/5">
    <AnimatePresence mode="wait" initial={false}>
      <motion.span key={theme} initial={{ y: 20, rotate: -90, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} exit={{ y: -20, rotate: 90, opacity: 0 }} transition={{ duration: .25 }}>{dark ? <Sun size={18} /> : <Moon size={18} />}</motion.span>
    </AnimatePresence>
  </button>;
}

function LocaleToggle() {
  const { locale, setLocale, t } = useStore();
  const [open, setOpen] = useState(false);
  return <div className="relative hidden sm:block" onMouseLeave={() => setOpen(false)}>
    <button aria-label={t("language")} aria-expanded={open} onClick={() => setOpen(!open)} className="flex h-10 items-center gap-1 rounded-full px-2.5 text-xs font-bold transition hover:bg-l-fg/5"><Languages size={16} />{locale.toUpperCase()}</button>
    <AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="absolute right-0 top-full z-50 w-40 rounded-2xl border border-l-fg/10 bg-l-surface p-1.5 shadow-xl">
      {([["en", "English"], ["ne", "नेपाली"]] as const).map(([code, label]) => <button key={code} onClick={() => { setLocale(code); setOpen(false); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition hover:bg-l-fg/5 ${locale === code ? "text-l-accent" : ""}`}>{label}<span className="text-[10px] text-l-fg/40">{code.toUpperCase()}</span></button>)}
    </motion.div>}</AnimatePresence>
  </div>;
}

function AccountMenu() {
  const { user, logout, t } = useStore();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const items: [TKey, string, typeof User][] = user
    ? [["myAccount", "/ecommerce/account", User], ["orders", "/ecommerce/account/orders", Package], ["wishlist", "/ecommerce/wishlist", Heart], ["admin", "/ecommerce/admin", LayoutDashboard]]
    : [["signIn", "/ecommerce/account/login", User], ["createAccount", "/ecommerce/account/register", Plus], ["trackOrder", "/ecommerce/track-order", Truck], ["admin", "/ecommerce/admin", LayoutDashboard]];
  return <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
    <button aria-label={t("myAccount")} aria-expanded={open} onClick={() => router.push(user ? "/ecommerce/account" : "/ecommerce/account/login")} className="grid size-10 place-items-center rounded-full transition hover:bg-l-fg/5">
      {user ? <span className="grid size-7 place-items-center rounded-full bg-l-accent text-[11px] font-bold text-white">{user.name.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase()}</span> : <User size={19} />}
    </button>
    <AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: 6, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: .18 }} className="absolute right-0 top-full z-50 w-60 rounded-2xl border border-l-fg/10 bg-l-surface p-2 shadow-xl">
      {user && <div className="border-b border-l-fg/10 px-3 pb-3 pt-1"><p className="text-sm font-bold">{user.name}</p><p className="truncate text-xs text-l-fg/50">{user.email}</p></div>}
      <div className="py-1">{items.map(([key, href, Icon]) => <Link key={key} href={href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-l-fg/5"><Icon size={16} className="text-l-fg/50" />{t(key)}</Link>)}</div>
      {user && <button onClick={() => { logout(); setOpen(false); }} className="flex w-full items-center gap-3 rounded-xl border-t border-l-fg/10 px-3 py-2.5 text-sm font-semibold text-l-accent transition hover:bg-l-fg/5"><LogOut size={16} />{t("signOut")}</button>}
    </motion.div>}</AnimatePresence>
  </div>;
}

function MiniBag({ onOpen, count }: { onOpen: () => void; count: number }) {
  const { lines, subtotal, t, removeFromCart } = useStore();
  const [hover, setHover] = useState(false);
  return <div className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
    <IconBtn label={t("bag")} onClick={() => { setHover(false); onOpen(); }}><ShoppingBag size={19} /><Badge n={count} /></IconBtn>
    <AnimatePresence>{hover && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: .18 }} className="absolute right-0 top-full z-50 hidden w-80 rounded-2xl border border-l-fg/10 bg-l-surface p-4 shadow-xl lg:block">
      <p className="text-sm font-bold">{t("bag")} <span className="text-l-fg/45">({count})</span></p>
      {lines.length === 0 ? <div className="py-8 text-center"><ShoppingBag className="mx-auto text-l-fg/20" size={34} /><p className="mt-2 text-sm text-l-fg/55">{t("emptyBag")}</p></div> : <>
        <ul className="mt-3 grid max-h-64 gap-3 overflow-y-auto">{lines.slice(0, 4).map((l) => <li key={l.key} className="flex items-center gap-3">
          <img src={l.product.images[0]} alt="" className="size-14 rounded-lg object-cover" />
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{l.product.name}</p><p className="text-xs text-l-fg/50">{l.qty} × {formatPrice(l.product.price)} · {l.size}</p></div>
          <button aria-label="Remove" onClick={() => removeFromCart(l.key)} className="text-l-fg/35 hover:text-l-accent"><X size={15} /></button>
        </li>)}</ul>
        {lines.length > 4 && <p className="mt-2 text-xs text-l-fg/50">+{lines.length - 4} more item(s)</p>}
        <div className="mt-4 flex justify-between border-t border-l-fg/10 pt-3 text-sm"><span className="text-l-fg/60">{t("subtotal")}</span><b>{formatPrice(subtotal)}</b></div>
      </>}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link href="/ecommerce/cart" onClick={() => setHover(false)} className="rounded-full border border-l-fg/15 py-2.5 text-center text-xs font-semibold transition hover:border-l-fg">{t("viewBag")}</Link>
        <Link href="/ecommerce/checkout" onClick={() => setHover(false)} className="rounded-full bg-l-fg py-2.5 text-center text-xs font-semibold text-l-bg transition hover:bg-l-accent hover:text-white">{t("checkout")}</Link>
      </div>
    </motion.div>}</AnimatePresence>
  </div>;
}

function IconBtn({ label, onClick, children, className = "" }: { label: string; onClick: () => void; children: React.ReactNode; className?: string }) {
  return <button aria-label={label} onClick={onClick} className={`relative grid size-10 place-items-center rounded-full transition hover:bg-l-fg/5 ${className}`}>{children}</button>;
}

function Badge({ n }: { n: number }) {
  return <AnimatePresence>{n > 0 && <motion.span key={n} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 18 }} className="absolute right-0.5 top-0.5 grid min-w-[18px] place-items-center rounded-full bg-l-accent px-1 text-[10px] font-bold leading-[18px] text-white">{n}</motion.span>}</AnimatePresence>;
}

/* ------------------------------------------------------------------ Cart drawer */

export function Qty({ value, onChange, max }: { value: number; onChange: (n: number) => void; max?: number }) {
  return <div className="flex items-center rounded-full border border-l-fg/15">
    <button aria-label="Decrease" onClick={() => onChange(Math.max(1, value - 1))} className="grid size-8 place-items-center text-l-fg/60 hover:text-l-fg"><Minus size={14} /></button>
    <motion.span key={value} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-6 text-center text-sm font-semibold">{value}</motion.span>
    <button aria-label="Increase" onClick={() => onChange(max ? Math.min(max, value + 1) : value + 1)} className="grid size-8 place-items-center text-l-fg/60 hover:text-l-fg"><Plus size={14} /></button>
  </div>;
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, subtotal, updateQty, removeFromCart, settings, t } = useStore();
  const remaining = Math.max(0, settings.freeShippingOver - subtotal);
  return <AnimatePresence>
    {cartOpen && <>
      <motion.div key="c-bg" className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} />
      <motion.aside key="c-panel" role="dialog" aria-label={t("bag")} className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-l-surface shadow-2xl" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 32, stiffness: 320 }}>
        <div className="flex items-center justify-between border-b border-l-fg/10 px-6 py-5">
          <h2 className="text-lg font-bold">{t("bag")} <span className="text-l-fg/45">({lines.length})</span></h2>
          <IconBtn label="Close bag" onClick={() => setCartOpen(false)}><X size={20} /></IconBtn>
        </div>
        <div className="px-6 pt-4">
          <p className="text-xs font-semibold text-l-fg/60">{remaining > 0 ? <>Add <b className="text-l-fg">{formatPrice(remaining)}</b> {t("freeShippingLeft")}</> : t("freeShippingDone")}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-l-fg/10"><motion.div className="h-full bg-l-accent" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (subtotal / settings.freeShippingOver) * 100)}%` }} transition={{ duration: .6 }} /></div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? <div className="grid h-full place-items-center text-center">
            <div><ShoppingBag className="mx-auto text-l-fg/25" size={48} /><p className="mt-4 font-semibold">{t("emptyBag")}</p><Link href="/ecommerce/shop" onClick={() => setCartOpen(false)} className={`${btnPrimary} mt-5`}>{t("startShopping")}</Link></div>
          </div> : <ul className="grid gap-5">
            <AnimatePresence initial={false}>
              {lines.map((l) => <motion.li key={l.key} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0 }} className="flex gap-4">
                <img src={l.product.images[0]} alt={l.product.name} className="h-28 shrink-0 rounded-xl object-cover" style={{ width: 88 }} />
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2"><Link href={`/ecommerce/product/${l.product.slug}`} onClick={() => setCartOpen(false)} className="text-sm font-semibold hover:underline">{l.product.name}</Link><span className="text-sm font-bold">{formatPrice(l.product.price * l.qty)}</span></div>
                  <p className="mt-1 text-xs text-l-fg/55">{l.color} · {l.size}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <Qty value={l.qty} max={l.product.stock} onChange={(q) => updateQty(l.key, q)} />
                    <button aria-label="Remove item" onClick={() => removeFromCart(l.key)} className="text-l-fg/40 transition hover:text-l-accent"><Trash2 size={16} /></button>
                  </div>
                </div>
              </motion.li>)}
            </AnimatePresence>
          </ul>}
        </div>
        {lines.length > 0 && <div className="border-t border-l-fg/10 px-6 py-5">
          <div className="flex justify-between text-sm"><span className="text-l-fg/60">{t("subtotal")}</span><b>{formatPrice(subtotal)}</b></div>
          <p className="mt-1 text-xs text-l-fg/45">Taxes and shipping calculated at checkout.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/ecommerce/cart" onClick={() => setCartOpen(false)} className="rounded-full border border-l-fg/15 py-3 text-center text-sm font-semibold transition hover:border-l-fg">{t("viewBag")}</Link>
            <Link href="/ecommerce/checkout" onClick={() => setCartOpen(false)} className="rounded-full bg-l-fg py-3 text-center text-sm font-semibold text-l-bg transition hover:bg-l-accent hover:text-white">{t("checkout")}</Link>
          </div>
        </div>}
      </motion.aside>
    </>}
  </AnimatePresence>;
}

/* ------------------------------------------------------------------ Command palette (Ctrl+K) */

type Hit = { kind: "product" | "page" | "category"; label: string; sub: string; href: string; image?: string };
const pages: Hit[] = [
  ["Shop all", "/ecommerce/shop"], ["New arrivals", "/ecommerce/shop?sort=newest"], ["Sale", "/ecommerce/shop?sale=1"], ["Categories", "/ecommerce/categories"],
  ["Track order", "/ecommerce/track-order"], ["My account", "/ecommerce/account"], ["Wishlist", "/ecommerce/wishlist"], ["Bag", "/ecommerce/cart"],
  ["About", "/ecommerce/about"], ["FAQ", "/ecommerce/faq"], ["Contact", "/ecommerce/contact"], ["Admin dashboard", "/ecommerce/admin"],
].map(([label, href]) => ({ kind: "page" as const, label, sub: "Page", href }));

export function CommandPalette() {
  const { searchOpen, setSearchOpen, products, searches, pushSearch, clearSearches, t } = useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!searchOpen) { setQ(""); setActive(0); } }, [searchOpen]);

  const hits = useMemo<Hit[]>(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [...products].sort((a, b) => b.sold - a.sold).slice(0, 4).map((p) => ({ kind: "product", label: p.name, sub: formatPrice(p.price), href: `/ecommerce/product/${p.slug}`, image: p.images[0] }) as Hit).concat(pages.slice(0, 4));
    const ps = products.filter((p) => `${p.name} ${p.type} ${p.category} ${p.colors.map((c) => c.name).join(" ")}`.toLowerCase().includes(s)).slice(0, 6)
      .map((p) => ({ kind: "product", label: p.name, sub: `${p.type} · ${formatPrice(p.price)}`, href: `/ecommerce/product/${p.slug}`, image: p.images[0] }) as Hit);
    const cs = categories.filter((c) => c.name.toLowerCase().includes(s) || c.types.some((x) => x.toLowerCase().includes(s)))
      .map((c) => ({ kind: "category", label: c.name, sub: c.blurb, href: `/ecommerce/shop?category=${c.slug}`, image: c.image }) as Hit);
    return [...ps, ...cs, ...pages.filter((p) => p.label.toLowerCase().includes(s))];
  }, [q, products]);

  const go = (h?: Hit) => {
    if (q.trim()) pushSearch(q);
    setSearchOpen(false);
    router.push(h ? h.href : `/ecommerce/shop?q=${encodeURIComponent(q)}`);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(hits.length - 1, a + 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    if (e.key === "Enter") { e.preventDefault(); go(hits[active]); }
  };
  useEffect(() => { listRef.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" }); }, [active]);

  return <AnimatePresence>
    {searchOpen && <motion.div key="cmd" className="fixed inset-0 z-[60] flex items-start justify-center bg-black/45 px-4 pt-[10vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSearchOpen(false)}>
      <motion.div role="dialog" aria-label={t("search")} onClick={(e) => e.stopPropagation()} initial={{ y: -20, scale: .97, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: -10, scale: .98, opacity: 0 }} transition={{ type: "spring", damping: 28, stiffness: 380 }} className="w-full max-w-2xl overflow-hidden rounded-3xl border border-l-fg/10 bg-l-surface shadow-2xl">
        <div className="flex items-center gap-3 border-b border-l-fg/10 px-5 py-4">
          <Search size={20} className="text-l-fg/45" />
          <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onKey} placeholder={t("searchPlaceholder")} className="flex-1 bg-transparent text-lg font-medium outline-none placeholder:text-l-fg/35" />
          <kbd className="rounded-md border border-l-fg/15 px-1.5 py-0.5 text-[10px] font-bold text-l-fg/50">ESC</kbd>
        </div>
        {!q && searches.length > 0 && <div className="flex flex-wrap items-center gap-2 border-b border-l-fg/10 px-5 py-3">
          <History size={14} className="text-l-fg/40" /><span className="text-xs font-semibold text-l-fg/45">{t("recentSearches")}:</span>
          {searches.map((s) => <button key={s} onClick={() => { setQ(s); setActive(0); }} className="rounded-full bg-l-fg/5 px-3 py-1 text-xs font-semibold transition hover:bg-l-fg/10">{s}</button>)}
          <button onClick={clearSearches} className="ml-auto text-xs font-semibold text-l-fg/40 hover:text-l-accent">{t("clearAll")}</button>
        </div>}
        <div ref={listRef} className="max-h-[55vh] overflow-y-auto p-2">
          {hits.length === 0 ? <p className="px-4 py-10 text-center text-sm text-l-fg/50">{t("noResults")} “{q}”</p> : hits.map((h, i) => <button key={h.kind + h.href + i} data-i={i} onMouseEnter={() => setActive(i)} onClick={() => go(h)} className={`relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${active === i ? "text-l-fg" : "text-l-fg/80"}`}>
            {active === i && <motion.span layoutId="cmd-active" className="absolute inset-0 rounded-2xl bg-l-fg/5" transition={{ type: "spring", stiffness: 500, damping: 35 }} />}
            {h.image ? <img src={h.image} alt="" className="relative size-11 rounded-xl object-cover" /> : <span className="relative grid size-11 place-items-center rounded-xl bg-l-fg/5"><ArrowRight size={16} /></span>}
            <span className="relative min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{h.label}</span><span className="block truncate text-xs text-l-fg/50">{h.sub}</span></span>
            <span className="relative text-[10px] font-bold uppercase tracking-wider text-l-fg/35">{h.kind}</span>
            {active === i && <CornerDownLeft size={14} className="relative text-l-fg/40" />}
          </button>)}
        </div>
        <div className="flex items-center justify-between border-t border-l-fg/10 px-5 py-2.5 text-[11px] text-l-fg/45">
          <span>↑ ↓ to navigate · Enter to open</span>
          {q && <button onClick={() => go()} className="font-semibold text-l-accent">See all results for “{q}” →</button>}
        </div>
      </motion.div>
    </motion.div>}
  </AnimatePresence>;
}

/* ------------------------------------------------------------------ Quick view */

export function QuickView() {
  const { quickView, setQuickView, byId, addToCart, t } = useStore();
  const p = quickView !== null ? byId(quickView) : undefined;
  const [ci, setCi] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [imgI, setImgI] = useState(0);
  useEffect(() => { setCi(0); setImgI(0); setSize(p && p.sizes.length === 1 ? p.sizes[0] : null); }, [quickView]); // eslint-disable-line react-hooks/exhaustive-deps
  return <AnimatePresence>
    {p && <motion.div key="qv" className="fixed inset-0 z-[55] grid place-items-center bg-black/45 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setQuickView(null)}>
      <motion.div role="dialog" aria-label={`${t("quickView")}: ${p.name}`} onClick={(e) => e.stopPropagation()} initial={{ y: 30, scale: .96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: .97, opacity: 0 }} transition={{ type: "spring", damping: 28, stiffness: 320 }} className="relative grid max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-l-surface md:grid-cols-2">
        <button aria-label="Close" onClick={() => setQuickView(null)} className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white/90 text-black"><X size={18} /></button>
        <div className="relative bg-l-muted">
          <AnimatePresence mode="wait"><motion.img key={imgI} src={p.images[imgI]} alt={p.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="aspect-[4/5] w-full object-cover" /></AnimatePresence>
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">{p.images.map((_, i) => <button key={i} aria-label={`Image ${i + 1}`} onClick={() => setImgI(i)} className={`h-1.5 rounded-full transition-all ${imgI === i ? "w-8 bg-white" : "w-3 bg-white/60"}`} />)}</div>
        </div>
        <div className="flex flex-col p-7">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-l-accent">{p.type}</p>
          <h2 className="mt-2 font-serif text-4xl font-bold">{p.name}</h2>
          <div className="mt-2 flex items-center gap-2 text-sm text-l-fg/55"><Stars rating={p.rating} />{p.rating} · {p.reviews} reviews</div>
          <p className="mt-4 text-2xl font-bold">{formatPrice(p.price)} {p.compareAt && <s className="ml-1 text-base font-normal text-l-fg/40">{formatPrice(p.compareAt)}</s>}</p>
          <p className="mt-4 text-sm leading-6 text-l-fg/65">{p.description}</p>
          <p className="mt-5 text-sm font-semibold">Color: <span className="font-normal text-l-fg/60">{p.colors[ci].name}</span></p>
          <div className="mt-2 flex gap-2">{p.colors.map((col, i) => <button key={col.name} aria-label={col.name} onClick={() => { setCi(i); setImgI(i % p.images.length); }} className={`grid size-9 place-items-center rounded-full border-2 ${ci === i ? "border-l-fg" : "border-transparent"}`}><span className="size-6 rounded-full border border-l-fg/10" style={{ background: col.hex }} /></button>)}</div>
          <p className="mt-5 text-sm font-semibold">Size</p>
          <div className="mt-2 flex flex-wrap gap-2">{p.sizes.map((s) => <button key={s} onClick={() => setSize(s)} className={`h-10 min-w-11 rounded-xl border px-3 text-sm font-semibold transition ${size === s ? "border-l-fg bg-l-fg text-l-bg" : "border-l-fg/15 hover:border-l-fg"}`}>{s}</button>)}</div>
          <div className="mt-auto grid gap-2 pt-6">
            <button disabled={!size || p.stock === 0} onClick={() => { addToCart(p, { color: p.colors[ci].name, size: size! }); setQuickView(null); }} className={btnPrimary}><ShoppingBag size={16} /> {size ? t("addToBag") : "Select a size"}</button>
            <Link href={`/ecommerce/product/${p.slug}`} onClick={() => setQuickView(null)} className="text-center text-sm font-semibold text-l-fg/60 underline-offset-4 hover:text-l-fg hover:underline">View full details</Link>
          </div>
        </div>
      </motion.div>
    </motion.div>}
  </AnimatePresence>;
}

/* ------------------------------------------------------------------ Toasts & footer */

export function Toasts() {
  const { toasts } = useStore();
  return <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-5 left-1/2 z-[70] grid w-[min(92vw,380px)] -translate-x-1/2 gap-2">
    <AnimatePresence>
      {toasts.map((x) => <motion.div key={x.id} layout initial={{ opacity: 0, y: 30, scale: .95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .95 }} className="flex items-center gap-3 rounded-2xl bg-[#111] p-3 text-sm font-semibold text-white shadow-2xl ring-1 ring-white/10">
        {x.image && <img src={x.image} alt="" className="size-10 rounded-lg object-cover" />}{x.message}
      </motion.div>)}
    </AnimatePresence>
  </div>;
}

export function StoreFooter() {
  const { t, settings, toast } = useStore();
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  if (isAdmin(pathname)) return null;
  const cols: [string, [TKey | string, string][]][] = [
    [t("shop"), [["women", "/ecommerce/shop?category=women"], ["men", "/ecommerce/shop?category=men"], ["shoes", "/ecommerce/shop?category=shoes"], ["accessories", "/ecommerce/shop?category=accessories"], ["sale", "/ecommerce/shop?sale=1"]]],
    ["Help", [["trackOrder", "/ecommerce/track-order"], ["faq", "/ecommerce/faq"], ["contact", "/ecommerce/contact"], ["Shipping & returns", "/ecommerce/faq"]]],
    ["Company", [["about", "/ecommerce/about"], ["categories", "/ecommerce/categories"], ["myAccount", "/ecommerce/account"], ["admin", "/ecommerce/admin"], ["All templates", "/templates"]]],
  ];
  const label = (x: string) => (x in dict.en ? t(x as TKey) : x);
  return <footer className="mt-24 bg-[#111] text-white">
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-[1.4fr_2fr] lg:px-8">
      <div>
        <p className="font-serif text-4xl font-bold">{settings.storeName}<span className="text-[#e2755c]">.</span></p>
        <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">Considered clothing for everyday living — thoughtfully made, fairly priced and designed to be worn for years.</p>
        <p className="mt-8 text-xs font-bold uppercase tracking-[.2em] text-white/45">{t("newsletter")}</p>
        <form onSubmit={(e) => { e.preventDefault(); setEmail(""); toast("You're subscribed — welcome to the list!"); }} className="mt-3 flex max-w-sm gap-2">
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" aria-label="Email address" className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-white/35 focus:border-white/60" />
          <button className="rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-[#e2755c] hover:text-white">{t("subscribe")}</button>
        </form>
        <div className="mt-6 flex gap-2">{[Instagram, Facebook, Youtube].map((Icon, i) => <a key={i} href="#" aria-label="Social link" className="grid size-10 place-items-center rounded-full border border-white/15 transition hover:border-white hover:bg-white hover:text-black"><Icon size={16} /></a>)}</div>
      </div>
      <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
        {cols.map(([title, items]) => <div key={title}><h3 className="text-xs font-bold uppercase tracking-[.18em] text-white/45">{title}</h3>
          <ul className="mt-4 grid gap-2.5 text-sm text-white/75">{items.map(([l, h]) => <li key={l + h}><Link href={h} className="link-line transition hover:text-white">{label(l)}</Link></li>)}</ul></div>)}
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-white/45 sm:flex-row lg:px-8">
        <p>© 2026 {settings.storeName}. Demo storefront — product photos via Unsplash.</p>
        <div className="flex items-center gap-2">{[[CreditCard, "Card"], [Wallet, "Wallet"], [Banknote, "Cash on delivery"]].map(([Icon, l]) => { const I = Icon as typeof CreditCard; return <span key={l as string} title={l as string} className="flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1.5"><I size={14} />{l as string}</span>; })}</div>
      </div>
    </div>
  </footer>;
}
