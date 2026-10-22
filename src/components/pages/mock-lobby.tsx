"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, FileText, Shuffle } from "lucide-react";
import type { Grade, Paper } from "@/content/types";
import { achievement, QUICK_TARGET, type MockId } from "@/lib/mock";
import { useProgress } from "@/lib/progress";
import { GlowCard } from "@/components/aceternity/glow-card";

export interface MockSummary { id: MockId; grade: Grade; paper: Paper; questions: number; marks: number; minutes: number; topics: string[] }

/** Choose a full mock or a seeded quick mock for each grade and paper. */
export function MockLobby({ papers }: { papers: MockSummary[] }) {
  const router = useRouter();
  const progress = useProgress();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Link href="/exam" className="text-sm text-muted hover:text-fg">← Exam Room</Link>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">Mock papers</h1>
      <p className="mt-2 max-w-2xl text-lg text-muted">Write under exam conditions with a clock (extra time and untimed options too), hand in, then mark your own script against the memo. You get an NSC achievement level and a breakdown by topic.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {papers.map((p) => {
          const last = progress.mocks?.[p.id]?.at(-1);
          const colour = p.paper === 1 ? "var(--t-mech)" : "var(--t-change)";
          return (
            <GlowCard key={p.id} colour={colour} className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-bold tracking-wider text-muted uppercase">Grade {p.grade}</div>
                  <h2 className="font-display text-2xl font-bold">Paper {p.paper} · {p.paper === 1 ? "Physics" : "Chemistry"}</h2>
                </div>
                {last && <div className="text-right text-sm"><div className="text-muted">Last attempt</div><strong>{Math.round((last.score / Math.max(1, last.total)) * 100)}% · level {achievement((last.score / Math.max(1, last.total)) * 100).level}</strong></div>}
              </div>
              <p className="mt-2 text-sm text-muted">{p.topics.join(" · ")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/exam/mock/${p.id}`} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"><FileText className="h-4 w-4" /> Full mock · {p.marks} marks</Link>
                <button onClick={() => router.push(`/exam/mock/${p.id}?quick=1&seed=${1 + Math.floor(Math.random() * 9999)}`)} className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm font-semibold"><Shuffle className="h-4 w-4" /> Quick mock · ≈{QUICK_TARGET} marks</button>
              </div>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted"><Clock className="h-3.5 w-3.5" /> Full mock: {p.questions} questions, {p.minutes} minutes (1,2 min per mark, like the NSC).</p>
            </GlowCard>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-muted">Real Grade 11 and 12 papers are 150 marks in 3 hours (Grade 10: 2 hours). These mocks use the Exam Room questions for every topic on the paper, so their length is close to – but not exactly – a real paper.</p>
    </div>
  );
}
