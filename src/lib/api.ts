import axios, { AxiosError } from "axios";
import { getToken, clearToken } from "./auth";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://quiz-bd-g5de.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach Bearer token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Helper to extract a readable error message from FastAPI responses
export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: unknown; detail?: unknown; error_code?: string }
      | undefined;

    if (!data) return "Network error. Please check your connection.";

    // Backend AppError custom structure: { message: "...", error_code: "..." }
    if (
      typeof data.message === "string" &&
      data.message.trim() &&
      data.message !== "Request validation failed"
    ) {
      return data.message;
    }

    // FastAPI validation errors: { detail: [{loc, msg, type}] }
    if (Array.isArray(data.detail)) {
      const messages = data.detail
        .map((d) => (typeof d === "string" ? d : d?.msg || JSON.stringify(d)))
        .filter(Boolean);
      if (messages.length > 0) return messages.join(", ");
    }

    // FastAPI string detail: { detail: "..." }
    if (typeof data.detail === "string") {
      return data.detail;
    }

    // Generic message fallback
    if (typeof data.message === "string") {
      return data.message;
    }

    const status = error.response?.status;
    if (status === 401) return "Authentication required. Please sign in.";
    if (status === 403) return "You are not authorized to perform this action.";
    if (status === 404) return "The requested resource was not found.";
    if (status === 409) return "A conflict occurred. Please try again.";
    if (status === 422) return "Invalid submission details. Please check your input.";
    if (status === 429) return "Too many requests. Please slow down.";
    if (status && status >= 500) return "Server error. Please try again later.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

// Helper to extract field-level errors for React Hook Form
export function getFieldErrors(
  error: unknown
): Record<string, string> | null {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (Array.isArray(data?.detail)) {
      const fieldErrors: Record<string, string> = {};
      data.detail.forEach((d: { loc: string[]; msg: string }) => {
        const field = d.loc[d.loc.length - 1];
        if (field) fieldErrors[field] = d.msg;
      });
      return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
    }
  }
  return null;
}
