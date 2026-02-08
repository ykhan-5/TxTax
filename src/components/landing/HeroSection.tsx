"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <div className="text-center mb-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-charcoal leading-tight"
      >
        Where Does Your Texas
        <br />
        <span className="text-texas-blue">Tax Money</span> Go?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-4 text-lg sm:text-xl text-charcoal/60 max-w-2xl mx-auto"
      >
        Enter your ZIP code to see exactly where your share of Texas state
        spending went.
      </motion.p>
    </div>
  );
}
