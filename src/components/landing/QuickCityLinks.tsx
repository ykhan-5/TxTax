"use client";

import Link from "next/link";
import { QUICK_CITIES } from "@/lib/utils/constants";
import { motion } from "framer-motion";

export function QuickCityLinks() {
  return (
    <div className="text-center">
      <p className="text-sm text-charcoal/50 mb-3">Or explore:</p>
      <div className="flex flex-wrap justify-center gap-2">
        {QUICK_CITIES.map((city, i) => (
          <motion.div
            key={city.zip}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
          >
            <Link
              href={`/results/${city.zip}`}
              className="inline-block px-4 py-2 rounded-full text-sm font-medium
                border border-texas-blue/20 text-texas-blue
                hover:bg-texas-blue hover:text-white
                transition-all"
            >
              {city.name}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
