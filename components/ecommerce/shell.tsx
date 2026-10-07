"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Heart, Menu, Minus, Plus, Search, ShoppingBag, Trash2, Truck, User, X, LayoutDashboard } from "lucide-react";
import { categories, formatPrice, products, store } from "@/data/ecommerce";
import { useStore } from "./store";

const links = [
  ["Home", "/ecommerce"], ["Shop", "/ecommerce/shop"], ["Women", "/ecommerce/shop?category=women"],
  ["Men", "/ecommerce/shop?category=men"], ["Shoes", "/ecommerce/shop?category=shoes"], ["Accessories", "/ecommerce/shop?category=accessories"],
];

export function StoreHeader() {
  const { cartCount, wishlist, setCartOpen, setSearchOpen } = useStore();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setMenu(false), [pathname]);
  if (pathname.startsWith("/ecommerce/admin")) return null;

  return <>
    <div className="overflow-hidden bg-[#111] py-2 text-center text-[11px] font-semibold uppercase tracking-[.18em] text-white">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .6 }} className="flex items-center justify-center gap-2">
        <Truck size={13} /> Free shipping on orders over {formatPrice(store.freeShippingOver)}
      </motion.div>
    </div>
    <header className={`sticky top-0 z-40 border-b transition-all duration-300 ${scrolled ? "border-black/10 bg-white/90 shadow-sm backdrop-blur-lg" : "border-transparent bg-[#f7f4ef]"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:h-20 lg:px-8">
        <div className="flex items-center gap-3">
          <button aria-label="Open menu" onClick={() => setMenu(true)} className="grid size-10 place-items-center rounded-full hover:bg-black/5 lg:hidden"><Menu size={20} /></button>
          <Link href="/ecommerce" className="font-serif text-2xl font-bold tracking-tight lg:text-3xl">{store.name}<span className="text-[#c8553d]">.</span></Link>
        </div>
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(([l, h]) => <Link key={l} href={h} className="link-line text-[13px] font-semibold text-black/75 transition-colors hover:text-black">{l}</Link>)}
        </nav>
        <div className="flex items-center gap-1">
          <IconBtn label="Search" onClick={() => setSearchOpen(true)}><Search size={19} /></IconBtn>
          <Link href="/ecommerce/admin" aria-label="Admin dashboard" className="hidden size-10 place-items-center rounded-full transition hover:bg-black/5 sm:grid"><User size={19} /></Link>
          <Link href="/ecommerce/wishlist" aria-label="Wishlist" className="relative grid size-10 place-items-center rounded-full transition hover:bg-black/5">
            <Heart size={19} /><Badge n={wishlist.length} />
          </Link>
          <IconBtn label="Open bag" onClick={() => setCartOpen(true)}><ShoppingBag size={19} /><Badge n={cartCount} /></IconBtn>
        </div>
      </div>
    </header>
    <AnimatePresence>
      {menu && <>
        <motion.div key="m-bg" className="fixed inset-0 z-50 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenu(false)} />
        <motion.aside key="m-panel" className="fixed inset-y-0 left-0 z-50 flex w-[84%] max-w-sm flex-col bg-white p-6" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>
          <div className="flex items-center justify-between"><span className="font-serif text-2xl font-bold">{store.name}</span><IconBtn label="Close menu" onClick={() => setMenu(false)}><X size={20} /></IconBtn></div>
          <nav className="mt-8 grid gap-1">
            {links.map(([l, h], i) => <motion.div key={l} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: .05 * i + .1 }}><Link href={h} className="block border-b border-black/5 py-3 text-lg font-semibold">{l}</Link></motion.div>)}
            <Link href="/ecommerce/admin" className="mt-4 flex items-center gap-2 py-2 text-sm font-semibold text-black/70"><LayoutDashboard size={16} /> Admin dashboard</Link>
            <Link href="/" className="flex items-center gap-2 py-2 text-sm font-semibold text-black/70"><ArrowLeft size={16} /> Back to Ban Jungle</Link>
          </nav>
        </motion.aside>
      </>}
    </AnimatePresence>
  </>;
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return <button aria-label={label} onClick={onClick} className="relative grid size-10 place-items-center rounded-full transition hover:bg-black/5">{children}</button>;
}

function Badge({ n }: { n: number }) {
  return <AnimatePresence>{n > 0 && <motion.span key={n} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 18 }} className="absolute right-0.5 top-0.5 grid min-w-[18px] place-items-center rounded-full bg-[#c8553d] px-1 text-[10px] font-bold leading-[18px] text-white">{n}</motion.span>}</AnimatePresence>;
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, subtotal, updateQty, removeFromCart } = useStore();
  const remaining = Math.max(0, store.freeShippingOver - subtotal);
  return <AnimatePresence>
    {cartOpen && <>
      <motion.div key="c-bg" className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} />
      <motion.aside key="c-panel" role="dialog" aria-label="Shopping bag" className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 32, stiffness: 320 }}>
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <h2 className="text-lg font-bold">Your bag <span className="text-black/45">({lines.length})</span></h2>
          <IconBtn label="Close bag" onClick={() => setCartOpen(false)}><X size={20} /></IconBtn>
        </div>
        <div className="px-6 pt-4">
          <p className="text-xs font-semibold text-black/60">{remaining > 0 ? <>Add <b className="text-black">{formatPrice(remaining)}</b> more for free shipping</> : "You've unlocked free shipping!"}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10"><motion.div className="h-full bg-[#c8553d]" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (subtotal / store.freeShippingOver) * 100)}%` }} transition={{ duration: .6 }} /></div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? <div className="grid h-full place-items-center text-center">
            <div><ShoppingBag className="mx-auto text-black/25" size={48} /><p className="mt-4 font-semibold">Your bag is empty</p><Link href="/ecommerce/shop" onClick={() => setCartOpen(false)} className="mt-5 inline-block rounded-full bg-[#111] px-6 py-3 text-sm font-semibold text-white">Start shopping</Link></div>
          </div> : <ul className="grid gap-5">
            <AnimatePresence initial={false}>
              {lines.map((l) => <motion.li key={l.key} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0 }} className="flex gap-4">
                <img src={l.product.images[0]} alt={l.product.name} className="h-28 w-22 shrink-0 rounded-xl object-cover" style={{ width: 88 }} />
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2"><Link href={`/ecommerce/product/${l.product.slug}`} onClick={() => setCartOpen(false)} className="text-sm font-semibold hover:underline">{l.product.name}</Link><span className="text-sm font-bold">{formatPrice(l.product.price * l.qty)}</span></div>
                  <p className="mt-1 text-xs text-black/55">{l.color} · {l.size}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <Qty value={l.qty} onChange={(q) => updateQty(l.key, q)} />
                    <button aria-label="Remove item" onClick={() => removeFromCart(l.key)} className="text-black/40 transition hover:text-[#c8553d]"><Trash2 size={16} /></button>
                  </div>
                </div>
              </motion.li>)}
            </AnimatePresence>
          </ul>}
        </div>
        {lines.length > 0 && <div className="border-t border-black/10 px-6 py-5">
          <div className="flex justify-between text-sm"><span className="text-black/60">Subtotal</span><b>{formatPrice(subtotal)}</b></div>
          <p className="mt-1 text-xs text-black/45">Taxes and shipping calculated at checkout.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/ecommerce/cart" onClick={() => setCartOpen(false)} className="rounded-full border border-black/15 py-3 text-center text-sm font-semibold transition hover:border-black">View bag</Link>
            <Link href="/ecommerce/checkout" onClick={() => setCartOpen(false)} className="rounded-full bg-[#111] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#c8553d]">Checkout</Link>
          </div>
        </div>}
      </motion.aside>
    </>}
  </AnimatePresence>;
}

export function Qty({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return <div className="flex items-center rounded-full border border-black/15">
    <button aria-label="Decrease" onClick={() => onChange(value - 1)} className="grid size-8 place-items-center text-black/60 hover:text-black"><Minus size={14} /></button>
    <motion.span key={value} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-6 text-center text-sm font-semibold">{value}</motion.span>
    <button aria-label="Increase" onClick={() => onChange(value + 1)} className="grid size-8 place-items-center text-black/60 hover:text-black"><Plus size={14} /></button>
  </div>;
}

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState("");
  const results = useMemo(() => q.trim() ? products.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase())) : [], [q]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSearchOpen(false); };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);
  return <AnimatePresence>
    {searchOpen && <motion.div key="search" className="fixed inset-0 z-50 overflow-y-auto bg-white/95 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="mx-auto max-w-3xl px-5 pt-16" initial={{ y: -30 }} animate={{ y: 0 }} exit={{ y: -30 }}>
        <div className="flex items-center gap-3 border-b-2 border-black pb-3">
          <Search size={24} />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="flex-1 bg-transparent text-2xl font-semibold outline-none placeholder:text-black/30" />
          <IconBtn label="Close search" onClick={() => setSearchOpen(false)}><X size={22} /></IconBtn>
        </div>
        {!q && <div className="mt-8"><p className="text-xs font-bold uppercase tracking-widest text-black/45">Popular categories</p><div className="mt-4 flex flex-wrap gap-2">{categories.map((c) => <Link key={c.slug} onClick={() => setSearchOpen(false)} href={`/ecommerce/shop?category=${c.slug}`} className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold transition hover:bg-black hover:text-white">{c.name}</Link>)}</div></div>}
        {q && <p className="mt-6 text-sm text-black/55">{results.length} result{results.length === 1 ? "" : "s"} for “{q}”</p>}
        <div className="mt-5 grid grid-cols-2 gap-5 pb-16 sm:grid-cols-3">
          {results.map((p, i) => <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .04 }}>
            <Link href={`/ecommerce/product/${p.slug}`} onClick={() => setSearchOpen(false)} className="group block">
              <div className="overflow-hidden rounded-2xl bg-[#efebe4]"><img src={p.images[0]} alt={p.name} className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-105" /></div>
              <p className="mt-2 text-sm font-semibold">{p.name}</p><p className="text-sm text-black/60">{formatPrice(p.price)}</p>
            </Link>
          </motion.div>)}
        </div>
      </motion.div>
    </motion.div>}
  </AnimatePresence>;
}

export function Toasts() {
  const { toasts } = useStore();
  return <div className="pointer-events-none fixed bottom-5 left-1/2 z-[60] grid w-[min(92vw,380px)] -translate-x-1/2 gap-2">
    <AnimatePresence>
      {toasts.map((t) => <motion.div key={t.id} layout initial={{ opacity: 0, y: 30, scale: .95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .95 }} className="flex items-center gap-3 rounded-2xl bg-[#111] p-3 text-sm font-semibold text-white shadow-2xl">
        {t.image && <img src={t.image} alt="" className="size-10 rounded-lg object-cover" />}{t.message}
      </motion.div>)}
    </AnimatePresence>
  </div>;
}

export function StoreFooter() {
  if (usePathname().startsWith("/ecommerce/admin")) return null;
  return <footer className="mt-24 bg-[#111] text-white">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
      <div><p className="font-serif text-3xl font-bold">{store.name}<span className="text-[#c8553d]">.</span></p><p className="mt-4 max-w-xs text-sm leading-6 text-white/60">{store.tagline}. Thoughtfully made, fairly priced, designed to be worn for years.</p></div>
      <FooterCol title="Shop" items={[["Women", "/ecommerce/shop?category=women"], ["Men", "/ecommerce/shop?category=men"], ["Shoes", "/ecommerce/shop?category=shoes"], ["Accessories", "/ecommerce/shop?category=accessories"]]} />
      <FooterCol title="Account" items={[["Bag", "/ecommerce/cart"], ["Wishlist", "/ecommerce/wishlist"], ["Checkout", "/ecommerce/checkout"], ["Admin", "/ecommerce/admin"]]} />
      <FooterCol title="More" items={[["All templates", "/templates"], ["Ban Jungle home", "/"], ["Contact", "/contact"]]} />
    </div>
    <div className="border-t border-white/10 py-6 text-center text-xs text-white/45">© 2026 {store.name}. Demo storefront — product photos via Unsplash.</div>
  </footer>;
}

function FooterCol({ title, items }: { title: string; items: string[][] }) {
  return <div><h3 className="text-xs font-bold uppercase tracking-[.18em] text-white/45">{title}</h3><ul className="mt-4 grid gap-2.5 text-sm text-white/75">{items.map(([l, h]) => <li key={l}><Link href={h} className="transition hover:text-white">{l}</Link></li>)}</ul></div>;
}
