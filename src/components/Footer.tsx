
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
    <footer className="bg-gray-900 text-white py-12">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <span className="font-bold text-xl">Phemelo Moloi</span>
            <p className="text-gray-400 mt-2">Computer Science and Software Engineering Student</p>
          </div>

          <div className="mt-6 md:mt-0">
            <div className="flex space-x-4">
              <a 
                href="https://github.com/WyvernPirate" 
                target="_blank" 
                rel="https://github.com/WyvernPirate" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://linkedin.com/phemelo-moloi-12aa41303" 
                target="_blank" 
                rel="https://www.linkedin.com/in/phemelo-moloi-12aa41303" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Phemelo Moloi. All rights reserved.
          </p>

          <div className="mt-4 md:mt-0">
            <button 
              onClick={scrollToTop} 
              className="flex items-center text-gray-400 hover:text-white transition-colors"
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