"use client";

import { useState, useEffect, useRef } from "react";
import { getFormOptions, createLaporanAction } from "@/actions/laporan.action";

interface JenisSampah { id: string; namaJenis: string; deskripsi?: string | null; }
interface Wilayah { id: string; namaWilayah: string; kelurahan: string; kecamatan: string; }
interface SampahEntry { jenisSampahId: string; berat: string; }

export default function LaporPage() {
  const [jenisSampahList, setJenisSampahList] = useState<JenisSampah[]>([]);
  const [sampahEntries, setSampahEntries] = useState<SampahEntry[]>([{ jenisSampahId: "", berat: "" }]);
  const [jamPenjemputan, setJamPenjemputan] = useState("08:00 - 11:00 (Sesi Pagi)");

  const timeSlots = [
    { label: "Sesi Pagi", time: "08:00 - 11:00 WIB", value: "08:00 - 11:00 (Sesi Pagi)", desc: "Cocok untuk sampah rumah tangga harian" },
    { label: "Sesi Siang", time: "11:00 - 14:00 WIB", value: "11:00 - 14:00 (Sesi Siang)", desc: "Cocok untuk toko & gedung komersial" },
    { label: "Sesi Sore", time: "14:00 - 17:00 WIB", value: "14:00 - 17:00 (Sesi Sore)", desc: "Pengangkutan sore sebelum penutupan TPS" },
  ];
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getFormOptions().then(({ jenisSampah }) => setJenisSampahList(jenisSampah));
  }, []);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function addEntry() {
    setSampahEntries([...sampahEntries, { jenisSampahId: "", berat: "" }]);
  }

  function removeEntry(i: number) {
    setSampahEntries(sampahEntries.filter((_, idx) => idx !== i));
  }

  function updateEntry(i: number, field: keyof SampahEntry, value: string) {
    const updated = [...sampahEntries];
    updated[i][field] = value;
    setSampahEntries(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const userId = sessionStorage.getItem("userId") ?? "";
    if (!userId) { showToast("error", "Session habis. Silakan login ulang."); return; }
    if (!file)   { showToast("error", "Foto sampah wajib dilampirkan."); return; }

    // Validate entries
    for (const entry of sampahEntries) {
      if (!entry.jenisSampahId) { showToast("error", "Pilih jenis sampah untuk setiap baris."); return; }
      if (parseFloat(entry.berat) <= 0 || !entry.berat) { showToast("error", "Berat harus lebih dari 0 kg."); return; }
    }

    setLoading(true);

    // Upload photo first
    const uploadFd = new FormData();
    uploadFd.append("file", file);
    const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadFd });
    const uploadData = await uploadRes.json();

    if (!uploadData.success) {
      showToast("error", "Gagal mengunggah foto."); setLoading(false); return;
    }

    // Create laporan
    const fd = new FormData();
    fd.append("userId", userId);
    fd.append("jamPenjemputan", jamPenjemputan);
    fd.append("namaFile", uploadData.namaFile);
    fd.append("pathFile", uploadData.pathFile);
    sampahEntries.forEach((entry) => {
      fd.append("jenisSampahId", entry.jenisSampahId);
      fd.append("berat", entry.berat);
    });

    const res = await createLaporanAction(fd);
    setLoading(false);

    if (res.success) {
      showToast("success", res.message);
      setSampahEntries([{ jenisSampahId: "", berat: "" }]);
      setFile(null);
      setPreview("");
      if (fileRef.current) fileRef.current.value = "";
    } else {
      showToast("error", res.message);
    }
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.msg}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* 🕒 TIME SLOT PICKER */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="font-bold text-slate-800 mb-2">Pilih Slot Waktu Penjemputan</h2>
              <p className="text-xs text-slate-500 mb-4">Pilih estimasi jam kedatangan armada pengangkut sampah ke lokasi Anda</p>
              
              <div className="grid sm:grid-cols-3 gap-3">
                {timeSlots.map((slot) => {
                  const isSelected = jamPenjemputan === slot.value;
                  return (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => setJamPenjemputan(slot.value)}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between relative ${
                        isSelected
                          ? "bg-emerald-50/80 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                          : "bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 text-xs font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                          ✓ Dipilih
                        </span>
                      )}
                      <div>
                        <div className={`font-bold text-sm ${isSelected ? "text-emerald-900" : "text-slate-800"}`}>
                          {slot.label}
                        </div>
                        <div className={`text-xs font-mono-custom font-bold mt-1 ${isSelected ? "text-emerald-700" : "text-slate-600"}`}>
                          {slot.time}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-3 leading-tight">{slot.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Jenis Sampah Entries */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-800">Jenis & Berat Sampah</h2>
                <button type="button" onClick={addEntry}
                  className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                  style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
                  + Tambah Jenis
                </button>
              </div>

              <div className="space-y-3">
                {sampahEntries.map((entry, i) => (
                  <div key={i} className="flex gap-3 items-center p-4 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}>
                      {i + 1}
                    </div>
                    <select value={entry.jenisSampahId} onChange={(e) => updateEntry(i, "jenisSampahId", e.target.value)}
                      required className="input-base flex-1" style={{ margin: 0 }}>
                      <option value="">-- Pilih Jenis Sampah --</option>
                      {jenisSampahList.map((js) => (
                        <option key={js.id} value={js.id}>{js.namaJenis}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <input type="number" step="0.1" min="0.1" value={entry.berat}
                        onChange={(e) => updateEntry(i, "berat", e.target.value)}
                        placeholder="0.0" required className="input-base w-24" style={{ margin: 0 }} />
                      <span className="text-slate-500 text-sm font-medium">kg</span>
                    </div>
                    {sampahEntries.length > 1 && (
                      <button type="button" onClick={() => removeEntry(i)}
                        className="text-red-400 hover:text-red-600 text-lg flex-shrink-0">✕</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-eco w-full py-4 text-base">
              {loading ? <><span className="spinner" /> Menyimpan Laporan...</> : "Kirim Laporan"}
            </button>
          </form>
        </div>

        {/* Photo Upload Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
          <h2 className="font-bold text-slate-800 mb-4">Foto Bukti Sampah</h2>
          <p className="text-sm text-slate-400 mb-4">Upload foto sampah sebagai bukti laporan (wajib)</p>

          {/* Drop zone */}
          <label className="block w-full cursor-pointer">
            <div className="border-2 border-dashed rounded-xl p-6 text-center transition-colors hover:border-green-400"
              style={{ borderColor: preview ? "#16a34a" : "#e2e8f0", background: preview ? "#f0fdf4" : "#fafafa" }}>
              {preview ? (
                <img src={preview} alt="Preview" className="w-full rounded-lg object-cover max-h-56" />
              ) : (
                <div>
                  <div className="text-sm font-medium text-slate-500">Klik atau drag & drop foto</div>
                  <div className="text-xs text-slate-400 mt-1">JPG, PNG, max 5MB</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          {file && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-700 font-medium">
              <span className="truncate">{file.name}</span>
            </div>
          )}

          {preview && (
            <button type="button" onClick={() => { setFile(null); setPreview(""); if (fileRef.current) fileRef.current.value = ""; }}
              className="mt-3 text-xs text-red-400 hover:text-red-600 underline">
              Hapus foto
            </button>
          )}

          {/* Info */}
          <div className="mt-6 p-4 rounded-xl" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
            <div className="text-xs font-semibold text-green-700 mb-2">Panduan Laporan</div>
            <ul className="text-xs text-green-600 space-y-1">
              <li>• Satu laporan bisa berisi beberapa jenis sampah</li>
              <li>• Berat harus lebih dari 0 kg</li>
              <li>• Foto harus jelas dan tidak blur</li>
              <li>• Status awal: <strong>Menunggu</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
