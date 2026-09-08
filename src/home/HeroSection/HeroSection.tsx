import { useRef } from "react";
import heropg from "../../assets/Heroimage.jpg";
import useParticles from "./useParticles";
import HeroContent from "./HeroContent";

interface Props {
  onGetStarted?: () => void;
  onLoginClick?: () => void;
}

const HeroSection: React.FC<Props> = ({ onGetStarted, onLoginClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useParticles(canvasRef);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heropg})` }}
      />

      {/* overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/40 via-transparent to-teal-900/20" />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Scanline */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="scanline absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      </div>

      {/* Content */}
      <HeroContent
      onGetStarted={onGetStarted} 
      onLoginClick={onLoginClick}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />

      {/* Styles */}
      <style>{`
        @keyframes scanline {
          0% { top: -2px; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .scanline {
          animation: scanline 6s linear infinite;
        }

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
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