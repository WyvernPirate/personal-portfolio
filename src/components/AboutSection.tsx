
import React from "react";
import { 
  GraduationCap, 
  Code,
  Book
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TerminalCommand from "@/components/TerminalCommand";

const AboutSection = () => {
  return (
    <section id="about" className="px-5 pb-8 pt-4 md:px-8 md:pb-10">
      <p className="max-w-3xl text-muted-foreground mt-2">
        A command-line trace of my academic history, internship experience, and active engineering pursuits.
      </p>

      <div className="editorial-divider my-6 opacity-40" />

      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
          <div>
            <div className="mb-8 text-left">
              <h3 className="text-xl font-semibold text-primary/90 uppercase tracking-wider glitch-text">01. Profile</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Final-year Computer Science student at BIUST. Focused on software development, problem-solving, and building scalable systems.
              </p>
            </div>

            <div className="border-l-2 border-primary/20 pl-6 py-2">
              <h3 className="mb-4 text-lg font-semibold text-foreground glitch-text">Mission Statement</h3>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                I'm driven by the desire to build software that makes a difference. Currently focusing on web development and AI applications, I aim to blend technical excellence with great user experiences.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Academic interests include web development, AI, ML, and software architecture.
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-xl font-semibold text-primary/90 uppercase tracking-wider">02. Logged Events</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="rounded-md border border-primary/20 bg-primary/5 p-1.5 text-primary/70">
                    <GraduationCap size={18} />
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-foreground">BSc in CS & Software Engineering</h4>
                  <p className="text-xs text-muted-foreground">BIUST (2022 - Present)</p>
                  <p className="mt-1 text-xs text-muted-foreground">Specializing in Software Engineering</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="rounded-md border border-primary/20 bg-primary/5 p-1.5 text-primary/70">
                    <Code size={18} />
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-foreground">Full-Stack Development Intern</h4>
                  <p className="text-xs text-muted-foreground">CodVeda Technologies (Aug 2025 - Oct 2025)</p>
                  <p className="mt-1 text-xs text-muted-foreground">Scalable web applications and modern stack deployment.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="rounded-md border border-primary/20 bg-primary/5 p-1.5 text-primary/70">
                    <Book size={18} />
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-foreground">Information Management Attache</h4>
                  <p className="text-xs text-muted-foreground">Debswana Diamond Company (Jun 2025 - Jul 2025)</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="rounded-md border border-primary/20 bg-primary/5 p-1.5 text-primary/70">
                    <Code size={18} />
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-foreground">Club President</h4>
                  <p className="text-xs text-muted-foreground">Biust Innovation Club (Aug 2025 - Present)</p>
                </div>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
};

export default AboutSection;
