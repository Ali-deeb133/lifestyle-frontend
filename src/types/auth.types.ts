// ─── Request Types ────────────────────────────────────────────────────────────

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LogoutRequest {
  refresh: string;
}

// ─── Response Types ───────────────────────────────────────────────────────────

export type RegisterResponse = AuthUser;

export interface LoginResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

// ─── App User Type ────────────────────────────────────────────────────────────

export interface AuthUser {
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  join_date: string;
}

export type User = AuthUser;

export type AuthMode = "login" | "register";

// ─── Error Types ─────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  status?: number;
  field_errors?: Record<string, string[]>;
}