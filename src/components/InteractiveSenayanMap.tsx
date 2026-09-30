"use client";

import { useState } from "react";

interface MapPoint {
  id: string;
  name: string;
  category: "Bank Sampah" | "Depo E-Waste" | "TPS 3R" | "Pos Medis";
  address: string;
  latPct: number;
  lngPct: number;
  status: "Sangat Aktif" | "Buka 24 Jam" | "Operasional Normal";
  wadahtype: string[];
  jam: string;
  kontak: string;
  kapasitas: number;
}

const mapPointsData: MapPoint[] = [
  {
    id: "p1",
    name: "Bank Sampah Senayan Asri (RW 02)",
    category: "Bank Sampah",
    address: "Jl. Senayan Utama No. 12, RW 02 Kebayoran Baru",
    latPct: 35,
    lngPct: 28,
    status: "Sangat Aktif",
    wadahtype: ["Organik", "Anorganik"],
    jam: "08:00 - 16:00 WIB",
    kontak: "0812-9988-7711",
    kapasitas: 75,
  },
  {
    id: "p2",
    name: "Depo E-Waste & B3 Kelurahan Gelora",
    category: "Depo E-Waste",
    address: "Jl. Asia Afrika (Samping Kantor Kelurahan Gelora)",
    latPct: 25,
    lngPct: 62,
    status: "Buka 24 Jam",
    wadahtype: ["Elektronik", "B3"],
    jam: "24 Jam Nonstop",
    kontak: "0811-3344-5566",
    kapasitas: 40,
  },
  {
    id: "p3",
    name: "TPS 3R Benhil Mandiri",
    category: "TPS 3R",
    address: "Jl. Bendungan Hilir Raya No. 45, Jakarta Pusat",
    latPct: 68,
    lngPct: 75,
    status: "Operasional Normal",
    wadahtype: ["Organik", "Residu", "Konstruksi"],
    jam: "06:00 - 18:00 WIB",
    kontak: "0813-8822-1100",
    kapasitas: 88,
  },
  {
    id: "p4",
    name: "Pos Penampungan Limbah Medis Puskesmas",
    category: "Pos Medis",
    address: "Jl. Lapangan Tembak Senayan No. 8",
    latPct: 58,
    lngPct: 32,
    status: "Operasional Normal",
    wadahtype: ["Medis", "B3"],
    jam: "07:30 - 17:00 WIB",
    kontak: "0815-4422-9900",
    kapasitas: 30,
  },
  {
    id: "p5",
    name: "Bank Sampah Unit Komplek DPR/MPR",
    category: "Bank Sampah",
    address: "Jl. Gatot Subroto, Komplek DPR RI Senayan",
    latPct: 45,
    lngPct: 52,
    status: "Sangat Aktif",
    wadahtype: ["Anorganik", "Komersial"],
    jam: "09:00 - 15:00 WIB",
    kontak: "0812-7711-2233",
    kapasitas: 60,
  },
];

export default function InteractiveSenayanMap() {
  const [filterCat, setFilterCat] = useState<string>("Semua");
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(mapPointsData[0]);

  const filteredPoints = filterCat === "Semua"
    ? mapPointsData
    : mapPointsData.filter((p) => p.category === filterCat);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl card-lift font-sans-custom my-10">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="badge-green mb-2">
            <span className="pulse-dot" />
            <span>PETA INTERAKTIF KECAMATAN SENAYAN</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Peta Distribusi Poin Penampungan TPS & Depo
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Klik pin titik penampungan pada peta untuk melihat informasi kapasitas, jenis sampah, & jadwal pengumpulan.
          </p>
        </div>

        {/* Filter Categories Dropdown Select */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono-custom text-slate-500 dark:text-slate-400 font-bold hidden sm:inline">Fasilitas:</label>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-mono-custom font-bold outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500 shadow-sm"
          >
            <option value="Semua">Semua Fasilitas Penampungan</option>
            <option value="Bank Sampah">Bank Sampah</option>
            <option value="Depo E-Waste">Depo E-Waste</option>
            <option value="TPS 3R">TPS 3R Mandiri</option>
            <option value="Pos Medis">Pos Limbah Medis</option>
          </select>
        </div>
      </div>

      {/* Map Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: The Interactive Canvas Map */}
        <div className="lg:col-span-2 relative w-full h-[400px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-inner group">
          {/* Map Vector Grid Visual */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.15), transparent 70%),
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "100% 100%, 30px 30px, 30px 30px",
            }}
          />

          {/* Area Senayan Landmarks Overlay Labels */}
          <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-emerald-400 text-[11px] font-mono-custom font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>SENAYAN LIVE MAP SYSTEM</span>
          </div>

          <div className="absolute bottom-4 left-4 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 text-[10px] font-mono-custom">
            Kawasan Gelora, Benhil, & Kebayoran Baru
          </div>

          {/* Render Pins / Markers */}
          {filteredPoints.map((point) => {
            const isSelected = selectedPoint?.id === point.id;
            return (
              <button
                key={point.id}
                onClick={() => setSelectedPoint(point)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer z-10 group/marker ${
                  isSelected ? "scale-125 z-30" : "hover:scale-115"
                }`}
                style={{ top: `${point.latPct}%`, left: `${point.lngPct}%` }}
              >
                {/* Ping Ring Effect */}
                <div
                  className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
                    point.category === "Depo E-Waste"
                      ? "bg-blue-400"
                      : point.category === "Pos Medis"
                      ? "bg-rose-400"
                      : "bg-emerald-400"
                  }`}
                />

                {/* Icon Pin Circle */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black shadow-2xl border-2 transition-all ${
                    isSelected
                      ? "bg-slate-900 text-emerald-400 border-emerald-400 ring-4 ring-emerald-500/30"
                      : "bg-slate-800/90 text-slate-300 border-slate-600 hover:border-emerald-400"
                  }`}
                >
                  TPS
                </div>

                {/* Tooltip Label */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950 text-white text-[10px] font-mono-custom font-bold px-2.5 py-1 rounded-md shadow-lg border border-slate-700 opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none">
                  {point.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right 1 Col: Active Selected Location Details */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
          {selectedPoint ? (
            <>
              <div className="flex items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                <div>
                  <span className="badge-green text-[10px] mb-1">{selectedPoint.category}</span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                    {selectedPoint.name}
                  </h4>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-slate-400 font-mono-custom block">Alamat Lokasi:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedPoint.address}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-mono-custom">Jam Operasional:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono-custom">{selectedPoint.jam}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-mono-custom">Kontak Layanan:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono-custom">{selectedPoint.kontak}</span>
                </div>

                {/* Capacity Progress Bar */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono-custom font-bold mb-1">
                    <span className="text-slate-500">Kapasitas Penampungan:</span>
                    <span className={selectedPoint.kapasitas > 80 ? "text-rose-500" : "text-emerald-500"}>
                      {selectedPoint.kapasitas}% Terisi
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        selectedPoint.kapasitas > 80 ? "bg-rose-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${selectedPoint.kapasitas}%` }}
                    />
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-mono-custom block mb-1.5">Jenis Sampah Diterima:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPoint.wadahtype.map((wt) => (
                      <span
                        key={wt}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono-custom font-bold text-slate-700 dark:text-slate-300"
                      >
                        {wt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(selectedPoint.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-eco w-full text-center text-xs py-2.5 flex items-center justify-center gap-1.5"
                >
                  Petunjuk Rute Navigasi Google Maps →
                </a>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">Pilih salah satu titik pin pada peta.</div>
          )}
        </div>
      </div>
    </div>
  );
}
