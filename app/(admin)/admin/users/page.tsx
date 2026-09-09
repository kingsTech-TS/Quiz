"use client";

import React, { useState } from "react";
import { useAdminUsers } from "@/hooks/use-admin";
import { PageHeader } from "@/components/shared/PageHeader";
import { UserTable } from "@/components/admin/UserTable";
import { ExportButton } from "@/components/admin/ExportButton";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [gst, setGst] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useAdminUsers({
    search: search || undefined,
    level: level || undefined,
    gst: gst || undefined,
    page,
    per_page: 20,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Registration Directory"
        description="Filter, search, and audit student matriculation information and course registrations."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Students" },
        ]}
        action={<ExportButton />}
      />

      {isLoading && !data ? (
        <TableSkeleton rows={8} cols={6} />
      ) : error ? (
        <ErrorState
          title="Could not load student records"
          message="Server error while retrieving user records."
          onRetry={() => refetch()}
        />
      ) : (
        <UserTable
          users={data?.users || []}
          total={data?.total || 0}
          page={data?.page || 1}
          totalPages={data?.total_pages || 1}
          onPageChange={(p) => setPage(p)}
          search={search}
          onSearchChange={(s) => {
            setSearch(s);
            setPage(1);
          }}
          level={level}
          onLevelChange={(l) => {
            setLevel(l);
            setPage(1);
          }}
          gst={gst}
          onGstChange={(g) => {
            setGst(g);
            setPage(1);
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
