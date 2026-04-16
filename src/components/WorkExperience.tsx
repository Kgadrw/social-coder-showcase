import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin } from "lucide-react";

type Experience = {
  role: string;
  company: string;
  industry?: string;
  companyImageUrl?: string;
  period: string;
  location: string;
  type: string;
  description: string;
};

export function WorkExperience({ experiences }: { experiences?: Experience[] }) {
  const items = experiences ?? [];

  return (
    <Card className="modern-card p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-foreground">Work Experience</h2>
      
      <div className="space-y-4 sm:space-y-6">
        {items.map((exp, index) => (
          <div key={index} className="relative">
            {index !== items.length - 1 && (
              <div className="absolute left-4 sm:left-6 top-12 w-px h-full bg-border hidden sm:block"></div>
            )}
            
            <div className="flex gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-border/50 bg-muted flex items-center justify-center shadow-card flex-shrink-0">
                {exp.companyImageUrl ? (
                  <img
                    src={exp.companyImageUrl}
                    alt={exp.company}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                    {exp.company.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground leading-tight">{exp.role}</h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <p className="text-primary font-medium text-sm sm:text-base">{exp.company}</p>
                      {exp.industry ? (
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          • {exp.industry}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm self-start">
                    <CalendarDays className="w-3 h-3" />
                    <span className="whitespace-nowrap">{exp.period}</span>
                  </Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span>{exp.location}</span>
                  </span>
                  <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs font-medium w-fit">
                    {exp.type}
                  </span>
                </div>
                
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No experiences yet.</div>
        ) : null}
      </div>
    </Card>
  );
}