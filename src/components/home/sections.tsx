"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { Accessibility, ArrowRight, Atom, Brain, FlaskConical, Gamepad2, GraduationCap, Infinity as InfinityIcon, Layers, NotebookPen, PartyPopper, PenLine, Sparkles, Swords, Timer, Trophy } from "lucide-react";
import type { Grade, Topic } from "@/content/types";
import { CardBody, CardContainer, CardItem } from "@/components/aceternity/card-3d";
import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid";
import { InfiniteMovingCards } from "@/components/aceternity/infinite-moving-cards";
import { Meteors } from "@/components/aceternity/meteors";
import { GlowCard } from "@/components/aceternity/glow-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProgressBar } from "@/components/ui/progress-bar";
import { gsap, motionAllowed, useGSAP } from "@/lib/gsap";
import { useProgress } from "@/lib/progress";
import { setPrefs, usePrefs } from "@/lib/prefs";
import { PAPER_INFO, STRANDS, TOPICS } from "@/lib/topics";
import { cn } from "@/lib/utils";

export interface TopicSummary {
  topic: Topic;
  lessons: { slug: string; title: string; emoji: string }[];
}

/** Six knowledge areas × three grades. */
export function StrandTracks({ topics }: { topics: TopicSummary[] }) {
  const progress = useProgress();
  const [grade, setGrade] = useState<Grade>(12);
  return (
    <section className="mx-auto max-w-7xl px-4 py-20" aria-labelledby="tracks">
      <SectionHeading eyebrow="Six knowledge areas · three grades" title={<span id="tracks">The whole CAPS syllabus</span>} description="Every lesson follows the CAPS Grade 10, 11 and 12 Physical Sciences content and the exam guidelines – Paper 1 (Physics) and Paper 2 (Chemistry), every topic." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {STRANDS.map((st) => {
          const mine = TOPICS.filter((t) => t.strand === st.strand);
          const live = topics.filter((t) => mine.some((m) => m.topic === t.topic) && t.lessons.length);
          const all = live.flatMap((t) => t.lessons);
          const done = all.filter((l) => progress.completedLessons[l.slug]).length;
          const papers = [...new Set(mine.map((t) => t.paper))];
          return (
            <CardContainer key={st.strand} className="w-full" containerClassName="w-full">
              <CardBody className="relative h-full w-full overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-sm">
                <CardItem translateZ={40} className="w-full">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: st.colour }}>{papers.length > 1 ? "Physics & Chemistry" : papers[0] === 1 ? "Paper 1 · Physics" : "Paper 2 · Chemistry"}</span>
                    <span className="text-xs text-muted">{all.length ? `${done}/${all.length} lessons done` : "coming soon"}</span>
                  </div>
                </CardItem>
                <CardItem translateZ={60} className="mt-4">
                  <h3 className="font-display text-2xl font-bold">{st.emoji} {st.strand}</h3>
                  <p className="mt-1 text-sm text-muted">{st.blurb}</p>
                </CardItem>
                <CardItem translateZ={30} className="mt-4 w-full">
                  {([10, 11, 12] as const).filter((g) => mine.some((t) => t.grade === g)).map((g) => (
                    <div key={g} className="mt-2">
                      <div className="text-xs font-bold tracking-wider text-muted uppercase">Grade {g}</div>
                      <ul className="mt-1 space-y-1">
                        {mine.filter((t) => t.grade === g).map((t) => {
                          const n = topics.find((x) => x.topic === t.topic)?.lessons.length ?? 0;
                          return (
                            <li key={t.topic} className="flex items-center gap-2 text-sm">
                              <span aria-hidden>{t.emoji}</span>
                              {n ? <Link href={`/learn?topic=${t.slug}`} className="font-medium hover:underline">{t.title}</Link> : <span className="text-muted">{t.title}</span>}
                              <span className={cn("ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold", n ? "bg-success/15 text-success" : "bg-surface-2 text-muted")}>{n ? `${n} lesson${n > 1 ? "s" : ""}` : "soon"}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </CardItem>
                <CardItem translateZ={50} className="mt-5 w-full">
                  <ProgressBar value={done} max={Math.max(1, all.length)} colour={st.colour} label={`${st.strand} progress`} />
                  {all.length > 0 && (
                    <Link href={`/learn?strand=${st.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: st.colour }}>
                      {done ? "Continue" : "Start"} {st.strand} <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </CardItem>
              </CardBody>
            </CardContainer>
          );
        })}
      </div>
      <div className="mt-6 rounded-3xl border border-dashed border-line p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="mr-auto font-display text-xl font-bold">How the exam is built</h3>
          {([10, 11, 12] as const).map((g) => (
            <button key={g} onClick={() => setGrade(g)} aria-pressed={grade === g} className={cn("rounded-lg px-3 py-1 text-sm font-bold", grade === g ? "bg-brand text-white" : "bg-surface-2 text-muted")}>Grade {g}</button>
          ))}
        </div>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {([1, 2] as const).map((p) => (
            <div key={p}>
              <div className="text-sm font-bold">{PAPER_INFO[grade][p].title} <span className="font-normal text-muted">· {PAPER_INFO[grade][p].duration} · {PAPER_INFO[grade][p].marks} marks</span></div>
              <ul className="mt-1 space-y-0.5 text-sm text-muted">
                {PAPER_INFO[grade][p].sections.map((sec) => <li key={sec.name}>{sec.name} – <strong className="text-fg">±{sec.marks}</strong></li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">Approximate marks per knowledge area from the DBE examination guidelines. Always check the latest guidelines with your teacher.</p>
      </div>
    </section>
  );
}

function MiniHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("relative flex h-full min-h-28 w-full flex-1 overflow-hidden rounded-xl", className)}>{children}</div>;
}

export function Features({ tools }: { tools: number }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20" aria-labelledby="features">
      <SectionHeading eyebrow="Why it sticks" title={<span id="features">Science is a doing subject</span>} description="You don't learn science by copying notes. Every idea comes with a simulation to play with, a virtual experiment to run or a question to answer – with instant feedback." />
      <BentoGrid className="md:auto-rows-[20rem]">
        <BentoGridItem
          className="md:col-span-2"
          title={`${tools} simulations & virtual labs`}
          description="Crash trolleys and watch momentum, bend light until it reflects totally, build circuits, drop atoms into a gas box, balance equations, titrate an acid and build a galvanic cell. No lab? No problem – and nothing can explode."
          icon={<FlaskConical className="h-5 w-5 text-brand" />}
          header={
            <MiniHeader className="items-center justify-around bg-gradient-to-br from-mech/15 via-waves/10 to-change/15 p-4">
              {["🚀", "🌊", "⚡", "⚛️", "🧪"].map((e, k) => <span key={k} className="grid h-14 w-14 place-items-center rounded-2xl bg-surface/80 text-3xl shadow">{e}</span>)}
            </MiniHeader>
          }
        />
        <BentoGridItem
          title="Questions that never run out"
          description="Every skill has a question generator: a brand-new problem each time, checked instantly, with the full working. Build a streak."
          icon={<InfinityIcon className="h-5 w-5 text-memory" />}
          header={
            <MiniHeader className="flex-col justify-center gap-1 bg-memory/10 p-4 font-mono text-sm">
              <div>A 2 kg ball moves at 3 m·s⁻¹. Eₖ = ?</div>
              <div className="rounded-lg border-2 border-success bg-surface px-2 py-1">9 J</div>
              <div className="text-success">Sharp sharp! ✅ 🔥 streak 5</div>
            </MiniHeader>
          }
        />
        <BentoGridItem
          title="Exam Room with memos"
          description="Exam-style questions for Physics and Chemistry. Do the working first, then tick off the memo – formula, substitution, answer with unit – just like the real markers."
          icon={<NotebookPen className="h-5 w-5 text-exam" />}
          header={<MiniHeader className="flex-col justify-center gap-1 bg-exam/10 p-3 font-mono text-xs"><div>3.2 Calculate the maximum height reached. (3)</div><div className="text-success">✓ v_f² = v_i² + 2aΔy</div><div className="text-success">✓ 0 = 15² + 2(−9,8)Δy ✓ 11,48 m</div></MiniHeader>}
        />
        <BentoGridItem
          className="md:col-span-2"
          title="Built for ADHD (and helpful for everyone)"
          description="One idea per screen, worked examples revealed a step at a time, visible progress, focus sprints with brain breaks, a reading ruler, dyslexia-friendly fonts, read-aloud (it even reads the formulas!), simulations that wait for you to press Play, and a calm mode."
          icon={<Brain className="h-5 w-5 text-memory" />}
          header={
            <MiniHeader className="items-center gap-3 bg-gradient-to-r from-memory/15 via-brand/10 to-waves/15 p-4">
              {[[<Timer key="t" className="h-5 w-5" />, "Focus sprints"], [<Accessibility key="a" className="h-5 w-5" />, "Fonts & sizes"], [<Sparkles key="s" className="h-5 w-5" />, "Calm mode"], [<Trophy key="tr" className="h-5 w-5" />, "XP & badges"]].map(([ic, t], k) => (
                <div key={k} className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-surface/80 p-3 text-center text-xs font-semibold">{ic}{t}</div>
              ))}
            </MiniHeader>
          }
        />
      </BentoGrid>
    </section>
  );
}

const STEPS = [
  { icon: <Sparkles className="h-5 w-5" />, title: "Hook", text: "Every lesson starts with something real – a taxi braking, load-shedding, a braai, the Gautrain, gold mines, Koeberg – so you know WHY it matters.", colour: "var(--brand)" },
  { icon: <Atom className="h-5 w-5" />, title: "See it", text: "A live simulation makes the idea click: collide the trolleys, tilt the slope, heat the gas, watch the electrons flow.", colour: "var(--t-waves)" },
  { icon: <PenLine className="h-5 w-5" />, title: "Do it", text: "Worked examples revealed one step at a time – predict the next line first – then your turn with typed answers (units welcome) and hints.", colour: "var(--t-mech)" },
  { icon: <Brain className="h-5 w-5" />, title: "Check it", text: "Quick quizzes and flashcards use active recall – the most effective way to remember.", colour: "var(--memory)" },
  { icon: <GraduationCap className="h-5 w-5" />, title: "Exam it", text: "Answer real exam-style questions and mark yourself against the memo – method marks included.", colour: "var(--exam)" },
  { icon: <PartyPopper className="h-5 w-5" />, title: "Celebrate", text: "XP, levels, streaks and badges reward effort – not just being right.", colour: "var(--t-systems)" },
];

/** "How a lesson works" – a vertical timeline revealed with GSAP ScrollTrigger. */
export function LessonFlow() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!ref.current || !motionAllowed()) return;
    gsap.fromTo(ref.current.querySelector("[data-line]"), { scaleY: 0 }, {
      scaleY: 1, ease: "none", transformOrigin: "top",
      scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 60%", scrub: true },
    });
    ref.current.querySelectorAll("[data-step]").forEach((el) => {
      gsap.from(el, { opacity: 0, x: -30, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%" } });
    });
  }, { scope: ref });
  return (
    <section className="mx-auto max-w-4xl px-4 py-20" aria-labelledby="flow">
      <SectionHeading eyebrow="Inside every lesson" title={<span id="flow">Six small steps. No walls of text.</span>} description="Lessons are split into 3–10 minute chunks with a clear Next button – perfect for short attention spans and busy school schedules." />
      <div ref={ref} className="relative pl-10">
        <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-line" aria-hidden />
        <div data-line className="absolute top-0 bottom-0 left-4 w-0.5 bg-gradient-to-b from-brand via-waves to-mech" aria-hidden />
        <ol className="space-y-8">
          {STEPS.map((s, i) => (
            <li key={s.title} data-step className="relative">
              <span className="absolute top-1 -left-10 grid h-8 w-8 place-items-center rounded-full text-white shadow-lg" style={{ background: s.colour }}>{s.icon}</span>
              <GlowCard colour={s.colour} className="p-5">
                <div className="text-xs font-bold text-muted">STEP {i + 1}</div>
                <h3 className="font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-1 text-muted">{s.text}</p>
              </GlowCard>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function TermMarquee({ terms }: { terms: { title: string; text: string; colour: string }[] }) {
  return (
    <section className="py-10" aria-label="Key concepts covered">
      <InfiniteMovingCards items={terms} speed="slow" />
    </section>
  );
}

export function PracticeStrip() {
  const items = [
    { href: "/flashcards", icon: <Layers className="h-6 w-6" />, title: "Flashcards", text: "Spaced repetition of every formula and concept", colour: "var(--memory)" },
    { href: "/quiz", icon: <Swords className="h-6 w-6" />, title: "Quiz Arena", text: "Mixed-topic rounds, timed or relaxed", colour: "var(--t-waves)" },
    { href: "/exam", icon: <NotebookPen className="h-6 w-6" />, title: "Exam Room", text: "Exam-style questions with marking memos", colour: "var(--exam)" },
    { href: "/games", icon: <Gamepad2 className="h-6 w-6" />, title: "Games", text: "Speed Solve, Element Quest, formula pairs", colour: "var(--t-mech)" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-10" aria-label="Practice modes">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <Link key={it.href} href={it.href} className="group">
            <GlowCard colour={it.colour} className="h-full p-5 transition group-hover:-translate-y-0.5">
              <span className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ background: it.colour }}>{it.icon}</span>
              <h3 className="mt-3 font-display text-lg font-bold">{it.title}</h3>
              <p className="text-sm text-muted">{it.text}</p>
            </GlowCard>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function AdhdSection() {
  const prefs = usePrefs();
  return (
    <section className="mx-auto max-w-7xl px-4 py-20" aria-labelledby="adhd">
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-surface p-8 md:p-12">
        <Meteors number={18} />
        <div className="relative grid gap-10 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-bold tracking-wider text-memory uppercase">Every brain is welcome</p>
            <h2 id="adhd" className="font-display text-3xl font-bold md:text-4xl">Your brain, your settings</h2>
            <p className="mt-3 text-lg text-muted">
              ADHD brains thrive on <strong className="text-fg">novelty, quick feedback and clear next steps</strong>, and struggle with walls of text and hidden progress.
              PhysicsMzansi is designed around that – and you can tune it right now:
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              <li>🧩 <strong>Chunked lessons</strong> – one idea per screen, worked examples one step at a time</li>
              <li>⏱️ <strong>Focus sprints</strong> – 5/10/15/25 minute timer with movement breaks</li>
              <li>🎯 <strong>Instant feedback</strong> – sort, match and quiz with immediate answers and XP</li>
              <li>🎨 <strong>Consistent colours</strong> – Mechanics is orange, Waves teal, Electricity gold, Matter green, Chemical change pink; red always means a mistake, pink a memory hook</li>
              <li>🧪 <strong>Simulations you control</strong> – nothing moves until you press Play, and every lab explains what is happening in plain words</li>
              <li>🔊 <strong>Read aloud</strong>, reading ruler, word anchors and dyslexia-friendly fonts</li>
            </ul>
          </div>
          <div className="grid content-center gap-3">
            {([
              ["stepMode", "One step at a time", "Show lessons chunk by chunk"],
              ["calm", "Calm mode", "No moving backgrounds"],
              ["ruler", "Reading ruler", "A band that follows your pointer"],
              ["wordAnchors", "Word anchors", "Bold the start of each word"],
            ] as const).map(([k, t, d]) => (
              <button key={k} onClick={() => setPrefs({ [k]: !prefs[k] })} aria-pressed={prefs[k]}
                className={cn("flex items-center justify-between rounded-2xl border p-4 text-left transition", prefs[k] ? "border-brand bg-brand-soft" : "border-line bg-surface-2 hover:border-brand/40")}>
                <span><span className="block font-semibold">{t}</span><span className="text-sm text-muted">{d}</span></span>
                <span className={cn("h-6 w-11 rounded-full p-0.5 transition", prefs[k] ? "bg-brand" : "bg-line")}><span className={cn("block h-5 w-5 rounded-full bg-white shadow transition", prefs[k] && "translate-x-5")} /></span>
              </button>
            ))}
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface-2 p-4">
              <span className="mr-auto font-semibold">Reading font</span>
              {(["default", "atkinson", "dyslexic"] as const).map((f) => (
                <button key={f} onClick={() => setPrefs({ font: f })} aria-pressed={prefs.font === f} className={cn("rounded-lg px-2.5 py-1 text-sm", prefs.font === f ? "bg-brand text-white" : "bg-surface")} style={{ fontFamily: f === "atkinson" ? "Atkinson Hyperlegible" : f === "dyslexic" ? "OpenDyslexic" : undefined }}>
                  {f === "default" ? "Inter" : f === "atkinson" ? "Atkinson" : "Dyslexic"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FinalCta({ firstSlug }: { firstSlug: string }) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-center">
      <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Ready to make science make sense?</h2>
      <p className="mx-auto mt-4 max-w-xl text-lg text-muted">No installs, no sign-up. It runs entirely in your browser – even on a phone.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={`/learn/${firstSlug}`} className="inline-flex items-center gap-2 rounded-2xl bg-brand px-6 py-3 font-semibold text-white shadow-xl shadow-brand/30 transition hover:brightness-110">Start lesson 1 <ArrowRight className="h-4 w-4" /></Link>
        <Link href="/toolkit" className="inline-flex items-center gap-2 rounded-2xl border border-line px-6 py-3 font-semibold transition hover:border-brand/50"><FlaskConical className="h-4 w-4" /> Open the virtual lab</Link>
        <Link href="/teachers" className="inline-flex items-center gap-2 rounded-2xl border border-line px-6 py-3 font-semibold transition hover:border-brand/50"><GraduationCap className="h-4 w-4" /> I&apos;m a teacher</Link>
      </div>
    </section>
  );
}
