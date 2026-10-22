"use client";
import { useRef, useState } from "react";
import { Keyboard } from "lucide-react";
import type { AnswerKind } from "@/content/types";
import { normalise, parse, toTex } from "@/lib/sci/expr";
import { cleanNumber } from "@/lib/sci/check";
import { cn } from "@/lib/utils";
import { Tex } from "@/components/learn/tex";

type Key = { label: string; insert: string; title: string };

const NUMBER_KEYS: Key[] = [
  { label: "×10ⁿ", insert: " × 10^", title: "times ten to the power" },
  { label: "−", insert: "-", title: "minus" },
  { label: "xⁿ", insert: "^", title: "power" },
  { label: "√", insert: "sqrt(", title: "square root" },
  { label: "(", insert: "(", title: "open bracket" },
  { label: ")", insert: ")", title: "close bracket" },
  { label: "a/b", insert: "/", title: "fraction / divide" },
  { label: "π", insert: "π", title: "pi" },
];

const FORMULA_KEYS: Key[] = [
  { label: "⁺", insert: "⁺", title: "positive charge" },
  { label: "⁻", insert: "⁻", title: "negative charge" },
  { label: "²", insert: "²", title: "superscript 2" },
  { label: "³", insert: "³", title: "superscript 3" },
  { label: "(", insert: "(", title: "open bracket" },
  { label: ")", insert: ")", title: "close bracket" },
];

const LIST_KEYS: Key[] = [{ label: ";", insert: "; ", title: "next number" }];

/** Live preview: show learners the number (or formula) they actually typed. */
function preview(input: string, kind: AnswerKind, vars: string[]): string | null {
  try {
    if (kind === "text") return null;
    if (kind === "formula") {
      const t = input.trim().replace(/\s+/g, "");
      if (!/^[A-Za-z0-9()+\-⁺⁻²³]+$/.test(t)) return null;
      return `\\mathrm{${t.replace(/([A-Za-z)])(\d+)/g, "$1_{$2}").replace(/(\d?)([+\-⁺⁻])$/, (_, n: string, s: string) => `^{${n}${/[+⁺]/.test(s) ? "+" : "-"}}`).replace(/[²]/g, "^{2}").replace(/[³]/g, "^{3}")}}`;
    }
    if (kind === "list" || kind === "set") {
      const parts = input.split(/[;:]|\bor\b/i).map((p) => p.trim()).filter(Boolean);
      return parts.map((p) => toTex(parse(cleanNumber(p)))).join(kind === "list" ? " : " : "\\ \\text{ or }\\ ");
    }
    if (kind === "expr") return toTex(parse(normalise(input).replace(/^.*=\s*/, "").replace(/(\d),(\d)/g, "$1.$2"), vars));
    const c = cleanNumber(input);
    if (!c) return null;
    return toTex(parse(c));
  } catch {
    return null;
  }
}

export function AnswerInput({ value, onChange, onSubmit, kind = "number", vars = [], unit, disabled, status, label = "Your answer" }: {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  kind?: AnswerKind;
  vars?: string[];
  /** The unit, shown after the box (learners may also type it – it is ignored). */
  unit?: string;
  disabled?: boolean;
  status?: "ok" | "bad" | null;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [pad, setPad] = useState(false);
  const allowed = kind === "expr" ? (vars.length ? vars : ["x"]) : [];
  const tex = value.trim() ? preview(value, kind, allowed) : null;
  const keys = kind === "formula" ? FORMULA_KEYS : kind === "text" ? [] : kind === "list" ? [...LIST_KEYS, ...NUMBER_KEYS.slice(1, 2)] : NUMBER_KEYS;

  const insert = (s: string) => {
    const el = ref.current;
    if (!el) return onChange(value + s);
    const a = el.selectionStart ?? value.length;
    const b = el.selectionEnd ?? value.length;
    const next = value.slice(0, a) + s + value.slice(b);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(a + s.length, a + s.length);
    });
  };

  const placeholder =
    kind === "text" ? "Type the word or name" :
    kind === "formula" ? "e.g. H2O, NaCl, SO4^2-" :
    kind === "list" ? "e.g. 2; 1; 2" :
    kind === "set" ? "e.g. 2 or -3" :
    kind === "expr" ? `e.g. 2${allowed[0]} + 1` : "e.g. 12.5 or 3 × 10^8";

  return (
    <div>
      <label className="block">
        <span className="sr-only">{label}</span>
        <div className="flex items-center gap-2">
          <input
            ref={ref}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
            inputMode={kind === "number" ? "decimal" : "text"}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder={placeholder}
            aria-label={unit ? `${label} in ${unit}` : label}
            className={cn(
              "min-w-0 flex-1 rounded-xl border-2 bg-bg px-3 py-2 font-mono text-base outline-none transition focus:border-brand",
              status === "ok" ? "border-success" : status === "bad" ? "border-danger" : "border-line",
            )}
          />
          {unit && <span className="shrink-0 rounded-lg bg-surface-2 px-2 py-2 font-mono text-sm font-semibold text-muted" title="Unit">{unit}</span>}
          {keys.length > 0 && (
            <button type="button" onClick={() => setPad((p) => !p)} aria-pressed={pad} aria-label="Show symbols"
              className={cn("rounded-xl border-2 px-3 py-2 transition", pad ? "border-brand bg-brand-soft text-brand" : "border-line text-muted hover:text-fg")}>
              <Keyboard className="h-5 w-5" />
            </button>
          )}
        </div>
      </label>
      {pad && !disabled && (
        <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Symbols">
          {keys.map((k) => (
            <button key={k.label} type="button" title={k.title} onClick={() => insert(k.insert)}
              className="h-9 min-w-10 rounded-lg border border-line bg-surface-2 px-2 font-mono text-sm font-bold hover:border-brand/60">
              {k.label}
            </button>
          ))}
        </div>
      )}
      <div className="mt-1 min-h-6 text-sm text-muted" aria-live="polite">
        {tex ? <span>You typed: <Tex tex={tex} /></span> : value.trim() && kind !== "text" ? <span className="text-xs">Keep going…</span> : null}
      </div>
    </div>
  );
}
