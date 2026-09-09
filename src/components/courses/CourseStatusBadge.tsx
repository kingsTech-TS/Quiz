import React from "react";
import type { CourseStatus } from "@/types/course";
import { cn } from "@/lib/utils";

interface CourseStatusBadgeProps {
  status: CourseStatus;
  className?: string;
}

export function CourseStatusBadge({ status, className }: CourseStatusBadgeProps) {
  const styles: Record<CourseStatus, { bg: string; text: string; label: string }> = {
    draft: {
      bg: "bg-gray-100",
      text: "text-gray-600",
      label: "Draft",
    },
    processing: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      label: "Processing",
    },
    review: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      label: "Needs Review",
    },
    published: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      label: "Published",
    },
    expired: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      label: "Expired",
    },
    archived: {
      bg: "bg-slate-100",
      text: "text-slate-600",
      label: "Archived",
    },
  };

  const current = styles[status] || styles.draft;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold",
        current.bg,
        current.text,
        className
      )}
    >
      {current.label}
    </span>
  );
}
