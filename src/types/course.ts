export type CourseStatus =
  | "draft"
  | "processing"
  | "review"
  | "published"
  | "expired"
  | "archived";

export interface Course {
  id: string;
  title: string;
  description?: string;
  gst_codes?: string[];
  gst_code: string;
  duration_minutes: number;
  status: CourseStatus;
  question_count?: number;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
  duration_minutes: number;
  gst_codes?: string[];
  gst_code?: string;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  duration_minutes?: number;
  gst_codes?: string[];
  gst_code?: string;
  status?: CourseStatus;
}

export interface CourseAnalytics {
  total_participants: number;
  total_attempts?: number;
  correct_answers: number;
  incorrect_answers: number;
  highest_score: number;
  average_score: number;
  pass_rate?: number;
}

export interface LeaderboardEntry {
  rank: number;
  student_name: string;
  matric_number?: string;
  score: number;
  percentage: number;
  time_taken?: number;
}
