"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction, getDropdownData } from "@/actions/auth.action";
import FallingWasteAnimation from "@/components/FallingWasteAnimation";

interface JenisBangunan { id: string; namaJenisBangunan: string; }
interface Wilayah { id: string; namaWilayah: string; kelurahan: string; kecamatan: string; }

export default function RegisterPage() {
  const router = useRouter();
  const [jenisBangunanList, setJenisBangunanList] = useState<JenisBangunan[]>([]);
  const [wilayahList, setWilayahList] = useState<Wilayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    nama: "", email: "", password: "", noHp: "", nik: "",
    alamat: "", rt: "", rw: "", jenisBangunanId: "", wilayahId: "",
  });

  useEffect(() => {
    getDropdownData().then(({ jenisBangunan, wilayah }) => {
      setJenisBangunanList(jenisBangunan);
      setWilayahList(wilayah);
    });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    const res = await registerAction(fd);
    setLoading(false);
    if (res.success) {
      setSuccess(res.message);
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setError(res.message);
    }
  }

  const labelCls = "block text-xs font-mono-custom font-bold uppercase tracking-wider text-slate-700 mb-1.5";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 animated-grid-bg relative overflow-hidden">
      <FallingWasteAnimation />
      <div className="hero-orb-1" />
      <div className="hero-orb-2" />

      <div className="w-full max-w-2xl relative z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center p-1 bg-white border border-slate-200 shadow-md overflow-hidden">
              <img
                src="/logo.png"
                alt="EcoSort Senayan Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-black text-2xl text-slate-900 tracking-tight">EcoSort Senayan</span>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors mb-4">
            ← Kembali ke Beranda
          </Link>
          <div className="badge-green mb-2">REGISTRASI BANGUNAN</div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pendaftaran Akun Baru</h1>
          <p className="text-slate-500 text-sm mt-1">Satu bangunan wajib memiliki 1 akun terdaftar di Kecamatan Senayan</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl card-lift">

          {/* Step Indicator */}
          <div className="flex items-center mb-8">
            {[
              { num: 1, label: "Data Pribadi" },
              { num: 2, label: "Bangunan" },
              { num: 3, label: "Alamat & Lokasi" },
            ].map((s) => (
              <div key={s.num} className="flex items-center flex-1">
                <button onClick={() => setStep(s.num)}
                  className="w-9 h-9 rounded-full flex items-center justify-center font-mono-custom text-xs font-bold transition-all"
                  style={{
                    background: step >= s.num ? "#062414" : "#E2E8F0",
                    color: step >= s.num ? "#4ADE80" : "#94A3B8",
                    boxShadow: step === s.num ? "0 4px 12px rgba(6,36,20,0.3)" : "none"
                  }}>
                  {step > s.num ? "✓" : s.num}
                </button>
                <div className="font-mono-custom text-xs ml-2 font-bold uppercase hidden sm:block"
                  style={{ color: step >= s.num ? "#0F172A" : "#94A3B8" }}>
                  {s.label}
                </div>
                {s.num < 3 && <div className="flex-1 h-0.5 mx-3" style={{ background: step > s.num ? "#16A34A" : "#E2E8F0" }} />}
              </div>
            ))}
          </div>

          {success && (
            <div className="mb-6 p-4 rounded-xl font-mono-custom text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              ✅ {success}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 rounded-xl font-mono-custom text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-b pb-2">👤 Step 1: Data Pengelola</h2>
                <div>
                  <label className={labelCls}>Nama Lengkap *</label>
                  <input name="nama" value={form.nama} onChange={handleChange} placeholder="masukkan nama kamu" required className="input-light" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Email Akun *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@contoh.com" required className="input-light" />
                  </div>
                  <div>
                    <label className={labelCls}>Nomor HP *</label>
                    <input name="noHp" value={form.noHp} onChange={handleChange} placeholder="08xxxxxxxxxx" required className="input-light" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>NIK *</label>
                  <input name="nik" value={form.nik} onChange={handleChange} placeholder="16 Digit Nomor NIK" required className="input-light" />
                </div>
                <div>
                  <label className={labelCls}>Password *</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Minimal 8 Karakter" required className="input-light" />
                </div>
                <button type="button" onClick={() => setStep(2)} className="btn-eco w-full mt-2 py-3.5">
                  Lanjut ke Bangunan →
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-b pb-2">🏢 Step 2: Informasi Bangunan</h2>
                <div>
                  <label className={labelCls}>Jenis Bangunan *</label>
                  <select name="jenisBangunanId" value={form.jenisBangunanId} onChange={handleChange} required className="input-light">
                    <option value="">-- Pilih Jenis Bangunan --</option>
                    {jenisBangunanList.map((jb) => (
                      <option key={jb.id} value={jb.id}>{jb.namaJenisBangunan}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Wilayah Senayan *</label>
                  <select name="wilayahId" value={form.wilayahId} onChange={handleChange} required className="input-light">
                    <option value="">-- Pilih Wilayah --</option>
                    {wilayahList.map((w) => (
                      <option key={w.id} value={w.id}>{w.namaWilayah} - {w.kelurahan}, {w.kecamatan}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3.5">
                    ← Kembali
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="btn-eco flex-1 py-3.5">
                    Lanjut ke Lokasi →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-b pb-2">📍 Step 3: Alamat Bangunan</h2>
                <div>
                  <label className={labelCls}>Alamat Lengkap Bangunan *</label>
                  <input name="alamat" value={form.alamat} onChange={handleChange} placeholder="Jl. Siaga I, No. 123" required className="input-light" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>RT</label>
                    <input name="rt" value={form.rt} onChange={handleChange} placeholder="001" className="input-light" />
                  </div>
                  <div>
                    <label className={labelCls}>RW</label>
                    <input name="rw" value={form.rw} onChange={handleChange} placeholder="002" className="input-light" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1 py-3.5">
                    ← Kembali
                  </button>
                  <button type="submit" disabled={loading} className="btn-eco flex-1 py-3.5">
                    {loading ? <><span className="spinner" /> Mendaftar...</> : "✅ Daftar Akun Bangunan"}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <span className="text-slate-500 text-sm">Sudah punya akun? </span>
            <Link href="/login" className="nav-underline text-xs">
              Masuk Akun →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}