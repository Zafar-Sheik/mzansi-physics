"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, BookOpenCheck, CheckCircle2, Clock, NotebookPen, Timer } from "lucide-react";
import type { ExamQuestion, Grade, Topic } from "@/content/types";
import { useProgress } from "@/lib/progress";
import { PAPER_INFO, TOPICS, topicMeta } from "@/lib/topics";
import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";
import { GlowCard } from "@/components/aceternity/glow-card";
import { ExamPartCard } from "@/components/learn/exam-part";
import { Markdown } from "@/components/learn/markdown";
import { Widget } from "@/components/widgets";

const VERBS: [string, string][] = [
  ["Write down", "The answer can be read off or recalled – no working needed. Usually 1–2 marks."],
  ["Calculate / Determine", "Show the method: formula → substitution → answer. Most marks are for method."],
  ["Solve", "Find ALL values that make the equation (or inequality) true. Check for invalid answers."],
  ["Simplify", "Write in the simplest form – no negative exponents, surds simplified, fractions reduced."],
  ["Show that / Prove", "The answer is given – every step must be shown and justified. Don't work backwards from it."],
  ["Sketch", "Draw the shape, and label ALL intercepts, turning points and asymptotes with coordinates."],
  ["Hence", "Use the previous answer. 'Hence or otherwise' – using the previous answer is the quick way."],
  ["Explain / Why", "Give the mathematical reason, e.g. 'Δ < 0, so the roots are non-real'."],
];

/** Exam-style questions with self-marking memos, plus exam technique. */
export function ExamRoom({ questions }: { questions: ExamQuestion[] }) {
  const params = useSearchParams();
  const liveTopics = TOPICS.filter((t) => questions.some((q) => q.topic === t.topic));
  const initialTopic = TOPICS.find((t) => t.slug === params.get("topic"))?.topic ?? null;
  const [topic, setTopic] = useState<Topic | null>(initialTopic);
  const [grade, setGrade] = useState<Grade>(initialTopic ? topicMeta(initialTopic).grade : 12);
  const [open, setOpen] = useState<string | null>(null);
  const progress = useProgress();
  const list = questions.filter((q) => !topic || q.topic === topic);
  const current = questions.find((q) => q.id === open);
  const done = (q: ExamQuestion) => q.parts.every((_, k) => progress.exams?.[`${q.id}-${k}`]);
  const scoreOf = (q: ExamQuestion) => q.parts.reduce((s, _, k) => s + (progress.exams?.[`${q.id}-${k}`]?.score ?? 0), 0);
  const totalOf = (q: ExamQuestion) => q.parts.reduce((s, p) => s + p.marks, 0);

  if (current) {
    const meta = topicMeta(current.topic);
    const qNum = questions.indexOf(current) + 1;
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <button onClick={() => setOpen(null)} className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg"><ArrowLeft className="h-4 w-4" /> All exam questions</button>
        <header className="mt-4 rounded-3xl border border-line p-6" style={{ background: `linear-gradient(135deg, color-mix(in oklab, ${meta.colour} 12%, var(--surface)), var(--surface) 60%)` }}>
          <div className="flex flex-wrap gap-2"><Chip colour={meta.colour}>{meta.emoji} Gr {meta.grade} · {meta.title}</Chip><Chip>{meta.paper === 1 ? "Paper 1 · Physics" : "Paper 2 · Chemistry"}</Chip><Chip>{totalOf(current)} marks · ≈ {Math.round(totalOf(current) * 1.2)} min</Chip></div>
          <h1 className="mt-3 font-display text-3xl font-bold">{current.title}</h1>
          <p className="mt-1 text-sm text-muted">Do the working on paper (or in the box) <strong>before</strong> you open the memo – that is where the learning happens. One tick = one mark.</p>
        </header>
        {current.source && <div className="mt-5 rounded-2xl border-l-4 border-exam bg-exam/5 p-4"><Markdown md={current.source} /></div>}
        {current.figure && <div className="mt-5"><div className="mb-1 text-xs font-bold text-muted uppercase">Figure</div><Widget name={current.figure.widget} props={current.figure.props} /></div>}
        <div className="mt-6 space-y-4">
          {current.parts.map((p, k) => <ExamPartCard key={k} part={p} id={`${current.id}-${k}`} number={`${qNum}.${k + 1}`} />)}
        </div>
        <div className="mt-6 rounded-2xl border border-line bg-surface p-4 text-center">
          <div className="text-sm text-muted">Your saved total for this question</div>
          <div className="font-display text-3xl font-bold">{scoreOf(current)} / {totalOf(current)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold tracking-tight">Exam Room</h1>
      <p className="mt-2 max-w-2xl text-lg text-muted">NSC-style questions with marking memos. Work it out first, then tick each memo mark you earned – method marks included.</p>
      <div className="mt-5 flex flex-col gap-3 rounded-2xl border-2 border-exam/40 bg-exam/5 p-4 sm:flex-row sm:items-center">
        <Timer className="h-8 w-8 shrink-0 text-exam" />
        <div className="flex-1"><div className="font-display font-bold">Ready for the real thing? Write a timed mock paper.</div><div className="text-sm text-muted">Full or quick mocks for Grades 10, 11 and 12, Physics and Chemistry – marked by you, with an NSC level and a breakdown by topic.</div></div>
        <div className="flex flex-wrap gap-2">
          <Link href="/exam/mock" className="rounded-xl bg-exam px-4 py-2 text-sm font-semibold text-white">Mock papers</Link>
          <Link href="/progress#coach" className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold">Weak-spot coach</Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {([10, 11, 12] as const).map((g) => <button key={g} onClick={() => setGrade(g)} aria-pressed={grade === g} className={cn("rounded-xl px-4 py-2 text-sm font-bold", grade === g ? "bg-brand text-white" : "bg-surface-2 text-muted")}>Grade {g} papers</button>)}
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {([1, 2] as const).map((p) => (
          <div key={p} className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center gap-2 font-display font-bold"><NotebookPen className="h-4 w-4 text-exam" /> {PAPER_INFO[grade][p].title}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted"><Clock className="h-3.5 w-3.5" /> {PAPER_INFO[grade][p].duration} · {PAPER_INFO[grade][p].marks} marks · about 1.2 minutes per mark</div>
            <ul className="mt-2 space-y-0.5 text-sm">{PAPER_INFO[grade][p].sections.map((s) => <li key={s.name} className="flex justify-between gap-2"><span>{s.name}</span><strong>±{s.marks}</strong></li>)}</ul>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">Mark allocations are approximate (±3) – check the latest DBE examination guidelines.</p>

      <details className="mt-4 rounded-2xl border border-line bg-surface p-4">
        <summary className="cursor-pointer font-display font-bold">📝 Exam technique: action verbs, method marks &amp; timing</summary>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <dl className="space-y-2 text-sm">{VERBS.map(([v, d]) => <div key={v}><dt className="font-semibold">{v}</dt><dd className="text-muted">{d}</dd></div>)}</dl>
          <div className="space-y-3 text-sm">
            <div className="rounded-xl bg-surface-2 p-3"><strong>Method marks:</strong> most marks are for the working, not the final answer. A wrong answer with the right method can still score most of the marks.</div>
            <div className="rounded-xl bg-surface-2 p-3"><strong>CA (consistent accuracy):</strong> if you get 5.1 wrong but use your answer correctly in 5.2, you still get the 5.2 marks. Never leave a follow-on question blank.</div>
            <div className="rounded-xl bg-surface-2 p-3"><strong>Rounding:</strong> round only at the very end, to the number of decimals asked (usually 2). Keep full values in the calculator memory.</div>
            <div className="rounded-xl bg-surface-2 p-3"><strong>Sketches:</strong> shape (1 mark), and every intercept, turning point and asymptote labelled with coordinates. A neat sketch with labels beats a pretty one without.</div>
            <div className="rounded-xl bg-surface-2 p-3"><strong>Timing:</strong> 150 marks in 180 minutes ≈ 1.2 minutes per mark. Stuck for 3 minutes? Move on and come back.</div>
          </div>
        </div>
      </details>

      <div className="mt-6 flex flex-wrap gap-2">
        <Chip active={!topic} onClick={() => setTopic(null)}>All topics</Chip>
        {liveTopics.map((t) => <Chip key={t.topic} active={topic === t.topic} onClick={() => setTopic(t.topic)}>{t.emoji} Gr {t.grade} · {t.title}</Chip>)}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((q) => {
          const meta = topicMeta(q.topic);
          return (
            <button key={q.id} onClick={() => { setOpen(q.id); window.scrollTo({ top: 0 }); }} className="group text-left">
              <GlowCard colour={meta.colour} className="h-full p-5 transition group-hover:-translate-y-0.5">
                <div className="flex items-center justify-between gap-2"><Chip colour={meta.colour}>{meta.emoji} Gr {meta.grade} · {meta.title}</Chip>{done(q) ? <span className="flex items-center gap-1 text-xs font-bold text-success"><CheckCircle2 className="h-4 w-4" /> {scoreOf(q)}/{totalOf(q)}</span> : <span className="text-xs text-muted">{totalOf(q)} marks</span>}</div>
                <h2 className="mt-3 font-display text-lg leading-tight font-bold">{q.title}</h2>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted"><BookOpenCheck className="h-3.5 w-3.5" /> {q.parts.length} questions · {meta.paper === 1 ? "Physics" : "Chemistry"}{q.figure && " · interactive figure"}</p>
              </GlowCard>
            </button>
          );
        })}
      </div>
      {list.length === 0 && <p className="mt-10 text-center text-muted">No questions for this topic yet.</p>}
    </div>
  );
}
