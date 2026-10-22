"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlarmClock, ArrowLeft, CheckSquare, Eye, EyeOff, Flag, Printer, RotateCcw, Square, Timer } from "lucide-react";
import type { ExamQuestion } from "@/content/types";
import { achievement, buildMock, partId, questionMarks, topicBreakdown, type MockId } from "@/lib/mock";
import type { MasteryIndex } from "@/lib/mastery";
import { recordMock, useProgress } from "@/lib/progress";
import { topicMeta } from "@/lib/topics";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { InlineMd, Markdown } from "@/components/learn/markdown";
import { Widget } from "@/components/widgets";

type Phase = "ready" | "writing" | "marking" | "done";
type Timing = "standard" | "extra" | "untimed";

interface Draft {
  phase: Phase;
  startedAt: number;
  finishedAt?: number;
  /** minutes allowed, or null when untimed */
  allowed: number | null;
  answers: Record<string, string>;
  ticks: Record<string, boolean[]>;
}

const fresh = (): Draft => ({ phase: "ready", startedAt: 0, allowed: null, answers: {}, ticks: {} });

function load(key: string): Draft {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) return { ...fresh(), ...JSON.parse(raw) };
  } catch {
    /* storage blocked */
  }
  return fresh();
}

function save(key: string, d: Draft) {
  try {
    if (d.phase === "ready") window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(d));
  } catch {
    /* storage full or blocked */
  }
}

const clock = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${h ? `${h}:` : ""}${String(m).padStart(h ? 2 : 1, "0")}:${String(sec).padStart(2, "0")}`;
};

/** The question paper itself – used on screen and for printing. */
function QuestionPaper({ questions, render }: { questions: ExamQuestion[]; render: (q: ExamQuestion, n: number, k: number) => React.ReactNode }) {
  return (
    <div className="space-y-8">
      {questions.map((q, i) => (
        <section key={q.id} aria-labelledby={`q-${q.id}`}>
          <div className="flex items-baseline justify-between gap-3 border-b-2 border-fg/80 pb-1">
            <h2 id={`q-${q.id}`} className="font-display text-lg font-bold">QUESTION {i + 1}</h2>
            <span className="text-xs text-muted">{topicMeta(q.topic).title} · {questionMarks(q)} marks</span>
          </div>
          {q.source && <div className="mt-3"><Markdown md={q.source} /></div>}
          {q.figure && <div className="mt-3"><Widget name={q.figure.widget} props={q.figure.props} /></div>}
          <div className="mt-3 space-y-4">{q.parts.map((_, k) => <div key={k} className="avoid-break">{render(q, i + 1, k)}</div>)}</div>
        </section>
      ))}
    </div>
  );
}

function PartPrompt({ q, n, k }: { q: ExamQuestion; n: number; k: number }) {
  const p = q.parts[k];
  return (
    <div className="flex items-start gap-3">
      <span className="font-mono text-sm font-bold text-exam">{n}.{k + 1}</span>
      <div className="min-w-0 flex-1"><Markdown md={p.q} /></div>
      <span className="shrink-0 text-sm font-bold">({p.marks})</span>
    </div>
  );
}

/**
 * A timed mock paper: write under exam conditions, hand in, then mark your own
 * script against the memo (one tick = one mark) and get an NSC achievement
 * level with a per-topic breakdown. The script is saved as you go.
 */
export function MockExam({ id, questions, mastery }: { id: MockId; questions: ExamQuestion[]; mastery: MasteryIndex }) {
  const params = useSearchParams();
  const quick = params.get("quick") === "1";
  const seed = Number(params.get("seed")) || 0;
  const paper = useMemo(() => buildMock(questions, id, { quick, seed }), [questions, id, quick, seed]);
  const key = `physicsmzansi:mock:${id}${quick ? `:q${seed}` : ""}`;
  const [draft, setDraft] = useState<Draft>(fresh);
  const [loaded, setLoaded] = useState(false);
  const [timing, setTiming] = useState<Timing>("standard");
  const [hideClock, setHideClock] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [printWhat, setPrintWhat] = useState<"paper" | "memo">("paper");
  const progress = useProgress();
  const recorded = useRef(false);

  useEffect(() => {
    setDraft(load(key));
    setLoaded(true);
  }, [key]);
  useEffect(() => {
    if (loaded) save(key, draft);
  }, [key, draft, loaded]);
  useEffect(() => {
    if (draft.phase !== "writing") return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [draft.phase]);

  const update = (fn: (d: Draft) => Draft) => setDraft((d) => fn(d));
  const allowedMs = draft.allowed === null ? null : draft.allowed * 60_000;
  const left = allowedMs === null ? null : allowedMs - (now - draft.startedAt);
  const timeUp = left !== null && left <= 0;
  const parts = paper.questions.flatMap((q) => q.parts.map((p, k) => ({ q, p, k, id: partId(q, k) })));
  const answered = parts.filter((x) => (draft.answers[x.id] ?? "").trim()).length;
  const scores = Object.fromEntries(parts.map((x) => [x.id, Math.min(x.p.marks, (draft.ticks[x.id] ?? []).filter(Boolean).length)]));
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const breakdown = topicBreakdown(paper.questions, scores);
  const pct = paper.marks ? Math.round((total / paper.marks) * 100) : 0;
  const level = achievement(pct);
  const usedMin = draft.finishedAt ? Math.max(1, Math.round((draft.finishedAt - draft.startedAt) / 60_000)) : 0;
  const attempts = progress.mocks?.[id] ?? [];

  const start = () => {
    const allowed = timing === "untimed" ? null : Math.round(paper.minutes * (timing === "extra" ? 1.25 : 1));
    setNow(Date.now());
    update((d) => ({ ...d, phase: "writing", startedAt: Date.now(), allowed }));
    window.scrollTo({ top: 0 });
  };
  const handIn = () => {
    if (!timeUp && !window.confirm("Hand in your paper? You can't change your answers after this.")) return;
    update((d) => ({ ...d, phase: "marking", finishedAt: Math.min(Date.now(), d.allowed === null ? Date.now() : d.startedAt + d.allowed * 60_000) }));
    window.scrollTo({ top: 0 });
  };
  const finish = () => {
    if (!recorded.current) {
      recorded.current = true;
      recordMock(id, { score: total, total: paper.marks, at: Date.now(), minutes: usedMin, quick, byTopic: Object.fromEntries(breakdown.map((b) => [b.topic, [b.score, b.total]])) });
    }
    update((d) => ({ ...d, phase: "done" }));
    window.scrollTo({ top: 0 });
  };
  const restart = () => {
    if (draft.phase !== "done" && !window.confirm("Throw away this attempt and start again?")) return;
    recorded.current = false;
    setDraft(fresh());
  };
  const print = (what: "paper" | "memo") => {
    setPrintWhat(what);
    window.setTimeout(() => window.print(), 50);
  };
  const toggleTick = (pid: string, i: number, n: number) => update((d) => {
    const t = d.ticks[pid] ?? Array.from({ length: n }, () => false);
    return { ...d, ticks: { ...d.ticks, [pid]: t.map((x, j) => (j === i ? !x : x)) } };
  });

  const header = (
    <header className="no-print rounded-3xl border border-line bg-gradient-to-br from-exam/15 via-surface to-brand/10 p-6">
      <Link href="/exam/mock" className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg"><ArrowLeft className="h-4 w-4" /> All mock papers</Link>
      <div className="mt-3 flex flex-wrap gap-2"><Chip>Grade {paper.grade}</Chip><Chip>{paper.paper === 1 ? "Paper 1 · Physics" : "Paper 2 · Chemistry"}</Chip><Chip>{paper.marks} marks</Chip><Chip>{paper.minutes} minutes</Chip>{paper.quick && <Chip>Quick mock #{seed}</Chip>}</div>
      <h1 className="mt-2 font-display text-3xl font-bold">{paper.title}</h1>
    </header>
  );

  if (!loaded) return <div className="mx-auto max-w-4xl px-4 py-10 text-muted">Loading your paper…</div>;

  // ---------------------------------------------------------------- ready
  if (draft.phase === "ready") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        {header}
        <div className="no-print mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-display text-lg font-bold">Instructions</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
              <li>This paper has {paper.questions.length} questions and {paper.marks} marks. Answer ALL the questions.</li>
              <li>Show ALL calculations, diagrams and graphs clearly – most marks are for method.</li>
              <li>An approved scientific calculator may be used. Round answers to TWO decimal places unless stated otherwise.</li>
              <li>Start each calculation with the formula, show the substitution and give the final answer with its SI unit. Round to two decimal places.</li>
              <li>Use the NSC data sheets (constants, formulas, periodic table and Table 4 of reduction potentials) – they are in the Toolkit.</li>
              <li>Write on paper or in the boxes. When you hand in, you mark your own script against the memo.</li>
            </ol>
            <p className="mt-3 text-sm text-muted">Topics: {[...new Set(paper.questions.map((q) => topicMeta(q.topic).title))].join(" · ")}</p>
          </div>
          <div className="space-y-3 rounded-2xl border border-line bg-surface p-5">
            <div className="text-sm font-bold">Time</div>
            {([["standard", `${paper.minutes} min (exam time)`], ["extra", `${Math.round(paper.minutes * 1.25)} min (+25% extra time)`], ["untimed", "Untimed practice"]] as [Timing, string][]).map(([t, label]) => (
              <label key={t} className="flex items-center gap-2 text-sm"><input type="radio" name="timing" checked={timing === t} onChange={() => setTiming(t)} /> {label}</label>
            ))}
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hideClock} onChange={(e) => setHideClock(e.target.checked)} /> Hide the clock while I write</label>
            <Button className="w-full" onClick={start}><Timer className="h-4 w-4" /> Start writing</Button>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => print("paper")}><Printer className="h-4 w-4" /> Paper</Button>
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => print("memo")}><Printer className="h-4 w-4" /> Memo</Button>
            </div>
          </div>
        </div>
        {attempts.length > 0 && (
          <div className="no-print mt-6 rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-display font-bold">Your previous attempts</h2>
            <ul className="mt-2 space-y-1 text-sm">{attempts.slice().reverse().map((a) => <li key={a.at} className="flex justify-between gap-2"><span>{new Date(a.at).toLocaleDateString("en-ZA")} · {a.quick ? "quick" : "full"} · {a.minutes} min</span><strong>{a.score}/{a.total} ({Math.round((a.score / Math.max(1, a.total)) * 100)}%)</strong></li>)}</ul>
          </div>
        )}
        {/* Print-only copy of the paper or its memo. */}
        <div className="hidden print:block">
          <h1 className="font-display text-2xl font-bold">PhysicsMzansi · {paper.title}{printWhat === "memo" ? " – MEMORANDUM" : ""}</h1>
          <p className="mb-6 text-sm">{paper.marks} marks · {paper.minutes} minutes{printWhat === "paper" ? " · Name: ______________________ Class: ________" : ""}</p>
          <QuestionPaper questions={paper.questions} render={(q, n, k) => (
            <div>
              <PartPrompt q={q} n={n} k={k} />
              {printWhat === "memo"
                ? <ul className="mt-1 ml-10 list-none space-y-0.5 text-sm">{q.parts[k].memo.map((m, i) => <li key={i}>✓ <InlineMd md={m} /></li>)}</ul>
                : <div className="mt-2 ml-10" style={{ height: `${1.4 + q.parts[k].marks * 0.9}rem` }} />}
            </div>
          )} />
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------- writing
  if (draft.phase === "writing") {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-10">
        <div className="sticky top-16 z-40 -mx-4 mb-6 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-display font-bold">{paper.title}</span>
            <span className="text-sm text-muted">{answered}/{parts.length} parts answered</span>
            <span className="ml-auto flex items-center gap-2">
              {left === null ? <span className="text-sm text-muted">Untimed</span> : hideClock ? (
                <button onClick={() => setHideClock(false)} className="inline-flex items-center gap-1 text-sm text-muted"><Eye className="h-4 w-4" /> Show clock</button>
              ) : (
                <button onClick={() => setHideClock(true)} title="Hide the clock" className={cn("inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-lg font-bold tabular-nums", left < 5 * 60_000 ? "bg-danger/15 text-danger" : left < 15 * 60_000 ? "bg-warning/15 text-warning" : "bg-surface-2")} role="timer" aria-label="Time left">
                  <AlarmClock className="h-4 w-4" /> {clock(left)} <EyeOff className="h-3.5 w-3.5 opacity-60" />
                </button>
              )}
              <Button size="sm" onClick={handIn}><Flag className="h-4 w-4" /> Hand in</Button>
            </span>
          </div>
        </div>
        {timeUp && (
          <div role="alert" className="mb-6 rounded-2xl border-2 border-danger bg-danger/10 p-4 text-center">
            <div className="font-display text-xl font-bold text-danger">Time&apos;s up – pens down!</div>
            <p className="mt-1 text-sm">Hand in your paper to mark it. In the real exam, the invigilator collects your script now.</p>
            <Button className="mt-3" onClick={handIn}><Flag className="h-4 w-4" /> Hand in and mark</Button>
          </div>
        )}
        <QuestionPaper questions={paper.questions} render={(q, n, k) => {
          const pid = partId(q, k);
          return (
            <div className="rounded-2xl border border-line bg-surface p-4">
              <PartPrompt q={q} n={n} k={k} />
              <textarea value={draft.answers[pid] ?? ""} disabled={timeUp} aria-label={`Answer ${n}.${k + 1}`} rows={Math.min(8, 2 + q.parts[k].marks)}
                onChange={(e) => { const v = e.target.value; update((d) => ({ ...d, answers: { ...d.answers, [pid]: v } })); }}
                className="mt-3 w-full rounded-xl border border-line bg-bg p-3 font-mono text-sm outline-none focus:border-brand disabled:opacity-60" placeholder="Your working…" />
            </div>
          );
        }} />
        <div className="mt-8 text-center"><Button onClick={handIn}><Flag className="h-4 w-4" /> Hand in my paper</Button></div>
      </div>
    );
  }

  // ---------------------------------------------------------------- marking & results
  const marking = draft.phase === "marking";
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {header}
      {!marking && (
        <section className="mt-6 rounded-3xl border border-line bg-surface p-6" aria-label="Results">
          <div className="grid gap-4 sm:grid-cols-3">
            <div><div className="text-sm text-muted">Your mark</div><div className="font-display text-5xl font-bold">{total}<span className="text-2xl text-muted">/{paper.marks}</span></div></div>
            <div><div className="text-sm text-muted">Percentage</div><div className="font-display text-5xl font-bold">{pct}%</div></div>
            <div><div className="text-sm text-muted">NSC level</div><div className="font-display text-5xl font-bold">{level.level}</div><div className="text-sm font-semibold">{level.label}</div></div>
          </div>
          <p className="mt-3 text-sm text-muted">Time used: {usedMin} min{draft.allowed !== null ? ` of ${draft.allowed}` : " (untimed)"} · {answered}/{parts.length} parts attempted</p>
          <h2 className="mt-5 font-display text-lg font-bold">By topic</h2>
          <ul className="mt-2 space-y-2">
            {[...breakdown].sort((a, b) => a.score / a.total - b.score / b.total).map((b) => {
              const t = topicMeta(b.topic);
              const tp = Math.round((b.score / b.total) * 100);
              const m = mastery.topics.find((x) => x.topic === b.topic);
              const lesson = m?.lessons.find((l) => !progress.completedLessons[l.slug]) ?? m?.lessons[0];
              return (
                <li key={b.topic} className="rounded-xl bg-surface-2 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="font-semibold">{t.emoji} {t.title}</span>
                    <span className="font-mono font-bold">{b.score}/{b.total} · {tp}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-bg"><div className="h-full rounded-full" style={{ width: `${tp}%`, background: tp >= 70 ? "var(--success)" : tp >= 50 ? "var(--warning)" : "var(--danger)" }} /></div>
                  {tp < 60 && lesson && <div className="mt-1.5 text-xs">Work on it: <Link className="font-semibold text-brand" href={`/learn/${lesson.slug}`}>{lesson.title}</Link> · <Link className="font-semibold text-exam" href={`/exam?topic=${t.slug}`}>exam questions</Link></div>}
                </li>
              );
            })}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/progress#coach" className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white">Open the weak-spot coach</Link>
            <Link href={`/exam/mock/${id}?quick=1&seed=${(seed % 997) + 1}`} className="rounded-xl border border-line px-4 py-2 text-sm font-semibold">Another quick mock</Link>
            <Button size="sm" variant="ghost" onClick={restart}><RotateCcw className="h-4 w-4" /> Write this paper again</Button>
          </div>
        </section>
      )}
      {marking && (
        <div className="sticky top-16 z-40 -mx-4 my-6 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm">Mark your script: tick each memo line you earned. Follow-on (CA) marks count.</span>
            <span className="ml-auto font-display text-xl font-bold tabular-nums">{total} / {paper.marks}</span>
            <Button size="sm" onClick={finish}>Finish marking</Button>
          </div>
        </div>
      )}
      <h2 className="mt-8 mb-3 font-display text-xl font-bold">{marking ? "Your script and the memo" : "Your marked script"}</h2>
      <QuestionPaper questions={paper.questions} render={(q, n, k) => {
        const pid = partId(q, k);
        const p = q.parts[k];
        const ticks = draft.ticks[pid] ?? p.memo.map(() => false);
        return (
          <div className="rounded-2xl border border-line bg-surface p-4">
            <PartPrompt q={q} n={n} k={k} />
            <div className="mt-2 rounded-xl bg-surface-2 p-3 font-mono text-sm whitespace-pre-wrap">{(draft.answers[pid] ?? "").trim() || <span className="text-muted">(no answer written – if you worked on paper, mark that)</span>}</div>
            <ul className="mt-2 space-y-1">
              {p.memo.map((m, i) => (
                <li key={i}>
                  <button disabled={!marking} onClick={() => toggleTick(pid, i, p.memo.length)} aria-pressed={ticks[i]}
                    className={cn("flex w-full items-start gap-2 rounded-lg px-2 py-1 text-left text-sm transition", marking && "hover:bg-surface-2", ticks[i] && "bg-success/10")}>
                    {ticks[i] ? <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-success" /> : <Square className="mt-0.5 h-4 w-4 shrink-0 text-muted" />}
                    <InlineMd md={m} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-1 text-right text-sm font-bold">{scores[pid]} / {p.marks}</div>
          </div>
        );
      }} />
      {marking && <div className="mt-8 text-center"><Button onClick={finish}>Finish marking – show my results</Button></div>}
    </div>
  );
}
