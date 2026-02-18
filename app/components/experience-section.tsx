import { cn } from "~/lib/utils";
import { SectionHeader } from "./section-header";
import { Icon } from "~/components/ui/icon";
import type { Experience } from "~/data/profile";

export function ExperienceSection({
  experiences,
}: {
  experiences: Experience[];
}) {
  return (
    <section id="experience" className="scroll-mt-8 border-t border-background-alt py-16 max-md:py-12">
      <SectionHeader>Experience</SectionHeader>
      <div className="flex flex-col gap-8">
        {experiences.map((exp, i) => (
          <div
            key={`${exp.company}-${i}`}
            className={cn(
              "pb-6",
              i === 0 &&
                "rounded-lg border-l-4 border-accent bg-background-alt p-6"
            )}
          >
            <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2 max-[480px]:flex-col max-[480px]:gap-1">
              <h3 className="text-h3 m-0 text-foreground">
                {exp.url ? (
                  <a
                    href={exp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-accent"
                  >
                    {exp.company}{" "}
                    <Icon name="external-link" size={12} className="opacity-50" />
                  </a>
                ) : (
                  exp.company
                )}
              </h3>
              {exp.period && (
                <span className="text-body-xs italic text-muted">
                  {exp.period}
                </span>
              )}
            </div>
            {exp.role && (
              <p className="my-1 text-body font-bold text-muted">{exp.role}</p>
            )}
            <p className="mt-2 leading-[1.5] text-foreground">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
