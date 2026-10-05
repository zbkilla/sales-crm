import type { Metadata } from "next";
import Reviews from "@/components/reviews/reviews";
import { SITE_NAME, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Reviews | ${SITE_NAME}`,
  description:
    "Upcoming client reviews and touchpoint tracking by tier, cadence and advisor.",
  path: "/reviews",
});

export default function ReviewsPage() {
  return <Reviews />;
}
