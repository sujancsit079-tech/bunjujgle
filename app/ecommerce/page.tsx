"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Leaf, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { banners, categories, products, testimonials } from "@/data/ecommerce";
import { ProductCard, Reveal, Stars } from "@/components/ecommerce/product-card";

export default function StoreHome() {
  return <>
    <Hero />
    <Perks />
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <SectionHead eyebrow="Browse" title="Shop by category" href="/ecommerce/shop" />
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categories.map((c, i) => <Reveal key={c.slug} delay={i * .08}>
          <Link href={`/ecommerce/shop?category=${c.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-3xl">
            <img src={c.image} alt={c.name} className="absolute inset-0 size-full object-cover transition duration-[900ms] ease-out group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
              <div><h3 className="font-serif text-3xl font-bold">{c.name}</h3><p className="text-xs text-white/75">{c.blurb}</p></div>
              <span className="grid size-10 place-items-center rounded-full bg-white text-black transition duration-300 group-hover:rotate-45"><ArrowUpRight size={18} /></span>
            </div>
          </Link>
        </Reveal>)}
      </div>
    </section>
    <ProductTabs />
    <Promo />
    <NewArrivals />
    <Testimonials />
    <Newsletter />
  </>;
}

function SectionHead({ eyebrow, title, href }: { eyebrow: string; title: string; href?: string }) {
  return <Reveal className="flex items-end justify-between gap-6">
    <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#c8553d]">{eyebrow}</p><h2 className="mt-2 font-serif text-4xl font-bold tracking-tight md:text-5xl">{title}</h2></div>
    {href && <Link href={href} className="link-line hidden items-center gap-2 text-sm font-semibold sm:flex">View all <ArrowRight size={16} /></Link>}
  </Reveal>;
}

function Hero() {
  const [i, setI] = useState(0);
  const slide = banners.hero[i];
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % banners.hero.length), 6000); return () => clearInterval(t); }, []);
  const go = (d: number) => setI((x) => (x + d + banners.hero.length) % banners.hero.length);
  return <section className="px-4 pt-4 lg:px-8">
    <div className="relative mx-auto h-[78vh] min-h-[520px] max-w-7xl overflow-hidden rounded-[2rem] bg-[#222]">
      <AnimatePresence mode="sync">
        <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2, ease: [.2, .7, .2, 1] }}>
          <motion.img style={{ y }} src={slide.image} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
        </motion.div>
      </AnimatePresence>
      <div className="relative z-10 flex h-full flex-col justify-end p-7 text-white md:p-14">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial="hidden" animate="show" exit="exit" variants={{ show: { transition: { staggerChildren: .12 } } }}>
            <motion.p variants={fade} className="text-xs font-bold uppercase tracking-[.25em] text-white/75">New season · 2026</motion.p>
            <motion.h1 variants={fade} className="mt-4 max-w-2xl font-serif text-5xl font-bold leading-[.95] tracking-tight md:text-7xl lg:text-8xl">{slide.title}</motion.h1>
            <motion.p variants={fade} className="mt-5 max-w-md text-base text-white/80 md:text-lg">{slide.subtitle}</motion.p>
            <motion.div variants={fade} className="mt-8 flex flex-wrap gap-3">
              <Link href={slide.href} className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-[#c8553d] hover:text-white">{slide.cta}<ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link>
              <Link href="/ecommerce/shop" className="inline-flex items-center rounded-full border border-white/60 px-7 py-3.5 text-sm font-semibold transition hover:bg-white/10">Explore all</Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-10 flex items-center justify-between">
          <div className="flex gap-2">{banners.hero.map((_, n) => <button key={n} aria-label={`Slide ${n + 1}`} onClick={() => setI(n)} className="relative h-1 w-12 overflow-hidden rounded-full bg-white/30">{n === i && <motion.span className="absolute inset-y-0 left-0 bg-white" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 6, ease: "linear" }} />}</button>)}</div>
          <div className="flex gap-2">
            <button aria-label="Previous slide" onClick={() => go(-1)} className="grid size-11 place-items-center rounded-full border border-white/40 transition hover:bg-white hover:text-black"><ChevronLeft size={18} /></button>
            <button aria-label="Next slide" onClick={() => go(1)} className="grid size-11 place-items-center rounded-full border border-white/40 transition hover:bg-white hover:text-black"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  </section>;
}

const fade = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: .7, ease: [.2, .7, .2, 1] as const } }, exit: { opacity: 0, y: -20, transition: { duration: .3 } } };

function Perks() {
  const items = [[Truck, "Free shipping", "On orders over $120"], [RotateCcw, "30-day returns", "No questions asked"], [ShieldCheck, "Secure checkout", "Encrypted payments"], [Leaf, "Responsibly made", "Organic & recycled"]] as const;
  return <section className="mx-auto mt-6 grid max-w-7xl grid-cols-2 gap-4 px-4 lg:grid-cols-4 lg:px-8">
    {items.map(([Icon, t, s], i) => <Reveal key={t} delay={i * .06} y={16} className="flex items-center gap-3 rounded-2xl bg-white p-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f7f4ef]"><Icon size={19} /></span>
      <div><p className="text-sm font-semibold">{t}</p><p className="text-xs text-black/55">{s}</p></div>
    </Reveal>)}
  </section>;
}

function ProductTabs() {
  const tabs = ["Bestseller", "New", "Sale"] as const;
  const [tab, setTab] = useState<(typeof tabs)[number]>("Bestseller");
  const list = products.filter((p) => p.badge === tab).concat(products.filter((p) => p.badge !== tab)).slice(0, 8);
  return <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
    <SectionHead eyebrow="Curated" title="Trending now" href="/ecommerce/shop" />
    <div className="mt-8 flex gap-2">
      {tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={`relative rounded-full px-5 py-2 text-sm font-semibold transition ${tab === t ? "text-white" : "text-black/60 hover:text-black"}`}>
        {tab === t && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-[#111]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
        <span className="relative">{t === "Bestseller" ? "Best sellers" : t === "New" ? "New in" : "On sale"}</span>
      </button>)}
    </div>
    <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
    </motion.div>
  </section>;
}

function Promo() {
  return <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
    <Reveal className="relative overflow-hidden rounded-[2rem] bg-[#c8553d] text-white">
      <div className="grid items-center md:grid-cols-2">
        <div className="p-10 md:p-16">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-white/75">Limited time</p>
          <h2 className="mt-4 font-serif text-5xl font-bold leading-none md:text-6xl">Up to 30% off<br />outerwear</h2>
          <p className="mt-5 max-w-sm text-white/80">Leather jackets, wool coats and more — while stock lasts.</p>
          <Link href="/ecommerce/shop?sale=1" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-black hover:text-white">Shop the sale <ArrowRight size={16} /></Link>
        </div>
        <div className="relative h-72 md:h-full md:min-h-[440px]"><motion.img initial={{ scale: 1.15 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} src={banners.promo} alt="" className="absolute inset-0 size-full object-cover" /></div>
      </div>
    </Reveal>
  </section>;
}

function NewArrivals() {
  const list = [...products].reverse();
  return <section className="py-10">
    <div className="mx-auto max-w-7xl px-4 lg:px-8"><SectionHead eyebrow="Just landed" title="New arrivals" href="/ecommerce/shop" /></div>
    <div className="horizontal-cards mt-6" style={{ gridAutoColumns: "minmax(240px, 23%)" }}>
      {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
    </div>
  </section>;
}

function Testimonials() {
  return <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
    <SectionHead eyebrow="Reviews" title="Loved by customers" />
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      {testimonials.map((t, i) => <Reveal key={t.name} delay={i * .1} className="rounded-3xl bg-white p-8">
        <Stars rating={t.rating} size={15} /><p className="mt-5 text-lg leading-7">“{t.text}”</p><p className="mt-6 text-sm font-semibold text-black/60">— {t.name}</p>
      </Reveal>)}
    </div>
  </section>;
}

function Newsletter() {
  const [done, setDone] = useState(false);
  return <section className="mx-auto max-w-7xl px-4 pt-16 lg:px-8">
    <Reveal className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-white md:grid-cols-2">
      <img src={banners.story} alt="" className="h-64 w-full object-cover md:h-full" />
      <div className="p-8 md:p-12">
        <h2 className="font-serif text-4xl font-bold">Join the list</h2>
        <p className="mt-3 text-black/60">Get 10% off your first order, early access to drops and styling notes.</p>
        <AnimatePresence mode="wait">
          {done ? <motion.p key="ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl bg-[#f7f4ef] p-4 text-sm font-semibold">Thanks! Check your inbox for your code.</motion.p>
            : <motion.form key="f" exit={{ opacity: 0 }} onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="mt-6 flex gap-2">
              <input required type="email" placeholder="you@email.com" className="min-w-0 flex-1 rounded-full border border-black/15 bg-[#f7f4ef] px-5 py-3 text-sm outline-none focus:border-black" />
              <button className="rounded-full bg-[#111] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c8553d]">Subscribe</button>
            </motion.form>}
        </AnimatePresence>
      </div>
    </Reveal>
  </section>;
}
