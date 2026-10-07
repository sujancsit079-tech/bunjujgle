"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Pencil, Plus, Trash2, X } from "lucide-react";
import type { Address } from "@/data/ecommerce";
import { AccountShell } from "@/components/ecommerce/account-shell";
import { useStore } from "@/components/ecommerce/store";
import { btnOutline, btnPrimary, input } from "@/components/ecommerce/ui";

export default function AddressesPage() {
  return <AccountShell title="Addresses"><Addresses /></AccountShell>;
}

function Addresses() {
  const { addresses, saveAddress, removeAddress, user, toast } = useStore();
  const [draft, setDraft] = useState<Address | null>(null);
  const blank = (): Address => ({ id: `a-${Date.now()}`, label: "Home", name: user!.name, line1: "", city: "", postal: "", country: "Nepal", phone: user!.phone ?? "" });
  const field = (k: keyof Address, label: string, type = "text") => <label className="grid gap-1.5 text-sm font-semibold">{label}<input required type={type} value={draft![k]} onChange={(e) => setDraft({ ...draft!, [k]: e.target.value })} className={input} /></label>;

  return <div>
    <div className="flex justify-end"><button onClick={() => setDraft(blank())} className={btnPrimary}><Plus size={16} /> Add address</button></div>
    {addresses.length === 0 ? <div className="mt-6 grid place-items-center rounded-3xl bg-l-surface py-16 text-center"><MapPin size={40} className="text-l-fg/20" /><p className="mt-3 font-semibold">No saved addresses</p><p className="text-sm text-l-fg/55">Save one now for faster checkout.</p></div>
      : <div className="mt-6 grid gap-4 md:grid-cols-2"><AnimatePresence>{addresses.map((a, i) => <motion.div key={a.id} layout initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .9 }} className="relative rounded-3xl bg-l-surface p-6">
        {i === 0 && <span className="absolute right-5 top-5 rounded-full bg-l-success/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-l-success">Default</span>}
        <p className="text-xs font-bold uppercase tracking-wider text-l-accent">{a.label}</p><p className="mt-2 font-semibold">{a.name}</p>
        <p className="text-sm text-l-fg/60">{a.line1}</p><p className="text-sm text-l-fg/60">{a.city} {a.postal}, {a.country}</p><p className="text-sm text-l-fg/60">{a.phone}</p>
        <div className="mt-4 flex gap-2"><button onClick={() => setDraft(a)} className="flex items-center gap-1.5 rounded-full border border-l-fg/15 px-3 py-1.5 text-xs font-semibold hover:border-l-fg"><Pencil size={12} /> Edit</button>
          <button onClick={() => { removeAddress(a.id); toast("Address removed"); }} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-l-accent hover:bg-l-accent/10"><Trash2 size={12} /> Remove</button></div>
      </motion.div>)}</AnimatePresence></div>}
    <AnimatePresence>{draft && <motion.div className="fixed inset-0 z-[55] grid place-items-center bg-black/45 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDraft(null)}>
      <motion.form onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); saveAddress(draft); toast("Address saved"); setDraft(null); }} initial={{ y: 30, scale: .96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} className="grid w-full max-w-lg gap-4 rounded-3xl bg-l-surface p-6">
        <div className="flex items-center justify-between"><h2 className="text-lg font-bold">{addresses.some((a) => a.id === draft.id) ? "Edit address" : "New address"}</h2><button type="button" aria-label="Close" onClick={() => setDraft(null)}><X /></button></div>
        <div className="flex gap-2">{["Home", "Work", "Other"].map((l) => <button type="button" key={l} onClick={() => setDraft({ ...draft, label: l })} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${draft.label === l ? "bg-l-fg text-l-bg" : "border border-l-fg/15"}`}>{l}</button>)}</div>
        <div className="grid gap-4 sm:grid-cols-2">{field("name", "Full name")}{field("phone", "Phone", "tel")}</div>
        {field("line1", "Address")}
        <div className="grid gap-4 sm:grid-cols-3">{field("city", "City")}{field("postal", "Postal code")}{field("country", "Country")}</div>
        <div className="flex justify-end gap-2"><button type="button" onClick={() => setDraft(null)} className={btnOutline}>Cancel</button><button className={btnPrimary}>Save address</button></div>
      </motion.form>
    </motion.div>}</AnimatePresence>
  </div>;
}
