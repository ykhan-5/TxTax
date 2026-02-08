"use client";

import { motion } from "framer-motion";
import type { WeirdItem } from "@/lib/types/spending";
import { formatCurrency } from "@/lib/utils/format";

interface WeirdItemsProps {
  items: WeirdItem[];
}

export function WeirdItems({ items }: WeirdItemsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="py-8"
    >
      <h2 className="font-heading text-2xl font-bold text-charcoal mb-2">
        Your contribution paid for...
      </h2>
      <p className="text-sm text-charcoal/50 mb-6">
        Here&apos;s what your tax dollars funded, in oddly specific terms
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm
              hover:shadow-md hover:border-texas-blue/20 transition-all"
          >
            <div className="text-3xl mb-2">{item.emoji}</div>
            <p className="font-heading font-semibold text-charcoal leading-snug">
              {item.description}
            </p>
            <p className="text-sm text-charcoal/40 mt-2">
              {formatCurrency(item.dollarAmount)} &middot; {item.calculation}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
