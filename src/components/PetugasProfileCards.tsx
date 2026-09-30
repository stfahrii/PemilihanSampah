"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";

interface Petugas {
  id: string;
  namaPetugas: string;
  email: string;
  noHp: string;
  jabatan: string;
  status: string;
  fotoProfil: string | null;
}

const jabatanInfo: Record<string, { tugas: string; color: string }> = {
  Koordinator: {
    tugas: "Mengkoordinasikan seluruh operasional pengangkutan sampah, menyusun jadwal armada, dan memastikan alur pelaporan berjalan efisien.",
    color: "#16a34a",
  },
  "Petugas Lapangan": {
    tugas: "Melakukan survei lokasi, verifikasi laporan warga di lapangan, dan memastikan pemilahan sampah sesuai standar 10 kategori.",
    color: "#2563eb",
  },
  Pengemudi: {
    tugas: "Mengoperasikan armada truk pengangkut sampah, memastikan sampah terangkut tepat waktu sesuai jadwal yang ditentukan.",
    color: "#d97706",
  },
  Admin: {
    tugas: "Mengelola data pelaporan digital, input jadwal pengangkutan ke sistem, dan memonitor status seluruh laporan masuk.",
    color: "#7c3aed",
  },
};

export default function PetugasProfileCards() {
  const [petugasList, setPetugasList] = useState<Petugas[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPetugas, setSelectedPetugas] = useState<Petugas | null>(null);

  useEffect(() => {
    fetch("/api/petugas")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.petugas)) {
          setPetugasList(data.petugas);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl card-lift font-sans-custom my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="badge-green mb-2">
            <span className="pulse-dot" />
            <span>TIM PETUGAS KECAMATAN SENAYAN</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Profil Petugas Pengangkutan
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Klik kartu petugas untuk melihat detail tugas dan informasi kontak lengkap.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono-custom text-xs font-bold text-slate-600 dark:text-slate-300">
            {petugasList.filter((p) => p.status === "Aktif").length} PETUGAS AKTIF
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Memuat data petugas...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {petugasList.map((p) => {
            const info = jabatanInfo[p.jabatan] || jabatanInfo["Admin"];
            const isSelected = selectedPetugas?.id === p.id;

            return (
              <div
                key={p.id}
                onClick={() => setSelectedPetugas(isSelected ? null : p)}
                className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer group ${
                  isSelected
                    ? "border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-[1.02]"
                    : "border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:shadow-lg"
                }`}
              >
                {/* Photo Area */}
                <div className="relative w-full h-52 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {p.fotoProfil ? (
                    <img
                      src={p.fotoProfil}
                      alt={p.namaPetugas}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 text-emerald-800 dark:text-emerald-200">
                      {p.namaPetugas.charAt(0)}
                    </div>
                  )}

                  {/* Status Badge Overlay */}
                  <div
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-mono-custom font-black uppercase tracking-wider backdrop-blur-md border"
                    style={{
                      background: p.status === "Aktif" ? "rgba(22,163,74,0.9)" : "rgba(220,38,38,0.9)",
                      color: "#fff",
                      borderColor: p.status === "Aktif" ? "rgba(74,222,128,0.5)" : "rgba(252,165,165,0.5)",
                    }}
                  >
                    {p.status === "Aktif" ? "AKTIF" : "NONAKTIF"}
                  </div>

                  {/* Jabatan Badge Overlay */}
                  <div
                    className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-mono-custom font-black uppercase tracking-wider backdrop-blur-md"
                    style={{ background: "rgba(0,0,0,0.7)", color: info.color }}
                  >
                    {p.jabatan}
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                    {p.namaPetugas}
                  </h4>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono-custom space-y-1">
                    <div className="truncate">{p.email}</div>
                    <div>{p.noHp}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Petugas Detail Panel */}
      {selectedPetugas && (
        <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 animate-fadeIn">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Photo */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-lg flex-shrink-0">
              {selectedPetugas.fotoProfil ? (
                <img
                  src={selectedPetugas.fotoProfil}
                  alt={selectedPetugas.namaPetugas}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                  {selectedPetugas.namaPetugas.charAt(0)}
                </div>
              )}
            </div>

            {/* Detail Info */}
            <div className="flex-1 space-y-3">
              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedPetugas.namaPetugas}
                </h4>
                <div
                  className="inline-block px-3 py-1 rounded-lg text-[11px] font-mono-custom font-bold uppercase mt-1"
                  style={{
                    background: `${(jabatanInfo[selectedPetugas.jabatan] || jabatanInfo["Admin"]).color}15`,
                    color: (jabatanInfo[selectedPetugas.jabatan] || jabatanInfo["Admin"]).color,
                    border: `1px solid ${(jabatanInfo[selectedPetugas.jabatan] || jabatanInfo["Admin"]).color}30`,
                  }}
                >
                  {selectedPetugas.jabatan}
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-mono-custom font-bold uppercase text-slate-400 tracking-wider mb-1">
                  Deskripsi Tugas:
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {(jabatanInfo[selectedPetugas.jabatan] || jabatanInfo["Admin"]).tugas}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                  <span className="block text-[10px] font-mono-custom text-slate-400 mb-0.5">Email</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white">{selectedPetugas.email}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                  <span className="block text-[10px] font-mono-custom text-slate-400 mb-0.5">No. HP</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{selectedPetugas.noHp}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                  <span className="block text-[10px] font-mono-custom text-slate-400 mb-0.5">Status</span>
                  <span className={`text-xs font-bold ${selectedPetugas.status === "Aktif" ? "text-emerald-600" : "text-rose-500"}`}>
                    {selectedPetugas.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
