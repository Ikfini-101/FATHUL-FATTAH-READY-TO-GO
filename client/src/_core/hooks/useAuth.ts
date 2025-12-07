import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

export function useAuth(redirectOnUnauthenticated = false) {
  const meQuery = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const state = useMemo(() => {
    return {
      user: meQuery.data ?? null,
      loading: meQuery.isLoading || logoutMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(meQuery.data),
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
  ]);

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
