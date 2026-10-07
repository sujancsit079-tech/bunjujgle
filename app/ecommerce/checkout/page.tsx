"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CreditCard, Lock, Package, Truck } from "lucide-react";
import { formatPrice, store } from "@/data/ecommerce";
import { useStore } from "@/components/ecommerce/store";

const steps = ["Information", "Shipping", "Payment"];

export default function CheckoutPage() {
  const { lines, subtotal, clearCart } = useStore();
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<"standard" | "express">("standard");
  const [orderId, setOrderId] = useState<string | null>(null);
  const shipping = method === "express" ? 18 : subtotal >= store.freeShippingOver ? 0 : 9;
  const total = subtotal + shipping;

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) return setStep(step + 1);
    setOrderId(`#LW-${Math.floor(1049 + Math.random() * 900)}`);
    clearCart();
  };

  if (orderId) return <div className="mx-auto grid max-w-xl place-items-center px-4 py-24 text-center">
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} className="grid size-24 place-items-center rounded-full bg-[#2f6646] text-white"><Check size={44} /></motion.div>
    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }} className="mt-8 font-serif text-5xl font-bold">Thank you!</motion.h1>
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5 }} className="mt-4 text-black/60">Your order <b className="text-black">{orderId}</b> has been placed. A confirmation email is on its way.</motion.p>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7 }} className="mt-8 flex gap-3"><Link href="/ecommerce/shop" className="rounded-full bg-black px-7 py-3 text-sm font-semibold text-white">Keep shopping</Link><Link href="/ecommerce/admin/orders" className="rounded-full border border-black/15 px-7 py-3 text-sm font-semibold">View orders</Link></motion.div>
  </div>;

  if (!lines.length) return <div className="mx-auto max-w-xl px-4 py-24 text-center"><h1 className="font-serif text-4xl font-bold">Nothing to check out</h1><p className="mt-3 text-black/60">Add a few items to your bag first.</p><Link href="/ecommerce/shop" className="mt-6 inline-block rounded-full bg-black px-7 py-3 text-sm font-semibold text-white">Go to shop</Link></div>;

  return <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
    <h1 className="font-serif text-5xl font-bold tracking-tight">Checkout</h1>
    <ol className="mt-8 flex items-center gap-3">
      {steps.map((s, i) => <li key={s} className="flex items-center gap-3">
        <button type="button" disabled={i > step} onClick={() => setStep(i)} className="flex items-center gap-2 text-sm font-semibold">
          <motion.span animate={{ backgroundColor: i <= step ? "#111" : "#ffffff", color: i <= step ? "#fff" : "#111" }} className="grid size-8 place-items-center rounded-full border border-black/15">{i < step ? <Check size={14} /> : i + 1}</motion.span>
          <span className={i <= step ? "" : "text-black/40"}>{s}</span>
        </button>
        {i < steps.length - 1 && <span className="relative h-0.5 w-10 overflow-hidden bg-black/10 sm:w-20"><motion.span className="absolute inset-y-0 left-0 bg-black" animate={{ width: i < step ? "100%" : "0%" }} /></span>}
      </li>)}
    </ol>
    <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
      <form onSubmit={next} className="rounded-3xl bg-white p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: .3 }} className="grid gap-4">
            {step === 0 && <>
              <h2 className="text-lg font-bold">Contact & address</h2>
              <Field label="Email" type="email" placeholder="you@email.com" />
              <div className="grid gap-4 sm:grid-cols-2"><Field label="First name" /><Field label="Last name" /></div>
              <Field label="Address" placeholder="Street and house number" />
              <div className="grid gap-4 sm:grid-cols-3"><Field label="City" /><Field label="Postal code" /><Field label="Country" defaultValue="Nepal" /></div>
              <Field label="Phone" type="tel" />
            </>}
            {step === 1 && <>
              <h2 className="text-lg font-bold">Shipping method</h2>
              {([["standard", "Standard", "3–5 business days", subtotal >= store.freeShippingOver ? "Free" : formatPrice(9), Truck], ["express", "Express", "1–2 business days", formatPrice(18), Package]] as const).map(([k, t, d, price, Icon]) =>
                <label key={k} className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition ${method === k ? "border-black" : "border-black/10"}`}>
                  <input type="radio" name="ship" checked={method === k} onChange={() => setMethod(k)} className="accent-black" /><Icon size={20} />
                  <div className="flex-1"><p className="font-semibold">{t}</p><p className="text-xs text-black/55">{d}</p></div><b>{price}</b>
                </label>)}
            </>}
            {step === 2 && <>
              <h2 className="flex items-center gap-2 text-lg font-bold"><CreditCard size={20} /> Payment</h2>
              <Field label="Card number" placeholder="4242 4242 4242 4242" inputMode="numeric" />
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Expiry" placeholder="MM / YY" /><Field label="CVC" placeholder="123" /></div>
              <Field label="Name on card" />
              <p className="flex items-center gap-2 text-xs text-black/50"><Lock size={13} /> Demo checkout — no real payment is processed.</p>
            </>}
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex justify-between">
          {step > 0 ? <button type="button" onClick={() => setStep(step - 1)} className="rounded-full border border-black/15 px-6 py-3 text-sm font-semibold">Back</button> : <Link href="/ecommerce/cart" className="rounded-full border border-black/15 px-6 py-3 text-sm font-semibold">Back to bag</Link>}
          <motion.button whileTap={{ scale: .97 }} className="rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#c8553d]">{step < 2 ? "Continue" : `Pay ${formatPrice(total)}`}</motion.button>
        </div>
      </form>
      <aside className="self-start rounded-3xl bg-white p-6 lg:sticky lg:top-28">
        <h2 className="text-lg font-bold">Order summary</h2>
        <ul className="mt-5 grid gap-4">{lines.map((l) => <li key={l.key} className="flex items-center gap-3">
          <div className="relative"><img src={l.product.images[0]} alt="" className="size-16 rounded-xl object-cover" /><span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-black text-[10px] font-bold text-white">{l.qty}</span></div>
          <div className="flex-1 text-sm"><p className="font-semibold">{l.product.name}</p><p className="text-xs text-black/50">{l.color} · {l.size}</p></div><b className="text-sm">{formatPrice(l.qty * l.product.price)}</b>
        </li>)}</ul>
        <dl className="mt-6 grid gap-2 border-t border-black/10 pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-black/60">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-black/60">Shipping</dt><dd>{shipping ? formatPrice(shipping) : "Free"}</dd></div>
          <div className="mt-2 flex justify-between text-base font-bold"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
        </dl>
      </aside>
    </div>
  </div>;
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <label className="grid gap-1.5 text-sm font-semibold">{label}<input required {...rest} className="rounded-xl border border-black/15 bg-[#f7f4ef] px-4 py-3 font-normal outline-none transition focus:border-black focus:bg-white" /></label>;
}
