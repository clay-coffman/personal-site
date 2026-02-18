import { cn } from "~/lib/utils";
import { forwardRef } from "react";

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "rounded-md border border-border bg-background px-3 py-2 text-body-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25",
        className
      )}
      {...props}
    />
  );
});

Select.displayName = "Select";
