import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, LayoutDashboard, ShoppingBag, Sparkles } from "lucide-react";
import { PageHero } from "@/components/ui";
import { banners, img } from "@/data/ecommerce";

export const metadata: Metadata = { title: "Templates", description: "Preview demo website templates, including a full e-commerce storefront with admin dashboard." };

const templates = [
  {
    name: "Lumen Wear — E-commerce Store",
    text: "Clothing storefront with animated hero slider, filters, product gallery with zoom, cart drawer, wishlist, multi-step checkout and an admin dashboard.",
    image: banners.hero[0].image,
    tags: ["Next.js", "Framer Motion", "Tailwind", "Admin"],
    links: [["Open storefront", "/ecommerce", ShoppingBag], ["Admin dashboard", "/ecommerce/admin", LayoutDashboard]] as const,
  },
];

export default function TemplatesPage() {
  return <main id="main">
    <PageHero eyebrow="Templates" title="Website templates" text="Live, fully interactive demo templates you can browse, test and reuse." image={img("1441984904996-e0b6ba687e04", 1800)} />
    <section className="section-pad bg-cream">
      <div className="container-site grid gap-8">
        {templates.map((t) => <article key={t.name} data-reveal className="image-card grid overflow-hidden rounded-[2rem] bg-white lg:grid-cols-[1.2fr_1fr]">
          <Link href={t.links[0][1]} className="relative block min-h-[320px] overflow-hidden lg:min-h-[460px]">
            <img src={t.image} alt={`${t.name} preview`} className="absolute inset-0 size-full object-cover" />
            <span className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-ink"><Sparkles size={14} /> Live demo</span>
          </Link>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="eyebrow text-jungle">E-commerce</p>
            <h2 className="mt-4 font-serif text-4xl font-bold md:text-5xl">{t.name}</h2>
            <p className="mt-5 leading-8 text-ink/65">{t.text}</p>
            <div className="mt-6 flex flex-wrap gap-2">{t.tags.map((tag) => <span key={tag} className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-ink/70">{tag}</span>)}</div>
            <div className="mt-8 flex flex-wrap gap-3">{t.links.map(([label, href, Icon], i) => <Link key={href} href={href} className={i === 0 ? "button-primary" : "button-outline"}><Icon size={16} />{label}<ArrowUpRight size={16} /></Link>)}</div>
          </div>
        </article>)}
      </div>
    </section>
  </main>;
}
