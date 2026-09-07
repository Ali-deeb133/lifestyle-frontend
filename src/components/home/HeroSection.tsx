import { useEffect, useRef } from "react";
import heropg from "../../assets/hero-section.jpg";
interface HeroSectionProps {
  onGetStarted?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Floating particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
    }[] = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 220, 200, ${p.alpha})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heropg})` }}
      />

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* Cyan tint overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/40 via-transparent to-teal-900/20" />

      {/* Floating particles canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Horizontal scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="scanline absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">

        {/* Badge */}
        <div className="hero-item mb-6" style={{ animationDelay: "0.1s" }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-xs font-semibold tracking-widest uppercase backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AI-Powered Health Intelligence
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="hero-item font-extrabold leading-tight mb-4" style={{ animationDelay: "0.25s" }}>
          <span className="block text-white text-5xl md:text-7xl tracking-tight drop-shadow-lg">
            Your Body.
          </span>
          <span
            className="block text-5xl md:text-7xl tracking-tight"
            style={{
              background: "linear-gradient(90deg, #22d3ee, #34d399, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Understood.
          </span>
        </h1>

        {/* Sub-headline */}
        <p
          className="hero-item text-slate-300 text-lg md:text-xl max-w-2xl leading-relaxed mb-3"
          style={{ animationDelay: "0.4s" }}
        >
          Track your body metrics, sleep quality, and fitness — all in one
          intelligent dashboard powered by advanced bio-algorithms.
        </p>

        {/* Secondary description */}
        <p
          className="hero-item text-slate-400 text-sm md:text-base max-w-xl leading-relaxed mb-10"
          style={{ animationDelay: "0.5s" }}
        >
          BMI · BMR · TDEE · Sleep Efficiency · Smart Workout Plans —
          personalized to your exact profile.
        </p>

        {/* CTA Button */}
        <div className="hero-item" style={{ animationDelay: "0.65s" }}>
          <button
            onClick={onGetStarted}
            className="group relative px-10 py-4 text-base font-bold text-black rounded-full overflow-hidden shadow-2xl
              transition-transform duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #22d3ee, #34d399)",
              boxShadow: "0 0 40px rgba(34,211,238,0.35), 0 4px 24px rgba(0,0,0,0.4)",
            }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
                transform: "skewX(-20deg)",
              }}
            />
            <span className="relative flex items-center gap-2">
              Start Your Journey
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>

        {/* Scroll hint */}
        <div
          className="hero-item mt-14 flex flex-col items-center gap-2 opacity-60"
          style={{ animationDelay: "0.9s" }}
        >
          <span className="text-slate-400 text-xs tracking-widest uppercase">Scroll to explore</span>
          <div className="w-px h-10 bg-gradient-to-b from-slate-400/60 to-transparent animate-pulse" />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />

      <style>{`
        @keyframes scanline {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .scanline {
          animation: scanline 6s linear infinite;
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-item {
          opacity: 0;
          animation: heroFadeUp 0.7s ease forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;