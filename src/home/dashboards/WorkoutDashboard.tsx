 import AnimatedNumber from "../components/AnimatedNumber";
 
 
 
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

export default WorkoutDashboard;