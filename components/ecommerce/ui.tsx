"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { formatPrice, type Product } from "@/data/ecommerce";
import { useStore } from "./store";

export function Reveal({ children, delay = 0, className = "", y = 32 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: .7, delay, ease: [.2, .7, .2, 1] }}>{children}</motion.div>;
}

export function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={size} className={i <= Math.round(rating) ? "fill-[#e8a126] text-[#e8a126]" : "text-l-fg/20"} />)}</span>;
}

export function Crumbs({ items }: { items: [string, string?][] }) {
  return <nav aria-label="Breadcrumb" className="text-xs text-l-fg/50">{items.map(([label, href], i) => <span key={`${i}-${label}`}>{i > 0 && " / "}{href ? <Link href={href} className="capitalize hover:text-l-fg">{label}</Link> : <span className="text-l-fg">{label}</span>}</span>)}</nav>;
}

export function PageHeader({ title, text, crumbs }: { title: string; text?: string; crumbs: [string, string?][] }) {
  return <div className="mx-auto max-w-7xl px-4 pt-10 lg:px-8">
    <Crumbs items={crumbs} />
    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-3 font-serif text-5xl font-bold tracking-tight md:text-6xl">{title}</motion.h1>
    {text && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .15 }} className="mt-3 max-w-2xl text-l-fg/60">{text}</motion.p>}
  </div>;
}

export const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-full bg-l-fg px-6 py-3 text-sm font-semibold text-l-bg transition hover:bg-l-accent hover:text-white disabled:opacity-50";
export const btnOutline = "inline-flex items-center justify-center gap-2 rounded-full border border-l-fg/15 px-6 py-3 text-sm font-semibold transition hover:border-l-fg";
export const input = "w-full rounded-xl border border-l-fg/15 bg-l-bg px-4 py-3 text-sm outline-none transition placeholder:text-l-fg/35 focus:border-l-fg focus:bg-l-surface";

export function CardSkeleton() {
  return <div><div className="shimmer aspect-[3/4] rounded-2xl" /><div className="shimmer mt-3 h-4 w-3/4 rounded" /><div className="shimmer mt-2 h-3 w-1/3 rounded" /></div>;
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, inWishlist, setQuickView, t } = useStore();
  const saved = inWishlist(product.id);
  const off = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0;
  const badge = off ? `-${off}%` : product.badge;
  return <motion.article initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: .6, delay: (index % 4) * .08 }} className="group">
    <div className="relative overflow-hidden rounded-2xl bg-l-muted">
      <Link href={`/ecommerce/product/${product.slug}`} aria-label={product.name} className="block aspect-[3/4]">
        <img src={product.images[0]} alt={product.name} loading="lazy" className="absolute inset-0 size-full object-cover transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-0" />
        <img src={product.images[1] ?? product.images[0]} alt="" loading="lazy" className="absolute inset-0 size-full scale-105 object-cover opacity-0 transition duration-700 ease-out group-hover:scale-100 group-hover:opacity-100" />
      </Link>
      {badge && <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${off ? "bg-l-accent text-white" : "bg-white text-black"}`}>{badge}</span>}
      {product.stock === 0 && <span className="absolute inset-x-3 top-12 rounded-full bg-black/70 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-white">Sold out</span>}
      <div className="absolute right-3 top-3 grid gap-2">
        <motion.button whileTap={{ scale: .85 }} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} onClick={() => toggleWishlist(product.id)} className="grid size-9 place-items-center rounded-full bg-white/90 text-black shadow-sm backdrop-blur transition hover:bg-white">
          <Heart size={16} className={saved ? "fill-l-accent text-l-accent" : ""} />
        </motion.button>
        <button aria-label={t("quickView")} onClick={() => setQuickView(product.id)} className="grid size-9 translate-x-12 place-items-center rounded-full bg-white/90 text-black shadow-sm transition duration-300 hover:bg-white group-hover:translate-x-0 max-lg:translate-x-0"><Eye size={16} /></button>
      </div>
      <div className="absolute inset-x-3 bottom-3 translate-y-[120%] opacity-0 transition duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100">
        <motion.button whileTap={{ scale: .96 }} disabled={product.stock === 0} onClick={() => addToCart(product)} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111] py-2.5 text-xs font-semibold text-white transition hover:bg-l-accent disabled:opacity-50"><ShoppingBag size={14} /> {t("quickAdd")}</motion.button>
      </div>
    </div>
    <div className="mt-3 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-l-fg/40">{product.type}</p>
        <Link href={`/ecommerce/product/${product.slug}`} className="text-sm font-semibold hover:underline">{product.name}</Link>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-l-fg/50"><Stars rating={product.rating} size={11} />({product.reviews})</div>
      </div>
      <div className="shrink-0 text-right text-sm"><b>{formatPrice(product.price)}</b>{product.compareAt && <s className="block text-xs text-l-fg/40">{formatPrice(product.compareAt)}</s>}</div>
    </div>
    <div className="mt-2 flex gap-1.5">{product.colors.map((col) => <span key={col.name} title={col.name} className="size-3.5 rounded-full border border-l-fg/15" style={{ background: col.hex }} />)}</div>
  </motion.article>;
}
