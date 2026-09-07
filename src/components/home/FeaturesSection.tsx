
// import { useEffect, useRef, useState } from "react";

// // ─── Types ─────────────────────────────────────────────────────────────────
// interface ExampleMetric {
//   label: string;
//   value: string;
//   meaning: string;
//   color: string;
// }

// interface Feature {
//   id: number;
//   icon: React.ReactNode;
//   accentColor: string;
//   borderColor: string;
//   glowColor: string;
//   title: string;
//   description: string;
//   examples: ExampleMetric[];
// }

// // ─── Icon Components ────────────────────────────────────────────────────────
// const BodyIcon = () => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a2 2 0 100 4 2 2 0 000-4zM8 8.5C8 7.67 8.67 7 9.5 7h5c.83 0 1.5.67 1.5 1.5v5l1.5 5h-2l-1-3h-3l-1 3H8l1.5-5v-5z" />
//   </svg>
// );

// const SleepIcon = () => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
//   </svg>
// );

// const WorkoutIcon = () => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h2m0 0V6m0 2v2M18 8h2m-2 0V6m0 2v2M6 12h12M8 12v4m8-4v4M3 8h1m16 0h1" />
//   </svg>
// );

// // ─── Animated Bar ────────────────────────────────────────────────────────────
// const AnimatedBar: React.FC<{ percent: number; color: string; visible: boolean; delay?: number }> = ({
//   percent, color, visible, delay = 0
// }) => {
//   const [width, setWidth] = useState(0);
//   useEffect(() => {
//     if (!visible) return;
//     const t = setTimeout(() => setWidth(percent), delay);
//     return () => clearTimeout(t);
//   }, [visible, percent, delay]);

//   return (
//     <div className="h-1 rounded-full bg-white/5 overflow-hidden">
//       <div
//         className="h-full rounded-full"
//         style={{
//           width: `${width}%`,
//           background: color,
//           transition: "width 1.2s cubic-bezier(.4,0,.2,1)",
//         }}
//       />
//     </div>
//   );
// };

// // ─── Feature Card ────────────────────────────────────────────────────────────
// const FeatureCard: React.FC<{ feature: Feature; visible: boolean; delay: number }> = ({
//   feature, visible, delay
// }) => (
//   <div
//     className="relative rounded-2xl p-6 border backdrop-blur-sm overflow-hidden
//       transition-colors duration-300  hover:-translate-y-1 group"
//     style={{
//       borderColor: visible ? feature.borderColor : "rgba(255,255,255,0.05)",
//       opacity: visible ? 1 : 0,
//       transform: visible ? "translateY(0)" : "translateY(32px)",
//       transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
//     }}
//   >
//     {/* Top accent line */}
//     <div
//       className="absolute top-0 left-0 right-0 h-px"
//       style={{ background: `linear-gradient(90deg, transparent, ${feature.accentColor}, transparent)` }}
//     />

//     {/* Hover glow */}
//     <div
//       className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
//       style={{ boxShadow: `inset 0 0 40px ${feature.glowColor}` }}
//     />

//     {/* Icon */}
//     <div
//       className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
//       style={{ background: feature.glowColor, color: feature.accentColor }}
//     >
//       {feature.icon}
//     </div>

//     {/* Title & Description */}
//     <h3 className="text-white font-bold text-xl mb-2">{feature.title}</h3>
//     <p className="text-slate-400 text-sm leading-relaxed mb-5">{feature.description}</p>

//     {/* Example Metrics */}
//     <div className="space-y-3">
//       {feature.examples.map((ex, i) => (
//         <div key={i}>
//           <div className="flex items-center justify-between mb-1">
//             <span className="text-slate-400 text-xs">{ex.label}</span>
//             <span className="font-bold text-sm" style={{ color: feature.accentColor }}>
//               {ex.value}
//             </span>
//           </div>
//           <AnimatedBar
//             percent={parseInt(ex.value) || 70}
//             color={feature.accentColor}
//             visible={visible}
//             delay={delay + i * 150}
//           />
//           <p className="text-slate-600 text-xs mt-1">{ex.meaning}</p>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// // ─── Data ────────────────────────────────────────────────────────────────────
// const features: Feature[] = [
//   {
//     id: 1,
//     accentColor: "#22d3ee",
//     borderColor: "rgba(34,211,238,0.15)",
//     glowColor: "rgba(34,211,238,0.06)",
//     icon: <BodyIcon />,
//     title: "Body Metrics",
//     description:
//       "Enter your height, weight and activity level — we calculate your core health indicators and explain exactly what each number means for you.",
//     examples: [
//       { label: "BMI = 23.4", value: "78", meaning: "Your weight is healthy relative to your height ✓", color: "#22d3ee" },
//       { label: "BMR = 1820 kcal", value: "60", meaning: "Calories your body burns at complete rest", color: "#22d3ee" },
//       { label: "TDEE = 2548 kcal", value: "85", meaning: "Your actual daily caloric requirement", color: "#22d3ee" },
//     ],
//   },
//   {
//     id: 2,
//     accentColor: "#818cf8",
//     borderColor: "rgba(129,140,248,0.15)",
//     glowColor: "rgba(129,140,248,0.06)",
//     icon: <SleepIcon />,
//     title: "Sleep Analysis",
//     description:
//       "Log your sleep details — caffeine intake, exercise, wake-ups — and receive a clear efficiency score with a breakdown of every influencing factor.",
//     examples: [
//       { label: "Sleep Score = 82/100", value: "82", meaning: "Good sleep quality, with room to improve", color: "#818cf8" },
//       { label: "Efficiency = 89%", value: "89", meaning: "89% of time in bed was actual sleep", color: "#818cf8" },
//       { label: "Deep Sleep = 1.8h", value: "45", meaning: "Slightly below the optimal deep sleep range", color: "#818cf8" },
//     ],
//   },
//   {
//     id: 3,
//     accentColor: "#34d399",
//     borderColor: "rgba(52,211,153,0.15)",
//     glowColor: "rgba(52,211,153,0.06)",
//     icon: <WorkoutIcon />,
//     title: "Workout Plan",
//     description:
//       "Set your goal and fitness level — we generate a complete weekly training program tailored precisely to your body and lifestyle.",
//     examples: [
//       { label: "Goal: Muscle Gain", value: "70", meaning: "Program built around progressive muscle growth", color: "#34d399" },
//       { label: "4 sessions / week", value: "57", meaning: "4 training days + 3 active recovery days", color: "#34d399" },
//       { label: "Level: Intermediate", value: "65", meaning: "Moderate difficulty with gradual progression", color: "#34d399" },
//     ],
//   },
// ];

// // ─── Summary Card ─────────────────────────────────────────────────────────────
// const SummaryCard: React.FC<{ visible: boolean }> = ({ visible }) => (
//   <div
//     className="relative rounded-2xl p-8 border overflow-hidden"
//     style={{
//       borderColor: "rgba(255,255,255,0.08)",
//       background: "linear-gradient(135deg, rgba(34,211,238,0.04), rgba(129,140,248,0.04), rgba(52,211,153,0.04))",
//       opacity: visible ? 1 : 0,
//       transform: visible ? "translateY(0)" : "translateY(32px)",
//       transition: "opacity 0.7s ease 500ms, transform 0.7s ease 500ms",
//     }}
//   >
//     {/* Top accent */}
//     <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-500/40 via-indigo-500/40 to-emerald-500/40" />

//     <div className="flex flex-col md:flex-row md:items-center gap-8">
//       {/* Left: text */}
//       <div className="flex-1">
//         <span className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 text-slate-400 text-xs font-semibold tracking-widest uppercase mb-4">
//           The Full Picture
//         </span>
//         <h3 className="text-white font-extrabold text-2xl md:text-3xl mb-3 leading-snug">
//           Everything comes together —
//           <br />
//           <span
//             style={{
//               background: "linear-gradient(90deg,#22d3ee,#818cf8,#34d399)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               backgroundClip: "text",
//             }}
//           >
//             you see the complete you.
//           </span>
//         </h3>
//         <p className="text-slate-400 text-sm leading-relaxed max-w-md">
//           For example: a user with a healthy BMI (23) but poor sleep (score 55) and calories below
//           their TDEE — the app generates a full analysis and tells them exactly what the problem is
//           and how to fix it.
//         </p>
//       </div>

//       {/* Right: mock result */}
//       <div className="flex-shrink-0 w-full md:w-72 rounded-xl border border-white/5 bg-white/[0.03] p-5 space-y-3">
//         <p className="text-slate-500 text-xs font-semibold tracking-widest uppercase mb-3">
//           Example Result
//         </p>
//         {[
//           { label: "Overall Status", value: "Normal", color: "#34d399" },
//           { label: "Sleep Warning", value: "Needs Improvement", color: "#f59e0b" },
//           { label: "Suggested Plan", value: "Muscle Gain 4x", color: "#22d3ee" },
//           { label: "Daily Calories", value: "2548 kcal/day", color: "#818cf8" },
//         ].map((item, i) => (
//           <div
//             key={i}
//             className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
//             style={{
//               opacity: visible ? 1 : 0,
//               transition: `opacity 0.5s ease ${600 + i * 100}ms`,
//             }}
//           >
//             <span className="text-slate-500 text-xs">{item.label}</span>
//             <span className="text-xs font-bold" style={{ color: item.color }}>
//               {item.value}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// );

// // ─── Main Section ─────────────────────────────────────────────────────────────
// const FeaturesSection: React.FC = () => {
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => { if (entry.isIntersecting) setVisible(true); },
//       { threshold: 0.1 }
//     );
//     if (sectionRef.current) observer.observe(sectionRef.current);
//     return () => observer.disconnect();
//   }, []);

//   return (
//     <section ref={sectionRef} className="relative bg-slate-950 py-24 px-4 overflow-hidden">
//       {/* Background glows */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
//       <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

//       {/* Header */}
//       <div
//         className="text-center mb-16"
//         style={{
//           opacity: visible ? 1 : 0,
//           transform: visible ? "translateY(0)" : "translateY(24px)",
//           transition: "opacity 0.7s ease, transform 0.7s ease",
//         }}
//       >
//         <span className="inline-block px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-4">
//           What You Get
//         </span>
//         <h2 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
//           Let's analyze your body —
//           <br />
//           <span
//             style={{
//               background: "linear-gradient(90deg,#22d3ee,#34d399)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               backgroundClip: "text",
//             }}
//           >
//             then decide what to do next.
//           </span>
//         </h2>
//         <p className="text-slate-400 max-w-lg mx-auto text-base">
//           Every section gives you a meaningful insight — and every insight shapes the full picture of your health.
//         </p>
//       </div>

//       {/* 3 Feature Cards */}
//       <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//         {features.map((f, i) => (
//           <FeatureCard key={f.id} feature={f} visible={visible} delay={i * 120} />
//         ))}
//       </div>

//       {/* Summary Card */}
//       <div className="max-w-5xl mx-auto">
//         <SummaryCard visible={visible} />
//       </div>
//     </section>
//   );
// };

// export default FeaturesSection;




import { useEffect, useRef, useState } from "react";

// ─── Intersection Hook ───────────────────────────────────────────────────────
const useVisible = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

// ─── Animated Number ─────────────────────────────────────────────────────────
const AnimatedNumber: React.FC<{
  target: number;
  decimals?: number;
  visible: boolean;
  delay?: number;
}> = ({ target, decimals = 0, visible, delay = 0 }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(() => {
      let start: number | null = null;
      const duration = 1400;
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(parseFloat((eased * target).toFixed(decimals)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [visible, target, decimals, delay]);
  return <>{val.toFixed(decimals)}</>;
};

// ─── Animated Ring ───────────────────────────────────────────────────────────
const Ring: React.FC<{
  percent: number;
  color: string;
  size?: number;
  visible: boolean;
  delay?: number;
}> = ({ percent, color, size = 88, visible, delay = 0 }) => {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setOffset(circ - (circ * percent) / 100), delay);
    return () => clearTimeout(t);
  }, [visible, circ, percent, delay]);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={6} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)" }}
      />
    </svg>
  );
};

// ─── Animated Bar ─────────────────────────────────────────────────────────────
const Bar: React.FC<{ percent: number; color: string; visible: boolean; delay?: number }> = ({
  percent, color, visible, delay = 0,
}) => {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setW(percent), delay);
    return () => clearTimeout(t);
  }, [visible, percent, delay]);
  return (
    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{ width: `${w}%`, background: color, transition: "width 1.3s cubic-bezier(.4,0,.2,1)" }}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — App Introduction
// ═══════════════════════════════════════════════════════════════════════════════
const AppIntroSection: React.FC = () => {
  const { ref, visible } = useVisible(0.1);

  const pillars = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "#22d3ee",
      title: "Body Metrics",
      desc: "Calculates BMI, BMR, TDEE and body fat percentage from your physical data.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      ),
      color: "#818cf8",
      title: "Sleep Quality",
      desc: "Scores your sleep efficiency based on habits, caffeine, and recovery patterns.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "#34d399",
      title: "Workout Plans",
      desc: "Recommends a full weekly training program matched to your goal and fitness level.",
    },
  ];

  return (
    <div ref={ref} className="max-w-5xl mx-auto">
      {/* Headline */}
      <div
        className="text-center mb-16"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <span className="inline-block px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-5">
          What LifeStyle does
        </span>
        <h2 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
          Analyze your body.
          <br />
          <span style={{
            background: "linear-gradient(90deg,#22d3ee,#34d399)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Know what to do next.
          </span>
        </h2>
        <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
          LifeStyle takes your personal data and turns it into clear, actionable health insights —
          no guesswork, no generic advice.
        </p>
      </div>

      {/* 3 pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pillars.map((p, i) => (
          <div
            key={i}
            className="flex gap-4 items-start p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: `opacity 0.6s ease ${150 + i * 120}ms, transform 0.6s ease ${150 + i * 120}ms`,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `${p.color}18`, color: p.color }}
            >
              {p.icon}
            </div>
            <div>
              <p className="text-white font-semibold mb-1">{p.title}</p>
              <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — Mini Dashboards
// ═══════════════════════════════════════════════════════════════════════════════

// ── Body Metrics Dashboard ───────────────────────────────────────────────────
const BodyDashboard: React.FC<{ visible: boolean }> = ({ visible }) => (
  <div
    className="rounded-2xl border border-white/5 bg-white/[0.03] overflow-hidden"
    style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: "opacity 0.7s ease 100ms, transform 0.7s ease 100ms",
    }}
  >
    {/* Card header */}
    <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-white font-semibold text-sm">Body Metrics</span>
      </div>
      <span className="text-slate-600 text-xs">Sample Profile</span>
    </div>

    <div className="p-5 space-y-4">
      {/* Big stat */}
      <div className="flex items-end gap-2">
        <span className="text-5xl font-black text-white leading-none">
          <AnimatedNumber target={23.4} decimals={1} visible={visible} delay={300} />
        </span>
        <div className="mb-1">
          <p className="text-cyan-400 font-bold text-sm">BMI</p>
          <p className="text-slate-500 text-xs">Normal weight ✓</p>
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-3 pt-1">
        {[
          { label: "BMR", value: "1,820 kcal", sub: "Resting burn", pct: 62, delay: 400 },
          { label: "TDEE", value: "2,548 kcal", sub: "Daily need", pct: 85, delay: 520 },
          { label: "Body Fat", value: "17.2%", sub: "Healthy range", pct: 34, delay: 640 },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between items-center mb-1.5">
              <div>
                <span className="text-slate-300 text-xs font-medium">{item.label}</span>
                <span className="text-slate-600 text-xs ml-2">{item.sub}</span>
              </div>
              <span className="text-cyan-400 text-xs font-bold">{item.value}</span>
            </div>
            <Bar percent={item.pct} color="#22d3ee" visible={visible} delay={item.delay} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Sleep Dashboard ──────────────────────────────────────────────────────────
const SleepDashboard: React.FC<{ visible: boolean }> = ({ visible }) => (
  <div
    className="rounded-2xl border border-white/5 bg-white/[0.03] overflow-hidden"
    style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: "opacity 0.7s ease 220ms, transform 0.7s ease 220ms",
    }}
  >
    <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
        <span className="text-white font-semibold text-sm">Sleep Analysis</span>
      </div>
      <span className="text-slate-600 text-xs">Last Night</span>
    </div>

    <div className="p-5">
      {/* Ring + score */}
      <div className="flex items-center gap-5 mb-5">
        <div className="relative flex-shrink-0">
          <Ring percent={82} color="#818cf8" visible={visible} delay={350} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-xl font-black leading-none">
              <AnimatedNumber target={82} visible={visible} delay={350} />
            </span>
            <span className="text-slate-500 text-xs">/100</span>
          </div>
        </div>
        <div>
          <p className="text-indigo-400 font-bold text-lg">Good</p>
          <p className="text-slate-400 text-sm">Sleep Score</p>
          <p className="text-slate-500 text-xs mt-1">7.2 hrs · 89% efficiency</p>
        </div>
      </div>

      {/* Factors */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Caffeine", val: "Low", good: true },
          { label: "Exercise", val: "Yes", good: true },
          { label: "Wake-ups", val: "1x", good: true },
        ].map((f) => (
          <div key={f.label} className="rounded-xl p-3 bg-white/[0.03] border border-white/5 text-center">
            <p className={`text-sm font-bold ${f.good ? "text-indigo-400" : "text-amber-400"}`}>{f.val}</p>
            <p className="text-slate-600 text-xs mt-0.5">{f.label}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Workout Dashboard ────────────────────────────────────────────────────────
const WorkoutDashboard: React.FC<{ visible: boolean }> = ({ visible }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const active = [true, true, false, true, true, false, false];

  return (
    <div
      className="rounded-2xl border border-white/5 bg-white/[0.03] overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.7s ease 340ms, transform 0.7s ease 340ms",
      }}
    >
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-semibold text-sm">Workout Plan</span>
        </div>
        <span className="text-slate-600 text-xs">This Week</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Goal + level */}
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            Muscle Gain
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-slate-400 text-xs font-semibold">
            Intermediate
          </span>
        </div>

        {/* Big number */}
        <div className="flex items-end gap-2">
          <span className="text-5xl font-black text-white leading-none">
            <AnimatedNumber target={4} visible={visible} delay={450} />
          </span>
          <div className="mb-1">
            <p className="text-emerald-400 font-bold text-sm">Sessions</p>
            <p className="text-slate-500 text-xs">per week</p>
          </div>
        </div>

        {/* Week grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d, i) => (
            <div key={d} className="flex flex-col items-center gap-1">
              <div
                className="w-full h-8 rounded-lg transition-all duration-500"
                style={{
                  background: active[i]
                    ? "linear-gradient(180deg,#34d399,#059669)"
                    : "rgba(255,255,255,0.04)",
                  boxShadow: active[i] && visible ? "0 0 10px rgba(52,211,153,0.3)" : "none",
                  transitionDelay: `${500 + i * 80}ms`,
                  opacity: visible ? 1 : 0,
                }}
              />
              <span className="text-slate-600 text-xs">{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const FeaturesSection: React.FC = () => {
  const { ref: dashRef, visible: dashVisible } = useVisible(0.1);

  return (
    <section className="relative bg-slate-950 overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* ── Section 1: App Intro ── */}
      <div className="py-24 px-4">
        <AppIntroSection />
      </div>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </div>

      {/* ── Section 2: Mini Dashboards ── */}
      <div className="py-24 px-4">
        <div ref={dashRef} className="max-w-5xl mx-auto">
          {/* Sub-header */}
          <div
            className="text-center mb-12"
            style={{
              opacity: dashVisible ? 1 : 0,
              transform: dashVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <span className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 text-slate-400 text-xs font-semibold tracking-widest uppercase mb-4">
              Live Preview
            </span>
            <h3 className="text-white text-2xl md:text-4xl font-extrabold tracking-tight mb-3">
              Your dashboard, before you sign up.
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              This is exactly what your data looks like once analyzed — real numbers, real insights.
            </p>
          </div>

          {/* 3 dashboards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BodyDashboard visible={dashVisible} />
            <SleepDashboard visible={dashVisible} />
            <WorkoutDashboard visible={dashVisible} />
          </div>

          {/* Bottom note */}
          <p
            className="text-center text-slate-700 text-xs mt-8"
            style={{
              opacity: dashVisible ? 1 : 0,
              transition: "opacity 0.7s ease 700ms",
            }}
          >
            * All values shown are sample data — your results will be calculated from your actual profile.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;