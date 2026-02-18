import { cn } from "~/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent";
}

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-1 text-body-2xs",
        {
          "bg-background-alt text-foreground": variant === "default",
          "bg-accent/10 text-accent": variant === "accent",
        },
        className
      )}
      {...props}
    />
  );
}
