"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "info" | "success" | "warning";
  read?: boolean;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userNama, setUserNama] = useState<string>("Pengguna");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUserId = sessionStorage.getItem("userId");
    const currentNama = sessionStorage.getItem("userNama");

    if (currentNama) setUserNama(currentNama);
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    setUserId(currentUserId);

    // Load read notifications for this specific user from localStorage
    const savedRead = localStorage.getItem(`read_notifs_${currentUserId}`);
    if (savedRead) {
      try {
        setReadIds(JSON.parse(savedRead));
      } catch (e) {
        setReadIds([]);
      }
    }

    // Fetch user-specific notifications
    fetch(`/api/notifications?userId=${currentUserId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }
      })
      .catch((err) => console.error("Notification fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  function markAllRead() {
    if (!userId) return;
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    localStorage.setItem(`read_notifs_${userId}`, JSON.stringify(allIds));
  }

  function markAsRead(id: string) {
    if (!userId || readIds.includes(id)) return;
    const newReadIds = [...readIds, id];
    setReadIds(newReadIds);
    localStorage.setItem(`read_notifs_${userId}`, JSON.stringify(newReadIds));
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm cursor-pointer flex items-center justify-center"
        title={`Pemberitahuan ${userNama}`}
      >
        <Icon name="bell" size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono-custom text-[9px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden font-sans-custom">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="bell" size={18} className="text-emerald-600 dark:text-emerald-400" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block">Pemberitahuan</span>
                  <span className="text-[10px] text-slate-400 font-mono-custom">Akun: {userNama}</span>
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-mono-custom font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Tandai Dibaca
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <div className="p-6 text-center text-xs text-slate-400">Memuat pemberitahuan...</div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">Belum ada pemberitahuan baru.</div>
              ) : (
                notifications.map((n) => {
                  const isRead = readIds.includes(n.id);
                  return (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-4 transition-colors cursor-pointer ${
                        !isRead ? "bg-emerald-50/60 dark:bg-emerald-950/40" : "hover:bg-slate-50 dark:hover:bg-slate-800/50 opacity-80"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{n.title}</span>
                        {!isRead && <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 mt-1" />}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">{n.desc}</p>
                      <span className="font-mono-custom text-[10px] text-slate-400">{n.time}</span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-center">
              <span className="font-mono-custom text-xs text-slate-400">Pemberitahuan Terpisah Per User (EcoSort Senayan)</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
