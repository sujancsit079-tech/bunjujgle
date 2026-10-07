"use client";

import { motion } from "framer-motion";

/** Re-mounts on every navigation inside /ecommerce for a soft page transition. */
export default function EcommerceTemplate({ children }: { children: React.ReactNode }) {
  return <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, ease: [.2, .7, .2, 1] }}>{children}</motion.div>;
}
