"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Sparkles } from "lucide-react";
import { formatPrice, seedCustomers } from "@/data/ecommerce";
import { useStore } from "@/components/ecommerce/store";

export default function AdminCustomers() {
  const { orders, users } = useStore();
  const all = [...users.map((u) => ({ name: u.name, email: u.email, joined: u.joined.slice(0, 10), location: "Registered online", isNew: true })), ...seedCustomers.map((c) => ({ ...c, isNew: false }))];
  return <div className="grid gap-6">
    <div><h1 className="text-2xl font-bold">Customers</h1><p className="text-sm text-l-fg/55">{all.length} customers · accounts created in the storefront show up here</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {all.map((c, i) => { const mine = orders.filter((o) => o.email.toLowerCase() === c.email.toLowerCase()); const spent = mine.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0); return <motion.div key={c.email} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05 }} whileHover={{ y: -4 }} className="relative rounded-2xl bg-l-surface p-5 transition-shadow hover:shadow-lg">
        {c.isNew && <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-l-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase text-l-accent"><Sparkles size={10} /> New</span>}
        <div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-full bg-l-bg font-bold">{c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</span><div className="min-w-0"><p className="font-semibold">{c.name}</p><p className="flex items-center gap-1 truncate text-xs text-l-fg/50"><Mail size={12} />{c.email}</p></div></div>
        <p className="mt-4 flex items-center gap-1 text-xs text-l-fg/55"><MapPin size={12} />{c.location} · Joined {c.joined}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-l-fg/5 pt-4 text-sm"><div><p className="text-xs text-l-fg/45">Orders</p><p className="font-bold">{mine.length}</p></div><div><p className="text-xs text-l-fg/45">Total spent</p><p className="font-bold">{formatPrice(spent)}</p></div></div>
      </motion.div>; })}
    </div>
  </div>;
}
