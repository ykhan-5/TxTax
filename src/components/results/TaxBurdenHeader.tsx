"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { formatCurrency } from "@/lib/utils/format";

interface TaxBurdenHeaderProps {
  zipCode: string;
  countyName: string;
  fiscalYear: string;
  estimatedPerCapitaTax: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => formatCurrency(Math.round(v)));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: "easeOut",
    });
    return controls.stop;
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
}

export function TaxBurdenHeader({
  zipCode,
  countyName,
  fiscalYear,
  estimatedPerCapitaTax,
}: TaxBurdenHeaderProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12 px-6 bg-gradient-to-b from-texas-blue/5 to-transparent rounded-3xl"
    >
      <p className="text-sm text-charcoal/50 uppercase tracking-wider font-medium">
        In FY {fiscalYear}, residents of ZIP {zipCode} ({countyName} County) paid an estimated
      </p>
      <div className="mt-4 mb-2">
        <span className="text-5xl sm:text-6xl md:text-7xl font-mono font-bold text-texas-blue">
          <AnimatedNumber value={estimatedPerCapitaTax} />
        </span>
      </div>
      <p className="text-lg text-charcoal/60">
        per person in Texas state taxes
      </p>
      <p className="mt-6 text-charcoal/70 font-heading font-semibold text-xl">
        Here&apos;s where it went...
      </p>
    </motion.section>
  );
}
