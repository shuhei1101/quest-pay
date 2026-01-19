import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "お小遣いクエストボード",
    short_name: "クエストペイ",
    description: "子供のおこづかいをクエストで管理する",
    start_url: "/home",
    scope: "/",
    id: "/home",
    display: "standalone",
    orientation: "any",
    dir: "auto",
    lang: "ja",
    theme_color: "#E0F7FF",
    background_color: "#E0F7FF",
    icons: [
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "/icon512_maskable.png",
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "192x192",
        src: "/icon-192.png",
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "512x512",
        src: "/icon512_rounded.png",
        type: "image/png",
      },
    ],
  }
}
