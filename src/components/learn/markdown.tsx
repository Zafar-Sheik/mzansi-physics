"use client";
import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { usePrefs } from "@/lib/prefs";

/** Bold the first half of each word ("word anchors") – some ADHD/dyslexic readers find it guides the eye. Never touches maths. */
function anchor(node: ReactNode): ReactNode {
  if (typeof node === "string") {
    return node.split(/(\s+)/).map((w, i) => {
      if (!w.trim() || w.length < 2) return w;
      const k = Math.ceil(w.length / 2);
      return <span key={i}><b className="font-bold">{w.slice(0, k)}</b>{w.slice(k)}</span>;
    });
  }
  if (Array.isArray(node)) return node.map((n, i) => <span key={i}>{anchor(n)}</span>);
  if (isValidElement<{ children?: ReactNode; className?: string }>(node) && node.type !== "code" && !String(node.props.className ?? "").includes("katex")) {
    return cloneElement(node, undefined, Children.map(node.props.children, anchor));
  }
  return node;
}

/** Markdown with GitHub tables and LaTeX maths: `$x^2$` inline, `$$…$$` on its own line. */
/**
 * remark-math only treats $$…$$ as display maths when it sits on its own
 * lines. Generated solutions chain several on one line, so give each its own block.
 */
export const blockMath = (md: string) =>
  md.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex: string) => `\n\n$$\n${tex.trim()}\n$$\n\n`).replace(/\n{3,}/g, "\n\n").trim();

export function Markdown({ md, className = "prose-learn" }: { md: string; className?: string }) {
  const { wordAnchors } = usePrefs();
  const wrap = (Tag: "p" | "li") =>
    function Wrapped({ children }: { children?: ReactNode }) {
      return <Tag>{wordAnchors ? anchor(children) : children}</Tag>;
    };
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]} components={{ p: wrap("p"), li: wrap("li") }}>
        {md}
      </ReactMarkdown>
    </div>
  );
}

/** Inline markdown (no paragraph margins) – for buttons, cards and chips that may contain maths. */
export function InlineMd({ md, className }: { md: string; className?: string }) {
  return <Markdown md={md} className={`md-inline ${className ?? ""}`} />;
}
