


import { useSleepStore } from '../sleepStore'
import { getSleepInsight } from '../../../shared/utils/insightMapper'
import { Moon, Coffee, Activity, Bell, type LucideIcon  } from 'lucide-react'

const factorConfig: Record<string, { label: string; unit: string; icon: LucideIcon; color: string }> = {
  sleep_duration: { label: 'sleep_duration', unit: 'hour', icon: Moon, color: 'text-blue-400' },
  caffeine: { label:'caffeine', unit: 'ml', icon: Coffee, color: 'text-orange-400' },
  awakenings: { label: 'awakenings', unit: 'times', icon: Bell, color: 'text-purple-400' },
  exercise_frequency: { label: 'exercise_frequency', unit: 'days/week', icon: Activity, color: 'text-emerald-400' },
 alcohol: { label: 'alcohol', unit: 'glasses', icon:Coffee, color: 'text-orange-400' }
}

export function SleepDashboard() {
  const { result, details } = useSleepStore()

  if (!result || !details?.factors_analysis) return null

  const efficiency = result.predicted_efficiency ?? 0
  const factors = details.factors_analysis

  // إعدادات الدولاب (Circle Settings)
  const radius = 70;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (efficiency / 100) * circumference;

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{ 
        // ضع رابط صورتك هنا
        backgroundImage: `url('src/assets/sleep.jpeg')`,
      }}
    >
     

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* القسم الأيسر: الدولاب (Hero Section) */}
        <div className="lg:col-span-5 bg-black/30 backdrop-blur-md border border-white/10 rounded-[2rem] p-10 flex flex-col items-center justify-center shadow-2xl">
          <div className="relative">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              {/* الدائرة الخلفية */}
              <circle
                stroke="white"
                fill="transparent"
                strokeWidth={stroke}
                strokeOpacity={0.05}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              {/* الدائرة الملونة (الدولاب) */}
              <circle
                stroke="#60a5fa" // يمكن تغيير اللون حسب الكفاءة
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            
            {/* النص داخل الدولاب */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white">{efficiency}%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Sleep Efficiency</span>
            </div>
          </div>

          <div className="mt-8 text-center">
             <h2 className="text-xl font-medium text-white mb-1">Your Daily Report</h2>
             <p className="text-emerald-400 text-sm font-semibold tracking-wide">
               {getSleepInsight(result.efficiency_label ?? '')}
             </p>
          </div>
        </div>

        {/* القسم الأيمن: العوامل (Factors Grid) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(factors).map(([key, factor]) => {
            const config = factorConfig[key]
            if (!config) return null
            const Icon = config.icon

            return (
              <div key={key} className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:bg-white/10 transition-all group">
                <div className="flex justify-between items-start">
                  <div className={`p-2.5 rounded-xl bg-black/20 ${config.color}`}>
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <span className="text-[20px] font-bold px-2 py-1 rounded bg-white/5 text-slate-900">
                    {factor.evaluation}
                  </span>
                </div>
                
                <div className="mt-6">
                  <span className="text-slate-600 text-xxs block mb-1">{config.label}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-semibold text-black">{factor.value}</span>
                    <span className="text-[13px] text-slate-600 uppercase">{config.unit}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}