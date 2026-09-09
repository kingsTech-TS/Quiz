// GST course options — fixed by backend contract
export const GST_COURSES = [
  { code: "GST 112", label: "GST 112" },
  { code: "GST 116", label: "GST 116" },
  { code: "GST 118", label: "GST 118" },
  { code: "GST 212", label: "GST 212" },
] as const;

export type GSTCode = (typeof GST_COURSES)[number]["code"];

// Academic level options
export const STUDENT_LEVELS = [
  "100 Level",
  "200 Level",
  "300 Level",
  "400 Level",
  "500 Level",
] as const;

// API endpoint paths — verified against FastAPI backend
export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    registerUser: "/api/auth/register/user",
    registerQuizMaster: "/api/auth/register/quiz-master",
  },
  users: {
    me: "/api/users/me",
    onboarding: "/api/users/onboarding",
    courses: "/api/users/courses",
    results: "/api/users/results",
  },
  courses: {
    list: "/api/users/courses",
    detail: (id: string) => `/api/quizzes/${id}`,
    quizMasterList: "/api/quiz-masters/courses",
    quizMasterCreate: "/api/quiz-masters/courses",
    quizMasterDetail: (id: string) => `/api/quiz-masters/courses/${id}`,
    quizMasterPublish: (id: string) => `/api/quiz-masters/courses/${id}/publish`,
    quizMasterArchive: (id: string) => `/api/quiz-masters/courses/${id}`,
    quizMasterDelete: (id: string) => `/api/quiz-masters/courses/${id}`,
  },
  questions: {
    list: (courseId: string) => `/api/quiz-masters/courses/${courseId}/questions`,
    create: (courseId: string) => `/api/quiz-masters/courses/${courseId}/questions`,
    update: (id: string) => `/api/quiz-masters/questions/${id}`,
    delete: (id: string) => `/api/quiz-masters/questions/${id}`,
    verify: (id: string) => `/api/quiz-masters/questions/${id}`,
    verifyAll: (courseId: string) => `/api/quiz-masters/courses/${courseId}/questions/verify-all`,
    reorder: (courseId: string) => `/api/quiz-masters/courses/${courseId}/questions/reorder`,
  },
  documents: {
    upload: (courseId: string) => `/api/quiz-masters/courses/${courseId}/documents`,
    list: (courseId: string) => `/api/quiz-masters/courses/${courseId}/documents`,
    status: (courseId: string) => `/api/quiz-masters/courses/${courseId}/documents`,
  },
  quiz: {
    getQuiz: (courseId: string) => `/api/quizzes/${courseId}`,
    start: (courseId: string) => `/api/quizzes/${courseId}/start`,
    checkAnswer: (courseId: string, questionId: string) =>
      `/api/quizzes/${courseId}/questions/${questionId}/check`,
    submit: (courseId: string) => `/api/quizzes/${courseId}/submit`,
    result: (attemptId: string) => `/api/users/results`,
    history: "/api/users/results",
  },
  analytics: {
    quizMaster: "/api/quiz-masters/analytics",
    course: (courseId: string) => `/api/quiz-masters/courses/${courseId}/analytics`,
    leaderboard: (courseId: string) =>
      `/api/quiz-masters/courses/${courseId}/analytics`,
  },
  admin: {
    analytics: "/api/admin/analytics",
    users: "/api/admin/users",
    exportUsers: "/api/admin/users/export",
    quizMasters: "/api/admin/quiz-masters",
  },
} as const;

// TanStack Query keys
export const QUERY_KEYS = {
  me: ["me"] as const,
  courses: ["courses"] as const,
  course: (id: string) => ["courses", id] as const,
  qmCourses: ["qm-courses"] as const,
  qmCourse: (id: string) => ["qm-courses", id] as const,
  questions: (courseId: string) => ["questions", courseId] as const,
  processingJob: (jobId: string) => ["job", jobId] as const,
  quiz: (courseId: string) => ["quiz", courseId] as const,
  result: (attemptId: string) => ["result", attemptId] as const,
  results: ["results"] as const,
  qmAnalytics: ["qm-analytics"] as const,
  courseAnalytics: (courseId: string) => ["course-analytics", courseId] as const,
  leaderboard: (courseId: string) => ["leaderboard", courseId] as const,
  adminAnalytics: ["admin", "analytics"] as const,
  adminUsers: (params?: object) => ["admin", "users", params] as const,
  adminQuizMasters: ["admin", "quiz-masters"] as const,
} as const;
