
"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Kivnexo Service Worker registered:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error(
            "Kivnexo Service Worker registration failed:",
            error
          );
        });
    }
  }, []);

  return null;
}
