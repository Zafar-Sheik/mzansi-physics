/**
 * Printable worksheets from the question generators. A worksheet is fully
 * described by its spec (topics, length, number), so the same link always
 * prints the same questions – handy for a class set and its memo.
 */
import type { PracticeProblem, Topic } from "@/content/types";
import type { Generator } from "./sci/gen-kit";
import { seededRandom } from "./utils";

export interface WorksheetSpec {
  topics: Topic[];
  count: number;
  /** Worksheet number – the seed. */
  number: number;
  memo: boolean;
  title: string;
}

export const MIN_QUESTIONS = 4;
export const MAX_QUESTIONS = 30;

export interface WorksheetItem {
  n: number;
  generator: string;
  title: string;
  topic: Topic;
  problem: PracticeProblem;
}

export function buildWorksheet(spec: Pick<WorksheetSpec, "topics" | "count" | "number">, generators: Generator[]): WorksheetItem[] {
  const pool = generators.filter((g) => spec.topics.includes(g.topic));
  if (!pool.length) return [];
  const r = seededRandom(`worksheet-${spec.number}-${spec.topics.join(",")}`);
  // Deal the generators in a shuffled order, round after round, so every skill appears before any repeats.
  const order = [...pool].sort(() => r() - 0.5);
  const count = Math.max(MIN_QUESTIONS, Math.min(MAX_QUESTIONS, spec.count));
  return Array.from({ length: count }, (_, i) => {
    const g = order[i % order.length];
    return { n: i + 1, generator: g.id, title: g.title, topic: g.topic, problem: g.make(`ws-${spec.number}-${i}-${g.id}`) };
  });
}

/** Read a spec from URL search params, with sensible defaults. */
export function parseSpec(params: URLSearchParams, validTopics: readonly Topic[]): WorksheetSpec {
  const topics = (params.get("t") ?? "").split(",").filter((t): t is Topic => (validTopics as readonly string[]).includes(t));
  const n = Number(params.get("n"));
  const w = Number(params.get("w"));
  return {
    topics,
    count: Number.isFinite(n) && n > 0 ? Math.max(MIN_QUESTIONS, Math.min(MAX_QUESTIONS, Math.round(n))) : 10,
    number: Number.isFinite(w) && w > 0 ? Math.round(w) : 1,
    memo: params.get("memo") !== "0",
    title: (params.get("title") ?? "").slice(0, 80),
  };
}

export function specToParams(s: WorksheetSpec): string {
  const p = new URLSearchParams();
  if (s.topics.length) p.set("t", s.topics.join(","));
  p.set("n", String(s.count));
  p.set("w", String(s.number));
  if (!s.memo) p.set("memo", "0");
  if (s.title) p.set("title", s.title);
  return p.toString();
}
