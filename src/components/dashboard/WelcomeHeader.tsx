"use client";

import React from "react";
import { User } from "@/types/user";

interface WelcomeHeaderProps {
  user: User | null;
  subtitle?: string;
  action?: React.ReactNode;
}

export function WelcomeHeader({ user, subtitle, action }: WelcomeHeaderProps) {
  const firstName = user?.full_name?.split(" ")[0] || "Scholar";

  return (
    <div className="space-y-2 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-950">
            Overview
          </h1>
          <p className="mt-1.5 text-sm text-gray-400 font-medium">
            {subtitle ||
              `Welcome back, ${firstName}! Your progress is really good. Keep it up.`}
          </p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
