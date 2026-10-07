"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { categories, formatPrice, img, products as seed, type Product } from "@/data/ecommerce";

type Draft = { id?: number; name: string; category: string; price: string; stock: string; image: string };
const empty: Draft = { name: "", category: "women", price: "", stock: "", image: img("1434389677669-e08b4cac3105") };

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>(seed);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const list = items.filter((p) => (filter === "all" || p.category === filter) && p.name.toLowerCase().includes(q.toLowerCase()));

  const save = (e: React.FormEvent) => {
    e.preventDefault(); if (!draft) return;
    const data = { name: draft.name, category: draft.category, price: +draft.price, stock: +draft.stock };
    if (draft.id) setItems((xs) => xs.map((x) => (x.id === draft.id ? { ...x, ...data, images: [draft.image, ...x.images.slice(1)] } : x)));
    else {
      const id = Math.max(...items.map((x) => x.id)) + 1;
      setItems((xs) => [{ ...seed[0], ...data, id, slug: `custom-${id}`, images: [draft.image, draft.image, draft.image], badge: "New", reviews: 0, rating: 5 }, ...xs]);
    }
    setDraft(null);
  };

  return <div className="grid gap-6">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="text-2xl font-bold">Products</h1><p className="text-sm text-black/55">{items.length} products in catalogue</p></div>
      <button onClick={() => setDraft(empty)} className="flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c8553d]"><Plus size={16} /> Add product</button>
    </div>
    <div className="rounded-2xl bg-white p-5">
      <div className="flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="rounded-full border border-black/10 bg-[#f3f1ed] px-4 py-2 text-sm outline-none focus:border-black" />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-full border border-black/10 bg-[#f3f1ed] px-4 py-2 text-sm font-semibold outline-none">
          <option value="all">All categories</option>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>
      <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm">
        <thead className="text-xs uppercase tracking-wider text-black/45"><tr><th className="py-2">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th className="text-right">Actions</th></tr></thead>
        <tbody><AnimatePresence initial={false}>{list.map((p) => <motion.tr key={p.id} layout initial={{ opacity: 0, backgroundColor: "#fdf2ee" }} animate={{ opacity: 1, backgroundColor: "#ffffff" }} exit={{ opacity: 0 }} transition={{ backgroundColor: { duration: 1.5 } }} className="border-t border-black/5">
          <td className="py-3"><div className="flex items-center gap-3"><img src={p.images[0]} alt="" className="size-11 rounded-lg object-cover" /><span className="font-semibold">{p.name}</span></div></td>
          <td className="capitalize text-black/60">{p.category}</td><td className="font-semibold">{formatPrice(p.price)}</td>
          <td><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.stock < 20 ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}>{p.stock} in stock</span></td>
          <td>{p.rating.toFixed(1)}</td>
          <td><div className="flex justify-end gap-1">
            <button aria-label="Edit" onClick={() => setDraft({ id: p.id, name: p.name, category: p.category, price: String(p.price), stock: String(p.stock), image: p.images[0] })} className="grid size-8 place-items-center rounded-lg hover:bg-black/5"><Pencil size={15} /></button>
            <button aria-label="Delete" onClick={() => setItems((xs) => xs.filter((x) => x.id !== p.id))} className="grid size-8 place-items-center rounded-lg text-rose-700 hover:bg-rose-50"><Trash2 size={15} /></button>
          </div></td>
        </motion.tr>)}</AnimatePresence></tbody>
      </table></div>
    </div>
    <AnimatePresence>{draft && <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDraft(null)}>
      <motion.form onSubmit={save} onClick={(e) => e.stopPropagation()} initial={{ scale: .94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .94, y: 20 }} className="grid w-full max-w-lg gap-4 rounded-3xl bg-white p-6">
        <div className="flex items-center justify-between"><h2 className="text-lg font-bold">{draft.id ? "Edit product" : "Add product"}</h2><button type="button" aria-label="Close" onClick={() => setDraft(null)}><X size={20} /></button></div>
        <div className="flex items-center gap-4"><img src={draft.image} alt="" className="size-20 rounded-xl object-cover" /><label className="grid flex-1 gap-1 text-sm font-semibold">Image URL<input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} className="rounded-xl border border-black/15 px-3 py-2 font-normal" /></label></div>
        <label className="grid gap-1 text-sm font-semibold">Name<input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="rounded-xl border border-black/15 px-3 py-2 font-normal" /></label>
        <div className="grid grid-cols-3 gap-3">
          <label className="grid gap-1 text-sm font-semibold">Category<select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="rounded-xl border border-black/15 px-3 py-2 font-normal">{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
          <label className="grid gap-1 text-sm font-semibold">Price<input required type="number" min={1} value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} className="rounded-xl border border-black/15 px-3 py-2 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold">Stock<input required type="number" min={0} value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.value })} className="rounded-xl border border-black/15 px-3 py-2 font-normal" /></label>
        </div>
        <div className="flex justify-end gap-2"><button type="button" onClick={() => setDraft(null)} className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold">Cancel</button><button className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white">Save product</button></div>
      </motion.form>
    </motion.div>}</AnimatePresence>
  </div>;
}
