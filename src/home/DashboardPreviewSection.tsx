import useVisible from "./hooks/useVisible";

import BodyDashboard from "./dashboards/BodyDashbord";
import SleepDashboard from "./dashboards/SleepDashboard";
import WorkoutDashboard from "./dashboards/WorkoutDashboard";

const DashboardPreviewSection: React.FC = () => {
  const { ref: dashRef, visible: dashVisible } = useVisible(0.1);

  return (
    <div ref={dashRef} className="max-w-5xl mx-auto">
      
      {/* Sub-header */}
      <div
        className="text-center mb-12"
        style={{
          opacity: dashVisible ? 1 : 0,
          transform: dashVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <span className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 text-slate-400 text-xs font-semibold tracking-widest uppercase mb-4">
          Live Preview
        </span>

        <h3 className="text-white text-2xl md:text-4xl font-extrabold tracking-tight mb-3">
          Your dashboard, before you sign up.
        </h3>

        <p className="text-slate-500 text-sm max-w-md mx-auto">
          This is exactly what your data looks like once analyzed — real numbers, real insights.
        </p>
      </div>

      {/* Dashboards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BodyDashboard visible={dashVisible} />
        <SleepDashboard visible={dashVisible} />
        <WorkoutDashboard visible={dashVisible} />
      </div>

      {/* Bottom note */}
      <p
        className="text-center text-slate-700 text-xs mt-8"
        style={{
          opacity: dashVisible ? 1 : 0,
          transition: "opacity 0.7s ease 700ms",
        }}
      >
        * All values shown are sample data — your results will be calculated from your actual profile.
      </p>
    </div>
  );
};

export default DashboardPreviewSection;