"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import type { CategorySpending } from "@/lib/types/spending";
import { formatCurrency, formatPercentage } from "@/lib/utils/format";
import { CATEGORY_EMOJIS } from "@/lib/utils/constants";

interface SpendingBarChartProps {
  categories: CategorySpending[];
  onCategoryClick?: (category: string) => void;
}

interface TooltipPayloadEntry {
  payload: CategorySpending;
}

const SHORT_LABELS: Record<string, string> = {
  Education: "Education",
  "Health & Human Services": "Health",
  Transportation: "Transport",
  "Public Safety": "Safety",
  "Other Government": "Other",
};

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white shadow-lg rounded-xl px-4 py-3 border border-gray-100">
      <p className="font-heading font-semibold text-charcoal">
        {CATEGORY_EMOJIS[data.category]} {data.label}
      </p>
      <p className="text-lg font-mono font-bold text-texas-blue">
        {formatCurrency(data.perCapita)}
      </p>
      <p className="text-sm text-charcoal/50">
        {formatPercentage(data.percentage)} of your taxes
      </p>
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export function SpendingBarChart({
  categories,
  onCategoryClick,
}: SpendingBarChartProps) {
  const isMobile = useIsMobile();
  const sortedCategories = [...categories].sort(
    (a, b) => b.perCapita - a.perCapita
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="py-8"
    >
      <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">
        The Big Picture
      </h2>
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedCategories}
            layout="vertical"
            margin={{ top: 0, right: 10, bottom: 0, left: 0 }}
          >
            <XAxis
              type="number"
              tickFormatter={(v) => `$${v}`}
              tick={{ fontSize: isMobile ? 10 : 12, fill: "#2b2d42" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={isMobile ? 80 : 160}
              tick={{ fontSize: isMobile ? 11 : 14, fill: "#2b2d42" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(label: string) =>
                isMobile ? (SHORT_LABELS[label] || label) : label
              }
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f0f0f0" }} />
            <Bar
              dataKey="perCapita"
              radius={[0, 8, 8, 0]}
              onClick={(_data, _index, e) => {
                const target = e?.target as SVGElement | undefined;
                const idx = target ? sortedCategories.findIndex(
                  (c) => c.color === target.getAttribute("fill")
                ) : -1;
                if (idx >= 0) onCategoryClick?.(sortedCategories[idx].category);
              }}
              className="cursor-pointer"
            >
              {sortedCategories.map((entry) => (
                <Cell key={entry.category} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}
