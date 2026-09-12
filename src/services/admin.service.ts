import api from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { AdminAnalytics, AdminUsersResponse, AdminUsersParams, QuizMasterSummary } from "@/types/admin";

export const adminService = {
  async getAnalytics(): Promise<AdminAnalytics> {
    const res = await api.get<AdminAnalytics>(API_ENDPOINTS.admin.analytics);
    return res.data;
  },

  async getUsers(params?: AdminUsersParams): Promise<AdminUsersResponse> {
    const queryParams: Record<string, any> = {
      ...params,
      limit: params?.per_page || 20,
    };
    const res = await api.get<any>(API_ENDPOINTS.admin.users, {
      params: queryParams,
    });
    const raw = res.data;
    const rawList = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.users)
      ? raw.users
      : Array.isArray(raw?.data)
      ? raw.data
      : [];

    const normalizedUsers = rawList.map((u: any) => ({
      ...u,
      id: u.id || u._id || "",
      role: u.role || "user",
      phone: u.phone || u.phone_number || "",
      phone_number: u.phone_number || u.phone || "",
      gst_courses: u.gst_courses || u.gst_codes || [],
      gst_codes: u.gst_codes || u.gst_courses || [],
    }));

    const total = typeof raw?.total === "number" ? raw.total : normalizedUsers.length;
    const perPage = raw?.per_page ?? raw?.limit ?? params?.per_page ?? 20;
    const totalPages =
      raw?.total_pages ?? raw?.pages ?? (Math.ceil(total / perPage) || 1);

    return {
      users: normalizedUsers,
      total,
      page: raw?.page ?? params?.page ?? 1,
      per_page: perPage,
      total_pages: totalPages,
    };
  },

  async exportUsers(): Promise<void> {
    const res = await api.get(API_ENDPOINTS.admin.exportUsers, {
      responseType: "blob",
    });

    // Attempt to use server-provided filename
    const disposition = res.headers["content-disposition"] as string | undefined;
    let filename = "users_export.csv";
    if (disposition) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match?.[1]) filename = match[1];
    }

    const url = URL.createObjectURL(res.data as Blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },

  async getQuizMasters(): Promise<QuizMasterSummary[]> {
    const res = await api.get<QuizMasterSummary[]>(
      API_ENDPOINTS.admin.quizMasters
    );
    return res.data;
  },
};
