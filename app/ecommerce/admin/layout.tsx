"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Bell, LayoutDashboard, Menu, Moon, Package, Settings, ShoppingCart, Store, Sun, Users, X } from "lucide-react";
import { useStore } from "@/components/ecommerce/store";

const nav = [
  ["Dashboard", "/ecommerce/admin", LayoutDashboard], ["Products", "/ecommerce/admin/products", Package],
  ["Orders", "/ecommerce/admin/orders", ShoppingCart], ["Customers", "/ecommerce/admin/customers", Users], ["Settings", "/ecommerce/admin/settings", Settings],
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings, orders, products, theme, setTheme } = useStore();
  const [open, setOpen] = useState(false);
  const [bell, setBell] = useState(false);
  const pending = orders.filter((o) => o.status === "Pending" || o.status === "Processing").length;
  const low = products.filter((p) => p.stock < 15);
  const notes = [...orders.filter((o) => o.status === "Pending").slice(0, 3).map((o) => [`New order ${o.id}`, `${o.customer} · $${o.total.toFixed(2)}`, "/ecommerce/admin/orders"]), ...low.slice(0, 3).map((p) => [`Low stock: ${p.name}`, `${p.stock} left`, "/ecommerce/admin/products"])];

  const sidebar = <div className="flex h-full flex-col bg-[#111] p-5 text-white">
    <Link href="/ecommerce/admin" className="px-2 font-serif text-2xl font-bold">{settings.storeName}<span className="text-[#e2755c]">.</span> <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white/45">Admin</span></Link>
    <nav className="mt-10 grid gap-1">
      {nav.map(([l, h, Icon]) => { const active = pathname === h; return <Link key={h} href={h} onClick={() => setOpen(false)} className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active ? "text-black" : "text-white/65 hover:text-white"}`}>
        {active && <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-xl bg-white" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
        <Icon size={18} className="relative" /><span className="relative flex-1">{l}</span>
        {l === "Orders" && pending > 0 && <span className="relative rounded-full bg-[#e2755c] px-2 text-[10px] font-bold leading-5 text-white">{pending}</span>}
      </Link>; })}
    </nav>
    <div className="mt-auto grid gap-1 border-t border-white/10 pt-4 text-sm">
      <Link href="/ecommerce" className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold text-white/65 hover:text-white"><Store size={18} /> View storefront</Link>
      <Link href="/templates" className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold text-white/65 hover:text-white"><ArrowLeft size={18} /> All templates</Link>
    </div>
  </div>;

  return <div className="min-h-screen bg-l-bg">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>
    <AnimatePresence>{open && <>
      <motion.div className="fixed inset-0 z-40 bg-black/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
      <motion.aside className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>{sidebar}</motion.aside>
    </>}</AnimatePresence>
    <div className="lg:pl-64">
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-l-fg/5 bg-l-bg/90 px-4 backdrop-blur lg:px-8">
        <button aria-label="Open sidebar" onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-full hover:bg-l-fg/5 lg:hidden">{open ? <X /> : <Menu size={20} />}</button>
        <p className="text-sm font-semibold text-l-fg/55">{nav.find(([, h]) => h === pathname)?.[0] ?? "Admin"}</p>
        <div className="ml-auto flex items-center gap-2">
          <button aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="grid size-10 place-items-center rounded-full bg-l-surface">{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button>
          <div className="relative">
            <button aria-label="Notifications" onClick={() => setBell(!bell)} className="relative grid size-10 place-items-center rounded-full bg-l-surface"><Bell size={18} />{notes.length > 0 && <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-l-accent" />}</button>
            <AnimatePresence>{bell && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="absolute right-0 top-12 z-30 w-72 rounded-2xl border border-l-fg/10 bg-l-surface p-2 shadow-xl">
              <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-l-fg/45">Notifications</p>
              {notes.length === 0 ? <p className="px-3 pb-3 text-sm text-l-fg/55">You&apos;re all caught up.</p> : notes.map(([title, sub, href]) => <Link key={title} href={href} onClick={() => setBell(false)} className="block rounded-xl px-3 py-2 hover:bg-l-fg/5"><p className="text-sm font-semibold">{title}</p><p className="text-xs text-l-fg/50">{sub}</p></Link>)}
            </motion.div>}</AnimatePresence>
          </div>
          <div className="flex items-center gap-2"><span className="grid size-10 place-items-center rounded-full bg-l-accent text-sm font-bold text-white">AD</span><span className="hidden text-sm font-semibold sm:block">Admin</span></div>
        </div>
      </header>
      <motion.main key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }} className="p-4 lg:p-8">{children}</motion.main>
    </div>
  </div>;
}
