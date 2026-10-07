"use client";

import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { customers, formatPrice } from "@/data/ecommerce";

export default function AdminCustomers() {
  return <div className="grid gap-6">
    <div><h1 className="text-2xl font-bold">Customers</h1><p className="text-sm text-black/55">{customers.length} recent customers</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {customers.map((c, i) => <motion.div key={c.email} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .06 }} whileHover={{ y: -4 }} className="rounded-2xl bg-white p-5 transition-shadow hover:shadow-lg">
        <div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-full bg-[#f3f1ed] font-bold">{c.name.split(" ").map((n) => n[0]).join("")}</span><div><p className="font-semibold">{c.name}</p><p className="flex items-center gap-1 text-xs text-black/50"><Mail size={12} />{c.email}</p></div></div>
        <p className="mt-4 flex items-center gap-1 text-xs text-black/55"><MapPin size={12} />{c.location} · Joined {c.joined}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-black/5 pt-4 text-sm"><div><p className="text-xs text-black/45">Orders</p><p className="font-bold">{c.orders}</p></div><div><p className="text-xs text-black/45">Total spent</p><p className="font-bold">{formatPrice(c.spent)}</p></div></div>
      </motion.div>)}
    </div>
  </div>;
}
