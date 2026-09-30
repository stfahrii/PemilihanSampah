"use client";

import { useEffect, useState } from "react";
import {
  getAdminStats, getAllLaporan, getJadwalHariIni,
  getJenisSampahStats, getWilayahStats, getLaporanPerBulan, getPetugasSedangBertugas,
} from "@/actions/laporan.action";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

/* ── Helpers ─────────────────────────────────────────────────── */
function statusBadge(status: string) {
  if (status === "Selesai")  return "badge badge-selesai";
  if (status === "Diproses") return "badge badge-diproses";
  return "badge badge-menunggu";
}

const COLORS = ["#16a34a","#10b981","#14b8a6","#3b82f6","#8b5cf6","#f59e0b","#f43f5e","#84cc16","#06b6d4","#ec4899"];

/* ── Mini Bar Chart (CSS-only) ───────────────────────────────── */
function BarChart({ data, labelKey = "bulan", valueKey = "count", color = "#16a34a" }: {
  data: Record<string, any>[];
  labelKey?: string; valueKey?: string; color?: string;
}) {
  const max = Math.max(...data.map((d) => d[valueKey] ?? 0), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>{d[valueKey] || ""}</span>
          <div
            style={{
              width: "100%",
              height: `${Math.max(((d[valueKey] ?? 0) / max) * 80, d[valueKey] ? 4 : 0)}px`,
              background: color,
              borderRadius: "4px 4px 0 0",
              transition: "height 0.6s ease",
              minHeight: d[valueKey] ? 4 : 0,
            }}
          />
          <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600, textAlign: "center" }}>{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Horizontal Bar ──────────────────────────────────────────── */
function HBar({ label, value, max, color, sub }: { label: string; value: number; max: number; color: string; sub?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 800, color }}>{value} {sub}</span>
      </div>
      <div style={{ height: 8, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 0.7s ease" }} />
      </div>
    </div>
  );
}

/* ── Pie / Donut (CSS conic-gradient) ────────────────────────── */
function DonutChart({ slices }: { slices: { label: string; value: number; color: string }[] }) {
  const total = slices.reduce((s, d) => s + d.value, 0) || 1;
  let angle = 0;
  const gradient = slices.map((s) => {
    const pct = (s.value / total) * 100;
    const from = angle;
    angle += pct;
    return `${s.color} ${from}% ${angle}%`;
  }).join(", ");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{
        width: 90, height: 90, borderRadius: "50%",
        background: `conic-gradient(${gradient})`,
        flexShrink: 0,
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
      }} />
      <div style={{ flex: 1 }}>
        {slices.map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "#64748b", flex: 1 }}>{s.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>{total > 0 ? Math.round((s.value / total) * 100) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [stats,           setStats]           = useState<any>(null);
  const [laporan,         setLaporan]         = useState<any[]>([]);
  const [jadwalHariIni,   setJadwalHariIni]   = useState<any[]>([]);
  const [jenisStat,       setJenisStat]       = useState<any[]>([]);
  const [wilayahStat,     setWilayahStat]     = useState<any[]>([]);
  const [bulanStat,       setBulanStat]       = useState<any[]>([]);
  const [petugasBertugas, setPetugasBertugas] = useState<any[]>([]);

  useEffect(() => {
    getAdminStats().then(setStats);
    getAllLaporan().then((data) => setLaporan(data.slice(0, 6)));
    getJadwalHariIni().then(setJadwalHariIni);
    getJenisSampahStats().then(setJenisStat);
    getWilayahStats().then(setWilayahStat);
    getLaporanPerBulan().then(setBulanStat);
    getPetugasSedangBertugas().then(setPetugasBertugas);
  }, []);

  const statCards = stats ? [
    { label: "PENGGUNA TERDAFTAR",  value: stats.totalUser,                              iconName: "building" as const, color: "#3b82f6", bg: "#eff6ff" },
    { label: "TOTAL LAPORAN",       value: stats.totalLaporan,                           iconName: "reports"  as const, color: "#f59e0b", bg: "#fffbeb" },
    { label: "PETUGAS AKTIF",       value: stats.totalPetugas,                           iconName: "officers" as const, color: "#16a34a", bg: "#f0fdf4" },
    { label: "TOTAL BERAT SAMPAH",  value: `${Number(stats.totalBerat).toFixed(1)} kg`,  iconName: "scale"    as const, color: "#10b981", bg: "#ecfdf5" },
  ] : [];

  const allLaporan = laporan;
  const menunggu = allLaporan.filter((l) => l.status === "Menunggu").length;
  const diproses = allLaporan.filter((l) => l.status === "Diproses").length;
  const selesai  = allLaporan.filter((l) => l.status === "Selesai").length;

  const maxWilayah = Math.max(...wilayahStat.map((w) => w.totalLaporan), 1);
  const maxJenis   = Math.max(...jenisStat.map((j) => j.totalBerat), 1);

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="badge-green mb-2">
            <span className="pulse-dot" />
            <span>KECAMATAN SENAYAN ADMIN PANEL</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Utama Admin</h1>
          <p className="text-slate-500 text-sm mt-0.5">Monitoring pemilahan sampah dan penugasan pengangkutan secara terpadu</p>
        </div>
        <Link href="/admin/laporan" className="btn-primary flex items-center gap-2">
          <Icon name="reports" size={16} /> Lihat Semua Laporan
        </Link>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-lift">
            <div className="flex items-center justify-between mb-3">
              <div style={{ width: 40, height: 40, borderRadius: 12, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", color: c.color }}>
                <Icon name={c.iconName} size={20} color={c.color} />
              </div>
              <span style={{ fontSize: 22, fontWeight: 900, color: c.color }} className="font-mono-custom">{c.value}</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.label}</div>
          </div>
        ))}
        {!stats && [1,2,3,4].map((i) => <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shimmer h-28" />)}
      </div>

      {/* ── Row 2: Operasional Real-time ── */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">

        {/* Jadwal Hari Ini */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-lift">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Icon name="calendar" size={18} className="text-slate-500" />
              <h2 className="font-bold text-slate-900">Jadwal Pengangkutan Hari Ini</h2>
            </div>
            <Link href="/admin/jadwal" className="nav-underline text-xs">Lihat Semua →</Link>
          </div>
          {jadwalHariIni.length === 0 ? (
            <div className="py-10 text-center">
              <Icon name="calendar" size={36} className="mx-auto mb-3 text-slate-300" />
              <div className="text-slate-400 text-sm">Belum ada jadwal hari ini</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {jadwalHariIni.map((j) => (
                <div key={j.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#16a34a,#10b981)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="officers" size={18} color="#ffffff" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{j.petugas?.namaPetugas ?? "-"}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{j.wilayah?.namaWilayah} · {j.laporan?.user?.nama}</div>
                  </div>
                  <span className="badge badge-dijadwalkan">{j.statusPengangkutan}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Petugas Sedang Bertugas */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-lift">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Icon name="officers" size={18} className="text-slate-500" />
              <h2 className="font-bold text-slate-900">Petugas Sedang Bertugas</h2>
            </div>
            <span className="badge badge-diproses">{petugasBertugas.length} Aktif</span>
          </div>
          {petugasBertugas.length === 0 ? (
            <div className="py-10 text-center">
              <Icon name="check" size={36} className="mx-auto mb-3 text-slate-300" />
              <div className="text-slate-400 text-sm">Semua petugas tidak sedang bertugas</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {petugasBertugas.map((l) => (
                <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#eff6ff", borderRadius: 12, border: "1px solid #bfdbfe" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="officers" size={18} color="#ffffff" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1e40af", marginBottom: 2 }}>{l.petugas?.namaPetugas}</div>
                    <div style={{ fontSize: 11, color: "#3b82f6", display: "flex", alignItems: "center", gap: 4 }}>
                      <Icon name="location" size={11} /> {l.user?.wilayah?.namaWilayah ?? "-"} · {l.user?.nama ?? "-"}
                    </div>
                    {l.jadwal && (
                      <div style={{ fontSize: 10, color: "#93c5fd", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                        <Icon name="calendar" size={10} /> {new Date(l.jadwal.tanggalAngkut).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                      </div>
                    )}
                  </div>
                  <span className="badge badge-diproses" style={{ flexShrink: 0 }}>Bertugas</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Row 3: Laporan Masuk Terbaru ─────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 card-lift overflow-hidden mb-8">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Icon name="reports" size={18} className="text-slate-500" />
            <h2 className="font-bold text-slate-900">Laporan Sampah Masuk Terbaru</h2>
          </div>
          <Link href="/admin/laporan" className="nav-underline text-xs">Kelola Laporan →</Link>
        </div>
        {laporan.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-mono-custom text-xs">Belum ada laporan masuk</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>PENGGUNA</th>
                <th>JENIS BANGUNAN</th>
                <th>JENIS SAMPAH</th>
                <th>TOTAL BERAT</th>
                <th>TANGGAL</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {laporan.map((l) => {
                const totalBerat = l.detail.reduce((s: number, d: any) => s + Number(d.berat), 0);
                const jenisNames = l.detail.map((d: any) => d.jenisSampah?.namaJenis).join(", ");
                return (
                  <tr key={l.id}>
                    <td>
                      <div className="font-bold text-sm text-slate-900">{l.user?.nama}</div>
                      <div className="font-mono-custom text-xs text-slate-400">{l.user?.email}</div>
                    </td>
                    <td className="text-sm font-medium text-slate-700">{l.user?.jenisBangunan?.namaJenisBangunan ?? "-"}</td>
                    <td className="text-sm max-w-[160px] truncate">{jenisNames || "-"}</td>
                    <td className="font-mono-custom font-black text-slate-900">{totalBerat.toFixed(1)} <span className="text-xs font-normal text-slate-400">kg</span></td>
                    <td className="font-mono-custom text-xs text-slate-500">{new Date(l.tanggalLapor).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}</td>
                    <td><span className={statusBadge(l.status)}>{l.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Row 4: Grafik Laporan per Bulan + Status Donut ─── */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">

        {/* Grafik Laporan per Bulan */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-lift">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="reports" size={18} className="text-slate-500" />
            <h2 className="font-bold text-slate-900">Grafik Laporan per Bulan</h2>
          </div>
          <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 20 }}>6 bulan terakhir</p>
          {bulanStat.length > 0
            ? <BarChart data={bulanStat} labelKey="bulan" valueKey="count" color="#16a34a" />
            : <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 13 }}>Belum ada data</div>
          }
        </div>

        {/* Status Donut */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-lift">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="filter" size={18} className="text-slate-500" />
            <h2 className="font-bold text-slate-900">Status Laporan</h2>
          </div>
          <DonutChart slices={[
            { label: "Menunggu",  value: menunggu, color: "#f59e0b" },
            { label: "Diproses",  value: diproses, color: "#3b82f6" },
            { label: "Selesai",   value: selesai,  color: "#16a34a" },
          ]} />
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "MENUNGGU", count: menunggu, badge: "badge-amber" },
              { label: "DIPROSES", count: diproses, badge: "badge-diproses" },
              { label: "SELESAI",  count: selesai,  badge: "badge-selesai" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className={`badge ${s.badge}`}>{s.label}</span>
                <span style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }} className="font-mono-custom">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 5: Grafik Jenis Sampah + Wilayah Terbanyak ─── */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">

        {/* Grafik Jenis Sampah */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-lift">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="recycle" size={18} className="text-slate-500" />
            <h2 className="font-bold text-slate-900">Jenis Sampah Terbanyak</h2>
          </div>
          <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 20 }}>Berdasarkan total berat (kg)</p>
          {jenisStat.length > 0 ? (
            <div>
              {jenisStat.slice(0, 7).map((j, i) => (
                <HBar
                  key={j.nama}
                  label={j.nama}
                  value={Math.round(j.totalBerat * 10) / 10}
                  max={maxJenis}
                  color={COLORS[i % COLORS.length]}
                  sub="kg"
                />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <Icon name="recycle" size={36} className="mx-auto mb-3 text-slate-300" />
              <div className="text-slate-400 text-sm">Belum ada laporan sampah</div>
            </div>
          )}
        </div>

        {/* Wilayah Terbanyak */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-lift">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="location" size={18} className="text-slate-500" />
            <h2 className="font-bold text-slate-900">Wilayah Laporan Terbanyak</h2>
          </div>
          <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 20 }}>Berdasarkan jumlah laporan masuk</p>
          {wilayahStat.length > 0 ? (
            <div>
              {wilayahStat.slice(0, 7).map((w, i) => (
                <HBar
                  key={w.nama}
                  label={w.nama}
                  value={w.totalLaporan}
                  max={maxWilayah}
                  color={COLORS[(i + 3) % COLORS.length]}
                  sub="laporan"
                />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <Icon name="location" size={36} className="mx-auto mb-3 text-slate-300" />
              <div className="text-slate-400 text-sm">Belum ada data wilayah</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
