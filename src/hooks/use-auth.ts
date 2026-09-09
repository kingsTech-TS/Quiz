"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { clearToken, getToken } from "@/lib/auth";
import { QUERY_KEYS } from "@/lib/constants";
import type { User } from "@/types/user";
import type { LoginRequest } from "@/types/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    return !!getToken();
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }
    userService
      .getMe()
      .then((u) => {
        setUser(u);
        queryClient.setQueryData(QUERY_KEYS.me, u);
      })
      .catch(() => {
        clearToken();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [queryClient]);

  const login = useCallback(
    async (data: LoginRequest) => {
      const res = await authService.login(data);
      setUser(res.user);
      queryClient.setQueryData(QUERY_KEYS.me, res.user);
      return res;
    },
    [queryClient]
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    queryClient.clear();
    router.push("/login");
  }, [queryClient, router]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
}
