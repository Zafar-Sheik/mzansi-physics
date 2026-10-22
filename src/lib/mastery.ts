/**
 * Weak-spot targeting: a mastery score per topic from everything a learner
 * has done – lesson quizzes, self-marked exam questions, mock papers and
 * drills – and a short list of what to work on next.
 */
import type { Grade, Topic } from "@/content/types";

export interface MasteryTopic {
  topic: Topic;
  grade: Grade;
  title: string;
  emoji: string;
  colour: string;
  slug: string;
  lessons: { slug: string; title: string }[];
  generators: string[];
  examQuestions: number;
}

/** Built from the content at build time (see masteryIndex in src/content). */
export interface MasteryIndex {
  topics: MasteryTopic[];
  /** quiz block id → topic */
  quizTopic: Record<string, Topic>;
  /** exam question id (Exam Room) or exam block id (lessons) → topic */
  examTopic: Record<string, Topic>;
}

/** The parts of the learner's progress that mastery reads. */
export interface MasteryInput {
  completedLessons: Record<string, unknown>;
  quizzes: Record<string, { correct: number; total: number }>;
  exams?: Record<string, { score: number; total: number }>;
  mocks?: Record<string, { byTopic: Record<string, [number, number]> }[]>;
  drills?: Record<string, { right: number; tried: number }>;
}

export type MasteryStatus = "strong" | "shaky" | "weak" | "untested";

export interface TopicMastery extends MasteryTopic {
  earned: number;
  possible: number;
  /** null until there is enough evidence */
  pct: number | null;
  status: MasteryStatus;
  lessonsDone: number;
  nextLesson: { slug: string; title: string };
}

/** Below this many marks of evidence a topic counts as untested. */
export const MIN_EVIDENCE = 4;

/** Exam Room parts are stored as `${questionId}-${part}`; lesson exam blocks by their own id. */
export function examTopicOf(id: string, examTopic: Record<string, Topic>): Topic | undefined {
  return examTopic[id] ?? examTopic[id.replace(/-\d+$/, "")];
}

export function computeMastery(p: MasteryInput, idx: MasteryIndex): TopicMastery[] {
  const tally = new Map<Topic, { earned: number; possible: number }>();
  const add = (t: Topic | undefined, earned: number, possible: number) => {
    if (!t || possible <= 0) return;
    const v = tally.get(t) ?? { earned: 0, possible: 0 };
    v.earned += Math.max(0, Math.min(earned, possible));
    v.possible += possible;
    tally.set(t, v);
  };
  for (const [id, q] of Object.entries(p.quizzes ?? {})) add(idx.quizTopic[id], q.correct, q.total);
  for (const [id, e] of Object.entries(p.exams ?? {})) add(examTopicOf(id, idx.examTopic), e.score, e.total);
  // Only the latest attempt of each mock paper counts, so improvement shows.
  for (const attempts of Object.values(p.mocks ?? {})) {
    const last = attempts.at(-1);
    if (last) for (const [t, [s, tot]] of Object.entries(last.byTopic)) add(t as Topic, s, tot);
  }
  for (const [t, d] of Object.entries(p.drills ?? {})) add(t as Topic, d.right, d.tried);

  return idx.topics.map((t) => {
    const v = tally.get(t.topic) ?? { earned: 0, possible: 0 };
    const pct = v.possible >= MIN_EVIDENCE ? Math.round((v.earned / v.possible) * 100) : null;
    const status: MasteryStatus = pct === null ? "untested" : pct >= 70 ? "strong" : pct >= 50 ? "shaky" : "weak";
    const lessonsDone = t.lessons.filter((l) => p.completedLessons[l.slug]).length;
    const nextLesson = t.lessons.find((l) => !p.completedLessons[l.slug]) ?? t.lessons[0];
    return { ...t, ...v, pct, status, lessonsDone, nextLesson };
  });
}

/**
 * What to work on next: weak topics (lowest first), then shaky ones, then
 * topics with no evidence yet (started ones first). Optionally one grade only.
 */
export function recommendations(m: TopicMastery[], opts: { grade?: Grade; limit?: number } = {}): TopicMastery[] {
  const rank: Record<MasteryStatus, number> = { weak: 0, shaky: 1, untested: 2, strong: 3 };
  return m
    .filter((t) => (!opts.grade || t.grade === opts.grade) && t.status !== "strong")
    .map((t, i) => ({ t, i }))
    .sort((a, b) => rank[a.t.status] - rank[b.t.status] || (a.t.pct ?? 101) - (b.t.pct ?? 101) || b.t.lessonsDone - a.t.lessonsDone || a.i - b.i)
    .slice(0, opts.limit ?? 3)
    .map((x) => x.t);
}
