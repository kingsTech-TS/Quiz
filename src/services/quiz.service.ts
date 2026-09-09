import api from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type {
  QuizAttempt,
  SubmitQuizRequest,
  QuizResult,
  AttemptHistoryItem,
} from "@/types/quiz";
import type { PublicQuestion, AnswerCheckResponse } from "@/types/question";

export const quizService = {
  // Load quiz course info and public questions
  async getQuiz(courseId: string): Promise<{
    course: { id: string; title: string; duration_minutes: number };
    questions: PublicQuestion[];
  }> {
    const res = await api.get<{
      course: { id: string; title: string; duration_minutes: number };
      questions: Array<{
        id: string;
        number: number;
        text: string;
        options: Record<string, string>;
      }>;
    }>(API_ENDPOINTS.quiz.getQuiz(courseId));

    const questions: PublicQuestion[] = (res.data.questions || []).map((q) => ({
      id: q.id,
      number: q.number,
      question_number: q.number,
      text: q.text,
      question_text: q.text,
      options: q.options || {},
    }));

    return {
      course: res.data.course,
      questions,
    };
  },

  async startQuiz(courseId: string): Promise<QuizAttempt> {
    const res = await api.post<{
      session_id: string;
      course_id: string;
      started_at: string;
      expires_at: string;
      status: "active";
    }>(API_ENDPOINTS.quiz.start(courseId));

    return {
      id: res.data.session_id,
      session_id: res.data.session_id,
      course_id: res.data.course_id || courseId,
      started_at: res.data.started_at,
      expires_at: res.data.expires_at,
      status: res.data.status || "active",
    };
  },

  async checkAnswer(
    courseId: string,
    questionId: string,
    selectedAnswer: string,
    sessionId?: string
  ): Promise<AnswerCheckResponse> {
    const headers: Record<string, string> = {};
    if (sessionId) {
      headers["X-Session-Id"] = sessionId;
    }

    const res = await api.post<{
      correct: boolean;
      selected_answer: string;
      explanation?: string | null;
      correct_answer?: string | null;
    }>(
      API_ENDPOINTS.quiz.checkAnswer(courseId, questionId),
      { answer: selectedAnswer },
      { headers }
    );

    return {
      is_correct: res.data.correct,
      correct_answer: res.data.correct_answer || undefined,
      explanation: res.data.explanation || undefined,
    };
  },

  async submitQuiz(
    courseId: string,
    data: SubmitQuizRequest
  ): Promise<QuizResult> {
    const payload = {
      answers: (data.answers || []).map((item) => ({
        question_id: item.question_id,
        answer: item.answer || item.selected_answer || null,
      })),
    };

    const res = await api.post<{
      score: number;
      total_questions: number;
      correct: number;
      incorrect: number;
      unanswered: number;
      percentage: number;
      submitted_at: string;
      session_id: string;
    }>(API_ENDPOINTS.quiz.submit(courseId), payload);

    const d = res.data;
    return {
      attempt_id: d.session_id,
      session_id: d.session_id,
      course_id: courseId,
      score: d.score,
      total_questions: d.total_questions,
      correct_count: d.correct,
      incorrect_count: d.incorrect,
      correct: d.correct,
      incorrect: d.incorrect,
      unanswered: d.unanswered,
      percentage: d.percentage,
      submitted_at: d.submitted_at,
    };
  },

  async getResult(attemptId: string): Promise<QuizResult | null> {
    const history = await quizService.getHistory();
    const found = history.find((h) => h.id === attemptId);
    if (!found) return null;

    return {
      attempt_id: found.id,
      course_id: found.course_id,
      course_title: found.course_title,
      score: found.score,
      percentage: found.percentage,
      correct_count: found.score,
      incorrect_count: Math.max(0, (found.total_questions || 0) - found.score),
      total_questions: found.total_questions || 0,
      submitted_at: found.submitted_at || found.started_at,
    };
  },

  async getHistory(): Promise<AttemptHistoryItem[]> {
    const res = await api.get<
      Array<{
        course_id: string;
        course_title: string;
        score: number;
        total: number;
        correct: number;
        incorrect: number;
        unanswered: number;
        percentage: number;
        submitted_at: string;
      }>
    >(API_ENDPOINTS.quiz.history);

    return (res.data || []).map((row) => ({
      id: row.course_id,
      course_id: row.course_id,
      course_title: row.course_title,
      score: row.score,
      percentage: row.percentage,
      total_questions: row.total,
      status: "submitted",
      submitted_at: row.submitted_at,
      started_at: row.submitted_at,
    }));
  },
};
