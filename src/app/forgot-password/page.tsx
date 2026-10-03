"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError("Masukkan alamat email Anda."); return; }
    setLoading(true);
    // Simulate delay (no SMTP in this project)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  }

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
      {/* Animated blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {[
          { top: "-15%", left: "-10%", size: 400, color: "rgba(74,222,128,0.12)" },
          { top: "60%", right: "-10%", size: 350, color: "rgba(20,184,166,0.10)" },
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

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>
        {/* Card */}
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
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 22 }}>Lupa Password</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginTop: 4 }}>
              EcoSort Senayan
            </div>
          </div>

          {!submitted ? (
            <>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, textAlign: "center", marginBottom: 24, lineHeight: 1.6 }}>
                Masukkan email terdaftar Anda. Kami akan mengirimkan instruksi reset password.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                    ALAMAT EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="nama@email.com"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: error ? "1.5px solid #f87171" : "1.5px solid rgba(255,255,255,0.15)",
                      background: "rgba(255,255,255,0.08)",
                      color: "#fff",
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {error && <p style={{ color: "#f87171", fontSize: 12, margin: "4px 0 0" }}>{error}</p>}
                </div>

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
                    transition: "opacity 0.2s",
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{ width: 16, height: 16, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                      Mengirim...
                    </>
                  ) : "📧 Kirim Instruksi Reset"}
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
              <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 18, margin: "0 0 10px" }}>
                Email Terkirim!
              </h3>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.7, margin: "0 0 24px" }}>
                Instruksi reset password telah dikirim ke <strong style={{ color: "#4ade80" }}>{email}</strong>.
                <br />Silakan cek inbox atau folder spam Anda.
              </p>
              <Link
                href="/reset-password"
                style={{
                  display: "block",
                  background: "linear-gradient(135deg, #16a34a, #4ade80)",
                  color: "#fff",
                  borderRadius: 12,
                  padding: "12px 0",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  textAlign: "center",
                  boxShadow: "0 4px 16px rgba(22,163,74,0.35)",
                  marginBottom: 12,
                }}
              >
                🔐 Lanjut ke Reset Password
              </Link>
            </div>
          )}

          {/* Back to login */}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Link
              href="/login"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 13,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              ← Kembali ke Login
            </Link>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
