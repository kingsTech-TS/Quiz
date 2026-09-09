import api from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { AdminAnalytics, AdminUsersResponse, AdminUsersParams, QuizMasterSummary } from "@/types/admin";

export const adminService = {
  async getAnalytics(): Promise<AdminAnalytics> {
    const res = await api.get<AdminAnalytics>(API_ENDPOINTS.admin.analytics);
    return res.data;
  },

  async getUsers(params?: AdminUsersParams): Promise<AdminUsersResponse> {
    const res = await api.get<AdminUsersResponse>(API_ENDPOINTS.admin.users, {
      params,
    });
    return res.data;
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
