import type { Metadata } from "next";
import { GLOSSARY, LIVE_TOPICS, lessonsForTopic, masteryIndex } from "@/content";
import { ProgressDashboard, type TopicLessons } from "@/components/pages/progress-dashboard";
import { TOPICS } from "@/lib/topics";

export const metadata: Metadata = { title: "Your progress" };

export default function ProgressPage() {
  const topics: TopicLessons[] = TOPICS.filter((t) => LIVE_TOPICS.includes(t.topic)).map((t) => ({ topic: `Gr ${t.grade} · ${t.title}`, colour: t.colour, emoji: t.emoji, lessons: lessonsForTopic(t.topic).map((l) => ({ slug: l.slug, title: l.title, emoji: l.emoji })) }));
  return <ProgressDashboard topics={topics} cardTotal={GLOSSARY.length} mastery={masteryIndex()} />;
}
