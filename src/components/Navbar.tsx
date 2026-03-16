
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
      // Use a smaller offset for more precise activation
      const scrollPosition = window.scrollY + 100;

      let current = activeSection;
      
      // Determine which section is currently in view
      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          // If the top of the section is near the top of the viewport
          if (rect.top <= 120 && rect.bottom >= 120) {
            current = id;
            break;
          }
        }
      }

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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-primary/20 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-10">
          <div className="flex items-center h-full">
            <div className="bg-primary px-3 h-full flex items-center text-primary-foreground font-bold text-[10px] uppercase tracking-tighter mr-2">
              PORTAL [0]
            </div>
            <div className="flex items-center gap-1 h-full px-2 border-r border-primary/10">
              {sections.map((section) => (
                <a
                  key={section.name}
                  href={section.href}
                  className={cn(
                    "px-3 h-full flex items-center text-[10px] font-mono transition-all",
                    activeSection === section.href.slice(1)
                      ? "bg-primary/20 text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {section.index}:{section.name.toLocaleLowerCase()}*
                </a>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 h-full font-mono text-[10px]">
            <div className="text-emerald-400">
               <span className="opacity-50 font-sans">CPU:</span> 12.4%
            </div>
            <div className="text-cyan-400 border-l border-primary/10 pl-4 h-full flex items-center">
               <span className="opacity-50 font-sans">MEM:</span> 4.2G / 16G
            </div>
            <div className="text-primary border-x border-primary/10 px-4 h-full flex items-center bg-primary/5">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-primary hover:bg-primary/10 p-1"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
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