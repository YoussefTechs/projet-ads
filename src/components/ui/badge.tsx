import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "brand" | "accent" | "muted" | "success" | "outline";

const variants: Record<Variant, string> = {
  default: "bg-ink-900 text-white dark:bg-ink-100 dark:text-ink-900",
  brand: "bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200",
  accent: "bg-accent-100 text-accent-700 dark:bg-accent-700/30 dark:text-accent-200",
  muted: "bg-muted text-muted-foreground",
  success: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  outline: "border border-border text-foreground",
};

export function Badge({
  variant = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
