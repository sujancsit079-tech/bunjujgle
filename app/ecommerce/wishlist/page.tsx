"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { PageHeader, ProductCard, btnOutline, btnPrimary } from "@/components/ecommerce/ui";
import { useStore } from "@/components/ecommerce/store";

export default function WishlistPage() {
  const { wishlist, byId, addToCart, t } = useStore();
  const list = wishlist.map(byId).filter((p): p is NonNullable<typeof p> => !!p);
  return <>
    <PageHeader title={t("wishlist")} text={`${list.length} saved item${list.length === 1 ? "" : "s"}`} crumbs={[[t("home"), "/ecommerce"], [t("wishlist")]]} />
    <div className="mx-auto max-w-7xl px-4 lg:px-8">
      {list.length > 0 && <div className="mt-6 flex justify-end"><button onClick={() => list.filter((p) => p.stock > 0).forEach((p) => addToCart(p, { silent: true }))} className={btnOutline}><ShoppingBag size={16} /> Add all to bag</button></div>}
      {list.length === 0 ? <motion.div initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} className="mt-10 grid place-items-center rounded-3xl bg-l-surface py-20 text-center">
        <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.6 }}><Heart size={48} className="text-l-fg/20" /></motion.span><p className="mt-4 text-lg font-semibold">No saved items yet</p><p className="mt-1 text-sm text-l-fg/55">Tap the heart on any product to save it here.</p>
        <Link href="/ecommerce/shop" className={`${btnPrimary} mt-6`}>Browse products</Link>
      </motion.div> : <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">{list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>}
    </div>
  </>;
}
