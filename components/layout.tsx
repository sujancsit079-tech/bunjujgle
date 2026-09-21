"use client";

import Link from "next/link";
import { Menu, Phone, X, MessageCircle, ArrowUpRight, MapPin, Mail, Instagram, Facebook } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { business } from "@/data/site";

const nav = [
  ["Experiences", "/attractions"], ["Stay", "/stay"], ["Dining", "/dining"], ["Packages", "/packages"],
  ["About", "/about-us"], ["Gallery", "/gallery"], ["Events", "/events"], ["Plan Your Visit", "/plan-your-visit"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  return <>
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open || pathname !== "/" ? "bg-[#102b21]/95 text-white shadow-xl backdrop-blur-md" : "text-white"}`}>
      <div className={`hidden overflow-hidden border-b border-white/10 transition-all duration-300 lg:block ${scrolled || pathname !== "/" ? "max-h-0 opacity-0" : "max-h-12 opacity-100"}`}>
        <div className="container-site flex h-11 items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white/70">
          <div className="flex gap-6"><a href={`tel:${business.phoneLink}`} className="flex items-center gap-2 hover:text-gold"><Phone size={13}/>{business.phone}</a><a href={`mailto:${business.email}`} className="flex items-center gap-2 hover:text-gold"><Mail size={13}/>{business.email}</a></div>
          <div className="flex items-center gap-4"><span>Panchmane, Kathmandu</span><a href="#" aria-label="Instagram" className="hover:text-gold"><Instagram size={14}/></a><a href="#" aria-label="Facebook" className="hover:text-gold"><Facebook size={14}/></a></div>
        </div>
      </div>
      <div className={`container-site flex items-center justify-between gap-5 transition-all duration-300 ${scrolled ? "h-[4.5rem] lg:h-20" : "h-20 lg:h-24"}`}>
        <Link href="/" aria-label="Ban Jungle Adventure home" className="relative z-10 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full border border-white/35 bg-white/10 font-serif text-2xl font-bold">BJ</span>
          <span className="leading-[1.05]"><strong className="block font-serif text-xl tracking-tight">Ban Jungle</strong><small className="text-[9px] font-bold uppercase tracking-[.25em] text-gold">Adventure</small></span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-5 xl:flex">
          {nav.map(([label, href]) => <Link key={href} href={href} className={`link-line text-[11px] font-extrabold uppercase tracking-[.09em] transition-colors hover:text-gold ${pathname === href ? "text-gold" : ""}`}>{label}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/contact" className="text-xs font-extrabold uppercase tracking-wider hover:text-gold">Contact</Link>
          <Link href="/contact#booking" className="button-primary">Book now <ArrowUpRight size={16}/></Link>
        </div>
        <button onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} className="relative z-10 grid size-12 place-items-center rounded-full border border-white/30 xl:hidden">{open ? <X/> : <Menu/>}</button>
      </div>
      {open && <div id="mobile-menu" className="border-t border-white/10 bg-[#102b21] px-4 pb-7 pt-4 xl:hidden">
        <nav aria-label="Mobile navigation" className="mx-auto grid max-w-2xl gap-1">
          {nav.map(([label, href]) => <Link key={href} href={href} className="border-b border-white/10 py-3 font-serif text-2xl">{label}</Link>)}
          <div className="mt-4 flex gap-3"><Link href="/contact" className="button-light flex-1">Contact</Link><Link href="/contact#booking" className="button-primary flex-1">Book now</Link></div>
        </nav>
      </div>}
    </header>
  </>;
}

export function Footer() {
  return <footer className="bg-[#0b251b] pb-28 pt-20 text-white lg:pb-8">
    <div className="container-site">
      <div className="grid gap-12 border-b border-white/15 pb-16 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div><div className="font-serif text-4xl font-bold">Ban Jungle</div><div className="mt-1 text-xs font-bold uppercase tracking-[.28em] text-gold">Adventure</div><p className="mt-6 max-w-sm text-sm leading-7 text-white/65">Adventure, nature, dining and peaceful overnight escapes in Panchmane, Kathmandu.</p></div>
        <FooterLinks title="Explore" items={[["Experiences","/attractions"],["Stay","/stay"],["Dining","/dining"],["Packages","/packages"],["Gallery","/gallery"],["Events","/events"]]} />
        <FooterLinks title="Plan" items={[["About Us","/about-us"],["Plan Your Visit","/plan-your-visit"],["Safety","/safety"],["FAQ","/faq"],["Reviews","/reviews"],["Contact","/contact"]]} />
        <div><h3 className="text-xs font-bold uppercase tracking-[.18em] text-gold">Find us</h3><p className="mt-5 flex gap-3 text-sm leading-6 text-white/70"><MapPin className="mt-1 shrink-0" size={17}/>{business.address}</p><a className="mt-4 block text-sm hover:text-gold" href={`tel:${business.phoneLink}`}>{business.phone}</a><a className="mt-2 block break-all text-sm hover:text-gold" href={`mailto:${business.email}`}>{business.email}</a></div>
      </div>
      <div className="flex flex-col gap-3 pt-7 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Ban Jungle Adventure. All rights reserved.</p><div className="flex gap-5"><Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link></div></div>
    </div>
  </footer>;
}

function FooterLinks({ title, items }: { title: string; items: string[][] }) {
  return <div><h3 className="text-xs font-bold uppercase tracking-[.18em] text-gold">{title}</h3><ul className="mt-5 space-y-3 text-sm text-white/70">{items.map(([label, href]) => <li key={href}><Link href={href} className="hover:text-white">{label}</Link></li>)}</ul></div>;
}

export function MobileActions() {
  return <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-2 rounded-full border border-white/20 bg-[#102b21]/95 p-2 text-white shadow-2xl backdrop-blur-lg lg:hidden"><Link href="/contact#booking" className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold text-xs font-extrabold uppercase tracking-wider text-ink"><Phone size={16}/>Book</Link><a href={business.whatsapp} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-full text-xs font-extrabold uppercase tracking-wider"><MessageCircle size={17}/>WhatsApp</a></div>;
}
