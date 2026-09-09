import type { UserRole } from "./auth";

export interface User {
  id: string;
  full_name: string;
  email?: string;
  matric_number?: string;
  level?: string;
  faculty?: string;
  department?: string;
  phone_number?: string;
  phone?: string;
  role: UserRole;
  gst_codes?: string[];
  gst_courses?: string[];
  onboarding_completed?: boolean;
  created_at?: string;
}

export interface OnboardingRequest {
  gst_codes?: string[];
  gst_courses?: string[];
}
