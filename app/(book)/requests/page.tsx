import type { Metadata } from "next";
import ServiceRequests from "@/components/service-requests/service-requests";
import { SITE_NAME, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Service requests | ${SITE_NAME}`,
  description:
    "Standardized service request workflows: account opening, money movement, ACATs, rollovers, beneficiary updates and more, with checklists, SLAs and NIGO tracking.",
  path: "/requests",
});

export default function ServiceRequestsPage() {
  return <ServiceRequests />;
}
