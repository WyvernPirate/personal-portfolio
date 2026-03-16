
import React from "react";
import { Github, Linkedin, ArrowUp } from "lucide-react";
import TerminalCommand from "@/components/TerminalCommand";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="px-5 pb-8 pt-4 md:px-8 md:pb-10" data-reveal>
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-xl font-semibold text-foreground">Phemelo Moloi</p>
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Phemelo Moloi. All rights reserved.
        </p>

        <button 
          onClick={scrollToTop} 
          className="terminal-command flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
          aria-label="Scroll to top"
        >
          <span className="terminal-prompt">$</span>
          <span className="terminal-cmd">clear</span>
          <span className="terminal-args"> && cd ~</span>
          <ArrowUp size={16} className="ml-2" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;