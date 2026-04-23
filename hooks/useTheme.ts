"use client";

import { useState, useEffect } from "react";
import { ThemeMode } from "@/types";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("gamevault_theme") as ThemeMode;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle("light", stored === "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("gamevault_theme", newTheme);
    document.documentElement.classList.toggle("light", newTheme === "light");
  };

  return { theme, toggleTheme };
}
