import type { Metadata } from "next";
import { Suspense } from "react";
import { WorksheetBuilder } from "@/components/pages/worksheet-builder";

export const metadata: Metadata = { title: "Worksheet generator", description: "Printable Grade 10–12 Physical Sciences worksheets with memos, generated from PhysicsMzansi's question generators." };

export default function WorksheetsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-10 text-muted">Loading…</div>}>
      <WorksheetBuilder />
    </Suspense>
  );
}
