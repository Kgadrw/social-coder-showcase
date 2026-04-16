import { Card } from "@/components/ui/card";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";
import { Link } from "react-router-dom";

function resolveImageUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  const base = import.meta.env.VITE_API_BASE ?? "http://localhost:5174";
  return `${base}${url}`;
}

export default function Posts() {
  const { data, isLoading } = usePortfolioContent();
  const posts = data?.activityPosts ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-5xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Posts</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Personal updates, thoughts, and screenshots.
            </p>
          </div>
          <Link
            to="/"
            className="text-sm font-medium text-primary underline underline-offset-4"
          >
            Back to home
          </Link>
        </div>

        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : null}

        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="modern-card p-4 sm:p-6">
              <div className="text-xs sm:text-sm text-muted-foreground mb-2">
                {post.date}
              </div>
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
              {post.imageUrl ? (
                <div className="mt-4 overflow-hidden rounded-xl border border-border/50 bg-muted">
                  <img
                    src={resolveImageUrl(post.imageUrl)}
                    alt={post.imageAlt ?? "Post image"}
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                </div>
              ) : null}
            </Card>
          ))}

          {(!isLoading && posts.length === 0) ? (
            <div className="text-sm text-muted-foreground">No posts yet.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

