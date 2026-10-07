"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Search, X } from "lucide-react";
import { formatPrice, type Order, type OrderStatus } from "@/data/ecommerce";
import { useStore } from "@/components/ecommerce/store";
import { StatusPill } from "@/components/ecommerce/status-pill";
import { btnOutline } from "@/components/ecommerce/ui";

const statuses: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const { orders, setOrderStatus, toast } = useStore();
  const [tab, setTab] = useState<"All" | OrderStatus>("All");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<Order | null>(null);
  const s = q.toLowerCase();
  const list = orders.filter((o) => (tab === "All" || o.status === tab) && (!s || `${o.id} ${o.customer} ${o.email}`.toLowerCase().includes(s)));

  const exportCsv = () => {
    const rows = [["Order", "Date", "Customer", "Email", "Items", "Subtotal", "Shipping", "Discount", "Total", "Status", "Payment", "City", "Country"],
      ...list.map((o) => [o.id, o.date, o.customer, o.email, o.items.map((i) => `${i.qty}x ${i.name}`).join("; "), o.subtotal, o.shipping, o.discount, o.total, o.status, o.payment, o.address.city, o.address.country])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(a.href);
    toast(`Exported ${list.length} orders to CSV`);
  };
  const change = (id: string, st: OrderStatus) => { setOrderStatus(id, st); toast(`${id} marked as ${st}`); setDetail((d) => (d && d.id === id ? { ...d, status: st } : d)); };

  return <div className="grid gap-6">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="text-2xl font-bold">Orders</h1><p className="text-sm text-l-fg/55">Orders placed in the storefront appear here instantly.</p></div>
      <button onClick={exportCsv} className={btnOutline}><Download size={16} /> Export CSV</button>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <div className="scrollbar-none flex gap-2 overflow-x-auto">{(["All", ...statuses] as const).map((x) => <button key={x} onClick={() => setTab(x)} className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${tab === x ? "text-l-bg" : "bg-l-surface text-l-fg/60"}`}>
        {tab === x && <motion.span layoutId="order-tab" className="absolute inset-0 rounded-full bg-l-fg" />}<span className="relative">{x} <span className="opacity-60">{x === "All" ? orders.length : orders.filter((o) => o.status === x).length}</span></span>
      </button>)}</div>
      <div className="ml-auto flex items-center gap-2 rounded-full bg-l-surface px-4"><Search size={15} className="text-l-fg/45" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search orders" className="bg-transparent py-2 text-sm outline-none" /></div>
    </div>
    <div className="overflow-x-auto rounded-2xl bg-l-surface p-5"><table className="w-full min-w-[760px] text-left text-sm">
      <thead className="text-xs uppercase tracking-wider text-l-fg/45"><tr><th className="py-2">Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Update</th></tr></thead>
      <tbody>{list.map((o, i) => <motion.tr key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .03 }} onClick={() => setDetail(o)} className="cursor-pointer border-t border-l-fg/5 transition hover:bg-l-fg/[.03]">
        <td className="py-3 font-semibold">{o.id}</td><td><p className="font-semibold">{o.customer}</p><p className="text-xs text-l-fg/45">{o.email}</p></td>
        <td className="text-l-fg/55">{new Date(o.date).toLocaleDateString()}</td><td>{o.items.reduce((s2, x) => s2 + x.qty, 0)}</td><td className="font-semibold">{formatPrice(o.total)}</td><td><StatusPill status={o.status} /></td>
        <td onClick={(e) => e.stopPropagation()}><select aria-label={`Update ${o.id}`} value={o.status} onChange={(e) => change(o.id, e.target.value as OrderStatus)} className="rounded-lg border border-l-fg/10 bg-l-bg px-2 py-1.5 text-xs font-semibold">{statuses.map((x) => <option key={x}>{x}</option>)}</select></td>
      </motion.tr>)}</tbody>
    </table>{list.length === 0 && <p className="py-10 text-center text-sm text-l-fg/50">No orders found.</p>}</div>

    <AnimatePresence>{detail && <>
      <motion.div className="fixed inset-0 z-40 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetail(null)} />
      <motion.aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto bg-l-surface p-6" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 32, stiffness: 320 }}>
        <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-l-fg/45">Order</p><h2 className="text-2xl font-bold">{detail.id}</h2></div><button aria-label="Close" onClick={() => setDetail(null)}><X /></button></div>
        <div className="mt-4 flex items-center gap-2"><StatusPill status={detail.status} /><span className="text-xs text-l-fg/50">{new Date(detail.date).toLocaleString()}</span></div>
        <div className="mt-6 flex flex-wrap gap-2">{statuses.map((x) => <button key={x} onClick={() => change(detail.id, x)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${detail.status === x ? "bg-l-fg text-l-bg" : "border border-l-fg/15 hover:border-l-fg"}`}>{x}</button>)}</div>
        <h3 className="mt-8 text-sm font-bold">Items</h3>
        {detail.items.map((it) => <div key={it.productId + it.size} className="mt-3 flex items-center gap-3 text-sm"><img src={it.image} alt="" className="size-12 rounded-lg object-cover" /><div className="flex-1"><p className="font-semibold">{it.name}</p><p className="text-xs text-l-fg/50">{it.color} · {it.size} · ×{it.qty}</p></div><b>{formatPrice(it.qty * it.price)}</b></div>)}
        <dl className="mt-6 grid gap-1.5 border-t border-l-fg/10 pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-l-fg/60">Subtotal</dt><dd>{formatPrice(detail.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-l-fg/60">Shipping ({detail.shippingMethod})</dt><dd>{detail.shipping ? formatPrice(detail.shipping) : "Free"}</dd></div>
          {detail.discount > 0 && <div className="flex justify-between"><dt className="text-l-fg/60">Discount</dt><dd>-{formatPrice(detail.discount)}</dd></div>}
          <div className="flex justify-between font-bold"><dt>Total</dt><dd>{formatPrice(detail.total)}</dd></div>
        </dl>
        <h3 className="mt-8 text-sm font-bold">Customer</h3>
        <p className="mt-2 text-sm">{detail.customer} · {detail.email}</p>
        <p className="text-sm text-l-fg/60">{detail.address.line1}, {detail.address.city} {detail.address.postal}, {detail.address.country}</p>
        <p className="text-sm text-l-fg/60">Payment: {{ card: "Card", cod: "Cash on delivery", wallet: "Digital wallet" }[detail.payment]}</p>
      </motion.aside>
    </>}</AnimatePresence>
  </div>;
}
