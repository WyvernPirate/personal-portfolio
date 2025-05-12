
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
    <section id="skills" className="py-20 bg-slate-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Skills & Expertise</h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">
            Here are the technologies and tools I've been working with during my studies and personal projects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-8 text-gray-900">Technical Skills</h3>
            <div className="space-y-6">
              {technicalSkills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">{skill.name}</span>
                    <span className="text-sm text-gray-500">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-8 text-gray-900">Other Skills & Knowledge</h3>
            <div className="grid grid-cols-2 gap-4">
              {otherSkills.map((skill) => (
                <div 
                  key={skill} 
                  className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-gray-800 font-medium">{skill}</span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Currently Learning</h3>
              <div className="flex flex-wrap gap-2">
                {["GraphQL", "AWS", "React Native", "TensorFlow"].map((item) => (
                  <span 
                    key={item}
                    className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm"
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