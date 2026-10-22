import { Hero } from "@/components/home/hero";
import { AdhdSection, Features, FinalCta, LessonFlow, PracticeStrip, StrandTracks, TermMarquee, type TopicSummary } from "@/components/home/sections";
import { EXAM_QUESTIONS, GLOSSARY, LESSONS, lessonsForTopic } from "@/content";
import { WIDGET_COUNT } from "@/components/widgets/catalogue";
import { TOPICS, topicMeta } from "@/lib/topics";
import { shuffle } from "@/lib/utils";

export default function HomePage() {
  const topics: TopicSummary[] = TOPICS.map((t) => ({
    topic: t.topic,
    lessons: lessonsForTopic(t.topic).map((l) => ({ slug: l.slug, title: l.title, emoji: l.emoji })),
  }));
  const marquee = shuffle(GLOSSARY, "home").slice(0, 14).map((g) => ({ title: g.term, text: g.def, colour: topicMeta(g.topic).colour }));
  const examParts = EXAM_QUESTIONS.reduce((n, q) => n + q.parts.length, 0);
  return (
    <>
      <Hero stats={{ lessons: LESSONS.length, tools: WIDGET_COUNT, exam: examParts }} />
      <TermMarquee terms={marquee} />
      <StrandTracks topics={topics} />
      <PracticeStrip />
      <Features tools={WIDGET_COUNT} />
      <LessonFlow />
      <AdhdSection />
      <FinalCta firstSlug={LESSONS[0].slug} />
    </>
  );
}
