import type { MetadataRoute } from "next";
import { activities, business, packages } from "@/data/site";
export default function sitemap():MetadataRoute.Sitemap{const paths=["","/about-us","/attractions","/stay","/dining","/packages","/events","/gallery","/blog","/plan-your-visit","/safety","/faq","/contact","/reviews","/privacy-policy","/terms",...activities.map(a=>`/attractions/${a.slug}`),...packages.map(p=>`/packages/${p.slug}`)];return paths.map(path=>({url:`${business.siteUrl}${path}`,lastModified:new Date(),changeFrequency:path===""?"weekly":"monthly",priority:path===""?1:.7}))}
