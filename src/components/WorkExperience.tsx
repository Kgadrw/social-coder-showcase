import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin } from "lucide-react";

const experiences = [
  {
    role: "Frontend Web Developer",
    company: "3DP",
    period: "Dec 2023 – Present",
    location: "Kigali, Rwanda",
    type: "Full-time",
    description: "Developing responsive web applications and user interfaces using React.js and modern frontend technologies."
  },
  {
    role: "Web Developer",
    company: "Capitalist Supply and Logistics Ltd",
    period: "Dec 2024 – Feb 2025",
    location: "Kigali, Rwanda", 
    type: "Contract",
    description: "Built and maintained company website and web-based logistics management systems."
  },
  {
    role: "IT Specialist",
    company: "Uza Solutions",
    period: "Apr 2024 – Feb 2025",
    location: "Kigali, Rwanda",
    type: "Part-time",
    description: "Provided IT support and developed web solutions to improve business operations and efficiency."
  },
  {
    role: "Freelance Developer",
    company: "Independent",
    period: "2024 – Present",
    location: "Remote",
    type: "Freelance",
    description: "Delivering custom web development and UI/UX design solutions for various clients across different industries."
  }
];

export function WorkExperience() {
  return (
    <Card className="modern-card p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-foreground">Work Experience</h2>
      
      <div className="space-y-4 sm:space-y-6">
        {experiences.map((exp, index) => (
          <div key={index} className="relative">
            {index !== experiences.length - 1 && (
              <div className="absolute left-4 sm:left-6 top-12 w-px h-full bg-border hidden sm:block"></div>
            )}
            
            <div className="flex gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-card flex-shrink-0">
                {exp.company.charAt(0)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground leading-tight">{exp.role}</h3>
                    <p className="text-primary font-medium text-sm sm:text-base">{exp.company}</p>
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
      </div>
    </Card>
  );
}