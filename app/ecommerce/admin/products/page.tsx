"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, ImagePlus, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import { categories, formatPrice, img, type Product } from "@/data/ecommerce";
import { useStore } from "@/components/ecommerce/store";
import { btnOutline, btnPrimary, input } from "@/components/ecommerce/ui";

type Draft = { id?: number; name: string; category: string; type: string; price: string; compareAt: string; stock: string; image: string; description: string; featured: boolean };
const empty: Draft = { name: "", category: "women", type: "Tops", price: "", compareAt: "", stock: "", image: img("1434389677669-e08b4cac3105"), description: "", featured: false };

export default function AdminProductsPage() { return <Suspense><AdminProducts /></Suspense>; }

function AdminProducts() {
  const { products, setProducts, toast } = useStore();
  const params = useSearchParams();
  const [filter, setFilter] = useState(params.get("filter") === "low" ? "low" : "all");
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [confirm, setConfirm] = useState<Product | null>(null);
  const list = products.filter((p) => (filter === "all" || (filter === "low" ? p.stock < 15 : p.category === filter)) && p.name.toLowerCase().includes(q.toLowerCase()));

  const save = (e: React.FormEvent) => {
    e.preventDefault(); if (!draft) return;
    const data = { name: draft.name, category: draft.category, type: draft.type, price: +draft.price, compareAt: draft.compareAt ? +draft.compareAt : undefined, stock: +draft.stock, description: draft.description || "A new piece from the studio.", featured: draft.featured };
    if (draft.id) { setProducts((xs) => xs.map((x) => (x.id === draft.id ? { ...x, ...data, images: [draft.image, ...x.images.slice(1)] } : x))); toast(`${draft.name} updated`); }
    else {
      const id = Math.max(0, ...products.map((x) => x.id)) + 1;
      const base = products[0];
      const slug = `${draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${id}`;
      setProducts((xs) => [{ ...base, ...data, id, slug, images: [draft.image, draft.image], badge: "New", reviews: 0, rating: 5, sold: 0, createdAt: new Date().toISOString().slice(0, 10), details: ["Demo product created in admin"] }, ...xs]);
      toast(`${draft.name} created`);
    }
    setDraft(null);
  };
  const upload = (f?: File) => { if (!f || !draft) return; const r = new FileReader(); r.onload = () => setDraft({ ...draft, image: String(r.result) }); r.readAsDataURL(f); };
  const restock = (p: Product) => { setProducts((xs) => xs.map((x) => (x.id === p.id ? { ...x, stock: x.stock + 50 } : x))); toast(`Restocked ${p.name} (+50)`); };

  return <div className="grid gap-6">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="text-2xl font-bold">Products</h1><p className="text-sm text-l-fg/55">{products.length} products · changes are saved and appear in the storefront instantly</p></div>
      <button onClick={() => setDraft(empty)} className={btnPrimary}><Plus size={16} /> Add product</button>
    </div>
    <div className="rounded-2xl bg-l-surface p-5">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-full border border-l-fg/10 bg-l-bg px-4"><Search size={15} className="text-l-fg/45" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="bg-transparent py-2 text-sm outline-none" /></div>
        <div className="scrollbar-none flex gap-1 overflow-x-auto">{[["all", "All"], ...categories.map((c) => [c.slug, c.name]), ["low", "Low stock"]].map(([k, l]) => <button key={k} onClick={() => setFilter(k)} className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${filter === k ? "text-l-bg" : "text-l-fg/55"}`}>{filter === k && <motion.span layoutId="prod-filter" className="absolute inset-0 rounded-full bg-l-fg" />}<span className="relative">{l}</span></button>)}</div>
      </div>
      <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm">
        <thead className="text-xs uppercase tracking-wider text-l-fg/45"><tr><th className="py-2">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Sold</th><th className="text-right">Actions</th></tr></thead>
        <tbody><AnimatePresence initial={false}>{list.map((p) => <motion.tr key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} className="border-t border-l-fg/5">
          <td className="py-3"><div className="flex items-center gap-3"><img src={p.images[0]} alt="" className="size-11 rounded-lg object-cover" /><div><p className="font-semibold">{p.name}</p><p className="text-xs text-l-fg/45">{p.type}{p.featured ? " · Featured" : ""}</p></div></div></td>
          <td className="capitalize text-l-fg/60">{p.category}</td>
          <td className="font-semibold">{formatPrice(p.price)}{p.compareAt && <s className="ml-1 text-xs font-normal text-l-fg/40">{formatPrice(p.compareAt)}</s>}</td>
          <td><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.stock === 0 ? "bg-rose-500/15 text-rose-600" : p.stock < 15 ? "bg-amber-500/15 text-amber-600" : "bg-emerald-500/15 text-emerald-600"}`}>{p.stock === 0 ? "Sold out" : `${p.stock} in stock`}</span>
            {p.stock < 15 && <button onClick={() => restock(p)} className="ml-2 text-xs font-semibold text-l-accent hover:underline">Restock</button>}</td>
          <td className="text-l-fg/60">{p.sold.toLocaleString()}</td>
          <td><div className="flex justify-end gap-1">
            <Link aria-label="View in store" href={`/ecommerce/product/${p.slug}`} className="grid size-8 place-items-center rounded-lg hover:bg-l-fg/5"><ExternalLink size={15} /></Link>
            <button aria-label="Edit" onClick={() => setDraft({ id: p.id, name: p.name, category: p.category, type: p.type, price: String(p.price), compareAt: p.compareAt ? String(p.compareAt) : "", stock: String(p.stock), image: p.images[0], description: p.description, featured: !!p.featured })} className="grid size-8 place-items-center rounded-lg hover:bg-l-fg/5"><Pencil size={15} /></button>
            <button aria-label="Delete" onClick={() => setConfirm(p)} className="grid size-8 place-items-center rounded-lg text-rose-600 hover:bg-rose-500/10"><Trash2 size={15} /></button>
          </div></td>
        </motion.tr>)}</AnimatePresence></tbody>
      </table>{list.length === 0 && <p className="py-10 text-center text-sm text-l-fg/50">No products found.</p>}</div>
    </div>

    <AnimatePresence>{confirm && <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirm(null)}>
      <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: .94 }} animate={{ scale: 1 }} exit={{ scale: .94 }} className="w-full max-w-sm rounded-3xl bg-l-surface p-6 text-center">
        <img src={confirm.images[0]} alt="" className="mx-auto size-16 rounded-2xl object-cover" /><h2 className="mt-4 text-lg font-bold">Delete {confirm.name}?</h2><p className="mt-1 text-sm text-l-fg/55">It will be removed from the storefront.</p>
        <div className="mt-6 grid grid-cols-2 gap-2"><button onClick={() => setConfirm(null)} className={btnOutline}>Cancel</button><button onClick={() => { setProducts((xs) => xs.filter((x) => x.id !== confirm.id)); toast(`${confirm.name} deleted`); setConfirm(null); }} className="rounded-full bg-rose-600 py-3 text-sm font-semibold text-white">Delete</button></div>
      </motion.div>
    </motion.div>}</AnimatePresence>

    <AnimatePresence>{draft && <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDraft(null)}>
      <motion.form onSubmit={save} onClick={(e) => e.stopPropagation()} initial={{ scale: .94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .94, y: 20 }} className="grid max-h-[90vh] w-full max-w-xl gap-4 overflow-y-auto rounded-3xl bg-l-surface p-6">
        <div className="flex items-center justify-between"><h2 className="text-lg font-bold">{draft.id ? "Edit product" : "Add product"}</h2><button type="button" aria-label="Close" onClick={() => setDraft(null)}><X size={20} /></button></div>
        <div className="flex items-center gap-4">
          <label className="group relative size-24 shrink-0 cursor-pointer overflow-hidden rounded-2xl"><img src={draft.image} alt="" className="size-full object-cover" /><span className="absolute inset-0 grid place-items-center bg-black/50 text-white opacity-0 transition group-hover:opacity-100"><ImagePlus size={20} /></span><input type="file" accept="image/*" className="sr-only" onChange={(e) => upload(e.target.files?.[0])} /></label>
          <label className="grid flex-1 gap-1 text-sm font-semibold">Image URL (or click the image to upload)<input value={draft.image.startsWith("data:") ? "Uploaded image" : draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} className={input} /></label>
        </div>
        <label className="grid gap-1 text-sm font-semibold">Name<input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={input} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm font-semibold">Category<select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value, type: categories.find((c) => c.slug === e.target.value)!.types[0] })} className={input}>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
          <label className="grid gap-1 text-sm font-semibold">Type<select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} className={input}>{categories.find((c) => c.slug === draft.category)!.types.map((ty) => <option key={ty}>{ty}</option>)}</select></label>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <label className="grid gap-1 text-sm font-semibold">Price<input required type="number" min={1} value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} className={input} /></label>
          <label className="grid gap-1 text-sm font-semibold">Compare at<input type="number" min={0} value={draft.compareAt} onChange={(e) => setDraft({ ...draft, compareAt: e.target.value })} className={input} /></label>
          <label className="grid gap-1 text-sm font-semibold">Stock<input required type="number" min={0} value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.value })} className={input} /></label>
        </div>
        <label className="grid gap-1 text-sm font-semibold">Description<textarea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={input} /></label>
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={draft.featured} onChange={() => setDraft({ ...draft, featured: !draft.featured })} className="size-4 accent-[rgb(var(--l-accent))]" /> Featured product</label>
        <div className="flex justify-end gap-2"><button type="button" onClick={() => setDraft(null)} className={btnOutline}>Cancel</button><button className={btnPrimary}>Save product</button></div>
      </motion.form>
    </motion.div>}</AnimatePresence>
  </div>;
}
