"use client";
import { useState } from "react";
import { ArrowRight, PenLine, RotateCcw } from "lucide-react";
import type { PracticeProblem } from "@/content/types";
import { bumpStat, recordQuiz } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProblemCard } from "@/components/sci/problem-card";

/**
 * "Your turn" practice: one problem at a time (no wall of questions), typed
 * answers checked instantly, hints and full working on demand.
 */
export function Practice({ id, title = "Your turn", problems }: { id: string; title?: string; problems: PracticeProblem[] }) {
  const [i, setI] = useState(0);
  const [results, setResults] = useState<(boolean | null)[]>(() => problems.map(() => null));
  const [round, setRound] = useState(0);
  const done = results.every((r) => r !== null);
  const firstTry = results.filter(Boolean).length;

  const onResult = (k: number, r: { correct: boolean; firstTry: boolean }) => {
    if (r.correct) bumpStat("calculations");
    setResults((prev) => {
      const next = prev.map((x, j) => (j === k ? r.firstTry : x));
      if (next.every((x) => x !== null)) recordQuiz(`practice:${id}`, next.filter(Boolean).length, problems.length);
      return next;
    });
  };

  return (
    <div className="rounded-2xl border-2 border-brand/25 bg-brand-soft/20 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-display font-bold"><PenLine className="h-4 w-4 text-brand" /> {title}</div>
        <div className="flex gap-1" aria-label={`Problem ${i + 1} of ${problems.length}`}>
          {problems.map((_, k) => (
            <button key={k} onClick={() => setI(k)} aria-label={`Problem ${k + 1}`} aria-current={k === i ? "step" : undefined}
              className={cn("h-2.5 w-7 rounded-full transition", results[k] === true ? "bg-success" : results[k] === false ? "bg-warning" : k === i ? "bg-brand" : "bg-surface-2")} />
          ))}
        </div>
      </div>
      <ProblemCard key={`${round}-${i}`} problem={problems[i]} number={`${i + 1}`} onResult={(r) => onResult(i, r)}
        footer={i < problems.length - 1 ? <Button size="sm" variant="secondary" className="ml-auto" onClick={() => setI(i + 1)}>Next problem <ArrowRight className="h-4 w-4" /></Button> : null} />
      {done && (
        <div role="status" className="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-surface p-3 text-sm">
          <span className="text-2xl">{firstTry === problems.length ? "🏆" : firstTry >= problems.length / 2 ? "🌟" : "💪"}</span>
          <span><strong>{firstTry}/{problems.length} right first time.</strong> {firstTry === problems.length ? "Flawless – you own this skill." : "Every mistake you fix now is a mark you keep in the exam."}</span>
          <Button size="sm" variant="ghost" className="ml-auto" onClick={() => { setResults(problems.map(() => null)); setI(0); setRound((r) => r + 1); }}><RotateCcw className="h-4 w-4" /> Redo</Button>
        </div>
      )}
    </div>
  );
}
