import type { Metadata } from "next";
import { StoreProvider } from "@/components/ecommerce/store";
import { CartDrawer, SearchOverlay, StoreFooter, StoreHeader, Toasts } from "@/components/ecommerce/shell";

export const metadata: Metadata = {
  title: { default: "Lumen Wear — E-commerce Template", template: "%s | Lumen Wear" },
  description: "A demo Next.js clothing storefront with cart, wishlist, checkout and admin dashboard.",
};

export default function EcommerceLayout({ children }: { children: React.ReactNode }) {
  return <StoreProvider>
    <div className="min-h-screen bg-[#f7f4ef] text-[#111]">
      <StoreHeader />
      <main id="main">{children}</main>
      <StoreFooter />
      <CartDrawer />
      <SearchOverlay />
      <Toasts />
    </div>
  </StoreProvider>;
}
