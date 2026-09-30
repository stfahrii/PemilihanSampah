"use client";

import { useEffect, useState } from "react";
import { getUserStats, getUserLaporan, getUserTotalJenisSampah } from "@/actions/laporan.action";
import Link from "next/link";
import InteractiveSenayanMap from "@/components/InteractiveSenayanMap";
import PetugasProfileCards from "@/components/PetugasProfileCards";
import EcoImpactCalculator from "@/components/EcoImpactCalculator";
import OnboardingModal from "@/components/ui/OnboardingModal";
import Icon from "@/components/ui/Icon";

interface Stats { totalLaporan: number; totalBerat: number; selesai: number; menunggu: number; diproses: number; }

function statusBadge(status: string) {
  if (status === "Selesai")  return "badge badge-selesai";
  if (status === "Diproses") return "badge badge-diproses";
  return "badge badge-menunggu";
}

/* ── Mini Donut ─────────────────────────────────────────────── */
function MiniDonut({ menunggu, diproses, selesai }: { menunggu: number; diproses: number; selesai: number }) {
  const total = menunggu + diproses + selesai || 1;
  const slices = [
    { value: menunggu, color: "#f59e0b" },
    { value: diproses, color: "#3b82f6" },
    { value: selesai,  color: "#16a34a" },
  ];
  let angle = 0;
  const gradient = slices.map((s) => {
    const pct = (s.value / total) * 100;
    const from = angle;
    angle += pct;
    return `${s.color} ${from}% ${angle}%`;
  }).join(", ");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: `conic-gradient(${gradient})`,
        flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }} />
      <div>
        {[
          { label: "Menunggu", value: menunggu, color: "#f59e0b" },
          { label: "Diproses", value: diproses, color: "#3b82f6" },
          { label: "Selesai",  value: selesai,  color: "#16a34a" },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
            <span style={{ fontSize: 11, color: "#64748b" }}>{s.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", marginLeft: "auto" }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const [stats,        setStats]       = useState<Stats | null>(null);
  const [laporan,      setLaporan]     = useState<any[]>([]);
  const [nama,         setNama]        = useState("Pengguna");
  const [userId,       setUserId]      = useState("");
  const [totalJenis,   setTotalJenis]  = useState(0);
  const [showRewards,  setShowRewards] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);

  useEffect(() => {
    const uid = sessionStorage.getItem("userId") ?? "";
    const n = sessionStorage.getItem("userNama") ?? "Pengguna";
    setUserId(uid);
    setNama(n);
    if (!uid) return;
    getUserStats(uid).then(setStats);
    getUserLaporan(uid).then((data) => setLaporan(data.slice(0, 5)));
    getUserTotalJenisSampah(uid).then(setTotalJenis);
  }, []);

  const cards = stats ? [
    { label: "TOTAL LAPORAN",       value: stats.totalLaporan,              iconName: "reports"  as const, color: "#3b82f6", bg: "#eff6ff" },
    { label: "TOTAL JENIS SAMPAH",  value: `${totalJenis} Jenis`,           iconName: "recycle"  as const, color: "#8b5cf6", bg: "#f5f3ff" },
    { label: "TOTAL BERAT SAMPAH",  value: `${stats.totalBerat.toFixed(1)} kg`, iconName: "scale" as const, color: "#16a34a", bg: "#f0fdf4" },
    { label: "SELESAI DIANGKUT",    value: stats.selesai,                   iconName: "check"    as const, color: "#10b981", bg: "#ecfdf5" },
  ] : [];

  return (
    <div>
      {/* Onboarding */}
      {userId && <OnboardingModal userId={userId} userName={nama} />}

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="badge-green mb-2">
            <span className="pulse-dot" />
            <span>DASHBOARD BANGUNAN</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Halo, {nama}</h1>
          <p className="text-slate-500 text-sm mt-0.5">Sistem Informasi Pemilahan Sampah Kecamatan Senayan</p>
        </div>
        <Link href="/user/lapor" className="btn-eco flex items-center gap-2">
          <Icon name="lapor" size={16} /> Lapor Sampah Baru
        </Link>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((c) => (
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

      {/* ── Row 2: Status Laporan + CTA ─────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">

        {/* Status Laporan Visual */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-lift">
          <div className="flex items-center gap-2 mb-5">
            <Icon name="filter" size={18} className="text-slate-500" />
            <h2 className="font-bold text-slate-900">Status Laporan Saya</h2>
          </div>
          {stats ? (
            <>
              <MiniDonut menunggu={stats.menunggu} diproses={stats.diproses} selesai={stats.selesai} />
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "MENUNGGU", count: stats.menunggu, badge: "badge-menunggu" },
                  { label: "DIPROSES", count: stats.diproses, badge: "badge-diproses" },
                  { label: "SELESAI",  count: stats.selesai,  badge: "badge-selesai" },
                ].map((s) => (
                  <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className={`badge ${s.badge}`}>{s.label}</span>
                    <span style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }} className="font-mono-custom">{s.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="shimmer h-32 rounded-xl" />
          )}
        </div>

        {/* CTA Box & EcoPoints Reward */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-2xl dark-panel border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="badge-green">LAYANAN MASYARAKAT</span>
                <span className="bg-amber-400/20 text-amber-300 font-mono-custom text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-400/40">
                  {Math.floor((stats?.totalBerat || 0) * 10)} EcoPoints
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Buat Laporan Pemilahan Sampah Baru</h2>
              <p className="text-slate-400 text-sm max-w-xl">
                Satu laporan dapat berisi 10 jenis sampah (Organik, B3, Medis, dll) & dapatkan 10 EcoPoints per kg!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link href="/user/lapor" className="btn-primary text-center flex items-center justify-center gap-2">
                <Icon name="lapor" size={15} /> Mulai Lapor
              </Link>
              <button onClick={() => setShowRewards(true)} className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono-custom text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
                <Icon name="sparkles" size={14} /> Tukar Poin
              </button>
              <button onClick={() => setShowCertificate(true)} className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono-custom text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
                <Icon name="shield" size={14} /> Sertifikat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Real-time Eco Impact Calculator ────────── */}
      <EcoImpactCalculator initialWeight={Number(stats?.totalBerat || 0)} />

      {/* ── Riwayat Laporan Terbaru ──────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 card-lift overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Icon name="history" size={18} className="text-slate-500" />
            <h2 className="font-bold text-slate-900">Riwayat Laporan Terbaru</h2>
          </div>
          <Link href="/user/riwayat" className="nav-underline text-xs">Lihat Semua Riwayat →</Link>
        </div>

        {laporan.length === 0 ? (
          <div className="py-16 text-center">
            <Icon name="reports" size={48} className="mx-auto mb-4 text-slate-200" />
            <div className="font-bold text-slate-700">Belum ada laporan sampah</div>
            <div className="text-slate-400 text-xs mt-1 font-mono-custom">Buat laporan pertama Anda untuk bangunan ini</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>TANGGAL</th>
                <th>JENIS SAMPAH</th>
                <th>TOTAL BERAT</th>
                <th>STATUS</th>
                <th>JADWAL ANGKUT</th>
              </tr>
            </thead>
            <tbody>
              {laporan.map((l) => {
                const totalBerat = l.detail.reduce((s: number, d: any) => s + Number(d.berat), 0);
                const jenisNames = l.detail.map((d: any) => d.jenisSampah?.namaJenis).join(", ");
                return (
                  <tr key={l.id}>
                    <td className="font-mono-custom text-xs font-bold text-slate-700">
                      {new Date(l.tanggalLapor).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="max-w-[200px] truncate font-medium text-slate-800">{jenisNames || "-"}</td>
                    <td className="font-mono-custom font-black text-slate-900">{totalBerat.toFixed(1)} <span className="text-xs font-normal text-slate-400">kg</span></td>
                    <td><span className={statusBadge(l.status)}>{l.status}</span></td>
                    <td className="font-mono-custom text-xs text-slate-500">
                      {l.jadwal
                        ? `${new Date(l.jadwal.tanggalAngkut).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })} · ${l.jadwal.petugas?.namaPetugas ?? "-"}`
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Tim Petugas & Peta ─────────────────────────── */}
      <PetugasProfileCards />
      <InteractiveSenayanMap />

      {/* ── Modal Tukar Poin ───────────────────────────── */}
      {showRewards && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn font-sans-custom">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Icon name="sparkles" size={20} className="text-amber-500" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Tukar EcoPoints Warga</h3>
                  <p className="text-xs text-slate-500 font-mono-custom">Total Poin Kamu: <strong className="text-amber-500">{Math.floor((stats?.totalBerat || 0) * 10)} Poin</strong></p>
                </div>
              </div>
              <button onClick={() => setShowRewards(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white font-bold transition-all text-xs flex items-center justify-center cursor-pointer">
                <Icon name="x" size={14} />
              </button>
            </div>

            {redeemedCode ? (
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                <Icon name="check" size={40} className="mx-auto text-emerald-500" />
                <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-base">Penukaran Poin Berhasil!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">Tunjukkan Kode Voucher ini kepada Petugas / Kasir Kelurahan Senayan:</p>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-300 font-mono-custom font-black text-lg text-emerald-700 tracking-wider">
                  {redeemedCode}
                </div>
                <button onClick={() => setRedeemedCode(null)} className="btn-eco text-xs py-2 px-6">Tukar Hadiah Lain</button>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { id: "1", title: "5kg Pupuk Kompos Organik Super", points: 50, desc: "Hasil daur ulang sampah organik Senayan" },
                  { id: "2", title: "Voucher Sembako Murah Rp 25.000", points: 100, desc: "Berlaku di Pasar & Toko Kelurahan Senayan" },
                  { id: "3", title: "Token Listrik PLN Rp 50.000", points: 250, desc: "Voucher pulsa prabayar PLN 11 digit" },
                ].map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Icon name="sparkles" size={18} className="text-amber-500" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</div>
                        <div className="text-[11px] text-slate-500">{item.desc}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setRedeemedCode(`ECO-SENAYAN-${Math.floor(100000 + Math.random() * 900000)}`)}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono-custom text-xs font-bold rounded-xl transition-all shadow-sm flex-shrink-0 cursor-pointer"
                    >
                      Tukar {item.points} Poin
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Modal Sertifikat Digital ───────────────────────────── */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn font-sans-custom">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <button onClick={() => setShowCertificate(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white font-bold transition-all text-xs flex items-center justify-center cursor-pointer">
              <Icon name="x" size={14} />
            </button>

            <div className="border-4 border-double border-emerald-600 dark:border-emerald-500 p-8 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 text-center">
              <Icon name="shield" size={48} className="mx-auto mb-3 text-emerald-600" />
              <div className="font-mono-custom text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-widest mb-1">PROVINSI DKI JAKARTA · KECAMATAN SENAYAN</div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">SERTIFIKAT BANGUNAN TAAT PEMILAHAN</h2>
              <div className="font-mono-custom text-[10px] text-slate-400 mb-6">NOMOR: 2026/DLH-SENAYAN/ECO/{stats?.totalLaporan || 1}</div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">Diberikan secara resmi kepada:</p>
              <div className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300 border-b-2 border-emerald-400 pb-1 mb-4 inline-block px-6 font-sans-custom">
                {nama}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto mb-6">
                Atas komitmen dan partisipasi aktif dalam melaksanakan <strong>Pemilahan 10 Jenis Sampah Terpadu</strong> dari sumbernya di Kecamatan Senayan dengan total kontribusi <strong>{stats?.totalBerat.toFixed(1) || 0} kg</strong>.
              </p>

              <div className="flex justify-around items-center pt-6 border-t border-emerald-200 dark:border-emerald-800 text-xs font-mono-custom">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Dr. Ir. H. Ahmad Subandi</div>
                  <div className="text-slate-400 text-[10px]">Kepala DLH Jakarta Pusat</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">H. Rahmat Hidayat, M.Si</div>
                  <div className="text-slate-400 text-[10px]">Camat Kecamatan Senayan</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => window.print()} className="btn-eco text-xs py-2.5 px-6 flex items-center gap-2">
                <Icon name="printer" size={15} /> Cetak / Simpan PDF Sertifikat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
