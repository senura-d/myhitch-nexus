"use client";

import * as React from "react";
import { assetPath, cn, hashString } from "@/lib/utils";

/**
 * All artwork in this build is generated, not fetched — see §12. A poster is a
 * deterministic gradient plus a low-contrast geometric motif derived from the
 * title, so every card looks distinct without a single network request.
 */
export interface PosterProps {
  gradient: [string, string];
  seed: string;
  className?: string;
  ratio?: "video" | "poster" | "square" | "banner" | "none";
  children?: React.ReactNode;
  overlayClassName?: string;
  src?: string;
  alt?: string;
  imgClassName?: string;
}

export function Poster({
  gradient,
  seed,
  className,
  ratio = "video",
  children,
  overlayClassName,
  src,
  alt = "",
  imgClassName,
}: PosterProps) {
  const [imageError, setImageError] = React.useState(false);
  const hash = hashString(seed);
  const angle = 100 + (hash % 80);
  const motif = hash % 4;
  const cx = 20 + (hash % 60);
  const cy = 20 + ((hash >> 3) % 60);

  const ratioClass = {
    video: "aspect-video",
    poster: "aspect-[2/3]",
    square: "aspect-square",
    banner: "aspect-[4/1]",
    none: "",
  }[ratio];

  const hasValidImage = Boolean(src) && !imageError;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-2",
        ratioClass,
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(${angle}deg, ${gradient[0]}, ${gradient[1]})`,
      }}
    >
      {hasValidImage ? (
        <img
          src={assetPath(src!)}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setImageError(true)}
          className={cn(
            "absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105",
            imgClassName,
          )}
        />
      ) : (
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          className={cn("absolute inset-0 size-full opacity-[0.16]", overlayClassName)}
        >
          {motif === 0 ? (
            <>
              <circle cx={cx} cy={cy} r="34" fill="none" stroke="white" strokeWidth="0.6" />
              <circle cx={cx} cy={cy} r="22" fill="none" stroke="white" strokeWidth="0.6" />
              <circle cx={cx} cy={cy} r="10" fill="none" stroke="white" strokeWidth="0.6" />
            </>
          ) : null}
          {motif === 1 ? (
            <g stroke="white" strokeWidth="0.5">
              {Array.from({ length: 9 }, (_, index) => (
                <line
                  key={index}
                  x1={index * 12 - 20}
                  y1="-10"
                  x2={index * 12 + 30}
                  y2="110"
                />
              ))}
            </g>
          ) : null}
          {motif === 2 ? (
            <g fill="none" stroke="white" strokeWidth="0.55">
              {Array.from({ length: 5 }, (_, index) => (
                <rect
                  key={index}
                  x={10 + index * 6}
                  y={10 + index * 6}
                  width={80 - index * 12}
                  height={80 - index * 12}
                />
              ))}
            </g>
          ) : null}
          {motif === 3 ? (
            <g stroke="white" strokeWidth="0.5" fill="none">
              <path d={`M0 ${cy} Q 25 ${cy - 26} 50 ${cy} T 100 ${cy}`} />
              <path d={`M0 ${cy + 14} Q 25 ${cy - 12} 50 ${cy + 14} T 100 ${cy + 14}`} />
              <path d={`M0 ${cy + 28} Q 25 ${cy + 2} 50 ${cy + 28} T 100 ${cy + 28}`} />
              <path d={`M0 ${cy - 14} Q 25 ${cy - 40} 50 ${cy - 14} T 100 ${cy - 14}`} />
            </g>
          ) : null}
        </svg>
      )}
      {children}
    </div>
  );
}
