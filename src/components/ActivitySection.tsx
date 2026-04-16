import { Card } from "@/components/ui/card";

type ActivityPost = {
  id: string;
  date: string;
  content: string;
  imageUrl?: string;
  imageUrls?: string[];
  imageAlt?: string;
};

function resolveImageUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  const base = import.meta.env.VITE_API_BASE ?? "https://gad-backend-x1ky.onrender.com";
  return `${base}${url}`;
}

export function ActivitySection({ posts }: { posts?: ActivityPost[] }) {
  const items = posts ?? [];
  return (
    <Card className="modern-card p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Activity
          </h2>
          <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {items.length} {items.length === 1 ? "post" : "posts"}
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground">No posts yet.</div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((post) => {
            const images = post.imageUrls?.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : [];
            return (
            <div
              key={post.id}
              className="rounded-xl border border-border/50 p-2.5 sm:p-3 bg-background/40"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] sm:text-xs text-muted-foreground">{post.date}</div>
              </div>

              <p className="mt-1.5 text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap line-clamp-3">
                {post.content}
              </p>

              {images.length ? (
                <div className="mt-2 space-y-2">
                  {images.map((imageUrl, imageIdx) => (
                    <div
                      key={`${post.id}-${imageIdx}`}
                      className="overflow-hidden rounded-lg border border-border/50 bg-muted w-full aspect-[4/5] max-h-[320px]"
                    >
                      <img
                        src={resolveImageUrl(imageUrl)}
                        alt={post.imageAlt ?? `Activity image ${imageIdx + 1}`}
                        className="w-full h-full object-contain block"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )})}
          </div>
        </div>
      )}
    </Card>
  );
}

