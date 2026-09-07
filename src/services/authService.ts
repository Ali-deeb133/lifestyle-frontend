import api from "./api";
import {
 type RegisterRequest,
 type RegisterResponse,
  type LoginRequest,
  type LoginResponse,
} from "../types/auth.types";

// ─── Auth Service ─────────────────────────────────────────────────────────────

const authService = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(
      "/api/accounts/register/",
      data
    );
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
      "/api/accounts/login/",
      data
    );
    return response.data;
  },

 logout: async (refresh: string): Promise<void> => {
  await api.post("/api/accounts/logout/", { refresh });
}
};

export default authService;