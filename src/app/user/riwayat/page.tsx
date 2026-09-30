"use client";

import { useEffect, useState } from "react";
import { getUserLaporan } from "@/actions/laporan.action";
import Image from "next/image";
import Icon from "@/components/ui/Icon";

function badgeClass(status: string) {
  if (status === "Selesai") return "badge badge-selesai";
  if (status === "Diproses") return "badge badge-diproses";
  return "badge badge-menunggu";
}

export default function RiwayatPage() {
  const [laporan, setLaporan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId") ?? "";
    if (!userId) return;
    getUserLaporan(userId).then((data) => {
      setLaporan(data);
      setLoading(false);
    });
  }, []);

  const filtered = laporan.filter((l) => {
    const jenisNames = l.detail.map((d: any) => d.jenisSampah.namaJenis).join(" ").toLowerCase();
    const matchSearch = jenisNames.includes(search.toLowerCase()) ||
      new Date(l.tanggalLapor).toLocaleDateString("id-ID").includes(search);
    const matchStatus = filterStatus === "Semua" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">Detail Laporan</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>

            {/* Status & Time Slot */}
            <div className="flex flex-col gap-2 mb-5">
              <div className="flex items-center gap-3">
                <span className={badgeClass(selected.status)}>{selected.status}</span>
                <span className="text-sm text-slate-400">
                  {new Date(selected.tanggalLapor).toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                </span>
              </div>
              {selected.jamPenjemputan && (
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit flex items-center gap-1.5">
                  ⏰ Slot Penjemputan: {selected.jamPenjemputan}
                </div>
              )}
            </div>

            {/* Foto */}
            {selected.foto && (
              <div className="mb-5 rounded-xl overflow-hidden border border-slate-100">
                <img src={selected.foto.pathFile} alt="Foto Sampah"
                  className="w-full object-cover max-h-52"
                  onError={(e: any) => { e.target.style.display = "none"; }} />
              </div>
            )}

            {/* Detail Sampah */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Jenis & Berat Sampah</div>
              <div className="space-y-2">
                {selected.detail.map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between px-4 py-2.5 rounded-xl"
                    style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <span className="font-medium text-sm text-green-800">{d.jenisSampah.namaJenis}</span>
                    <span className="text-sm font-bold text-green-700">{Number(d.berat).toFixed(1)} kg</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 px-4 py-2 rounded-xl bg-slate-50 flex justify-between">
                <span className="text-sm font-semibold text-slate-600">Total Berat</span>
                <span className="font-bold text-slate-800">
                  {selected.detail.reduce((s: number, d: any) => s + Number(d.berat), 0).toFixed(1)} kg
                </span>
              </div>
            </div>

            {/* Jadwal */}
            {selected.jadwal && (
              <div className="p-4 rounded-xl" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                <div className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-2">Jadwal Pengangkutan</div>
                <div className="text-sm text-blue-800 font-medium">
                  {new Date(selected.jadwal.tanggalAngkut).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
                </div>
                <div className="text-sm text-blue-600">Petugas: {selected.jadwal.petugas?.namaPetugas ?? "-"}</div>
                <div className="text-sm text-blue-600">Wilayah: {selected.jadwal.wilayah?.namaWilayah ?? "-"}</div>
                <span className="badge badge-dijadwalkan mt-2">{selected.jadwal.statusPengangkutan}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Print-only Header */}
      <div className="hidden print:block mb-6" style={{ borderBottom: "2px solid #16a34a", paddingBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 36 }}>♻️</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, color: "#0f172a" }}>EcoSort Senayan</div>
            <div style={{ fontSize: 12, color: "#475569" }}>Sistem Informasi Pemilahan Sampah — Pemerintah Kota Administrasi Jakarta Selatan</div>
          </div>
        </div>
        <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Riwayat Laporan Pemilahan Sampah</div>
        <div style={{ fontSize: 11, color: "#64748b" }}>Dicetak pada: {new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</div>
      </div>

      {/* Filters & Print PDF */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-between items-center print:hidden">
        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl font-mono-custom text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm flex items-center gap-2 cursor-pointer w-full sm:w-auto"
        >
          <Icon name="printer" size={15} /> Cetak Rekapitulasi (PDF)
        </button>
        <div className="flex gap-3 w-full sm:w-auto flex-1 justify-end">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari jenis sampah atau tanggal..."
            className="input-base flex-1 max-w-md" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="input-base sm:w-44">
            <option value="Semua">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
            <div className="text-slate-500">Memuat data...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-slate-500 font-medium">Tidak ada laporan ditemukan</div>
            <div className="text-slate-400 text-sm mt-1">Coba ubah filter atau buat laporan baru</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Jenis Sampah</th>
                <th>Total Berat</th>
                <th className="print:hidden">Foto</th>
                <th>Status</th>
                <th>Petugas</th>
                <th className="print:hidden">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => {
                const totalBerat = l.detail.reduce((s: number, d: any) => s + Number(d.berat), 0);
                const jenisNames = l.detail.map((d: any) => d.jenisSampah.namaJenis).join(", ");
                return (
                  <tr key={l.id}>
                    <td className="text-slate-400 font-medium">{i + 1}</td>
                    <td>{new Date(l.tanggalLapor).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</td>
                    <td className="max-w-[160px]">
                      <span className="truncate block text-sm" title={jenisNames}>{jenisNames || "-"}</span>
                    </td>
                    <td><strong>{totalBerat.toFixed(1)}</strong> <span className="text-slate-400 text-xs">kg</span></td>
                    <td className="print:hidden">
                      {l.foto ? (
                        <a href={l.foto.pathFile} target="_blank" rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-xs">📷 Lihat</a>
                      ) : <span className="text-slate-300 text-xs">-</span>}
                    </td>
                    <td><span className={badgeClass(l.status)}>{l.status}</span></td>
                    <td className="text-sm text-slate-500">{l.jadwal?.petugas?.namaPetugas ?? "-"}</td>
                    <td className="print:hidden">
                      <button onClick={() => setSelected(l)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      {!loading && filtered.length > 0 && (
        <div className="mt-4 text-sm text-slate-400 text-right">
          Menampilkan <strong>{filtered.length}</strong> dari <strong>{laporan.length}</strong> laporan
        </div>
      )}
    </div>
  );
}
