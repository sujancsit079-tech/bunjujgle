import type { Metadata } from "next";
import { CTASection, PackageCard, PageHero } from "@/components/ui";
import { images, packages } from "@/data/site";
export const metadata: Metadata = { title: "Adventure Packages", description: "Discover family, school, group, day adventure and night stay package ideas at Ban Jungle Adventure." };
export default function Packages(){return <main id="main"><PageHero eyebrow="Packages" title="Good days are better shared." text="Start with a package idea and let the team help shape an adventure for your people." image={images.group}/><section className="section-pad bg-cream"><div className="container-site grid gap-7 md:grid-cols-2 lg:grid-cols-3">{packages.map(p=><PackageCard key={p.slug} item={p}/>)}</div></section><CTASection/></main>}
