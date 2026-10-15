import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/editor",
          "/editor/",
          "/dashboard",
          "/dashboard/",
          "/login",
          "/login/",
          "/feedback",
          "/feedback/",
          "/bookmarks",
          "/bookmarks/",
        ],
      },
    ],
    sitemap: "https://bhvywrts.vercel.app/sitemap.xml",
  }
}
