import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewBadgeProps {
  needsReview?: boolean;
  isVerified?: boolean;
  reviewReason?: string | null;
  className?: string;
}

export function ReviewBadge({
  needsReview,
  isVerified,
  reviewReason,
  className,
}: ReviewBadgeProps) {
  if (needsReview) {
    return (
      <div className={cn("inline-flex items-center gap-1.5", className)}>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
          <AlertTriangle className="w-3 h-3" />
          Needs Review
        </span>
        {reviewReason && (
          <span className="text-[11px] text-amber-600 font-medium italic hidden sm:inline">
            ({reviewReason})
          </span>
        )}
      </div>
    );
  }

  if (isVerified) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700",
          className
        )}
      >
        <CheckCircle2 className="w-3 h-3" />
        Verified
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500",
        className
      )}
    >
      Pending Review
    </span>
  );
}
