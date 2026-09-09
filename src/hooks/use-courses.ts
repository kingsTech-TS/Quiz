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

export function useOverallLeaderboard() {
  return useQuery({
    queryKey: ["overall-leaderboard"],
    queryFn: () => courseService.getOverallLeaderboard(),
  });
}
