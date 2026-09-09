"use client";

import React, { use, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2, AlertTriangle } from "lucide-react";
import { quizService } from "@/services/quiz.service";
import { getApiError } from "@/lib/api";
import { useCourse } from "@/hooks/use-courses";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { QuestionNavigator } from "@/components/quiz/QuestionNavigator";
import { QuizSubmitButton } from "@/components/quiz/QuizSubmitButton";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import type { QuizAttempt, AnswerSubmission } from "@/types/quiz";
import type { PublicQuestion } from "@/types/question";

export default function StudentQuizPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const router = useRouter();
  const { data: course } = useCourse(courseId);

  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const [currentNum, setCurrentNum] = useState(1);
  const [questionsCache, setQuestionsCache] = useState<Record<number, PublicQuestion>>({});

  // Map questionNumber -> selectedOptionKey (e.g. { 1: "B", 2: "C" })
  const [answersByNum, setAnswersByNum] = useState<Record<number, string>>({});
  // Map questionId -> selectedOptionKey
  const [answersById, setAnswersById] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  // Initialize quiz attempt and load question set
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        setInitLoading(true);
        const [newAttempt, quizData] = await Promise.all([
          quizService.startQuiz(courseId),
          quizService.getQuiz(courseId),
        ]);
        if (mounted) {
          setAttempt(newAttempt);
          const cache: Record<number, PublicQuestion> = {};
          quizData.questions.forEach((q, idx) => {
            const num = q.question_number || q.number || idx + 1;
            cache[num] = {
              ...q,
              question_number: num,
            };
          });
          setQuestionsCache(cache);
        }
      } catch (err: unknown) {
        if (mounted) {
          setInitError(getApiError(err));
        }
      } finally {
        if (mounted) {
          setInitLoading(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [courseId]);

  const totalQuestions =
    Object.keys(questionsCache).length ||
    attempt?.total_questions ||
    course?.question_count ||
    10;

  // Handle selecting an answer
  const handleSelectAnswer = (key: string) => {
    const currentQ = questionsCache[currentNum];
    setAnswersByNum((prev) => ({ ...prev, [currentNum]: key }));
    if (currentQ?.id) {
      setAnswersById((prev) => ({ ...prev, [currentQ.id]: key }));
    }
  };

  // Submit assessment
  const handleSubmit = useCallback(async () => {
    if (isSubmittingRef.current || !attempt) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const submissions: AnswerSubmission[] = Object.entries(answersById).map(
        ([qId, sel]) => ({
          question_id: qId,
          selected_answer: sel,
        })
      );

      const result = await quizService.submitQuiz(attempt.id, {
        answers: submissions,
      });

      toast.success("Examination submitted successfully!");
      router.push(`/results/${result.attempt_id || attempt.id}`);
    } catch (err: unknown) {
      toast.error(getApiError(err));
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [attempt, answersById, router]);

  // Handle timer expiration
  const handleExpire = useCallback(() => {
    toast.warning("Time has expired! Submitting your assessment...");
    handleSubmit();
  }, [handleSubmit]);

  if (initLoading) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center space-y-4">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
        <h2 className="text-xl font-extrabold text-gray-950">
          Initializing Examination Session...
        </h2>
        <p className="text-xs text-gray-400 font-medium">
          Allocating question set and configuring timer security from server.
        </p>
      </div>
    );
  }

  if (initError || !attempt) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <ErrorState
          title="Could Not Start Quiz"
          message={initError || "Unable to start quiz session."}
          onRetry={() => router.push(`/courses/${courseId}`)}
        />
      </div>
    );
  }

  const currentQ = questionsCache[currentNum];
  const answeredCount = Object.keys(answersByNum).length;
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-screen bg-[#F4F5FA]">
      {/* Sticky Header */}
      <QuizHeader
        courseTitle={attempt.course_title || course?.title || "Academic Assessment"}
        gstCode={course?.gst_code || "GST"}
        currentQuestion={currentNum}
        totalQuestions={totalQuestions}
        expiresAt={attempt.expires_at}
        onExpire={handleExpire}
        onSubmitClick={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Main Testing Stage */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-2 space-y-6">
            {!currentQ ? (
              <div className="bg-white border border-gray-100 rounded-[32px] p-8 space-y-4">
                <Skeleton className="h-4 w-24 rounded-lg" />
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <div className="space-y-3 pt-4">
                  <Skeleton className="h-14 w-full rounded-2xl" />
                  <Skeleton className="h-14 w-full rounded-2xl" />
                  <Skeleton className="h-14 w-full rounded-2xl" />
                  <Skeleton className="h-14 w-full rounded-2xl" />
                </div>
              </div>
            ) : (
              <QuestionCard
                question={currentQ}
                selectedAnswer={answersByNum[currentNum]}
                onSelectAnswer={handleSelectAnswer}
                disabled={isSubmitting}
              />
            )}

            {/* Previous / Next Actions */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => setCurrentNum((prev) => Math.max(1, prev - 1))}
                disabled={currentNum <= 1 || isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold rounded-full border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs text-gray-500 font-bold">
                {currentNum} of {totalQuestions}
              </span>

              {currentNum < totalQuestions ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentNum((prev) => Math.min(totalQuestions, prev + 1))
                  }
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold rounded-full bg-gray-950 text-white hover:bg-gray-800 transition-all cursor-pointer shadow-xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <QuizSubmitButton
                  unansweredCount={unansweredCount}
                  totalQuestions={totalQuestions}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit}
                />
              )}
            </div>
          </div>

          {/* Navigator & Submit Panel */}
          <div className="space-y-6">
            <QuestionNavigator
              totalQuestions={totalQuestions}
              currentQuestion={currentNum}
              answeredQuestions={answersByNum}
              onSelectQuestion={(num) => setCurrentNum(num)}
            />

            <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-xs space-y-4">
              <h4 className="text-sm font-extrabold text-gray-950">Finalize Test</h4>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                Once submitted, your responses will be scored on the server and detailed
                rationales will be revealed.
              </p>
              <QuizSubmitButton
                unansweredCount={unansweredCount}
                totalQuestions={totalQuestions}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
