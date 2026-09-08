 
 import AnimatedNumber from "../components/AnimatedNumber";
 import Ring from "../components/Ring";
 
 
 
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

export default SleepDashboard;