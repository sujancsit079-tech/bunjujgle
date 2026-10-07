"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { banners } from "@/data/ecommerce";
import { useStore } from "./store";
import { btnPrimary, input } from "./ui";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  return <Suspense><Inner mode={mode} /></Suspense>;
}

function Inner({ mode }: { mode: "login" | "register" }) {
  const { login, register, t, settings } = useStore();
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/ecommerce/account";
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isLogin = mode === "login";
  const strength = Math.min(4, [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(form.password)).length);

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    if (!isLogin && form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (!isLogin && form.password !== form.confirm) return setError("Passwords don't match.");
    setBusy(true);
    setTimeout(() => {
      const err = isLogin ? login(form.email, form.password) : register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      setBusy(false);
      if (err) setError(err); else router.push(next);
    }, 600);
  };

  return <div className="mx-auto grid max-w-6xl gap-0 overflow-hidden px-4 py-10 lg:grid-cols-2 lg:px-8">
    <div className="relative hidden overflow-hidden rounded-l-[2rem] lg:block">
      <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.4 }} src={banners.hero[isLogin ? 0 : 1].image} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
      <div className="absolute bottom-10 left-10 right-10 text-white"><p className="font-serif text-4xl font-bold">{isLogin ? "Welcome back." : `Join ${settings.storeName}.`}</p><p className="mt-2 text-white/80">Track orders, save addresses and keep your wishlist in sync.</p></div>
    </div>
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-[2rem] bg-l-surface p-8 md:p-12 lg:rounded-l-none">
      <h1 className="font-serif text-4xl font-bold">{isLogin ? t("signIn") : t("createAccount")}</h1>
      <p className="mt-2 text-sm text-l-fg/60">{isLogin ? <>New here? <Link href={`/ecommerce/account/register?next=${encodeURIComponent(next)}`} className="font-semibold text-l-accent hover:underline">{t("createAccount")}</Link></> : <>Already have an account? <Link href={`/ecommerce/account/login?next=${encodeURIComponent(next)}`} className="font-semibold text-l-accent hover:underline">{t("signIn")}</Link></>}</p>
      <form onSubmit={submit} className="mt-8 grid gap-4">
        {!isLogin && <L label="Full name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" className={input} /></L>}
        <L label="Email"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" className={input} /></L>
        <L label="Password"><div className="relative"><input required type={show ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete={isLogin ? "current-password" : "new-password"} className={`${input} pr-12`} />
          <button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-l-fg/45">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></L>
        {!isLogin && <>
          <div className="flex gap-1">{[0, 1, 2, 3].map((i) => <motion.span key={i} className="h-1 flex-1 rounded-full" animate={{ backgroundColor: i < strength ? ["#c8553d", "#e8a126", "#7aa35a", "#2f6646"][strength - 1] : "rgba(127,127,127,.2)" }} />)}</div>
          <L label="Confirm password"><input required type={show ? "text" : "password"} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} autoComplete="new-password" className={input} /></L>
        </>}
        <AnimatePresence>{error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0, x: [0, -6, 6, 0] }} exit={{ opacity: 0 }} className="rounded-xl bg-l-accent/10 px-4 py-3 text-sm font-semibold text-l-accent">{error}</motion.p>}</AnimatePresence>
        <button disabled={busy} className={`${btnPrimary} mt-2`}>{busy ? "Please wait…" : isLogin ? t("signIn") : t("createAccount")}</button>
        <p className="text-center text-xs text-l-fg/45">Demo only — accounts are stored in this browser&apos;s localStorage.</p>
      </form>
    </motion.div>
  </div>;
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5 text-sm font-semibold">{label}{children}</label>;
}
