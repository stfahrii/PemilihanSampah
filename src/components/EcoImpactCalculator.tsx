"use client";

import { useState } from "react";

interface EcoImpactCalculatorProps {
  initialWeight?: number;
}

const categoryMultipliers: Record<string, { co2: number; trees: number; energy: number; water: number; desc: string }> = {
  Semua: {
    co2: 2.45,
    trees: 0.048,
    energy: 3.12,
    water: 14.8,
    desc: "Rata-rata gabungan dari 10 jenis sampah terdata.",
  },
  Organik: {
    co2: 1.80,
    trees: 0.012,
    energy: 1.50,
    water: 8.5,
    desc: "Diolah jadi pupuk kompos nutrisi tinggi untuk RPTRA Senayan.",
  },
  Anorganik: {
    co2: 3.20,
    trees: 0.085,
    energy: 4.80,
    water: 24.0,
    desc: "Daur ulang botol, kaca, kaleng & kardus jadi bahan baku pabrik.",
  },
  B3: {
    co2: 4.50,
    trees: 0.030,
    energy: 7.20,
    water: 32.0,
    desc: "Dekontaminasi bahan kimia & baterai bekas sesuai standar DLH.",
  },
  Residu: {
    co2: 1.10,
    trees: 0.005,
    energy: 0.80,
    water: 4.0,
    desc: "Pengurangan tumpukan limbah non-recyclable di TPA.",
  },
  Elektronik: {
    co2: 6.80,
    trees: 0.050,
    energy: 11.50,
    water: 48.0,
    desc: "Ekstraksi logam berharga PCB & komponen elektronik bekas.",
  },
  Medis: {
    co2: 5.20,
    trees: 0.020,
    energy: 8.40,
    water: 38.0,
    desc: "Insinerasi aman higienis limbah medis & fasilitas kesehatan.",
  },
  Industri: {
    co2: 5.80,
    trees: 0.060,
    energy: 9.80,
    water: 42.0,
    desc: "Pemanfaatan kembali sisa kain, drum & potongan logam pabrik.",
  },
  Komersial: {
    co2: 2.90,
    trees: 0.070,
    energy: 4.20,
    water: 20.0,
    desc: "Daur ulang kardus stok barang & kemasan toko/cafe.",
  },
  Pertanian: {
    co2: 1.60,
    trees: 0.015,
    energy: 1.30,
    water: 7.0,
    desc: "Pencacahan jerami & ranting kebun komunitas.",
  },
  Konstruksi: {
    co2: 3.80,
    trees: 0.025,
    energy: 6.00,
    water: 28.0,
    desc: "Pengolahan puing semen & material bekas renovasi.",
  },
};

const categoryOptions = [
  { value: "Semua", label: "Semua 10 Jenis Sampah" },
  { value: "Organik", label: "1. Sampah Organik" },
  { value: "Anorganik", label: "2. Sampah Anorganik" },
  { value: "B3", label: "3. B3 (Bahan Berbahaya & Beracun)" },
  { value: "Residu", label: "4. Sampah Residu" },
  { value: "Elektronik", label: "5. Sampah Elektronik (E-Waste)" },
  { value: "Medis", label: "6. Limbah Medis & Kesehatan" },
  { value: "Industri", label: "7. Limbah Industri Pabrik" },
  { value: "Komersial", label: "8. Limbah Komersial Usaha" },
  { value: "Pertanian", label: "9. Limbah Pertanian & Kebun" },
  { value: "Konstruksi", label: "10. Puing Sampah Konstruksi" },
];

export default function EcoImpactCalculator({ initialWeight = 25 }: EcoImpactCalculatorProps) {
  const [weightKg, setWeightKg] = useState<number>(initialWeight > 0 ? initialWeight : 25);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const factors = categoryMultipliers[selectedCategory] || categoryMultipliers["Semua"];

  const co2Saved = (weightKg * factors.co2).toFixed(1);
  const treesSaved = (weightKg * factors.trees).toFixed(2);
  const energySaved = (weightKg * factors.energy).toFixed(1);
  const waterSaved = (weightKg * factors.water).toFixed(0);

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 border border-emerald-500/30 shadow-2xl card-lift font-sans-custom my-8 relative overflow-hidden">
      {/* Background Glow Orb */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-5 relative z-10">
        <div>
          <div className="badge-green mb-2">
            <span className="pulse-dot" />
            <span>KALKULATOR DAMPAK LINGKUNGAN REAL-TIME</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Eco-Impact & Footprint Reduksi CO₂
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Hitung seberapa besar kontribusi daur ulang sampah Anda terhadap pemulihan bumi & ekosistem Senayan.
          </p>
        </div>

        {/* Category Dropdown Select */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono-custom text-slate-400 font-bold hidden sm:inline">Pilih Jenis:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 text-emerald-400 border border-emerald-500/40 rounded-xl px-4 py-2 text-xs font-mono-custom font-bold outline-none cursor-pointer focus:ring-2 focus:ring-emerald-400 shadow-lg"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-900 text-white py-1">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Weight Slider Controls */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono-custom font-bold text-slate-300 uppercase tracking-wider">
            TOTAL BERAT SAMPAH DIDAUR ULANG ({selectedCategory}):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="1000"
              value={weightKg}
              onChange={(e) => setWeightKg(Math.max(1, Number(e.target.value) || 1))}
              className="w-24 bg-slate-900 border border-emerald-500/50 rounded-xl px-3 py-1.5 text-right font-mono-custom font-black text-emerald-400 text-base outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <span className="font-mono-custom font-bold text-sm text-slate-400">Kg</span>
          </div>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min="1"
          max="300"
          value={weightKg}
          onChange={(e) => setWeightKg(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
        />

        <div className="flex items-center justify-between text-[10px] font-mono-custom">
          <span className="text-slate-500">Rentang: 1 kg - 300 kg+</span>
          <span className="text-emerald-400 font-bold">{factors.desc}</span>
        </div>
      </div>

      {/* Impact Result Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        {/* Card 1: CO2 */}
        <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-5 backdrop-blur-md hover:border-emerald-400 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono-custom font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
              EMISI TERSALURKAN
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-black font-mono-custom text-white tracking-tight">
            {co2Saved} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
          <div className="text-xs font-bold text-slate-300 mt-1">Reduksi Emisi CO₂</div>
          <div className="text-[10px] text-slate-400 mt-1 leading-snug">
            Cegah efek rumah kaca & polusi udara kawasan.
          </div>
        </div>

        {/* Card 2: Trees */}
        <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-5 backdrop-blur-md hover:border-emerald-400 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono-custom font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
              EKOSISTEM
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-black font-mono-custom text-emerald-400 tracking-tight">
            {treesSaved} <span className="text-xs font-normal text-slate-400">pohon</span>
          </div>
          <div className="text-xs font-bold text-slate-300 mt-1">Pohon Terselamatkan</div>
          <div className="text-[10px] text-slate-400 mt-1 leading-snug">
            Setara daya serap oksigen dari pohon penghijauan.
          </div>
        </div>

        {/* Card 3: Energy */}
        <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-5 backdrop-blur-md hover:border-emerald-400 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono-custom font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
              PENGHEMATAN
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-black font-mono-custom text-amber-400 tracking-tight">
            {energySaved} <span className="text-xs font-normal text-slate-400">kWh</span>
          </div>
          <div className="text-xs font-bold text-slate-300 mt-1">Hemat Listrik</div>
          <div className="text-[10px] text-slate-400 mt-1 leading-snug">
            Cukup menyalakan lampu LED rumah selama 300+ jam.
          </div>
        </div>

        {/* Card 4: Water */}
        <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-5 backdrop-blur-md hover:border-emerald-400 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono-custom font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/30">
              SUMBER DAYA
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-black font-mono-custom text-blue-400 tracking-tight">
            {waterSaved} <span className="text-xs font-normal text-slate-400">Liter</span>
          </div>
          <div className="text-xs font-bold text-slate-300 mt-1">Hemat Air Bersih</div>
          <div className="text-[10px] text-slate-400 mt-1 leading-snug">
            Air yang dihemat dari proses manufaktur daur ulang.
          </div>
        </div>
      </div>
    </div>
  );
}
