import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { toAppError } from "../errors/errorUtils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

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

// ─── Refresh Queue ──────────────────────────────────────
let isRefreshing = false;
let failedQueue: {
  resolve: (value: AxiosResponse) => void;
  reject: (error: unknown) => void;
}[] = [];

// ─── Response Interceptor ───────────────────────────────
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,

  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const is401 = error.response?.status === 401;
    const isRefreshEndpoint = originalRequest.url?.includes(
      "/api/accounts/token/refresh/"
    );
    const alreadyRetried = originalRequest._retry;

    // مو 401 أو refresh endpoint أو already retried → حول مباشرة
    if (!is401 || isRefreshEndpoint || alreadyRetried) {
      return Promise.reject(toAppError(error));  // ← هون
    }

    // في refresh جاري — حط الطلب بالقائمة
    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = tokenStorage.getRefresh();

    // ما في refresh token → logout
    if (!refreshToken) {
      isRefreshing = false;
      tokenStorage.clearTokens();
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(toAppError(error));  // ← هون
    }

    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/accounts/token/refresh/`,
        { refresh: refreshToken },
        { headers: { "Content-Type": "application/json" } }
      );

      const newAccessToken: string = data.access;
      tokenStorage.setAccess(newAccessToken);

      // حل كل الطلبات المعلقة
      failedQueue.forEach(({ resolve, reject }) => {
        api(originalRequest).then(resolve).catch(reject);
      });
      failedQueue = [];

      if (originalRequest.headers) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      }

      return api(originalRequest);

    } catch (refreshError) {
      // refresh فشل → حول الأخطاء المعلقة + logout
      failedQueue.forEach(({ reject }) => reject(toAppError(refreshError)));  // ← هون
      failedQueue = [];
      tokenStorage.clearTokens();
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(toAppError(refreshError));  // ← هون
    } finally {
      isRefreshing = false;
    }
  }
);

export default api