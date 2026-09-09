"use client";

import React, { useState, useEffect, useRef } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizTimerProps {
  expiresAt: string; // ISO string from backend
  onExpire: () => void;
  className?: string;
}

export function QuizTimer({ expiresAt, onExpire, className }: QuizTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    const expiry = new Date(expiresAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((expiry - now) / 1000));
  });

  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    const calculateTime = () => {
      const expiry = new Date(expiresAt).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiry - now) / 1000));
      setSecondsRemaining(diff);

      if (diff <= 0) {
        onExpireRef.current();
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isUrgent = secondsRemaining < 300; // less than 5 minutes

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold tracking-tight shadow-2xs transition-colors",
        isUrgent
          ? "bg-red-50 border border-red-200 text-red-700 animate-pulse"
          : "bg-gray-100 border border-gray-200/60 text-gray-800",
        className
      )}
      role="timer"
      aria-label="Time remaining"
    >
      {isUrgent ? (
        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
      ) : (
        <Clock className="w-3.5 h-3.5 text-gray-400" />
      )}
      <span>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
