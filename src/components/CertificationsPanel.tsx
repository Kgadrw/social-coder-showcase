import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

type Certification = {
  title: string;
  issuer: string;
  date: string;
  type: string;
  verified: boolean;
  imageUrl?: string;
  imageAlt?: string;
  link?: string;
};

const typeColors = {
  Development: "bg-blue-500/10 text-blue-600",
  "Data Science": "bg-green-500/10 text-green-600",
  Design: "bg-purple-500/10 text-purple-600",
  Framework: "bg-orange-500/10 text-orange-600"
};

function resolveImageUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  const base = import.meta.env.VITE_API_BASE ?? "http://localhost:5174";
  return `${base}${url}`;
}

export function CertificationsPanel({
  certifications,
}: {
  certifications?: Certification[];
}) {
  const items = certifications ?? [];
  return (
    <Card className="modern-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Licenses & Certifications</h2>
        <img
          src="/verified.png"
          alt="Verified"
          className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
          loading="lazy"
        />
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {items.map((cert, index) => (
          <div key={index} className="border-l-2 border-primary/20 pl-3 sm:pl-4 py-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground text-sm sm:text-base leading-tight">
                  {cert.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                  {cert.issuer} • {cert.date}
                </p>
                
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${typeColors[cert.type as keyof typeof typeColors]}`}
                  >
                    {cert.type}
                  </Badge>
                  {cert.verified && (
                    <Badge variant="outline" className="text-xs border-green-500/30 text-green-600">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2 flex-shrink-0">
                {cert.imageUrl ? (
                  <a
                    href={cert.link || resolveImageUrl(cert.imageUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg overflow-hidden border border-border/50 bg-muted w-20 sm:w-24 aspect-[4/5]"
                    aria-label="Open certificate image"
                  >
                    <img
                      src={resolveImageUrl(cert.imageUrl)}
                      alt={cert.imageAlt ?? `${cert.title} certificate`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </a>
                ) : null}

                {cert.link ? (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-accent/40 text-muted-foreground hover:text-foreground"
                    aria-label="Open certificate link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No certifications yet.</div>
        ) : null}
      </div>
    </Card>
  );
}