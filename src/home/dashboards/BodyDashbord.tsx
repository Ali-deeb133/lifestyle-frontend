import AnimatedNumber from "../components/AnimatedNumber";
import Bar from "../components/Bar";

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
  </div>);



export default BodyDashboard;