import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Brain, FileText, Map, Palette, Presentation, Printer, ShieldCheck, Timer, Wrench } from "lucide-react";
import { DOCS } from "@/lib/docs";
import { EXAM_QUESTIONS, GLOSSARY, LESSONS, QUESTION_BANK } from "@/content";
import { WIDGET_COUNT } from "@/components/widgets/catalogue";
import { GlowCard } from "@/components/aceternity/glow-card";
import { GENERATORS } from "@/lib/sci/generators";

export const metadata: Metadata = { title: "Teacher Guide", description: "How to use PhysicsMzansi with Grade 10, 11 & 12 Physical Sciences classes – CAPS curriculum map, learning design, ADHD and learning-support, and technical documentation." };

const ICONS: Record<string, React.ReactNode> = {
  overview: <BookOpen className="h-5 w-5" />, "teacher-quick-start": <Presentation className="h-5 w-5" />, "curriculum-map": <FileText className="h-5 w-5" />,
  "learning-design": <Brain className="h-5 w-5" />, "adhd-accessibility": <Brain className="h-5 w-5" />, "design-system": <Palette className="h-5 w-5" />,
  architecture: <Wrench className="h-5 w-5" />, "content-authoring": <FileText className="h-5 w-5" />, "testing-deployment": <Wrench className="h-5 w-5" />,
  "privacy-security": <ShieldCheck className="h-5 w-5" />, faq: <BookOpen className="h-5 w-5" />, "data-sheets": <Map className="h-5 w-5" />,
};

export default function TeachersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="rounded-[2rem] border border-line bg-gradient-to-br from-brand/15 via-surface to-waves/10 p-8 md:p-12">
        <p className="text-sm font-bold tracking-wider text-brand uppercase">For Physical Sciences teachers</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">Teacher Guide</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">
          Everything you need to use PhysicsMzansi with your Grade 10, 11 and 12 classes: how lessons map to CAPS and the two papers, the learning
          science behind the simulations, how the ADHD and learning-support features work, and full technical documentation.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-surface px-3 py-1 font-semibold">{LESSONS.length} lessons</span>
          <span className="rounded-full bg-surface px-3 py-1 font-semibold">{WIDGET_COUNT} simulations &amp; virtual labs</span>
          <span className="rounded-full bg-surface px-3 py-1 font-semibold">{GLOSSARY.length} key terms &amp; formulas</span>
          <span className="rounded-full bg-surface px-3 py-1 font-semibold">{GENERATORS.length} question generators</span>
          <span className="rounded-full bg-surface px-3 py-1 font-semibold">{QUESTION_BANK.length} quiz questions</span>
          <span className="rounded-full bg-surface px-3 py-1 font-semibold">{EXAM_QUESTIONS.length} exam questions</span>
          <span className="rounded-full bg-surface px-3 py-1 font-semibold">No accounts · no tracking</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/teachers/docs/teacher-quick-start" className="rounded-xl bg-brand px-5 py-2.5 font-semibold text-white">Read the 10-minute quick-start</Link>
          <Link href="/teachers/docs/curriculum-map" className="rounded-xl border border-line bg-surface px-5 py-2.5 font-semibold">CAPS curriculum map</Link>
          <Link href="/toolkit" className="rounded-xl border border-line bg-surface px-5 py-2.5 font-semibold">Virtual lab</Link>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Link href="/teachers/worksheets">
          <GlowCard colour="var(--t-elec)" className="h-full p-5 transition hover:-translate-y-0.5">
            <div className="flex items-center gap-2 text-brand"><Printer className="h-5 w-5" /><span className="text-xs font-bold tracking-wider text-muted uppercase">Classroom tool</span></div>
            <h2 className="mt-2 font-display text-xl font-bold">Worksheet generator</h2>
            <p className="mt-1 text-sm text-muted">Printable worksheets with a full memo from {GENERATORS.length} question generators – a new set every time, or the same set from a shared link.</p>
          </GlowCard>
        </Link>
        <Link href="/exam/mock">
          <GlowCard colour="var(--t-mech)" className="h-full p-5 transition hover:-translate-y-0.5">
            <div className="flex items-center gap-2 text-exam"><Timer className="h-5 w-5" /><span className="text-xs font-bold tracking-wider text-muted uppercase">Exam preparation</span></div>
            <h2 className="mt-2 font-display text-xl font-bold">Mock papers</h2>
            <p className="mt-1 text-sm text-muted">Timed Paper 1 (Physics) and Paper 2 (Chemistry) mocks for Grades 10, 11 and 12 – write in class or at home, print the paper and memo, or let learners self-mark online.</p>
          </GlowCard>
        </Link>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DOCS.map((d) => (
          <Link key={d.slug} href={`/teachers/docs/${d.slug}`}>
            <GlowCard className="h-full p-5 transition hover:-translate-y-0.5">
              <div className="flex items-center gap-2 text-brand">{ICONS[d.slug]}<span className="text-xs font-bold tracking-wider text-muted uppercase">{d.group}</span></div>
              <h2 className="mt-2 font-display text-lg font-bold">{d.title}</h2>
            </GlowCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
