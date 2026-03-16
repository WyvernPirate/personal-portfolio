import React, { useState, useRef, useEffect } from "react";

const PortalCLI = () => {
  const [history, setHistory] = useState<string[]>([
    "Welcome to Portal OS v2.4.0 (tty7)",
    "Type 'help' to see available commands.",
    ""
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, `wyvern@arch:~$ ${input}`];

    switch (cmd) {
      case "help":
        newHistory.push("Available commands: help, whoami, matrix, sudo, clear, projects, contact");
        break;
      case "whoami":
        newHistory.push("user: Phemelo Moloi | role: fullstack_engineer | status: listening");
        break;
      case "matrix":
        newHistory.push("System: Access Denied. Follow the white rabbit.");
        break;
      case "sudo":
        newHistory.push("user is not in the sudoers file. This incident will be reported.");
        break;
      case "clear":
        setHistory(["tty7 reset.", ""]);
        setInput("");
        return;
      case "projects":
        newHistory.push("Redirecting to #projects...");
        window.location.hash = "projects";
        break;
      case "contact":
        newHistory.push("Redirecting to #contact...");
        window.location.hash = "contact";
        break;
      case "antigravity":
        newHistory.push("Initiating antigravity module... [OK]");
        document.body.classList.toggle("antigravity-mode");
        break;
      default:
        newHistory.push(`bash: ${cmd}: command not found`);
    }

    setHistory(newHistory);
    setInput("");
  };

  return (
    <div className="mt-8 px-5 md:px-8 font-mono text-[11px] text-primary/90 leading-relaxed">
      <div 
        ref={scrollRef}
        className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20"
      >
        {history.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <form onSubmit={handleCommand} className="flex items-center gap-2 mt-1">
          <span className="terminal-prompt">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-primary"
            autoFocus
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
};

export default PortalCLI;
