"use client";

import { useEffect, useState } from "react";

interface WasteItem {
  id: number;
  emoji: string;
  label: string;
  left: number; // percentage X
  duration: number; // seconds to fall
  delay: number; // seconds delay start
  size: number; // px size
  opacity: number;
  rotateDirection: number; // -1 or 1
}

const WASTE_EMOJIS = [
  { emoji: "🍎", label: "Organik - Apel" },
  { emoji: "🍌", label: "Organik - Pisang" },
  { emoji: "🥬", label: "Organik - Sayur" },
  { emoji: "🍂", label: "Organik - Daun" },
  { emoji: "🍾", label: "Anorganik - Botol Kaca" },
  { emoji: "🥤", label: "Anorganik - Gelas Plastik" },
  { emoji: "📦", label: "Anorganik - Kardus" },
  { emoji: "🥫", label: "Anorganik - Kaleng" },
  { emoji: "🔋", label: "B3 - Baterai" },
  { emoji: "🧪", label: "B3 - Botol Kimia" },
  { emoji: "📱", label: "E-Waste - HP Bekas" },
  { emoji: "🗞️", label: "Residu - Tisu/Kertas" },
];

export default function FallingWasteAnimation() {
  const [items, setItems] = useState<WasteItem[]>([]);

  useEffect(() => {
    // Generate 18 randomized falling waste items across the screen
    const generated: WasteItem[] = Array.from({ length: 18 }).map((_, index) => {
      const wasteType = WASTE_EMOJIS[index % WASTE_EMOJIS.length];
      return {
        id: index,
        emoji: wasteType.emoji,
        label: wasteType.label,
        left: Math.random() * 92 + 3, // 3% to 95% width
        duration: Math.random() * 8 + 7, // 7s to 15s fall duration
        delay: Math.random() * 6, // 0s to 6s stagger
        size: Math.random() * 14 + 20, // 20px to 34px font size
        opacity: Math.random() * 0.4 + 0.3, // 0.3 to 0.7 opacity
        rotateDirection: Math.random() > 0.5 ? 1 : -1,
      };
    });

    setItems(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none aria-hidden">
      {items.map((item) => (
        <div
          key={item.id}
          title={item.label}
          className="absolute top-[-50px] animate-falling-waste"
          style={{
            left: `${item.left}%`,
            fontSize: `${item.size}px`,
            opacity: item.opacity,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
            filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15))",
          }}
        >
          {item.emoji}
        </div>
      ))}
    </div>
  );
}
