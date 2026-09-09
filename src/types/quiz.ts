export interface QuizAttempt {
  id: string;
  session_id?: string;
  course_id: string;
  course_title?: string;
  started_at: string;
  expires_at: string;
  status: "active" | "submitted" | "expired";
  total_questions?: number;
}

export interface AnswerSubmission {
  question_id: string;
  answer?: string | null;
  selected_answer?: string;
}

export interface SubmitQuizRequest {
  answers: AnswerSubmission[];
}

export interface QuizResult {
  attempt_id?: string;
  session_id?: string;
  course_id?: string;
  course_title?: string;
  score: number;
  percentage: number;
  correct?: number;
  incorrect?: number;
  unanswered?: number;
  correct_count?: number;
  incorrect_count?: number;
  total_questions: number;
  time_taken?: number;
  submitted_at: string;
  status?: string;
  question_reviews?: QuestionReview[];
}

export interface QuestionReview {
  question_id: string;
  question_number: number;
  question_text: string;
  selected_answer: string;
  correct_answer: string;
  is_correct: boolean;
  explanation?: string;
}

export interface AttemptHistoryItem {
  id: string;
  course_title: string;
  course_id: string;
  score: number;
  percentage: number;
  status: string;
  submitted_at?: string;
  started_at: string;
  total_questions?: number;
  time_taken?: number;
}
