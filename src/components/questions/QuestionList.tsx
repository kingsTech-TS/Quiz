"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, CheckCheck, Loader2 } from "lucide-react";
import type { Question, UpdateQuestionRequest } from "@/types/question";
import { QuestionItem } from "./QuestionItem";
import { QuestionEditor } from "./QuestionEditor";
import { EmptyState } from "@/components/shared/EmptyState";

interface QuestionListProps {
  questions: Question[];
  onUpdateQuestion: (id: string, data: UpdateQuestionRequest) => Promise<void>;
  onDeleteQuestion: (id: string) => Promise<void>;
  onVerifyQuestion: (id: string) => Promise<void>;
  onVerifyAll?: () => void;
  isVerifyingAll?: boolean;
}

export function QuestionList({
  questions,
  onUpdateQuestion,
  onDeleteQuestion,
  onVerifyQuestion,
  onVerifyAll,
  isVerifyingAll = false,
}: QuestionListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "review" | "verified">("all");
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchSearch =
        q.question_text.toLowerCase().includes(search.toLowerCase()) ||
        Object.values(q.options || {}).some((opt) =>
          opt.toLowerCase().includes(search.toLowerCase())
        );

      if (!matchSearch) return false;

      if (filter === "review") return !!q.needs_review;
      if (filter === "verified") return !!q.is_verified;
      return true;
    });
  }, [questions, search, filter]);

  const reviewCount = questions.filter((q) => q.needs_review).length;
  const verifiedCount = questions.filter((q) => q.is_verified || q.verified).length;
  const unverifiedCount = questions.filter((q) => !q.is_verified && !q.verified).length;

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-gray-200/80 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none shadow-2xs transition-all"
          />
        </div>

        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all shadow-2xs ${
              filter === "all"
                ? "bg-gray-950 text-white"
                : "bg-white border border-gray-200/80 text-gray-600 hover:bg-gray-50"
            }`}
          >
            All ({questions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("review")}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all shadow-2xs ${
              filter === "review"
                ? "bg-amber-600 text-white"
                : "bg-white border border-gray-200/80 text-amber-700 hover:bg-amber-50/50"
            }`}
          >
            Needs Review ({reviewCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("verified")}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all shadow-2xs ${
              filter === "verified"
                ? "bg-green-600 text-white"
                : "bg-white border border-gray-200/80 text-green-700 hover:bg-green-50/50"
            }`}
          >
            Verified ({verifiedCount})
          </button>

          {unverifiedCount > 0 && onVerifyAll && (
            <button
              type="button"
              onClick={onVerifyAll}
              disabled={isVerifyingAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-green-600 hover:bg-green-700 text-white transition-all shadow-xs cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              {isVerifyingAll ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5" />
              )}
              <span>Verify All ({unverifiedCount})</span>
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No questions match your filter"
          description="Try clearing your search query or selecting a different status filter."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((question) => (
            <QuestionItem
              key={question.id}
              question={question}
              onEdit={(q) => setEditingQuestion(q)}
              onDelete={onDeleteQuestion}
              onVerify={onVerifyQuestion}
            />
          ))}
        </div>
      )}

      {editingQuestion && (
        <QuestionEditor
          question={editingQuestion}
          isOpen={!!editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSave={onUpdateQuestion}
        />
      )}
    </div>
  );
}
