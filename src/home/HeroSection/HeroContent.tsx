import { useState } from "react";
import { useAuth } from "../../features/auth/useAuth";

interface Props {
  onGetStarted?: () => void;
  onLoginClick?: () => void;
}

const HeroContent: React.FC<Props> = ({ onGetStarted, onLoginClick }) => {
  const { isAuthenticated, logout } = useAuth();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  return (
    <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">

      {/* Badge */}
      <div className="hero-item mb-6" style={{ animationDelay: "0.1s" }}>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-xs font-semibold tracking-widest uppercase backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          AI-Powered Health Intelligence
        </span>
      </div>

      {/* Title */}
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
          }}
        >
          Understood.
        </span>
      </h1>

      {/* Description */}
      <p className="hero-item text-slate-300 text-lg md:text-xl mb-3" style={{ animationDelay: "0.4s" }}>
        Track your body metrics, sleep quality, and fitness — all in one intelligent dashboard.
      </p>

      <p className="hero-item text-slate-400 text-sm md:text-base mb-10" style={{ animationDelay: "0.5s" }}>
        BMI · BMR · TDEE · Sleep Efficiency · Smart Workout Plans
      </p>

      {/* CTA */}
      <div className="hero-item flex gap-4" style={{ animationDelay: "0.65s" }}>
        
        <button
          onClick={onGetStarted}
          className="group px-10 py-4 rounded-full font-bold text-black"
          style={{ background: "linear-gradient(135deg,#22d3ee,#34d399)" }}
        >
          Analyze
        </button>

        {isAuthenticated ? (
          <button
            onClick={() => setShowLogoutModal(true)}
            className="group px-10 py-4 rounded-full font-bold text-black"
            style={{ background: "linear-gradient(135deg, #f87171, #ef4444)" }}
          >
            Logout
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="group px-10 py-4 rounded-full font-bold text-black"
            style={{ background: "linear-gradient(135deg, #22d3ee, #34d399)" }}
          >
            Login
          </button>
        )}
      </div>

      {/* MODAL */}
      {showLogoutModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">

    <div
      className="
        w-[280px]
        rounded-3xl
        border border-white/10
        bg-slate-900/95
        shadow-xl
        p-5
        text-center
        animate-scale-in
      "
    >
      <div className="mb-4">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
          <span className="text-xl">⚠️</span>
        </div>

        <p className="text-white text-sm font-semibold">
          Confirm Logout
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Are you sure?
        </p>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <button
          onClick={() => setShowLogoutModal(false)}
          className="
            px-4 py-2
            rounded-xl
            bg-slate-700 hover:bg-slate-600
            text-white text-xs
            transition-all duration-150
          "
        >
          No
        </button>

        <button
          onClick={handleConfirmLogout}
          className="
            px-4 py-2
            rounded-xl
            bg-red-500 hover:bg-red-400
            text-white text-xs
            transition-all duration-150
          "
        >
          Yes
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default HeroContent;