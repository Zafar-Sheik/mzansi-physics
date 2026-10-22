import { NextResponse } from "next/server";
import { EXAM_QUESTIONS, GLOSSARY, LESSONS } from "@/content";
import { GENERATORS } from "@/lib/sci/generators";
import { TOPICS, topicMeta } from "@/lib/topics";

export const dynamic = "force-static";

/**
 * Read-only JSON feed of the curriculum (topics, lesson
 * titles, CAPS references, objectives, glossary, practice generators and exam
 * question ids). Teachers / LMS tools can use it to build worksheets or link
 * directly to lessons. Contains no learner data.
 */
export function GET() {
  return NextResponse.json({
    name: "PhysicsMzansi – Grade 10, 11 & 12 Physical Sciences curriculum",
    version: 1,
    topics: TOPICS.map((t) => ({ id: t.topic, grade: t.grade, strand: t.strand, paper: t.paper, title: t.title, lessons: LESSONS.filter((l) => l.topic === t.topic).length })),
    lessons: LESSONS.map((l) => {
      const m = topicMeta(l.topic);
      return {
        slug: l.slug, url: `/learn/${l.slug}`, grade: m.grade, strand: m.strand, paper: m.paper, topic: l.topic, title: l.title, caps: l.caps,
        objectives: l.objectives, styles: l.styles, minutes: l.chunks.reduce((a, c) => a + c.minutes, 0),
        steps: l.chunks.map((c) => c.title),
      };
    }),
    glossary: GLOSSARY.map((g) => ({ term: g.term, definition: g.def, topic: g.topic, lesson: g.lesson.slug })),
    generators: GENERATORS.map((g) => ({ id: g.id, title: g.title, topic: g.topic })),
    exam: EXAM_QUESTIONS.map((q) => ({ id: q.id, title: q.title, topic: q.topic, marks: q.parts.reduce((a, p) => a + p.marks, 0) })),
  });
}
