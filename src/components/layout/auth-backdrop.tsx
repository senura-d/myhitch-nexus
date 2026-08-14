"use client";

import * as React from "react";
import { assetPath } from "@/lib/utils";

export function AuthBackdrop() {
  const [imgSrc, setImgSrc] = React.useState<string>(() =>
    assetPath("/images/brand/auth-backdrop.png"),
  );
  const [loaded, setLoaded] = React.useState(false);
  const [errorCount, setErrorCount] = React.useState(0);

  React.useEffect(() => {
    // Client-side guarantee: check if running under subpath
    const resolved = assetPath("/images/brand/auth-backdrop.png");
    setImgSrc(resolved);
  }, []);

  const handleError = () => {
    if (errorCount === 0) {
      // Fallback 1: explicitly prepend repo base path
      setErrorCount(1);
      setImgSrc("/myhitch-nexus/images/brand/auth-backdrop.png");
    } else if (errorCount === 1) {
      // Fallback 2: relative path
      setErrorCount(2);
      setImgSrc("./images/brand/auth-backdrop.png");
    }
  };

  return (
    <>
      {/* Visual background ground */}
      <div className="absolute inset-0 bg-surface-2" />

      {/* Backdrop image */}
      <img
        src={imgSrc}
        alt="MYHitch Nexus Backdrop"
        aria-hidden
        onLoad={() => setLoaded(true)}
        onError={handleError}
        className={`absolute inset-0 size-full object-cover object-center transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-90"
        }`}
      />
    </>
  );
}
