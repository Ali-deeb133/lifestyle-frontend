import axios from "axios";

// ─── Error Types ──────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  status?: number;
  field_errors?: Record<string, string[]>;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

const handleApiError = (err: unknown): ApiError => {
  // ─── Axios Error ────────────────────────────────────────────────────────────
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data;

    // Field errors مثل { email: ["already exists"], password: ["too short"] }
    const field_errors: Record<string, string[]> = {};
    if (data && typeof data === "object") {
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          field_errors[key] = value;
        }
      });
    }

    // رسالة الخطأ — بالأولوية
    const message =
      data?.detail ||
      data?.message ||
      data?.error ||
      getStatusMessage(status);

    return {
      message,
      status,
      field_errors: Object.keys(field_errors).length > 0 ? field_errors : undefined,
    };
  }

  // ─── Network Error ───────────────────────────────────────────────────────────
  if (err instanceof Error) {
    if (err.message === "Network Error") {
      return { message: "تحقق من اتصالك بالإنترنت" };
    }
    return { message: err.message };
  }

  // ─── Unknown Error ───────────────────────────────────────────────────────────
  return { message: "حدث خطأ غير متوقع" };
};

// ─── Status Messages ─────────────────────────────────────────────────────────

const getStatusMessage = (status?: number): string => {
  switch (status) {
    case 400: return "البيانات المدخلة غير صحيحة";
    case 401: return "يجب تسجيل الدخول أولاً";
    case 403: return "ليس لديك صلاحية للوصول";
    case 404: return "المورد المطلوب غير موجود";
    case 409: return "البيانات موجودة مسبقاً";
    case 422: return "البيانات المدخلة غير صالحة";
    case 429: return "طلبات كثيرة، حاول لاحقاً";
    case 500: return "خطأ بالسيرفر، حاول لاحقاً";
    case 503: return "الخدمة غير متاحة حالياً";
    default:  return "حدث خطأ غير متوقع";
  }
};

export default handleApiError;