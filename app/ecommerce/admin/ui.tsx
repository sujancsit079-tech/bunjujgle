import type { OrderStatus } from "@/data/ecommerce";

const styles: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Processing: "bg-sky-100 text-sky-800",
  Shipped: "bg-indigo-100 text-indigo-800",
  Delivered: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-rose-100 text-rose-800",
};

export function StatusPill({ status }: { status: OrderStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>;
}
