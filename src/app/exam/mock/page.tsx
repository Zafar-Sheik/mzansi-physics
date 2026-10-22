import type { Metadata } from "next";
import { EXAM_QUESTIONS } from "@/content";
import { MockLobby, type MockSummary } from "@/components/pages/mock-lobby";
import { buildMock, MOCK_IDS } from "@/lib/mock";
import { topicMeta } from "@/lib/topics";

export const metadata: Metadata = { title: "Mock papers", description: "Timed Grade 10, 11 & 12 Physical Sciences mock papers (Paper 1 Physics and Paper 2 Chemistry) with self-marking memos, NSC achievement levels and a per-topic breakdown." };

export default function MockPapersPage() {
  const papers: MockSummary[] = MOCK_IDS.map((id) => {
    const full = buildMock(EXAM_QUESTIONS, id);
    return { id, grade: full.grade, paper: full.paper, questions: full.questions.length, marks: full.marks, minutes: full.minutes, topics: [...new Set(full.questions.map((q) => topicMeta(q.topic).title))] };
  });
  return <MockLobby papers={papers} />;
}
