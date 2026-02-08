"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isTexasZip } from "@/lib/utils/validation";

export function GeolocationButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: { "User-Agent": "TxTax/1.0" },
            }
          );
          const data = await res.json();
          const zip = data?.address?.postcode;

          if (zip && isTexasZip(zip)) {
            router.push(`/results/${zip}`);
          } else {
            setError("Could not find a Texas ZIP code for your location");
          }
        } catch {
          setError("Could not determine your location");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied");
        setLoading(false);
      },
      { timeout: 10000 }
    );
  }

  return (
    <div className="text-center mt-4">
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-2 text-sm text-charcoal/50
          hover:text-texas-blue transition-colors cursor-pointer disabled:opacity-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {loading ? "Finding your location..." : "Use my location"}
      </button>
      {error && <p className="text-xs text-texas-red mt-1">{error}</p>}
    </div>
  );
}
