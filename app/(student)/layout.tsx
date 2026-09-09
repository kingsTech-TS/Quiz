import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StudentBanner } from "@/components/dashboard/StudentBanner";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout allowedRole="user">
      <StudentBanner />
      {children}
    </DashboardLayout>
  );
}
