import { seedProducts } from "@/data/ecommerce";
import { ProductDetail } from "./product-detail";

export function generateStaticParams() {
  return seedProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = seedProducts.find((x) => x.slug === slug);
  return { title: p?.name ?? "Product", description: p?.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ProductDetail slug={(await params).slug} />;
}
