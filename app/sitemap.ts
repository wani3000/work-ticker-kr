import type { MetadataRoute } from "next";
import { guides } from "./guides/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://work-ticker-kr.wani3000.chatgpt.site";
  const routes = ["", "/settings", "/guides", "/calculation", "/faq", "/about", "/privacy", "/terms", "/contact", "/sources"];
  return [
    ...routes.map((route) => ({ url: `${base}${route}`, lastModified: new Date("2026-07-21"), changeFrequency: route === "" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : route === "/settings" ? 0.9 : 0.7 })),
    ...guides.map((guide) => ({ url: `${base}/guides/${guide.slug}`, lastModified: new Date(guide.updated), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
