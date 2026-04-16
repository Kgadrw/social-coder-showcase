import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { PortfolioContent } from "@/types/portfolio";

export function usePortfolioContent() {
  return useQuery({
    queryKey: ["portfolio-content"],
    queryFn: () => apiFetch<PortfolioContent>("/api/content"),
  });
}

