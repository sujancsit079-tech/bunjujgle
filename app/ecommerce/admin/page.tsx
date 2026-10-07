"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { DollarSign, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { customers, formatPrice, monthlySales, orders, products } from "@/data/ecommerce";
import { StatusPill } from "./ui";

export default function AdminDashboard() {
  const revenue = monthlySales.reduce((s, m) => s + m.revenue, 0);
  const totalOrders = monthlySales.reduce((s, m) => s + m.orders, 0);
  const stats = [
    ["Revenue", `$${(revenue / 1000).toFixed(1)}k`, "+18.2%", DollarSign],
    ["Orders", totalOrders.toLocaleString(), "+12.4%", ShoppingCart],
    ["Customers", (customers.length * 182).toLocaleString(), "+6.1%", Users],
    ["Products", products.length.toString(), "+2 new", Package],
  ] as const;
  const top = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 5);
  return <div className="grid gap-6">
    <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-sm text-black/55">Welcome back — here&apos;s what&apos;s happening in your store.</p></div>
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map(([label, value, delta, Icon], i) => <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .08 }} className="rounded-2xl bg-white p-5">
        <div className="flex items-center justify-between"><span className="text-sm font-semibold text-black/55">{label}</span><span className="grid size-9 place-items-center rounded-xl bg-[#f3f1ed]"><Icon size={17} /></span></div>
        <p className="mt-3 text-2xl font-bold">{value}</p>
        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#2f6646]"><TrendingUp size={13} /> {delta} <span className="font-normal text-black/45">vs last period</span></p>
      </motion.div>)}
    </div>
    <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <SalesChart />
      <div className="rounded-2xl bg-white p-5">
        <h2 className="font-bold">Top products</h2>
        <ul className="mt-4 grid gap-3">{top.map((p, i) => <motion.li key={p.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .3 + i * .06 }} className="flex items-center gap-3">
          <img src={p.images[0]} alt="" className="size-12 rounded-xl object-cover" />
          <div className="flex-1"><p className="text-sm font-semibold">{p.name}</p><p className="text-xs text-black/50">{p.reviews} sold</p></div><b className="text-sm">{formatPrice(p.price)}</b>
        </motion.li>)}</ul>
      </div>
    </div>
    <div className="rounded-2xl bg-white p-5">
      <div className="flex items-center justify-between"><h2 className="font-bold">Recent orders</h2><Link href="/ecommerce/admin/orders" className="text-sm font-semibold text-[#c8553d]">View all</Link></div>
      <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm">
        <thead className="text-xs uppercase tracking-wider text-black/45"><tr><th className="py-2">Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>{orders.slice(0, 5).map((o) => <tr key={o.id} className="border-t border-black/5"><td className="py-3 font-semibold">{o.id}</td><td>{o.customer}</td><td className="text-black/55">{o.date}</td><td className="font-semibold">{formatPrice(o.total)}</td><td><StatusPill status={o.status} /></td></tr>)}</tbody>
      </table></div>
    </div>
  </div>;
}

function SalesChart() {
  const [metric, setMetric] = useState<"revenue" | "orders">("revenue");
  const max = Math.max(...monthlySales.map((m) => m[metric]));
  const W = 600, H = 220;
  const pts = monthlySales.map((m, i) => [(i / (monthlySales.length - 1)) * W, H - (m[metric] / max) * (H - 20)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  return <div className="rounded-2xl bg-white p-5">
    <div className="flex items-center justify-between"><h2 className="font-bold">Sales overview</h2>
      <div className="flex rounded-full bg-[#f3f1ed] p-1 text-xs font-semibold">{(["revenue", "orders"] as const).map((m) => <button key={m} onClick={() => setMetric(m)} className={`relative rounded-full px-3 py-1.5 capitalize ${metric === m ? "text-white" : "text-black/55"}`}>{metric === m && <motion.span layoutId="chart-pill" className="absolute inset-0 rounded-full bg-black" />}<span className="relative">{m}</span></button>)}</div>
    </div>
    <svg viewBox={`0 -10 ${W} ${H + 40}`} className="mt-4 w-full">
      <defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#c8553d" stopOpacity=".25" /><stop offset="100%" stopColor="#c8553d" stopOpacity="0" /></linearGradient></defs>
      {[0, .25, .5, .75, 1].map((t) => <line key={t} x1={0} x2={W} y1={20 + t * (H - 20)} y2={20 + t * (H - 20)} stroke="#000" strokeOpacity=".06" />)}
      <motion.path key={metric + "a"} d={`${line} L${W},${H} L0,${H} Z`} fill="url(#area)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8, delay: .4 }} />
      <motion.path key={metric} d={line} fill="none" stroke="#c8553d" strokeWidth={3} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeInOut" }} />
      {pts.map(([x, y], i) => <motion.circle key={metric + i} cx={x} cy={y} r={4} fill="#fff" stroke="#c8553d" strokeWidth={2} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: .8 + i * .05 }} />)}
      {monthlySales.map((m, i) => <text key={m.month} x={(i / (monthlySales.length - 1)) * W} y={H + 24} textAnchor="middle" fontSize="12" fill="#000" fillOpacity=".45">{m.month}</text>)}
    </svg>
  </div>;
}
