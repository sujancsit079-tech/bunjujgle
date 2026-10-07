"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, LayoutGrid, LogOut, MapPin, Package } from "lucide-react";
import { useStore } from "./store";
import { PageHeader } from "./ui";

const tabs = [["Overview", "/ecommerce/account", LayoutGrid], ["Orders", "/ecommerce/account/orders", Package], ["Addresses", "/ecommerce/account/addresses", MapPin], ["Wishlist", "/ecommerce/wishlist", Heart]] as const;

/** Wraps signed-in account pages; redirects to login when there's no session. */
export function AccountShell({ title, children }: { title: string; children: React.ReactNode }) {
  const { user, ready, logout, t } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => { if (ready && !user) router.replace(`/ecommerce/account/login?next=${encodeURIComponent(pathname)}`); }, [ready, user, router, pathname]);
  if (!ready || !user) return <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8"><div className="shimmer h-64 rounded-3xl" /></div>;
  return <>
    <PageHeader title={title} text={`Signed in as ${user.email}`} crumbs={[[t("home"), "/ecommerce"], [t("myAccount"), "/ecommerce/account"], [title]]} />
    <div className="mx-auto mt-8 grid max-w-7xl gap-8 px-4 lg:grid-cols-[230px_1fr] lg:px-8">
      <nav className="scrollbar-none flex gap-1 overflow-x-auto lg:flex-col lg:self-start">
        {tabs.map(([label, href, Icon]) => { const active = pathname === href; return <Link key={href} href={href} className={`relative flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active ? "text-l-bg" : "text-l-fg/65 hover:text-l-fg"}`}>
          {active && <motion.span layoutId="acct-tab" className="absolute inset-0 rounded-2xl bg-l-fg" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
          <Icon size={17} className="relative" /><span className="relative">{label}</span>
        </Link>; })}
        <button onClick={() => { logout(); router.push("/ecommerce"); }} className="flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-l-accent transition hover:bg-l-accent/10"><LogOut size={17} />{t("signOut")}</button>
      </nav>
      <div>{children}</div>
    </div>
  </>;
}
