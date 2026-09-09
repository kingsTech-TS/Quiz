"use client";

import React, { useState, useMemo } from "react";
import { useCourses } from "@/hooks/use-courses";
import { PageHeader } from "@/components/shared/PageHeader";
import { CourseCard } from "@/components/courses/CourseCard";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Search, BookOpen } from "lucide-react";
import { GST_COURSES } from "@/lib/constants";

export default function StudentCoursesPage() {
  const { data: courses, isLoading, error, refetch } = useCourses();
  const [search, setSearch] = useState("");
  const [gstFilter, setGstFilter] = useState("");

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    return courses.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase()) ||
        c.gst_code.toLowerCase().includes(search.toLowerCase());

      const matchGst = !gstFilter || c.gst_code === gstFilter;
      return matchSearch && matchGst;
    });
  }, [courses, search, gstFilter]);

  return (
    <div>
      <PageHeader
        title="Course Examination Bank"
        description="Browse authorized GST past question assessments and practice exams."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Courses" },
        ]}
      />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by course code, title, or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-gray-200/80 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none shadow-2xs transition-all"
          />
        </div>

        <select
          value={gstFilter}
          onChange={(e) => setGstFilter(e.target.value)}
          aria-label="Filter courses by GST code"
          className="px-4 py-3 text-xs sm:text-sm rounded-2xl border border-gray-200/80 bg-white text-gray-800 font-semibold focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none shadow-2xs transition-all cursor-pointer"
        >
          <option value="">All GST Codes</option>
          {GST_COURSES.map((g) => (
            <option key={g.code} value={g.code}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : error ? (
        <ErrorState
          title="Could not load courses"
          message="Server communication error while retrieving course lists."
          onRetry={() => refetch()}
        />
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description="No examination papers match your search criteria. Try modifying your search or filters."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              actionHref={`/courses/${course.id}`}
              actionLabel="Start Examination"
            />
          ))}
        </div>
      )}
    </div>
  );
}
