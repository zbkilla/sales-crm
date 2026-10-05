import type { Metadata } from "next";

export const SITE_NAME = "RIA AgentOS";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
export const SITE_DESCRIPTION =
  "Household CRM for registered investment advisors: AUM, reviews, touchpoints and prospect pipeline in one book.";
export const DEFAULT_OG_IMAGE = "/opengraph-image.jpg";

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export type SiteRoute = {
  path: string;
  title: string;
  description: string;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

export const SITE_ROUTES: SiteRoute[] = [
  {
    path: "/",
    title: "Households",
    description: SITE_DESCRIPTION,
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/reviews",
    title: "Reviews",
    description:
      "Upcoming client reviews and touchpoint tracking by tier, cadence and advisor.",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/opportunities",
    title: "Opportunities",
    description:
      "Prospect pipeline and client growth opportunities with weighted forecasts by stage.",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/tasks",
    title: "Tasks",
    description:
      "Tasks for the advisor team, grouped by due date with priorities and linked households.",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    path: "/requests",
    title: "Service requests",
    description:
      "Standardized service request workflows with checklists, SLAs and NIGO tracking.",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    path: "/meetings",
    title: "Meetings",
    description:
      "Upcoming client and prospect meetings with prep briefs, and past meetings with AI summaries.",
    changeFrequency: "weekly",
    priority: 0.7,
  },
];

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      locale: "en",
      type: "website",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: absoluteUrl(image) }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(image)],
    },
  };
}
