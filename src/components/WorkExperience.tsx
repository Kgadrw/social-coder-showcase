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
    <Card className="bg-gradient-card shadow-card border-0 p-6">
      <h2 className="text-xl font-semibold mb-6 text-foreground">Work Experience</h2>
      
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={index} className="relative">
            {index !== experiences.length - 1 && (
              <div className="absolute left-6 top-12 w-px h-full bg-border"></div>
            )}
            
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-card flex-shrink-0">
                {exp.company.charAt(0)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{exp.role}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {exp.period}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {exp.location}
                  </span>
                  <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs font-medium">
                    {exp.type}
                  </span>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
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