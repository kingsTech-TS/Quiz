"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useQuizMasterCourses } from "@/hooks/use-courses";
import { PageHeader } from "@/components/shared/PageHeader";
import { CourseStatusBadge } from "@/components/courses/CourseStatusBadge";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Plus, Search, UploadCloud, ChevronRight, BookOpen, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";
import { courseService } from "@/services/course.service";
import { getApiError } from "@/lib/api";
import type { Course } from "@/types/course";

export default function QuizMasterCoursesListPage() {
  const { data: courses, isLoading, error, refetch } = useQuizMasterCourses();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    setIsDeleting(true);
    try {
      await courseService.deleteCourse(courseToDelete.id);
      toast.success(`Course "${courseToDelete.title}" deleted successfully.`);
      setCourseToDelete(null);
      refetch();
    } catch (err: unknown) {
      toast.error(getApiError(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    if (!courses) return [];
    return courses.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.gst_code.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [courses, search, statusFilter]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Instructor Course Banks"
        description="Comprehensive inventory of courses, question banks, and publication statuses."
        breadcrumbs={[
          { label: "Dashboard", href: "/qm/dashboard" },
          { label: "My Courses" },
        ]}
        action={
          <Link
            href="/qm/courses/create"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold rounded-full bg-gray-950 text-white hover:bg-gray-800 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </Link>
        }
      />

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by course title or GST code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-gray-200/80 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none shadow-2xs transition-all"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter courses by status"
          className="px-4 py-3 text-xs sm:text-sm rounded-2xl border border-gray-200/80 bg-white text-gray-800 font-semibold focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none shadow-2xs transition-all cursor-pointer"
        >
          <option value="">All Publication Statuses</option>
          <option value="draft">Draft</option>
          <option value="processing">Processing</option>
          <option value="review">Needs Review</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : error ? (
        <ErrorState
          title="Could not load courses"
          message="Server error while retrieving instructor courses."
          onRetry={() => refetch()}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses match the criteria"
          description="Adjust your search query or create a new course past question set."
        />
      ) : (
        <div className="bg-white border border-gray-100 rounded-[28px] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-6">Course Title</th>
                  <th className="py-4 px-6">GST Tag</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6">Questions</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-900">
                {filtered.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-gray-950">
                      <Link
                        href={`/qm/courses/${course.id}`}
                        className="hover:text-purple-600 transition-colors"
                      >
                        {course.title}
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-extrabold text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full uppercase">
                        {course.gst_code}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 font-medium">
                      {course.duration_minutes} mins
                    </td>
                    <td className="py-4 px-6 text-gray-950 font-bold">
                      {course.question_count || 0}
                    </td>
                    <td className="py-4 px-6">
                      <CourseStatusBadge status={course.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/qm/courses/${course.id}/upload`}
                          className="p-2 text-gray-400 hover:text-purple-600 rounded-xl hover:bg-purple-50 transition-colors"
                          title="Upload syllabus or past questions"
                        >
                          <UploadCloud className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/qm/courses/${course.id}`}
                          className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
                          title="Manage Course"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setCourseToDelete(course)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!courseToDelete}
        title="Delete Course Assessment?"
        description={`Are you sure you want to permanently delete "${courseToDelete?.title}"? All associated questions, uploaded documents, and student quiz sessions will be removed. This action cannot be undone.`}
        confirmLabel="Delete Course"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteCourse}
        onClose={() => setCourseToDelete(null)}
      />
    </div>
  );
}
