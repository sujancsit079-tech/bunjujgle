"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { products } from "@/data/ecommerce";
import { ProductCard } from "@/components/ecommerce/product-card";
import { useStore } from "@/components/ecommerce/store";

export default function WishlistPage() {
  const { wishlist } = useStore();
  const list = products.filter((p) => wishlist.includes(p.id));
  return <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-5xl font-bold tracking-tight">Wishlist</motion.h1>
    <p className="mt-2 text-black/55">{list.length} saved item{list.length === 1 ? "" : "s"}</p>
    {list.length === 0 ? <div className="mt-10 grid place-items-center rounded-3xl bg-white py-20 text-center">
      <Heart size={48} className="text-black/20" /><p className="mt-4 text-lg font-semibold">No saved items yet</p><p className="mt-1 text-sm text-black/55">Tap the heart on any product to save it here.</p>
      <Link href="/ecommerce/shop" className="mt-6 rounded-full bg-black px-7 py-3 text-sm font-semibold text-white">Browse products</Link>
    </div> : <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">{list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>}
  </div>;
}
