import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PrefsApplier, themeBootScript } from "@/components/layout/prefs-applier";
import { ReadingRuler } from "@/components/layout/reading-ruler";
import { RewardLayer } from "@/components/layout/reward-layer";
import { ProgressBootstrap } from "@/components/layout/progress-bootstrap";
import { TOPIC_INDEX } from "@/content";

export const metadata: Metadata = {
  title: { default: "PhysicsMzansi – Grade 10, 11 & 12 Physical Sciences (CAPS)", template: "%s · PhysicsMzansi" },
  description:
    "Interactive CAPS Grade 10, 11 & 12 Physical Sciences: mechanics, waves, electricity, matter and chemical change – with live simulations, virtual labs, endless practice, quizzes, flashcards, exam questions and games. ADHD-friendly and accessible.",
  applicationName: "PhysicsMzansi",
  keywords: ["Physical Sciences", "Physics", "Chemistry", "CAPS", "Grade 10", "Grade 11", "Grade 12", "NSC", "matric", "Newton's laws", "stoichiometry", "South Africa"],
  openGraph: { title: "PhysicsMzansi", description: "Grade 10–12 Physical Sciences, the interactive way.", type: "website" },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#0b0a16" }, { media: "(prefers-color-scheme: light)", color: "#f7f7fb" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-screen">
        <PrefsApplier />
        <ProgressBootstrap topicIndex={TOPIC_INDEX} />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <ReadingRuler />
        <RewardLayer />
      </body>
    </html>
  );
}
