import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quizMasterService } from "@/services/quiz-master.service";
import { courseService } from "@/services/course.service";
import { QUERY_KEYS } from "@/lib/constants";
import type { UpdateQuestionRequest } from "@/types/question";
import type { CreateCourseRequest } from "@/types/course";

export function useQuestions(courseId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.questions(courseId),
    queryFn: () => quizMasterService.getQuestions(courseId),
    enabled: !!courseId,
  });
}

export function useProcessingJob(jobId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.processingJob(jobId ?? ""),
    queryFn: () => quizMasterService.getProcessingStatus(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status) return 3000;
      if (status === "completed" || status === "failed") return false;
      return 3000;
    },
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseRequest) => courseService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.qmCourses });
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      questionId: string;
      data: UpdateQuestionRequest;
      courseId: string;
    }) => quizMasterService.updateQuestion(vars.questionId, vars.data),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.questions(courseId),
      });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { questionId: string; courseId: string }) =>
      quizMasterService.deleteQuestion(vars.questionId),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.questions(courseId),
      });
    },
  });
}

export function useVerifyQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { questionId: string; courseId: string }) =>
      quizMasterService.verifyQuestion(vars.questionId),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.questions(courseId),
      });
    },
  });
}

export function useVerifyAllQuestions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) =>
      quizMasterService.verifyAllQuestions(courseId),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.questions(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.qmCourse(courseId),
      });
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      file,
      onProgress,
    }: {
      courseId: string;
      file: File;
      onProgress?: (percent: number) => void;
    }) => quizMasterService.uploadDocument(courseId, file, onProgress),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.qmCourse(courseId) });
    },
  });
}

export function usePublishCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => courseService.publishCourse(courseId),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.qmCourses });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.qmCourse(courseId) });
    },
  });
}

export function useArchiveCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => courseService.archiveCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.qmCourses });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => courseService.deleteCourse(courseId),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.qmCourses });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.qmCourse(courseId) });
    },
  });
}
