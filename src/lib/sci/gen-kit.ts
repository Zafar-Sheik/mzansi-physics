/** Shared helpers for the seeded problem generators. */
import type { PracticeProblem, Topic } from "@/content/types";

export type Rng = () => number;
export const int = (r: Rng, lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1));
/** A random value lo..hi in steps of `step` (e.g. 0.5 or 0.1). */
export const step = (r: Rng, lo: number, hi: number, s: number) => Math.round((lo + Math.floor(r() * (Math.round((hi - lo) / s) + 1)) * s) * 1e6) / 1e6;
export const pick = <T,>(r: Rng, arr: readonly T[]): T => arr[Math.floor(r() * arr.length)];

export interface Generator {
  id: string;
  title: string;
  topic: Topic;
  /** Quick enough for the Speed Solve game. */
  speed?: boolean;
  make: (seed: number | string) => PracticeProblem;
}
