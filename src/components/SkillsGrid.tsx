import { Card } from "@/components/ui/card";

const skills = [
  { name: "HTML", level: 95, color: "from-orange-500 to-orange-600" },
  { name: "CSS", level: 90, color: "from-blue-500 to-blue-600" },
  { name: "JavaScript", level: 85, color: "from-yellow-500 to-yellow-600" },
  { name: "React.js", level: 80, color: "from-cyan-500 to-cyan-600" },
  { name: "Bootstrap", level: 85, color: "from-purple-500 to-purple-600" },
  { name: "Figma", level: 90, color: "from-pink-500 to-pink-600" },
  { name: "Adobe XD", level: 75, color: "from-indigo-500 to-indigo-600" },
  { name: "AI Integration", level: 70, color: "from-emerald-500 to-emerald-600" }
];

export function SkillsGrid() {
  return (
    <Card className="modern-card p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-foreground">Technical Skills</h2>
      
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {skills.map((skill, index) => (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <span className="font-medium text-foreground text-sm sm:text-base">{skill.name}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">{skill.level}%</span>
            </div>
            
            <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out animate-[slideIn_1s_ease-out_forwards]`}
                style={{ 
                  width: `${skill.level}%`,
                  transform: 'translateX(-100%)'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}