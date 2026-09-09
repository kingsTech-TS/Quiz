import api from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseAnalytics,
  LeaderboardEntry,
  StudentAttemptSummary,
  StudentAttemptDetail,
} from "@/types/course";

export const courseService = {
  // Student — published courses matching their GSTs
  async getCourses(): Promise<Course[]> {
    const res = await api.get<Course[]>(API_ENDPOINTS.courses.list);
    return (res.data || []).map((c) => ({
      ...c,
      gst_code: c.gst_code || c.gst_codes?.[0] || "",
      gst_codes: c.gst_codes || (c.gst_code ? [c.gst_code] : []),
    }));
  },

  async getCourse(courseId: string): Promise<Course> {
    const res = await api.get<any>(API_ENDPOINTS.courses.detail(courseId));
    const raw = res.data?.course || res.data;
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description || "",
      duration_minutes: raw.duration_minutes,
      status: raw.status || "published",
      gst_code: raw.gst_code || raw.gst_codes?.[0] || "",
      gst_codes: raw.gst_codes || (raw.gst_code ? [raw.gst_code] : []),
      question_count: raw.question_count ?? (res.data?.questions?.length || 0),
    };
  },

  // Quiz master course management
  async getQuizMasterCourses(): Promise<Course[]> {
    const res = await api.get<Course[]>(API_ENDPOINTS.courses.quizMasterList);
    return (res.data || []).map((c) => ({
      ...c,
      id: c.id || (c as any)._id || "",
      gst_code: c.gst_code || (c as any).gst_codes?.[0] || "",
      gst_codes: (c as any).gst_codes || (c.gst_code ? [c.gst_code] : []),
    }));
  },

  async getQuizMasterCourse(courseId: string): Promise<Course> {
    const res = await api.get<any>(
      API_ENDPOINTS.courses.quizMasterDetail(courseId),
    );
    // Backend may return { course: {...} } or a flat object
    const c = res.data?.course || res.data;
    return {
      ...c,
      id: c.id || c._id || courseId, // always guarantee an id
      gst_code: c.gst_code || c.gst_codes?.[0] || "",
      gst_codes: c.gst_codes || (c.gst_code ? [c.gst_code] : []),
    };
  },

  async createCourse(data: CreateCourseRequest): Promise<Course> {
    const gstCodes =
      data.gst_codes && data.gst_codes.length > 0
        ? data.gst_codes
        : data.gst_code
          ? [data.gst_code]
          : [];

    const payload = {
      title: data.title.trim(),
      description: data.description?.trim() || null,
      duration_minutes: Number(data.duration_minutes),
      gst_codes: gstCodes,
    };

    const res = await api.post<Course>(
      API_ENDPOINTS.courses.quizMasterCreate,
      payload,
    );
    const c = res.data;
    return {
      ...c,
      gst_code: c.gst_code || c.gst_codes?.[0] || "",
      gst_codes: c.gst_codes || (c.gst_code ? [c.gst_code] : []),
    };
  },

  async updateCourse(
    courseId: string,
    data: UpdateCourseRequest,
  ): Promise<Course> {
    const payload: Record<string, any> = {};
    if (data.title !== undefined) payload.title = data.title;
    if (data.description !== undefined) payload.description = data.description;
    if (data.duration_minutes !== undefined)
      payload.duration_minutes = Number(data.duration_minutes);
    if (data.gst_codes !== undefined) payload.gst_codes = data.gst_codes;
    else if (data.gst_code !== undefined) payload.gst_codes = [data.gst_code];
    if (data.status !== undefined) payload.status = data.status;

    const res = await api.patch<Course>(
      API_ENDPOINTS.courses.quizMasterDetail(courseId),
      payload,
    );
    const c = res.data;
    return {
      ...c,
      gst_code: c.gst_code || c.gst_codes?.[0] || "",
      gst_codes: c.gst_codes || (c.gst_code ? [c.gst_code] : []),
    };
  },

  async publishCourse(courseId: string): Promise<Course> {
    const res = await api.post<Course>(
      API_ENDPOINTS.courses.quizMasterPublish(courseId),
    );
    return res.data;
  },

  async archiveCourse(courseId: string): Promise<Course> {
    const res = await api.patch<Course>(
      API_ENDPOINTS.courses.quizMasterArchive(courseId),
      { status: "archived" },
    );
    return res.data;
  },

  async deleteCourse(courseId: string): Promise<void> {
    await api.delete(API_ENDPOINTS.courses.quizMasterDelete(courseId));
  },

  async getCourseAnalytics(courseId: string): Promise<CourseAnalytics> {
    const res = await api.get<any>(API_ENDPOINTS.analytics.course(courseId));
    const d = res.data;
    return {
      total_participants: d.participants || 0,
      total_attempts: d.attempts || 0,
      correct_answers: d.correct_answers || 0,
      incorrect_answers: d.incorrect_answers || 0,
      highest_score: Math.round(d.highest_score || 0),
      // average_percentage is the mean percentage score across takers
      average_score: Math.round(d.average_percentage || 0),
      // pass_rate approximated from average_percentage
      pass_rate: Math.round(d.average_percentage || 0),
      // expose raw counts too
      total_questions: d.total_questions || 0,
      average_percentage: Math.round(d.average_percentage || 0),
      lowest_score: Math.round(d.lowest_score || 0),
    };
  },

  async getCourseLeaderboard(courseId: string): Promise<LeaderboardEntry[]> {
    const res = await api.get<any>(
      API_ENDPOINTS.analytics.leaderboard(courseId),
    );
    const list =
      res.data?.leaderboard || (Array.isArray(res.data) ? res.data : []);
    return list.map((item: any) => ({
      rank: item.rank,
      student_name: item.full_name || item.student_name || "Anonymous",
      matric_number: item.matric_number,
      score: item.score,
      percentage: item.percentage,
    }));
  },

  async getOverallLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    try {
      // 1. Primary: dedicated cross-course top-students endpoint
      return await this.getTopStudents(limit);
    } catch {
      // 2. Secondary: user-scoped leaderboard route
      try {
        const res = await api.get<any>(`/api/users/leaderboard?limit=${limit}`);
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.leaderboard || (res.data?.top_students as any[]) || [];
        return list.map((item: any, idx: number) => ({
          rank: item.rank || idx + 1,
          student_name: item.full_name || item.student_name || "Student",
          matric_number: item.matric_number,
          score: item.score || 0,
          percentage: item.percentage || 0,
          submitted_at: item.submitted_at,
        }));
      } catch {
        return [];
      }
    }
  },


  // Quiz Master — student attempt list for a course
  async getCourseAttempts(courseId: string): Promise<StudentAttemptSummary[]> {
    const res = await api.get<StudentAttemptSummary[]>(
      API_ENDPOINTS.attempts.listForCourse(courseId),
    );
    return res.data || [];
  },

  // Quiz Master — per-question detail for a single attempt
  async getAttemptDetail(attemptId: string): Promise<StudentAttemptDetail> {
    const res = await api.get<StudentAttemptDetail>(
      API_ENDPOINTS.attempts.detail(attemptId),
    );
    return res.data;
  },

  // Quiz Master — overall top-N students leaderboard (cross-course, first-attempt only)
  async getTopStudents(limit = 10): Promise<LeaderboardEntry[]> {
    const res = await api.get<any[]>(API_ENDPOINTS.attempts.topStudents(limit));
    return (res.data || []).map((item: any, idx: number) => ({
      rank: item.rank || idx + 1,
      student_name: item.full_name || item.student_name || "Student",
      matric_number: item.matric_number,
      score: item.score || 0,
      percentage: item.percentage || 0,
      submitted_at: item.submitted_at,
    }));
  },
};
