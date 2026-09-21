import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Footer, Header, MobileActions } from "@/components/layout";
import { business } from "@/data/site";
import { MotionObserver } from "@/components/motion";

const serif = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-serif", weight: ["600", "700"] });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: { default: "Ban Jungle Adventure | Adventure Park Kathmandu", template: "%s | Ban Jungle Adventure" },
  description: "Outdoor adventure, jungle experiences, dining and night stays in Panchmane, Tarakeshwar, Kathmandu, Nepal.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_NP", siteName: business.name, title: business.name, description: "Adventure meets nature in Kathmandu." },
  twitter: { card: "summary_large_image" },
};

const localBusiness = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "TouristAttraction"],
  name: business.name,
  url: business.siteUrl,
  telephone: business.phone,
  email: business.email,
  address: { "@type": "PostalAddress", streetAddress: "Panchmane, Tarakeshwar-3", addressLocality: "Kathmandu", addressCountry: "NP" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${serif.variable} ${manrope.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        <a href="#main" className="fixed left-4 top-3 z-[100] -translate-y-20 bg-gold px-4 py-3 font-bold focus:translate-y-0">Skip to content</a>
        <Header />
        {children}
        <Footer />
        <MobileActions />
        <MotionObserver />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      </body>
    </html>
  );
}
