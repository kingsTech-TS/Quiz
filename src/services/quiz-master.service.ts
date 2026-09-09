import api from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Question, UpdateQuestionRequest, ProcessingJob, BulkVerifyQuestionsResponse } from "@/types/question";

export const quizMasterService = {
  async getQuestions(courseId: string): Promise<Question[]> {
    const res = await api.get<Question[]>(
      API_ENDPOINTS.questions.list(courseId)
    );
    return res.data;
  },

  async updateQuestion(
    questionId: string,
    data: UpdateQuestionRequest
  ): Promise<Question> {
    const res = await api.patch<Question>(
      API_ENDPOINTS.questions.update(questionId),
      data
    );
    return res.data;
  },

  async deleteQuestion(questionId: string): Promise<void> {
    await api.delete(API_ENDPOINTS.questions.delete(questionId));
  },

  async verifyQuestion(questionId: string): Promise<Question> {
    const res = await api.patch<Question>(
      API_ENDPOINTS.questions.update(questionId),
      { verified: true }
    );
    return {
      ...res.data,
      is_verified: res.data.verified ?? true,
    };
  },

  async verifyAllQuestions(
    courseId: string
  ): Promise<BulkVerifyQuestionsResponse> {
    const res = await api.post<BulkVerifyQuestionsResponse>(
      API_ENDPOINTS.questions.verifyAll(courseId)
    );
    return res.data;
  },

  async uploadDocument(
    courseId: string,
    file: File,
    onUploadProgress?: (percent: number) => void
  ): Promise<ProcessingJob> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post<any>(
      API_ENDPOINTS.documents.upload(courseId),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total && onUploadProgress) {
            onUploadProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      }
    );
    return {
      id: res.data.id,
      course_id: res.data.course_id || courseId,
      status: res.data.status === "processed" ? "completed" : res.data.status,
      created_at: res.data.created_at,
    };
  },

  async getProcessingStatus(courseId: string): Promise<ProcessingJob> {
    const res = await api.get<any[]>(
      API_ENDPOINTS.documents.list(courseId)
    );
    const latest = Array.isArray(res.data) ? res.data[0] : res.data;
    if (!latest) {
      return {
        id: "",
        course_id: courseId,
        status: "completed",
      };
    }
    const isCompleted =
      latest.status === "processed" || latest.status === "review_required";
    const isFailed = latest.status === "failed";
    return {
      id: latest.id,
      course_id: latest.course_id || courseId,
      status: isCompleted ? "completed" : isFailed ? "failed" : "processing",
      error: latest.error || undefined,
      created_at: latest.created_at,
    };
  },
};
