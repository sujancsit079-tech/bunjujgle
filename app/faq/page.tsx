import type { Metadata } from "next";
import { FAQAccordion } from "@/components/interactive";
import { CTASection, PageHero } from "@/components/ui";
import { faqs, images } from "@/data/site";
export const metadata: Metadata={title:"Frequently Asked Questions",description:"Answers about activities, booking, night stays, food and visiting Ban Jungle Adventure."};
export default function FAQ(){const schema={"@context":"https://schema.org","@type":"FAQPage",mainEntity:faqs.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))};return <main id="main"><PageHero eyebrow="FAQ" title="Questions before the adventure?" text="Start here, then contact the team for current prices, requirements, hours and availability." image={images.nature}/><section className="section-pad bg-cream"><div className="container-site max-w-4xl"><FAQAccordion/></div></section><CTASection/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/></main>}
