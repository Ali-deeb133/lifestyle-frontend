import axios, {
  type AxiosError,
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
// توكن قديم/غلط بالـ localStorage ما لازم يسبب 401 عالدخول أو التسجيل → بلا Authorization
const NO_AUTH_URLS = ["/api/accounts/login/", "/api/accounts/register/"];

// ─── Cold Start Retry Config ────────────────────────────
// السيرفر نايم (Render free tier) → الطلب بيرجع بلا response
// - اتصال مرفوض/مقطوع: الطلب ما وصل للتطبيق → أي method بتتعاد لحد MAX_RETRIES
// - timeout: يمكن السيرفر لسا عم يعالج الطلب → بس GET/HEAD بتتعاد،
//   والكتابة بتاخد محاولة وحدة طويلة (WRITE_TIMEOUT) لتفادي التكرار
// - المتصفح offline: بلا إعادة، الخطأ بيطلع فوراً
const TIMEOUT = 15_000;
const MAX_RETRIES = 5;
const RETRY_DELAY = 4_000;
const WRITE_TIMEOUT = 75_000; // الـ cold start تقريباً دقيقة

const isReadOnly = (config: InternalAxiosRequestConfig) =>
  ["get", "head"].includes((config.method ?? "get").toLowerCase());

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
  timeout: TIMEOUT,
});

// ─── Request Interceptor ────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = tokenStorage.getAccess();
    const skipAuth = NO_AUTH_URLS.some((path) => (config.url ?? "").includes(path));
    if (token && config.headers && !skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Cold start: طلبات الكتابة بتاخد محاولة وحدة طويلة بدل الإعادة
    // بس إذا الطلب ما حدد timeout خاص فيه
    if (!isReadOnly(config) && config.timeout === TIMEOUT) {
      config.timeout = WRITE_TIMEOUT;
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

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean; // الـ refresh عند 401
          _retryCount?: number; // إعادة الـ cold start
        })
      | undefined;

    // ─── Cold Start Retry ───
    // !error.response → السيرفر ما رد أبداً (نايم/مرفوض/مقطوع)، عكس 401 أو 400
    const isNetworkError = !error.response;
    const isOffline = typeof navigator !== "undefined" && navigator.onLine === false;

    if (isNetworkError && originalRequest && !isOffline && !axios.isCancel(error)) {
      const isTimeout = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
      const maxRetries = isTimeout && !isReadOnly(originalRequest) ? 0 : MAX_RETRIES;

      originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;

      if (originalRequest._retryCount <= maxRetries) {
        await wait(RETRY_DELAY);
        return api(originalRequest);
      }
    }

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
