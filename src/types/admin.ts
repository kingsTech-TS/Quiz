import type { User } from "./user";

export interface AdminAnalytics {
  total_users: number;
  total_quiz_masters: number;
  total_courses: number;
  published_courses: number;
  total_attempts: number;
  total_questions: number;
}

export interface QuizMasterSummary {
  id: string;
  full_name: string;
  email: string;
  total_courses: number;
  published_courses: number;
  created_at?: string;
}

export interface AdminUsersResponse {
  users: User[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface AdminUsersParams {
  search?: string;
  level?: string;
  faculty?: string;
  department?: string;
  gst?: string;
  page?: number;
  per_page?: number;
}
