import { Card } from "@/components/ui/card";

export function AboutSection() {
  return (
    <Card className="bg-gradient-card shadow-card border-0 p-6">
      <h2 className="text-xl font-semibold mb-4 text-foreground">About</h2>
      <p className="text-muted-foreground leading-relaxed">
        Passionate Frontend Web Developer and UI/UX Designer with expertise in modern web technologies. 
        I specialize in creating intuitive, responsive, and visually appealing digital experiences using 
        <span className="text-primary font-medium"> HTML, CSS, JavaScript, and React.js</span>. 
        My design skills in <span className="text-primary font-medium">Figma and Adobe XD</span> allow 
        me to bridge the gap between design and development, ensuring pixel-perfect implementations 
        that delight users and meet business objectives.
      </p>
      
      <div className="mt-6">
        <h3 className="font-semibold mb-3 text-foreground">Core Competencies</h3>
        <div className="flex flex-wrap gap-2">
          {['Frontend Development', 'UI/UX Design', 'Responsive Design', 'User Experience', 'Web Applications', 'Design Systems'].map((skill) => (
            <span key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}