"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Crosshair, NotebookPen, Zap } from "lucide-react";
import type { Grade } from "@/content/types";
import { computeMastery, recommendations, type MasteryIndex, type TopicMastery } from "@/lib/mastery";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { Drill } from "@/components/widgets/drill";

const STATUS: Record<TopicMastery["status"], { label: string; colour: string }> = {
  strong: { label: "Strong", colour: "var(--success)" },
  shaky: { label: "Shaky", colour: "var(--warning)" },
  weak: { label: "Needs work", colour: "var(--danger)" },
  untested: { label: "Not tested yet", colour: "var(--text-muted)" },
};

function why(t: TopicMastery) {
  if (t.status === "untested") return t.lessonsDone ? `${t.lessonsDone}/${t.lessons.length} lessons done, but not enough questions answered yet to judge.` : "You haven't started this topic yet.";
  return `${t.pct}% across ${t.possible} marks of quizzes, exam questions, mocks and drills.`;
}

/**
 * Per-topic mastery from quizzes, exam marks, mock papers and drills, the
 * three topics to work on next, and a drill aimed at exactly those topics.
 */
export function WeakSpotCoach({ index, grade: initialGrade = 12 }: { index: MasteryIndex; grade?: Grade }) {
  const p = useProgress();
  const [grade, setGrade] = useState<Grade>(initialGrade);
  const [drill, setDrill] = useState<string | null>(null);
  const mastery = useMemo(() => computeMastery(p, index), [p, index]);
  const recs = recommendations(mastery, { grade });
  const shown = mastery.filter((t) => t.grade === grade);
  const drillTopics = drill === "mix" ? recs : recs.filter((t) => t.topic === drill);
  const drillGens = drillTopics.flatMap((t) => t.generators);

  return (
    <section id="coach" className="rounded-3xl border border-line bg-surface p-5" aria-labelledby="coach-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="coach-title" className="flex items-center gap-2 font-display text-xl font-bold"><Crosshair className="h-5 w-5 text-danger" /> Weak-spot coach</h2>
        <div className="flex gap-1">
          {([10, 11, 12] as const).map((g) => <button key={g} onClick={() => { setGrade(g); setDrill(null); }} aria-pressed={grade === g} className={cn("rounded-lg px-3 py-1.5 text-sm font-bold", grade === g ? "bg-brand text-white" : "bg-surface-2 text-muted")}>Grade {g}</button>)}
        </div>
      </div>
      <p className="mt-1 text-sm text-muted">Built from your lesson quizzes, practice, exam marks, mock papers and drills. The more you answer, the sharper it gets.</p>

      <h3 className="mt-4 text-sm font-bold text-muted uppercase">Work on these next</h3>
      {recs.length ? (
        <div className="mt-2 grid gap-3 md:grid-cols-3">
          {recs.map((t) => (
            <div key={t.topic} className="flex flex-col rounded-2xl border-2 p-4" style={{ borderColor: `color-mix(in oklab, ${STATUS[t.status].colour} 45%, transparent)` }}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-display font-bold" style={{ color: t.colour }}>{t.emoji} {t.title}</span>
                <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ color: STATUS[t.status].colour, background: `color-mix(in oklab, ${STATUS[t.status].colour} 12%, transparent)` }}>{STATUS[t.status].label}</span>
              </div>
              <p className="mt-1 flex-1 text-xs text-muted">{why(t)}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <Link href={`/learn/${t.nextLesson.slug}`} className="inline-flex items-center gap-1 rounded-lg bg-brand-soft px-2.5 py-1 font-semibold text-brand"><BookOpen className="h-4 w-4" /> {t.lessonsDone < t.lessons.length ? "Next lesson" : "Revise"}</Link>
                {t.generators.length > 0 && <button onClick={() => setDrill(t.topic)} aria-pressed={drill === t.topic} className="inline-flex items-center gap-1 rounded-lg bg-surface-2 px-2.5 py-1 font-semibold"><Zap className="h-4 w-4 text-brand" /> Drill</button>}
                {t.examQuestions > 0 && <Link href={`/exam?topic=${t.slug}`} className="inline-flex items-center gap-1 rounded-lg bg-surface-2 px-2.5 py-1 font-semibold"><NotebookPen className="h-4 w-4 text-exam" /> Exam Qs</Link>}
              </div>
              <div className="mt-2 truncate text-xs text-muted">Next: {t.nextLesson.title}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 rounded-2xl bg-success/10 p-4 text-sm font-semibold text-success">Every Grade {grade} topic is strong. Write a full mock paper to prove it!</p>
      )}
      {recs.length > 1 && <button onClick={() => setDrill("mix")} aria-pressed={drill === "mix"} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"><Crosshair className="h-4 w-4" /> Mixed drill on all three</button>}
      {drill && drillGens.length > 0 && (
        <div className="mt-4">
          <Drill key={drill + grade} generators={drillGens} title={drill === "mix" ? "Weak-spot drill" : `Targeted drill: ${drillTopics[0]?.title}`} />
        </div>
      )}

      <h3 className="mt-6 text-sm font-bold text-muted uppercase">Mastery by topic</h3>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((t) => (
          <li key={t.topic} className="rounded-xl bg-surface-2 p-3">
            <div className="flex items-center justify-between gap-2 text-sm"><span className="font-semibold">{t.emoji} {t.title}</span><span className="font-mono text-xs font-bold" style={{ color: STATUS[t.status].colour }}>{t.pct === null ? "–" : `${t.pct}%`}</span></div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-bg" role="progressbar" aria-label={`${t.title} mastery`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={t.pct ?? 0}>
              <div className="h-full rounded-full transition-all" style={{ width: `${t.pct ?? 0}%`, background: STATUS[t.status].colour }} />
            </div>
            <div className="mt-1 text-xs text-muted">{STATUS[t.status].label} · {t.lessonsDone}/{t.lessons.length} lessons</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
