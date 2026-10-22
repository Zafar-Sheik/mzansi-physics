"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CheckCircle2, Clock, Hourglass, Search } from "lucide-react";
import type { Grade, Topic } from "@/content/types";
import { Chip } from "@/components/ui/chip";
import { ProgressBar } from "@/components/ui/progress-bar";
import { GlowCard } from "@/components/aceternity/glow-card";
import { useProgress } from "@/lib/progress";
import { STRANDS, TOPICS, topicMeta } from "@/lib/topics";
import { cn } from "@/lib/utils";

export interface LessonSummary {
  slug: string;
  topic: Topic;
  title: string;
  tagline: string;
  emoji: string;
  minutes: number;
  chunks: number;
  xp: number;
  caps: string;
}

/** Lesson roadmap with grade tabs, strand and topic filters, search and progress. */
export function LearnBrowser({ lessons }: { lessons: LessonSummary[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const topicParam = TOPICS.find((t) => t.slug === params.get("topic"));
  const gradeParam = params.get("grade");
  const grade: Grade | null = topicParam ? topicParam.grade : gradeParam === "10" ? 10 : gradeParam === "11" ? 11 : gradeParam === "12" ? 12 : null;
  const strand = topicParam ? STRANDS.find((s) => s.strand === topicParam.strand)! : STRANDS.find((s) => s.slug === params.get("strand")) ?? null;
  const topic = topicParam?.topic ?? null;
  const [q, setQ] = useState("");
  const progress = useProgress();

  const go = (g: Grade | null, st: string | null, t: string | null) => {
    const sp = new URLSearchParams();
    if (g) sp.set("grade", String(g));
    if (st) sp.set("strand", st);
    if (t) sp.set("topic", t);
    router.replace(sp.size ? `/learn?${sp}` : "/learn", { scroll: false });
  };

  const topicsInView = TOPICS.filter((t) => (!grade || t.grade === grade) && (!strand || t.strand === strand.strand));
  const shown = useMemo(
    () => lessons.filter((l) => {
      const m = topicMeta(l.topic);
      return (!grade || m.grade === grade) && (!strand || m.strand === strand.strand) && (!topic || l.topic === topic) && (!q || `${l.title} ${l.tagline} ${l.caps} ${m.title}`.toLowerCase().includes(q.toLowerCase()));
    }),
    [lessons, grade, strand, topic, q],
  );
  const comingSoon = topicsInView.filter((t) => (!topic || t.topic === topic) && !lessons.some((l) => l.topic === t.topic));
  const nextUp = shown.find((l) => !progress.completedLessons[l.slug]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold tracking-tight">Lessons</h1>
      <p className="mt-2 max-w-2xl text-lg text-muted">Pick your grade and a knowledge area, or just continue with the next lesson. Every lesson is split into small steps – stop after any step and carry on later.</p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {([null, 10, 11, 12] as const).map((g) => (
          <button key={String(g)} onClick={() => go(g, strand?.slug ?? null, null)}
            className={cn("rounded-xl px-4 py-2 text-sm font-bold transition", grade === g ? "bg-brand text-white shadow-lg" : "bg-surface-2 text-muted hover:text-fg")}>
            {g ? `Grade ${g}` : "All grades"}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2">
          <Search className="h-4 w-4 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search lessons…" className="w-40 bg-transparent text-sm outline-none" aria-label="Search lessons" />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Chip active={!strand} onClick={() => go(grade, null, null)}>All areas</Chip>
        {STRANDS.map((s) => <Chip key={s.strand} active={strand?.strand === s.strand && !topic} onClick={() => go(grade, s.slug, null)}>{s.emoji} {s.strand}</Chip>)}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {topicsInView.map((t) => (
          <Chip key={t.topic} colour={topic === t.topic ? undefined : t.colour} active={topic === t.topic} onClick={() => go(t.grade, null, topic === t.topic ? null : t.slug)}>
            {t.emoji} {grade ? "" : `Gr ${t.grade} · `}{t.title}
          </Chip>
        ))}
      </div>

      {nextUp && (
        <Link href={`/learn/${nextUp.slug}`} className="mt-6 flex items-center gap-4 rounded-2xl border border-brand/40 bg-brand-soft/60 p-4 transition hover:shadow-lg">
          <span className="text-3xl">{nextUp.emoji}</span>
          <span className="flex-1">
            <span className="block text-xs font-bold tracking-wider text-brand uppercase">Up next for you</span>
            <span className="font-display text-lg font-bold">{nextUp.title}</span>
          </span>
          <span className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white">Continue</span>
        </Link>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((l) => {
          const read = progress.chunks[l.slug]?.length ?? 0;
          const done = Boolean(progress.completedLessons[l.slug]);
          const m = topicMeta(l.topic);
          return (
            <Link key={l.slug} href={`/learn/${l.slug}`} className="group">
              <GlowCard colour={m.colour} className="h-full p-5 transition group-hover:-translate-y-0.5 group-hover:shadow-xl">
                <div className="flex items-center justify-between gap-2">
                  <Chip colour={m.colour}>Gr {m.grade} · {m.title}</Chip>
                  {done ? <span className="flex items-center gap-1 text-xs font-bold text-success"><CheckCircle2 className="h-4 w-4" /> Done</span> : <span className="text-xs text-muted">+{l.xp} XP</span>}
                </div>
                <div className="mt-3 text-3xl">{l.emoji}</div>
                <h2 className="mt-2 font-display text-lg leading-tight font-bold">{l.title}</h2>
                <p className="mt-1 text-sm text-muted">{l.tagline}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{l.minutes} min</span>
                  <span>{l.chunks} steps</span>
                  <span>{m.paper === 1 ? "Physics" : "Chemistry"}</span>
                </div>
                <ProgressBar className="mt-3" value={done ? l.chunks : read} max={l.chunks} colour={m.colour} label={`${l.title} progress`} />
              </GlowCard>
            </Link>
          );
        })}
        {!q && comingSoon.map((t) => (
          <div key={t.topic} className="flex h-full flex-col rounded-2xl border-2 border-dashed border-line p-5 opacity-80">
            <div className="flex items-center justify-between gap-2">
              <Chip colour={t.colour}>Gr {t.grade} · {t.strand}</Chip>
              <span className="flex items-center gap-1 text-xs font-bold text-muted"><Hourglass className="h-3.5 w-3.5" /> Soon</span>
            </div>
            <div className="mt-3 text-3xl grayscale">{t.emoji}</div>
            <h2 className="mt-2 font-display text-lg leading-tight font-bold">{t.title}</h2>
            <p className="mt-1 text-sm text-muted">{t.blurb}</p>
            <p className="mt-auto pt-4 text-xs font-semibold text-muted">Coming soon – we&apos;re building it.</p>
          </div>
        ))}
      </div>
      {shown.length === 0 && q && <p className="mt-10 text-center text-muted">No lessons match – try another search.</p>}
    </div>
  );
}
