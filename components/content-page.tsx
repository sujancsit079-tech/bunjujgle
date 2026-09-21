import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CTASection, InfoList, PageHero, SectionHeading } from "./ui";

type Block = { title: string; text: string; items?: string[] };

export function ContentPage({ eyebrow, title, intro, image, blocks }: { eyebrow: string; title: string; intro: string; image: string; blocks: Block[] }) {
  return <main id="main"><PageHero eyebrow={eyebrow} title={title} text={intro} image={image}/><section className="section-pad bg-cream"><div className="container-site grid gap-8 lg:grid-cols-2">{blocks.map((block,i)=><article key={block.title} className={`rounded-[2rem] p-8 md:p-10 ${i % 3 === 0 ? "bg-forest text-white" : "bg-white"}`}><span className={`font-serif text-4xl ${i % 3 === 0 ? "text-gold" : "text-ink/20"}`}>0{i+1}</span><h2 className="mt-10 font-serif text-4xl font-bold">{block.title}</h2><p className={`mt-5 leading-8 ${i % 3 === 0 ? "text-white/65" : "text-ink/65"}`}>{block.text}</p>{block.items && <div className={`mt-7 ${i % 3 === 0 ? "[&_li]:text-white/70" : ""}`}><InfoList items={block.items}/></div>}</article>)}</div></section><CTASection/></main>;
}

export function EditorialSplit({ title, text, image, reverse=false }: { title: string; text: string; image: string; reverse?: boolean }) {
  return <div className="grid overflow-hidden rounded-[2rem] bg-white lg:grid-cols-2"><div className={`relative min-h-[420px] ${reverse ? "lg:order-2" : ""}`}><Image src={image} alt={`Temporary placeholder for ${title}`} fill sizes="(max-width:1024px) 100vw,50vw" className="object-cover"/></div><div className="flex items-center p-8 md:p-14"><div><h2 className="font-serif text-4xl font-bold md:text-5xl">{title}</h2><p className="mt-6 leading-8 text-ink/65">{text}</p><a href="/contact" className="button-primary mt-8">Ask the team <ArrowUpRight size={16}/></a></div></div></div>;
}
