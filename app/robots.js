export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /dashboard, /bseb, and /digitize no longer require login (the
        // "explore without signup" feature lets visitors browse and fill
        // these in freely, only requiring an account at the actual
        // Generate click) — so they're legitimate, crawlable pages now.
        // Only truly private/account-specific pages stay disallowed.
        disallow: ["/history", "/settings", "/account", "/upgrade"],
      },
    ],
    sitemap: "https://paperbanao.in/sitemap.xml",
  };
}
