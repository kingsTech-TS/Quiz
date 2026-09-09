import api from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseAnalytics,
  LeaderboardEntry,
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
      highest_score: d.highest_score || 0,
      average_score: Math.round(d.average_score || 0),
      pass_rate: Math.round(d.average_percentage || 0),
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

  async getOverallLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const res = await api.get<any>("/api/leaderboard");
      const list =
        res.data?.leaderboard || (Array.isArray(res.data) ? res.data : []);
      if (list.length > 0) {
        return list.map((item: any, idx: number) => ({
          rank: item.rank || idx + 1,
          student_name: item.full_name || item.student_name || "Student",
          matric_number: item.matric_number,
          score: item.score || 0,
          percentage: item.percentage || 0,
        }));
      }
    } catch {
      // Endpoint might not exist directly, fall through to course leaderboard aggregation
    }

    try {
      const coursesRes = await api.get<any[]>(API_ENDPOINTS.courses.list);
      const courses = coursesRes.data || [];
      if (!courses || courses.length === 0) return [];

      const leaderboardPromises = courses.slice(0, 5).map(async (c) => {
        try {
          const res = await api.get<any>(
            API_ENDPOINTS.analytics.leaderboard(c.id),
          );
          return (
            res.data?.leaderboard || (Array.isArray(res.data) ? res.data : [])
          );
        } catch {
          return [];
        }
      });

      const allResults = await Promise.all(leaderboardPromises);
      const flattened = allResults.flat();

      if (flattened.length === 0) return [];

      const studentMap = new Map<string, any>();
      for (const item of flattened) {
        const key = item.matric_number || item.student_name || item.full_name;
        if (!key) continue;
        const existing = studentMap.get(key);
        if (!existing || (item.percentage || 0) > (existing.percentage || 0)) {
          studentMap.set(key, item);
        }
      }

      const sorted = Array.from(studentMap.values()).sort(
        (a, b) => (b.percentage || 0) - (a.percentage || 0),
      );

      return sorted.slice(0, 10).map((item, idx) => ({
        rank: idx + 1,
        student_name: item.full_name || item.student_name || "Student",
        matric_number: item.matric_number,
        score: item.score || 0,
        percentage: item.percentage || 0,
      }));
    } catch {
      return [];
    }
  },
};
