import type { Metadata } from "next";
import { GalleryLightbox } from "@/components/interactive";
import { PageHero, CTASection } from "@/components/ui";
import { images } from "@/data/site";
export const metadata: Metadata={title:"Adventure Gallery",description:"Explore the visual story of adventure, nature, food and jungle stays at Ban Jungle Adventure."};
export default function Gallery(){return <main id="main"><PageHero eyebrow="Gallery" title="Moments made outside." text="A CMS-ready gallery for real Ban Jungle Adventure photography. Current images are temporary visual placeholders." image={images.group}/><section className="section-pad bg-cream"><div className="container-site"><GalleryLightbox/></div></section><CTASection/></main>}
