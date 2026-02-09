"use client";

import dynamic from "next/dynamic";

/**
 * Client-side wrapper for lazy-loading SmoothScroll.
 * This enables the landing page to remain a Server Component
 * while still lazy-loading lenis+GSAP (~60KB) only when needed.
 */
const SmoothScrollInner = dynamic(
  () => import("@/lib/lenis").then((mod) => mod.SmoothScroll),
  { ssr: false },
);

export function LazySmoothScroll() {
  return <SmoothScrollInner />;
}
