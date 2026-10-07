"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleX, Home, Package, PackageCheck, Search, Truck } from "lucide-react";
import { formatPrice, type Order } from "@/data/ecommerce";
import { PageHeader, btnPrimary, input } from "@/components/ecommerce/ui";
import { useStore } from "@/components/ecommerce/store";

const flow = [["Order placed", Package], ["Processing", PackageCheck], ["Shipped", Truck], ["Delivered", Home]] as const;
const stepOf = (s: Order["status"]) => ({ Pending: 0, Processing: 1, Shipped: 2, Delivered: 3, Cancelled: -1 })[s];

export default function TrackPage() { return <Suspense><Track /></Suspense>; }

function Track() {
  const { orders, ready, t } = useStore();
  const params = useSearchParams();
  const [id, setId] = useState(params.get("id") ?? "");
  const [found, setFound] = useState<Order | null | undefined>(undefined);
  const lookup = (v = id) => { const k = v.trim().toUpperCase().replace(/^#/, ""); setFound(orders.find((o) => o.id === k) ?? null); };
  useEffect(() => { if (ready && params.get("id")) lookup(params.get("id")!); }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  return <>
    <PageHeader title={t("trackOrder")} text="Enter your order number to see where your parcel is." crumbs={[[t("home"), "/ecommerce"], [t("trackOrder")]]} />
    <div className="mx-auto mt-8 max-w-3xl px-4 lg:px-8">
      <form onSubmit={(e) => { e.preventDefault(); lookup(); }} className="flex gap-2 rounded-3xl bg-l-surface p-3">
        <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Order number, e.g. LW-1046" aria-label="Order number" className={`${input} border-0`} />
        <button className={btnPrimary}><Search size={16} /> Track</button>
      </form>
      <p className="mt-3 text-xs text-l-fg/50">Demo orders: {["LW-1046", "LW-1045", "LW-1048", "LW-1043"].map((x) => <button key={x} onClick={() => { setId(x); lookup(x); }} className="mr-2 font-semibold text-l-accent hover:underline">{x}</button>)}</p>

      <AnimatePresence mode="wait">
        {found === null && <motion.div key="nf" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 rounded-3xl bg-l-surface p-10 text-center"><CircleX className="mx-auto text-l-accent" size={40} /><p className="mt-3 font-semibold">We couldn&apos;t find that order.</p><p className="text-sm text-l-fg/55">Check the number in your confirmation email.</p></motion.div>}
        {found && <motion.div key={found.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 grid gap-6">
          <div className="rounded-3xl bg-l-surface p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p className="text-xs font-bold uppercase tracking-wider text-l-fg/45">Order</p><p className="text-2xl font-bold">{found.id}</p><p className="text-sm text-l-fg/55">Placed {new Date(found.date).toLocaleDateString(undefined, { dateStyle: "long" })}</p></div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${found.status === "Cancelled" ? "bg-l-accent/10 text-l-accent" : "bg-l-success/15 text-l-success"}`}>{found.status}</span>
            </div>
            {found.status === "Cancelled" ? <p className="mt-6 rounded-2xl bg-l-bg p-4 text-sm">This order was cancelled and a full refund has been issued to the original payment method.</p> : <Timeline order={found} />}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-l-surface p-6"><h3 className="font-bold">Items</h3>
              {found.items.map((it) => <div key={it.productId + it.size} className="mt-4 flex items-center gap-3"><img src={it.image} alt="" className="size-14 rounded-xl object-cover" /><div className="flex-1 text-sm"><p className="font-semibold">{it.name}</p><p className="text-xs text-l-fg/50">{it.qty} × {formatPrice(it.price)} · {it.color} · {it.size}</p></div></div>)}
              <p className="mt-4 flex justify-between border-t border-l-fg/10 pt-3 font-bold"><span>Total</span><span>{formatPrice(found.total)}</span></p>
            </div>
            <div className="rounded-3xl bg-l-surface p-6 text-sm"><h3 className="font-bold">Delivery</h3>
              <p className="mt-4 font-semibold">{found.address.name}</p><p className="text-l-fg/60">{found.address.line1}</p><p className="text-l-fg/60">{found.address.city} {found.address.postal}, {found.address.country}</p>
              <p className="mt-4 text-l-fg/60">Method: <b className="capitalize text-l-fg">{found.shippingMethod}</b></p><p className="text-l-fg/60">Payment: <b className="text-l-fg">{{ card: "Card", cod: "Cash on delivery", wallet: "Digital wallet" }[found.payment]}</b></p>
              <Link href="/ecommerce/contact" className="mt-5 inline-block font-semibold text-l-accent hover:underline">Need help with this order?</Link>
            </div>
          </div>
        </motion.div>}
      </AnimatePresence>
    </div>
  </>;
}

function Timeline({ order }: { order: Order }) {
  const cur = stepOf(order.status);
  const base = new Date(order.date).getTime();
  return <ol className="relative mt-10 grid gap-8 md:grid-cols-4 md:gap-4">
    <div className="absolute left-5 top-5 hidden h-0.5 w-[calc(100%-2.5rem)] bg-l-fg/10 md:block"><motion.div className="h-full bg-l-success" initial={{ width: 0 }} animate={{ width: `${(cur / 3) * 100}%` }} transition={{ duration: 1.2, delay: .3, ease: "easeInOut" }} /></div>
    {flow.map(([label, Icon], i) => { const done = i <= cur; return <motion.li key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 + i * .25 }} className="relative flex items-center gap-4 md:flex-col md:items-start">
      <motion.span initial={{ scale: .6 }} animate={{ scale: 1 }} transition={{ delay: .3 + i * .25, type: "spring" }} className={`relative z-10 grid size-10 place-items-center rounded-full ${done ? "bg-l-success text-white" : "bg-l-bg text-l-fg/35 ring-1 ring-l-fg/10"}`}>
        {done && i < cur ? <Check size={18} /> : <Icon size={18} />}
        {i === cur && cur < 3 && <motion.span className="absolute inset-0 rounded-full ring-2 ring-l-success" animate={{ scale: [1, 1.5], opacity: [.8, 0] }} transition={{ repeat: Infinity, duration: 1.4 }} />}
      </motion.span>
      <div><p className={`text-sm font-semibold ${done ? "" : "text-l-fg/40"}`}>{label}</p><p className="text-xs text-l-fg/50">{done ? new Date(base + i * 86400000 * 1.5).toLocaleDateString() : i === cur + 1 ? "Expected soon" : "—"}</p></div>
    </motion.li>; })}
  </ol>;
}
