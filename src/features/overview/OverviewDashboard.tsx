

import { useEffect, useState } from 'react'
import { useOverview } from './useOverview'


// ── Types ─────────────────────────────────────────────────
interface AnimatedNumberProps {
  target: number
  duration?: number
  decimals?: number
}

interface ScoreRingProps {
  score: number
}

interface MiniArcProps {
  score: number
  color: string
  size?: number
}

interface MetricItem {
  label: string
  value: string
  bar?: number
}

interface ModulePanelProps {
  icon: string
  title: string
  score: number
  color: string
  metrics: MetricItem[]
  delay?: number
}

interface StatChipProps {
  icon: string
  label: string
  value: string
  color: string
  delay?: number
}

// ── Animated Number ───────────────────────────────────────
function AnimatedNumber({ target, duration = 1500, decimals = 0 }: AnimatedNumberProps) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(+(target * ease).toFixed(decimals))
      if (p < 1) requestAnimationFrame(step)
    }
    const id = requestAnimationFrame(step)
    return () => cancelAnimationFrame(id)
  }, [target, duration, decimals])

  return <>{val}</>
}

// ── Health Score Ring ─────────────────────────────────────
function HealthScoreRing({ score }: ScoreRingProps) {
  const [animated, setAnimated] = useState(0)
  useEffect(() => { setTimeout(() => setAnimated(score), 300) }, [score])

  const size = 220
  const r = 88
  const circ = 2 * Math.PI * r
  const totalAngle = 280
  const startAngle = 130
  const offset = circ - (animated / 100) * circ * (totalAngle / 360)

  const color: [string, string] =
    score >= 80 ? ['#22c55e', '#10b981']
    : score >= 60 ? ['#f59e0b', '#f97316']
    : ['#ef4444', '#dc2626']

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full" style={{
        background: `radial-gradient(circle at center, ${color[0]}15, transparent 70%)`,
        filter: 'blur(20px)',
      }} />

      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color[0]} />
            <stop offset="100%" stopColor={color[1]} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={size/2} cy={size/2} r={r+18} fill="none"
          stroke="rgba(255,255,255,0.03)" strokeWidth={1} strokeDasharray="4 8" />

        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth={14}
          strokeDasharray={`${circ * totalAngle/360} ${circ}`}
          transform={`rotate(${startAngle} ${size/2} ${size/2})`} />

        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="url(#scoreGrad)" strokeWidth={14} strokeLinecap="round"
          strokeDasharray={`${circ * totalAngle/360} ${circ}`}
          strokeDashoffset={offset}
          transform={`rotate(${startAngle} ${size/2} ${size/2})`}
          filter="url(#glow)"
          style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)' }}
        />

        {Array.from({ length: 21 }, (_, i) => {
          const angle = startAngle + (i / 20) * totalAngle
          const rad = (angle * Math.PI) / 180
          const cx = size/2, cy = size/2
          const r1 = r + 20
          const r2 = r + (i % 5 === 0 ? 28 : 24)
          return (
            <line key={i}
              x1={cx + r1 * Math.cos(rad)} y1={cy + r1 * Math.sin(rad)}
              x2={cx + r2 * Math.cos(rad)} y2={cy + r2 * Math.sin(rad)}
              stroke={i % 5 === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}
              strokeWidth={i % 5 === 0 ? 2 : 1}
            />
          )
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-6xl font-black text-white font-mono tracking-tighter leading-none">
          <AnimatedNumber target={score} duration={1800} />
        </span>
        <span className="text-xs text-slate-500 uppercase tracking-[0.2em] mt-1">Health Score</span>
        <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full"
          style={{ background: `${color[0]}15`, border: `1px solid ${color[0]}30` }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color[0] }} />
          <span className="text-[10px] font-semibold" style={{ color: color[0] }}>
            {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Mini Arc ──────────────────────────────────────────────
function MiniArc({ score, color, size = 80 }: MiniArcProps) {
  const [animated, setAnimated] = useState(0)
  useEffect(() => { setTimeout(() => setAnimated(score), 600) }, [score])

  const r = size / 2 - 10
  const circ = 2 * Math.PI * r
  const totalAngle = 240
  const offset = circ - (animated / 100) * circ * (totalAngle / 360)

  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="rgba(255,255,255,0.06)" strokeWidth={7}
        strokeDasharray={`${circ * totalAngle/360} ${circ}`}
        transform={`rotate(150 ${size/2} ${size/2})`} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={7} strokeLinecap="round"
        strokeDasharray={`${circ * totalAngle/360} ${circ}`}
        strokeDashoffset={offset}
        transform={`rotate(150 ${size/2} ${size/2})`}
        style={{
          transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)',
          filter: `drop-shadow(0 0 5px ${color}80)`,
        }}
      />
      <text x={size/2} y={size/2 + 5} textAnchor="middle"
        fill="white" fontSize={14} fontWeight="800" fontFamily="monospace">
        {score}
      </text>
    </svg>
  )
}

// ── Module Panel ──────────────────────────────────────────
function ModulePanel({ icon, title, score, color, metrics, delay = 0 }: ModulePanelProps) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), delay) }, [delay])

  return (
    <div className="relative overflow-hidden rounded-2xl p-5 flex flex-col gap-4"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}>

      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />

      <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color}08, transparent)`, transform: 'translate(30%,-30%)' }} />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
            style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
            {icon}
          </div>
          <p className="text-sm font-bold text-slate-200">{title}</p>
        </div>
        <MiniArc score={score} color={color} size={72} />
      </div>

      <div className="relative z-10 flex flex-col gap-2">
        {metrics.map((m, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">{m.label}</span>
            <div className="flex items-center gap-2">
              {m.bar !== undefined && (
                <div className="w-16 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${m.bar}%`,
                      background: color,
                      transitionDelay: `${i * 100 + 400}ms`,
                    }} />
                </div>
              )}
              <span className="text-[11px] font-semibold text-slate-300 font-mono">{m.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Stat Chip ─────────────────────────────────────────────
function StatChip({ icon, label, value, color, delay = 0 }: StatChipProps) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), delay) }, [delay])

  return (
    <div className="relative overflow-hidden rounded-2xl p-4 flex flex-col gap-2"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.95)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
      <div className="absolute inset-0 opacity-5 rounded-2xl"
        style={{ background: `linear-gradient(135deg, ${color}, transparent)` }} />
      <span className="text-lg relative z-10">{icon}</span>
      <p className="text-xl font-black text-white font-mono relative z-10">{value}</p>
      <p className="text-[10px] text-slate-500 uppercase tracking-wider relative z-10">{label}</p>
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-64 text-center">
      <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xl">
        ◈
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-300">No data available yet</p>
        <p className="text-xs text-slate-600 mt-1">
          Enter body data, sleep data, or workout data to view the summary
        </p>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────
export function OverviewDashboard() {
  const { body, sleep, workout, healthScore, completedModules } = useOverview()

  if (!healthScore) return <EmptyState />

  return (
    <div className="min-h-screen bg-slate-900 text-black p-6 flex justify-center"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06), transparent 60%)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.05), transparent 60%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.03), transparent 60%)' }} />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
      </div>

      <div className="relative w-full max-w-3xl flex flex-col gap-5">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em] mb-1">
              Health OS · Overview
            </p>
            <h1 className="text-2xl font-black text-white tracking-tight">Your Health Report</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            {completedModules.length} / 3 Complete
          </div>
        </div>

        {/* ── Hero ── */}
        <div className="relative overflow-hidden rounded-3xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 50%, rgba(16,185,129,0.05) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}>

          <div className="absolute top-0 left-0 w-32 h-32 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)', transform: 'translate(-50%,-50%)' }} />
          <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #10b981, transparent)', transform: 'translate(30%,30%)' }} />

          <div className="relative z-10 flex items-center gap-8">
            <HealthScoreRing score={healthScore} />

            <div className="flex-1 flex flex-col gap-5">
              {/* Module scores */}
              <div className="flex flex-col gap-3">
                {[
                  body    && { label: 'Body Metrics',  score: body.score,    color: '#22d3ee', icon: '◎' },
                  sleep   && { label: 'Sleep Quality',  score: sleep.score,   color: '#a78bfa', icon: '◐' },
                  workout && { label: 'Workout Plan',   score: workout.score, color: '#34d399', icon: '◇' },
                ].filter(Boolean).map((m, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: m!.color }}>{m!.icon}</span>
                    <span className="text-xs text-slate-400 w-24">{m!.label}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${m!.score}%`,
                          background: `linear-gradient(90deg, ${m!.color}80, ${m!.color})`,
                          boxShadow: `0 0 8px ${m!.color}50`,
                          transitionDelay: `${i * 200 + 500}ms`,
                        }} />
                    </div>
                    <span className="text-xs font-bold font-mono w-8 text-right"
                      style={{ color: m!.color }}>{m!.score}</span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-400 leading-relaxed border-l-2 pl-3"
                style={{ borderColor: 'rgba(99,102,241,0.4)' }}>
                {healthScore >= 80
                  ? 'your health is excellent — keep up the good work 🌟'
                  : healthScore >= 60
                  ? 'your health is good — some areas need minor improvements.'
                  : 'it needs attention — please review the recommendations below.'
                }
                {body    && ` Your weight is ${body.bmiInsight}.`}
                {sleep   && ` ${sleep.insight}.`}
                {workout && ` Your workout plan matches ${workout.score}% with your goal.`}
              </p>
            </div>
          </div>
        </div>

        {/* ── Stat Chips ── */}
        <div className="grid grid-cols-4 gap-3">
          {body && (
            <StatChip icon="⚖️" label="BMI Index"
              value={body.bmi.toFixed(1)} color="#22d3ee" delay={100} />
          )}
          {sleep && (
            <StatChip icon="🌙" label="Sleep Eff."
              value={`${sleep.efficiency}%`} color="#a78bfa" delay={200} />
          )}
          {body && (
            <StatChip icon="🔥" label="TDEE / day"
              value={body.tdee.toLocaleString()} color="#f59e0b" delay={300} />
          )}
          {workout && (
            <StatChip icon="💪" label="Match Score"
              value={`${workout.score}%`} color="#34d399" delay={400} />
          )}
        </div>

        {/* ── Module Panels ── */}
        <div className="grid grid-cols-3 gap-4">
          {body && (
            <ModulePanel
              icon="◎" title="Body Metrics"
              score={body.score} color="#22d3ee" delay={200}
              metrics={[
                { label: 'BMI',      value: `${body.bmi.toFixed(1)}`,  bar: (body.bmi / 40) * 100 },
                { label: 'Body Fat', value: `${body.bodyFat}%`,        bar: body.bodyFat },
                { label: 'BMR',      value: `${body.bmr} kcal`,        bar: (body.bmr / 2500) * 100 },
                { label: 'Status',   value: body.metabolicStatus },
              ]}
            />
          )}

          {sleep && (
            <ModulePanel
              icon="◐" title="Sleep Quality"
              score={sleep.score} color="#a78bfa" delay={350}
              metrics={[
                { label: 'Efficiency',  value: `${sleep.efficiency}%`,      bar: sleep.efficiency },
                { label: 'Duration',    value: `${sleep.sleepDuration}h`,   bar: (sleep.sleepDuration / 9) * 100 },
                { label: 'Awakenings', value: `${sleep.awakenings}×`,       bar: 100 - sleep.awakenings * 15 },
                { label: 'Exercise',    value: sleep.exerciseEval },
              ]}
            />
          )}

          {workout && (
            <ModulePanel
              icon="◇" title="Workout Plan"
              score={workout.score} color="#34d399" delay={500}
              metrics={[
                { label: 'Match',     value: `${workout.score}%`,                    bar: workout.score },
                { label: 'Duration',  value: `${workout.programLength}w`,            bar: (workout.programLength / 16) * 100 },
                { label: 'Exercises', value: workout.totalExercises.toLocaleString(), bar: 85 },
                { label: 'Level',     value: workout.level },
              ]}
            />
          )}
        </div>

        {/* ── Footer Insight ── */}
        <div className="relative overflow-hidden rounded-2xl p-5 flex items-start gap-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)' }} />

          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            ✦
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-slate-200">AI Health Insight</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {body && <>Your body is in good health — {body.bmiInsight} good muscle mass. </>}
              {sleep && sleep.score < 80 && <>Key recommendation: Improve your sleep quality. </>}
              {workout && (
                <>The chosen workout plan matches{' '}
                  <span className="text-emerald-400 font-semibold font-mono">{workout.score}%</span>
                  {' '}your current goal.</>
              )}
            </p>
          </div>
        </div>

      </div>
    </div>
 ) }





















// import { useEffect, useState } from 'react'
// import { useOverview } from './useOverview'

// // ── Base64 Hologram Image ─────────────────────────────────
// const HOLOGRAM_IMAGE = `data:image/jpeg;base64,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;

// // ── Types ─────────────────────────────────────────────────
// interface AnimatedNumberProps {
//   target: number
//   duration?: number
//   decimals?: number
// }

// interface ScoreRingProps {
//   score: number
// }interface MiniArcProps {
//   score: number
//   color: string
//   size?: number
// }

// interface MetricItem {
//   label: string
//   value: string
//   bar?: number
// }

// interface ModulePanelProps {
//   icon: string
//   title: string
//   score: number
//   color: string
//   metrics: MetricItem[]
//   delay?: number
// }

// interface StatChipProps {
//   icon: string
//   label: string
//   value: string
//   color: string
//   delay?: number
// }

// // ── Hologram Figure ───────────────────────────────────────
// function HologramFigure() {
//   const [pulse, setPulse] = useState(0)
  
//   useEffect(() => {
//     const id = setInterval(() => setPulse(p => (p + 1) % 100), 50)
//     return () => clearInterval(id)
//   }, [])

//   return (
//     <div className="relative flex items-center justify-center" style={{ width: 260, minWidth: 260, height: '100%', minHeight: 500 }}>
      
//       {/* Outer rotating ring */}
//       <div className="absolute" style={{
//         width: 240, height: 240,
//         border: '1px solid rgba(0,180,255,0.15)',
//         borderRadius: '50%',
//         top: '50%', left: '50%',
//         transform: 'translate(-50%, -50%)',
//         animation: 'hologramRotate 12s linear infinite',
//       }} />

//       {/* Mid rotating ring */}
//       <div className="absolute" style={{
//         width: 200, height: 200,
//         border: '1px solid rgba(0,180,255,0.1)',
//         borderRadius: '50%',
//         top: '50%', left: '50%',
//         transform: 'translate(-50%, -50%)',
//         animation: 'hologramRotate 8s linear infinite reverse',
//       }} />

//       {/* Scan lines overlay */}
//       <div className="absolute inset-0 pointer-events-none z-20" style={{
//         background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,180,255,0.025) 3px, rgba(0,180,255,0.025) 4px)',
//         animation: 'scanlines 3s linear infinite',
//       }} />

//       {/* Base glow platform */}
//       <div className="absolute" style={{
//         bottom: 30,
//         left: '50%',
//         transform: 'translateX(-50%)',
//         width: 130,
//         height: 18,
//         background: 'radial-gradient(ellipse, rgba(0,160,255,0.7) 0%, rgba(0,100,200,0.3) 50%, transparent 80%)',
//         filter: 'blur(4px)',
//         animation: 'glowPulse 2s ease-in-out infinite',
//       }} />

//       {/* Vertical light beam */}
//       <div className="absolute" style={{
//         bottom: 35,
//         left: '50%',
//         transform: 'translateX(-50%)',
//         width: 2,
//         height: 80,
//         background: 'linear-gradient(to top, rgba(0,180,255,0.6), transparent)',
//         filter: 'blur(1px)',
//         animation: 'beamPulse 2s ease-in-out infinite',
//       }} />

//       {/* Corner brackets — top-left */}
//       <div className="absolute" style={{ top: 10, left: 10, width: 20, height: 20,
//         borderTop: '2px solid rgba(0,200,255,0.6)', borderLeft: '2px solid rgba(0,200,255,0.6)' }} />
//       {/* top-right */}
//       <div className="absolute" style={{ top: 10, right: 10, width: 20, height: 20,
//         borderTop: '2px solid rgba(0,200,255,0.6)', borderRight: '2px solid rgba(0,200,255,0.6)' }} />
//       {/* bottom-left */}
//       <div className="absolute" style={{ bottom: 10, left: 10, width: 20, height: 20,
//         borderBottom: '2px solid rgba(0,200,255,0.6)', borderLeft: '2px solid rgba(0,200,255,0.6)' }} />
//       {/* bottom-right */}
//       <div className="absolute" style={{ bottom: 10, right: 10, width: 20, height: 20,
//         borderBottom: '2px solid rgba(0,200,255,0.6)', borderRight: '2px solid rgba(0,200,255,0.6)' }} />

//       {/* Data labels floating */}
//       {[
//         { label: 'MUSCLE', value: '87%', top: '18%', left: '-10%', color: '#22d3ee' },
//         { label: 'FAT', value: '13%', top: '35%', left: '-10%', color: '#a78bfa' },
//         { label: 'HYDRATION', value: '72%', top: '52%', left: '-10%', color: '#34d399' },
//         { label: 'BONE MASS', value: '4.2kg', top: '70%', left: '-10%', color: '#f59e0b' },].map((d, i) => (
//         <div key={i} className="absolute flex items-center gap-1.5" style={{
//           top: d.top, left: d.left,
//           animation: fadeInLabel 0.5s ease ${i * 0.2}s both,
//         }}>
//           <div style={{ width: 30, height: 1, background: linear-gradient(to left, ${d.color}, transparent) }} />
//           <div style={{ color: d.color, fontSize: 9, fontFamily: 'monospace', letterSpacing: 1 }}>
//             <div style={{ opacity: 0.6 }}>{d.label}</div>
//             <div style={{ fontWeight: 900 }}>{d.value}</div>
//           </div>
//         </div>
//       ))}

//       {/* Actual hologram image — 3D perspective */}
//       <div style={{
//         position: 'relative',
//         zIndex: 10,
//         width: 160,
//         height: 380,
//         perspective: '800px',
//         animation: 'hologramFloat 4s ease-in-out infinite',
//       }}>
//         <div style={{
//           width: '100%',
//           height: '100%',
//           position: 'relative',
//           transformStyle: 'preserve-3d',
//         }}>
//           {/* Main image */}
//           <img
//             src="/hologram-body.jpg"
//             alt="Hologram Body"
//             style={{
//               width: '100%',
//               height: '100%',
//               objectFit: 'cover',
//               objectPosition: 'center',
//               filter: 'hue-rotate(200deg) saturate(1.4) brightness(1.1) drop-shadow(0 0 12px rgba(0,180,255,0.8)) drop-shadow(0 0 30px rgba(0,150,255,0.5))',
//               maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, black 10%, black 85%, rgba(0,0,0,0.2) 100%)',
//               WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, black 10%, black 85%, rgba(0,0,0,0.2) 100%)',
//             }}
//           />

//           {/* Glitch layer 1 */}
//           <img
//             src="/hologram-body.jpg"
//             alt=""
//             aria-hidden
//             style={{
//               position: 'absolute',
//               inset: 0,
//               width: '100%',
//               height: '100%',
//               objectFit: 'cover',
//               objectPosition: 'center',
//               filter: 'hue-rotate(160deg) saturate(2) brightness(0.8)',
//               opacity: 0.3,
//               transform: 'translateX(2px)',
//               animation: 'glitch1 4s infinite',
//               maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, black 10%, black 85%, rgba(0,0,0,0.2) 100%)',
//               WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, black 10%, black 85%, rgba(0,0,0,0.2) 100%)',
//             }}
//           />

//           {/* Glitch layer 2 */}
//           <img
//             src="/hologram-body.jpg"
//             alt=""
//             aria-hidden
//             style={{
//               position: 'absolute',
//               inset: 0,
//               width: '100%',
//               height: '100%',
//               objectFit: 'cover',
//               objectPosition: 'center',
//               filter: 'hue-rotate(240deg) saturate(2) brightness(0.8)',
//               opacity: 0.2,
//               transform: 'translateX(-2px)',
//               animation: 'glitch2 4s infinite',
//               maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, black 10%, black 85%, rgba(0,0,0,0.2) 100%)',
//               WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, black 10%, black 85%, rgba(0,0,0,0.2) 100%)',
//             }}
//           />

//           {/* Horizontal scan line moving */}
//           <div style={{
//             position: 'absolute',
//             left: 0, right: 0,
//             height: 2,
//             background: 'linear-gradient(90deg, transparent, rgba(0,200,255,0.8), transparent)',
//             filter: 'blur(1px)',
//             animation: 'scanLine 2.5s linear infinite',
//           }} />
//         </div>
//       </div>

//       {/* Ambient glow behind */}
//       <div className="absolute" style={{
//         width: 180,
//         height: 400,
//         background: 'radial-gradient(ellipse at center 40%, rgba(0,120,255,0.12) 0%, transparent 70%)',
//         filter: 'blur(20px)',
//         zIndex: 1,
//         animation: 'glowPulse 3s ease-in-out infinite',
//       }} /><style>{
//         @keyframes hologramFloat {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-12px); }
//         }
//         @keyframes hologramRotate {
//           from { transform: translate(-50%, -50%) rotate(0deg); }
//           to { transform: translate(-50%, -50%) rotate(360deg); }
//         }
//         @keyframes glowPulse {
//           0%, 100% { opacity: 0.8; }
//           50% { opacity: 1; }
//         }
//         @keyframes beamPulse {
//           0%, 100% { opacity: 0.6; height: 70px; }
//           50% { opacity: 1; height: 90px; }
//         }
//         @keyframes scanlines {
//           0% { background-position: 0 0; }
//           100% { background-position: 0 20px; }
//         }
//         @keyframes scanLine {
//           0% { top: -5%; }
//           100% { top: 105%; }
//         }
//         @keyframes glitch1 {
//           0%, 90%, 100% { transform: translateX(0); opacity: 0.3; }
//           92% { transform: translateX(4px) skewX(2deg); opacity: 0.6; }
//           94% { transform: translateX(-2px); opacity: 0.1; }
//           96% { transform: translateX(3px); opacity: 0.5; }
//           98% { transform: translateX(0); opacity: 0.3; }
//         }
//         @keyframes glitch2 {
//           0%, 85%, 100% { transform: translateX(0); opacity: 0.2; }
//           87% { transform: translateX(-4px) skewX(-1deg); opacity: 0.5; }
//           89% { transform: translateX(2px); opacity: 0.1; }
//           91% { transform: translateX(-1px); opacity: 0.4; }
//         }
//         @keyframes fadeInLabel {
//           from { opacity: 0; transform: translateX(-8px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//       }</style>
//     </div>
//   )
// }

// // ── Animated Number ───────────────────────────────────────
// function AnimatedNumber({ target, duration = 1500, decimals = 0 }: AnimatedNumberProps) {
//   const [val, setVal] = useState(0)

//   useEffect(() => {
//     let start: number | null = null
//     const step = (ts: number) => {
//       if (!start) start = ts
//       const p = Math.min((ts - start) / duration, 1)
//       const ease = 1 - Math.pow(1 - p, 3)
//       setVal(+(target * ease).toFixed(decimals))
//       if (p < 1) requestAnimationFrame(step)
//     }
//     const id = requestAnimationFrame(step)
//     return () => cancelAnimationFrame(id)
//   }, [target, duration, decimals])

//   return <>{val}</>
// }

// // ── Health Score Ring ─────────────────────────────────────
// function HealthScoreRing({ score }: ScoreRingProps) {
//   const [animated, setAnimated] = useState(0)
//   useEffect(() => { setTimeout(() => setAnimated(score), 300) }, [score])

//   const size = 220
//   const r = 88
//   const circ = 2 * Math.PI * r
//   const totalAngle = 280
//   const startAngle = 130
//   const offset = circ - (animated / 100) * circ * (totalAngle / 360)

//   const color: [string, string] =
//     score >= 80 ? ['#22c55e', '#10b981']
//     : score >= 60 ? ['#f59e0b', '#f97316']
//     : ['#ef4444', '#dc2626']

//   return (
//     <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
//       <div className="absolute inset-0 rounded-full" style={{
//         background: `radial-gradient(circle at center, ${color[0]}15, transparent 70%)`,
//         filter: 'blur(20px)',
//       }} />

//       <svg width={size} height={size} style={{ overflow: 'visible' }}>
//         <defs>
//           <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//             <stop offset="0%" stopColor={color[0]} />
//             <stop offset="100%" stopColor={color[1]} />
//           </linearGradient>
//           <filter id="glow">
//             <feGaussianBlur stdDeviation="3" result="coloredBlur" />
//             <feMerge>
//               <feMergeNode in="coloredBlur" />
//               <feMergeNode in="SourceGraphic" />
//             </feMerge>
//           </filter>
//         </defs>

//         <circle cx={size/2} cy={size/2} r={r+18} fill="none"
//           stroke="rgba(255,255,255,0.03)" strokeWidth={1} strokeDasharray="4 8" /><circle cx={size/2} cy={size/2} r={r} fill="none"
//           stroke="rgba(255,255,255,0.06)" strokeWidth={14}
//           strokeDasharray={`${circ * totalAngle/360} ${circ}`}
//           transform={`rotate(${startAngle} ${size/2} ${size/2})`} />

//         <circle cx={size/2} cy={size/2} r={r} fill="none"
//           stroke="url(#scoreGrad)" strokeWidth={14} strokeLinecap="round"
//           strokeDasharray={`${circ * totalAngle/360} ${circ}`}
//           strokeDashoffset={offset}
//           transform={`rotate(${startAngle} ${size/2} ${size/2})`}
//           filter="url(#glow)"
//           style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)' }}
//         />

//         {Array.from({ length: 21 }, (_, i) => {
//           const angle = startAngle + (i / 20) * totalAngle
//           const rad = (angle * Math.PI) / 180
//           const cx = size/2, cy = size/2
//           const r1 = r + 20
//           const r2 = r + (i % 5 === 0 ? 28 : 24)
//           return (
//             <line key={i}
//               x1={cx + r1 * Math.cos(rad)} y1={cy + r1 * Math.sin(rad)}
//               x2={cx + r2 * Math.cos(rad)} y2={cy + r2 * Math.sin(rad)}
//               stroke={i % 5 === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}
//               strokeWidth={i % 5 === 0 ? 2 : 1}
//             />
//           )
//         })}
//       </svg>

//       <div className="absolute inset-0 flex flex-col items-center justify-center">
//         <span className="text-6xl font-black text-white font-mono tracking-tighter leading-none">
//           <AnimatedNumber target={score} duration={1800} />
//         </span>
//         <span className="text-xs text-slate-500 uppercase tracking-[0.2em] mt-1">Health Score</span>
//         <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full"
//           style={{ background: `${color[0]}15`, border: `1px solid ${color[0]}30` }}>
//           <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color[0] }} />
//           <span className="text-[10px] font-semibold" style={{ color: color[0] }}>
//             {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
//           </span>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ── Mini Arc ──────────────────────────────────────────────
// function MiniArc({ score, color, size = 80 }: MiniArcProps) {
//   const [animated, setAnimated] = useState(0)
//   useEffect(() => { setTimeout(() => setAnimated(score), 600) }, [score])

//   const r = size / 2 - 10
//   const circ = 2 * Math.PI * r
//   const totalAngle = 240
//   const offset = circ - (animated / 100) * circ * (totalAngle / 360)

//   return (
//     <svg width={size} height={size} style={{ overflow: 'visible' }}>
//       <circle cx={size/2} cy={size/2} r={r} fill="none"
//         stroke="rgba(255,255,255,0.06)" strokeWidth={7}
//         strokeDasharray={`${circ * totalAngle/360} ${circ}`}
//         transform={`rotate(150 ${size/2} ${size/2})`} />
//       <circle cx={size/2} cy={size/2} r={r} fill="none"
//         stroke={color} strokeWidth={7} strokeLinecap="round"
//         strokeDasharray={`${circ * totalAngle/360} ${circ}`}
//         strokeDashoffset={offset}
//         transform={`rotate(150 ${size/2} ${size/2})`}
//         style={{
//           transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)',
//           filter: `drop-shadow(0 0 5px ${color}80)`,
//         }}
//       />
//       <text x={size/2} y={size/2 + 5} textAnchor="middle"
//         fill="white" fontSize={14} fontWeight="800" fontFamily="monospace">
//         {score}
//       </text>
//     </svg>
//   )
// }

// // ── Module Panel ──────────────────────────────────────────
// function ModulePanel({ icon, title, score, color, metrics, delay = 0 }: ModulePanelProps) {
//   const [visible, setVisible] = useState(false)
//   useEffect(() => { setTimeout(() => setVisible(true), delay) }, [delay])

//   return (
//     <div className="relative overflow-hidden rounded-2xl p-5 flex flex-col gap-4"style={{
//         opacity: visible ? 1 : 0,
//         transform: visible ? 'translateY(0)' : 'translateY(16px)',
//         transition: 'opacity 0.7s ease, transform 0.7s ease',
//         background: 'rgba(255,255,255,0.03)',
//         border: '1px solid rgba(255,255,255,0.07)',
//         backdropFilter: 'blur(12px)',
//       }}>

//       <div className="absolute top-0 left-0 right-0 h-[1px]"
//         style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />

//       <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
//         style={{ background: `radial-gradient(circle, ${color}08, transparent)`, transform: 'translate(30%,-30%)' }} />

//       <div className="flex items-center justify-between relative z-10">
//         <div className="flex items-center gap-2.5">
//           <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
//             style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
//             {icon}
//           </div>
//           <p className="text-sm font-bold text-slate-200">{title}</p>
//         </div>
//         <MiniArc score={score} color={color} size={72} />
//       </div>

//       <div className="relative z-10 flex flex-col gap-2">
//         {metrics.map((m, i) => (
//           <div key={i} className="flex items-center justify-between">
//             <span className="text-[11px] text-slate-500">{m.label}</span>
//             <div className="flex items-center gap-2">
//               {m.bar !== undefined && (
//                 <div className="w-16 h-1 bg-white/[0.05] rounded-full overflow-hidden">
//                   <div className="h-full rounded-full transition-all duration-1000"
//                     style={{
//                       width: ${m.bar}%,
//                       background: color,
//                       transitionDelay: ${i * 100 + 400}ms,
//                     }} />
//                 </div>
//               )}
//               <span className="text-[11px] font-semibold text-slate-300 font-mono">{m.value}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// // ── Stat Chip ─────────────────────────────────────────────
// function StatChip({ icon, label, value, color, delay = 0 }: StatChipProps) {
//   const [visible, setVisible] = useState(false)
//   useEffect(() => { setTimeout(() => setVisible(true), delay) }, [delay])

//   return (
//     <div className="relative overflow-hidden rounded-2xl p-4 flex flex-col gap-2"
//       style={{
//         opacity: visible ? 1 : 0,
//         transform: visible ? 'scale(1)' : 'scale(0.95)',
//         transition: 'opacity 0.7s ease, transform 0.7s ease',
//         background: 'rgba(255,255,255,0.03)',
//         border: '1px solid rgba(255,255,255,0.07)',
//       }}>
//       <div className="absolute inset-0 opacity-5 rounded-2xl"
//         style={{ background: linear-gradient(135deg, ${color}, transparent) }} />
//       <span className="text-lg relative z-10">{icon}</span>
//       <p className="text-xl font-black text-white font-mono relative z-10">{value}</p>
//       <p className="text-[10px] text-slate-500 uppercase tracking-wider relative z-10">{label}</p>
//     </div>
//   )
// }

// // ── Empty State ───────────────────────────────────────────
// function EmptyState() {
//   return (
//     <div className="flex flex-col items-center justify-center gap-4 h-64 text-center">
//       <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xl">
//         ◈
//       </div>
//       <div>
//         <p className="text-sm font-semibold text-slate-300">لا توجد بيانات بعد</p>
//         <p className="text-xs text-slate-600 mt-1">
//           أدخل بيانات الجسم أو النوم أو التدريب لعرض الملخص
//         </p>
//       </div>
//     </div>
//   )
// }

// // ── Main Component ────────────────────────────────────────
// export function OverviewDashboard() {
//   const { body, sleep, workout, healthScore, completedModules } = useOverview()

//   if (!healthScore) return <EmptyState />return (
//     <div
//       className="min-h-screen text-white"
//       style={{
//         fontFamily: "'Inter', system-ui, sans-serif",
//         background: 'linear-gradient(135deg, #020817 0%, #0a1628 40%, #020c1b 100%)',
//         display: 'flex',
//       }}
//     >
//       {/* ── Global CSS animations ── */}
//       <style>{
//         @keyframes hologramFloat {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-12px); }
//         }
//         @keyframes hologramRotate {
//           from { transform: translate(-50%, -50%) rotate(0deg); }
//           to { transform: translate(-50%, -50%) rotate(360deg); }
//         }
//         @keyframes glowPulse {
//           0%, 100% { opacity: 0.8; }
//           50% { opacity: 1; }
//         }
//         @keyframes beamPulse {
//           0%, 100% { opacity: 0.6; height: 70px; }
//           50% { opacity: 1; height: 90px; }
//         }
//         @keyframes scanlines {
//           0% { background-position: 0 0; }
//           100% { background-position: 0 20px; }
//         }
//         @keyframes scanLine {
//           0% { top: -5%; }
//           100% { top: 105%; }
//         }
//         @keyframes glitch1 {
//           0%, 90%, 100% { transform: translateX(0); opacity: 0.3; }
//           92% { transform: translateX(4px) skewX(2deg); opacity: 0.6; }
//           94% { transform: translateX(-2px); opacity: 0.1; }
//           96% { transform: translateX(3px); opacity: 0.5; }
//           98% { transform: translateX(0); opacity: 0.3; }
//         }
//         @keyframes glitch2 {
//           0%, 85%, 100% { transform: translateX(0); opacity: 0.2; }
//           87% { transform: translateX(-4px) skewX(-1deg); opacity: 0.5; }
//           89% { transform: translateX(2px); opacity: 0.1; }
//           91% { transform: translateX(-1px); opacity: 0.4; }
//         }
//         @keyframes fadeInLabel {
//           from { opacity: 0; transform: translateX(-8px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes dataStream {
//           0% { opacity: 0; transform: translateY(-10px); }
//           10% { opacity: 1; }
//           90% { opacity: 1; }
//           100% { opacity: 0; transform: translateY(10px); }
//         }
//       }</style>

//       {/* Ambient background blobs */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute" style={{
//           top: '-20%', left: '-10%', width: 600, height: 600, borderRadius: '50%',
//           background: 'radial-gradient(circle, rgba(0,100,255,0.06), transparent 60%)',
//         }} />
//         <div className="absolute" style={{
//           bottom: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%',
//           background: 'radial-gradient(circle, rgba(0,180,255,0.05), transparent 60%)',
//         }} />
//         <div className="absolute" style={{
//           top: '50%', left: '50%', width: 400, height: 400, borderRadius: '50%',
//           transform: 'translate(-50%,-50%)',
//           background: 'radial-gradient(circle, rgba(99,102,241,0.03), transparent 60%)',
//         }} />
//         {/* Grid pattern */}
//         <div className="absolute inset-0" style={{
//           opacity: 0.015,
//           backgroundImage: 'linear-gradient(rgba(0,180,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,1) 1px, transparent 1px)',
//           backgroundSize: '60px 60px',
//         }} />
//       </div>

//       {/* ── LEFT: Hologram figure ── */}
//       <div className="relative flex-shrink-0 flex flex-col items-center justify-center"
//         style={{
//           width: 280,
//           minHeight: '100vh',
//           borderRight: '1px solid rgba(0,180,255,0.08)',
//           background: 'linear-gradient(180deg, rgba(0,20,60,0.3) 0%, rgba(0,10,40,0.5) 100%)',
//           backdropFilter: 'blur(20px)',
//         }}
//       >
//         {/* Top label */}
//         <div className="absolute top-6 left-0 right-0 flex flex-col items-center gap-1"><div className="text-[9px] uppercase tracking-[0.4em] text-cyan-500/60 font-mono">LifeStyle AI</div>
//           <div className="text-[9px] uppercase tracking-[0.3em] text-slate-600 font-mono">Body Analysis v2</div>
//         </div>

//         {/* The hologram figure */}
//         <HologramFigure />

//         {/* Bottom status */}
//         <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2">
//           <div className="flex items-center gap-2">
//             <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
//             <span className="text-[9px] font-mono text-cyan-400/70 uppercase tracking-widest">Live Scan Active</span>
//           </div>
//           <div className="flex gap-1">
//             {[...Array(5)].map((_, i) => (
//               <div key={i} className="rounded-full" style={{
//                 width: 4, height: 4 + Math.random() * 12,
//                 background: `rgba(0,180,255,${0.3 + Math.random() * 0.5})`,
//                 animation: glowPulse ${0.5 + Math.random()}s ease-in-out infinite,
//                 animationDelay: ${i * 0.15}s,
//               }} />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── RIGHT: Dashboard content ── */}
//       <div className="relative flex-1 p-6 overflow-auto flex flex-col gap-5">

//         {/* ── Header ── */}
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em] mb-1">
//               Health OS · Overview
//             </p>
//             <h1 className="text-2xl font-black text-white tracking-tight">Your Health Report</h1>
//           </div>
//           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
//             style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8' }}>
//             <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
//             {completedModules.length} / 3 Complete
//           </div>
//         </div>

//         {/* ── Hero ── */}
//         <div className="relative overflow-hidden rounded-3xl p-6"
//           style={{
//             background: 'linear-gradient(135deg, rgba(0,100,255,0.06) 0%, rgba(99,102,241,0.05) 50%, rgba(0,180,255,0.04) 100%)',
//             border: '1px solid rgba(0,180,255,0.1)',
//             backdropFilter: 'blur(20px)',
//           }}>

//           <div className="absolute top-0 left-0 w-32 h-32 rounded-full opacity-20"
//             style={{ background: 'radial-gradient(circle, #0080ff, transparent)', transform: 'translate(-50%,-50%)' }} />
//           <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-10"
//             style={{ background: 'radial-gradient(circle, #00b4ff, transparent)', transform: 'translate(30%,30%)' }} />

//           {/* Cyan top line */}
//           <div className="absolute top-0 left-0 right-0 h-px"
//             style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,255,0.4), transparent)' }} />

//           <div className="relative z-10 flex items-center gap-8">
//             <HealthScoreRing score={healthScore} />

//             <div className="flex-1 flex flex-col gap-5">
//               {/* Module scores */}
//               <div className="flex flex-col gap-3">
//                 {[
//                   body    && { label: 'Body Metrics',  score: body.score,    color: '#22d3ee', icon: '◎' },
//                   sleep   && { label: 'Sleep Quality',  score: sleep.score,   color: '#a78bfa', icon: '◐' },
//                   workout && { label: 'Workout Plan',   score: workout.score, color: '#34d399', icon: '◇' },
//                 ].filter(Boolean).map((m, i) => (
//                   <div key={i} className="flex items-center gap-3">
//                     <span className="text-xs" style={{ color: m!.color }}>{m!.icon}</span><span className="text-xs text-slate-400 w-24">{m!.label}</span>
//                     <div className="flex-1 h-1.5 rounded-full overflow-hidden"
//                       style={{ background: 'rgba(255,255,255,0.05)' }}>
//                       <div className="h-full rounded-full transition-all duration-1000"
//                         style={{
//                           width: `${m!.score}%`,
//                           background: `linear-gradient(90deg, ${m!.color}80, ${m!.color})`,
//                           boxShadow: `0 0 8px ${m!.color}50`,
//                           transitionDelay: `${i * 200 + 500}ms`,
//                         }} />
//                     </div>
//                     <span className="text-xs font-bold font-mono w-8 text-right"
//                       style={{ color: m!.color }}>{m!.score}</span>
//                   </div>
//                 ))}
//               </div>

//               {/* Summary */}
//               <p className="text-xs text-slate-400 leading-relaxed border-l-2 pl-3"
//                 style={{ borderColor: 'rgba(0,180,255,0.4)' }}>
//                 {healthScore >= 80
//                   ? 'صحتك ممتازة — استمر على نفس النهج 🌟'
//                   : healthScore >= 60
//                   ? 'صحتك جيدة — بعض الجوانب تحتاج تحسيناً طفيفاً.'
//                   : 'يحتاج انتباه — راجع التوصيات أدناه.'
//                 }
//                 {body    &&  وزنك ${body.bmiInsight}.}
//                 {sleep   &&  ${sleep.insight}.}
//                 {workout &&  برنامجك يتطابق ${workout.score}% مع هدفك.}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* ── Stat Chips ── */}
//         <div className="grid grid-cols-4 gap-3">
//           {body && (
//             <StatChip icon="⚖️" label="BMI Index"
//               value={body.bmi.toFixed(1)} color="#22d3ee" delay={100} />
//           )}
//           {sleep && (
//             <StatChip icon="🌙" label="Sleep Eff."
//               value={${sleep.efficiency}%} color="#a78bfa" delay={200} />
//           )}
//           {body && (
//             <StatChip icon="🔥" label="TDEE / day"
//               value={body.tdee.toLocaleString()} color="#f59e0b" delay={300} />
//           )}
//           {workout && (
//             <StatChip icon="💪" label="Match Score"
//               value={${workout.score}%} color="#34d399" delay={400} />
//           )}
//         </div>

//         {/* ── Module Panels ── */}
//         <div className="grid grid-cols-3 gap-4">
//           {body && (
//             <ModulePanel
//               icon="◎" title="Body Metrics"
//               score={body.score} color="#22d3ee" delay={200}
//               metrics={[
//                 { label: 'BMI',      value: `${body.bmi.toFixed(1)}`,  bar: (body.bmi / 40) * 100 },
//                 { label: 'Body Fat', value: `${body.bodyFat}%`,        bar: body.bodyFat },
//                 { label: 'BMR',      value: `${body.bmr} kcal`,        bar: (body.bmr / 2500) * 100 },
//                 { label: 'Status',   value: body.metabolicStatus },
//               ]}
//             />
//           )}

//           {sleep && (
//             <ModulePanel
//               icon="◐" title="Sleep Quality"
//               score={sleep.score} color="#a78bfa" delay={350}
//               metrics={[
//                 { label: 'Efficiency',  value: ${sleep.efficiency}%,      bar: sleep.efficiency },
//                 { label: 'Duration',    value: ${sleep.sleepDuration}h,   bar: (sleep.sleepDuration / 9) * 100 },
//                 { label: 'Awakenings', value: ${sleep.awakenings}×,       bar: 100 - sleep.awakenings * 15 },
//                 { label: 'Exercise',    value: sleep.exerciseEval },
//               ]}
//             />
//           )}

//           {workout && (
//             <ModulePanel
//               icon="◇" title="Workout Plan"
//               score={workout.score} color="#34d399" delay={500}metrics={[
//                 { label: 'Match',     value: ${workout.score}%,                    bar: workout.score },
//                 { label: 'Duration',  value: ${workout.programLength}w,            bar: (workout.programLength / 16) * 100 },
//                 { label: 'Exercises', value: workout.totalExercises.toLocaleString(), bar: 85 },
//                 { label: 'Level',     value: workout.level },
//               ]}
//             />
//           )}
//         </div>

//         {/* ── Footer Insight ── */}
//         <div className="relative overflow-hidden rounded-2xl p-5 flex items-start gap-4"
//           style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
//           <div className="absolute top-0 left-0 right-0 h-px"
//             style={{ background: 'linear-gradient(90deg, transparent, rgba(0,180,255,0.4), transparent)' }} />

//           <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
//             style={{ background: 'rgba(0,150,255,0.1)', border: '1px solid rgba(0,150,255,0.2)' }}>
//             ✦
//           </div>
//           <div className="flex flex-col gap-1">
//             <p className="text-sm font-bold text-slate-200">AI Health Insight</p>
//             <p className="text-xs text-slate-400 leading-relaxed">
//               {body && <>جسمك بصحة جيدة — {body.bmiInsight} وكتلة عضلية ممتازة. </>}
//               {sleep && sleep.score < 80 && <>أهم توصية: حسّن جودة نومك. </>}
//               {workout && (
//                 <>برنامج التدريب المختار يتطابق{' '}
//                   <span className="text-emerald-400 font-semibold font-mono">{workout.score}%</span>
//                   {' '}مع هدفك الحالي.</>
//               )}
//             </p>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }metrics={[
//                 { label: 'Match',     value: `${workout.score}%`,                    bar: workout.score },
//                 { label: 'Duration',  value: `${workout.programLength}w`,            bar: (workout.programLength / 16) * 100 },
//                 { label: 'Exercises', value: `${workout.totalExercises.toLocaleString()}`, bar: 85 },
//                 { label: 'Level',     value: workout.level },
//               ]}
//             />
//           )}
//         </div>

//         {/* ── Footer Insight ── */}
//         <div className="relative overflow-hidden rounded-2xl p-5 flex items-start gap-4"
//           style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
//           <div className="absolute top-0 left-0 right-0 h-px"
//             style={{ background: 'linear-gradient(90deg, transparent, rgba(0,180,255,0.4), transparent)' }} />

//           <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
//             style={{ background: 'rgba(0,150,255,0.1)', border: '1px solid rgba(0,150,255,0.2)' }}>
//             ✦
//           </div>
//           <div className="flex flex-col gap-1">
//             <p className="text-sm font-bold text-slate-200">AI Health Insight</p>
//             <p className="text-xs text-slate-400 leading-relaxed">
//               {body && <>جسمك بصحة جيدة — {body.bmiInsight} وكتلة عضلية ممتازة. </>}
//               {sleep && sleep.score < 80 && <>أهم توصية: حسّن جودة نومك. </>}
//               {workout && (
//                 <>برنامج التدريب المختار يتطابق{' '}
//                   <span className="text-emerald-400 font-semibold font-mono">{workout.score}%</span>
//                   {' '}مع هدفك الحالي.</>
//               )}
//             </p>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }