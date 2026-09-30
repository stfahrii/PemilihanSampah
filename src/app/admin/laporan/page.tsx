"use client";

import { useEffect, useState } from "react";
import { getAllLaporan, getAllPetugas, getAllWilayah, assignPetugasAction, updateStatusSelesaiAction } from "@/actions/laporan.action";
import Icon from "@/components/ui/Icon";

function badgeClass(status: string) {
  if (status === "Selesai") return "badge badge-selesai";
  if (status === "Diproses") return "badge badge-diproses";
  return "badge badge-menunggu";
}

export default function AdminLaporanPage() {
  const [laporan, setLaporan] = useState<any[]>([]);
  const [petugas, setPetugas] = useState<any[]>([]);
  const [wilayah, setWilayah] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [assignModal, setAssignModal] = useState<any | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [assignForm, setAssignForm] = useState({ petugasId: "", wilayahId: "", tanggalAngkut: "", jamAngkut: "" });

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  async function reload() {
    const [data, p] = await Promise.all([getAllLaporan(), getAllPetugas()]);
    setLaporan(data);
    setPetugas(p);
  }

  useEffect(() => {
    Promise.all([getAllLaporan(), getAllPetugas(), getAllWilayah()]).then(([l, p, w]) => {
      setLaporan(l); setPetugas(p); setWilayah(w); setLoading(false);
    });
  }, []);

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!assignModal) return;
    const fd = new FormData();
    fd.append("laporanId", assignModal.id);
    Object.entries(assignForm).forEach(([k, v]) => fd.append(k, v));
    const res = await assignPetugasAction(fd);
    if (res.success) { showToast("success", res.message); setAssignModal(null); reload(); }
    else showToast("error", res.message);
  }

  async function handleSelesai(id: string) {
    const res = await updateStatusSelesaiAction(id);
    if (res.success) { showToast("success", res.message); reload(); }
    else showToast("error", res.message);
  }



  const filtered = laporan.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = l.user?.nama?.toLowerCase().includes(q) ||
      l.detail?.some((d: any) => d.jenisSampah?.namaJenis?.toLowerCase().includes(q));
    const matchStatus = filterStatus === "Semua" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      {toast && (
        <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.msg}
        </div>
      )}

      {/* Assign Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden"
          onClick={() => setAssignModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="font-bold text-slate-800 text-lg">Tugaskan Petugas</h3>
              <button onClick={() => setAssignModal(null)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">Tutup</button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl mb-4 text-xs space-y-1">
              <div>Pelapor: <strong>{assignModal.user?.nama}</strong></div>
              <div>Wilayah: {assignModal.user?.wilayah?.namaWilayah}</div>
            </div>

            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700">Petugas *</label>
                <select required className="input-base" value={assignForm.petugasId}
                  onChange={(e) => setAssignForm({ ...assignForm, petugasId: e.target.value })}>
                  <option value="">-- Pilih Petugas --</option>
                  {petugas.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.isBusy}>
                      {p.namaPetugas} ({p.jabatan}){p.isBusy ? " — Sedang Bertugas" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700">Wilayah *</label>
                <select required className="input-base" value={assignForm.wilayahId}
                  onChange={(e) => setAssignForm({ ...assignForm, wilayahId: e.target.value })}>
                  <option value="">-- Pilih Wilayah --</option>
                  {wilayah.map((w) => <option key={w.id} value={w.id}>{w.namaWilayah} - {w.kelurahan}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700">Tanggal *</label>
                  <input type="date" required className="input-base" value={assignForm.tanggalAngkut}
                    onChange={(e) => setAssignForm({ ...assignForm, tanggalAngkut: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700">Jam *</label>
                  <input type="time" required className="input-base" value={assignForm.jamAngkut}
                    onChange={(e) => setAssignForm({ ...assignForm, jamAngkut: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn-eco w-full">Simpan Penugasan</button>
            </form>
          </div>
        </div>
      )}

      {/* KOP SURAT RESMI KHUSUS PRINT */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
        <h2 className="text-xl font-bold uppercase text-slate-900 tracking-wide">Pemerintah Kota Administrasi Jakarta Selatan</h2>
        <h3 className="text-base font-bold text-slate-800">Sistem Informasi Pemilahan Sampah EcoSort Senayan</h3>
        <p className="text-xs text-slate-600 mt-1">Laporan Rekapitulasi Pemilahan Sampah — Kecamatan Senayan & Kebayoran Baru</p>
        <p className="text-[11px] text-slate-500 italic mt-0.5">Dicetak pada: {new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} WIB</p>
      </div>

      {/* Filter & Print PDF */}
      <div className="flex items-center justify-between gap-3 mb-6 print:hidden">
        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl font-mono-custom text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Icon name="printer" size={15} /> Cetak Rekapitulasi (PDF)
        </button>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-base" style={{ maxWidth: "220px" }}>
          <option value="Semua">Semua Status</option>
          <option value="Menunggu">Menunggu</option>
          <option value="Diproses">Diproses</option>
          <option value="Selesai">Selesai</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden print:border-none print:shadow-none">
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
            <div className="text-slate-500">Memuat data...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-slate-400 font-medium">Tidak ada laporan ditemukan</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table print:text-black">
              <thead>
                <tr>
                  <th>Pengguna</th>
                  <th>Bangunan / Wilayah</th>
                  <th>Jenis Sampah</th>
                  <th>Total Berat</th>
                  <th className="print:hidden">Foto</th>
                  <th>Tanggal</th>
                  <th>Petugas</th>
                  <th>Status</th>
                  <th className="print:hidden">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => {
                  const totalBerat = l.detail.reduce((s: number, d: any) => s + Number(d.berat), 0);
                  const jenisNames = l.detail.map((d: any) => d.jenisSampah?.namaJenis).join(", ");
                  return (
                    <tr key={l.id}>
                      <td>
                        <div className="font-semibold text-sm">{l.user?.nama}</div>
                        <div className="text-xs text-slate-400 print:text-slate-600">{l.user?.email}</div>
                      </td>
                      <td>
                        <div className="text-sm">{l.user?.jenisBangunan?.namaJenisBangunan}</div>
                        <div className="text-xs text-slate-400 print:text-slate-600">{l.user?.wilayah?.namaWilayah}</div>
                      </td>
                      <td className="max-w-[140px]">
                        <span className="text-sm truncate block" title={jenisNames}>{jenisNames || "-"}</span>
                      </td>
                      <td><strong>{totalBerat.toFixed(1)}</strong> <span className="text-xs text-slate-400 print:text-slate-600">kg</span></td>
                      <td className="print:hidden">
                        {l.foto ? (
                          <a href={l.foto.pathFile} target="_blank" rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-xs">Lihat</a>
                        ) : <span className="text-slate-300 text-xs">-</span>}
                      </td>
                      <td className="text-sm text-slate-500 print:text-slate-800">
                        <div>{new Date(l.tanggalLapor).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</div>
                        {l.jamPenjemputan && (
                          <div className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-1 w-fit print:border-slate-300 print:bg-slate-100">
                            {l.jamPenjemputan}
                          </div>
                        )}
                      </td>
                      <td className="text-sm">{l.jadwal?.petugas?.namaPetugas ?? <span className="text-slate-300">-</span>}</td>
                      <td><span className={badgeClass(l.status)}>{l.status}</span></td>
                      <td className="print:hidden">
                        <div className="flex gap-2">
                          {l.status === "Menunggu" && (
                            <button onClick={() => { setAssignModal(l); setAssignForm({ petugasId: "", wilayahId: l.user?.wilayah?.id ?? "", tanggalAngkut: "", jamAngkut: "" }); }}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                              style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}>
                              Tugaskan
                            </button>
                          )}
                          {l.status === "Diproses" && (
                            <button onClick={() => handleSelesai(l.id)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                              style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
                              Tandai Selesai
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="mt-4 text-sm text-slate-400 text-right print:text-slate-600 print:mt-2">
        {filtered.length} dari {laporan.length} laporan
      </div>
    </div>
  );
}
