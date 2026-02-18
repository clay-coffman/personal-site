import { cn } from "~/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "no-underline-anim inline-flex items-center justify-center rounded-md font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-accent text-white hover:bg-accent-dark": variant === "primary",
          "border border-border bg-background text-foreground hover:bg-background-alt":
            variant === "secondary",
          "bg-red-600 text-white hover:bg-red-700": variant === "danger",
          "text-foreground hover:bg-background-alt": variant === "ghost",
        },
        {
          "px-2.5 py-1.5 text-body-2xs": size === "sm",
          "px-4 py-2 text-body-sm": size === "md",
          "px-6 py-3 text-body": size === "lg",
        },
        className
      )}
      {...props}
    />
  );
}
