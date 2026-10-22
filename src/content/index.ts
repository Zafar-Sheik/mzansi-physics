import { G10_PHYSICS } from "./lessons/g10-physics";
import { G10_CHEMISTRY } from "./lessons/g10-chemistry";
import { G11_PHYSICS } from "./lessons/g11-physics";
import { G11_CHEMISTRY } from "./lessons/g11-chemistry";
import { G12_PHYSICS } from "./lessons/g12-physics";
import { G12_CHEMISTRY } from "./lessons/g12-chemistry";
import { EXAM_QUESTIONS } from "./exam";
import type { Lesson, QuizQuestion, Term, Topic } from "./types";
import { TOPICS } from "@/lib/topics";
import { GENERATORS } from "@/lib/sci/generators";
import type { MasteryIndex } from "@/lib/mastery";

const TOPIC_ORDER = TOPICS.map((t) => t.topic);

/** Every lesson, in teaching order (Grade 10, 11, 12; Physics then Chemistry within a grade). */
export const LESSONS: Lesson[] = [...G10_PHYSICS, ...G10_CHEMISTRY, ...G11_PHYSICS, ...G11_CHEMISTRY, ...G12_PHYSICS, ...G12_CHEMISTRY].sort(
  (a, b) => TOPIC_ORDER.indexOf(a.topic) - TOPIC_ORDER.indexOf(b.topic) || a.order - b.order,
);

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function lessonsForTopic(t: Topic): Lesson[] {
  return LESSONS.filter((l) => l.topic === t);
}

/** Topics that have lessons. */
export const LIVE_TOPICS: Topic[] = TOPIC_ORDER.filter((t) => LESSONS.some((l) => l.topic === t));

export function neighbours(slug: string) {
  const i = LESSONS.findIndex((l) => l.slug === slug);
  return { prev: i > 0 ? LESSONS[i - 1] : undefined, next: i >= 0 && i < LESSONS.length - 1 ? LESSONS[i + 1] : undefined };
}

/** Topic → lesson slugs (used for topic badges). */
export const TOPIC_INDEX: Record<string, string[]> = Object.fromEntries(TOPIC_ORDER.map((t) => [t, lessonsForTopic(t).map((l) => l.slug)]));

export interface TermEntry extends Term {
  topic: Topic;
  lesson: { slug: string; title: string };
}

/** The glossary: every key concept and formula from every lesson (duplicates removed). */
export const GLOSSARY: TermEntry[] = (() => {
  const seen = new Set<string>();
  const out: TermEntry[] = [];
  for (const l of LESSONS) {
    for (const t of l.terms) {
      const k = `${l.topic}::${t.term.toLowerCase()}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ ...t, topic: l.topic, lesson: { slug: l.slug, title: l.title } });
    }
  }
  return out;
})();

export interface BankQuestion extends QuizQuestion {
  id: string;
  topic: Topic;
  lesson: { slug: string; title: string };
}

/** Every multiple-choice question from every lesson – the Quiz Arena draws from this. */
export const QUESTION_BANK: BankQuestion[] = LESSONS.flatMap((l) =>
  l.chunks.flatMap((c) =>
    c.blocks.flatMap((b) => (b.type === "quiz" ? b.questions.map((q, i) => ({ ...q, id: `${b.id}-${i}`, topic: l.topic, lesson: { slug: l.slug, title: l.title } })) : [])),
  ),
);

export { EXAM_QUESTIONS };
export type { Lesson, Topic } from "./types";

/** Everything the weak-spot coach needs to turn progress into per-topic mastery. */
export function masteryIndex(): MasteryIndex {
  const quizTopic: Record<string, Topic> = {};
  const examTopic: Record<string, Topic> = {};
  for (const l of LESSONS) for (const c of l.chunks) for (const b of c.blocks) {
    if (b.type === "quiz") quizTopic[b.id] = l.topic;
    if (b.type === "practice") quizTopic[`practice:${b.id}`] = l.topic;
    if (b.type === "exam") examTopic[b.question.id] = l.topic;
  }
  for (const q of EXAM_QUESTIONS) examTopic[q.id] = q.topic;
  const topics = TOPICS.filter((t) => LIVE_TOPICS.includes(t.topic)).map((t) => ({
    topic: t.topic, grade: t.grade, title: t.title, emoji: t.emoji, colour: t.colour, slug: t.slug,
    lessons: lessonsForTopic(t.topic).map((l) => ({ slug: l.slug, title: l.title })),
    generators: GENERATORS.filter((g) => g.topic === t.topic).map((g) => g.id),
    examQuestions: EXAM_QUESTIONS.filter((q) => q.topic === t.topic).length,
  }));
  return { topics, quizTopic, examTopic };
}
