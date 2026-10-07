"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Save } from "lucide-react";
import { defaultSettings } from "@/data/ecommerce";
import { useStore } from "@/components/ecommerce/store";
import { btnOutline, btnPrimary, input } from "@/components/ecommerce/ui";

export default function AdminSettings() {
  const { settings, setSettings, resetDemo, toast, theme, setTheme, locale, setLocale } = useStore();
  const [form, setForm] = useState(settings);
  const [confirm, setConfirm] = useState(false);
  const dirty = JSON.stringify(form) !== JSON.stringify(settings);
  return <div className="grid max-w-3xl gap-6">
    <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-sm text-l-fg/55">Store-wide options. Changes apply to the storefront immediately.</p></div>
    <form onSubmit={(e) => { e.preventDefault(); setSettings({ ...form, freeShippingOver: Number(form.freeShippingOver) }); toast("Settings saved"); }} className="grid gap-5 rounded-2xl bg-l-surface p-6">
      <h2 className="font-bold">General</h2>
      <label className="grid gap-1.5 text-sm font-semibold">Store name<input required value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className={input} /></label>
      <label className="grid gap-1.5 text-sm font-semibold">Announcement bar<input value={form.announcement} onChange={(e) => setForm({ ...form, announcement: e.target.value })} className={input} /></label>
      <label className="grid gap-1.5 text-sm font-semibold">Free shipping threshold ($)<input type="number" min={0} value={form.freeShippingOver} onChange={(e) => setForm({ ...form, freeShippingOver: Number(e.target.value) })} className={input} /></label>
      <div className="flex gap-2"><button disabled={!dirty} className={btnPrimary}><Save size={15} /> Save settings</button><button type="button" onClick={() => setForm(defaultSettings)} className={btnOutline}>Restore defaults</button></div>
    </form>
    <div className="grid gap-4 rounded-2xl bg-l-surface p-6">
      <h2 className="font-bold">Appearance</h2>
      <div className="flex flex-wrap gap-6 text-sm">
        <div><p className="mb-2 font-semibold">Theme</p><div className="flex rounded-full bg-l-bg p-1">{(["light", "dark"] as const).map((x) => <button key={x} onClick={() => setTheme(x)} className={`relative rounded-full px-4 py-1.5 font-semibold capitalize ${theme === x ? "text-l-bg" : "text-l-fg/55"}`}>{theme === x && <motion.span layoutId="set-theme" className="absolute inset-0 rounded-full bg-l-fg" />}<span className="relative">{x}</span></button>)}</div></div>
        <div><p className="mb-2 font-semibold">Storefront language</p><div className="flex rounded-full bg-l-bg p-1">{([["en", "English"], ["ne", "नेपाली"]] as const).map(([x, l]) => <button key={x} onClick={() => setLocale(x)} className={`relative rounded-full px-4 py-1.5 font-semibold ${locale === x ? "text-l-bg" : "text-l-fg/55"}`}>{locale === x && <motion.span layoutId="set-lang" className="absolute inset-0 rounded-full bg-l-fg" />}<span className="relative">{l}</span></button>)}</div></div>
      </div>
    </div>
    <div className="grid gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6">
      <h2 className="font-bold text-rose-600">Reset demo data</h2>
      <p className="text-sm text-l-fg/60">Clears products, orders, accounts, cart, wishlist and settings stored in this browser and restores the original demo catalogue.</p>
      <AnimatePresence mode="wait">{confirm ? <motion.div key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2"><button onClick={resetDemo} className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white">Yes, reset everything</button><button onClick={() => setConfirm(false)} className={btnOutline}>Cancel</button></motion.div>
        : <motion.button key="b" onClick={() => setConfirm(true)} className="flex items-center gap-2 justify-self-start rounded-full border border-rose-500/40 px-5 py-2.5 text-sm font-semibold text-rose-600"><RotateCcw size={15} /> Reset demo data</motion.button>}</AnimatePresence>
    </div>
  </div>;
}
