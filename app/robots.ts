import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://taskflow.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/boards/", "/tasks/", "/analytics/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
