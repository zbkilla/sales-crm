import type { Metadata } from "next";
import HouseholdProfile from "@/components/household-profile/household-profile";
import { HOUSEHOLDS } from "@/data/households";
import { SITE_NAME, pageMetadata } from "@/lib/seo";

type HouseholdPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return HOUSEHOLDS.map((household) => ({ id: household.id }));
}

export async function generateMetadata({
  params,
}: HouseholdPageProps): Promise<Metadata> {
  const { id } = await params;
  const household = HOUSEHOLDS.find((item) => item.id === id);
  return pageMetadata({
    title: `${household?.name ?? "Household"} | ${SITE_NAME}`,
    description:
      "Household profile with balance sheet, accounts, protection, planning and activity.",
    path: `/households/${id}`,
  });
}

export default async function HouseholdPage({ params }: HouseholdPageProps) {
  const { id } = await params;
  return <HouseholdProfile id={id} />;
}
