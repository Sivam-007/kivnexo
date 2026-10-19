
"use client";

import { useEffect } from "react";

type OfferwallBannerProps = {
  size?: "300x250" | "468x60" | "728x90";
};

const bannerSizes = {
  "300x250": { width: 300, height: 250 },
  "468x60": { width: 468, height: 60 },
  "728x90": { width: 728, height: 90 },
};

export default function OfferwallBanner({
  size = "300x250",
}: OfferwallBannerProps) {
  useEffect(() => {
    const container = document.getElementById(
      `offerwall-banner-${size}`
    );

    if (!container || container.dataset.loaded === "true") return;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://offerwall.me/api/public/banner-code.js";
    script.dataset.placement = "ztH5264xFU6rJHD6NZEgyss0aGMwbX";
    script.dataset.size = size;
    script.dataset.frameOrigin = "https://offerwall.me";

    container.dataset.loaded = "true";
    container.appendChild(script);
  }, [size]);

  const dimensions = bannerSizes[size];

  return (
    <section className="my-8 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <p className="mb-3 text-xs text-gray-500">Sponsored</p>
      <div className="flex justify-center">
        <div
          id={`offerwall-banner-${size}`}
          className="flex max-w-full justify-center"
          style={{
            width: dimensions.width,
            minHeight: dimensions.height,
          }}
        />
      </div>
    </section>
  );
}
