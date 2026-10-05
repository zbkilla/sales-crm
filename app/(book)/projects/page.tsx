import type { Metadata } from "next";
import Projects from "@/components/projects/projects";
import { SITE_NAME, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Projects | ${SITE_NAME}`,
  description:
    "Client service projects such as onboarding, money movement, RMDs and reviews, tracked by milestone.",
  path: "/projects",
});

export default function ProjectsPage() {
  return <Projects />;
}
