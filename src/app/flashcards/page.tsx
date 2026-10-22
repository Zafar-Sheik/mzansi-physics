import type { Metadata } from "next";
import { Suspense } from "react";
import { GLOSSARY } from "@/content";
import { FlashcardDeck } from "@/components/pages/flashcard-deck";

export const metadata: Metadata = { title: "Flashcards", description: "Spaced-repetition flashcards for every Grade 10–12 Physical Sciences definition, law and formula." };

export default function FlashcardsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-10 text-muted">Loading cards…</div>}>
      <FlashcardDeck terms={GLOSSARY} />
    </Suspense>
  );
}
