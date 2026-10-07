"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { faqs } from "@/data/ecommerce";
import { PageHeader, btnPrimary } from "@/components/ecommerce/ui";
import { useStore } from "@/components/ecommerce/store";

export default function FAQPage() {
  const { t } = useStore();
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(faqs[0].items[0][0]);
  const s = q.toLowerCase();
  const groups = faqs.filter((g) => !group || g.group === group).map((g) => ({ ...g, items: g.items.filter(([qq, a]) => !s || qq.toLowerCase().includes(s) || a.toLowerCase().includes(s)) })).filter((g) => g.items.length);

  return <>
    <PageHeader title={t("faq")} text="Quick answers to the questions we hear most." crumbs={[[t("home"), "/ecommerce"], [t("faq")]]} />
    <div className="mx-auto mt-8 max-w-4xl px-4 lg:px-8">
      <div className="flex items-center gap-3 rounded-full border border-l-fg/15 bg-l-surface px-5 py-3"><Search size={18} className="text-l-fg/45" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions…" aria-label="Search questions" className="flex-1 bg-transparent outline-none" /></div>
      <div className="scrollbar-none mt-5 flex gap-2 overflow-x-auto">{[null, ...faqs.map((g) => g.group)].map((g) => <button key={g ?? "all"} onClick={() => setGroup(g)} className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${group === g ? "text-l-bg" : "text-l-fg/60"}`}>
        {group === g && <motion.span layoutId="faq-group" className="absolute inset-0 rounded-full bg-l-fg" />}<span className="relative">{g ?? "All"}</span></button>)}</div>
      <div className="mt-10 grid gap-10">
        {groups.length === 0 && <p className="rounded-3xl bg-l-surface p-10 text-center text-l-fg/60">No questions match “{q}”.</p>}
        {groups.map((g) => <motion.section key={g.group} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xs font-bold uppercase tracking-[.2em] text-l-accent">{g.group}</h2>
          <div className="mt-3 rounded-3xl bg-l-surface px-6">{g.items.map(([qq, a]) => <div key={qq} className="border-b border-l-fg/10 last:border-0">
            <button aria-expanded={open === qq} onClick={() => setOpen(open === qq ? null : qq)} className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold">{qq}<motion.span animate={{ rotate: open === qq ? 180 : 0 }} className="shrink-0"><ChevronDown size={18} /></motion.span></button>
            <AnimatePresence initial={false}>{open === qq && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="pb-5 leading-7 text-l-fg/65">{a}</p></motion.div>}</AnimatePresence>
          </div>)}</div>
        </motion.section>)}
      </div>
      <div className="mt-14 rounded-3xl bg-l-surface p-8 text-center"><h2 className="font-serif text-3xl font-bold">Still need help?</h2><p className="mt-2 text-l-fg/60">Our team is happy to answer anything else.</p><Link href="/ecommerce/contact" className={`${btnPrimary} mt-5`}>{t("contact")}</Link></div>
    </div>
  </>;
}
