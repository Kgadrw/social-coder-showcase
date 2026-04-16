import { Card } from "@/components/ui/card";
import type { PortfolioContent } from "@/types/portfolio";

function resolveImageUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  const base = import.meta.env.VITE_API_BASE ?? "http://localhost:5174";
  return `${base}${url}`;
}

export function FeaturedLinksCard({ content }: { content?: PortfolioContent }) {
  const banners = content?.sidebarBanners ?? [];

  return (
    <div className="space-y-3">
        {banners.length ? (
          banners.map((banner) => (
            <a
              key={banner.id}
              href={banner.link || "#"}
              target={banner.link ? "_blank" : undefined}
              rel={banner.link ? "noopener noreferrer" : undefined}
              className="block hover:opacity-95 transition-opacity"
            >
              {banner.imageUrl ? (
                <div className="w-full bg-transparent">
                  <img
                    src={resolveImageUrl(banner.imageUrl)}
                    alt={banner.imageAlt ?? "Sidebar banner"}
                    className="w-full h-auto object-contain block"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-full bg-muted flex items-center justify-center text-sm text-muted-foreground py-10">
                  No banner image
                </div>
              )}
            </a>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">No banners yet.</div>
        )}
    </div>
  );
}

