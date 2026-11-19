import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FitApp",
    short_name: "FitApp",
    description: "Seu aplicativo de saúde e alimentação.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f5f1",
    theme_color: "#35634f",
    icons: [
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}