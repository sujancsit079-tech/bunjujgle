import type { Metadata } from "next";
import { ActivityFilter } from "@/components/interactive";
import { CTASection, PageHero } from "@/components/ui";
import { images } from "@/data/site";
export const metadata: Metadata = { title: "Adventure Activities in Kathmandu", description: "Explore zipline, giant swing, climbing, cycling and family outdoor activities at Ban Jungle Adventure." };
export default function Attractions(){return <main id="main"><PageHero eyebrow="Experiences" title="Find your next adventure." text="Explore forest experiences for thrill seekers, families, children, schools and groups in Kathmandu." image={images.climbing}/><section className="section-pad bg-cream"><div className="container-site"><ActivityFilter/></div></section><CTASection/></main>}
