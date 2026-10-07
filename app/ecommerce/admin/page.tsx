"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, DollarSign, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { formatPrice, monthlySales, seedCustomers } from "@/data/ecommerce";
import { useStore } from "@/components/ecommerce/store";
import { StatusPill } from "@/components/ecommerce/status-pill";

export default function AdminDashboard() {
  const { orders, products, users } = useStore();
  const live = orders.filter((o) => o.status !== "Cancelled");
  const revenue = monthlySales.reduce((s, m) => s + m.revenue, 0) + live.reduce((s, o) => s + o.total, 0);
  const totalOrders = monthlySales.reduce((s, m) => s + m.orders, 0) + orders.length;
  const low = products.filter((p) => p.stock < 15).sort((a, b) => a.stock - b.stock);
  const stats = [
    ["Revenue", `$${(revenue / 1000).toFixed(1)}k`, "+18.2%", DollarSign],
    ["Orders", totalOrders.toLocaleString(), "+12.4%", ShoppingCart],
    ["Customers", (seedCustomers.length + users.length).toLocaleString(), `+${users.length} new`, Users],
    ["Products", products.length.toString(), `${products.filter((p) => p.stock === 0).length} sold out`, Package],
  ] as const;
  const top = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const byStatus = (["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] as const).map((s) => [s, orders.filter((o) => o.status === s).length] as const);

  return <div className="grid gap-6">
    <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-sm text-l-fg/55">Welcome back — here&apos;s what&apos;s happening in your store.</p></div>
    {low.length > 0 && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
      <AlertTriangle size={18} className="text-amber-600" /><b>{low.length} products are low on stock:</b>
      <span className="text-l-fg/70">{low.slice(0, 4).map((p) => `${p.name} (${p.stock})`).join(", ")}{low.length > 4 ? "…" : ""}</span>
      <Link href="/ecommerce/admin/products?filter=low" className="ml-auto font-semibold text-amber-700 hover:underline">Restock →</Link>
    </motion.div>}
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map(([label, value, delta, Icon], i) => <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .08 }} className="rounded-2xl bg-l-surface p-5">
        <div className="flex items-center justify-between"><span className="text-sm font-semibold text-l-fg/55">{label}</span><span className="grid size-9 place-items-center rounded-xl bg-l-bg"><Icon size={17} /></span></div>
        <p className="mt-3 text-2xl font-bold">{value}</p>
        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-l-success"><TrendingUp size={13} /> {delta} <span className="font-normal text-l-fg/45">vs last period</span></p>
      </motion.div>)}
    </div>
    <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <SalesChart />
      <div className="rounded-2xl bg-l-surface p-5">
        <h2 className="font-bold">Order status</h2>
        <div className="mt-4 grid gap-3">{byStatus.map(([s, n], i) => <div key={s} className="flex items-center gap-3 text-sm"><span className="w-24"><StatusPill status={s} /></span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-l-fg/10"><motion.span className="block h-full rounded-full bg-l-fg" initial={{ width: 0 }} animate={{ width: `${(n / Math.max(1, orders.length)) * 100}%` }} transition={{ delay: .3 + i * .08, duration: .8 }} /></span><b className="w-6 text-right">{n}</b></div>)}</div>
        <h2 className="mt-8 font-bold">Top products</h2>
        <ul className="mt-4 grid gap-3">{top.map((p, i) => <motion.li key={p.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .3 + i * .06 }} className="flex items-center gap-3">
          <img src={p.images[0]} alt="" className="size-11 rounded-xl object-cover" />
          <div className="flex-1"><p className="text-sm font-semibold">{p.name}</p><p className="text-xs text-l-fg/50">{p.sold.toLocaleString()} sold</p></div><b className="text-sm">{formatPrice(p.price)}</b>
        </motion.li>)}</ul>
      </div>
    </div>
    <div className="rounded-2xl bg-l-surface p-5">
      <div className="flex items-center justify-between"><h2 className="font-bold">Recent orders</h2><Link href="/ecommerce/admin/orders" className="text-sm font-semibold text-l-accent">View all</Link></div>
      <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm">
        <thead className="text-xs uppercase tracking-wider text-l-fg/45"><tr><th className="py-2">Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>{orders.slice(0, 6).map((o) => <tr key={o.id} className="border-t border-l-fg/5"><td className="py-3 font-semibold">{o.id}</td><td>{o.customer}</td><td className="text-l-fg/55">{new Date(o.date).toLocaleDateString()}</td><td className="font-semibold">{formatPrice(o.total)}</td><td><StatusPill status={o.status} /></td></tr>)}</tbody>
      </table></div>
    </div>
  </div>;
}

function SalesChart() {
  const [metric, setMetric] = useState<"revenue" | "orders">("revenue");
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...monthlySales.map((m) => m[metric]));
  const W = 600, H = 220;
  const pts = monthlySales.map((m, i) => [(i / (monthlySales.length - 1)) * W, H - (m[metric] / max) * (H - 20)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  return <div className="rounded-2xl bg-l-surface p-5">
    <div className="flex items-center justify-between"><div><h2 className="font-bold">Sales overview</h2><p className="text-xs text-l-fg/50">{hover !== null ? `${monthlySales[hover].month}: ${metric === "revenue" ? `$${monthlySales[hover].revenue.toLocaleString()}` : `${monthlySales[hover].orders} orders`}` : "Hover the chart for details"}</p></div>
      <div className="flex rounded-full bg-l-bg p-1 text-xs font-semibold">{(["revenue", "orders"] as const).map((m) => <button key={m} onClick={() => setMetric(m)} className={`relative rounded-full px-3 py-1.5 capitalize ${metric === m ? "text-l-bg" : "text-l-fg/55"}`}>{metric === m && <motion.span layoutId="chart-pill" className="absolute inset-0 rounded-full bg-l-fg" />}<span className="relative">{m}</span></button>)}</div>
    </div>
    <svg viewBox={`0 -10 ${W} ${H + 40}`} className="mt-4 w-full overflow-visible" onMouseLeave={() => setHover(null)}>
      <defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgb(var(--l-accent))" stopOpacity=".25" /><stop offset="100%" stopColor="rgb(var(--l-accent))" stopOpacity="0" /></linearGradient></defs>
      {[0, .25, .5, .75, 1].map((t) => <line key={t} x1={0} x2={W} y1={20 + t * (H - 20)} y2={20 + t * (H - 20)} stroke="currentColor" strokeOpacity=".07" />)}
      <motion.path key={metric + "a"} d={`${line} L${W},${H} L0,${H} Z`} fill="url(#area)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8, delay: .4 }} />
      <motion.path key={metric} d={line} fill="none" stroke="rgb(var(--l-accent))" strokeWidth={3} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeInOut" }} />
      {hover !== null && <line x1={pts[hover][0]} x2={pts[hover][0]} y1={0} y2={H} stroke="currentColor" strokeOpacity=".2" strokeDasharray="4 4" />}
      {pts.map(([x, y], i) => <g key={metric + i} onMouseEnter={() => setHover(i)}>
        <rect x={x - 30} y={-10} width={60} height={H + 20} fill="transparent" />
        <motion.circle cx={x} cy={y} r={hover === i ? 7 : 4} fill="rgb(var(--l-surface))" stroke="rgb(var(--l-accent))" strokeWidth={2} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: .8 + i * .05 }} />
      </g>)}
      {monthlySales.map((m, i) => <text key={m.month} x={(i / (monthlySales.length - 1)) * W} y={H + 24} textAnchor="middle" fontSize="12" fill="currentColor" fillOpacity=".45">{m.month}</text>)}
    </svg>
  </div>;
}
