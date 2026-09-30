"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  function toggleTheme() {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
      title="Toggle Dark / Light Mode"
    >
      <Icon name={isDark ? "moon" : "sun"} size={16} className={isDark ? "text-amber-400" : "text-amber-500"} />
      <span className="hidden sm:inline">{isDark ? "Dark Mode" : "Light Mode"}</span>
    </button>
  );
}
