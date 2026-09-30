// ── SKELETON COMPONENTS ───────────────────────────────────

/** Animated shimmer bar, configurable width/height */
export function SkeletonBar({
  width = "100%",
  height = 16,
  radius = 8,
  style = {},
}: {
  width?: string | number;
  height?: number;
  radius?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        ...style,
      }}
    />
  );
}

/** Skeleton for a table row with N columns */
export function SkeletonRow({ cols = 6 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: "14px 16px" }}>
          <SkeletonBar height={14} width={i === 0 ? 28 : "80%"} />
        </td>
      ))}
    </tr>
  );
}

/** Multiple skeleton rows for table body */
export function SkeletonTable({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} cols={cols} />
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0 }
          100% { background-position: 200% 0 }
        }
      `}</style>
    </>
  );
}

/** Skeleton for a stat/summary card */
export function SkeletonCard({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: "20px 24px",
        background: "#fff",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        ...style,
      }}
    >
      <SkeletonBar width={40} height={40} radius={12} />
      <SkeletonBar width="50%" height={12} />
      <SkeletonBar width="70%" height={22} radius={6} />
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0 }
          100% { background-position: 200% 0 }
        }
      `}</style>
    </div>
  );
}
