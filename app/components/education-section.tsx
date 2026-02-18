import { SectionHeader } from "./section-header";
import type { Education } from "~/data/profile";

export function EducationSection({ education }: { education: Education[] }) {
  return (
    <section id="education" className="scroll-mt-8 border-t border-background-alt py-16 max-md:py-12">
      <SectionHeader>Education</SectionHeader>
      {education.map((edu, i) => (
        <div key={i} className="mb-6">
          <div className="flex flex-wrap items-baseline justify-between">
            <h3 className="text-h3-sm text-foreground">{edu.institution}</h3>
            {edu.year && (
              <span className="text-body-xs text-muted">{edu.year}</span>
            )}
          </div>
          <p className="mt-2 leading-[1.5] text-foreground">
            {edu.credential}
          </p>
        </div>
      ))}
    </section>
  );
}
