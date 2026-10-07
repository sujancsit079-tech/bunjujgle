"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Package, RotateCcw, Truck } from "lucide-react";
import { formatPrice } from "@/data/ecommerce";
import { AccountShell } from "@/components/ecommerce/account-shell";
import { useStore } from "@/components/ecommerce/store";
import { btnPrimary } from "@/components/ecommerce/ui";
import { StatusPill } from "@/components/ecommerce/status-pill";

export default function OrdersPage() {
  return <AccountShell title="Orders"><Orders /></AccountShell>;
}

function Orders() {
  const { user, orders, byId, addToCart, setCartOpen } = useStore();
  const mine = orders.filter((o) => o.email.toLowerCase() === user!.email.toLowerCase());
  const [open, setOpen] = useState<string | null>(mine[0]?.id ?? null);
  const reorder = (id: string) => { const o = mine.find((x) => x.id === id)!; o.items.forEach((it) => { const p = byId(it.productId); if (p) addToCart(p, { color: it.color, size: it.size, qty: it.qty, silent: true }); }); setCartOpen(true); };
  if (!mine.length) return <div className="grid place-items-center rounded-3xl bg-l-surface py-20 text-center"><Package size={44} className="text-l-fg/20" /><p className="mt-4 font-semibold">You haven&apos;t placed any orders yet</p><Link href="/ecommerce/shop" className={`${btnPrimary} mt-5`}>Start shopping</Link></div>;
  return <div className="grid gap-4">{mine.map((o, i) => <motion.div key={o.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05 }} className="overflow-hidden rounded-3xl bg-l-surface">
    <button onClick={() => setOpen(open === o.id ? null : o.id)} aria-expanded={open === o.id} className="flex w-full flex-wrap items-center gap-4 p-5 text-left">
      <div className="flex -space-x-3">{o.items.slice(0, 3).map((it) => <img key={it.productId + it.size} src={it.image} alt="" className="size-12 rounded-full border-2 border-l-surface object-cover" />)}</div>
      <div className="flex-1"><p className="font-bold">{o.id}</p><p className="text-xs text-l-fg/50">{new Date(o.date).toLocaleDateString(undefined, { dateStyle: "medium" })} · {o.items.reduce((s, x) => s + x.qty, 0)} items</p></div>
      <StatusPill status={o.status} /><b>{formatPrice(o.total)}</b>
      <motion.span animate={{ rotate: open === o.id ? 180 : 0 }}><ChevronDown size={18} /></motion.span>
    </button>
    <AnimatePresence initial={false}>{open === o.id && <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
      <div className="grid gap-6 border-t border-l-fg/10 p-5 md:grid-cols-[1fr_240px]">
        <ul className="grid gap-3">{o.items.map((it) => <li key={it.productId + it.size} className="flex items-center gap-3 text-sm"><img src={it.image} alt="" className="size-14 rounded-xl object-cover" /><div className="flex-1"><p className="font-semibold">{it.name}</p><p className="text-xs text-l-fg/50">{it.color} · {it.size} · Qty {it.qty}</p></div><b>{formatPrice(it.price * it.qty)}</b></li>)}</ul>
        <div className="grid content-start gap-2 text-sm">
          <p className="flex justify-between"><span className="text-l-fg/60">Subtotal</span>{formatPrice(o.subtotal)}</p>
          {o.discount > 0 && <p className="flex justify-between"><span className="text-l-fg/60">Discount</span>-{formatPrice(o.discount)}</p>}
          <p className="flex justify-between"><span className="text-l-fg/60">Shipping</span>{o.shipping ? formatPrice(o.shipping) : "Free"}</p>
          <p className="flex justify-between border-t border-l-fg/10 pt-2 font-bold"><span>Total</span>{formatPrice(o.total)}</p>
          <Link href={`/ecommerce/track-order?id=${o.id}`} className="mt-3 flex items-center justify-center gap-2 rounded-full bg-l-fg py-2.5 text-xs font-semibold text-l-bg"><Truck size={14} /> Track order</Link>
          <button onClick={() => reorder(o.id)} className="flex items-center justify-center gap-2 rounded-full border border-l-fg/15 py-2.5 text-xs font-semibold transition hover:border-l-fg"><RotateCcw size={14} /> Buy again</button>
        </div>
      </div>
    </motion.div>}</AnimatePresence>
  </motion.div>)}</div>;
}
