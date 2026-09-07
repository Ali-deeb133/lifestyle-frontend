import { useNavigate } from "react-router-dom";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  return (
    <main className="bg-slate-950 min-h-screen">
      <HeroSection onGetStarted={handleGetStarted} />
      <FeaturesSection />
    </main>
  );
};

export default HomePage;