export function Footer() {
  return (
    <footer className="border-t border-background-alt py-8 text-center md:ml-[var(--sidebar-width)]">
      <p className="mb-0 text-body-2xs text-muted">
        &copy; {new Date().getFullYear()} Clay Coffman
      </p>
    </footer>
  );
}
