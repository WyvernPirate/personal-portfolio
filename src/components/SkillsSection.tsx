
import React from "react";
import { Progress } from "@/components/ui/progress";
import TerminalCommand from "@/components/TerminalCommand";

const SkillsSection = () => {
  const technicalSkills = [
    { name: "JavaScript/TypeScript", level: 85 },
    { name: "React.js", level: 80 },
    { name: "Node.js", level: 75 },
    { name: "Python", level: 70 },
    { name: "Java", level: 65 },
    { name: "SQL/NoSQL", level: 75 },
  ];

  const otherSkills = [
    "Git", "Docker", "RESTful API", "CI/CD",
    "Unit Testing", "UI/UX", "Agile", "Linux"
  ];

  return (
    <section id="skills" className="px-5 pb-8 pt-4 md:px-8 md:pb-10">
      <p className="max-w-3xl text-sm text-muted-foreground mt-2">
        Core technical stack and supplemental tools identified in current profile.
      </p>

      <div className="editorial-divider my-6 opacity-40" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h3 className="mb-8 text-xl font-semibold text-primary/90 uppercase tracking-wider glitch-text">03. Tech Stack</h3>
            <div className="space-y-6">
              {technicalSkills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-foreground text-sm">{skill.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-1.5 bg-primary/10" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="mb-6 text-xl font-semibold text-primary/90 uppercase tracking-wider glitch-text">04. Toolchain</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {otherSkills.map((skill) => (
                  <div 
                    key={skill} 
                    className="rounded border border-primary/10 bg-primary/5 p-2 text-center transition-colors hover:border-primary/30"
                  >
                    <span className="font-mono text-[11px] text-foreground">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold text-primary/90 uppercase tracking-wider glitch-text">05. Active Learning</h3>
              <div className="flex flex-wrap gap-2">
                {["GraphQL", "AWS", "TensorFlow", "Kubernetes"].map((item) => (
                  <span 
                    key={item}
                    className="rounded border border-primary/30 bg-primary/12 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
      </div>
    </section>
  );
};

export default SkillsSection;