
import React from "react";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import AboutSection from "../components/AboutSection";
import SkillsSection from "../components/SkillsSection";
import ProjectsSection from "../components/ProjectsSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import SystemMonitor from "../components/SystemMonitor";
import PortalCLI from "../components/PortalCLI";

const Index = () => {
  React.useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    // Ensure the page starts at the top on initial load/refresh
    window.scrollTo(0, 0);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <div className="crt-overlay crt-flicker" />
      <div className="pointer-events-none absolute inset-0 -z-10 grid-noise opacity-40" />
      <div className="pointer-events-none absolute inset-0 -z-10 hypr-grid opacity-20" />
      <Navbar />
      <main className="relative px-4 pb-14 pt-16 md:px-6">
        <div className="mx-auto max-w-6xl hypr-window hypr-glow" data-reveal>
          <div className="hypr-titlebar">
            <div className="hypr-dots">
              <span className="hypr-dot bg-red-400/80" />
              <span className="hypr-dot bg-amber-300/80" />
              <span className="hypr-dot bg-emerald-400/80" />
            </div>
            <p className="terminal-label">arch://hyprland/portfolio-session</p>
            <p className="hidden font-mono text-[11px] text-muted-foreground md:block">zsh 5.9 · tty1</p>
          </div>

          <div className="terminal-shell-body">
            <div className="terminal-exec" id="about" data-reveal style={{ scrollMarginTop: "5rem", "--reveal-delay": "20ms", "--cmd-chars": 29 } as React.CSSProperties}>
              <p className="exec-command"><span className="terminal-prompt">$</span><span className="terminal-cmd">fastfetch</span><span className="terminal-args"> --logo-type kitty</span></p>
              <Hero />
            </div>

            <div className="terminal-exec" id="skills" data-reveal style={{ scrollMarginTop: "5rem", "--reveal-delay": "60ms", "--cmd-chars": 38 } as React.CSSProperties}>
              <p className="exec-command"><span className="terminal-prompt">$</span><span className="terminal-cmd">cat</span><span className="terminal-args"> ~/portfolio/skills.tsv | column -t</span></p>
              <SkillsSection />
            </div>

            <div className="terminal-exec" id="projects" data-reveal style={{ scrollMarginTop: "5rem", "--reveal-delay": "120ms", "--cmd-chars": 46 } as React.CSSProperties}>
              <p className="exec-command"><span className="terminal-prompt">$</span><span className="terminal-cmd">gh</span><span className="terminal-args"> repo list WyvernPirate --limit 6 --json name</span></p>
              <ProjectsSection />
            </div>

            <div className="terminal-exec" id="contact" data-reveal style={{ scrollMarginTop: "5rem", "--reveal-delay": "180ms", "--cmd-chars": 39 } as React.CSSProperties}>
              <p className="exec-command"><span className="terminal-prompt">$</span><span className="terminal-cmd">mail</span><span className="terminal-args"> -s "hello" phemelo@portfolio.dev</span></p>
              <ContactSection />
            </div>

            <div className="terminal-exec" data-reveal style={{ "--reveal-delay": "220ms" } as React.CSSProperties}>
              <Footer />
            </div>

            <div className="terminal-exec" data-reveal style={{ "--reveal-delay": "250ms" } as React.CSSProperties}>
              <PortalCLI />
            </div>
          </div>
        </div>
      </main>
      <SystemMonitor />
    </div>
  );
};

export default Index;
