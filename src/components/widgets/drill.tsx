"use client";
import { useEffect, useMemo, useState } from "react";
import { Flame, SkipForward, Zap } from "lucide-react";
import { getGenerator, GENERATORS } from "@/lib/sci/generators";
import { addXp, bumpStat, recordDrill } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { ProblemCard } from "@/components/sci/problem-card";
import { Segmented, WidgetFrame } from "./widget-frame";

/**
 * Endless practice: a fresh, randomly generated problem every time, checked
 * instantly, with full working. Streaks earn bonus XP.
 */
export function Drill({ generators = GENERATORS.map((g) => g.id), title = "Endless drill" }: { generators?: string[]; title?: string }) {
  const gens = useMemo(() => generators.map(getGenerator).filter((g): g is NonNullable<typeof g> => Boolean(g)), [generators]);
  const [gen, setGen] = useState(gens[0]?.id ?? "");
  const [seed, setSeed] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({ right: 0, tried: 0, streak: 0, best: 0 });
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 1e9));
    setMounted(true);
  }, []);

  const g = gens.find((x) => x.id === gen) ?? gens[0];
  const problem = useMemo(() => g?.make(seed), [g, seed]);
  if (!g || !problem) return null;

  const onResult = ({ correct, firstTry }: { correct: boolean; firstTry: boolean }) => {
    setAnswered(true);
    recordDrill(g.topic, correct && firstTry);
    if (correct) bumpStat("calculations");
    setStats((s) => {
      const streak = correct && firstTry ? s.streak + 1 : 0;
      if (correct && firstTry) addXp(streak % 5 === 0 ? 15 : 3, streak % 5 === 0 ? `Drill streak ×${streak}` : "Drill");
      return { right: s.right + (correct ? 1 : 0), tried: s.tried + 1, streak, best: Math.max(s.best, streak) };
    });
  };
  const next = () => {
    if (!answered) setStats((s) => ({ ...s, streak: 0 }));
    setAnswered(false);
    setSeed((s) => s + 7919);
  };

  return (
    <WidgetFrame title={title} colour="var(--brand)" instruction="A brand-new question every time. Get it right first time to build a streak – every 5 in a row is a bonus.">
      {gens.length > 1 && <Segmented colour="var(--brand)" value={g.id} onChange={(id) => { setGen(id); setAnswered(false); setSeed((s) => s + 1); }} options={gens.map((x) => ({ id: x.id, label: x.title }))} />}
      <div className="my-3 flex flex-wrap items-center gap-3 text-sm">
        <span className="flex items-center gap-1 font-semibold"><Zap className="h-4 w-4 text-brand" /> {stats.right}/{stats.tried} correct</span>
        <span className="flex items-center gap-1 font-semibold"><Flame className={stats.streak >= 3 ? "h-4 w-4 text-exam" : "h-4 w-4 text-muted"} /> streak {stats.streak}</span>
        <span className="text-muted">best {stats.best}</span>
      </div>
      {mounted ? (
        <ProblemCard key={`${g.id}-${seed}`} problem={problem} onResult={onResult}
          footer={<Button size="sm" variant={answered ? "primary" : "secondary"} className="ml-auto" onClick={next}><SkipForward className="h-4 w-4" /> {answered ? "Next question" : "Skip"}</Button>} />
      ) : (
        <div className="h-48 animate-pulse rounded-2xl bg-surface-2" />
      )}
    </WidgetFrame>
  );
}
