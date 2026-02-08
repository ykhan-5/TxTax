"use client";

import { useState, useCallback } from "react";
import { validateZipInput } from "@/lib/utils/validation";

export function useZipValidation() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const handleChange = useCallback((input: string) => {
    // Only allow digits, max 5
    const cleaned = input.replace(/\D/g, "").slice(0, 5);
    setValue(cleaned);

    const result = validateZipInput(cleaned);
    setIsValid(result.isValid);
    setError(result.error);
  }, []);

  const reset = useCallback(() => {
    setValue("");
    setError(null);
    setIsValid(false);
  }, []);

  return { value, isValid, error, handleChange, reset };
}
