import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             "Milán Kuckó – vendégház Miskolctapolcán",
    short_name:       "Milán Kuckó",
    description:      "Romantikus vendégház privát jacuzzival és kandallóval Miskolctapolcán.",
    lang:             "hu",
    start_url:        "/",
    display:          "standalone",
    theme_color:      "#1a3a2a",
    background_color: "#f5f0e8",
    icons: [
      { src: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
