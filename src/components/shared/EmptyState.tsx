import React from "react";
import { LucideIcon, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-10 text-center rounded-[28px] border border-dashed border-gray-200 bg-gray-50/50",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-purple-600" />
      </div>
      <h3 className="text-base font-extrabold text-gray-950 tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm text-gray-400 font-medium max-w-sm leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
