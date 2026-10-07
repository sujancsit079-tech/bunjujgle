"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard, Reveal } from "./ui";
import { useStore } from "./store";

export function SectionHead({ eyebrow, title, href }: { eyebrow: string; title: string; href?: string }) {
  const { t } = useStore();
  return <Reveal className="flex items-end justify-between gap-6">
    <div><p className="text-xs font-bold uppercase tracking-[.2em] text-l-accent">{eyebrow}</p><h2 className="mt-2 font-serif text-4xl font-bold tracking-tight md:text-5xl">{title}</h2></div>
    {href && <Link href={href} className="link-line hidden items-center gap-2 text-sm font-semibold sm:flex">{t("viewAll")} <ArrowRight size={16} /></Link>}
  </Reveal>;
}

export function RecentlyViewed({ exclude }: { exclude?: number }) {
  const { recent, byId, t } = useStore();
  const list = recent.filter((id) => id !== exclude).map(byId).filter(Boolean).slice(0, 4);
  if (!list.length) return null;
  return <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
    <SectionHead eyebrow="For you" title={t("recentlyViewed")} />
    <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">{list.map((p, i) => <ProductCard key={p!.id} product={p!} index={i} />)}</div>
  </section>;
}
