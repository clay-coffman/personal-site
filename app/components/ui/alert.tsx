import { cn } from "~/lib/utils";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "error";
}

export function Alert({ variant = "info", className, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-md border px-4 py-3 text-body-sm",
        {
          "border-blue-300 bg-blue-50 text-blue-800": variant === "info",
          "border-green-300 bg-green-50 text-green-800": variant === "success",
          "border-red-300 bg-red-50 text-red-800": variant === "error",
        },
        className
      )}
      {...props}
    />
  );
}
