"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Heart, Ruler, RotateCcw, Share2, ShoppingBag, Star, Truck, X } from "lucide-react";
import { faqs, formatPrice, ratingBreakdown, reviewPool, sizeGuide, type TKey } from "@/data/ecommerce";
import { Crumbs, ProductCard, Reveal, Stars, btnPrimary, input } from "@/components/ecommerce/ui";
import { RecentlyViewed } from "@/components/ecommerce/sections";
import { Qty } from "@/components/ecommerce/shell";
import { useStore } from "@/components/ecommerce/store";

export function ProductDetail({ slug }: { slug: string }) {
  const { getProduct, products, addToCart, toggleWishlist, inWishlist, setCartOpen, pushRecent, ready, t, toast } = useStore();
  const p = getProduct(slug);
  const [active, setActive] = useState(0);
  const [ci, setCi] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"description" | "details" | "reviews">("description");
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [fly, setFly] = useState<{ x: number; y: number } | null>(null);
  const [guide, setGuide] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { if (p) { pushRecent(p.id); setSize(p.sizes.length === 1 ? p.sizes[0] : null); } }, [p?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const el = btnRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el); return () => io.disconnect();
  }, [p?.id]);

  if (!p) return <div className="mx-auto max-w-xl px-4 py-32 text-center">{ready ? <><h1 className="font-serif text-4xl font-bold">Product not found</h1><p className="mt-3 text-l-fg/60">It may have been removed from the catalogue.</p><Link href="/ecommerce/shop" className={`${btnPrimary} mt-6`}>Back to shop</Link></> : <div className="shimmer mx-auto h-96 w-full rounded-3xl" />}</div>;

  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const color = p.colors[ci];
  const pickColor = (i: number) => { setCi(i); setActive(i % p.images.length); };

  const add = (buyNow = false) => {
    if (!size) { setSizeError(true); btnRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(() => setSizeError(false), 700); return; }
    if (buyNow) { addToCart(p, { color: color.name, size, qty, silent: true }); window.location.href = "/ecommerce/checkout"; return; }
    const r = btnRef.current?.getBoundingClientRect();
    if (r) setFly({ x: r.left + r.width / 2, y: r.top });
    addToCart(p, { color: color.name, size, qty });
    setAdded(true);
    setTimeout(() => { setAdded(false); setFly(null); setCartOpen(true); }, 900);
  };
  const share = async () => { try { await navigator.clipboard.writeText(window.location.href); toast("Link copied to clipboard"); } catch { toast("Copy the link from your address bar"); } };

  return <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
    <Crumbs items={[[t("home"), "/ecommerce"], [t(p.category as TKey), `/ecommerce/shop?category=${p.category}`], [p.type, `/ecommerce/shop?category=${p.category}&type=${encodeURIComponent(p.type)}`], [p.name]]} />
    <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
      <div className="flex flex-col-reverse gap-4 md:flex-row">
        <div className="flex gap-3 md:flex-col">
          {p.images.map((src, i) => <button key={src + i} onClick={() => setActive(i)} aria-label={`View image ${i + 1}`} className={`relative w-20 overflow-hidden rounded-xl border-2 transition ${active === i ? "border-l-fg" : "border-transparent opacity-60 hover:opacity-100"}`}>
            <img src={src} alt="" className="aspect-[3/4] w-full object-cover" />
          </button>)}
        </div>
        <div className="relative flex-1 cursor-zoom-in overflow-hidden rounded-3xl bg-l-muted"
          onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
          onMouseLeave={() => setZoom(null)}>
          <AnimatePresence mode="wait">
            <motion.img key={active} src={p.images[active].replace("w=900", "w=1400")} alt={`${p.name} — ${color.name}`} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: zoom ? 1.8 : 1 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: .4 }, scale: { duration: .35 } }}
              style={{ transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "center" }} className="aspect-[4/5] w-full object-cover" />
          </AnimatePresence>
          {(p.badge || p.compareAt) && <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${p.compareAt ? "bg-l-accent text-white" : "bg-white text-black"}`}>{p.compareAt ? "Sale" : p.badge}</span>}
          <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">{active + 1} / {p.images.length}</div>
        </div>
      </div>

      <motion.div initial="h" animate="s" variants={{ s: { transition: { staggerChildren: .07 } } }} className="lg:sticky lg:top-28 lg:self-start">
        <motion.div variants={item} className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[.2em] text-l-accent">{p.type}</p>
          <button onClick={share} aria-label="Share" className="grid size-9 place-items-center rounded-full hover:bg-l-fg/5"><Share2 size={16} /></button></motion.div>
        <motion.h1 variants={item} className="mt-2 font-serif text-4xl font-bold tracking-tight md:text-5xl">{p.name}</motion.h1>
        <motion.button variants={item} onClick={() => { setTab("reviews"); document.getElementById("pd-tabs")?.scrollIntoView({ behavior: "smooth" }); }} className="mt-3 flex items-center gap-2 text-sm text-l-fg/55 hover:text-l-fg"><Stars rating={p.rating} size={15} />{p.rating} · {p.reviews} reviews</motion.button>
        <motion.div variants={item} className="mt-5 flex items-baseline gap-3"><span className="text-3xl font-bold">{formatPrice(p.price)}</span>{p.compareAt && <><s className="text-lg text-l-fg/40">{formatPrice(p.compareAt)}</s><span className="rounded-full bg-l-accent/10 px-2.5 py-0.5 text-xs font-bold text-l-accent">Save {formatPrice(p.compareAt - p.price)}</span></>}</motion.div>
        <motion.p variants={item} className="mt-5 leading-7 text-l-fg/65">{p.description}</motion.p>

        <motion.div variants={item} className="mt-7">
          <p className="text-sm font-semibold">Color: <span className="font-normal text-l-fg/60">{color.name}</span></p>
          <div className="mt-3 flex gap-2">{p.colors.map((c, i) => <button key={c.name} aria-label={c.name} title={c.name} onClick={() => pickColor(i)} className={`grid size-10 place-items-center rounded-full border-2 transition ${ci === i ? "border-l-fg" : "border-transparent"}`}><span className="size-7 rounded-full border border-l-fg/10" style={{ background: c.hex }} /></button>)}</div>
        </motion.div>
        <motion.div variants={item} className="mt-6">
          <div className="flex justify-between text-sm"><p className="font-semibold">Size {size && <span className="font-normal text-l-fg/60">{size}</span>}</p>
            {p.sizes.length > 1 && <button onClick={() => setGuide(true)} className="flex items-center gap-1 text-l-fg/55 underline-offset-4 hover:text-l-fg hover:underline"><Ruler size={14} />{t("sizeGuide")}</button>}</div>
          <motion.div animate={sizeError ? { x: [0, -8, 8, -6, 6, 0] } : {}} transition={{ duration: .45 }} className="mt-3 flex flex-wrap gap-2">
            {p.sizes.map((s) => <button key={s} onClick={() => setSize(s)} className={`h-11 min-w-12 rounded-xl border px-3 text-sm font-semibold transition ${size === s ? "border-l-fg bg-l-fg text-l-bg" : sizeError ? "border-l-accent" : "border-l-fg/15 bg-l-surface hover:border-l-fg"}`}>{s}</button>)}
          </motion.div>
          <AnimatePresence>{sizeError && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-xs font-semibold text-l-accent">Please select a size</motion.p>}</AnimatePresence>
        </motion.div>

        <motion.div variants={item} className="mt-7 flex gap-3">
          <div className="flex items-center rounded-full bg-l-surface"><Qty value={qty} max={Math.max(1, p.stock)} onChange={setQty} /></div>
          <motion.button ref={btnRef} whileTap={{ scale: .97 }} disabled={p.stock === 0} onClick={() => add()} className={`relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full py-3.5 text-sm font-semibold transition-colors disabled:opacity-50 ${added ? "bg-l-success text-white" : "bg-l-fg text-l-bg hover:bg-l-accent hover:text-white"}`}>
            <AnimatePresence mode="wait">
              {added ? <motion.span key="a" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="flex items-center gap-2"><Check size={17} /> {t("added")}</motion.span>
                : <motion.span key="b" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="flex items-center gap-2"><ShoppingBag size={17} /> {p.stock === 0 ? "Sold out" : `${t("addToBag")} — ${formatPrice(p.price * qty)}`}</motion.span>}
            </AnimatePresence>
          </motion.button>
          <motion.button whileTap={{ scale: .85 }} aria-label="Toggle wishlist" onClick={() => toggleWishlist(p.id)} className="grid size-[52px] place-items-center rounded-full border border-l-fg/15 bg-l-surface"><Heart size={19} className={inWishlist(p.id) ? "fill-l-accent text-l-accent" : ""} /></motion.button>
        </motion.div>
        <motion.button variants={item} disabled={p.stock === 0} onClick={() => add(true)} className="mt-3 w-full rounded-full border border-l-fg py-3 text-sm font-semibold transition hover:bg-l-fg hover:text-l-bg disabled:opacity-50">{t("buyNow")}</motion.button>
        <motion.p variants={item} className={`mt-3 text-xs font-semibold ${p.stock === 0 ? "text-l-accent" : p.stock < 20 ? "text-l-accent" : "text-l-success"}`}>{p.stock === 0 ? "Out of stock" : p.stock < 20 ? `Only ${p.stock} left in stock` : "In stock — ships in 1-2 days"}</motion.p>
        <motion.div variants={item} className="mt-6 grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 rounded-2xl bg-l-surface p-3"><Truck size={16} /> Free shipping over $120</div>
          <div className="flex items-center gap-2 rounded-2xl bg-l-surface p-3"><RotateCcw size={16} /> 30-day free returns</div>
        </motion.div>
      </motion.div>
    </div>

    <section id="pd-tabs" className="mt-20 scroll-mt-28">
      <div className="flex gap-6 border-b border-l-fg/10">
        {(["description", "details", "reviews"] as const).map((x) => <button key={x} onClick={() => setTab(x)} className={`relative pb-3 text-sm font-semibold capitalize ${tab === x ? "text-l-fg" : "text-l-fg/45"}`}>
          {x}{x === "reviews" && ` (${p.reviews})`}{tab === x && <motion.span layoutId="pd-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-l-fg" />}
        </button>)}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .25 }} className="py-8 text-l-fg/70">
          {tab === "description" && <p className="max-w-3xl leading-8">{p.description} Every piece is cut and sewn in small batches by partner workshops we visit regularly, so you know exactly where your clothes come from.</p>}
          {tab === "details" && <ul className="grid max-w-3xl gap-3">{p.details.map((d) => <li key={d} className="flex items-center gap-3"><Check size={16} className="text-l-success" />{d}</li>)}</ul>}
          {tab === "reviews" && <Reviews productId={p.id} rating={p.rating} count={p.reviews} />}
        </motion.div>
      </AnimatePresence>
    </section>

    <FAQ />

    {related.length > 0 && <section className="mt-16">
      <Reveal><h2 className="font-serif text-4xl font-bold">{t("youMayLike")}</h2></Reveal>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">{related.map((r, i) => <ProductCard key={r.id} product={r} index={i} />)}</div>
    </section>}
    <div className="-mx-4 lg:-mx-8"><RecentlyViewed exclude={p.id} /></div>

    <SizeGuide open={guide} onClose={() => setGuide(false)} shoes={p.category === "shoes"} />

    <AnimatePresence>{showBar && <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: "spring", damping: 28, stiffness: 300 }} className="fixed inset-x-0 bottom-0 z-40 border-t border-l-fg/10 bg-l-surface/95 p-3 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-1 lg:px-6">
        <img src={p.images[0]} alt="" className="size-12 rounded-xl object-cover" />
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{p.name}</p><p className="text-xs text-l-fg/55">{formatPrice(p.price)} · {color.name}{size ? ` · ${size}` : ""}</p></div>
        <button onClick={() => add()} disabled={p.stock === 0} className="rounded-full bg-l-fg px-5 py-3 text-xs font-semibold text-l-bg transition hover:bg-l-accent hover:text-white disabled:opacity-50">{size ? t("addToBag") : "Select size"}</button>
      </div>
    </motion.div>}</AnimatePresence>

    <AnimatePresence>
      {fly && <motion.img key="fly" src={p.images[0]} alt="" className="pointer-events-none fixed z-[70] size-16 rounded-full object-cover shadow-xl"
        initial={{ left: fly.x - 32, top: fly.y - 32, opacity: 1, scale: 1 }}
        animate={{ left: typeof window !== "undefined" ? window.innerWidth - 70 : 0, top: 50, opacity: .4, scale: .3 }}
        exit={{ opacity: 0 }} transition={{ duration: .8, ease: [.6, -.1, .4, 1] }} />}
    </AnimatePresence>
  </div>;
}

const item = { h: { opacity: 0, y: 18 }, s: { opacity: 1, y: 0, transition: { duration: .5 } } };

function Reviews({ productId, rating, count }: { productId: number; rating: number; count: number }) {
  const { reviews, addReview, user, t } = useStore();
  const mine = reviews.filter((r) => r.productId === productId);
  const pool = reviewPool.map((r, i) => ({ ...r, title: "", date: `2026-0${9 - (i % 3)}-1${i}`, productId }));
  const all = [...mine, ...pool];
  const bars = ratingBreakdown(rating);
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(5);
  const [hover, setHover] = useState(0);
  const [form, setForm] = useState({ name: "", title: "", text: "" });
  const [filter, setFilter] = useState<number | null>(null);
  const shown = filter ? all.filter((r) => r.rating === filter) : all;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addReview({ productId, rating: stars, name: user?.name ?? form.name, title: form.title, text: form.text, date: new Date().toISOString() });
    setForm({ name: "", title: "", text: "" }); setStars(5); setOpen(false);
  };

  return <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
    <div>
      <div className="flex items-end gap-3"><span className="font-serif text-6xl font-bold text-l-fg">{rating.toFixed(1)}</span><div className="pb-2"><Stars rating={rating} size={16} /><p className="mt-1 text-xs">{count + mine.length} reviews</p></div></div>
      <div className="mt-6 grid gap-2">{bars.map((pct, i) => { const s = 5 - i; return <button key={s} onClick={() => setFilter(filter === s ? null : s)} className={`flex items-center gap-3 text-xs ${filter === s ? "font-bold text-l-fg" : ""}`}>
        <span className="flex w-8 items-center gap-0.5">{s}<Star size={11} className="fill-[#e8a126] text-[#e8a126]" /></span>
        <span className="h-2 flex-1 overflow-hidden rounded-full bg-l-fg/10"><motion.span className="block h-full rounded-full bg-[#e8a126]" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: .8, delay: i * .08 }} /></span>
        <span className="w-9 text-right">{pct}%</span>
      </button>; })}</div>
      <button onClick={() => setOpen(!open)} className={`${btnPrimary} mt-6 w-full`}>{t("writeReview")}</button>
    </div>
    <div>
      <AnimatePresence>{open && <motion.form onSubmit={submit} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-8 overflow-hidden">
        <div className="grid gap-3 rounded-3xl bg-l-surface p-6 text-l-fg">
          <p className="font-semibold">Your rating</p>
          <div className="flex gap-1" onMouseLeave={() => setHover(0)}>{[1, 2, 3, 4, 5].map((s) => <button type="button" key={s} aria-label={`${s} stars`} onMouseEnter={() => setHover(s)} onClick={() => setStars(s)}><motion.span whileHover={{ scale: 1.2 }} className="block"><Star size={26} className={(hover || stars) >= s ? "fill-[#e8a126] text-[#e8a126]" : "text-l-fg/25"} /></motion.span></button>)}</div>
          {!user && <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />}
          <input required placeholder="Review title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} />
          <textarea required minLength={10} rows={4} placeholder="What did you like or dislike?" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className={input} />
          <div className="flex justify-end gap-2"><button type="button" onClick={() => setOpen(false)} className="px-4 text-sm font-semibold text-l-fg/60">Cancel</button><button className={btnPrimary}>Submit review</button></div>
        </div>
      </motion.form>}</AnimatePresence>
      {filter && <button onClick={() => setFilter(null)} className="mb-4 flex items-center gap-1 rounded-full bg-l-fg/5 px-3 py-1.5 text-xs font-semibold text-l-fg">{filter}-star reviews <X size={12} /></button>}
      <div className="grid gap-6">
        <AnimatePresence initial={false}>{shown.map((r, i) => <motion.div key={r.name + r.date + i} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border-b border-l-fg/10 pb-6">
          <div className="flex items-center justify-between"><Stars rating={r.rating} /><span className="text-xs">{new Date(r.date).toLocaleDateString()}</span></div>
          {r.title && <p className="mt-2 font-semibold text-l-fg">{r.title}</p>}
          <p className="mt-1 text-l-fg/80">{r.text}</p>
          <p className="mt-2 flex items-center gap-1 text-xs font-semibold"><Check size={12} className="text-l-success" />{r.name} · Verified buyer</p>
        </motion.div>)}</AnimatePresence>
        {shown.length === 0 && <p className="text-sm">No {filter}-star reviews yet.</p>}
      </div>
    </div>
  </div>;
}

function SizeGuide({ open, onClose, shoes }: { open: boolean; onClose: () => void; shoes: boolean }) {
  const g = shoes ? sizeGuide.shoes : sizeGuide.apparel;
  return <AnimatePresence>{open && <motion.div className="fixed inset-0 z-[55] grid place-items-center bg-black/45 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.div role="dialog" aria-label="Size guide" onClick={(e) => e.stopPropagation()} initial={{ y: 30, scale: .96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} className="w-full max-w-lg rounded-3xl bg-l-surface p-6">
      <div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-xl font-bold"><Ruler size={20} /> Size guide</h2><button aria-label="Close" onClick={onClose}><X /></button></div>
      <p className="mt-2 text-sm text-l-fg/60">{shoes ? "Measure your foot from heel to longest toe." : "Measurements are body measurements, not garment measurements."}</p>
      <div className="mt-5 overflow-hidden rounded-2xl border border-l-fg/10"><table className="w-full text-sm">
        <thead className="bg-l-fg/5 text-left text-xs uppercase tracking-wider text-l-fg/50"><tr>{g.head.map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
        <tbody>{g.rows.map((r, i) => <motion.tr key={r[0]} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .04 }} className="border-t border-l-fg/10">{r.map((c, j) => <td key={j} className={`px-4 py-2.5 ${j === 0 ? "font-bold" : ""}`}>{c}</td>)}</motion.tr>)}</tbody>
      </table></div>
      <p className="mt-4 text-xs text-l-fg/50">Between sizes? Size up for a relaxed fit, or contact us for personal advice.</p>
    </motion.div>
  </motion.div>}</AnimatePresence>;
}

function FAQ() {
  const qs = [...faqs[2].items, faqs[1].items[0], faqs[0].items[0]];
  const [open, setOpen] = useState<number | null>(0);
  return <section className="max-w-3xl">
    {qs.map(([q, a], i) => <div key={q} className="border-b border-l-fg/10">
      <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between py-5 text-left font-semibold">{q}<motion.span animate={{ rotate: open === i ? 180 : 0 }}><ChevronDown size={18} /></motion.span></button>
      <AnimatePresence initial={false}>{open === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="pb-5 text-sm leading-7 text-l-fg/60">{a}</p></motion.div>}</AnimatePresence>
    </div>)}
  </section>;
}
