/**
 * Problem generators: endless, fresh practice with a full worked solution.
 * Every generator is deterministic for a given seed, so tests can check that
 * each generated memo answer passes its own checker.
 */
import { CHEMISTRY_GENERATORS } from "./generators-chemistry";
import { PHYSICS_GENERATORS } from "./generators-physics";
import type { Generator } from "./gen-kit";

export type { Generator } from "./gen-kit";

export const GENERATORS: Generator[] = [...PHYSICS_GENERATORS, ...CHEMISTRY_GENERATORS];

export function getGenerator(id: string): Generator | undefined {
  return GENERATORS.find((g) => g.id === id);
}
