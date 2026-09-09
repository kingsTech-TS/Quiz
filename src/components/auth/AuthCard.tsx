import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-block mb-3">
          <span className="font-black text-2xl tracking-wider text-gray-950 uppercase">
            QUZIY
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
          {title}
        </h1>
        <p className="mt-1 text-sm text-gray-500 font-medium">{description}</p>
      </div>

      {/* Card Content */}
      <div className="bg-white border border-gray-100/80 rounded-[32px] p-7 sm:p-9 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="mt-6 text-center text-sm text-gray-500 font-medium">
          {footer}
        </div>
      )}
    </div>
  );
}
