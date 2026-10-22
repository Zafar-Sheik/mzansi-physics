"use client";
import { useState } from "react";
import { Widget } from "@/components/widgets";
import { WIDGET_CATALOGUE } from "@/components/widgets/catalogue";
import { Chip } from "@/components/ui/chip";
import type { Grade, Strand } from "@/content/types";
import { STRANDS, topicMeta } from "@/lib/topics";
import { cn } from "@/lib/utils";

/** All simulations and virtual labs in one place – handy for revision and for teachers projecting in class. */
export function Toolkit() {
  const [active, setActive] = useState(WIDGET_CATALOGUE[0].title);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [strand, setStrand] = useState<Strand | null>(null);
  const list = WIDGET_CATALOGUE.filter((w) => (!grade || topicMeta(w.topic).grade === grade || w.grades?.includes(grade)) && (!strand || topicMeta(w.topic).strand === strand));
  const current = WIDGET_CATALOGUE.find((w) => w.title === active)!;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold tracking-tight">Virtual lab &amp; toolkit</h1>
      <p className="mt-2 max-w-2xl text-lg text-muted">Every simulation from the lessons – motion, waves, circuits, atoms, reactions – plus the data sheets and endless drills. Play, break things, and see the physics. Teachers: project these on the board.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {([null, 10, 11, 12] as const).map((g) => (
          <button key={String(g)} onClick={() => setGrade(g)} aria-pressed={grade === g} className={cn("rounded-xl px-3 py-1.5 text-sm font-bold", grade === g ? "bg-brand text-white" : "bg-surface-2 text-muted hover:text-fg")}>{g ? `Grade ${g}` : "All grades"}</button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Chip active={!strand} onClick={() => setStrand(null)}>All areas</Chip>
        {STRANDS.map((s) => <Chip key={s.strand} colour={strand === s.strand ? undefined : s.colour} active={strand === s.strand} onClick={() => setStrand(s.strand)}>{s.emoji} {s.short}</Chip>)}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <ul className="flex gap-1 overflow-x-auto no-scrollbar lg:block lg:max-h-[75vh] lg:space-y-1 lg:overflow-y-auto">
          {list.map((w) => (
            <li key={w.title} className="shrink-0">
              <button onClick={() => setActive(w.title)} className={cn("w-56 rounded-xl border px-3 py-2 text-left transition lg:w-full", w.title === active ? "border-brand bg-brand-soft" : "border-transparent hover:bg-surface-2")}>
                <span className="flex items-center gap-2 text-sm font-semibold"><span className="h-2 w-2 shrink-0 rounded-full" style={{ background: topicMeta(w.topic).colour }} />{w.title}</span>
                <span className="block text-xs text-muted">{w.description}</span>
              </button>
            </li>
          ))}
          {list.length === 0 && <li className="p-3 text-sm text-muted">No tools for that filter yet.</li>}
        </ul>
        <div key={current.title} className="min-w-0"><Widget name={current.name} props={current.props} /></div>
      </div>
    </div>
  );
}
