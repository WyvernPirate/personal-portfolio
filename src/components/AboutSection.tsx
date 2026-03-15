
import React from "react";
import { 
  GraduationCap, 
  Code,
  Book,
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="mb-10">
          <span className="chapter-label">Chapter 01 / About</span>
          <h2 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">Context and trajectory</h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            A concise timeline of my academic background, internship experience, and the direction
            I&apos;m currently pushing toward in software engineering.
          </p>
        </div>

        <div className="editorial-divider mb-10" />

        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
          <div>
            <div className="mb-8 text-left">
              <h3 className="text-2xl font-semibold text-foreground">About Me</h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                I'm a final-year Computer Science student at Botswana International University of Science and Technology with a passion for software development and problem-solving.
              </p>
            </div>

            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary/80">Mission</p>
                <h3 className="mb-5 mt-3 text-2xl font-semibold text-foreground">My Goal</h3>
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  I'm driven by the desire to build software that makes a difference. Currently focusing on web development and AI applications, I aim to blend technical excellence with great user experiences.
                </p>
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  My academic interests include web development, artificial intelligence, machine learning, and software architecture. I'm constantly learning and expanding my skill set through projects, coursework, and self-study.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <a href="#skills">
                    View My Skills <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="mb-6 text-2xl font-semibold text-foreground">Education & Journey</h3>
            <div className="space-y-5">
              <div className="surface-panel flex gap-4 p-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="rounded-lg border border-primary/35 bg-primary/12 p-2 text-primary">
                    <GraduationCap size={24} />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">BSc in Computer Science and Software Engineering</h4>
                  <p className="text-muted-foreground">Botswana International University of Science and Technology (2022 - Present)</p>
                  <p className="mt-2 text-muted-foreground">Specializing in Software Engineering</p>
                </div>
              </div>

              <div className="surface-panel flex gap-4 p-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="rounded-lg border border-primary/35 bg-primary/12 p-2 text-primary">
                    <Code size={24} />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">Full-Stack Development Intern</h4>
                  <p className="text-muted-foreground">CodVeda Technologies (Aug 2025 - Oct 2025)</p>
                  <p className="mt-2 text-muted-foreground">Gained hands-on experience in full-stack development, worked with modern web technologies to build and deploy scalable applications.</p>
                </div>
              </div>

              <div className="surface-panel flex gap-4 p-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="rounded-lg border border-primary/35 bg-primary/12 p-2 text-primary">
                    <Book size={24} />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">Information Management Attache</h4>
                  <p className="text-muted-foreground">Debswana Diamond Company (Jun 2025 - Jul 2025)</p>
                  <p className="mt-2 text-muted-foreground">Completed a 2-month internship, contributing to internal IT projects and gaining valuable industry experience.</p>
                </div>
              </div>

              <div className="surface-panel flex gap-4 p-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="rounded-lg border border-primary/35 bg-primary/12 p-2 text-primary">
                    <Code size={24} />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">Club President</h4>
                  <p className="text-muted-foreground">Biust Innovation Club (Aug 2025 - Present)</p>
                  <p className="mt-2 text-muted-foreground">Manage the club and organize events to promote innovation and collaboration among members.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
