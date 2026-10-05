import type { Metadata } from "next";
import Tasks from "@/components/tasks/tasks";
import { SITE_NAME, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Tasks | ${SITE_NAME}`,
  description:
    "Tasks for the advisor team, grouped by due date with priorities and linked households.",
  path: "/tasks",
});

export default function TasksPage() {
  return <Tasks />;
}
