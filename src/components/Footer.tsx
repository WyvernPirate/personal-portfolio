
import React from "react";
import { Github, Linkedin, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t border-border/80 py-12">
      <div className="container px-4 mx-auto">
        <div className="surface-panel p-6 md:p-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="chapter-label">Appendix / Connect</span>
              <p className="mt-4 text-xl font-semibold text-foreground">Phemelo Moloi</p>
              <p className="mt-1 text-muted-foreground">Computer Science and Software Engineering Student</p>
            </div>

            <div className="flex space-x-4">
              <a
                href="https://github.com/WyvernPirate"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/phemelo-moloi-12aa41303"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className="editorial-divider my-8" />

          <div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Phemelo Moloi. All rights reserved.
            </p>
          </div>

          <div className="mt-4">
            <button 
              onClick={scrollToTop} 
              className="flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
              aria-label="Scroll to top"
            >
              Back to top <ArrowUp size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;