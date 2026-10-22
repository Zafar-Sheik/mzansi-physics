/**
 * Content integrity tests: every lesson, quiz, practice problem, puzzle and exam
 * question must be well-formed – and every formula must render – so learners
 * never meet a broken activity.
 */
import { describe, expect, it } from "vitest";
import katex from "katex";
import { EXAM_QUESTIONS, GLOSSARY, LESSONS, LIVE_TOPICS, QUESTION_BANK, TOPIC_INDEX } from "@/content";
import { WIDGET_CATALOGUE } from "@/components/widgets/catalogue";
import { TOPICS } from "@/lib/topics";
import { BADGES, TOPIC_BADGES } from "@/lib/progress";
import { checkAnswer } from "@/lib/sci/check";
import { getGenerator } from "@/lib/sci/generators";
import type { Block } from "@/content/types";

const blocks = LESSONS.flatMap((l) => l.chunks.flatMap((c) => c.blocks.map((b) => ({ lesson: `${l.slug}/${c.id}`, b }))));
const of = <T extends Block["type"]>(t: T) => blocks.filter((x) => x.b.type === t) as { lesson: string; b: Extract<Block, { type: T }> }[];

/** Every string anywhere in the content, with where it came from. */
function allStrings(): { where: string; s: string }[] {
  const out: { where: string; s: string }[] = [];
  const walk = (v: unknown, where: string) => {
    if (typeof v === "string") out.push({ where, s: v });
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${where}[${i}]`));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (k !== "props" || where.includes("widget")) walk(x, `${where}.${k}`);
  };
  LESSONS.forEach((l) => walk(l, l.slug));
  EXAM_QUESTIONS.forEach((q) => walk(q, q.id));
  return out;
}

describe("curriculum structure", () => {
  it("has unique slugs and chunk ids, objectives, terms and short chunks", () => {
    expect(LESSONS.length).toBeGreaterThanOrEqual(45);
    expect(new Set(LESSONS.map((l) => l.slug)).size).toBe(LESSONS.length);
    for (const l of LESSONS) {
      expect(new Set(l.chunks.map((c) => c.id)).size, l.slug).toBe(l.chunks.length);
      expect(l.objectives.length, l.slug).toBeGreaterThan(0);
      expect(l.terms.length, `${l.slug} needs key terms`).toBeGreaterThanOrEqual(4);
      for (const c of l.chunks) expect(c.minutes, `${l.slug}/${c.id}`).toBeLessThanOrEqual(10);
    }
  });

  it("every CAPS topic has at least one lesson, in order", () => {
    expect(LIVE_TOPICS.length).toBe(TOPICS.length);
    for (const t of TOPICS) expect(TOPIC_INDEX[t.topic].length, t.topic).toBeGreaterThanOrEqual(1);
    for (const slugs of Object.values(TOPIC_INDEX)) {
      const orders = slugs.map((s) => LESSONS.find((l) => l.slug === s)!.order);
      expect(orders).toEqual([...orders].sort((a, b) => a - b));
    }
  });

  it("every topic has a badge", () => {
    for (const t of TOPICS) {
      expect(TOPIC_BADGES[t.topic], t.topic).toBeTruthy();
      expect(BADGES.some((b) => b.id === TOPIC_BADGES[t.topic])).toBe(true);
    }
  });

  it("every widget in a lesson or the toolkit exists in the catalogue of names", () => {
    const used = new Set([...of("widget").map((x) => x.b.widget), ...WIDGET_CATALOGUE.map((w) => w.name)]);
    for (const w of used) expect(typeof w).toBe("string");
    // Every simulation is reachable from the toolkit.
    const toolkit = new Set(WIDGET_CATALOGUE.map((w) => w.name));
    for (const w of of("widget").map((x) => x.b.widget)) expect(toolkit.has(w), w).toBe(true);
  });

  it("every lesson ends with a quiz", () => {
    for (const l of LESSONS) expect(l.chunks.at(-1)!.blocks.some((b) => b.type === "quiz"), l.slug).toBe(true);
  });
});

describe("formulas render", () => {
  it("every $…$ and $$…$$ in lessons, terms, quizzes and memos renders in KaTeX", () => {
    let count = 0;
    for (const { where, s } of allStrings()) {
      for (const mm of s.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)) {
        const tex = mm[1] ?? mm[2];
        count++;
        expect(() => katex.renderToString(tex, { throwOnError: true, displayMode: Boolean(mm[1]), strict: false }), `${where}: ${tex}`).not.toThrow();
      }
    }
    expect(count).toBeGreaterThan(500);
  });

  it("no stray escaped newlines from String.raw", () => {
    for (const { where, s } of allStrings()) expect(/\\n(?![a-zA-Z])/.test(s), `${where} has a literal \\n`).toBe(false);
  });
});

describe("quizzes", () => {
  it("have unique ids and answers that point at a real option", () => {
    const ids = of("quiz").map((x) => x.b.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const { lesson, b } of of("quiz")) {
      for (const q of b.questions) {
        expect(q.options.length, `${lesson}: ${q.q}`).toBeGreaterThanOrEqual(3);
        expect(new Set(q.options).size, `${lesson}: duplicate options`).toBe(q.options.length);
        expect(q.answer, `${lesson}: ${q.q}`).toBeGreaterThanOrEqual(0);
        expect(q.answer, `${lesson}: ${q.q}`).toBeLessThan(q.options.length);
        expect(q.explain.length).toBeGreaterThan(10);
      }
    }
    expect(QUESTION_BANK.length).toBeGreaterThanOrEqual(200);
  });

  it("don't always put the right answer in the same place", () => {
    const positions = new Set(QUESTION_BANK.map((q) => q.answer));
    expect(positions.size).toBeGreaterThanOrEqual(3);
  });
});

describe("practice problems", () => {
  it("every memo answer passes its own checker, with a solution", () => {
    const ids = of("practice").map((x) => x.b.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const { lesson, b } of of("practice")) {
      expect(b.problems.length, lesson).toBeGreaterThanOrEqual(2);
      for (const p of b.problems) {
        const res = checkAnswer(p.answer.split(" | ")[0], p);
        expect(res.ok, `${lesson}: ${p.q} → ${p.answer} (${res.message})`).toBe(true);
        expect(p.solution.length, `${lesson}: ${p.q}`).toBeGreaterThan(5);
      }
    }
    expect(of("practice").flatMap((x) => x.b.problems).length).toBeGreaterThanOrEqual(120);
  });

  it("worked examples have steps", () => {
    for (const { lesson, b } of of("worked")) expect(b.steps.length, lesson).toBeGreaterThanOrEqual(1);
    expect(of("worked").length).toBeGreaterThanOrEqual(45);
  });
});

describe("widgets", () => {
  it("drills point at real generators", () => {
    const drills = [...of("widget").filter((x) => x.b.widget === "drill").map((x) => x.b.props), ...WIDGET_CATALOGUE.filter((w) => w.name === "drill").map((w) => w.props)];
    for (const p of drills) for (const id of ((p?.generators as string[]) ?? [])) expect(getGenerator(id), id).toBeTruthy();
  });
});

describe("puzzles", () => {
  it("sorter items all belong to a declared bucket", () => {
    const sorters = [
      ...of("widget").filter((x) => x.b.widget === "sorter").map((x) => ({ where: x.lesson, props: x.b.props as { id: string; buckets: string[]; items: { text: string; bucket: string }[] } })),
      ...WIDGET_CATALOGUE.filter((w) => w.name === "sorter").map((w) => ({ where: `toolkit/${w.title}`, props: w.props as { id: string; buckets: string[]; items: { text: string; bucket: string }[] } })),
    ];
    expect(sorters.length).toBeGreaterThanOrEqual(3);
    const ids = sorters.map((s) => s.props.id);
    expect(new Set(ids).size, "sorter ids must be unique").toBe(ids.length);
    for (const s of sorters) {
      expect(s.props.items.length, s.where).toBeGreaterThanOrEqual(4);
      expect(new Set(s.props.items.map((i) => i.text)).size, `${s.where}: duplicate items`).toBe(s.props.items.length);
      for (const it of s.props.items) expect(s.props.buckets, `${s.where}: ${it.text}`).toContain(it.bucket);
      for (const b of s.props.buckets) expect(s.props.items.some((i) => i.bucket === b), `${s.where}: empty bucket ${b}`).toBe(true);
    }
  });

  it("sequences and matches are well-formed with unique ids", () => {
    const ids = [...of("sequence").map((x) => x.b.id), ...of("match").map((x) => x.b.id)];
    expect(new Set(ids).size).toBe(ids.length);
    for (const { lesson, b } of of("sequence")) {
      expect(b.steps.length, lesson).toBeGreaterThanOrEqual(3);
      expect(new Set(b.steps).size, lesson).toBe(b.steps.length);
    }
    for (const { lesson, b } of of("match")) {
      expect(b.pairs.length, lesson).toBeGreaterThanOrEqual(3);
      expect(new Set(b.pairs.map((p) => p.right)).size, lesson).toBe(b.pairs.length);
    }
  });
});

describe("exam questions", () => {
  it("have unique ids, a memo line per mark and a live topic", () => {
    expect(EXAM_QUESTIONS.length).toBeGreaterThanOrEqual(45);
    const ids = [...EXAM_QUESTIONS.map((q) => q.id), ...of("exam").map((x) => x.b.question.id)];
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of EXAM_QUESTIONS) {
      expect(LIVE_TOPICS, q.id).toContain(q.topic);
      for (const p of q.parts) expect(p.memo.length, `${q.id}: ${p.q}`).toBeGreaterThanOrEqual(p.marks);
    }
    for (const { lesson, b } of of("exam")) expect(b.question.memo.length, lesson).toBeGreaterThanOrEqual(b.question.marks);
  });
});

describe("glossary", () => {
  it("has a healthy number of unique terms", () => {
    expect(GLOSSARY.length).toBeGreaterThanOrEqual(250);
    for (const g of GLOSSARY) expect(g.def.length, g.term).toBeGreaterThan(8);
  });
});
