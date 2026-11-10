import { useSyncExternalStore } from "react";

/** User preference is authoritative for non-essential 3D motion, including
 * live OS-setting changes. Navigation, pointer targeting and safety UI remain
 * operational; continuous decorative loops can be paused without remounting. */
const QUERY = "(prefers-reduced-motion: reduce)";

function snapshot(): boolean {
  return typeof window !== "undefined" &&
    typeof window.matchMedia === "function" && window.matchMedia(QUERY).matches;
}

function subscribe(listener: () => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}
