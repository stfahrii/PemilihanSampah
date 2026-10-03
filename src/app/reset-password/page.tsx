"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", nik: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { email, nik, newPassword, confirmPassword } = form;

    if (!email || !nik || !newPassword || !confirmPassword) {
      setError("Semua field harus diisi."); return;
    }
    if (newPassword.length < 8) {
      setError("Password minimal 8 karakter."); return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok."); return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nik, newPassword }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Gagal mereset password."); return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = (hasError = false): React.CSSProperties => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: hasError ? "1.5px solid #f87171" : "1.5px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #062414 0%, #0B3820 50%, #16A34A 100%)",
        padding: 16,
        fontFamily: "'Space Grotesk','Inter',sans-serif",
      }}
    >
      {/* Blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {[
          { top: "-10%", left: "-8%", size: 380, color: "rgba(74,222,128,0.12)" },
          { top: "55%", right: "-8%", size: 340, color: "rgba(20,184,166,0.10)" },
        ].map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: b.top,
              left: (b as any).left,
              right: (b as any).right,
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              background: b.color,
              filter: "blur(60px)",
            }}
          />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440 }}>
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 24,
            padding: "40px 36px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
                boxShadow: "0 8px 24px rgba(22,163,74,0.3)",
                padding: 6,
                overflow: "hidden",
              }}
            >
              <img
                src="/logo.png"
                alt="EcoSort Senayan Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 22 }}>Reset Password</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginTop: 4 }}>
              Verifikasi identitas & buat password baru
            </div>
          </div>

          {success ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>🎉</div>
              <h3 style={{ color: "#4ade80", fontWeight: 800, fontSize: 18, margin: "0 0 8px" }}>
                Password Berhasil Diubah!
              </h3>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.7 }}>
                Mengalihkan ke halaman login...
              </p>
              <div style={{ width: 36, height: 36, border: "3px solid #4ade80", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "16px auto 0" }} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Email */}
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  EMAIL TERDAFTAR
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  style={inputStyle(!!error)}
                />
              </div>

              {/* NIK */}
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  NIK (Verifikasi Identitas)
                </label>
                <input
                  name="nik"
                  type="text"
                  maxLength={16}
                  value={form.nik}
                  onChange={handleChange}
                  placeholder="16 digit NIK KTP"
                  style={inputStyle(!!error)}
                />
              </div>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, whiteSpace: "nowrap" }}>PASSWORD BARU</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
              </div>

              {/* New password */}
              <div style={{ position: "relative" }}>
                <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  PASSWORD BARU
                </label>
                <input
                  name="newPassword"
                  type={showPass ? "text" : "password"}
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Minimal 8 karakter"
                  style={{ ...inputStyle(!!error), paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: 12, bottom: 12, background: "none", border: "none", cursor: "pointer", fontSize: 16 }}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Confirm password */}
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  KONFIRMASI PASSWORD
                </label>
                <input
                  name="confirmPassword"
                  type={showPass ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi password baru"
                  style={inputStyle(!!error && form.newPassword !== form.confirmPassword)}
                />
              </div>

              {/* Strength hint */}
              {form.newPassword && (
                <div style={{ display: "flex", gap: 4 }}>
                  {[1, 2, 3, 4].map((lvl) => {
                    const len = form.newPassword.length;
                    const filled =
                      lvl === 1 ? len >= 4 :
                      lvl === 2 ? len >= 8 :
                      lvl === 3 ? (len >= 10 && /[A-Z]/.test(form.newPassword)) :
                      (len >= 12 && /[A-Z]/.test(form.newPassword) && /[0-9]/.test(form.newPassword));
                    const color = lvl <= 2 ? "#f59e0b" : lvl === 3 ? "#3b82f6" : "#16a34a";
                    return (
                      <div key={lvl} style={{ flex: 1, height: 4, borderRadius: 2, background: filled ? color : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
                    );
                  })}
                </div>
              )}

              {error && (
                <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", color: "#fca5a5", fontSize: 13 }}>
                  ❌ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? "rgba(74,222,128,0.5)" : "linear-gradient(135deg, #16a34a, #4ade80)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "13px 0",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 16px rgba(22,163,74,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                {loading ? (
                  <>
                    <div style={{ width: 16, height: 16, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                    Menyimpan...
                  </>
                ) : "🔐 Simpan Password Baru"}
              </button>
            </form>
          )}

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Link href="/login" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>
              ← Kembali ke Login
            </Link>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
