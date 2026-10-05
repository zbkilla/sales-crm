import type { Metadata } from "next";
import Opportunities from "@/components/opportunities/opportunities";
import { SITE_NAME, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Opportunities | ${SITE_NAME}`,
  description:
    "Prospect pipeline and client growth opportunities with weighted forecasts by stage.",
  path: "/opportunities",
});

export default function OpportunitiesPage() {
  return <Opportunities />;
}
