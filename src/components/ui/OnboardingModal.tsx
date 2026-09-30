"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface OnboardingModalProps {
  userId: string;
  userName: string;
}

const steps = [
  {
    title: "Selamat Datang di EcoSort Senayan!",
    desc: "Sistem informasi pemilahan sampah yang membantu Anda dan petugas bekerja lebih efisien. Mari kenalan dulu yuk!",
    gradient: "linear-gradient(135deg, #062414 0%, #0B3820 60%, #16A34A 100%)",
    accent: "#4ade80",
    bg: "#f0fdf4",
  },
  {
    title: "Cara Melapor Sampah",
    desc: "Klik menu \"Lapor Sampah\", pilih jenis sampah yang ingin dijemput, masukkan berat estimasi, pilih sesi waktu penjemputan, dan upload foto jika ada.",
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)",
    accent: "#38bdf8",
    bg: "#f0f9ff",
    steps: ["Pilih jenis sampah", "Masukkan berat", "Pilih jam penjemputan", "Upload foto (opsional)", "Kirim laporan"],
  },
  {
    title: "Lacak Status Laporan",
    desc: "Di halaman Riwayat Laporan, Anda bisa memantau setiap laporan yang dibuat beserta statusnya secara real-time.",
    gradient: "linear-gradient(135deg, #3b0764 0%, #7c3aed 100%)",
    accent: "#c4b5fd",
    bg: "#faf5ff",
    statuses: [
      { label: "Menunggu", color: "#f59e0b", desc: "Laporan diterima, menunggu petugas" },
      { label: "Diproses", color: "#3b82f6", desc: "Petugas sedang dalam perjalanan" },
      { label: "Selesai", color: "#16a34a", desc: "Sampah berhasil diangkut" },
    ],
  },
  {
    title: "Semua Siap!",
    desc: "Anda sudah siap menggunakan EcoSort Senayan. Bersama, kita jaga kebersihan Senayan untuk masa depan yang lebih hijau.",
    gradient: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #16a34a 100%)",
    accent: "#34d399",
    bg: "#ecfdf5",
  },
];

export default function OnboardingModal({ userId, userName }: OnboardingModalProps) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const key = `onboarded_${userId}`;
    if (!localStorage.getItem(key)) {
      setVisible(true);
    }
  }, [userId]);

  function finish() {
    localStorage.setItem(`onboarded_${userId}`, "true");
    setVisible(false);
  }

  function handleNext() {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      finish();
    }
  }

  function handleSkip() {
    finish();
  }

  if (!visible) return null;

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)",
        animation: "fadeIn 0.25s ease",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          maxWidth: 460,
          width: "100%",
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
          animation: "slideUp 0.25s ease",
        }}
      >
        {/* Hero gradient area */}
        <div
          style={{
            background: current.gradient,
            padding: "36px 32px 32px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Skip button */}
          {!isLast && (
            <button
              onClick={handleSkip}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: 20,
                padding: "4px 12px",
                color: "rgba(255,255,255,0.7)",
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Lewati
            </button>
          )}

          <h2
            style={{
              margin: "0 0 8px",
              fontSize: 22,
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.3,
            }}
          >
            {step === 0 ? `Halo, ${userName}!` : current.title}
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
            {current.desc}
          </p>
        </div>

        {/* Content area */}
        <div style={{ padding: "24px 28px" }}>
          {/* Step 2: how to report */}
          {"steps" in current && current.steps && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {current.steps.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 12px",
                    background: current.bg,
                    borderRadius: 10,
                    fontSize: 13,
                    color: "#0f172a",
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: current.accent,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  {s}
                </div>
              ))}
            </div>
          )}

          {/* Step 3: status badges */}
          {"statuses" in current && current.statuses && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {current.statuses.map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    background: current.bg,
                    borderRadius: 10,
                  }}
                >
                  <span
                    style={{
                      background: s.color,
                      color: "#fff",
                      borderRadius: 20,
                      padding: "2px 10px",
                      fontSize: 11,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {s.label}
                  </span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{s.desc}</span>
                </div>
              ))}
            </div>
          )}

          {/* Progress dots + navigation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
            {/* Dots */}
            <div style={{ display: "flex", gap: 6 }}>
              {steps.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setStep(i)}
                  style={{
                    width: i === step ? 20 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: i === step ? "#16a34a" : "#e2e8f0",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                  }}
                />
              ))}
            </div>

            {/* Next / Finish button */}
            <button
              onClick={handleNext}
              style={{
                background: "linear-gradient(135deg, #16a34a, #4ade80)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "10px 22px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(22,163,74,0.35)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "transform 0.15s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {isLast ? "Mulai Sekarang!" : "Lanjut →"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
}
