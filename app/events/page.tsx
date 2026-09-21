import type { Metadata } from "next";
import { PageHero, CTASection } from "@/components/ui";
import { images } from "@/data/site";
export const metadata: Metadata={title:"Events",description:"Discover upcoming events at Ban Jungle Adventure in Kathmandu."};
export default function Events(){return <main id="main"><PageHero eyebrow="Events" title="Gather outside the ordinary." text="A CMS-ready event space for upcoming Ban Jungle Adventure programmes and occasions." image={images.group}/><section className="section-pad bg-cream"><div className="container-site rounded-[2rem] bg-white p-10 text-center md:p-16"><h2 className="font-serif text-4xl font-bold">No published events right now.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink/60">Upcoming events will appear here automatically, while past events move into the archive.</p></div></section><CTASection/></main>}
