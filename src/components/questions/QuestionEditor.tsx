"use client";

import React, { useState } from "react";
import { X, Save, Plus, Trash2, CheckCircle } from "lucide-react";
import type { Question, UpdateQuestionRequest } from "@/types/question";

interface QuestionEditorProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: UpdateQuestionRequest) => Promise<void>;
}

function QuestionEditorForm({
  question,
  onClose,
  onSave,
}: {
  question: Question;
  onClose: () => void;
  onSave: (id: string, data: UpdateQuestionRequest) => Promise<void>;
}) {
  const [text, setText] = useState(question.question_text || "");
  const [options, setOptions] = useState<Record<string, string>>({
    ...(question.options || {}),
  });
  const [correctAnswer, setCorrectAnswer] = useState(
    question.correct_answer || "A"
  );
  const [explanation, setExplanation] = useState(question.explanation || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleOptionChange = (key: string, val: string) => {
    setOptions((prev) => ({ ...prev, [key]: val }));
  };

  const handleAddOption = () => {
    const keys = Object.keys(options);
    const nextChar = String.fromCharCode(65 + keys.length); // Next alphabet letter
    if (keys.length < 8) {
      setOptions((prev) => ({ ...prev, [nextChar]: "" }));
    }
  };

  const handleRemoveOption = (key: string) => {
    const next = { ...options };
    delete next[key];
    setOptions(next);
    if (correctAnswer === key) {
      setCorrectAnswer(Object.keys(next)[0] || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(question.id, {
        question_text: text,
        options,
        correct_answer: correctAnswer,
        explanation,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white border border-gray-100 rounded-[32px] shadow-2xl my-8 overflow-hidden">
      <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
        <h3 className="text-base font-extrabold text-gray-950">
          Edit Question {question.question_number}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
            Question Text
          </label>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="w-full px-4 py-3 text-sm rounded-2xl border border-gray-200/80 bg-gray-50/50 text-gray-900 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all font-medium"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
              Options & Correct Answer Key
            </label>
            <button
              type="button"
              onClick={handleAddOption}
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Option</span>
            </button>
          </div>

          <div className="space-y-3">
            {Object.keys(options)
              .sort()
              .map((key) => {
                const isCorrect = correctAnswer === key;
                return (
                  <div key={key} className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setCorrectAnswer(key)}
                      title={`Mark Option ${key} as correct`}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold border transition-all cursor-pointer shrink-0 shadow-2xs ${
                        isCorrect
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white border-gray-200 text-gray-600 hover:border-purple-400"
                      }`}
                    >
                      {key}
                    </button>
                    <input
                      type="text"
                      value={options[key]}
                      onChange={(e) => handleOptionChange(key, e.target.value)}
                      required
                      placeholder={`Text for option ${key}`}
                      className="flex-1 px-4 py-2 text-sm rounded-xl border border-gray-200/80 bg-gray-50/50 text-gray-900 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    />
                    {isCorrect && (
                      <span className="text-xs text-green-700 font-bold px-3 py-1 bg-green-50 rounded-full hidden sm:inline-flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Correct
                      </span>
                    )}
                    {Object.keys(options).length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(key)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove option"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
          <p className="mt-2 text-xs text-gray-400 font-medium">
            Click any letter button (A, B, C...) to mark it as the correct answer.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
            Academic Explanation / Rationale
          </label>
          <textarea
            rows={2}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Provide a referenced explanation for why this answer is correct..."
            className="w-full px-4 py-3 text-sm rounded-2xl border border-gray-200/80 bg-gray-50/50 text-gray-900 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all font-medium"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-6 py-2.5 text-xs font-bold rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-2.5 text-xs font-bold rounded-full bg-gray-950 hover:bg-gray-800 text-white shadow-xs disabled:opacity-60 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export function QuestionEditor({
  question,
  isOpen,
  onClose,
  onSave,
}: QuestionEditorProps) {
  if (!isOpen || !question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/40 backdrop-blur-sm overflow-y-auto">
      <QuestionEditorForm
        key={question.id}
        question={question}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  );
}
