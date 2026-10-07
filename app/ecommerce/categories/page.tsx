"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories, type TKey } from "@/data/ecommerce";
import { PageHeader, Reveal } from "@/components/ecommerce/ui";
import { useStore } from "@/components/ecommerce/store";

export default function CategoriesPage() {
  const { products, t } = useStore();
  return <>
    <PageHeader title={t("categories")} text="Browse the full catalogue by department and product type." crumbs={[[t("home"), "/ecommerce"], [t("categories")]]} />
    <div className="mx-auto mt-10 grid max-w-7xl gap-6 px-4 lg:px-8">
      {categories.map((c, i) => { const items = products.filter((p) => p.category === c.slug); return <Reveal key={c.slug} delay={i * .05}>
        <div className={`grid overflow-hidden rounded-[2rem] bg-l-surface md:grid-cols-[1.1fr_1fr] ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
          <Link href={`/ecommerce/shop?category=${c.slug}`} className="group relative block min-h-[300px] overflow-hidden">
            <img src={c.image} alt={c.name} className="absolute inset-0 size-full object-cover transition duration-[900ms] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white"><h2 className="font-serif text-5xl font-bold">{t(c.slug as TKey)}</h2><p className="text-sm text-white/80">{items.length} products</p></div>
          </Link>
          <div className="flex flex-col justify-center p-8 md:p-10">
            <p className="text-l-fg/60">{c.blurb}</p>
            <ul className="mt-6 grid gap-2">{c.types.map((ty) => { const n = items.filter((p) => p.type === ty).length; return <li key={ty}>
              <Link href={`/ecommerce/shop?category=${c.slug}&type=${encodeURIComponent(ty)}`} className="group flex items-center justify-between rounded-2xl border border-l-fg/10 px-4 py-3 transition hover:border-l-fg hover:bg-l-bg">
                <span className="font-semibold">{ty}</span><span className="flex items-center gap-3 text-sm text-l-fg/50">{n} items<ArrowUpRight size={16} className="transition group-hover:rotate-45 group-hover:text-l-fg" /></span>
              </Link></li>; })}</ul>
          </div>
        </div>
      </Reveal>; })}
    </div>
  </>;
}
