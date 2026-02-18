import type { MetaFunction } from "react-router";
import { PageLayout } from "~/components/page-layout";
import { SectionHeader } from "~/components/section-header";

export const meta: MetaFunction = () => {
  return [{ title: "Clay Coffman - Projects" }];
};

export default function Projects() {
  return (
    <PageLayout>
      <div className="py-12">
        <SectionHeader>Projects</SectionHeader>
        <p className="text-muted">Under construction...</p>
      </div>
    </PageLayout>
  );
}
