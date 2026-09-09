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
  lowest_score?: number;
  average_score: number;
  average_percentage?: number;
  pass_rate?: number;
  total_questions?: number;
}

export interface LeaderboardEntry {
  rank: number;
  student_name: string;
  matric_number?: string;
  score: number;
  percentage: number;
  time_taken?: number;
  submitted_at?: string;
}

export interface AttemptAnswerDetail {
  question_id: string;
  question_number: number;
  question_text: string;
  selected_answer: string | null;
  correct_answer: string | null;
  is_correct: boolean;
  options?: Record<string, string> | null;
}

export interface StudentAttemptSummary {
  id: string;
  session_id: string;
  user_id: string;
  full_name: string;
  matric_number?: string | null;
  faculty?: string | null;
  department?: string | null;
  level?: string | null;
  score: number;
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  percentage: number;
  started_at?: string | null;
  submitted_at: string;
  time_taken_seconds: number;
  attempt_number: number;
  is_first_attempt: boolean;
}

export interface StudentAttemptDetail extends StudentAttemptSummary {
  course_id: string;
  course_title: string;
  answers: AttemptAnswerDetail[];
}

