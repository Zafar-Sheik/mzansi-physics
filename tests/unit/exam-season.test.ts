/**
 * Exam season: mock papers, weak-spot targeting and worksheets.
 */
import { describe, expect, it } from "vitest";
import { EXAM_QUESTIONS, LESSONS, masteryIndex } from "@/content";
import { GENERATORS } from "@/lib/sci/generators";
import { achievement, buildMock, minutesPerMark, MOCK_IDS, parseMockId, partId, questionMarks, QUICK_TARGET, topicBreakdown } from "@/lib/mock";
import { computeMastery, examTopicOf, recommendations, type MasteryInput } from "@/lib/mastery";
import { buildWorksheet, parseSpec, specToParams } from "@/lib/worksheet";
import { topicMeta } from "@/lib/topics";

describe("mock papers", () => {
  it("full mocks hold every question for their grade and paper", () => {
    let all = 0;
    for (const id of MOCK_IDS) {
      const m = buildMock(EXAM_QUESTIONS, id);
      const { grade, paper } = parseMockId(id)!;
      expect(m.questions.length, id).toBeGreaterThanOrEqual(5);
      for (const q of m.questions) {
        const t = topicMeta(q.topic);
        const alsoExamined = id === "g12-p1" && (q.topic === "g11-newton" || q.topic === "g11-electrostatics");
        expect(alsoExamined || (t.grade === grade && t.paper === paper), `${id}: ${q.id}`).toBe(true);
        if (!alsoExamined) all += 1;
      }
      expect(m.marks).toBe(m.questions.reduce((s, q) => s + questionMarks(q), 0));
      expect(m.minutes).toBe(Math.round(m.marks * minutesPerMark(grade)));
    }
    expect(all).toBe(EXAM_QUESTIONS.length);
  });

  it("Grade 12 Paper 1 also examines Grade 11 Newton's laws and electrostatics", () => {
    const topics = new Set(buildMock(EXAM_QUESTIONS, "g12-p1").questions.map((q) => q.topic));
    expect(topics.has("g11-newton")).toBe(true);
    expect(topics.has("g11-electrostatics")).toBe(true);
    expect(buildMock(EXAM_QUESTIONS, "g11-p1").questions.some((q) => q.topic === "g11-newton")).toBe(true);
  });

  it("quick mocks are seeded, about 50 marks and spread over topics", () => {
    for (const id of MOCK_IDS) {
      const full = buildMock(EXAM_QUESTIONS, id);
      for (const seed of [1, 2, 3, 42]) {
        const a = buildMock(EXAM_QUESTIONS, id, { quick: true, seed });
        const b = buildMock(EXAM_QUESTIONS, id, { quick: true, seed });
        expect(a.questions.map((q) => q.id)).toEqual(b.questions.map((q) => q.id));
        expect(a.marks).toBeGreaterThanOrEqual(Math.min(QUICK_TARGET, full.marks));
        expect(a.marks).toBeLessThanOrEqual(full.marks);
        expect(new Set(a.questions.map((q) => q.topic)).size).toBeGreaterThanOrEqual(Math.min(3, new Set(full.questions.map((q) => q.topic)).size));
      }
      const seeds = new Set([1, 2, 3, 4, 5, 6].map((seed) => buildMock(EXAM_QUESTIONS, id, { quick: true, seed }).questions.map((q) => q.id).join()));
      expect(seeds.size, `${id} quick mocks should vary`).toBeGreaterThan(1);
    }
  });

  it("achievement levels follow the NSC rating codes", () => {
    expect(achievement(100).level).toBe(7);
    expect(achievement(80).level).toBe(7);
    expect(achievement(79).level).toBe(6);
    expect(achievement(50).level).toBe(4);
    expect(achievement(29).level).toBe(1);
    expect(achievement(0).label).toBe("Not achieved");
  });

  it("topic breakdown caps each part at its marks", () => {
    const m = buildMock(EXAM_QUESTIONS, "g12-p1");
    const q = m.questions[0];
    const scores = { [partId(q, 0)]: 99 };
    const b = topicBreakdown(m.questions, scores);
    expect(b.find((x) => x.topic === q.topic)!.score).toBe(q.parts[0].marks);
    expect(b.reduce((s, x) => s + x.total, 0)).toBe(m.marks);
  });
});

describe("weak-spot coach", () => {
  const idx = masteryIndex();
  const quizOf = (topic: string) => Object.entries(idx.quizTopic).find(([id, t]) => t === topic && !id.startsWith("practice:"))![0];
  const empty: MasteryInput = { completedLessons: {}, quizzes: {}, exams: {}, mocks: {}, drills: {} };

  it("indexes every quiz, practice set and exam question to a topic", () => {
    const quizzes = LESSONS.flatMap((l) => l.chunks.flatMap((c) => c.blocks.filter((b) => b.type === "quiz")));
    expect(Object.keys(idx.quizTopic).filter((k) => !k.startsWith("practice:")).length).toBe(quizzes.length);
    for (const q of EXAM_QUESTIONS) expect(examTopicOf(`${q.id}-0`, idx.examTopic)).toBe(q.topic);
    for (const t of idx.topics) expect(t.lessons.length, t.topic).toBeGreaterThan(0);
  });

  it("starts with every topic untested", () => {
    const m = computeMastery(empty, idx);
    expect(m.every((t) => t.status === "untested" && t.pct === null)).toBe(true);
  });

  it("scores topics from quizzes, exams, mocks and drills", () => {
    const p: MasteryInput = {
      ...empty,
      quizzes: { [quizOf("g12-momentum")]: { correct: 1, total: 5 } },
      exams: { "g12-momentum-collision-0": { score: 1, total: 5 } },
      mocks: { "g12-p1": [{ byTopic: { "g12-doppler": [2, 10] } }, { byTopic: { "g12-doppler": [9, 10] } }] },
      drills: { "g12-circuits": { right: 6, tried: 10 } },
    };
    const m = computeMastery(p, idx);
    const get = (t: string) => m.find((x) => x.topic === t)!;
    expect(get("g12-momentum").pct).toBe(20);
    expect(get("g12-momentum").status).toBe("weak");
    expect(get("g12-doppler").pct).toBe(90); // only the latest mock counts
    expect(get("g12-doppler").status).toBe("strong");
    expect(get("g12-circuits").status).toBe("shaky");
    const recs = recommendations(m, { grade: 12 });
    expect(recs.map((r) => r.topic).slice(0, 2)).toEqual(["g12-momentum", "g12-circuits"]);
    expect(recs.every((r) => r.grade === 12 && r.status !== "strong")).toBe(true);
  });

  it("suggests the first unfinished lesson", () => {
    const org = idx.topics.find((t) => t.topic === "g12-organic")!;
    const m = computeMastery({ ...empty, completedLessons: { [org.lessons[0].slug]: {} } }, idx);
    expect(m.find((t) => t.topic === "g12-organic")!.nextLesson.slug).toBe(org.lessons[1].slug);
  });
});

describe("worksheets", () => {
  it("are reproducible from their spec and stick to the chosen topics", () => {
    const spec = { topics: ["g12-acids", "g10-motion"] as const, count: 12, number: 7 };
    const a = buildWorksheet({ ...spec, topics: [...spec.topics] }, GENERATORS);
    const b = buildWorksheet({ ...spec, topics: [...spec.topics] }, GENERATORS);
    expect(a.length).toBe(12);
    expect(a.map((x) => x.problem.q)).toEqual(b.map((x) => x.problem.q));
    for (const it of a) expect(spec.topics).toContain(it.topic);
    expect(new Set(a.map((x) => x.generator)).size).toBeGreaterThan(2);
    const c = buildWorksheet({ ...spec, topics: [...spec.topics], number: 8 }, GENERATORS);
    expect(c.map((x) => x.problem.q)).not.toEqual(a.map((x) => x.problem.q));
  });

  it("round-trips through the URL and clamps bad input", () => {
    const valid = GENERATORS.map((g) => g.topic);
    const s = parseSpec(new URLSearchParams("t=g12-rates,nonsense&n=999&w=-3&memo=0&title=Test"), valid);
    expect(s).toEqual({ topics: ["g12-rates"], count: 30, number: 1, memo: false, title: "Test" });
    expect(parseSpec(new URLSearchParams(specToParams(s)), valid)).toEqual(s);
  });
});
