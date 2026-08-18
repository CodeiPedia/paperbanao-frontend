export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/bseb", "/digitize", "/history", "/settings", "/account", "/upgrade"],
      },
    ],
    sitemap: "https://paperbanao.in/sitemap.xml",
  };
}
