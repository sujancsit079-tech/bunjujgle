import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, MapPin } from "lucide-react";
import type { Activity, Package } from "@/data/site";
import { business } from "@/data/site";

export function SectionHeading({ eyebrow, title, text, light = false }: { eyebrow: string; title: string; text?: string; light?: boolean }) {
  return <div className={`max-w-3xl ${light ? "text-white" : ""}`}><div className={`eyebrow ${light ? "text-gold" : "text-jungle"}`}>{eyebrow}</div><h2 className="section-title mt-5">{title}</h2>{text && <p className={`mt-6 max-w-2xl text-base leading-8 ${light ? "text-white/65" : "text-ink/65"}`}>{text}</p>}</div>;
}

export function ActivityCard({ activity, index = 0 }: { activity: Activity; index?: number }) {
  return <article className={`image-card group relative min-h-[440px] overflow-hidden rounded-[2rem] ${index % 3 === 1 ? "lg:translate-y-10" : ""}`}>
    <Image src={activity.image} alt={`Temporary placeholder for ${activity.name} at Ban Jungle Adventure`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"/>
    <div className="absolute inset-x-0 bottom-0 p-7 text-white"><span className="text-[10px] font-bold uppercase tracking-[.2em] text-gold">{activity.category}</span><h3 className="mt-2 font-serif text-3xl font-bold">{activity.name}</h3><p className="mt-3 text-sm leading-6 text-white/70">{activity.description}</p><div className="mt-5 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider">{activity.price ?? "Contact for pricing"}</span><Link href={`/attractions/${activity.slug}`} aria-label={`Explore ${activity.name}`} className="card-arrow grid size-12 place-items-center rounded-full bg-gold text-ink transition-colors group-hover:bg-white"><ArrowUpRight size={19}/></Link></div></div>
  </article>;
}

export function PackageCard({ item }: { item: Package }) {
  return <article className="image-card overflow-hidden rounded-[1.7rem] bg-white"><div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={`Temporary placeholder for ${item.name}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover"/><span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-wider backdrop-blur">{item.audience}</span></div><div className="p-7"><h3 className="font-serif text-3xl font-bold">{item.name}</h3><p className="mt-3 min-h-12 text-sm leading-6 text-ink/60">{item.description}</p><div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-5"><span className="text-xs font-extrabold uppercase tracking-wider text-jungle">Contact for pricing</span><Link href={`/packages/${item.slug}`} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">View package <ArrowRight size={15}/></Link></div></div></article>;
}

export function PageHero({ eyebrow, title, text, image }: { eyebrow: string; title: string; text: string; image: string }) {
  return <section className="grain relative flex min-h-[70vh] items-end overflow-hidden bg-forest pb-20 pt-40 text-white"><Image src={image} alt="Temporary Ban Jungle Adventure page header placeholder" fill priority sizes="100vw" className="object-cover opacity-55"/><div className="absolute inset-0 bg-gradient-to-t from-[#0b251b] via-[#0b251b]/20 to-black/35"/><div className="container-site relative z-10"><div className="eyebrow text-gold">{eyebrow}</div><h1 className="display mt-6 max-w-5xl">{title}</h1><p className="mt-7 max-w-xl text-base leading-8 text-white/75">{text}</p></div></section>;
}

export function CTASection() {
  return <section className="bg-gold py-14 text-ink"><div className="container-site flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"><div><div className="text-xs font-bold uppercase tracking-[.2em]">Your forest escape starts here</div><h2 className="mt-2 font-serif text-4xl font-bold lg:text-5xl">Ready for a different kind of day?</h2></div><div className="flex flex-wrap gap-3"><Link href="/contact#booking" className="button-light">Book your adventure <ArrowUpRight size={17}/></Link><a href={business.whatsapp} target="_blank" rel="noreferrer" className="button-outline">WhatsApp us</a></div></div></section>;
}

export function InfoList({ items }: { items: string[] }) {
  return <ul className="grid gap-3">{items.map(item => <li key={item} className="flex items-start gap-3 text-sm leading-7 text-ink/70"><span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-gold"><Check size={12}/></span>{item}</li>)}</ul>;
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return <nav aria-label="Breadcrumb" className="container-site py-5 text-xs font-bold uppercase tracking-wider text-ink/55"><ol className="flex flex-wrap gap-2">{items.map((item, i) => <li key={item.label} className="flex gap-2">{i > 0 && <span>/</span>}{item.href ? <Link className="hover:text-jungle" href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol></nav>;
}

export function LocationBlock() {
  return <section className="section-pad bg-white"><div className="container-site grid gap-10 lg:grid-cols-2 lg:items-center"><div><div className="eyebrow text-jungle">Location</div><h2 className="section-title mt-5">Find the wild side of Kathmandu.</h2><p className="mt-6 flex max-w-lg gap-3 leading-7 text-ink/65"><MapPin className="mt-1 shrink-0 text-gold"/>{business.address}</p><a href={`tel:${business.phoneLink}`} className="button-primary mt-8">Call for directions <ArrowUpRight size={16}/></a></div><div className="grid min-h-[360px] place-items-center rounded-[2rem] bg-forest p-8 text-center text-white"><div><MapPin className="mx-auto text-gold" size={42}/><h3 className="mt-5 font-serif text-3xl font-bold">Panchmane, Tarakeshwar</h3><p className="mt-3 text-sm text-white/60">Open the contact page for map and travel information.</p><Link href="/contact" className="button-light mt-7">View location</Link></div></div></div></section>;
}
