"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Leaf, Recycle, Users } from "lucide-react";
import { banners, img } from "@/data/ecommerce";
import { Crumbs, Reveal, btnPrimary } from "@/components/ecommerce/ui";
import { useStore } from "@/components/ecommerce/store";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => { if (!inView) return; const c = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) }); return () => c.stop(); }, [inView, to]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

export default function AboutPage() {
  const { t, settings } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  return <>
    <div className="mx-auto max-w-7xl px-4 pt-10 lg:px-8">
      <Crumbs items={[[t("home"), "/ecommerce"], [t("about")]]} />
      <div className="mt-6 grid items-end gap-8 lg:grid-cols-2">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-6xl font-bold leading-[.95] tracking-tight md:text-8xl">Clothes worth<br /><span className="text-l-accent">keeping.</span></motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }} className="max-w-md text-lg leading-8 text-l-fg/65">{settings.storeName} started in 2019 with a simple idea: make fewer, better things — and be honest about how they&apos;re made.</motion.p>
      </div>
    </div>
    <div ref={ref} className="mx-auto mt-12 max-w-7xl overflow-hidden px-4 lg:px-8"><div className="overflow-hidden rounded-[2rem]"><motion.img style={{ y, scale: 1.2 }} src={banners.about} alt="Rack of clothing in the studio" className="aspect-[21/9] w-full object-cover" /></div></div>

    <section className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-20 md:grid-cols-4 lg:px-8">
      {[[48000, "+", "Happy customers"], [28, "", "Core products"], [6, "", "Partner workshops"], [92, "%", "Natural or recycled fibres"]].map(([n, s, l], i) => <Reveal key={l as string} delay={i * .08} className="rounded-3xl bg-l-surface p-6">
        <p className="font-serif text-5xl font-bold"><Counter to={n as number} suffix={s as string} /></p><p className="mt-2 text-sm text-l-fg/60">{l as string}</p>
      </Reveal>)}
    </section>

    <section className="mx-auto max-w-7xl px-4 lg:px-8">
      <Reveal><p className="text-xs font-bold uppercase tracking-[.2em] text-l-accent">What we stand for</p><h2 className="mt-2 font-serif text-5xl font-bold">Three promises</h2></Reveal>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[[Leaf, "Better materials", "We choose fibres for how they feel, how long they last and how they're grown — organic, recycled or traceable wherever possible."], [Users, "People first", "Our partner workshops pay living wages and we visit every season. Long relationships make better clothes."], [Recycle, "Built to last", "Reinforced seams, quality trims and timeless shapes mean you buy less often. Repairs are free for the first year."]].map(([Icon, title, text], i) => { const I = Icon as typeof Leaf; return <Reveal key={title as string} delay={i * .1} className="group rounded-3xl bg-l-surface p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
          <span className="grid size-12 place-items-center rounded-2xl bg-l-accent/10 text-l-accent transition group-hover:bg-l-accent group-hover:text-white"><I size={22} /></span>
          <h3 className="mt-6 text-xl font-bold">{title as string}</h3><p className="mt-3 leading-7 text-l-fg/60">{text as string}</p>
        </Reveal>; })}
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-[#111] text-white md:grid-cols-2">
        <img src={img("1523381210434-271e8be1f52b", 1200)} alt="" className="h-full min-h-[320px] w-full object-cover" />
        <div className="p-10">
          <h2 className="font-serif text-4xl font-bold md:text-5xl">Visit the studio</h2>
          <p className="mt-4 leading-7 text-white/70">Try everything on, get styling advice and see our repair bench in action. Open every day except Tuesday.</p>
          <Link href="/ecommerce/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-l-accent hover:text-white">Get directions <ArrowRight size={16} /></Link>
        </div>
      </div>
      <div className="mt-12 text-center"><Link href="/ecommerce/shop" className={btnPrimary}>{t("shopNow")} <ArrowRight size={16} /></Link></div>
    </section>
  </>;
}
