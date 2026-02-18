import { SectionHeader } from "./section-header";
import { Icon } from "~/components/ui/icon";
import type { Project } from "~/data/profile";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="scroll-mt-8 border-t border-background-alt py-16 max-md:py-12">
      <SectionHeader>Projects</SectionHeader>
      {projects.map((project, i) => (
        <div key={i} className="mb-6">
          <h3 className="text-h3-sm text-foreground">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-accent"
            >
              {project.title}{" "}
              <Icon name="external-link" size={12} className="opacity-50" />
            </a>
            {project.language && (
              <span className="ml-3 inline-block rounded-full bg-background-alt px-2.5 py-0.5 align-middle text-body-sm text-muted">
                {project.language}
              </span>
            )}
          </h3>
          <p className="mt-2 leading-[1.5] text-foreground">
            {project.description}
          </p>
        </div>
      ))}
    </section>
  );
}
