/**
 * Mock exam papers, assembled from the Exam Room questions. A full mock is
 * every question for one grade and paper; a quick mock is a seeded mix of
 * about 50 marks that touches as many topics as possible.
 */
import type { ExamQuestion, Grade, Paper, Topic } from "@/content/types";
import { TOPICS, topicMeta } from "./topics";
import { seededRandom } from "./utils";

/** Grade 11 and 12 papers are 150 marks in 3 hours (1,2 minutes per mark); Grade 10 papers are 150 marks in 2 hours. */
export const minutesPerMark = (grade: Grade) => (grade === 10 ? 0.8 : 1.2);
export const QUICK_TARGET = 50;
export const MOCK_IDS = ["g10-p1", "g10-p2", "g11-p1", "g11-p2", "g12-p1", "g12-p2"] as const;

/** Grade 12 Paper 1 also examines Newton's laws and electrostatics (taught in Grade 11). */
const ALSO_EXAMINED: Partial<Record<MockId, Topic[]>> = { "g12-p1": ["g11-newton", "g11-electrostatics"] };
export type MockId = (typeof MOCK_IDS)[number];

export interface MockPaper {
  id: MockId;
  grade: Grade;
  paper: Paper;
  title: string;
  quick: boolean;
  seed?: number;
  questions: ExamQuestion[];
  marks: number;
  minutes: number;
}

export const questionMarks = (q: ExamQuestion) => q.parts.reduce((s, p) => s + p.marks, 0);
export const partId = (q: ExamQuestion, k: number) => `${q.id}-${k}`;

export function parseMockId(id: string): { grade: Grade; paper: Paper } | null {
  const m = /^g(10|11|12)-p([12])$/.exec(id);
  return m ? { grade: Number(m[1]) as Grade, paper: Number(m[2]) as Paper } : null;
}

export function mockTitle(id: MockId, quick = false) {
  const { grade, paper } = parseMockId(id)!;
  return `Grade ${grade} Paper ${paper} (${paper === 1 ? "Physics" : "Chemistry"})${quick ? " – quick mock" : " – full mock"}`;
}

const topicOrder = (t: Topic) => TOPICS.findIndex((x) => x.topic === t);

/** Questions for a grade and paper, in CAPS topic order. */
export function paperQuestions(all: ExamQuestion[], id: MockId): ExamQuestion[] {
  const { grade, paper } = parseMockId(id)!;
  return all
    .filter((q) => (topicMeta(q.topic).grade === grade && topicMeta(q.topic).paper === paper) || (ALSO_EXAMINED[id]?.includes(q.topic) ?? false))
    .map((q, i) => ({ q, i }))
    .sort((a, b) => topicOrder(a.q.topic) - topicOrder(b.q.topic) || a.i - b.i)
    .map((x) => x.q);
}

export function buildMock(all: ExamQuestion[], id: MockId, opts: { quick?: boolean; seed?: number } = {}): MockPaper {
  const { grade, paper } = parseMockId(id)!;
  const pool = paperQuestions(all, id);
  let questions = pool;
  if (opts.quick) {
    const r = seededRandom(`${id}-${opts.seed ?? 0}`);
    const byTopic = new Map<Topic, ExamQuestion[]>();
    for (const q of pool) byTopic.set(q.topic, [...(byTopic.get(q.topic) ?? []), q]);
    // Shuffle within each topic, then deal one question per topic in a shuffled topic order.
    const decks = [...byTopic.values()].map((qs) => [...qs].sort(() => r() - 0.5));
    decks.sort(() => r() - 0.5);
    const picked: ExamQuestion[] = [];
    let marks = 0;
    for (let round = 0; marks < QUICK_TARGET && decks.some((d) => d.length > round); round++) {
      for (const d of decks) {
        if (marks >= QUICK_TARGET) break;
        const q = d[round];
        if (!q) continue;
        picked.push(q);
        marks += questionMarks(q);
      }
    }
    questions = pool.filter((q) => picked.includes(q));
  }
  const marks = questions.reduce((s, q) => s + questionMarks(q), 0);
  return { id, grade, paper, title: mockTitle(id, opts.quick), quick: Boolean(opts.quick), seed: opts.quick ? opts.seed ?? 0 : undefined, questions, marks, minutes: Math.round(marks * minutesPerMark(grade)) };
}

/** NSC achievement levels (rating codes 1–7). */
export const ACHIEVEMENT = [
  { min: 80, level: 7, label: "Outstanding achievement" },
  { min: 70, level: 6, label: "Meritorious achievement" },
  { min: 60, level: 5, label: "Substantial achievement" },
  { min: 50, level: 4, label: "Adequate achievement" },
  { min: 40, level: 3, label: "Moderate achievement" },
  { min: 30, level: 2, label: "Elementary achievement" },
  { min: 0, level: 1, label: "Not achieved" },
] as const;

export function achievement(pct: number) {
  return ACHIEVEMENT.find((a) => pct >= a.min) ?? ACHIEVEMENT[ACHIEVEMENT.length - 1];
}

/** Score per topic from the marks awarded to each part (keyed by partId). */
export function topicBreakdown(questions: ExamQuestion[], scores: Record<string, number>): { topic: Topic; score: number; total: number }[] {
  const out = new Map<Topic, { score: number; total: number }>();
  for (const q of questions) {
    const t = out.get(q.topic) ?? { score: 0, total: 0 };
    q.parts.forEach((p, k) => {
      t.score += Math.min(p.marks, scores[partId(q, k)] ?? 0);
      t.total += p.marks;
    });
    out.set(q.topic, t);
  }
  return [...out.entries()].map(([topic, v]) => ({ topic, ...v }));
}
