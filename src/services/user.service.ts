import api from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { User, OnboardingRequest } from "@/types/user";

export const userService = {
  async getMe(): Promise<User> {
    const res = await api.get<User & { gst_codes?: string[]; phone_number?: string }>(
      API_ENDPOINTS.users.me
    );
    const data = res.data;
    const gstList = data.gst_codes || data.gst_courses || [];

    return {
      ...data,
      phone: data.phone_number || data.phone,
      phone_number: data.phone_number || data.phone,
      gst_codes: gstList,
      gst_courses: gstList,
    };
  },

  async updateGSTs(data: OnboardingRequest): Promise<User> {
    const gstCodes = data.gst_codes || data.gst_courses || [];
    await api.post<{ success: boolean }>(API_ENDPOINTS.users.onboarding, {
      gst_codes: gstCodes,
    });
    return await userService.getMe();
  },
};
