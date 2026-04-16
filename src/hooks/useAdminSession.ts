import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api";

export function useAdminSession() {
  return useQuery({
    queryKey: ["admin-me"],
    queryFn: getMe,
    retry: false,
  });
}

