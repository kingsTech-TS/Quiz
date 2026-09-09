"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
  onClick?: () => void;
}

export function NavItem({
  href,
  label,
  icon: Icon,
  badge,
  onClick,
}: NavItemProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3.5 px-3.5 py-3 text-sm font-semibold rounded-2xl transition-all duration-150 select-none",
        isActive
          ? "text-gray-950 font-bold bg-white/60 shadow-2xs"
          : "text-gray-500 hover:text-gray-900 hover:bg-black/4"
      )}
    >
      <Icon
        className={cn(
          "w-5 h-5 shrink-0 transition-colors",
          isActive
            ? "text-emerald-600"
            : "text-gray-400 group-hover:text-gray-600"
        )}
      />
      <span className="truncate flex-1 tracking-tight">{label}</span>
      {badge !== undefined && (
        <span
          className={cn(
            "ml-auto text-xs px-2 py-0.5 rounded-full font-semibold",
            isActive
              ? "bg-emerald-100 text-emerald-800"
              : "bg-gray-200/70 text-gray-600"
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
