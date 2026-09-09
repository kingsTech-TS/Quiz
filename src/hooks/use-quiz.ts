import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quizService } from "@/services/quiz.service";
import { QUERY_KEYS } from "@/lib/constants";
import type { SubmitQuizRequest } from "@/types/quiz";

export function useQuizResult(attemptId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.result(attemptId),
    queryFn: () => quizService.getResult(attemptId),
    enabled: !!attemptId,
  });
}

export function useQuizHistory() {
  return useQuery({
    queryKey: QUERY_KEYS.results,
    queryFn: quizService.getHistory,
  });
}

export function useStartQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => quizService.startQuiz(courseId),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.quiz(courseId) });
    },
  });
}

export function useCheckAnswer() {
  return useMutation({
    mutationFn: ({
      attemptId,
      questionId,
      selectedAnswer,
    }: {
      attemptId: string;
      questionId: string;
      selectedAnswer: string;
    }) => quizService.checkAnswer(attemptId, questionId, selectedAnswer),
  });
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      attemptId,
      data,
    }: {
      attemptId: string;
      data: SubmitQuizRequest;
    }) => quizService.submitQuiz(attemptId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.results });
    },
  });
}
