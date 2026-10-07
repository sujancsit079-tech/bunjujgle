"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { formatPrice, type Product } from "@/data/ecommerce";
import { useStore } from "./store";

export function Reveal({ children, delay = 0, className = "", y = 32 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: .7, delay, ease: [.2, .7, .2, 1] }}>{children}</motion.div>;
}

export function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return <span className="flex items-center gap-0.5">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={size} className={i <= Math.round(rating) ? "fill-[#e8a126] text-[#e8a126]" : "text-black/20"} />)}</span>;
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const saved = inWishlist(product.id);
  const off = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0;
  return <motion.article layout initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: .6, delay: (index % 4) * .08 }} className="group">
    <div className="relative overflow-hidden rounded-2xl bg-[#efebe4]">
      <Link href={`/ecommerce/product/${product.slug}`} aria-label={product.name} className="block aspect-[3/4]">
        <img src={product.images[0]} alt={product.name} loading="lazy" className="absolute inset-0 size-full object-cover transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-0" />
        <img src={product.images[1]} alt="" loading="lazy" className="absolute inset-0 size-full scale-105 object-cover opacity-0 transition duration-700 ease-out group-hover:scale-100 group-hover:opacity-100" />
      </Link>
      {product.badge && <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${product.badge === "Sale" ? "bg-[#c8553d] text-white" : "bg-white text-black"}`}>{product.badge === "Sale" ? `-${off}%` : product.badge}</span>}
      <motion.button whileTap={{ scale: .85 }} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} onClick={() => toggleWishlist(product.id)} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:bg-white">
        <Heart size={16} className={saved ? "fill-[#c8553d] text-[#c8553d]" : ""} />
      </motion.button>
      <div className="absolute inset-x-3 bottom-3 translate-y-[120%] opacity-0 transition duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100">
        <motion.button whileTap={{ scale: .96 }} onClick={() => addToCart(product)} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111] py-2.5 text-xs font-semibold text-white transition hover:bg-[#c8553d]"><ShoppingBag size={14} /> Quick add</motion.button>
      </div>
    </div>
    <div className="mt-3 flex items-start justify-between gap-3">
      <div>
        <Link href={`/ecommerce/product/${product.slug}`} className="text-sm font-semibold hover:underline">{product.name}</Link>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-black/50"><Stars rating={product.rating} size={11} />({product.reviews})</div>
      </div>
      <div className="text-right text-sm"><b>{formatPrice(product.price)}</b>{product.compareAt && <s className="block text-xs text-black/40">{formatPrice(product.compareAt)}</s>}</div>
    </div>
    <div className="mt-2 flex gap-1.5">{product.colors.map((c) => <span key={c.name} title={c.name} className="size-3.5 rounded-full border border-black/15" style={{ background: c.hex }} />)}</div>
  </motion.article>;
}
