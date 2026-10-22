"use client";
import { useState } from "react";
import { Check, Eye, Lightbulb, X } from "lucide-react";
import type { PracticeProblem } from "@/content/types";
import { checkAnswer, inferKind } from "@/lib/sci/check";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { blockMath, Markdown } from "@/components/learn/markdown";
import { Widget } from "@/components/widgets";
import { AnswerInput } from "./answer-input";

const PRAISE = ["Sharp sharp! ✅", "Lekker! 🔥", "Spot on! 🎯", "Eish, you're good. 💯", "Yebo! That's it. ✨", "Too clean! 🧼", "Newton would be proud! 🍎", "Pure science! 🔬"];

/**
 * One typed-answer problem: answer → instant check → hint → full solution.
 * Wrong answers get specific feedback ("check your sign", "1 of 2 solutions")
 * and are framed as "not yet".
 */
export function ProblemCard({ problem, onResult, footer, number }: {
  problem: PracticeProblem;
  /** Called once, when the learner first gets it right (or gives up and views the solution). */
  onResult?: (r: { correct: boolean; firstTry: boolean }) => void;
  footer?: React.ReactNode;
  number?: string;
}) {
  const [value, setValue] = useState("");
  const [tries, setTries] = useState(0);
  const [state, setState] = useState<"idle" | "ok" | "bad">("idle");
  const [message, setMessage] = useState<string | undefined>();
  const [hint, setHint] = useState(false);
  const [solution, setSolution] = useState(false);
  const [reported, setReported] = useState(false);
  const kind = problem.kind ?? inferKind(problem.answer);

  const report = (correct: boolean, firstTry: boolean) => {
    if (reported) return;
    setReported(true);
    onResult?.({ correct, firstTry });
  };

  const check = () => {
    if (state === "ok") return;
    const res = checkAnswer(value, problem);
    setMessage(res.message);
    if (res.unreadable) {
      setState("bad");
      return;
    }
    const n = tries + 1;
    setTries(n);
    if (res.ok) {
      setState("ok");
      setMessage(PRAISE[(value.length + n) % PRAISE.length]);
      report(true, n === 1);
    } else {
      setState("bad");
    }
  };

  const reveal = () => {
    setSolution(true);
    report(false, false);
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-start gap-3">
        {number && <span className="rounded-lg bg-brand-soft px-2 py-0.5 font-mono text-sm font-bold text-brand">{number}</span>}
        <div className="min-w-0 flex-1"><Markdown md={problem.q} className="prose-learn font-semibold" /></div>
      </div>
      {problem.figure && <div className="mt-3"><Widget name={problem.figure.widget} props={problem.figure.props} /></div>}
      <div className="mt-3">
        <AnswerInput value={value} onChange={(v) => { setValue(v); if (state === "bad") setState("idle"); }} onSubmit={check} kind={kind} vars={problem.vars} unit={problem.unit} disabled={state === "ok"} status={state === "idle" ? null : state} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={check} disabled={state === "ok" || !value.trim()}><Check className="h-4 w-4" /> Check</Button>
        {problem.hint && !hint && state !== "ok" && <Button size="sm" variant="ghost" onClick={() => setHint(true)}><Lightbulb className="h-4 w-4" /> Hint</Button>}
        {!solution && (state === "ok" || tries >= 1) && <Button size="sm" variant="ghost" onClick={reveal}><Eye className="h-4 w-4" /> {state === "ok" ? "See the full working" : "Show me how"}</Button>}
        {footer}
      </div>
      {state !== "idle" && message && (
        <div role="status" className={cn("mt-3 flex items-start gap-2 rounded-xl p-3 text-sm", state === "ok" ? "bg-success/10" : "bg-warning/10")}>
          {state === "ok" ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> : <X className="mt-0.5 h-4 w-4 shrink-0 text-warning" />}
          <span><strong>{state === "ok" ? message : "Not yet. "}</strong>{state === "bad" && message}</span>
        </div>
      )}
      {state === "bad" && !message && (
        <div role="status" className="mt-3 flex items-start gap-2 rounded-xl bg-warning/10 p-3 text-sm"><X className="mt-0.5 h-4 w-4 shrink-0 text-warning" /><span><strong>Not yet.</strong> Try again, use the hint, or look at the working.</span></div>
      )}
      {hint && problem.hint && state !== "ok" && <div className="mt-3 rounded-xl border-l-4 border-info bg-info/10 p-3 text-sm"><strong className="text-info">Hint: </strong><Markdown md={problem.hint} className="prose-learn inline [&_p]:inline" /></div>}
      {solution && (
        <div className="mt-3 rounded-xl border border-brand/30 bg-brand-soft/40 p-3">
          <div className="mb-1 text-xs font-bold tracking-wider text-brand uppercase">Worked solution</div>
          <Markdown md={blockMath(problem.solution)} />
        </div>
      )}
    </div>
  );
}
