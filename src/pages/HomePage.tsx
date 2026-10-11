import { useState } from "react";
import { useNavigate } from "react-router-dom";

import HeroSection from "../home/HeroSection/HeroSection";
import FeaturesSection from "../home/FeatureSection";

import { AuthModal } from "../features/auth/AuthModal";
import { useAuth } from "../features/auth/useAuth";

// toast system (إذا عندك)
import { Toast } from "../shared/utils/toaster";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { isAuthenticated, isInitialized } = useAuth();

  const handleStart = () => {
    // لسا عم نتحقق من الجلسة → ProtectedRoute بينتظر وبيقرر
    if (isAuthenticated || !isInitialized) {
      navigate("/dashboard");
      return;
    }

    Toast.error("Please log in first");
    setIsAuthOpen(true);
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
