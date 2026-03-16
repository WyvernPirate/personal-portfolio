import { cn } from "@/lib/utils";

type TerminalCommandProps = {
  command: string;
  className?: string;
};

const TerminalCommand = ({ command, className }: TerminalCommandProps) => {
  const [bin = "", ...args] = command.trim().split(/\s+/);
  const argString = args.join(" ");

  return (
    <p className={cn("terminal-command", className)}>
      <span className="terminal-prompt">$</span>
      <span className="terminal-cmd">{bin}</span>
      {argString && <span className="terminal-args"> {argString}</span>}
    </p>
  );
};

export default TerminalCommand;
