import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Article } from "@/types/portfolio";

function resolveImageUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  const base = import.meta.env.VITE_API_BASE ?? "https://gad-backend-x1ky.onrender.com";
  return `${base}${url}`;
}

export function ArticlesSection({ articles }: { articles?: Article[] }) {
  const items = articles ?? [];
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setActiveId((current) => {
      if (current && items.some((article) => article.id === current)) return current;
      return null;
    });
  }, [items]);

  useEffect(() => {
    setExpanded(false);
  }, [activeId]);

  const activeArticle = items.find((article) => article.id === activeId) ?? null;
  const previewText = activeArticle?.content ?? "";
  const shouldClamp = previewText.length > 520;
  const displayedText =
    activeArticle && shouldClamp && !expanded
      ? `${previewText.slice(0, 520).trimEnd()}...`
      : previewText;

  return (
    <Card className="modern-card p-4 sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Articles</h2>
        <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          {items.length} {items.length === 1 ? "article" : "articles"}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground">No articles yet.</div>
      ) : activeArticle ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveId(null);
                setExpanded(false);
              }}
              className="px-0 hover:bg-transparent hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to articles
            </Button>

            <div className="text-xs sm:text-sm text-muted-foreground">Reading mode</div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-background/40 overflow-hidden">
            {activeArticle.imageUrl ? (
              <div className="w-full aspect-[16/8] bg-muted">
                <img
                  src={resolveImageUrl(activeArticle.imageUrl)}
                  alt={activeArticle.imageAlt ?? activeArticle.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : null}

            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-2xl font-semibold text-foreground leading-tight">
                    {activeArticle.title}
                  </h3>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {activeArticle.date}
                  </div>
                </div>

                {activeArticle.link ? (
                  <a
                    href={activeArticle.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-accent/40 text-muted-foreground hover:text-foreground"
                    aria-label="Open article link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </div>

              {activeArticle.summary ? (
                <p className="mt-3 text-sm sm:text-base text-foreground/90 leading-relaxed">
                  {activeArticle.summary}
                </p>
              ) : null}

              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {displayedText}
              </p>

              {shouldClamp ? (
                <Button
                  variant="link"
                  className="mt-3 h-auto px-0"
                  onClick={() => setExpanded((value) => !value)}
                >
                  {expanded ? "See less" : "See more"}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() => setActiveId(article.id)}
              className="overflow-hidden rounded-2xl border border-border/50 bg-background/40 text-left transition-transform hover:-translate-y-0.5 hover:bg-accent/10"
            >
              <div className="w-full aspect-[16/10] bg-muted">
                {article.imageUrl ? (
                  <img
                    src={resolveImageUrl(article.imageUrl)}
                    alt={article.imageAlt ?? article.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="text-base sm:text-lg font-semibold text-foreground leading-snug">
                  {article.title}
                </div>
                <div className="mt-2 text-xs sm:text-sm text-muted-foreground">
                  Published {article.date}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
