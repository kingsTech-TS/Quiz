import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/course.service";
import { QUERY_KEYS } from "@/lib/constants";

export function useCourses() {
  return useQuery({
    queryKey: QUERY_KEYS.courses,
    queryFn: courseService.getCourses,
  });
}

export function useCourse(courseId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.course(courseId),
    queryFn: () => courseService.getCourse(courseId),
    enabled: !!courseId,
  });
}

export function useQuizMasterCourses() {
  return useQuery({
    queryKey: QUERY_KEYS.qmCourses,
    queryFn: courseService.getQuizMasterCourses,
    // Always refetch on mount so course IDs are never stale after creation
    staleTime: 0,
    refetchOnMount: true,
  });
}

export function useQuizMasterCourse(courseId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.qmCourse(courseId),
    queryFn: () => courseService.getQuizMasterCourse(courseId),
    enabled: !!courseId,
  });
}

export function useCourseAnalytics(courseId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.courseAnalytics(courseId),
    queryFn: () => courseService.getCourseAnalytics(courseId),
    enabled: !!courseId,
  });
}

export function useCourseLeaderboard(courseId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.leaderboard(courseId),
    queryFn: () => courseService.getCourseLeaderboard(courseId),
    enabled: !!courseId,
  });
}

export function useOverallLeaderboard(gst?: string) {
  return useQuery({
    queryKey: ["overall-leaderboard", gst || "all"],
    queryFn: () => courseService.getOverallLeaderboard(10, gst),
  });
}

export function useLeaderboardByGst(limit = 10) {
  return useQuery({
    queryKey: ["leaderboard-by-gst", limit],
    queryFn: () => courseService.getLeaderboardByGst(limit),
  });
}

export function useCourseAttempts(courseId: string) {
  return useQuery({
    queryKey: ["course-attempts", courseId],
    queryFn: () => courseService.getCourseAttempts(courseId),
    enabled: !!courseId,
  });
}

export function useAttemptDetail(attemptId: string) {
  return useQuery({
    queryKey: ["attempt-detail", attemptId],
    queryFn: () => courseService.getAttemptDetail(attemptId),
    enabled: !!attemptId,
  });
}

export function useTopStudents(limit = 10) {
  return useQuery({
    queryKey: ["top-students", limit],
    queryFn: () => courseService.getTopStudents(limit),
  });
}
