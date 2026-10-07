"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Bell, LayoutDashboard, Menu, Package, Search, ShoppingCart, Store, Users, X } from "lucide-react";
import { store } from "@/data/ecommerce";

const nav = [
  ["Dashboard", "/ecommerce/admin", LayoutDashboard], ["Products", "/ecommerce/admin/products", Package],
  ["Orders", "/ecommerce/admin/orders", ShoppingCart], ["Customers", "/ecommerce/admin/customers", Users],
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const sidebar = <div className="flex h-full flex-col bg-[#111] p-5 text-white">
    <Link href="/ecommerce/admin" className="px-2 font-serif text-2xl font-bold">{store.name}<span className="text-[#c8553d]">.</span> <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white/45">Admin</span></Link>
    <nav className="mt-10 grid gap-1">
      {nav.map(([l, h, Icon]) => { const active = pathname === h; return <Link key={h} href={h} onClick={() => setOpen(false)} className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active ? "text-black" : "text-white/65 hover:text-white"}`}>
        {active && <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-xl bg-white" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
        <Icon size={18} className="relative" /><span className="relative">{l}</span>
      </Link>; })}
    </nav>
    <div className="mt-auto grid gap-1 border-t border-white/10 pt-4 text-sm">
      <Link href="/ecommerce" className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold text-white/65 hover:text-white"><Store size={18} /> View storefront</Link>
      <Link href="/templates" className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold text-white/65 hover:text-white"><ArrowLeft size={18} /> All templates</Link>
    </div>
  </div>;

  return <div className="min-h-screen bg-[#f3f1ed]">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>
    <AnimatePresence>{open && <>
      <motion.div className="fixed inset-0 z-40 bg-black/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
      <motion.aside className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>{sidebar}</motion.aside>
    </>}</AnimatePresence>
    <div className="lg:pl-64">
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-black/5 bg-[#f3f1ed]/90 px-4 backdrop-blur lg:px-8">
        <button aria-label="Open sidebar" onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-full hover:bg-black/5 lg:hidden">{open ? <X /> : <Menu size={20} />}</button>
        <div className="flex max-w-sm flex-1 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-black/45"><Search size={16} /><input placeholder="Search…" className="w-full bg-transparent outline-none" /></div>
        <div className="ml-auto flex items-center gap-3">
          <button aria-label="Notifications" className="relative grid size-10 place-items-center rounded-full bg-white"><Bell size={18} /><span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-[#c8553d]" /></button>
          <div className="flex items-center gap-2"><span className="grid size-10 place-items-center rounded-full bg-[#c8553d] text-sm font-bold text-white">AD</span><span className="hidden text-sm font-semibold sm:block">Admin</span></div>
        </div>
      </header>
      <motion.main key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }} className="p-4 lg:p-8">{children}</motion.main>
    </div>
  </div>;
}
