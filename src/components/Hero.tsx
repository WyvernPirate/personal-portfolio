import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute -top-28 left-[-10%] h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[-8%] top-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="surface-panel grid gap-12 overflow-hidden p-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:p-12">
          <div className="animate-fade-up">
            <span className="chapter-label">Chapter 00 / Overview</span>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-foreground md:text-6xl">
              Building useful software,
              <br />
              <span className="text-primary">one intentional system at a time.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              I&apos;m Phemelo Moloi, a software engineering student focused on production-grade
              web apps, AI-assisted workflows, and clear technical communication. This site is a
              curated index of my projects, skills, and current learning path.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span className="font-mono">Status: Open to internships</span>
              <span className="h-1 w-1 rounded-full bg-primary/80" />
              <span className="font-mono">Location: Botswana</span>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild>
                <a href="#projects">
                  View My Projects <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#contact">Contact Me</a>
              </Button>
            </div>
          </div>

          <div className="animate-fade-up space-y-6" style={{ animationDelay: "100ms" }}>
            <div className="surface-panel relative overflow-hidden border-primary/25 p-5">
              <div className="pointer-events-none absolute left-0 top-0 h-[1px] w-full bg-primary/35" />
              <img
                src="/profile_pic.jpg"
                alt="My Profile Pic"
                className="h-full w-full rounded-xl border border-border/70 object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="surface-panel p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Focus
                </p>
                <p className="mt-2 text-sm text-foreground">Full-stack engineering</p>
              </div>
              <div className="surface-panel p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Domain
                </p>
                <p className="mt-2 text-sm text-foreground">ML + web systems</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;