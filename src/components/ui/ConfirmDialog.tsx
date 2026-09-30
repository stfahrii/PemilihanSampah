"use client";

import Icon from "@/components/ui/Icon";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = "Konfirmasi Hapus",
  message = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
  confirmLabel = "Ya, Hapus",
  cancelLabel = "Batal",
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.15s ease",
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "28px 28px 24px",
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 24px 60px rgba(0,0,0,0.20)",
          animation: "slideUp 0.2s ease",
        }}
      >
        {/* Icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: danger ? "#fef2f2" : "#f0fdf4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: danger ? "#dc2626" : "#16a34a",
            }}
          >
            <Icon name={danger ? "trash" : "check"} size={26} />
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            margin: "0 0 8px",
            fontSize: 18,
            fontWeight: 800,
            color: "#0f172a",
            textAlign: "center",
          }}
        >
          {title}
        </h3>

        {/* Message */}
        <p
          style={{
            margin: "0 0 24px",
            fontSize: 14,
            color: "#64748b",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "10px 0",
              border: "1.5px solid #e2e8f0",
              borderRadius: 12,
              background: "#f8fafc",
              color: "#475569",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#f8fafc")}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "10px 0",
              border: "none",
              borderRadius: 12,
              background: danger
                ? "linear-gradient(135deg, #ef4444, #dc2626)"
                : "linear-gradient(135deg, #16a34a, #4ade80)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s",
              boxShadow: danger
                ? "0 4px 14px rgba(220,38,38,0.35)"
                : "0 4px 14px rgba(22,163,74,0.35)",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
}
