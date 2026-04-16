import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/portfolio";
import { ExternalLink } from "lucide-react";

function resolveImageUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  const base = import.meta.env.VITE_API_BASE ?? "https://gad-backend-x1ky.onrender.com";
  return `${base}${url}`;
}

export function ProjectsSection({ projects }: { projects?: Project[] }) {
  const items = projects ?? [];
  const categories = useMemo(() => {
    const set = new Set(items.map((p) => p.category));
    return ["All", ...Array.from(set)] as const;
  }, [items]);
  const [cat, setCat] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(() => {
    if (cat === "All") return items;
    return items.filter((p) => p.category === cat);
  }, [items, cat]);

  return (
    <Card className="modern-card p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Projects</h2>
          <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {items.length} {items.length === 1 ? "project" : "projects"}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 justify-end">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={[
                "px-2 py-1 rounded-full text-xs border transition-colors",
                c === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background/40 border-border/60 text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-sm text-muted-foreground">No projects yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-border/50 bg-background/40 overflow-hidden"
            >
              {p.imageUrl ? (
                <div className="w-full aspect-[16/10] bg-muted">
                  <img
                    src={resolveImageUrl(p.imageUrl)}
                    alt={p.imageAlt ?? p.title}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
              ) : null}

              <div className="p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                        {p.title}
                      </h3>
                      {p.featured ? (
                        <Badge variant="secondary" className="text-[11px]">
                          Featured
                        </Badge>
                      ) : null}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{p.category}</div>
                  </div>

                  {p.links?.[0]?.url ? (
                    <a
                      href={p.links[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-accent/40 text-muted-foreground hover:text-foreground"
                      aria-label="Open project link"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>

                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {p.summary}
                </p>

                {p.tech?.length ? (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.tech.slice(0, 6).map((t) => (
                      <span
                        key={`${p.id}-${t}`}
                        className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}

                {p.links?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.links.slice(0, 2).map((l) => (
                      <a
                        key={`${p.id}-${l.url}`}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-primary underline underline-offset-4"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

