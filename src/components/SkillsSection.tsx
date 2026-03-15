
import React from "react";
import { Progress } from "@/components/ui/progress";

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
    "Git & Version Control",
    "RESTful API Design",
    "Docker",
    "CI/CD",
    "Unit Testing",
    "Responsive Design",
    "UI/UX Principles",
    "Agile Development"
  ];

  return (
    <section id="skills" className="py-16 md:py-24" data-reveal>
      <div className="container px-4 mx-auto">
        <div className="mb-10" data-reveal>
          <span className="chapter-label">Chapter 02 / Capability Map</span>
          <h2 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">Skills & Expertise</h2>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
            Here are the technologies and tools I've been working with during my studies and personal projects.
          </p>
        </div>

        <div className="editorial-divider mb-10" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" data-reveal style={{ "--reveal-delay": "60ms" } as React.CSSProperties}>
          <div className="surface-panel p-6">
            <h3 className="mb-8 text-2xl font-semibold text-foreground">Technical Skills</h3>
            <div className="space-y-6">
              {technicalSkills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-foreground">{skill.name}</span>
                    <span className="font-mono text-sm text-muted-foreground">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel p-6">
            <h3 className="mb-8 text-2xl font-semibold text-foreground">Other Skills & Knowledge</h3>
            <div className="grid grid-cols-2 gap-4">
              {otherSkills.map((skill) => (
                <div 
                  key={skill} 
                  className="rounded-lg border border-border/80 bg-secondary/35 p-4 transition-colors hover:border-primary/35 hover:bg-secondary/70"
                >
                  <span className="font-medium text-foreground">{skill}</span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h3 className="mb-4 text-2xl font-semibold text-foreground">Currently Learning</h3>
              <div className="flex flex-wrap gap-2">
                {["GraphQL", "AWS", "React Native", "TensorFlow"].map((item) => (
                  <span 
                    key={item}
                    className="rounded-md border border-primary/30 bg-primary/12 px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-primary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;