import type { Metadata } from "next";
import { StoreProvider } from "@/components/ecommerce/store";
import { CartDrawer, CommandPalette, QuickView, StoreFooter, StoreFrame, StoreHeader, Toasts } from "@/components/ecommerce/shell";

export const metadata: Metadata = {
  title: { default: "Lumen Wear — E-commerce Template", template: "%s | Lumen Wear" },
  description: "A demo Next.js clothing storefront with cart, wishlist, accounts, order tracking, checkout and an admin dashboard.",
};

export default function EcommerceLayout({ children }: { children: React.ReactNode }) {
  return <StoreProvider>
    <StoreFrame>
      <StoreHeader />
      <main id="main">{children}</main>
      <StoreFooter />
      <CartDrawer />
      <CommandPalette />
      <QuickView />
      <Toasts />
    </StoreFrame>
  </StoreProvider>;
}
