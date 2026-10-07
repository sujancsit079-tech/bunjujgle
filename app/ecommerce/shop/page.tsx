"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, Rows3, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { categories, formatPrice, type Product, type TKey } from "@/data/ecommerce";
import { CardSkeleton, Crumbs, ProductCard, Stars, btnOutline, btnPrimary } from "@/components/ecommerce/ui";
import { RecentlyViewed } from "@/components/ecommerce/sections";
import { useStore } from "@/components/ecommerce/store";

const sorts = { featured: "Featured", newest: "Newest", best: "Best selling", "price-asc": "Price: low to high", "price-desc": "Price: high to low", rating: "Top rated" } as const;
type SortKey = keyof typeof sorts;
const PAGE = 9;

export default function ShopPage() {
  return <Suspense fallback={<div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-24 md:grid-cols-3 lg:px-8">{Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}</div>}><Shop /></Suspense>;
}

function Shop() {
  const { products, t } = useStore();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = params.get("category") ?? "all";
  const type = params.get("type");
  const sale = params.get("sale") === "1";
  const featured = params.get("featured") === "1";
  const q = params.get("q") ?? "";
  const sort = (params.get("sort") as SortKey) in sorts ? (params.get("sort") as SortKey) : "featured";
  const sizes = params.get("sizes")?.split(",").filter(Boolean) ?? [];
  const colors = params.get("colors")?.split(",").filter(Boolean) ?? [];
  const max = Number(params.get("max") ?? 0) || 0;
  const inStock = params.get("stock") === "1";

  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE);
  const [loading, setLoading] = useState(false);
  const [priceDraft, setPriceDraft] = useState(max || 450);
  useEffect(() => { setVisible(PAGE); setPriceDraft(max || 450); }, [params, max]);

  const update = (patch: Record<string, string | null>) => {
    const sp = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([key, v]) => (v === null || v === "" ? sp.delete(key) : sp.set(key, v)));
    if ("category" in patch) sp.delete("type");
    router.push(`${pathname}${sp.toString() ? `?${sp}` : ""}`, { scroll: false });
  };
  const toggleList = (key: "sizes" | "colors", list: string[], v: string) => update({ [key]: (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]).join(",") || null });

  const scoped = products.filter((p) => category === "all" || p.category === category);
  const allColors = Array.from(new Map(scoped.flatMap((p) => p.colors).map((c) => [c.name, c])).values());
  const allSizes = Array.from(new Set(scoped.flatMap((p) => p.sizes)));

  const list = useMemo(() => {
    const s = q.toLowerCase();
    let r = scoped.filter((p) => (!type || p.type === type) && (!sale || p.compareAt) && (!featured || p.featured) && (!max || p.price <= max) && (!inStock || p.stock > 0)
      && (!s || `${p.name} ${p.type} ${p.category}`.toLowerCase().includes(s))
      && (!colors.length || p.colors.some((c) => colors.includes(c.name))) && (!sizes.length || p.sizes.some((x) => sizes.includes(x))));
    const cmp: Record<SortKey, (a: Product, b: Product) => number> = {
      featured: (a, b) => Number(!!b.featured) - Number(!!a.featured) || b.sold - a.sold, newest: (a, b) => b.createdAt.localeCompare(a.createdAt), best: (a, b) => b.sold - a.sold,
      "price-asc": (a, b) => a.price - b.price, "price-desc": (a, b) => b.price - a.price, rating: (a, b) => b.rating - a.rating,
    };
    r = [...r].sort(cmp[sort]);
    return r;
  }, [scoped, type, sale, featured, max, inStock, q, colors, sizes, sort]);

  const chips: [string, () => void][] = [
    ...(category !== "all" ? [[t(category as TKey), () => update({ category: null })] as [string, () => void]] : []),
    ...(type ? [[type, () => update({ type: null })] as [string, () => void]] : []),
    ...(q ? [[`“${q}”`, () => update({ q: null })] as [string, () => void]] : []),
    ...(sale ? [[t("sale"), () => update({ sale: null })] as [string, () => void]] : []),
    ...(featured ? [[t("featured"), () => update({ featured: null })] as [string, () => void]] : []),
    ...(inStock ? [["In stock", () => update({ stock: null })] as [string, () => void]] : []),
    ...(max ? [[`Under ${formatPrice(max)}`, () => update({ max: null })] as [string, () => void]] : []),
    ...sizes.map((s) => [`Size ${s}`, () => toggleList("sizes", sizes, s)] as [string, () => void]),
    ...colors.map((c) => [c, () => toggleList("colors", colors, c)] as [string, () => void]),
  ];

  const loadMore = () => { setLoading(true); setTimeout(() => { setVisible((v) => v + 6); setLoading(false); }, 700); };
  const title = q ? `Results for “${q}”` : sale ? t("sale") : featured ? t("featured") : type ?? (category === "all" ? (sort === "newest" ? t("newArrivals") : sort === "best" ? t("bestSellers") : t("allProducts")) : t(category as TKey));

  const filters = <div className="grid gap-8">
    <Group title={t("categories")}>
      {[{ slug: "all", name: t("allProducts") }, ...categories.map((c) => ({ slug: c.slug, name: t(c.slug as TKey) }))].map((c) => <button key={c.slug} onClick={() => update({ category: c.slug === "all" ? null : c.slug })} className={`flex w-full items-center justify-between py-1.5 text-left text-sm transition ${category === c.slug ? "font-bold" : "text-l-fg/60 hover:text-l-fg"}`}>
        {c.name}<span className="text-xs text-l-fg/40">{c.slug === "all" ? products.length : products.filter((p) => p.category === c.slug).length}</span>
      </button>)}
      {category !== "all" && <div className="mt-2 flex flex-wrap gap-1.5">{categories.find((c) => c.slug === category)?.types.map((ty) => <button key={ty} onClick={() => update({ type: type === ty ? null : ty })} className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${type === ty ? "border-l-fg bg-l-fg text-l-bg" : "border-l-fg/15 hover:border-l-fg"}`}>{ty}</button>)}</div>}
    </Group>
    <Group title={`Max price: ${formatPrice(priceDraft)}`}>
      <input aria-label="Maximum price" type="range" min={20} max={450} step={10} value={priceDraft} onChange={(e) => setPriceDraft(+e.target.value)} onPointerUp={() => update({ max: priceDraft >= 450 ? null : String(priceDraft) })} onKeyUp={() => update({ max: priceDraft >= 450 ? null : String(priceDraft) })} className="w-full accent-[rgb(var(--l-accent))]" />
    </Group>
    <Group title="Size">
      <div className="flex flex-wrap gap-2">{allSizes.map((s) => <button key={s} onClick={() => toggleList("sizes", sizes, s)} className={`h-9 min-w-9 rounded-lg border px-2 text-xs font-semibold transition ${sizes.includes(s) ? "border-l-fg bg-l-fg text-l-bg" : "border-l-fg/15 hover:border-l-fg"}`}>{s}</button>)}</div>
    </Group>
    <Group title="Color">
      <div className="flex flex-wrap gap-2">{allColors.map((c) => <button key={c.name} title={c.name} aria-label={c.name} aria-pressed={colors.includes(c.name)} onClick={() => toggleList("colors", colors, c.name)} className={`size-8 rounded-full border-2 transition ${colors.includes(c.name) ? "scale-110 border-l-fg" : "border-l-fg/10"}`} style={{ background: c.hex }} />)}</div>
    </Group>
    <Group title="Availability">
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={inStock} onChange={() => update({ stock: inStock ? null : "1" })} className="size-4 accent-[rgb(var(--l-accent))]" /> In stock only</label>
      <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={sale} onChange={() => update({ sale: sale ? null : "1" })} className="size-4 accent-[rgb(var(--l-accent))]" /> On sale</label>
    </Group>
    <button onClick={() => router.push(pathname, { scroll: false })} className={btnOutline}>{t("clearAll")}</button>
  </div>;

  return <>
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <Crumbs items={[[t("home"), "/ecommerce"], [t("shop"), "/ecommerce/shop"], ...(category !== "all" ? [[t(category as TKey)] as [string]] : [])]} />
      <motion.h1 key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-3 font-serif text-5xl font-bold tracking-tight md:text-6xl">{title}</motion.h1>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-y border-l-fg/10 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 rounded-full border border-l-fg/15 px-4 py-2 text-sm font-semibold lg:hidden"><SlidersHorizontal size={15} /> {t("filters")}{chips.length > 0 && <span className="grid size-5 place-items-center rounded-full bg-l-accent text-[10px] text-white">{chips.length}</span>}</button>
          <p className="text-sm text-l-fg/55">{list.length} products</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="sort">{t("sortBy")}</label>
          <select id="sort" value={sort} onChange={(e) => update({ sort: e.target.value === "featured" ? null : e.target.value })} className="rounded-full border border-l-fg/15 bg-l-surface px-4 py-2 text-sm font-semibold outline-none">
            {Object.entries(sorts).map(([key, v]) => <option key={key} value={key}>{v}</option>)}
          </select>
          <div className="flex rounded-full border border-l-fg/15 bg-l-surface p-1">
            {(["grid", "list"] as const).map((v) => <button key={v} aria-label={`${v} view`} onClick={() => setView(v)} className={`relative grid size-8 place-items-center rounded-full ${view === v ? "text-l-bg" : "text-l-fg/50"}`}>
              {view === v && <motion.span layoutId="view-pill" className="absolute inset-0 rounded-full bg-l-fg" />}
              <span className="relative">{v === "grid" ? <LayoutGrid size={15} /> : <Rows3 size={15} />}</span>
            </button>)}
          </div>
        </div>
      </div>
      <AnimatePresence>{chips.length > 0 && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <AnimatePresence>{chips.map(([label, remove]) => <motion.button layout key={label} initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .8, opacity: 0 }} onClick={remove} className="flex items-center gap-1.5 rounded-full bg-l-fg/5 px-3 py-1.5 text-xs font-semibold capitalize transition hover:bg-l-accent hover:text-white">{label}<X size={12} /></motion.button>)}</AnimatePresence>
          <button onClick={() => router.push(pathname, { scroll: false })} className="text-xs font-semibold text-l-accent hover:underline">{t("clearAll")}</button>
        </div>
      </motion.div>}</AnimatePresence>
      <div className="mt-8 grid gap-10 lg:grid-cols-[230px_1fr]">
        <aside className="hidden lg:block">{filters}</aside>
        <div>
          {list.length === 0 ? <div className="grid place-items-center rounded-3xl bg-l-surface py-24 text-center"><p className="font-semibold">No products match these filters.</p><p className="mt-1 text-sm text-l-fg/55">Try removing a filter or searching for something else.</p><button onClick={() => router.push(pathname)} className={`${btnPrimary} mt-5`}>{t("clearAll")}</button></div>
            : view === "grid" ? <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
              {list.slice(0, visible).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              {loading && Array.from({ length: 3 }, (_, i) => <CardSkeleton key={`s${i}`} />)}
            </div>
              : <div className="grid gap-4">{list.slice(0, visible).map((p, i) => <ListRow key={p.id} index={i} p={p} />)}</div>}
          {visible < list.length && <div className="mt-12 grid place-items-center gap-3">
            <p className="text-xs text-l-fg/50">Showing {Math.min(visible, list.length)} of {list.length}</p>
            <div className="h-1 w-48 overflow-hidden rounded-full bg-l-fg/10"><motion.div className="h-full bg-l-fg" animate={{ width: `${(Math.min(visible, list.length) / list.length) * 100}%` }} /></div>
            <button onClick={loadMore} disabled={loading} className={btnOutline}>{loading ? "Loading…" : t("loadMore")}</button>
          </div>}
        </div>
      </div>
    </div>
    <RecentlyViewed />
    <AnimatePresence>
      {filtersOpen && <>
        <motion.div className="fixed inset-0 z-50 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFiltersOpen(false)} />
        <motion.aside className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm overflow-y-auto bg-l-surface p-6" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>
          <div className="mb-6 flex items-center justify-between"><h2 className="text-lg font-bold">{t("filters")}</h2><button aria-label="Close filters" onClick={() => setFiltersOpen(false)}><X /></button></div>
          {filters}
          <button onClick={() => setFiltersOpen(false)} className={`${btnPrimary} mt-4 w-full`}>Show {list.length} products</button>
        </motion.aside>
      </>}
    </AnimatePresence>
  </>;
}

function ListRow({ p, index }: { p: Product; index: number }) {
  const { addToCart, t } = useStore();
  return <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (index % PAGE) * .04 }} className="group flex gap-5 rounded-3xl bg-l-surface p-4">
    <Link href={`/ecommerce/product/${p.slug}`} className="w-32 shrink-0 overflow-hidden rounded-2xl sm:w-44"><img src={p.images[0]} alt={p.name} className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-105" /></Link>
    <div className="flex flex-1 flex-col py-2">
      <p className="text-xs font-bold uppercase tracking-widest text-l-fg/40">{p.type}</p>
      <Link href={`/ecommerce/product/${p.slug}`} className="mt-1 text-xl font-semibold hover:underline">{p.name}</Link>
      <div className="mt-1 flex items-center gap-2 text-xs text-l-fg/50"><Stars rating={p.rating} />({p.reviews})</div>
      <p className="mt-3 line-clamp-2 max-w-xl text-sm text-l-fg/60">{p.description}</p>
      <div className="mt-auto flex items-center justify-between pt-4"><b>{formatPrice(p.price)} {p.compareAt && <s className="ml-1 text-sm font-normal text-l-fg/40">{formatPrice(p.compareAt)}</s>}</b>
        <button onClick={() => addToCart(p)} disabled={p.stock === 0} className="rounded-full bg-l-fg px-5 py-2.5 text-xs font-semibold text-l-bg transition hover:bg-l-accent hover:text-white disabled:opacity-50">{t("addToBag")}</button></div>
    </div>
  </motion.div>;
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><h3 className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-l-fg/45">{title}</h3>{children}</div>;
}
