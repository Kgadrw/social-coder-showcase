import { Card } from "@/components/ui/card";

type Skill = { name: string; level: number; color: string };

export function SkillsGrid({ skills }: { skills?: Skill[] }) {
  const items = skills ?? [];
  return (
    <Card className="modern-card p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-foreground">Technical Skills</h2>
      
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {items.map((skill, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <span className="font-medium text-foreground text-sm sm:text-base">{skill.name}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">{skill.level}%</span>
            </div>
            
            <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${skill.color}`}
                style={{ 
                  width: `${skill.level}%`
                }}
              />
            </div>
          </div>
        ))}

        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No skills yet.</div>
        ) : null}
      </div>
    </Card>
  );
}