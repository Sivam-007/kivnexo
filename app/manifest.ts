
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Kivnexo",
    short_name: "Kivnexo",
    description: "Kivnexo - Games, tasks and rewards platform.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0b0f",
    theme_color: "#0b0b0f",

    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],

    screenshots: [
      {
        src: "/screenshots/home.png",
        sizes: "941x1672",
        type: "image/png",
        form_factor: "narrow",
        label: "Kivnexo Home",
      },
      {
        src: "/screenshots/dashboard.png",
        sizes: "941x1672",
        type: "image/png",
        form_factor: "narrow",
        label: "Kivnexo Dashboard",
      },
      {
        src: "/screenshots/earn.png",
        sizes: "941x1672",
        type: "image/png",
        form_factor: "narrow",
        label: "Kivnexo Earn",
      },
      {
        src: "/screenshots/withdraw.png",
        sizes: "941x1671",
        type: "image/png",
        form_factor: "narrow",
        label: "Kivnexo Withdraw",
      },
    ],
  };
}
