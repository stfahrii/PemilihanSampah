"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";

/* Map pathname segments to human-readable labels */
const labelMap: Record<string, string> = {
  admin:     "Admin",
  user:      "Pengguna",
  dashboard: "Dashboard",
  laporan:   "Semua Laporan",
  jadwal:    "Jadwal Angkut",
  petugas:   "Data Petugas",
  master:    "Master Data",
  profile:   "Profil Saya",
  riwayat:   "Riwayat Laporan",
  lapor:     "Lapor Sampah",
};

export default function Breadcrumb() {
  const pathname = usePathname();

  // Split path into segments, filter empty strings
  const segments = pathname.split("/").filter(Boolean);

  // Build cumulative href for each crumb
  const crumbs = segments.map((seg, i) => ({
    label: labelMap[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  if (crumbs.length <= 1) return null;

  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-400 mb-1 flex-wrap"
    >
      {/* Home icon */}
      <Link
        href={`/${segments[0]}/dashboard`}
        className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center"
        title="Dashboard Utama"
      >
        <Icon name="building" size={14} />
      </Link>

      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <Icon name="chevron-right" size={12} className="text-slate-300 dark:text-slate-600" />
          {crumb.isLast ? (
            <span className="color-[#16a34a] font-semibold text-emerald-600 dark:text-emerald-400">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-medium"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
