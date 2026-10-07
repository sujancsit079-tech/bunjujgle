import { notFound } from "next/navigation";
import { getProduct, products } from "@/data/ecommerce";
import { ProductDetail } from "./product-detail";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  return { title: p?.name ?? "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  return <ProductDetail slug={product.slug} />;
}
