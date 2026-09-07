import { useState, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import authService from "../services/authService";
import { tokenStorage } from "../services/api";
import { type RegisterRequest, type LoginRequest, type ApiError } from "../types/auth.types";
import handleApiError from "../utils/handleApiError";

const useAuth = () => {
  // ─── Local State ─────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const {
    user,
    isAuthenticated,
    isModalOpen,
    modalMode,
    setUser,
    clearUser,
    openModal,
    closeModal,
    toggleModal,
    switchMode,
  } = useAuthStore();

  // ─── Init Auth ────────────────────────────────────────────────────────────
  const initAuth = useCallback((): void => {
    const access = tokenStorage.getAccess();
    const refresh = tokenStorage.getRefresh();
    if (!access || !refresh) {
      clearUser();
    }
  }, [clearUser]);

  // ─── Register ─────────────────────────────────────────────────────────────
  const register = useCallback(
    async (data: RegisterRequest): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. سجّل المستخدم
        await authService.register(data);
        // 2. سجّل دخول تلقائياً وجيب التوكنز والـ user
        const { access, refresh, user } = await authService.login({
          email: data.email,
          password: data.password,
        });
        // 3. خزّن التوكنز
        tokenStorage.setTokens(access, refresh);
        // 4. خزّن المستخدم في Store
        setUser(user);
        closeModal();
        return true;
      } catch (err) {
        setError(handleApiError(err));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, closeModal]
  );

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (data: LoginRequest): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. جيب التوكنز والـ user من الباك
        const { access, refresh, user } = await authService.login(data);
        // 2. خزّن التوكنز في localStorage
        tokenStorage.setTokens(access, refresh);
        // 3. خزّن المستخدم في Store
        setUser(user);
        closeModal();
        return true;
      } catch (err) {
        setError(handleApiError(err));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, closeModal]
  );

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async (): Promise<void> => {
    const refresh = tokenStorage.getRefresh();
    try {
      if (refresh) {
        await authService.logout(refresh);
      }
    } catch {
      // فشل الـ request مش مشكلة
    } finally {
      tokenStorage.clearTokens();
      clearUser();
    }
  }, [clearUser]);

  // ─── Modal Helpers ────────────────────────────────────────────────────────
  const openLogin = useCallback(() => openModal("login"), [openModal]);
  const openRegister = useCallback(() => openModal("register"), [openModal]);
  const switchToLogin = useCallback(() => switchMode("login"), [switchMode]);
  const switchToRegister = useCallback(() => switchMode("register"), [switchMode]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    isModalOpen,
    modalMode,

    // Actions
    initAuth,
    register,
    login,
    logout,

    // Modal
    openLogin,
    openRegister,
    closeModal,
    toggleModal,
    switchToLogin,
    switchToRegister,
  };
};

export default useAuth;