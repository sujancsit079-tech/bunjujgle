"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Heart, RotateCcw, ShoppingBag, Truck } from "lucide-react";
import { formatPrice, getProduct, products, testimonials } from "@/data/ecommerce";
import { ProductCard, Reveal, Stars } from "@/components/ecommerce/product-card";
import { Qty } from "@/components/ecommerce/shell";
import { useStore } from "@/components/ecommerce/store";

export function ProductDetail({ slug }: { slug: string }) {
  const p = getProduct(slug)!;
  const { addToCart, toggleWishlist, inWishlist, setCartOpen } = useStore();
  const [active, setActive] = useState(0);
  const [color, setColor] = useState(p.colors[0].name);
  const [size, setSize] = useState<string | null>(p.sizes.length === 1 ? p.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"description" | "details" | "reviews">("description");
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [fly, setFly] = useState<{ x: number; y: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

  const add = () => {
    if (!size) { setSizeError(true); setTimeout(() => setSizeError(false), 600); return; }
    const r = btnRef.current?.getBoundingClientRect();
    if (r) setFly({ x: r.left + r.width / 2, y: r.top });
    addToCart(p, { color, size, qty });
    setAdded(true);
    setTimeout(() => { setAdded(false); setFly(null); setCartOpen(true); }, 900);
  };

  return <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
    <nav className="text-xs text-black/50"><Link href="/ecommerce" className="hover:text-black">Home</Link> / <Link href={`/ecommerce/shop?category=${p.category}`} className="capitalize hover:text-black">{p.category}</Link> / <span className="text-black">{p.name}</span></nav>
    <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
      <div className="flex flex-col-reverse gap-4 md:flex-row">
        <div className="flex gap-3 md:flex-col">
          {p.images.map((src, i) => <button key={src + i} onClick={() => setActive(i)} aria-label={`View image ${i + 1}`} className={`relative w-20 overflow-hidden rounded-xl border-2 transition ${active === i ? "border-black" : "border-transparent opacity-60 hover:opacity-100"}`}>
            <img src={src} alt="" className="aspect-[3/4] w-full object-cover" />
          </button>)}
        </div>
        <div className="relative flex-1 cursor-zoom-in overflow-hidden rounded-3xl bg-[#efebe4]"
          onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
          onMouseLeave={() => setZoom(null)}>
          <AnimatePresence mode="wait">
            <motion.img key={active} src={p.images[active].replace("w=900", "w=1400")} alt={p.name} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: zoom ? 1.8 : 1 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: .4 }, scale: { duration: .35 } }}
              style={{ transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "center" }} className="aspect-[4/5] w-full object-cover" />
          </AnimatePresence>
          {p.badge && <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${p.badge === "Sale" ? "bg-[#c8553d] text-white" : "bg-white"}`}>{p.badge}</span>}
        </div>
      </div>

      <motion.div initial="h" animate="s" variants={{ s: { transition: { staggerChildren: .07 } } }} className="lg:sticky lg:top-28 lg:self-start">
        <motion.p variants={item} className="text-xs font-bold uppercase tracking-[.2em] text-[#c8553d]">{p.category}</motion.p>
        <motion.h1 variants={item} className="mt-2 font-serif text-4xl font-bold tracking-tight md:text-5xl">{p.name}</motion.h1>
        <motion.div variants={item} className="mt-3 flex items-center gap-2 text-sm text-black/55"><Stars rating={p.rating} size={15} />{p.rating} · {p.reviews} reviews</motion.div>
        <motion.div variants={item} className="mt-5 flex items-baseline gap-3"><span className="text-3xl font-bold">{formatPrice(p.price)}</span>{p.compareAt && <><s className="text-lg text-black/40">{formatPrice(p.compareAt)}</s><span className="rounded-full bg-[#c8553d]/10 px-2.5 py-0.5 text-xs font-bold text-[#c8553d]">Save {formatPrice(p.compareAt - p.price)}</span></>}</motion.div>
        <motion.p variants={item} className="mt-5 leading-7 text-black/65">{p.description}</motion.p>

        <motion.div variants={item} className="mt-7">
          <p className="text-sm font-semibold">Color: <span className="font-normal text-black/60">{color}</span></p>
          <div className="mt-3 flex gap-2">{p.colors.map((c) => <button key={c.name} aria-label={c.name} onClick={() => setColor(c.name)} className={`grid size-10 place-items-center rounded-full border-2 transition ${color === c.name ? "border-black" : "border-transparent"}`}><span className="size-7 rounded-full border border-black/10" style={{ background: c.hex }} /></button>)}</div>
        </motion.div>
        <motion.div variants={item} className="mt-6">
          <div className="flex justify-between text-sm"><p className="font-semibold">Size {size && <span className="font-normal text-black/60">{size}</span>}</p><button className="text-black/55 underline">Size guide</button></div>
          <motion.div animate={sizeError ? { x: [0, -8, 8, -6, 6, 0] } : {}} transition={{ duration: .45 }} className="mt-3 flex flex-wrap gap-2">
            {p.sizes.map((s) => <button key={s} onClick={() => setSize(s)} className={`h-11 min-w-12 rounded-xl border px-3 text-sm font-semibold transition ${size === s ? "border-black bg-black text-white" : sizeError ? "border-[#c8553d]" : "border-black/15 bg-white hover:border-black"}`}>{s}</button>)}
          </motion.div>
          <AnimatePresence>{sizeError && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-xs font-semibold text-[#c8553d]">Please select a size</motion.p>}</AnimatePresence>
        </motion.div>

        <motion.div variants={item} className="mt-7 flex gap-3">
          <div className="flex items-center rounded-full bg-white"><Qty value={qty} onChange={(n) => setQty(Math.max(1, n))} /></div>
          <motion.button ref={btnRef} whileTap={{ scale: .97 }} onClick={add} className={`relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full py-3.5 text-sm font-semibold text-white transition-colors ${added ? "bg-[#2f6646]" : "bg-[#111] hover:bg-[#c8553d]"}`}>
            <AnimatePresence mode="wait">
              {added ? <motion.span key="a" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="flex items-center gap-2"><Check size={17} /> Added</motion.span>
                : <motion.span key="b" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="flex items-center gap-2"><ShoppingBag size={17} /> Add to bag — {formatPrice(p.price * qty)}</motion.span>}
            </AnimatePresence>
          </motion.button>
          <motion.button whileTap={{ scale: .85 }} aria-label="Toggle wishlist" onClick={() => toggleWishlist(p.id)} className="grid size-[52px] place-items-center rounded-full border border-black/15 bg-white"><Heart size={19} className={inWishlist(p.id) ? "fill-[#c8553d] text-[#c8553d]" : ""} /></motion.button>
        </motion.div>
        <motion.p variants={item} className={`mt-3 text-xs font-semibold ${p.stock < 20 ? "text-[#c8553d]" : "text-[#2f6646]"}`}>{p.stock < 20 ? `Only ${p.stock} left in stock` : "In stock — ships in 1-2 days"}</motion.p>
        <motion.div variants={item} className="mt-6 grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 rounded-2xl bg-white p-3"><Truck size={16} /> Free shipping over $120</div>
          <div className="flex items-center gap-2 rounded-2xl bg-white p-3"><RotateCcw size={16} /> 30-day free returns</div>
        </motion.div>
      </motion.div>
    </div>

    <section className="mt-20">
      <div className="flex gap-6 border-b border-black/10">
        {(["description", "details", "reviews"] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={`relative pb-3 text-sm font-semibold capitalize ${tab === t ? "text-black" : "text-black/45"}`}>
          {t}{t === "reviews" && ` (${p.reviews})`}{tab === t && <motion.span layoutId="pd-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-black" />}
        </button>)}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .25 }} className="max-w-3xl py-8 text-black/70">
          {tab === "description" && <p className="leading-8">{p.description} Every piece is cut and sewn in small batches by partner workshops we visit regularly, so you know exactly where your clothes come from.</p>}
          {tab === "details" && <ul className="grid gap-3">{p.details.map((d) => <li key={d} className="flex items-center gap-3"><Check size={16} className="text-[#2f6646]" />{d}</li>)}</ul>}
          {tab === "reviews" && <div className="grid gap-6">{testimonials.map((t) => <div key={t.name} className="border-b border-black/10 pb-6"><Stars rating={t.rating} /><p className="mt-2 text-black">{t.text}</p><p className="mt-2 text-xs font-semibold">{t.name} · Verified buyer</p></div>)}</div>}
        </motion.div>
      </AnimatePresence>
    </section>

    <FAQ />

    {related.length > 0 && <section className="mt-16">
      <Reveal><h2 className="font-serif text-4xl font-bold">You may also like</h2></Reveal>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">{related.map((r, i) => <ProductCard key={r.id} product={r} index={i} />)}</div>
    </section>}

    <AnimatePresence>
      {fly && <motion.img key="fly" src={p.images[0]} alt="" className="pointer-events-none fixed z-[70] size-16 rounded-full object-cover shadow-xl"
        initial={{ left: fly.x - 32, top: fly.y - 32, opacity: 1, scale: 1 }}
        animate={{ left: typeof window !== "undefined" ? window.innerWidth - 70 : 0, top: 50, opacity: .4, scale: .3 }}
        exit={{ opacity: 0 }} transition={{ duration: .8, ease: [.6, -.1, .4, 1] }} />}
    </AnimatePresence>
  </div>;
}

const item = { h: { opacity: 0, y: 18 }, s: { opacity: 1, y: 0, transition: { duration: .5 } } };

function FAQ() {
  const qs = [["How do I choose my size?", "Our pieces are true to size. If you are between sizes, size up for a relaxed fit or check the size guide for exact measurements."], ["What is your return policy?", "Return any unworn item within 30 days for a full refund. Returns are free for all domestic orders."], ["How long does shipping take?", "Orders ship within 1–2 business days. Standard delivery takes 3–5 business days."]];
  const [open, setOpen] = useState<number | null>(0);
  return <section className="max-w-3xl">
    {qs.map(([q, a], i) => <div key={q} className="border-b border-black/10">
      <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between py-5 text-left font-semibold">{q}<motion.span animate={{ rotate: open === i ? 180 : 0 }}><ChevronDown size={18} /></motion.span></button>
      <AnimatePresence initial={false}>{open === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="pb-5 text-sm leading-7 text-black/60">{a}</p></motion.div>}</AnimatePresence>
    </div>)}
  </section>;
}
