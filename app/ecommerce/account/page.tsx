"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, Package, Save } from "lucide-react";
import { formatPrice } from "@/data/ecommerce";
import { AccountShell } from "@/components/ecommerce/account-shell";
import { useStore } from "@/components/ecommerce/store";
import { btnPrimary, input } from "@/components/ecommerce/ui";

export default function AccountPage() {
  return <AccountShell title="My account"><Overview /></AccountShell>;
}

function Overview() {
  const { user, orders, wishlist, addresses, updateUser, toast } = useStore();
  const mine = orders.filter((o) => o.email.toLowerCase() === user!.email.toLowerCase());
  const spent = mine.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
  const [form, setForm] = useState({ name: user!.name, phone: user!.phone ?? "" });
  const stats = [[Package, "Orders", mine.length, "/ecommerce/account/orders"], [Heart, "Wishlist", wishlist.length, "/ecommerce/wishlist"], [MapPin, "Addresses", addresses.length, "/ecommerce/account/addresses"]] as const;
  return <div className="grid gap-6">
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-5 rounded-3xl bg-l-fg p-7 text-l-bg">
      <span className="grid size-16 place-items-center rounded-full bg-l-accent text-xl font-bold text-white">{user!.name.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase()}</span>
      <div className="flex-1"><p className="text-sm opacity-60">Hello,</p><p className="font-serif text-3xl font-bold">{user!.name}</p><p className="text-xs opacity-60">Member since {new Date(user!.joined).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p></div>
      <div className="text-right"><p className="text-xs opacity-60">Lifetime spend</p><p className="text-2xl font-bold">{formatPrice(spent)}</p></div>
    </motion.div>
    <div className="grid gap-4 sm:grid-cols-3">{stats.map(([Icon, label, n, href], i) => <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 * (i + 1) }}>
      <Link href={href} className="flex items-center gap-4 rounded-3xl bg-l-surface p-5 transition hover:shadow-lg"><span className="grid size-11 place-items-center rounded-2xl bg-l-bg"><Icon size={19} /></span><div><p className="text-2xl font-bold">{n}</p><p className="text-sm text-l-fg/55">{label}</p></div></Link>
    </motion.div>)}</div>
    <div className="grid gap-6 xl:grid-cols-2">
      <form onSubmit={(e) => { e.preventDefault(); updateUser(form); toast("Profile updated"); }} className="grid gap-4 rounded-3xl bg-l-surface p-6">
        <h2 className="font-bold">Profile</h2>
        <label className="grid gap-1.5 text-sm font-semibold">Full name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} /></label>
        <label className="grid gap-1.5 text-sm font-semibold">Email<input disabled value={user!.email} className={`${input} opacity-60`} /></label>
        <label className="grid gap-1.5 text-sm font-semibold">Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} /></label>
        <button className={`${btnPrimary} justify-self-start`}><Save size={15} /> Save changes</button>
      </form>
      <div className="rounded-3xl bg-l-surface p-6">
        <div className="flex items-center justify-between"><h2 className="font-bold">Recent orders</h2><Link href="/ecommerce/account/orders" className="text-sm font-semibold text-l-accent">View all</Link></div>
        {mine.length === 0 ? <div className="py-10 text-center text-sm text-l-fg/55"><Package className="mx-auto mb-2 text-l-fg/25" size={32} />No orders yet. <Link href="/ecommerce/shop" className="font-semibold text-l-accent">Start shopping</Link></div>
          : <ul className="mt-4 grid gap-3">{mine.slice(0, 3).map((o) => <li key={o.id}><Link href={`/ecommerce/track-order?id=${o.id}`} className="flex items-center gap-3 rounded-2xl border border-l-fg/10 p-3 transition hover:border-l-fg">
            <div className="flex -space-x-3">{o.items.slice(0, 3).map((it) => <img key={it.productId} src={it.image} alt="" className="size-10 rounded-full border-2 border-l-surface object-cover" />)}</div>
            <div className="flex-1 text-sm"><p className="font-semibold">{o.id}</p><p className="text-xs text-l-fg/50">{new Date(o.date).toLocaleDateString()} · {o.status}</p></div><b className="text-sm">{formatPrice(o.total)}</b>
          </Link></li>)}</ul>}
      </div>
    </div>
  </div>;
}
