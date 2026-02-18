import { SidebarNav } from "./sidebar-nav";
import { MobileNav } from "./mobile-nav";
import { Footer } from "./footer";

interface PageLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
}

export function PageLayout({ children, activeSection }: PageLayoutProps) {
  return (
    <>
      <MobileNav />
      <div className="flex min-h-screen">
        <SidebarNav activeSection={activeSection} />
        <div className="ml-0 max-w-full flex-1 px-5 md:ml-[var(--sidebar-width)] md:px-8 md:pr-12">
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}
