import { useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Icon } from "~/components/ui/icon";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const open = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
  }, []);

  // Close on route change
  useEffect(() => {
    close();
  }, [location.pathname, close]);

  return (
    <>
      {/* Hamburger button */}
      <nav className="fixed right-0 top-0 z-[100] p-4 md:hidden">
        <button
          onClick={open}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border-none bg-transparent p-2"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span className="block h-0.5 w-6 bg-foreground transition-all" />
          <span className="block h-0.5 w-6 bg-foreground transition-all" />
        </button>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[998] bg-black/50 transition-all duration-300 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={close}
      />

      {/* Slide menu */}
      <div
        className={`fixed right-0 top-0 z-[999] h-screen w-[300px] bg-background shadow-[-4px_0_20px_rgba(0,0,0,0.1)] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={close}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center border-none bg-transparent text-3xl text-foreground hover:text-accent"
          aria-label="Close menu"
        >
          &times;
        </button>

        <ul className="list-none px-10 pt-20">
          {[
            { to: "/", label: "Home" },
            { to: "/#experience", label: "Experience" },
            { to: "/#projects", label: "Projects" },
            { to: "/#skills", label: "Skills" },
            { to: "/#education", label: "Education" },
            { to: "/books", label: "Books" },
          ].map(({ to, label }) => (
            <li key={to} className="mb-6">
              <Link
                to={to}
                onClick={close}
                className="no-underline-anim text-nav-mobile text-foreground transition-colors hover:text-accent"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
