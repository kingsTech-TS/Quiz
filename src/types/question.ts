// Full question — shown to quiz masters (includes answer key)
export interface Question {
  id: string;
  course_id: string;
  question_number: number;
  question_text: string;
  options: Record<string, string>;
  correct_answer?: string;
  correct_answer_text?: string;
  explanation?: string;
  confidence?: number;
  needs_review?: boolean;
  review_reason?: string | null;
  verified?: boolean;
  is_verified?: boolean;
}

// Public question — shown to students during quiz (NO answer key)
export interface PublicQuestion {
  id: string;
  number?: number;
  question_number: number;
  text?: string;
  question_text: string;
  options: Record<string, string>;
}

export interface UpdateQuestionRequest {
  question_text?: string;
  options?: Record<string, string>;
  correct_answer?: string;
  explanation?: string;
}

export interface AnswerCheckResponse {
  is_correct: boolean;
  correct_answer?: string;
  correct_answer_text?: string;
  explanation?: string;
}

export type ProcessingJobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface ProcessingJob {
  id: string;
  course_id: string;
  status: ProcessingJobStatus;
  questions_extracted?: number;
  error?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BulkVerifyQuestionsResponse {
  course_id: string;
  total_questions: number;
  newly_verified: number;
  already_verified: number;
  skipped_requires_review: number;
  total_needs_review_remaining: number;
  total_unverified_remaining: number;
}
