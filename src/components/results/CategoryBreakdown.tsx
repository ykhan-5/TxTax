"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CategorySpending } from "@/lib/types/spending";
import { formatCurrency, formatPercentage } from "@/lib/utils/format";
import { CATEGORY_EMOJIS } from "@/lib/utils/constants";

interface CategoryBreakdownProps {
  categories: CategorySpending[];
}

function CategoryItem({ category }: { category: CategorySpending }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-xl sm:text-2xl shrink-0">{CATEGORY_EMOJIS[category.category]}</span>
          <div className="text-left min-w-0">
            <span className="font-heading font-semibold text-charcoal text-sm sm:text-base">
              {category.label}
            </span>
            <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-charcoal/40">
              {formatPercentage(category.percentage)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
          <span className="font-mono font-bold text-texas-blue text-sm sm:text-base">
            {formatCurrency(category.perCapita)}
          </span>
          <svg
            className={`w-4 h-4 sm:w-5 sm:h-5 text-charcoal/30 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 space-y-3">
              {category.subcategories.map((sub) => (
                <div key={sub.name}>
                  {/* Mobile: stack name above bar; Desktop: inline */}
                  <div className="flex items-center justify-between mb-1 sm:mb-0">
                    <span className="text-xs sm:text-sm text-charcoal/70 truncate">{sub.name}</span>
                    <span className="font-mono text-xs sm:text-sm text-charcoal/60 ml-2 shrink-0 sm:hidden">
                      {formatCurrency(sub.perCapita)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(sub.perCapita / category.perCapita) * 100}%`,
                          backgroundColor: category.color,
                          opacity: 0.6,
                        }}
                      />
                    </div>
                    <span className="font-mono text-sm text-charcoal/60 shrink-0 hidden sm:inline">
                      {formatCurrency(sub.perCapita)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const sorted = [...categories].sort((a, b) => b.perCapita - a.perCapita);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="py-8"
    >
      <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">
        Detailed Breakdown
      </h2>
      <div className="space-y-3">
        {sorted.map((cat) => (
          <CategoryItem key={cat.category} category={cat} />
        ))}
      </div>
    </motion.section>
  );
}
