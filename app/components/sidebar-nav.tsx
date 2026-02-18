import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";

interface SidebarNavProps {
  activeSection?: string;
}

export function SidebarNav({ activeSection }: SidebarNavProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isBooks = location.pathname === "/books";

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[var(--sidebar-width)] items-center px-6 py-8 md:flex">
      <nav className="flex flex-col gap-4">
        <Link
          to="/"
          className={cn(
            "no-underline-anim text-nav text-muted transition-colors hover:text-accent",
            isHome && "text-accent"
          )}
        >
          Home
        </Link>
        <div
          className={cn(
            "flex flex-col gap-2 overflow-hidden pl-4 transition-all duration-300",
            isHome ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
          )}
          style={{ marginTop: isHome ? "-0.5rem" : 0 }}
        >
          {["experience", "projects", "skills", "education"].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className={cn(
                "no-underline-anim text-body-sm text-muted/70 transition-colors hover:text-accent hover:opacity-100",
                activeSection === section && "text-accent opacity-100"
              )}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </a>
          ))}
        </div>
        <Link
          to="/books"
          className={cn(
            "no-underline-anim text-nav text-muted transition-colors hover:text-accent",
            isBooks && "text-accent"
          )}
        >
          Books
        </Link>
      </nav>
    </aside>
  );
}
