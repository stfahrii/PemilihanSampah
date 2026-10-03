import "./globals.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import PageTransitionProvider from "@/components/providers/PageTransitionProvider";
import TruckLoader from "@/components/ui/TruckLoader";

export const metadata: Metadata = {
  title: "EcoSort Senayan - Sistem Informasi Pemilahan Sampah",
  description: "Sistem Informasi Pemilahan Sampah Kecamatan Senayan Berbasis Web",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Suspense fallback={<TruckLoader />}>
          <PageTransitionProvider>{children}</PageTransitionProvider>
        </Suspense>
      </body>
    </html>
  );
}
