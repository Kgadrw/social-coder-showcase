import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, CalendarDays } from "lucide-react";

export function EducationCard() {
  return (
    <Card className="bg-gradient-card shadow-card border-0 p-6">
      <h2 className="text-xl font-semibold mb-6 text-foreground">Education</h2>
      
      <div className="flex gap-4">
        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white shadow-card flex-shrink-0">
          <GraduationCap className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-foreground">Bachelor of Science in Computer Science</h3>
              <p className="text-primary font-medium">University of the People</p>
            </div>
            <Badge variant="outline" className="flex items-center gap-1 border-primary/30 text-primary">
              <CalendarDays className="w-3 h-3" />
              Nov 2024 – 2028
            </Badge>
          </div>
          
          <p className="text-muted-foreground text-sm leading-relaxed">
            Pursuing a comprehensive degree in Computer Science with focus on software development, 
            algorithms, data structures, and modern web technologies. Currently maintaining excellent 
            academic performance while gaining practical industry experience.
          </p>
          
          <div className="mt-4">
            <Badge variant="secondary" className="mr-2">
              In Progress
            </Badge>
            <Badge variant="outline">
              Online Program
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}