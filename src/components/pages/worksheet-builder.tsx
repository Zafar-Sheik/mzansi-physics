"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Dices, Printer } from "lucide-react";
import type { Grade, Topic } from "@/content/types";
import { GENERATORS } from "@/lib/sci/generators";
import { TOPICS, topicMeta } from "@/lib/topics";
import { buildWorksheet, MAX_QUESTIONS, MIN_QUESTIONS, parseSpec, specToParams, type WorksheetSpec } from "@/lib/worksheet";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { blockMath, Markdown } from "@/components/learn/markdown";
import { Widget } from "@/components/widgets";

const WITH_GENERATORS = TOPICS.filter((t) => GENERATORS.some((g) => g.topic === t.topic));
const VALID = WITH_GENERATORS.map((t) => t.topic);

/**
 * Printable worksheets from the question generators: pick topics and a
 * length, print the questions with answer space, and the memo with full
 * working on a separate page. The link reproduces the exact same sheet.
 */
export function WorksheetBuilder() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const [spec, setSpec] = useState<WorksheetSpec>(() => {
    const s = parseSpec(new URLSearchParams(params.toString()), VALID);
    return s.topics.length ? s : { ...s, topics: ["g12-momentum"] };
  });
  const [grade, setGrade] = useState<Grade>(() => topicMeta(spec.topics[0]).grade);
  const [space, setSpace] = useState(true);
  const [copied, setCopied] = useState(false);
  const items = useMemo(() => buildWorksheet(spec, GENERATORS), [spec]);

  useEffect(() => {
    router.replace(`${path}?${specToParams(spec)}`, { scroll: false });
  }, [spec, path, router]);

  const toggle = (t: Topic) => setSpec((s) => {
    const topics = s.topics.includes(t) ? s.topics.filter((x) => x !== t) : [...s.topics, t];
    return { ...s, topics: topics.length ? topics : s.topics };
  });
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };
  const title = spec.title || `${[...new Set(spec.topics.map((t) => `Gr ${topicMeta(t).grade} ${topicMeta(t).title}`))].join(", ")}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 print:max-w-none print:p-0">
      <div className="no-print">
        <h1 className="font-display text-4xl font-bold tracking-tight">Worksheet generator</h1>
        <p className="mt-2 max-w-2xl text-lg text-muted">Fresh practice for your class in seconds: choose topics and a length, then print (or save as PDF). The memo with full working prints on its own page. Same link = same worksheet, so learners can redo it at home.</p>

        <div className="mt-6 space-y-4 rounded-3xl border border-line bg-surface p-5">
          <div className="flex flex-wrap items-center gap-2">
            {([10, 11, 12] as const).map((g) => <button key={g} onClick={() => setGrade(g)} aria-pressed={grade === g} className={cn("rounded-lg px-3 py-1.5 text-sm font-bold", grade === g ? "bg-brand text-white" : "bg-surface-2 text-muted")}>Grade {g}</button>)}
            <span className="text-sm text-muted">Choose one or more topics:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {WITH_GENERATORS.filter((t) => t.grade === grade).map((t) => {
              const on = spec.topics.includes(t.topic);
              return <button key={t.topic} onClick={() => toggle(t.topic)} aria-pressed={on} className={cn("rounded-full border px-3 py-1.5 text-sm font-semibold transition", on ? "border-brand bg-brand-soft text-brand" : "border-line text-muted hover:text-fg")}>{on && <Check className="mr-1 inline h-3.5 w-3.5" />}{t.emoji} {t.title}</button>;
            })}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm">
              <span className="font-semibold">Questions: {spec.count}</span>
              <input type="range" min={MIN_QUESTIONS} max={MAX_QUESTIONS} value={spec.count} onChange={(e) => setSpec((s) => ({ ...s, count: Number(e.target.value) }))} className="mt-1 w-full accent-[var(--brand)]" aria-label="Number of questions" />
            </label>
            <label className="block text-sm">
              <span className="font-semibold">Worksheet number</span>
              <span className="mt-1 flex gap-2">
                <input type="number" min={1} value={spec.number} onChange={(e) => setSpec((s) => ({ ...s, number: Math.max(1, Number(e.target.value) || 1) }))} className="w-24 rounded-lg border border-line bg-bg px-2 py-1" aria-label="Worksheet number" />
                <Button size="sm" variant="secondary" onClick={() => setSpec((s) => ({ ...s, number: 1 + Math.floor(Math.random() * 9999) }))}><Dices className="h-4 w-4" /> New</Button>
              </span>
            </label>
            <label className="block text-sm">
              <span className="font-semibold">Title (optional)</span>
              <input value={spec.title} maxLength={80} onChange={(e) => setSpec((s) => ({ ...s, title: e.target.value }))} placeholder={title} className="mt-1 w-full rounded-lg border border-line bg-bg px-2 py-1" />
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={spec.memo} onChange={(e) => setSpec((s) => ({ ...s, memo: e.target.checked }))} /> Include the memo</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={space} onChange={(e) => setSpace(e.target.checked)} /> Answer space</label>
            <span className="ml-auto flex gap-2">
              <Button size="sm" variant="secondary" onClick={copy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy link"}</Button>
              <Button size="sm" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print / save PDF</Button>
            </span>
          </div>
        </div>
        <h2 className="mt-8 mb-3 text-sm font-bold text-muted uppercase">Preview</h2>
      </div>

      <article className="worksheet rounded-3xl border border-line bg-surface p-6 print:rounded-none print:border-0 print:p-0" aria-label="Worksheet">
        <header className="border-b-2 border-fg/80 pb-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-2xl font-bold">{title}</h2>
            <span className="text-sm text-muted">PhysicsMzansi worksheet #{spec.number}</span>
          </div>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3"><span>Name: ______________________</span><span>Class: __________</span><span>Date: __________</span></div>
          <p className="mt-2 text-xs text-muted">Show all your working. Round to two decimal places unless told otherwise. {items.length} questions.</p>
        </header>
        <ol className="mt-4 space-y-5">
          {items.map((it) => (
            <li key={it.n} className="avoid-break flex gap-3">
              <span className="font-mono text-sm font-bold">{it.n}.</span>
              <div className="min-w-0 flex-1">
                <Markdown md={it.problem.q} />
                {it.problem.figure && <div className="mt-2 max-w-sm"><Widget name={it.problem.figure.widget} props={it.problem.figure.props} /></div>}
                {space && <div className="mt-2 h-24 rounded-lg border border-dashed border-line print:border-fg/30" aria-hidden />}
              </div>
            </li>
          ))}
        </ol>
        {spec.memo && (
          <section className="print-break mt-10 border-t-2 border-fg/80 pt-4" aria-label="Memo">
            <h2 className="font-display text-xl font-bold">Memo – worksheet #{spec.number}</h2>
            <ol className="mt-3 space-y-4">
              {items.map((it) => (
                <li key={it.n} className="avoid-break flex gap-3 text-sm">
                  <span className="font-mono font-bold">{it.n}.</span>
                  <div className="min-w-0 flex-1"><div className="text-xs text-muted">{it.title}</div><Markdown md={blockMath(it.problem.solution)} /></div>
                </li>
              ))}
            </ol>
          </section>
        )}
      </article>
    </div>
  );
}
