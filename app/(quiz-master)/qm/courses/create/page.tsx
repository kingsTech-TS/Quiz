import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { CreateCourseForm } from "@/components/courses/CreateCourseForm";

export const metadata = {
  title: "Create Course — Instructor Portal",
  description: "Create a new course assessment and syllabus question bank",
};

export default function CreateCoursePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Create New Course Assessment"
        description="Configure a new course past questions bank before uploading document files."
        breadcrumbs={[
          { label: "Dashboard", href: "/qm/dashboard" },
          { label: "Courses", href: "/qm/courses" },
          { label: "Create Course" },
        ]}
      />

      <CreateCourseForm />
    </div>
  );
}
