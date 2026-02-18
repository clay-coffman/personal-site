import { Icon } from "~/components/ui/icon";
import type { ProfileData } from "~/data/profile";

export function HeroSection({ profile }: { profile: ProfileData }) {
  return (
    <section id="hero" className="flex min-h-screen items-center py-16 max-md:min-h-[80vh] max-md:pt-[60px]">
      <div className="max-w-[600px]">
        <h1 className="text-h1 mb-8 text-foreground">
          <span className="block">Clay</span>
          <span className="block">Coffman</span>
        </h1>

        <p className="mb-8 text-body-sm text-muted">
          <Icon name="map-marker" size={14} className="mr-1" />
          {profile.location}
        </p>

        <div className="flex gap-6">
          <a
            href={`mailto:${profile.email}`}
            className="no-underline-anim text-foreground transition-all hover:-translate-y-0.5 hover:text-accent"
            aria-label="Send email"
          >
            <Icon name="envelope" size={20} />
          </a>
          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline-anim text-foreground transition-all hover:-translate-y-0.5 hover:text-accent"
            aria-label="LinkedIn"
          >
            <Icon name="linkedin" size={20} />
          </a>
          <a
            href={profile.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline-anim text-foreground transition-all hover:-translate-y-0.5 hover:text-accent"
            aria-label="GitHub"
          >
            <Icon name="github" size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
