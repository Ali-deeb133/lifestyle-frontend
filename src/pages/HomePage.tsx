



import { useState } from "react";
import { useNavigate } from "react-router-dom";

import HeroSection from "../home/HeroSection/HeroSection";
import FeaturesSection from "../home/FeatureSection";

import { AuthModal } from "../features/auth/AuthModel";
import { useAuth } from "../features/auth/useAuth";

// toast system (إذا عندك)
import { Toast } from "../shared/utils/toaster";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { isAuthenticated } = useAuth();

  const handleStart = () => {
    if (!isAuthenticated) {
      Toast.error("الرجاء تسجيل الدخول أولاً");
      // setIsAuthOpen(true); // مهم: ما تتركه ساكت
      return;
    }

    navigate("/dashboard");
  };

  const handleLogin = () => {
    setIsAuthOpen(true);
  };

  return (
    <>
      <HeroSection
        onGetStarted={handleStart}
        onLoginClick={handleLogin}
      />

      <FeaturesSection />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
};

export default HomePage;