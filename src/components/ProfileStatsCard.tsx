import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Award, Wrench, Sparkles } from "lucide-react";

export function ProfileStatsCard({
  postsCount,
  experiencesCount,
  skillsCount,
  certificationsCount,
}: {
  postsCount: number;
  experiencesCount: number;
  skillsCount: number;
  certificationsCount: number;
}) {
  return (
    <Card className="modern-card p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Profile stats</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Quick snapshot</p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Sparkles className="h-3.5 w-3.5" />
          Social
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-border/50 bg-background/40 p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            Experience
          </div>
          <div className="mt-1 text-xl font-semibold text-foreground">{experiencesCount}</div>
        </div>
        <div className="rounded-xl border border-border/50 bg-background/40 p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Wrench className="h-4 w-4" />
            Skills
          </div>
          <div className="mt-1 text-xl font-semibold text-foreground">{skillsCount}</div>
        </div>
        <div className="rounded-xl border border-border/50 bg-background/40 p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Award className="h-4 w-4" />
            Certs
          </div>
          <div className="mt-1 text-xl font-semibold text-foreground">{certificationsCount}</div>
        </div>
        <div className="rounded-xl border border-border/50 bg-background/40 p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            Posts
          </div>
          <div className="mt-1 text-xl font-semibold text-foreground">{postsCount}</div>
        </div>
      </div>
    </Card>
  );
}

