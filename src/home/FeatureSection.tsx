import AppIntroSection from "./AppIntroSection";
import DashboardPreviewSection from "./DashboardPreviewSection";

const FeaturesSection = () => {
  return (
    <section className="relative bg-slate-950 overflow-hidden">
      <div className="py-24 px-4">
        <AppIntroSection />
      </div>

      <div className="py-24 px-4">
        <DashboardPreviewSection />
      </div>
    </section>
  );
};

export default FeaturesSection;