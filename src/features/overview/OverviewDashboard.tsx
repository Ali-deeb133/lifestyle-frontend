

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
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 300)
    return () => clearTimeout(t)
  }, [score])

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
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 600)
    return () => clearTimeout(t)
  }, [score])

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
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

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
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

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
        <p className="text-sm font-semibold text-slate-700">No data available yet</p>
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
    <div className="@container min-h-screen bg-slate-900 text-black p-4 sm:p-6 flex justify-center"
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
        <div className="flex flex-wrap items-center justify-between gap-3">
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
        <div className="relative overflow-hidden rounded-3xl p-5 @2xl:p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 50%, rgba(16,185,129,0.05) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}>

          <div className="absolute top-0 left-0 w-32 h-32 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)', transform: 'translate(-50%,-50%)' }} />
          <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #10b981, transparent)', transform: 'translate(30%,30%)' }} />

          <div className="relative z-10 flex flex-col @2xl:flex-row items-center gap-6 @2xl:gap-8">
            <HealthScoreRing score={healthScore} />

            <div className="w-full @2xl:w-auto flex-1 min-w-0 flex flex-col gap-5">
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
                  ? 'Your health is excellent — keep up the good work 🌟'
                  : healthScore >= 60
                  ? 'Your health is good — some areas need minor improvements.'
                  : 'Your health needs attention — please review the details below.'
                }
                {body    && ` ${body.bmiInsight}.`}
                {sleep   && ` ${sleep.insight}.`}
                {workout && ` Your workout plan matches ${workout.score}% with your goal.`}
              </p>
            </div>
          </div>
        </div>

        {/* ── Stat Chips ── */}
        <div className="grid grid-cols-2 @2xl:grid-cols-4 gap-3">
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
        <div className="grid grid-cols-1 @2xl:grid-cols-3 gap-4">
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
                { label: 'Awakenings', value: `${sleep.awakenings}×`,       bar: Math.max(0, 100 - sleep.awakenings * 15) },
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
            <p className="text-sm font-bold text-slate-200">Health Insight</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {body && <>{body.bmiInsight}. Body fat: {body.fatCategory}. Metabolism: {body.metabolicStatus}. </>}
              {sleep && sleep.score < 80 && <>Key recommendation: Improve your sleep quality. </>}
              {workout && (
                <>The chosen workout plan is a{' '}
                  <span className="text-emerald-400 font-semibold font-mono">{workout.score}%</span>
                  {' '}match for your current goal.</>
              )}
            </p>
          </div>
        </div>

      </div>
    </div>
 ) }
