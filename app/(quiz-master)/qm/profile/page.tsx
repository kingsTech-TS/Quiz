"use client";

import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuizMasterCourses } from "@/hooks/use-courses";
import { PageHeader } from "@/components/shared/PageHeader";
import { Mail, BookOpen, ShieldCheck } from "lucide-react";
import { getInitials } from "@/lib/utils";

export default function QuizMasterProfilePage() {
  const { user } = useAuth();
  const { data: courses } = useQuizMasterCourses();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Instructor Profile"
        description="Faculty account credentials and course authorship status."
        breadcrumbs={[
          { label: "Dashboard", href: "/qm/dashboard" },
          { label: "Profile" },
        ]}
      />

      <div className="bg-white border border-gray-100 rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-gray-100 text-center sm:text-left">
          <div className="w-18 h-18 rounded-3xl bg-purple-50 text-purple-600 text-xl font-black flex items-center justify-center border border-purple-100 shrink-0 shadow-2xs">
            {getInitials(user?.full_name || "Quiz Master")}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-950">
              {user?.full_name || "Faculty Member"}
            </h2>
            <p className="text-xs text-gray-400 mt-1 font-mono font-medium">
              {user?.email || "instructor@university.edu"}
            </p>
            <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700">
                Quiz Master / Instructor
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                Authorized Examiner
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-1">
            <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
              <Mail className="w-3.5 h-3.5 text-purple-600" />
              Official Email
            </span>
            <p className="font-bold text-gray-950 text-sm font-mono">
              {user?.email || "—"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-1">
            <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-purple-600" />
              Assigned Courses
            </span>
            <p className="font-bold text-gray-950 text-sm">
              {courses?.length || 0} Examination Banks
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-purple-100 bg-purple-50/40 text-xs text-gray-600 leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-gray-950 mb-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Instructor Academic Authorization</span>
          </div>
          As a registered Quiz Master, you hold full permissions to author, upload,
          review AI-extracted questions, verify syllabus keys, and publish active
          examinations across University General Studies courses.
        </div>
      </div>
    </div>
  );
}
