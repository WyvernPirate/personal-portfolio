import React from "react";
import TerminalCommand from "@/components/TerminalCommand";

const TYPE_TARGET =
  "Final-year software engineering student building reliable web systems, ML-assisted workflows, and production-focused tools.";

const Hero = () => {
  const [typedText, setTypedText] = React.useState("");

  React.useEffect(() => {
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setTypedText(TYPE_TARGET.slice(0, index));
      if (index >= TYPE_TARGET.length) {
        window.clearInterval(interval);
      }
    }, 22);

    return () => window.clearInterval(interval);
  }, []);

  const floatVars = React.useMemo(
    () => ({
      "--float-duration": `${3.6 + Math.random() * 2.4}s`,
      "--float-delay": `${Math.random() * 0.9}s`,
      "--float-x": `${4 + Math.random() * 9}px`,
      "--float-y": `${-7 - Math.random() * 13}px`,
      "--float-rotate": `${(Math.random() * 2.4).toFixed(1)}deg`,
    }),
    []
  ) as React.CSSProperties;

  return (
    <section className="px-5 pb-8 pt-4 md:px-8 md:pb-10">
      <div>
        <div className="mt-1 max-w-4xl text-sm leading-7 text-foreground">
          {typedText}
          <span className="typing-caret" />
        </div>

        <div className="mt-4 overflow-x-auto pb-2">
          <div className="flex min-w-[760px] flex-nowrap items-start gap-6">
            <div className="w-[300px] shrink-0 font-mono text-[8px] leading-[1] text-primary/80 select-none">
              <pre>
{`
 __      ____     ____   _ ______ _____  _   _ 
 \ \    / /\ \   / / \ | |  ____|  __ \| \ | |
  \ \  / /  \ \_/ /|  \| | |__  | |__) |  \| |
   \ \/ /    \   / | . \` |  __| |  _  /| . \` |
    \  /      | |  | |\  | |____| | \ \| |\  |
     \/       |_|  |_| \_|______|_|  \_|_| \_|
`}
              </pre>
              <div className="mt-4 random-float rounded-none border border-primary/45 bg-background/40 p-2" style={floatVars}>
                <img
                  src="/profile_pic.jpg"
                  alt="Phemelo Moloi"
                  className="h-[180px] w-full border border-border/70 object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <p className="mt-2 text-center font-mono text-[10px] text-muted-foreground">ID: wyvern@arch_v2</p>
            </div>

            <div className="min-w-[520px] flex-1 pt-1">
              <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-x-4 gap-y-1.5 font-mono text-sm leading-7 text-foreground">
                <span className="text-primary">User</span>
                <span>phemelo@portfolio</span>
                <span className="text-primary">Role</span>
                <span>Software Engineering Student</span>
                <span className="text-primary">Focus</span>
                <span>Full-stack web development + ML systems</span>
                <span className="text-primary">Stack</span>
                <span>TypeScript, React, Node.js, Python, Firebase</span>
                <span className="text-primary">Status</span>
                <span>Open to internships and collaborations</span>
                <span className="text-primary">Location</span>
                <span>Palapye, Botswana</span>
              </div>

              <div className="mt-6 space-y-1">
                <a href="#projects" className="terminal-command block transition-colors hover:text-cyan-200">
                  <span className="terminal-prompt">$</span>
                  <span className="terminal-cmd">cd</span>
                  <span className="terminal-args"> ~/portfolio/projects</span>
                </a>
                <a href="#contact" className="terminal-command block transition-colors hover:text-cyan-200">
                  <span className="terminal-prompt">$</span>
                  <span className="terminal-cmd">mail</span>
                  <span className="terminal-args"> phemelo@portfolio.dev</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
