

import { useEffect, useState } from "react";
import { useBodyStore } from "../bodyStore";

type circularMeterProps = {
  value: number;
  max: number;
  label: string;
  unit: string;
  color: string[];
  gradientId: string;
  size?: number;
};

type StatusPillprops = {
  label: string;
  value: string;
  color?: string;
  
};
// ── Helpers ─────────────────────────────
function safePct(value: number, max: number) {
  if (!max || max <= 0) return 0;
  return Math.min((value / max) * 100, 100);
}

// ── Circular Progress (Refined & Modern) ───────────────────
function CircularMeter({ value, max, label, unit, color, gradientId, size = 120 }:circularMeterProps) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 400);
    return () => clearTimeout(t);
  }, [value]);

  const r = size / 2 - 10;
  const circ = 2 * Math.PI * r;
  const pct = safePct(animated, max);
  const offset = circ * (1 - pct / 100);

  return (
    <div className="flex flex-col items-center group cursor-default">
      <div className="relative mb-3" style={{ width: size, height: size }}>
        {/* Glow Effect (Very Subtle) */}
        <div className="absolute inset-0 rounded-full blur-xl opacity-10 transition-opacity group-hover:opacity-20"
             style={{ backgroundColor: color[0] }}></div>

        <svg width={size} height={size} className="-rotate-90 relative z-10">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color[0]} />
              <stop offset="100%" stopColor={color[1]} />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" 
                  className="text-slate-200/40" strokeWidth={5} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${gradientId})`} 
                  strokeWidth={6} strokeLinecap="round" strokeDasharray={circ} 
                  strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-xl font-bold text-slate-800 tracking-tight">
            {value % 1 ? value.toFixed(1) : Math.round(value)}
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase">{unit}</span>
        </div>
      </div>
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-800 transition-colors">
        {label}
      </span>
    </div>
  );
}

// ── Status Pill (Improved Glassmorphism) ─────────────────────────
function StatusPill({ label, value }: StatusPillprops) {
  return (
    <div className="flex flex-col gap-1 px-4 py-2.5 rounded-xl backdrop-blur-xl border border-white/40 shadow-sm bg-white/30">
      <span className="text-[9px] uppercase font-black tracking-[0.15em] text-slate-400">{label}</span>
      <span className="text-xs font-bold text-slate-700">{value}</span>
    </div>
  );
}

export function BodyDashboard() {
  const { profile, metrics, ruleBase } = useBodyStore();

  if (!metrics || !ruleBase || !profile) return null;

  // ألوان هادئة واحترافية (Muted Palettes)
  const meters = [
    { value: metrics.bmi,                        max: 40, label: "BMI",       unit: "kg/m²", color: ["#818cf8", "#6366f1"], id: "g1" },
    { value: metrics.body_fat_percentage,        max: 40, label: "Body Fat", unit: "%",     color: ["#fda4af", "#fb7185"], id: "g2" },
    { value: (metrics.lean_mass/profile.weight)*100, max: 100, label: "Lean Mass", unit: "%",     color: ["#6ee7b7", "#10b981"], id: "g3" },
    { value: metrics.bmr,                        max: 2500, label: "BMR",     unit: "kcal",  color: ["#fcd34d", "#f59e0b"], id: "g4" },
    { value: metrics.tdee,                       max: 4000, label: "TDEE",    unit: "kcal",  color: ["#7dd3fc", "#0ea5e9"], id: "g5" },
    { value: metrics.fat_mass,                   max: profile.weight, label: "Fat Mass", unit: "kg", color: ["#fca5a5", "#ef4444"], id: "g6" },
    { value: metrics.lean_mass,                  max: profile.weight, label: "Muscle",   unit: "kg", color: ["#86efac", "#22c55e"], id: "g7" },
    { value: metrics.ideal_body_fat_percentage,  max: 40, label: "Ideal %",   unit: "%",     color: ["#d8b4fe", "#a855f7"], id: "g8" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden bg-slate-50 min-h-[600px] flex flex-col"
         style={{ backgroundImage: 'url(/src/assets/body.jpeg)', backgroundSize: 'cover', backgroundPosition: ' top center' }}>
      
      {/* طبقة التدرج اللوني لضمان وضوح النصوص (Overlay) */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/10 -z-10"></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Body Metrics</h2>
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{ruleBase.primary_pattern}</p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black border border-indigo-100 shadow-sm uppercase">
            {ruleBase.bmi_category}
          </span>
          <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-100 shadow-sm uppercase">
            {ruleBase.metabolic_status}
          </span>
        </div>
      </div>

      {/* Meters Grid - زيادة المسافات (Gap) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 mb-12">
        {meters.map((m) => <CircularMeter key={m.id} {...m} gradientId={m.id} />)}
      </div>

      {/* Pills & Insights Footer */}
      <div className="mt-auto space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <StatusPill label="Metabolism" value={ruleBase.metabolic_status} />
          <StatusPill label="BFP Category" value={ruleBase.bfp_category} />
          <StatusPill label="Segment" value={ruleBase.segment} />
        </div>

        <div className="bg-slate-900/90 backdrop-blur-2xl rounded-2xl p-5 text-white shadow-xl border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-sm font-medium text-slate-200">
              Your condition is <span className="text-indigo-400 font-bold">{ruleBase.primary_pattern}</span>.You Need<span className="text-amber-400 font-bold">{Math.round(metrics.tdee)}</span> calories per day.
            </p>
            {metrics.fat_to_lose > 0 && (
              <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/30">
                <span className="text-xs font-bold text-red-300 italic">Target: -{metrics.fat_to_lose.toFixed(1)}kg Fat</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )}