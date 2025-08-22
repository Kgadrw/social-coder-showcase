import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, ExternalLink } from "lucide-react";

const certifications = [
  {
    title: "JavaScript Full Course",
    issuer: "Klab Academy",
    date: "Nov 2024",
    type: "Development",
    verified: true
  },
  {
    title: "Data Analysis with Python",
    issuer: "FreeCodeCamp",
    date: "Nov 2024", 
    type: "Data Science",
    verified: true
  },
  {
    title: "UI Design with Figma",
    issuer: "Klab Academy",
    date: "Oct 2024",
    type: "Design",
    verified: true
  },
  {
    title: "React.js Development",
    issuer: "Self-Study",
    date: "2024",
    type: "Framework",
    verified: false
  },
  {
    title: "Responsive Web Design",
    issuer: "FreeCodeCamp",
    date: "2024",
    type: "Development",
    verified: true
  }
];

const typeColors = {
  Development: "bg-blue-500/10 text-blue-600",
  "Data Science": "bg-green-500/10 text-green-600",
  Design: "bg-purple-500/10 text-purple-600",
  Framework: "bg-orange-500/10 text-orange-600"
};

export function CertificationsPanel() {
  return (
    <Card className="modern-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Licenses & Certifications</h2>
        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {certifications.map((cert, index) => (
          <div key={index} className="group border-l-2 border-primary/20 pl-3 sm:pl-4 py-2 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors text-sm sm:text-base leading-tight">
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
              
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded flex-shrink-0">
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}