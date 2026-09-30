import React from "react";

interface EmptyStateProps {
  icon?: string;
  illustration?: "reports" | "data" | "search" | "trash" | "calendar";
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}

const illustrations: Record<string, React.ReactNode> = {
  reports: (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="10" width="80" height="80" rx="10" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="2"/>
      <rect x="32" y="26" width="56" height="6" rx="3" fill="#bbf7d0"/>
      <rect x="32" y="40" width="40" height="6" rx="3" fill="#dcfce7"/>
      <rect x="32" y="54" width="48" height="6" rx="3" fill="#dcfce7"/>
      <rect x="32" y="68" width="32" height="6" rx="3" fill="#dcfce7"/>
      <circle cx="90" cy="80" r="18" fill="#16a34a"/>
    </svg>
  ),
  data: (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="20" width="90" height="60" rx="10" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="2"/>
      <rect x="15" y="20" width="90" height="20" rx="10" fill="#dcfce7"/>
      <rect x="15" y="30" width="90" height="10" fill="#dcfce7"/>
      <line x1="15" y1="50" x2="105" y2="50" stroke="#bbf7d0" strokeWidth="1.5"/>
      <line x1="15" y1="65" x2="105" y2="65" stroke="#bbf7d0" strokeWidth="1.5"/>
      <circle cx="95" cy="85" r="16" fill="#16a34a"/>
    </svg>
  ),
  search: (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="52" cy="44" r="28" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="2.5"/>
      <circle cx="52" cy="44" r="18" fill="#dcfce7"/>
      <line x1="72" y1="64" x2="92" y2="84" stroke="#16a34a" strokeWidth="5" strokeLinecap="round"/>
      <text x="52" y="51" textAnchor="middle" fontSize="20" fill="#16a34a">?</text>
    </svg>
  ),
  trash: (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="30" width="60" height="55" rx="8" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="2"/>
      <rect x="22" y="22" width="76" height="10" rx="5" fill="#dcfce7" stroke="#bbf7d0" strokeWidth="1.5"/>
      <rect x="44" y="14" width="32" height="12" rx="5" fill="#bbf7d0" stroke="#86efac" strokeWidth="1.5"/>
      <line x1="46" y1="45" x2="46" y2="72" stroke="#86efac" strokeWidth="2" strokeLinecap="round"/>
      <line x1="60" y1="45" x2="60" y2="72" stroke="#86efac" strokeWidth="2" strokeLinecap="round"/>
      <line x1="74" y1="45" x2="74" y2="72" stroke="#86efac" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  calendar: (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="20" width="84" height="70" rx="10" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="2"/>
      <rect x="18" y="20" width="84" height="22" rx="10" fill="#dcfce7"/>
      <rect x="18" y="33" width="84" height="9" fill="#dcfce7"/>
      <rect x="36" y="10" width="8" height="20" rx="4" fill="#16a34a"/>
      <rect x="76" y="10" width="8" height="20" rx="4" fill="#16a34a"/>
      <circle cx="42" cy="58" r="6" fill="#dcfce7"/>
      <circle cx="60" cy="58" r="6" fill="#dcfce7"/>
      <circle cx="78" cy="58" r="6" fill="#dcfce7"/>
      <circle cx="42" cy="74" r="6" fill="#dcfce7"/>
      <circle cx="60" cy="74" r="6" fill="#f0fdf4"/>
    </svg>
  ),
};

export default function EmptyState({
  icon,
  illustration = "data",
  title,
  subtitle,
  action,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      {/* Illustration */}
      <div style={{ marginBottom: 16 }}>
        {icon ? (
          <div style={{ fontSize: 64, lineHeight: 1 }}>{icon}</div>
        ) : (
          illustrations[illustration]
        )}
      </div>

      <h3
        style={{
          margin: "0 0 8px",
          fontSize: 16,
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        {title}
      </h3>

      {subtitle && (
        <p
          style={{
            margin: "0 0 20px",
            fontSize: 13,
            color: "#94a3b8",
            maxWidth: 300,
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          style={{
            background: "linear-gradient(135deg, #16a34a, #4ade80)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "10px 22px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(22,163,74,0.30)",
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
