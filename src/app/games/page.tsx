import type { Metadata } from "next";
import { GLOSSARY } from "@/content";
import { Games } from "@/components/pages/games";

export const metadata: Metadata = { title: "Games room", description: "Speed Solve, Element Quest, formula pairs, true/false blitz, odd one out and science hangman." };

export default function GamesPage() {
  return <Games terms={GLOSSARY.map(({ term, def, topic }) => ({ term, def, topic }))} />;
}
