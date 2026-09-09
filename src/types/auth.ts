export type UserRole = "user" | "quiz_master" | "admin";

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
  user: import("./user").User;
}

export interface StudentRegisterRequest {
  full_name: string;
  matric_number: string;
  level: string;
  faculty: string;
  department: string;
  phone_number?: string;
  phone?: string;
  password: string;
  confirm_password: string;
}

export interface QuizMasterRegisterRequest {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
}
