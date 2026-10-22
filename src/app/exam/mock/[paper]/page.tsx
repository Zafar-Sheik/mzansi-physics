import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EXAM_QUESTIONS, masteryIndex } from "@/content";
import { MockExam } from "@/components/pages/mock-exam";
import { MOCK_IDS, mockTitle, paperQuestions, type MockId } from "@/lib/mock";

export function generateStaticParams() {
  return MOCK_IDS.map((paper) => ({ paper }));
}

export async function generateMetadata({ params }: { params: Promise<{ paper: string }> }): Promise<Metadata> {
  const { paper } = await params;
  return (MOCK_IDS as readonly string[]).includes(paper) ? { title: mockTitle(paper as MockId).replace(" – full mock", " mock paper") } : {};
}

export default async function MockPaperPage({ params }: { params: Promise<{ paper: string }> }) {
  const { paper } = await params;
  if (!(MOCK_IDS as readonly string[]).includes(paper)) notFound();
  const id = paper as MockId;
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-10 text-muted">Loading…</div>}>
      <MockExam id={id} questions={paperQuestions(EXAM_QUESTIONS, id)} mastery={masteryIndex()} />
    </Suspense>
  );
}
