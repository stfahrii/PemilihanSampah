"use client";

import React, { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import TruckLoader from "@/components/ui/TruckLoader";

export default function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Watch route changes
  useEffect(() => {
    // When pathname or searchParams change, hide loading after brief transition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Intercept anchor clicks to trigger loader smoothly
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external links, anchor fragments, or same page links
      if (
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("javascript:") ||
        target.target === "_blank"
      ) {
        return;
      }

      // Check if navigating to a different path
      const currentPath = window.location.pathname;
      if (href !== currentPath && href !== `${currentPath}/`) {
        setLoading(true);
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <>
      {loading && (
        <TruckLoader
          message="Truk Sampah Sedang Meluncur..."
          submessage="EcoSort Senayan — Mengambil data & mempersiapkan halaman..."
          fullScreen={true}
        />
      )}
      {children}
    </>
  );
}
