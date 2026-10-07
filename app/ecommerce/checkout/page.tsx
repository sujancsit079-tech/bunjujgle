"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Banknote, Check, CreditCard, Lock, MapPin, Package, Plus, Truck, Wallet } from "lucide-react";
import { discountCodes, formatPrice, type Address, type Order } from "@/data/ecommerce";
import { useStore } from "@/components/ecommerce/store";
import { btnOutline, btnPrimary, input } from "@/components/ecommerce/ui";

const steps = ["Information", "Shipping", "Payment"];
const emptyAddr = (name = ""): Address => ({ id: `a-${Date.now()}`, label: "Home", name, line1: "", city: "", postal: "", country: "Nepal", phone: "" });

export default function CheckoutPage() {
  const { lines, subtotal, placeOrder, settings, user, addresses, saveAddress, ready, t } = useStore();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [addr, setAddr] = useState<Address>(emptyAddr());
  const [selected, setSelected] = useState<string | "new">("new");
  const [saveIt, setSaveIt] = useState(true);
  const [method, setMethod] = useState<Order["shippingMethod"]>("standard");
  const [payment, setPayment] = useState<Order["payment"]>("card");
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState<Order | null>(null);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => { if (!ready) return; setCode(sessionStorage.getItem("lumen-code")); if (user) { setEmail(user.email); setAddr((a) => ({ ...a, name: a.name || user.name })); } if (addresses[0]) setSelected(addresses[0].id); }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const discount = code && discountCodes[code] ? Math.round(subtotal * discountCodes[code]) : 0;
  const shipping = method === "express" ? 18 : subtotal >= settings.freeShippingOver ? 0 : 9;
  const total = subtotal - discount + shipping;
  const address = selected === "new" ? addr : addresses.find((a) => a.id === selected) ?? addr;

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) { setStep(step + 1); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setPlacing(true);
    setTimeout(() => {
      if (selected === "new" && saveIt && user) saveAddress(addr);
      const o = placeOrder({
        customer: address.name, email, subtotal, shipping, discount, total, payment, shippingMethod: method, address,
        items: lines.map((l) => ({ productId: l.product.id, name: l.product.name, image: l.product.images[0], price: l.product.price, qty: l.qty, color: l.color, size: l.size })),
      });
      sessionStorage.removeItem("lumen-code");
      setDone(o); setPlacing(false); window.scrollTo({ top: 0 });
    }, 1200);
  };

  if (done) return <div className="mx-auto grid max-w-xl place-items-center px-4 py-24 text-center">
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} className="grid size-24 place-items-center rounded-full bg-l-success text-white"><motion.span initial={{ pathLength: 0, scale: .5 }} animate={{ scale: 1 }} transition={{ delay: .25 }}><Check size={44} /></motion.span></motion.div>
    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }} className="mt-8 font-serif text-5xl font-bold">Thank you!</motion.h1>
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5 }} className="mt-4 text-l-fg/60">Order <b className="text-l-fg">{done.id}</b> is confirmed. We&apos;ve sent the details to <b className="text-l-fg">{done.email}</b>.</motion.p>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .6 }} className="mt-8 w-full rounded-3xl bg-l-surface p-5 text-left text-sm">
      {done.items.map((it) => <div key={it.productId + it.size} className="flex items-center gap-3 py-2"><img src={it.image} alt="" className="size-12 rounded-lg object-cover" /><span className="flex-1">{it.qty} × {it.name}</span><b>{formatPrice(it.price * it.qty)}</b></div>)}
      <div className="mt-2 flex justify-between border-t border-l-fg/10 pt-3 font-bold"><span>Total paid</span><span>{formatPrice(done.total)}</span></div>
    </motion.div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7 }} className="mt-8 flex flex-wrap justify-center gap-3">
      <Link href={`/ecommerce/track-order?id=${done.id}`} className={btnPrimary}><Truck size={16} /> {t("trackOrder")}</Link>
      <Link href="/ecommerce/shop" className={btnOutline}>Keep shopping</Link>
    </motion.div>
  </div>;

  if (ready && !lines.length) return <div className="mx-auto max-w-xl px-4 py-24 text-center"><h1 className="font-serif text-4xl font-bold">Nothing to check out</h1><p className="mt-3 text-l-fg/60">Add a few items to your bag first.</p><Link href="/ecommerce/shop" className={`${btnPrimary} mt-6`}>Go to shop</Link></div>;

  return <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
    <h1 className="font-serif text-5xl font-bold tracking-tight">{t("checkout")}</h1>
    {!user && <p className="mt-3 text-sm text-l-fg/60">Have an account? <Link href="/ecommerce/account/login?next=/ecommerce/checkout" className="font-semibold text-l-accent hover:underline">{t("signIn")}</Link> for saved addresses and order history.</p>}
    <ol className="mt-8 flex items-center gap-3">
      {steps.map((s, i) => <li key={s} className="flex items-center gap-3">
        <button type="button" disabled={i > step} onClick={() => setStep(i)} className="flex items-center gap-2 text-sm font-semibold">
          <span className={`grid size-8 place-items-center rounded-full border transition-colors duration-300 ${i <= step ? "border-l-fg bg-l-fg text-l-bg" : "border-l-fg/15 bg-l-surface"}`}>{i < step ? <Check size={14} /> : i + 1}</span>
          <span className={`hidden sm:inline ${i <= step ? "" : "text-l-fg/40"}`}>{s}</span>
        </button>
        {i < steps.length - 1 && <span className="relative h-0.5 w-10 overflow-hidden bg-l-fg/10 sm:w-20"><motion.span className="absolute inset-y-0 left-0 bg-l-fg" animate={{ width: i < step ? "100%" : "0%" }} /></span>}
      </li>)}
    </ol>
    <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
      <form onSubmit={next} className="rounded-3xl bg-l-surface p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: .3 }} className="grid gap-4">
            {step === 0 && <>
              <h2 className="text-lg font-bold">Contact</h2>
              <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
              <h2 className="mt-4 text-lg font-bold">Delivery address</h2>
              {addresses.length > 0 && <div className="grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => <AddrCard key={a.id} a={a} active={selected === a.id} onClick={() => setSelected(a.id)} />)}
                <button type="button" onClick={() => setSelected("new")} className={`flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 text-sm font-semibold transition ${selected === "new" ? "border-l-fg" : "border-l-fg/15 text-l-fg/60"}`}><Plus size={16} /> New address</button>
              </div>}
              <AnimatePresence initial={false}>{selected === "new" && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid gap-4 overflow-hidden p-0.5">
                <div className="grid gap-4 sm:grid-cols-2"><Field label="Full name" value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} /><Field label="Phone" type="tel" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} /></div>
                <Field label="Address" placeholder="Street and house number" value={addr.line1} onChange={(e) => setAddr({ ...addr, line1: e.target.value })} />
                <div className="grid gap-4 sm:grid-cols-3"><Field label="City" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} /><Field label="Postal code" value={addr.postal} onChange={(e) => setAddr({ ...addr, postal: e.target.value })} /><Field label="Country" value={addr.country} onChange={(e) => setAddr({ ...addr, country: e.target.value })} /></div>
                {user && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={saveIt} onChange={() => setSaveIt(!saveIt)} className="size-4 accent-[rgb(var(--l-accent))]" /> Save this address to my account</label>}
              </motion.div>}</AnimatePresence>
            </>}
            {step === 1 && <>
              <h2 className="text-lg font-bold">Shipping method</h2>
              {([["standard", "Standard", "3–5 business days", subtotal >= settings.freeShippingOver ? "Free" : formatPrice(9), Truck], ["express", "Express", "1–2 business days", formatPrice(18), Package]] as const).map(([key, title, d, price, Icon]) =>
                <Choice key={key} active={method === key} onClick={() => setMethod(key)} icon={<Icon size={20} />} title={title} sub={d} right={price} />)}
              <div className="mt-2 flex items-start gap-3 rounded-2xl bg-l-bg p-4 text-sm"><MapPin size={18} className="mt-0.5 shrink-0" /><div><p className="font-semibold">Delivering to {address.name}</p><p className="text-l-fg/60">{address.line1}, {address.city} {address.postal}, {address.country}</p></div><button type="button" onClick={() => setStep(0)} className="ml-auto text-xs font-semibold text-l-accent">Change</button></div>
            </>}
            {step === 2 && <>
              <h2 className="text-lg font-bold">Payment method</h2>
              <Choice active={payment === "card"} onClick={() => setPayment("card")} icon={<CreditCard size={20} />} title="Credit / debit card" sub="Visa, Mastercard, Amex" />
              <AnimatePresence initial={false}>{payment === "card" && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid gap-4 overflow-hidden p-0.5">
                <Field label="Card number" placeholder="4242 4242 4242 4242" inputMode="numeric" pattern="[0-9 ]{12,19}" />
                <div className="grid gap-4 sm:grid-cols-2"><Field label="Expiry" placeholder="MM / YY" /><Field label="CVC" placeholder="123" inputMode="numeric" /></div>
              </motion.div>}</AnimatePresence>
              <Choice active={payment === "wallet"} onClick={() => setPayment("wallet")} icon={<Wallet size={20} />} title="Digital wallet" sub="eSewa, Khalti, Apple Pay (demo)" />
              <Choice active={payment === "cod"} onClick={() => setPayment("cod")} icon={<Banknote size={20} />} title="Cash on delivery" sub="Pay when your order arrives" />
              <p className="flex items-center gap-2 text-xs text-l-fg/50"><Lock size={13} /> Demo checkout — no real payment is processed and data stays in your browser.</p>
            </>}
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex justify-between">
          {step > 0 ? <button type="button" onClick={() => setStep(step - 1)} className={btnOutline}>Back</button> : <Link href="/ecommerce/cart" className={btnOutline}>Back to bag</Link>}
          <motion.button whileTap={{ scale: .97 }} disabled={placing} className={btnPrimary}>
            {placing ? <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: .8, ease: "linear" }} className="block size-4 rounded-full border-2 border-current border-t-transparent" /> Processing…</> : step < 2 ? "Continue" : `${payment === "cod" ? "Place order" : "Pay"} ${formatPrice(total)}`}
          </motion.button>
        </div>
      </form>
      <aside className="self-start rounded-3xl bg-l-surface p-6 lg:sticky lg:top-28">
        <h2 className="text-lg font-bold">Order summary</h2>
        <ul className="mt-5 grid gap-4">{lines.map((l) => <li key={l.key} className="flex items-center gap-3">
          <div className="relative"><img src={l.product.images[0]} alt="" className="size-16 rounded-xl object-cover" /><span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-l-fg text-[10px] font-bold text-l-bg">{l.qty}</span></div>
          <div className="flex-1 text-sm"><p className="font-semibold">{l.product.name}</p><p className="text-xs text-l-fg/50">{l.color} · {l.size}</p></div><b className="text-sm">{formatPrice(l.qty * l.product.price)}</b>
        </li>)}</ul>
        <dl className="mt-6 grid gap-2 border-t border-l-fg/10 pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-l-fg/60">{t("subtotal")}</dt><dd>{formatPrice(subtotal)}</dd></div>
          {discount > 0 && <div className="flex justify-between"><dt className="text-l-fg/60">Discount ({code})</dt><dd>-{formatPrice(discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-l-fg/60">Shipping</dt><dd>{shipping ? formatPrice(shipping) : "Free"}</dd></div>
          <div className="mt-2 flex justify-between text-base font-bold"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
        </dl>
      </aside>
    </div>
  </div>;
}

function AddrCard({ a, active, onClick }: { a: Address; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`relative rounded-2xl border-2 p-4 text-left text-sm transition ${active ? "border-l-fg" : "border-l-fg/10 hover:border-l-fg/30"}`}>
    {active && <motion.span layoutId="addr-check" className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-l-fg text-l-bg"><Check size={12} /></motion.span>}
    <p className="text-xs font-bold uppercase tracking-wider text-l-accent">{a.label}</p><p className="mt-1 font-semibold">{a.name}</p><p className="text-l-fg/60">{a.line1}, {a.city}</p><p className="text-l-fg/60">{a.country} · {a.phone}</p>
  </button>;
}

function Choice({ active, onClick, icon, title, sub, right }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; sub: string; right?: string }) {
  return <label className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition ${active ? "border-l-fg" : "border-l-fg/10 hover:border-l-fg/30"}`}>
    <input type="radio" checked={active} onChange={onClick} className="accent-[rgb(var(--l-fg))]" />{icon}
    <div className="flex-1"><p className="font-semibold">{title}</p><p className="text-xs text-l-fg/55">{sub}</p></div>{right && <b>{right}</b>}
  </label>;
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <label className="grid gap-1.5 text-sm font-semibold">{label}<input required {...rest} className={`${input} font-normal`} /></label>;
}
