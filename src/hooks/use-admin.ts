import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { QUERY_KEYS } from "@/lib/constants";
import type { AdminUsersParams } from "@/types/admin";

export function useAdminAnalytics() {
  return useQuery({
    queryKey: QUERY_KEYS.adminAnalytics,
    queryFn: adminService.getAnalytics,
  });
}

export function useAdminUsers(params?: AdminUsersParams) {
  return useQuery({
    queryKey: QUERY_KEYS.adminUsers(params),
    queryFn: () => adminService.getUsers(params),
  });
}

export function useAdminQuizMasters() {
  return useQuery({
    queryKey: QUERY_KEYS.adminQuizMasters,
    queryFn: adminService.getQuizMasters,
  });
}
