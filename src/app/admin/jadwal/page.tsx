"use client";

import { useEffect, useState } from "react";


function statusBadge(s: string) {
  if (s === "Selesai") return "badge badge-selesai";
  if (s === "Terjadwal") return "badge badge-dijadwalkan";
  return "badge badge-menunggu";
}

export default function AdminJadwalPage() {
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  useEffect(() => {
    fetch("/api/jadwal").then((r) => r.json()).then((data) => { setJadwal(data); setLoading(false); });
  }, []);

  const filtered = jadwal.filter((j) => {
    const q = search.toLowerCase();
    const matchSearch = j.laporan?.user?.nama?.toLowerCase().includes(q) ||
      j.petugas?.namaPetugas?.toLowerCase().includes(q) ||
      j.wilayah?.namaWilayah?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "Semua" || j.statusPengangkutan === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Jadwal", value: jadwal.length, color: "#3b82f6" },
          { label: "Terjadwal", value: jadwal.filter((j) => j.statusPengangkutan === "Terjadwal").length, color: "#7c3aed" },
          { label: "Selesai", value: jadwal.filter((j) => j.statusPengangkutan === "Selesai").length, color: "#16a34a" },
        ].map((c) => (
          <div key={c.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{c.label}</div>
            </div>
            <div className="text-3xl font-black" style={{ color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex justify-end mb-6">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-base" style={{ maxWidth: "220px" }}>
          <option value="Semua">Semua Status</option>
          <option value="Terjadwal">Terjadwal</option>
          <option value="Selesai">Selesai</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-slate-400">Belum ada jadwal pengangkutan</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Wilayah</th>
                <th>Petugas</th>
                <th>Tanggal Angkut</th>
                <th>Jam</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((j, i) => (
                <tr key={j.id}>
                  <td>
                    <div className="font-semibold text-sm">{j.laporan?.user?.nama ?? "-"}</div>
                    <div className="text-xs text-slate-400">{j.laporan?.user?.jenisBangunan?.namaJenisBangunan}</div>
                  </td>
                  <td>
                    <div className="text-sm font-medium">{j.wilayah?.namaWilayah}</div>
                    <div className="text-xs text-slate-400">{j.wilayah?.kelurahan}</div>
                  </td>
                  <td>
                    <div className="text-sm font-medium">{j.petugas?.namaPetugas}</div>
                    <div className="text-xs text-slate-400">{j.petugas?.jabatan}</div>
                  </td>
                  <td className="text-sm font-medium">
                    {new Date(j.tanggalAngkut).toLocaleDateString("id-ID", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="text-sm font-medium text-slate-600">
                    {new Date(j.jamAngkut).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                  </td>
                  <td><span className={statusBadge(j.statusPengangkutan)}>{j.statusPengangkutan}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-4 text-sm text-slate-400 text-right">{filtered.length} dari {jadwal.length} jadwal</div>
    </div>
  );
}
