"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/actions/auth.action";
import FallingWasteAnimation from "@/components/FallingWasteAnimation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData();
    fd.append("email", email);
    fd.append("password", password);

    const res = await loginAction(fd);
    setLoading(false);

    if (res.success) {
      sessionStorage.setItem("userId", res.userId ?? "");
      sessionStorage.setItem("userNama", res.nama ?? "");
      sessionStorage.setItem("userRole", res.role ?? "User");

      if (res.role === "Admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } else {
      setError(res.message);
    }
  }

  return (
    <div className="min-h-screen flex animated-grid-bg relative overflow-hidden">
      <FallingWasteAnimation />
      <div className="hero-orb-1" />
      <div className="hero-orb-2" />

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 dark-panel relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center p-1 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg overflow-hidden">
              <img
                src="/logo.png"
                alt="EcoSort Senayan Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-black text-xl text-white leading-none">EcoSort</div>
              <div className="font-mono-custom text-xs text-emerald-400 font-bold uppercase tracking-widest mt-0.5">Senayan</div>
            </div>
          </div>

          <div className="badge-green mb-6">
            <span className="pulse-dot" />
            <span>PORTAL LOGIN KECAMATAN</span>
          </div>

          <h2 className="text-4xl font-black leading-tight text-white mb-6 tracking-tight">
            Pengelolaan Sampah <br />
            <span className="gradient-text">Berbasis Web</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-md">
            Sistem terintegrasi untuk mencatat, melacak, dan menugaskan pengangkutan sampah di seluruh bangunan Kecamatan Senayan.
          </p>

          <div className="space-y-4">
            {[
              { icon: "🏢", title: "500+ Bangunan", desc: "Rumah, Gedung, Pabrik, RS, Hotel, Perkantoran" },
              { icon: "⚖️", title: "Pencatatan Berat (Kg)", desc: "Organik, Anorganik, B3, Medis, Industri" },
              { icon: "👷", title: "Penugasan Petugas", desc: "Jadwal pengangkutan otomatis & transparan" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-bold text-white text-sm">{item.title}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="font-mono-custom text-xs text-slate-500">
          © 2026 EcoSort Senayan · Jakarta Pusat
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 card-lift shadow-xl">

            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors">
                ← Kembali ke Beranda
              </Link>
              <div className="flex lg:hidden items-center gap-2">
                <img src="/logo.png" alt="EcoSort Senayan Logo" className="w-8 h-8 object-contain" />
              </div>
            </div>

            <div className="badge-amber mb-3">AUTENTIKASI</div>
            <h1 className="text-2xl font-black text-slate-900 mb-1">Masuk Akun</h1>
            <p className="text-slate-500 text-sm mb-6">Masukkan email dan password bangunan Anda</p>

            {error && (
              <div className="mb-6 p-4 rounded-xl text-xs font-mono-custom font-bold bg-rose-50 text-rose-700 border border-rose-200">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono-custom font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Akun
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@senayan.go.id"
                  required
                  disabled={loading}
                  className="input-light"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-custom font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="input-light"
                    style={{ paddingRight: "48px" }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm">
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Forgot password link */}
              <div className="text-right" style={{ marginTop: -4 }}>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold"
                  style={{ color: "#16a34a", textDecoration: "none" }}
                >
                  Lupa Password?
                </Link>
              </div>

              <button type="submit" disabled={loading} className="btn-eco w-full mt-2 py-3.5">
                {loading ? <><span className="spinner" /> Memproses...</> : "🔐 Masuk Akun"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <span className="text-slate-500 text-sm">Belum punya akun? </span>
              <Link href="/register" className="nav-underline text-xs">
                Daftar Bangunan Baru →
              </Link>
            </div>

            {/* Demo hint */}
            <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white font-mono-custom text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                <span className="pulse-dot" />
                <span>AKUN DEMO ADMIN</span>
              </div>
              <div className="text-slate-300">Email: admin@ecosort.id</div>
              <div className="text-slate-300">Password: admin123</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}