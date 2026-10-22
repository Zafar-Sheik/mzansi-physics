"use client";
import { useState } from "react";
import { ChevronDown, Footprints, RotateCcw } from "lucide-react";
import type { WorkedStep } from "@/content/types";
import { Button } from "@/components/ui/button";
import { Markdown } from "./markdown";

/**
 * Worked example revealed one step at a time. Learners are nudged to predict the
 * next step before revealing it – this "self-explanation" is what makes worked
 * examples stick.
 */
export function Worked({ title, problem, steps }: { title: string; problem: string; steps: WorkedStep[] }) {
  const [shown, setShown] = useState(0);
  const all = shown >= steps.length;
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wider text-muted uppercase"><Footprints className="h-4 w-4" /> Worked example</div>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <div className="mt-2 rounded-xl bg-surface-2 p-3"><Markdown md={problem} /></div>
      <ol className="mt-3 space-y-2">
        {steps.slice(0, shown).map((s, i) => (
          <li key={i} className="flex gap-3 rounded-xl border border-line p-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-brand text-xs font-bold text-white">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <Markdown md={s.md} />
              {s.why && <p className="mt-1 text-sm text-muted"><span className="font-semibold text-info">Why? </span>{s.why}</p>}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {!all ? (
          <>
            <Button size="sm" onClick={() => setShown((n) => n + 1)}><ChevronDown className="h-4 w-4" /> {shown === 0 ? "Show step 1" : "Next step"}</Button>
            <Button size="sm" variant="ghost" onClick={() => setShown(steps.length)}>Show all</Button>
            <span className="text-xs text-muted">🤔 Predict the next step before you tap.</span>
          </>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => setShown(0)}><RotateCcw className="h-4 w-4" /> Hide steps &amp; try it yourself</Button>
        )}
      </div>
    </div>
  );
}
