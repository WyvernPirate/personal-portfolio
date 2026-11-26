import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type WindowProps = {
  /** Hyprland-style class and title, e.g. kitty / fastfetch */
  app: string;
  title?: string;
  primary?: boolean;
  index?: number;
  as?: ElementType;
  className?: string;
  labelledBy?: string;
  children: ReactNode;
};

export default function Window({
  app,
  title,
  primary,
  index = 0,
  as: Tag = "div",
  className,
  labelledBy,
  children,
}: WindowProps) {
  return (
    <Tag
      className={cn("win", className)}
      data-primary={primary ? "true" : undefined}
      aria-labelledby={labelledBy}
      style={{ "--i": index } as CSSProperties}
    >
      <p className="win-id" aria-hidden="true">
        <b>{app}</b>
        {title ? ` ${title}` : ""}
      </p>
      {children}
    </Tag>
  );
}
