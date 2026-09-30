"use client";

import React from "react";

interface TruckLoaderProps {
  message?: string;
  submessage?: string;
  fullScreen?: boolean;
}

export default function TruckLoader({
  message = "Truk Sampah Sedang Meluncur...",
  submessage = "EcoSort Senayan — Mengambil data & mempersiapkan halaman",
  fullScreen = true,
}: TruckLoaderProps) {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md text-white transition-opacity duration-300"
          : "w-full py-16 flex flex-col items-center justify-center text-slate-800"
      }
    >
      <style>{`
        @keyframes moveRoad {
          0% { background-position: 0 0; }
          100% { background-position: -80px 0; }
        }
        @keyframes truckBounce {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(-0.5deg); }
        }
        @keyframes wheelSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes leafExhaust {
          0% { opacity: 0.9; transform: translate(0, 0) scale(0.6) rotate(0deg); }
          50% { opacity: 0.6; transform: translate(-25px, -15px) scale(1) rotate(45deg); }
          100% { opacity: 0; transform: translate(-50px, -30px) scale(1.4) rotate(90deg); }
        }
        @keyframes speedLine {
          0% { opacity: 0; transform: translateX(60px); }
          50% { opacity: 0.8; }
          100% { opacity: 0; transform: translateX(-100px); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      {/* Main Container */}
      <div className="relative flex flex-col items-center max-w-sm px-6 text-center select-none">
        
        {/* Speed Lines Behind */}
        <div className="absolute top-10 w-72 h-20 overflow-hidden pointer-events-none opacity-40">
          <div
            className="h-[2px] bg-emerald-400 rounded-full absolute top-3 right-0 w-16"
            style={{ animation: "speedLine 1.2s infinite ease-out" }}
          />
          <div
            className="h-[2px] bg-emerald-300 rounded-full absolute top-8 right-4 w-24"
            style={{ animation: "speedLine 1.6s infinite linear 0.3s" }}
          />
          <div
            className="h-[2px] bg-emerald-400 rounded-full absolute top-14 right-2 w-12"
            style={{ animation: "speedLine 1s infinite ease-out 0.6s" }}
          />
        </div>

        {/* Truck Graphic */}
        <div className="relative mb-2" style={{ animation: "truckBounce 0.45s infinite ease-in-out" }}>
          
          {/* Leaf Exhaust Particles */}
          <div className="absolute bottom-6 -left-4 pointer-events-none z-10">
            <span
              className="absolute text-emerald-400 text-sm font-bold"
              style={{ animation: "leafExhaust 1.1s infinite ease-out" }}
            >
              🍃
            </span>
            <span
              className="absolute text-emerald-300 text-xs font-bold"
              style={{ animation: "leafExhaust 1.1s infinite ease-out 0.4s" }}
            >
              🌿
            </span>
            <span
              className="absolute text-green-400 text-xs"
              style={{ animation: "leafExhaust 1.1s infinite ease-out 0.7s" }}
            >
              ✨
            </span>
          </div>

          <svg width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Truck Shadow */}
            <ellipse cx="110" cy="108" rx="90" ry="7" fill="black" opacity="0.25" />

            {/* Container (Bak Sampah) */}
            <path
              d="M15 35C15 29.4772 19.4772 25 25 25H125V92H15V35Z"
              fill="url(#truckBodyGradient)"
            />
            {/* Rear slope of container */}
            <path d="M15 25L5 40V92H15V25Z" fill="#15803d" />
            
            {/* Container Stripes / Ribs */}
            <line x1="38" y1="28" x2="38" y2="88" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="62" y1="28" x2="62" y2="88" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="86" y1="28" x2="86" y2="88" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="110" y1="28" x2="110" y2="88" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />

            {/* EcoSort Logo / Icon on Container */}
            <rect x="44" y="42" width="52" height="30" rx="8" fill="#ffffff" opacity="0.9" />
            <text x="70" y="58" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#15803d">
              EcoSort
            </text>
            <text x="70" y="68" textAnchor="middle" fontSize="8" fontWeight="600" fill="#166534">
              ♻️ SENAYAN
            </text>

            {/* Cabin (Kepala Truk) */}
            <path
              d="M125 40H170C178.837 40 186.551 45.7487 189.043 54.223L197.867 84.223C199.255 88.9431 195.72 92.5 190.824 92.5H125V40Z"
              fill="url(#cabinGradient)"
            />

            {/* Cabin Window */}
            <path
              d="M135 46H165C170.5 46 175.2 50 176.8 55.5L181 70H135V46Z"
              fill="#e0f2fe"
              stroke="#0284c7"
              strokeWidth="1.5"
            />
            {/* Window Glare */}
            <path d="M142 49L155 49L145 66L138 66L142 49Z" fill="white" opacity="0.5" />
            
            {/* Driver Emoji in Window */}
            <text x="150" y="64" fontSize="14">🧑‍✈️</text>

            {/* Bumper Front */}
            <rect x="190" y="80" width="16" height="12" rx="3" fill="#334155" />
            {/* Headlight */}
            <path d="M198 83H204V89H198C196.343 89 195 87.657 195 86C195 84.3431 196.343 83 198 83Z" fill="#fef08a" />

            {/* Side Mirror */}
            <rect x="168" y="52" width="4" height="10" rx="1" fill="#1e293b" />

            {/* Mudguards */}
            <path d="M35 90C35 78 45 72 58 72C71 72 81 78 81 90H35Z" fill="#1e293b" />
            <path d="M140 90C140 78 150 72 163 72C176 72 186 78 186 90H140Z" fill="#1e293b" />

            {/* Wheels Container */}
            {/* Wheel 1 (Back) */}
            <g style={{ transformOrigin: "58px 90px", animation: "wheelSpin 0.4s infinite linear" }}>
              <circle cx="58" cy="90" r="18" fill="#0f172a" stroke="#475569" strokeWidth="3" />
              <circle cx="58" cy="90" r="10" fill="#94a3b8" />
              <circle cx="58" cy="90" r="4" fill="#0f172a" />
              <line x1="58" y1="74" x2="58" y2="106" stroke="#475569" strokeWidth="2" />
              <line x1="42" y1="90" x2="74" y2="90" stroke="#475569" strokeWidth="2" />
            </g>

            {/* Wheel 2 (Front) */}
            <g style={{ transformOrigin: "163px 90px", animation: "wheelSpin 0.4s infinite linear" }}>
              <circle cx="163" cy="90" r="18" fill="#0f172a" stroke="#475569" strokeWidth="3" />
              <circle cx="163" cy="90" r="10" fill="#94a3b8" />
              <circle cx="163" cy="90" r="4" fill="#0f172a" />
              <line x1="163" y1="74" x2="163" y2="106" stroke="#475569" strokeWidth="2" />
              <line x1="147" y1="90" x2="179" y2="90" stroke="#475569" strokeWidth="2" />
            </g>

            {/* Gradients */}
            <defs>
              <linearGradient id="truckBodyGradient" x1="15" y1="25" x2="125" y2="92" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22c55e" />
                <stop offset="1" stopColor="#15803d" />
              </linearGradient>
              <linearGradient id="cabinGradient" x1="125" y1="40" x2="195" y2="92" gradientUnits="userSpaceOnUse">
                <stop stopColor="#16a34a" />
                <stop offset="1" stopColor="#14532d" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Animated Road */}
        <div className="w-64 h-3 bg-slate-800 rounded-full overflow-hidden mb-6 shadow-inner relative border border-slate-700">
          <div
            className="w-[360px] h-full"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #ffffff 50%, transparent 50%)",
              backgroundSize: "40px 100%",
              animation: "moveRoad 0.35s infinite linear",
              opacity: 0.85,
            }}
          />
        </div>

        {/* Loading Text & Status */}
        <h3 className="font-bold text-lg md:text-xl text-emerald-400 tracking-wide mb-1 flex items-center justify-center gap-1">
          {message}
        </h3>
        <p className="text-xs text-slate-300 max-w-xs leading-relaxed font-mono-custom">
          {submessage}
        </p>

        {/* Animated Dots Progress */}
        <div className="flex gap-2 mt-4">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" style={{ animation: "pulseDot 0.8s infinite ease-in-out 0s" }} />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" style={{ animation: "pulseDot 0.8s infinite ease-in-out 0.2s" }} />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-300" style={{ animation: "pulseDot 0.8s infinite ease-in-out 0.4s" }} />
        </div>

      </div>
    </div>
  );
}
