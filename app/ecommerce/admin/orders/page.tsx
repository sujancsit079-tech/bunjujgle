"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { formatPrice, orders as seed, type OrderStatus } from "@/data/ecommerce";
import { StatusPill } from "../ui";

const statuses: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [items, setItems] = useState(seed);
  const [tab, setTab] = useState<"All" | OrderStatus>("All");
  const list = items.filter((o) => tab === "All" || o.status === tab);
  return <div className="grid gap-6">
    <div><h1 className="text-2xl font-bold">Orders</h1><p className="text-sm text-black/55">Track and update order fulfilment.</p></div>
    <div className="flex flex-wrap gap-2">{(["All", ...statuses] as const).map((s) => <button key={s} onClick={() => setTab(s)} className={`relative rounded-full px-4 py-2 text-sm font-semibold ${tab === s ? "text-white" : "bg-white text-black/60"}`}>
      {tab === s && <motion.span layoutId="order-tab" className="absolute inset-0 rounded-full bg-black" />}<span className="relative">{s} <span className="opacity-60">{s === "All" ? items.length : items.filter((o) => o.status === s).length}</span></span>
    </button>)}</div>
    <div className="overflow-x-auto rounded-2xl bg-white p-5"><table className="w-full min-w-[720px] text-left text-sm">
      <thead className="text-xs uppercase tracking-wider text-black/45"><tr><th className="py-2">Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Update</th></tr></thead>
      <tbody>{list.map((o, i) => <motion.tr key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .04 }} className="border-t border-black/5">
        <td className="py-3 font-semibold">{o.id}</td><td><p className="font-semibold">{o.customer}</p><p className="text-xs text-black/45">{o.email}</p></td>
        <td className="text-black/55">{o.date}</td><td>{o.items}</td><td className="font-semibold">{formatPrice(o.total)}</td><td><StatusPill status={o.status} /></td>
        <td><select aria-label={`Update ${o.id}`} value={o.status} onChange={(e) => setItems((xs) => xs.map((x) => (x.id === o.id ? { ...x, status: e.target.value as OrderStatus } : x)))} className="rounded-lg border border-black/10 bg-[#f3f1ed] px-2 py-1.5 text-xs font-semibold">{statuses.map((s) => <option key={s}>{s}</option>)}</select></td>
      </motion.tr>)}</tbody>
    </table></div>
  </div>;
}
