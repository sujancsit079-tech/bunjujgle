"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Leaf, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { banners, categories, testimonials, type TKey } from "@/data/ecommerce";
import { ProductCard, Reveal, Stars, btnPrimary } from "@/components/ecommerce/ui";
import { useStore } from "@/components/ecommerce/store";
import { RecentlyViewed, SectionHead } from "@/components/ecommerce/sections";

export default function StoreHome() {
  return <>
    <Hero />
    <Perks />
    <Categories />
    <ProductTabs />
    <Promo />
    <NewArrivals />
    <Values />
    <Testimonials />
    <RecentlyViewed />
  </>;
}

function Hero() {
  const { t } = useStore();
  const [i, setI] = useState(0);
  const slide = banners.hero[i];
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  useEffect(() => { const tm = setInterval(() => setI((x) => (x + 1) % banners.hero.length), 6500); return () => clearInterval(tm); }, [i]);
  const go = (d: number) => setI((x) => (x + d + banners.hero.length) % banners.hero.length);
  return <section className="px-4 pt-4 lg:px-8">
    <div className="relative mx-auto h-[78vh] min-h-[520px] max-w-7xl overflow-hidden rounded-[2rem] bg-[#222]">
      <AnimatePresence mode="sync">
        <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2, ease: [.2, .7, .2, 1] }}>
          <motion.img style={{ y }} src={slide.image} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>
      <div className="relative z-10 flex h-full flex-col justify-end p-7 text-white md:p-14">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial="hidden" animate="show" exit="exit" variants={{ show: { transition: { staggerChildren: .12 } } }}>
            <motion.p variants={fade} className="text-xs font-bold uppercase tracking-[.25em] text-white/75">New season · 2026</motion.p>
            <motion.h1 variants={fade} className="mt-4 max-w-2xl font-serif text-5xl font-bold leading-[.95] tracking-tight md:text-7xl lg:text-8xl">{slide.title}</motion.h1>
            <motion.p variants={fade} className="mt-5 max-w-md text-base text-white/85 md:text-lg">{slide.subtitle}</motion.p>
            <motion.div variants={fade} className="mt-8 flex flex-wrap gap-3">
              <Link href={slide.href} className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-l-accent hover:text-white">{slide.cta}<ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link>
              <Link href="/ecommerce/shop?sort=newest" className="inline-flex items-center rounded-full border border-white/60 px-7 py-3.5 text-sm font-semibold transition hover:bg-white/10">{t("newArrivals")}</Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-10 flex items-center justify-between">
          <div className="flex gap-2">{banners.hero.map((_, n) => <button key={n} aria-label={`Slide ${n + 1}`} onClick={() => setI(n)} className="relative h-1 w-12 overflow-hidden rounded-full bg-white/30">{n === i && <motion.span className="absolute inset-y-0 left-0 bg-white" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 6.5, ease: "linear" }} />}</button>)}</div>
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
  const { settings } = useStore();
  const items = [[Truck, "Free shipping", `On orders over $${settings.freeShippingOver}`], [RotateCcw, "30-day returns", "Free & no questions asked"], [ShieldCheck, "Secure checkout", "Encrypted payments"], [Leaf, "Responsibly made", "Organic & recycled fibres"]] as const;
  return <section className="mx-auto mt-6 grid max-w-7xl grid-cols-2 gap-4 px-4 lg:grid-cols-4 lg:px-8">
    {items.map(([Icon, title, s], i) => <Reveal key={title} delay={i * .06} y={16} className="flex items-center gap-3 rounded-2xl bg-l-surface p-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-l-bg"><Icon size={19} /></span>
      <div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-l-fg/55">{s}</p></div>
    </Reveal>)}
  </section>;
}

function Categories() {
  const { products, t } = useStore();
  return <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
    <SectionHead eyebrow="Browse" title="Shop by category" href="/ecommerce/categories" />
    <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {categories.map((c, i) => <Reveal key={c.slug} delay={i * .08}>
        <Link href={`/ecommerce/shop?category=${c.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-3xl">
          <img src={c.image} alt={c.name} className="absolute inset-0 size-full object-cover transition duration-[900ms] ease-out group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-black">{products.filter((p) => p.category === c.slug).length} items</span>
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
            <div><h3 className="font-serif text-3xl font-bold">{t(c.slug as TKey)}</h3><p className="text-xs text-white/75">{c.blurb}</p></div>
            <span className="grid size-10 place-items-center rounded-full bg-white text-black transition duration-300 group-hover:rotate-45"><ArrowUpRight size={18} /></span>
          </div>
        </Link>
      </Reveal>)}
    </div>
  </section>;
}

function ProductTabs() {
  const { products, t } = useStore();
  const tabs = [["best", t("bestSellers")], ["new", t("newArrivals")], ["sale", t("sale")], ["featured", t("featured")]] as const;
  const [tab, setTab] = useState<(typeof tabs)[number][0]>("best");
  const list = (tab === "best" ? [...products].sort((a, b) => b.sold - a.sold)
    : tab === "new" ? [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    : tab === "sale" ? products.filter((p) => p.compareAt) : products.filter((p) => p.featured)).slice(0, 8);
  return <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
    <SectionHead eyebrow="Curated" title={t("trending")} href="/ecommerce/shop" />
    <div className="scrollbar-none mt-8 flex gap-2 overflow-x-auto">
      {tabs.map(([k, label]) => <button key={k} onClick={() => setTab(k)} className={`relative shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition ${tab === k ? "text-l-bg" : "text-l-fg/60 hover:text-l-fg"}`}>
        {tab === k && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-l-fg" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
        <span className="relative">{label}</span>
      </button>)}
    </div>
    <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
    </motion.div>
  </section>;
}

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const tm = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(tm); }, []);
  const end = new Date(); end.setHours(23, 59, 59, 999);
  const left = now === null ? 0 : Math.max(0, end.getTime() - now + 2 * 86400000);
  const parts = [["Days", Math.floor(left / 86400000)], ["Hrs", Math.floor(left / 3600000) % 24], ["Min", Math.floor(left / 60000) % 60], ["Sec", Math.floor(left / 1000) % 60]] as const;
  return <div className="mt-6 flex gap-2">{parts.map(([l, v]) => <div key={l} className="w-16 rounded-2xl bg-white/15 py-2 text-center backdrop-blur">
    <AnimatePresence mode="popLayout"><motion.p key={v} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="text-2xl font-bold tabular-nums">{String(v).padStart(2, "0")}</motion.p></AnimatePresence>
    <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">{l}</p></div>)}</div>;
}

function Promo() {
  return <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
    <Reveal className="relative overflow-hidden rounded-[2rem] bg-[#b34a33] text-white">
      <div className="grid items-center md:grid-cols-2">
        <div className="p-10 md:p-16">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-white/75">Mid-season event</p>
          <h2 className="mt-4 font-serif text-5xl font-bold leading-none md:text-6xl">Up to 30% off<br />selected styles</h2>
          <p className="mt-5 max-w-sm text-white/85">Outerwear, tailoring and leather goods — the countdown is on.</p>
          <Countdown />
          <Link href="/ecommerce/shop?sale=1" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-black hover:text-white">Shop the sale <ArrowRight size={16} /></Link>
        </div>
        <div className="relative h-72 md:h-full md:min-h-[480px]"><motion.img initial={{ scale: 1.15 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} src={banners.promo} alt="" className="absolute inset-0 size-full object-cover" /></div>
      </div>
    </Reveal>
  </section>;
}

function NewArrivals() {
  const { products, t } = useStore();
  const list = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10);
  return <section className="py-10">
    <div className="mx-auto max-w-7xl px-4 lg:px-8"><SectionHead eyebrow="Just landed" title={t("newArrivals")} href="/ecommerce/shop?sort=newest" /></div>
    <div className="horizontal-cards mt-6" style={{ gridAutoColumns: "minmax(240px, 23%)" }}>
      {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
    </div>
  </section>;
}

function Values() {
  const items = [["01", "Honest materials", "Organic cotton, European linen and responsibly sourced wool — chosen to feel good and last."], ["02", "Small-batch making", "We produce in limited runs with family workshops, so less ends up unsold or wasted."], ["03", "Fair, clear pricing", "No inflated mark-downs. Our prices reflect the real cost of making things well."]];
  return <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <Reveal className="overflow-hidden rounded-[2rem]"><motion.img initial={{ scale: 1.1 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} src={banners.folded} alt="Folded tees in different colours" className="aspect-[4/3] w-full object-cover" /></Reveal>
      <div>
        <SectionHead eyebrow="Our approach" title="Made with intention" />
        <div className="mt-8 grid gap-4">{items.map(([n, title, text], i) => <Reveal key={n} delay={i * .1} className="group flex gap-5 rounded-2xl bg-l-surface p-5 transition hover:shadow-lg">
          <span className="font-serif text-3xl font-bold text-l-accent">{n}</span>
          <div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-l-fg/60">{text}</p></div>
        </Reveal>)}</div>
        <Link href="/ecommerce/about" className={`${btnPrimary} mt-8`}>Our story <ArrowRight size={16} /></Link>
      </div>
    </div>
  </section>;
}

function Testimonials() {
  const { products } = useStore();
  return <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
    <SectionHead eyebrow="Reviews" title="Loved by customers" />
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      {testimonials.map((tm, i) => { const pr = products.find((p) => p.name === tm.product); return <Reveal key={tm.name} delay={i * .1} className="flex flex-col rounded-3xl bg-l-surface p-7">
        <Stars rating={tm.rating} size={15} /><p className="mt-5 flex-1 text-lg leading-7">“{tm.text}”</p>
        <div className="mt-6 flex items-center gap-3 border-t border-l-fg/10 pt-5">
          {pr && <img src={pr.images[0]} alt="" className="size-12 rounded-xl object-cover" />}
          <div><p className="text-sm font-semibold">{tm.name}</p>{pr && <Link href={`/ecommerce/product/${pr.slug}`} className="text-xs text-l-fg/55 hover:underline">Verified buyer · {pr.name}</Link>}</div>
        </div>
      </Reveal>; })}
    </div>
  </section>;
}

