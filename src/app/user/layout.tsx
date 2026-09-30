"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import DarkModeToggle from "@/components/DarkModeToggle";
import NotificationBell from "@/components/NotificationBell";
import Icon, { IconName } from "@/components/ui/Icon";
import Breadcrumb from "@/components/ui/Breadcrumb";

const navItems: { href: string; icon: IconName; label: string }[] = [
  { href: "/user/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/user/lapor",     icon: "lapor",     label: "Lapor Sampah" },
  { href: "/user/riwayat",   icon: "history",   label: "Riwayat Laporan" },
  { href: "/user/profile",   icon: "profile",   label: "Profil Saya" },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [nama, setNama]       = useState("Pengguna");
  const [avatar, setAvatar]   = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const n = sessionStorage.getItem("userNama");
    if (n) setNama(n);
    const role = sessionStorage.getItem("userRole");
    if (!role || role === "Admin") router.push("/login");

    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved === "true") setCollapsed(true);

    // Load avatar from API
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      fetch(`/api/user/${userId}`)
        .then((r) => r.json())
        .then((data) => { if (data.fotoProfil) setAvatar(data.fotoProfil); })
        .catch(() => {});
    }
  }, [router]);

  function toggleSidebar() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", String(next));
      return next;
    });
  }

  function handleLogout() {
    sessionStorage.clear();
    router.push("/login");
  }

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""} print:hidden`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #4ade80, #16a34a)", color: "#ffffff" }}>
              <Icon name="recycle" size={20} color="#ffffff" strokeWidth={2.2} />
            </div>
            {!collapsed && (
              <div>
                <div className="text-white font-black text-base leading-none">EcoSort</div>
                <div className="text-green-400 text-xs mt-0.5">Senayan</div>
              </div>
            )}
          </div>
        </div>

        {/* User pill */}
        <div className={`mx-3 mt-4 mb-2 px-3 py-3 rounded-xl ${collapsed ? "flex justify-center" : ""}`} style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #4ade80, #16a34a)", color: "white" }}>
              {avatar
                ? <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : nama.charAt(0).toUpperCase()
              }
            </div>
            {!collapsed && (
              <div>
                <div className="text-white text-sm font-semibold leading-none">{nama}</div>
                <div className="text-green-400 text-xs mt-0.5">Pengguna</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {!collapsed && (
            <div className="text-xs font-semibold uppercase tracking-widest mb-3 px-2" style={{ color: "rgba(255,255,255,0.3)" }}>
              Menu Utama
            </div>
          )}
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              title={collapsed ? item.label : undefined}
              className={`sidebar-link ${pathname === item.href ? "active" : ""}`}>
              <Icon name={item.icon} size={18} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout}
            title={collapsed ? "Keluar" : undefined}
            className="sidebar-link w-full text-left cursor-pointer"
            style={{ color: "rgba(255,255,255,0.5)" }}>
            <Icon name="logout" size={18} className="flex-shrink-0" />
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={`main-content flex-1 print:p-0 print:m-0 print:bg-white ${collapsed ? "expanded" : ""}`}>
        <div className="flex items-center justify-between gap-3 mb-4 print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center justify-center shadow-sm cursor-pointer"
              title={collapsed ? "Buka Sidebar (Navigasi Samping)" : "Ciutkan Sidebar"}
            >
              <Icon name={collapsed ? "sidebar-open" : "sidebar-close"} size={18} />
            </button>
            <Breadcrumb />
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <DarkModeToggle />
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
