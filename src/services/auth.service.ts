import api from "@/lib/api";
import { setToken } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/constants";
import { userService } from "./user.service";
import type {
  LoginRequest,
  LoginResponse,
  StudentRegisterRequest,
  QuizMasterRegisterRequest,
} from "@/types/auth";
import type { User } from "@/types/user";

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const res = await api.post<{
      access_token: string;
      token_type: string;
      role: LoginResponse["role"];
    }>(API_ENDPOINTS.auth.login, {
      identifier: data.identifier.trim(),
      password: data.password,
    });

    setToken(res.data.access_token);

    // Fetch full user profile using the newly stored token
    const user = await userService.getMe();

    return {
      access_token: res.data.access_token,
      token_type: res.data.token_type || "bearer",
      role: res.data.role,
      user,
    };
  },

  async registerUser(data: StudentRegisterRequest): Promise<{ success: boolean }> {
    const payload = {
      full_name: data.full_name.trim(),
      matric_number: data.matric_number.trim(),
      level: data.level,
      faculty: data.faculty.trim(),
      department: data.department.trim(),
      phone_number: (data.phone_number || data.phone || "").trim(),
      password: data.password,
      confirm_password: data.confirm_password,
    };

    const res = await api.post<{ success: boolean }>(
      API_ENDPOINTS.auth.registerUser,
      payload
    );
    return res.data;
  },

  async registerQuizMaster(
    data: QuizMasterRegisterRequest
  ): Promise<{ success: boolean }> {
    const payload = {
      full_name: data.full_name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      confirm_password: data.confirm_password,
    };

    const res = await api.post<{ success: boolean }>(
      API_ENDPOINTS.auth.registerQuizMaster,
      payload
    );
    return res.data;
  },
};
