import React from "react";
import Link from "next/link";
import { Clock, HelpCircle, ArrowRight, Bookmark } from "lucide-react";
import type { Course } from "@/types/course";
import { CourseStatusBadge } from "./CourseStatusBadge";

interface CourseCardProps {
  course: Course;
  actionHref?: string;
  actionLabel?: string;
  showStatus?: boolean;
}

export function CourseCard({
  course,
  actionHref = `/courses/${course.id}`,
  actionLabel = "Start Assessment",
  showStatus = false,
}: CourseCardProps) {
  return (
    <div className="flex flex-col bg-white border border-gray-100/90 rounded-[28px] p-6 shadow-2xs hover:shadow-xs hover:border-gray-200 transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 tracking-wide uppercase">
          {course.gst_code}
        </span>
        <div className="flex items-center gap-2">
          {showStatus && <CourseStatusBadge status={course.status} />}
          <button
            type="button"
            className="p-1 text-gray-300 hover:text-purple-600 transition-colors cursor-pointer"
            aria-label="Bookmark course"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className="text-base font-bold text-gray-950 leading-snug tracking-tight mb-1 line-clamp-1">
        {course.title}
      </h3>

      <p className="text-xs text-gray-400 font-medium line-clamp-2 mb-5 flex-1">
        {course.description || "Comprehensive university course assessment and past questions."}
      </p>

      <div className="flex items-center gap-4 text-xs text-gray-500 font-medium pt-3 border-t border-gray-100 mb-5">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>{course.duration_minutes} mins</span>
        </div>
        {course.question_count !== undefined && (
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
            <span>{course.question_count} questions</span>
          </div>
        )}
      </div>

      <Link
        href={actionHref}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-2xl bg-gray-950 text-white hover:bg-gray-800 transition-all shadow-xs text-center group"
      >
        <span>{actionLabel}</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
