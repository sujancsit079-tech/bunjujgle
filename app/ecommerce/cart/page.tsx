"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatPrice, products, store } from "@/data/ecommerce";
import { Qty } from "@/components/ecommerce/shell";
import { useStore } from "@/components/ecommerce/store";
import { ProductCard } from "@/components/ecommerce/product-card";

export default function CartPage() {
  const { lines, subtotal, updateQty, removeFromCart } = useStore();
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [msg, setMsg] = useState("");
  const shipping = subtotal >= store.freeShippingOver || subtotal === 0 ? 0 : 9;
  const total = subtotal - discount + shipping;
  const apply = () => { if (code.trim().toUpperCase() === "LUMEN10") { setDiscount(Math.round(subtotal * .1)); setMsg("10% discount applied"); } else { setDiscount(0); setMsg("Invalid code — try LUMEN10"); } };

  return <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-5xl font-bold tracking-tight">Your bag</motion.h1>
    {lines.length === 0 ? <motion.div initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} className="mt-10 grid place-items-center rounded-3xl bg-white py-20 text-center">
      <ShoppingBag size={52} className="text-black/20" /><p className="mt-4 text-lg font-semibold">Your bag is empty</p><p className="mt-1 text-sm text-black/55">Looks like you haven&apos;t added anything yet.</p>
      <Link href="/ecommerce/shop" className="mt-6 rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#c8553d]">Continue shopping</Link>
    </motion.div> : <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
      <ul className="grid gap-4 self-start">
        <AnimatePresence initial={false}>
          {lines.map((l, i) => <motion.li key={l.key} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: i * .05 } }} exit={{ opacity: 0, x: -60 }} className="flex gap-5 rounded-3xl bg-white p-4">
            <Link href={`/ecommerce/product/${l.product.slug}`} className="w-28 shrink-0 overflow-hidden rounded-2xl"><img src={l.product.images[0]} alt={l.product.name} className="aspect-[3/4] w-full object-cover" /></Link>
            <div className="flex flex-1 flex-col py-1">
              <div className="flex justify-between gap-3"><Link href={`/ecommerce/product/${l.product.slug}`} className="font-semibold hover:underline">{l.product.name}</Link><b>{formatPrice(l.product.price * l.qty)}</b></div>
              <p className="mt-1 text-sm text-black/55">{l.color} · Size {l.size}</p>
              <p className="text-sm text-black/55">{formatPrice(l.product.price)} each</p>
              <div className="mt-auto flex items-center justify-between pt-3"><Qty value={l.qty} onChange={(q) => updateQty(l.key, q)} />
                <button onClick={() => removeFromCart(l.key)} className="flex items-center gap-1.5 text-sm text-black/50 transition hover:text-[#c8553d]"><Trash2 size={15} /> Remove</button></div>
            </div>
          </motion.li>)}
        </AnimatePresence>
      </ul>
      <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="self-start rounded-3xl bg-white p-6 lg:sticky lg:top-28">
        <h2 className="text-lg font-bold">Order summary</h2>
        <div className="mt-5 flex gap-2"><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Discount code" className="min-w-0 flex-1 rounded-full border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-black" /><button onClick={apply} className="rounded-full border border-black px-5 text-sm font-semibold transition hover:bg-black hover:text-white">Apply</button></div>
        {msg && <p className={`mt-2 text-xs font-semibold ${discount ? "text-[#2f6646]" : "text-[#c8553d]"}`}>{msg}</p>}
        <dl className="mt-6 grid gap-3 text-sm">
          <Row k="Subtotal" v={formatPrice(subtotal)} />
          {discount > 0 && <Row k="Discount" v={`-${formatPrice(discount)}`} />}
          <Row k="Shipping" v={shipping ? formatPrice(shipping) : "Free"} />
          <div className="flex justify-between border-t border-black/10 pt-3 text-base font-bold"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
        </dl>
        <Link href="/ecommerce/checkout" className="group mt-6 flex items-center justify-center gap-2 rounded-full bg-black py-3.5 text-sm font-semibold text-white transition hover:bg-[#c8553d]">Checkout <ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link>
        <Link href="/ecommerce/shop" className="mt-3 block text-center text-sm font-semibold text-black/60 hover:text-black">Continue shopping</Link>
      </motion.aside>
    </div>}
    <section className="mt-20"><h2 className="font-serif text-3xl font-bold">Recommended for you</h2>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">{products.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
    </section>
  </div>;
}

function Row({ k, v }: { k: string; v: string }) { return <div className="flex justify-between"><dt className="text-black/60">{k}</dt><dd className="font-semibold">{v}</dd></div>; }
