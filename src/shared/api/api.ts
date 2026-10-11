import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { toAppError } from "../errors/errorUtils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const REFRESH_URL = "/api/accounts/token/refresh/";
// 401 من هدول معناه بيانات دخول غلط، مو جلسة منتهية → ما في refresh
const NO_REFRESH_URLS = [REFRESH_URL, "/api/accounts/login/", "/api/accounts/register/"];

export const tokenStorage = {
  getAccess: (): string | null =>
    localStorage.getItem(ACCESS_TOKEN_KEY),

  getRefresh: (): string | null =>
    localStorage.getItem(REFRESH_TOKEN_KEY),

  setTokens: (access: string, refresh: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },

  setAccess: (access: string): void =>
    localStorage.setItem(ACCESS_TOKEN_KEY, access),

  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ─── Request Interceptor ────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = tokenStorage.getAccess();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject((error))
);

// ─── Refresh ────────────────────────────────────────────
// طلب refresh واحد مشترك — كل طلب رجع 401 بينتظره وبعدين بيعيد حاله
let refreshPromise: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${BASE_URL}${REFRESH_URL}`,
        { refresh: tokenStorage.getRefresh() },
        { headers: { "Content-Type": "application/json" }, timeout: 15000 }
      )
      .then(({ data }) => {
        const newAccessToken: string = data.access;
        tokenStorage.setAccess(newAccessToken);
        // إذا السيرفر بيدوّر الـ refresh token خزّن الجديد
        if (typeof data.refresh === "string") {
          tokenStorage.setTokens(newAccessToken, data.refresh);
        }
        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

function forceLogout(): void {
  tokenStorage.clearTokens();
  window.dispatchEvent(new Event("auth:logout"));
}

// ─── Response Interceptor ───────────────────────────────
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,

  async (error) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const is401 = error.response?.status === 401;
    const url = originalRequest?.url ?? "";
    const skipRefresh = NO_REFRESH_URLS.some((path) => url.includes(path));

    // مو 401 أو endpoint بلا refresh أو already retried → حول مباشرة
    if (!originalRequest || !is401 || skipRefresh || originalRequest._retry) {
      return Promise.reject(toAppError(error));
    }

    originalRequest._retry = true;

    // ما في refresh token → logout
    if (!tokenStorage.getRefresh()) {
      forceLogout();
      return Promise.reject(toAppError(error));
    }

    let newAccessToken: string;
    try {
      newAccessToken = await refreshAccessToken();
    } catch (refreshError) {
      // السيرفر رفض الـ refresh token → logout. مشكلة شبكة/سيرفر → خلي الجلسة
      const status = axios.isAxiosError(refreshError)
        ? refreshError.response?.status
        : undefined;
      if (status === 400 || status === 401 || status === 403) {
        forceLogout();
      }
      return Promise.reject(toAppError(refreshError));
    }

    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    return api(originalRequest);
  }
);

export default api
