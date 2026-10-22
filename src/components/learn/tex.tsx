import katex from "katex";
import { cn } from "@/lib/utils";

/** Render a LaTeX string with KaTeX. Used by widgets for live formulas. */
export function Tex({ tex, display = false, className }: { tex: string; display?: boolean; className?: string }) {
  const html = katex.renderToString(tex, { throwOnError: false, displayMode: display, strict: false });
  return <span className={cn(display && "block overflow-x-auto", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
