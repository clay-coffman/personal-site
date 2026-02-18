import { profileData } from "~/data/profile";
import { PageLayout } from "~/components/page-layout";
import { HeroSection } from "~/components/hero-section";
import { ExperienceSection } from "~/components/experience-section";
import { SkillsSection } from "~/components/skills-section";
import { ProjectsSection } from "~/components/projects-section";
import { EducationSection } from "~/components/education-section";
import { useActiveSection } from "~/hooks/use-active-section";

const SECTIONS = ["experience", "skills", "projects", "education"];

export default function Index() {
  const activeSection = useActiveSection(SECTIONS);

  return (
    <PageLayout activeSection={activeSection}>
      <HeroSection profile={profileData} />
      <ExperienceSection experiences={profileData.experiences} />
      <SkillsSection skills={profileData.skills} />
      <ProjectsSection projects={profileData.sideProjects} />
      <EducationSection education={profileData.education} />
    </PageLayout>
  );
}
