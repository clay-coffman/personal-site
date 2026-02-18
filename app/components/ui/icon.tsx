import { cn } from "~/lib/utils";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
}

export function Icon({ name, size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={cn("inline-block shrink-0", className)}
      aria-hidden="true"
      {...props}
    >
      <use href={`/sprite.svg#${name}`} />
    </svg>
  );
}
