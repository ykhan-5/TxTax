"use client";

import { useRouter } from "next/navigation";
import { useZipValidation } from "@/hooks/useZipValidation";
import { motion } from "framer-motion";
import { useState } from "react";

export function ZipCodeInput() {
  const router = useRouter();
  const { value, isValid, error, handleChange } = useZipValidation();
  const [shake, setShake] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValid) {
      router.push(`/results/${value}`);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:relative gap-3 sm:gap-0"
      >
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoFocus
          placeholder="Enter your ZIP code"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className={`
            w-full h-16 sm:h-20 px-5 sm:px-6 sm:pr-36 text-xl sm:text-2xl font-mono
            rounded-2xl border-2 outline-none transition-all
            bg-white shadow-lg
            placeholder:text-gray-400
            ${
              error
                ? "border-texas-red focus:border-texas-red"
                : isValid
                  ? "border-texas-green focus:border-texas-green"
                  : "border-gray-200 focus:border-texas-blue"
            }
          `}
          maxLength={5}
          aria-label="Texas ZIP code"
          aria-describedby="zip-feedback"
        />
        <button
          type="submit"
          disabled={!isValid}
          className={`
            sm:absolute sm:right-3 sm:top-1/2 sm:-translate-y-1/2
            w-full sm:w-auto
            px-6 py-3.5 sm:py-3 rounded-xl text-lg font-heading font-semibold
            transition-all
            ${
              isValid
                ? "bg-texas-blue text-white hover:bg-texas-blue/90 cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Find Out &rarr;
        </button>
      </motion.div>

      <div id="zip-feedback" className="h-6 mt-2 text-center text-sm" aria-live="polite">
        {error && <span className="text-texas-red">{error}</span>}
        {isValid && (
          <span className="text-texas-green flex items-center justify-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Valid Texas ZIP code
          </span>
        )}
      </div>
    </form>
  );
}
