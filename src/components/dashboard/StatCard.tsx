import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  subtext,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-gray-100 rounded-[24px] p-5 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-all duration-200",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </span>
        <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <span className="text-2xl font-black tracking-tight text-gray-950">
          {value}
        </span>
        {subtext && (
          <p className="mt-1 text-xs text-gray-400 font-medium truncate">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
