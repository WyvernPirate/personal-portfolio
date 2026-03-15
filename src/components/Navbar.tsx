
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const sections = [
  { index: "01", name: "About", href: "#about" },
  { index: "02", name: "Skills", href: "#skills" },
  { index: "03", name: "Projects", href: "#projects" },
  { index: "04", name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [scrollProgress, setScrollProgress] = useState(0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  React.useEffect(() => {
    const sectionIds = sections.map((section) => section.href.slice(1));

    const onScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.33;

      let current = sectionIds[0];
      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (section && scrollPosition >= section.offsetTop) {
          current = id;
        }
      });

      setActiveSection(current);

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="chapter-label">Portfolio.log</span>
            <span className="hidden text-xs uppercase tracking-[0.25em] text-muted-foreground md:inline">
              Phemelo Moloi
            </span>
          </div>

          <div className="hidden md:flex md:items-center md:gap-7">
            {sections.map((section) => (
              <a
                key={section.name}
                href={section.href}
                className={cn(
                  "group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] transition-colors",
                  activeSection === section.href.slice(1)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <span className="font-mono text-[11px] text-primary/80">{section.index}</span>
                {section.name}
              </a>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="rounded-md border border-border/80 p-2 text-foreground transition-colors hover:border-primary/60 hover:text-primary"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 border-t border-border/80 bg-background/95 px-6 py-10 backdrop-blur-xl transition-transform duration-300 ease-in-out md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="chapter-label">Section Index</span>
          <button
            onClick={toggleMenu}
            className="rounded-md border border-border/80 p-2 text-foreground transition-colors hover:border-primary/60 hover:text-primary"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="editorial-divider mb-8" />

        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <a
              key={section.name}
              href={section.href}
              onClick={toggleMenu}
              className={cn(
                "inline-flex items-center gap-3 text-lg uppercase tracking-[0.14em] transition-colors hover:text-primary",
                activeSection === section.href.slice(1) ? "text-primary" : "text-foreground"
              )}
            >
              <span className="font-mono text-sm text-primary/80">{section.index}</span>
              {section.name}
            </a>
          ))}
        </div>
      </div>

      <div className="h-[2px] w-full bg-border/40">
        <div
          className="h-full bg-gradient-to-r from-primary/60 via-primary to-cyan-300 transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </nav>
  );
};

export default Navbar;