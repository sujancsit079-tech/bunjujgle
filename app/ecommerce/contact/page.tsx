"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { PageHeader, Reveal, btnPrimary, input } from "@/components/ecommerce/ui";
import { useStore } from "@/components/ecommerce/store";

const topics = ["Order question", "Returns & exchanges", "Sizing advice", "Wholesale", "Other"];

export default function ContactPage() {
  const { t, user } = useStore();
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", topic: topics[0], order: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (form.name.trim().length < 2) err.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Enter a valid email address";
    if (form.message.trim().length < 10) err.message = "Message should be at least 10 characters";
    setErrors(err);
    if (Object.keys(err).length) return;
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1000);
  };

  return <>
    <PageHeader title={t("contact")} text="Questions about an order, sizing or anything else? We usually reply within a few hours." crumbs={[[t("home"), "/ecommerce"], [t("contact")]]} />
    <div className="mx-auto mt-10 grid max-w-7xl gap-8 px-4 lg:grid-cols-[1fr_380px] lg:px-8">
      <div className="rounded-3xl bg-l-surface p-6 md:p-10">
        <AnimatePresence mode="wait">
          {sent ? <motion.div key="ok" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="grid place-items-center py-16 text-center">
            <motion.span initial={{ rotate: -30, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14 }} className="grid size-20 place-items-center rounded-full bg-l-success text-white"><Send size={32} /></motion.span>
            <h2 className="mt-6 font-serif text-4xl font-bold">Message sent</h2>
            <p className="mt-3 max-w-sm text-l-fg/60">Thanks {form.name.split(" ")[0]} — we&apos;ll reply to <b className="text-l-fg">{form.email}</b> shortly.</p>
            <button onClick={() => { setSent(false); setForm({ ...form, message: "", order: "" }); }} className={`${btnPrimary} mt-6`}>Send another</button>
          </motion.div> : <motion.form key="f" exit={{ opacity: 0 }} onSubmit={submit} noValidate className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <F label="Name" error={errors.name}><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} /></F>
              <F label="Email" error={errors.email}><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} /></F>
            </div>
            <F label="Topic"><div className="flex flex-wrap gap-2">{topics.map((x) => <button type="button" key={x} onClick={() => setForm({ ...form, topic: x })} className={`relative rounded-full px-4 py-2 text-sm font-semibold transition ${form.topic === x ? "text-l-bg" : "border border-l-fg/15"}`}>
              {form.topic === x && <motion.span layoutId="topic" className="absolute inset-0 rounded-full bg-l-fg" />}<span className="relative">{x}</span></button>)}</div></F>
            {form.topic === "Order question" && <F label="Order number (optional)"><input placeholder="LW-1046" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className={input} /></F>}
            <F label="Message" error={errors.message}><textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={input} /></F>
            <button disabled={sending} className={`${btnPrimary} justify-self-start`}>{sending ? "Sending…" : <>Send message <Send size={15} /></>}</button>
          </motion.form>}
        </AnimatePresence>
      </div>
      <div className="grid gap-4 self-start">
        {[[Mail, "Email", "hello@lumenwear.example", "Replies within 4 hours"], [Phone, "Phone", "+977 1 555 0199", "Sun–Fri, 10am–6pm"], [MessageCircle, "Live chat", "Available on weekdays", "Average wait: 2 minutes"], [MapPin, "Studio", "Jhamsikhel Road, Lalitpur", "Nepal 44600"], [Clock, "Studio hours", "10am – 7pm daily", "Closed Tuesdays"]].map(([Icon, title, a, b], i) => { const I = Icon as typeof Mail; return <Reveal key={title as string} delay={i * .06} y={16} className="flex gap-4 rounded-3xl bg-l-surface p-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-l-bg"><I size={19} /></span>
          <div><p className="text-xs font-bold uppercase tracking-wider text-l-fg/45">{title as string}</p><p className="mt-1 font-semibold">{a as string}</p><p className="text-sm text-l-fg/55">{b as string}</p></div>
        </Reveal>; })}
      </div>
    </div>
  </>;
}

function F({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="grid gap-1.5 text-sm font-semibold"><span>{label}</span>{children}
    <AnimatePresence>{error && <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-l-accent">{error}</motion.span>}</AnimatePresence></div>;
}
