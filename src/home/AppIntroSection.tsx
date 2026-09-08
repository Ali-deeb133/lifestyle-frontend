import React from "react";
import useVisible from "./hooks/useVisible";

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
    <div ref={ref} className="max-w-5xl mx-auto px-4 py-16">
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
              style={{ backgroundColor: `${p.color}18`, color: p.color }}
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

export default AppIntroSection;