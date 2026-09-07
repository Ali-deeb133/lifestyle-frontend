import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser } from "../types/auth.types";
import type { AuthMode } from "../types/auth.types";

// ============================================================
// State Interface
// ============================================================

interface AuthStore {
  // ---- Data ----
  user: AuthUser | null;

  // ---- Computed ----
  isAuthenticated: () => boolean;

  // ---- UI ----
  isModalOpen: boolean;
  modalMode: AuthMode;

  // ---- Actions ----
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;

  // ---- UI Actions ----
  openModal: (mode?: AuthMode) => void;
  closeModal: () => void;
  toggleModal: () => void;
  switchMode: (mode: AuthMode) => void;
}

// ============================================================
// Store
// ============================================================

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // ---- Initial State ----
      user: null,
      isModalOpen: false,
      modalMode: "login",

      // ---- Computed ----
      isAuthenticated: () => get().user !== null,

      // ---- Data Actions ----
      setUser: (user) => {
        set({ user });
      },

      clearUser: () => {
        set({
          user: null,
          isModalOpen: false,
        });
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      // ---- UI Actions ----
      openModal: (mode = "login") =>
        set({ isModalOpen: true, modalMode: mode }),

      closeModal: () => set({ isModalOpen: false }),

      toggleModal: () => {
        const { isModalOpen } = get();
        set({ isModalOpen: !isModalOpen });
      },

      switchMode: (mode) => set({ modalMode: mode }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    }
  ));