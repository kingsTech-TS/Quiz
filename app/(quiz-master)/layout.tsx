import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function QuizMasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout allowedRole="quiz_master">{children}</DashboardLayout>;
}
