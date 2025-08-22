import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, CalendarDays } from "lucide-react";

export function EducationCard() {
  return (
    <Card className="modern-card p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-foreground">Education</h2>
      
      <div className="flex gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white shadow-card flex-shrink-0">
          <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight">Bachelor of Science in Computer Science</h3>
              <p className="text-primary font-medium text-sm sm:text-base">University of the People</p>
            </div>
            <Badge variant="outline" className="flex items-center gap-1 border-primary/30 text-primary text-xs sm:text-sm self-start">
              <CalendarDays className="w-3 h-3" />
              <span className="whitespace-nowrap">Nov 2024 – 2028</span>
            </Badge>
          </div>
          
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
            Pursuing a comprehensive degree in Computer Science with focus on software development, 
            algorithms, data structures, and modern web technologies. Currently maintaining excellent 
            academic performance while gaining practical industry experience.
          </p>
          
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <Badge variant="secondary" className="text-xs">
              In Progress
            </Badge>
            <Badge variant="outline" className="text-xs">
              Online Program
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}