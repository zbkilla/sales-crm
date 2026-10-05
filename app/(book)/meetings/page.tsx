import type { Metadata } from "next";
import Meetings from "@/components/meetings/meetings";
import { SITE_NAME, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Meetings | ${SITE_NAME}`,
  description:
    "Upcoming client and prospect meetings with prep briefs, and past meetings with AI summaries.",
  path: "/meetings",
});

export default function MeetingsPage() {
  return <Meetings />;
}
