"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, Loader2, X } from "lucide-react";
import { activities, business, faqs, images, visitorExperiences } from "@/data/site";
import { ActivityCard } from "./ui";

export function VisitorSelector() {
  const categories = Object.keys(visitorExperiences) as (keyof typeof visitorExperiences)[];
  const [active, setActive] = useState(categories[0]);
  return <div className="mt-12"><div className="flex gap-2 overflow-x-auto pb-3" role="tablist" aria-label="Visitor type">{categories.map(category => <button key={category} role="tab" aria-selected={active === category} onClick={() => setActive(category)} className={`min-h-12 shrink-0 rounded-full px-5 text-xs font-bold uppercase tracking-wider transition-colors ${active === category ? "bg-gold text-ink" : "border border-white/25 text-white"}`}>{category}</button>)}</div><div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{visitorExperiences[active].map((item, i) => <div key={item} className="rounded-2xl border border-white/15 bg-white/5 p-6"><span className="font-serif text-3xl text-gold">0{i + 1}</span><h3 className="mt-8 font-serif text-2xl font-bold text-white">{item}</h3></div>)}</div></div>;
}

export function ActivityFilter() {
  const filters = ["All", "Thrill", "Family", "Kids", "Nature", "Climbing"];
  const [active, setActive] = useState("All");
  const shown = active === "All" ? activities : activities.filter(item => item.category === active);
  return <><div className="mt-10 flex gap-2 overflow-x-auto pb-3">{filters.map(filter => <button key={filter} onClick={() => setActive(filter)} className={`min-h-12 shrink-0 rounded-full px-6 text-xs font-bold uppercase tracking-wider ${filter === active ? "bg-forest text-white" : "border border-ink/20"}`}>{filter}</button>)}</div><div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">{shown.map((item, index) => <ActivityCard key={item.slug} activity={item} index={index}/>)}</div></>;
}

export function FAQAccordion({ limit }: { limit?: number }) {
  return <div className="divide-y divide-ink/15 border-y border-ink/15">{faqs.slice(0, limit).map(([question, answer], i) => <details key={question} className="group py-1" open={i === 0}><summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-5 py-4 font-serif text-xl font-bold marker:hidden"><span>{question}</span><span className="grid size-9 shrink-0 place-items-center rounded-full bg-forest text-white"><ChevronDown size={17} className="transition-transform group-open:rotate-180"/></span></summary><p className="max-w-3xl pb-7 pr-10 text-sm leading-7 text-ink/65">{answer}</p></details>)}</div>;
}

export function ContactForm() {
  const [state, setState] = useState<"idle"|"loading"|"success"|"error">("idle");
  function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setState("loading"); window.setTimeout(() => setState("success"), 700); }
  if (state === "success") return <div role="status" className="rounded-3xl bg-[#e8f1e9] p-10 text-center"><CheckCircle2 className="mx-auto text-jungle" size={44}/><h3 className="mt-5 font-serif text-3xl font-bold">Inquiry prepared</h3><p className="mt-3 text-sm leading-6 text-ink/65">This demonstration form does not send data yet. Please call or WhatsApp the team to complete your inquiry.</p><a href={business.whatsapp} target="_blank" rel="noreferrer" className="button-primary mt-7">Continue on WhatsApp</a></div>;
  return <form onSubmit={submit} className="grid gap-5" aria-label="Booking inquiry form">
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Name" name="name" required/><Field label="Email" name="email" type="email" required/><Field label="Phone" name="phone" type="tel" required/><Field label="Visit date" name="date" type="date"/></div>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Number of visitors" name="visitors" type="number" min="1"/><label className="grid gap-2 text-xs font-bold uppercase tracking-wider">Experience<select name="experience" className="min-h-14 rounded-xl border border-ink/20 bg-white px-4 text-sm font-normal normal-case"><option>General inquiry</option>{activities.map(a => <option key={a.slug}>{a.name}</option>)}</select></label></div>
    <label className="grid gap-2 text-xs font-bold uppercase tracking-wider">Message<textarea name="message" required rows={5} className="rounded-xl border border-ink/20 bg-white p-4 text-sm font-normal normal-case"/></label>
    <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true"/>
    {state === "error" && <p role="alert" className="text-sm text-red-700">Something went wrong. Please try WhatsApp or call us.</p>}
    <div className="flex flex-wrap gap-3"><button disabled={state === "loading"} className="button-primary disabled:opacity-60">{state === "loading" ? <Loader2 className="animate-spin" size={17}/> : null}Submit inquiry <ArrowRight size={16}/></button><a href={business.whatsapp} target="_blank" rel="noreferrer" className="button-outline">WhatsApp instead</a></div>
  </form>;
}

function Field({ label, name, type="text", ...props }: { label: string; name: string; type?: string; required?: boolean; min?: string }) { return <label className="grid gap-2 text-xs font-bold uppercase tracking-wider">{label}<input name={name} type={type} className="min-h-14 rounded-xl border border-ink/20 bg-white px-4 text-sm font-normal normal-case" {...props}/></label>; }

const gallery = [
  { src: images.zipline, category: "Adventure" }, { src: images.stay, category: "Stay" },
  { src: images.dining, category: "Food" }, { src: images.climbing, category: "Adventure" },
  { src: images.nature, category: "Nature" }, { src: images.group, category: "Events" },
  { src: images.cycling, category: "Adventure" }, { src: images.kids, category: "Families" },
];
export function GalleryLightbox() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null);
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [selected]);
  const shown = filter === "All" ? gallery : gallery.filter(item => item.category === filter);
  return <><div className="mb-10 flex gap-2 overflow-auto">{["All","Adventure","Nature","Food","Stay","Events","Families"].map(category=><button key={category} onClick={() => setFilter(category)} className={`min-h-12 shrink-0 rounded-full px-5 text-xs font-bold uppercase tracking-wider ${filter===category?"bg-forest text-white":"border border-ink/20"}`}>{category}</button>)}</div><div className="columns-1 gap-5 sm:columns-2 lg:columns-3">{shown.map(({src,category}, i) => <button key={`${src}-${category}`} onClick={() => setSelected(src)} className="image-card relative mb-5 block w-full overflow-hidden rounded-3xl"><Image src={src} width={900} height={i % 3 === 0 ? 1100 : 700} alt={`Temporary Ban Jungle ${category.toLowerCase()} gallery placeholder`} className="h-auto w-full object-cover"/><span className="absolute inset-x-4 bottom-4 rounded-full bg-black/55 px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">{category} • Business image required</span></button>)}</div>{selected && <div role="dialog" aria-modal="true" aria-label="Gallery image viewer" className="fixed inset-0 z-[80] grid place-items-center bg-black/95 p-4" onClick={() => setSelected(null)}><button autoFocus aria-label="Close gallery" className="absolute right-5 top-5 grid size-12 place-items-center rounded-full bg-white text-ink"><X/></button><Image src={selected} alt="Expanded temporary Ban Jungle gallery placeholder" width={1500} height={1000} className="max-h-[85vh] w-auto rounded-2xl object-contain"/></div>}</>;
}
