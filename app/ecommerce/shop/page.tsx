"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, Rows3, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { categories, formatPrice, products } from "@/data/ecommerce";
import { ProductCard, Stars } from "@/components/ecommerce/product-card";
import { useStore } from "@/components/ecommerce/store";

const sorts = { featured: "Featured", "price-asc": "Price: low to high", "price-desc": "Price: high to low", rating: "Top rated", newest: "Newest" } as const;
type SortKey = keyof typeof sorts;
const allColors = Array.from(new Map(products.flatMap((p) => p.colors).map((c) => [c.name, c])).values());
const allSizes = ["XS", "S", "M", "L", "XL"];

export default function ShopPage() {
  return <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-24 lg:px-8">Loading…</div>}><Shop /></Suspense>;
}

function Shop() {
  const params = useSearchParams();
  const router = useRouter();
  const category = params.get("category") ?? "all";
  const saleOnly = params.get("sale") === "1";
  const [sort, setSort] = useState<SortKey>("featured");
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(300);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const list = useMemo(() => {
    let r = products.filter((p) => (category === "all" || p.category === category) && (!saleOnly || p.compareAt) && p.price <= maxPrice
      && (!colors.length || p.colors.some((c) => colors.includes(c.name))) && (!sizes.length || p.sizes.some((s) => sizes.includes(s))));
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    if (sort === "newest") r = [...r].sort((a, b) => b.id - a.id);
    return r;
  }, [category, saleOnly, sort, colors, sizes, maxPrice]);

  const setCategory = (c: string) => router.push(c === "all" ? "/ecommerce/shop" : `/ecommerce/shop?category=${c}`, { scroll: false });
  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const reset = () => { setColors([]); setSizes([]); setMaxPrice(300); router.push("/ecommerce/shop", { scroll: false }); };
  const title = saleOnly ? "Sale" : category === "all" ? "All products" : categories.find((c) => c.slug === category)?.name;

  const filters = <div className="grid gap-8">
    <FilterGroup title="Category">
      {[{ slug: "all", name: "All" }, ...categories].map((c) => <button key={c.slug} onClick={() => setCategory(c.slug)} className={`flex w-full items-center justify-between py-1.5 text-left text-sm transition ${category === c.slug ? "font-bold" : "text-black/60 hover:text-black"}`}>
        {c.name}<span className="text-xs text-black/40">{c.slug === "all" ? products.length : products.filter((p) => p.category === c.slug).length}</span>
      </button>)}
    </FilterGroup>
    <FilterGroup title={`Max price: ${formatPrice(maxPrice)}`}>
      <input type="range" min={20} max={300} step={5} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-[#c8553d]" />
    </FilterGroup>
    <FilterGroup title="Size">
      <div className="flex flex-wrap gap-2">{allSizes.map((s) => <button key={s} onClick={() => toggle(sizes, setSizes, s)} className={`h-9 min-w-9 rounded-lg border px-2 text-xs font-semibold transition ${sizes.includes(s) ? "border-black bg-black text-white" : "border-black/15 hover:border-black"}`}>{s}</button>)}</div>
    </FilterGroup>
    <FilterGroup title="Color">
      <div className="flex flex-wrap gap-2">{allColors.map((c) => <button key={c.name} title={c.name} aria-label={c.name} onClick={() => toggle(colors, setColors, c.name)} className={`size-8 rounded-full border-2 transition ${colors.includes(c.name) ? "border-black ring-2 ring-white ring-offset-0" : "border-black/10"}`} style={{ background: c.hex }} />)}</div>
    </FilterGroup>
    <button onClick={reset} className="rounded-full border border-black/15 py-2.5 text-sm font-semibold transition hover:border-black">Reset filters</button>
  </div>;

  return <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
    <nav className="text-xs text-black/50"><Link href="/ecommerce" className="hover:text-black">Home</Link> / <span className="text-black">Shop</span></nav>
    <motion.h1 key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-3 font-serif text-5xl font-bold tracking-tight md:text-6xl">{title}</motion.h1>
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-y border-black/10 py-3">
      <div className="flex items-center gap-3">
        <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm font-semibold lg:hidden"><SlidersHorizontal size={15} /> Filters</button>
        <p className="text-sm text-black/55">{list.length} products</p>
      </div>
      <div className="flex items-center gap-2">
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-semibold outline-none">
          {Object.entries(sorts).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <div className="flex rounded-full border border-black/15 bg-white p-1">
          {(["grid", "list"] as const).map((v) => <button key={v} aria-label={`${v} view`} onClick={() => setView(v)} className={`relative grid size-8 place-items-center rounded-full ${view === v ? "text-white" : "text-black/50"}`}>
            {view === v && <motion.span layoutId="view-pill" className="absolute inset-0 rounded-full bg-black" />}
            <span className="relative">{v === "grid" ? <LayoutGrid size={15} /> : <Rows3 size={15} />}</span>
          </button>)}
        </div>
      </div>
    </div>
    <div className="mt-8 grid gap-10 lg:grid-cols-[230px_1fr]">
      <aside className="hidden lg:block">{filters}</aside>
      <div>
        {list.length === 0 ? <div className="grid place-items-center rounded-3xl bg-white py-24 text-center"><p className="font-semibold">No products match these filters.</p><button onClick={reset} className="mt-4 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white">Clear filters</button></div>
          : view === "grid" ? <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
            <AnimatePresence mode="popLayout">{list.map((p, i) => <motion.div key={p.id} layout exit={{ opacity: 0, scale: .9 }}><ProductCard product={p} index={i} /></motion.div>)}</AnimatePresence>
          </motion.div>
            : <div className="grid gap-4"><AnimatePresence mode="popLayout">{list.map((p, i) => <ListRow key={p.id} index={i} id={p.id} />)}</AnimatePresence></div>}
      </div>
    </div>
    <AnimatePresence>
      {filtersOpen && <>
        <motion.div className="fixed inset-0 z-50 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFiltersOpen(false)} />
        <motion.aside className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm overflow-y-auto bg-white p-6" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>
          <div className="mb-6 flex items-center justify-between"><h2 className="text-lg font-bold">Filters</h2><button aria-label="Close filters" onClick={() => setFiltersOpen(false)}><X /></button></div>
          {filters}
        </motion.aside>
      </>}
    </AnimatePresence>
  </div>;
}

function ListRow({ id, index }: { id: number; index: number }) {
  const p = products.find((x) => x.id === id)!;
  const { addToCart } = useStore();
  return <motion.div layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: index * .04 }} className="group flex gap-5 rounded-3xl bg-white p-4">
    <Link href={`/ecommerce/product/${p.slug}`} className="w-32 shrink-0 overflow-hidden rounded-2xl sm:w-44"><img src={p.images[0]} alt={p.name} className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-105" /></Link>
    <div className="flex flex-1 flex-col py-2">
      <p className="text-xs font-bold uppercase tracking-widest text-black/40">{p.category}</p>
      <Link href={`/ecommerce/product/${p.slug}`} className="mt-1 text-xl font-semibold hover:underline">{p.name}</Link>
      <div className="mt-1 flex items-center gap-2 text-xs text-black/50"><Stars rating={p.rating} />({p.reviews})</div>
      <p className="mt-3 line-clamp-2 max-w-xl text-sm text-black/60">{p.description}</p>
      <div className="mt-auto flex items-center justify-between pt-4"><b>{formatPrice(p.price)} {p.compareAt && <s className="ml-1 text-sm font-normal text-black/40">{formatPrice(p.compareAt)}</s>}</b>
        <button onClick={() => addToCart(p)} className="rounded-full bg-black px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#c8553d]">Add to bag</button></div>
    </div>
  </motion.div>;
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><h3 className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-black/45">{title}</h3>{children}</div>;
}
