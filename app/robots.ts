import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/products";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt"],
        disallow: ["/cx-ops-x7k9q2", "/account", "/api"],
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "PerplexityBot",
          "ClaudeBot",
          "Google-Extended",
          "Amazonbot",
          "Applebot-Extended",
        ],
        allow: ["/", "/llms.txt"],
        disallow: ["/cx-ops-x7k9q2", "/account", "/api"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

