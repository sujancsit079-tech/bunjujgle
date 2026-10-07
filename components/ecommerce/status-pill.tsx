import type { OrderStatus } from "@/data/ecommerce";

const styles: Record<OrderStatus, string> = {
  Pending: "bg-amber-500/15 text-amber-600",
  Processing: "bg-sky-500/15 text-sky-600",
  Shipped: "bg-indigo-500/15 text-indigo-500",
  Delivered: "bg-emerald-500/15 text-emerald-600",
  Cancelled: "bg-rose-500/15 text-rose-600",
};

export function StatusPill({ status }: { status: OrderStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>;
}
