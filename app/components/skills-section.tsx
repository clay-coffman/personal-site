import { SectionHeader } from "./section-header";
import { Icon } from "~/components/ui/icon";

export function SkillsSection({
  skills,
}: {
  skills: Record<string, string[]>;
}) {
  return (
    <section id="skills" className="scroll-mt-8 border-t border-background-alt py-16 max-md:py-12">
      <SectionHeader>Skills</SectionHeader>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
        {/* Dotfiles special item */}
        <div className="mb-4">
          <h4 className="text-skill-label mb-3 text-foreground">Dotfiles</h4>
          <a
            href="https://github.com/clay-coffman/dotfiles"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="terminal" size={14} className="mr-1" /> dotfiles
          </a>
        </div>

        {Object.entries(skills).map(([category, items]) => (
          <div key={category} className="mb-4">
            <h4 className="text-skill-label mb-3 text-foreground">
              {category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <span
                  key={skill}
                  className="inline-block rounded-full bg-background-alt px-3 py-1 text-body-2xs text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
