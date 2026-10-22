"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { bumpStat } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { Tex } from "@/components/learn/tex";

/** Counts the first interaction with a simulation towards the "Lab Rat" badge. Call `touch()` in any handler. */
export function useToolUse() {
  const used = useRef(false);
  return useCallback(() => {
    if (used.current) return;
    used.current = true;
    bumpStat("toolsUsed");
  }, []);
}

/** True when the learner asked for calm mode or the OS asks for reduced motion (re-checked on mount). */
export function useCalm() {
  const [calm, setCalm] = useState(false);
  useEffect(() => {
    const check = () => setCalm(document.documentElement.classList.contains("calm") || window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return calm;
}

/**
 * Animation clock for simulations: calls `step(dt)` (seconds, capped) every
 * frame while `running`. Simulations never auto-play in calm mode – the
 * learner presses Play.
 */
export function useTicker(step: (dt: number) => void, running: boolean) {
  const fn = useRef(step);
  fn.current = step;
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      fn.current(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);
}

/** Play / pause / reset controls shared by every animated simulation. */
export function SimControls({ running, onToggle, onReset, colour = "var(--brand)", children }: { running: boolean; onToggle: () => void; onReset?: () => void; colour?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={onToggle} className="inline-flex h-9 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold text-white transition active:scale-[0.98]" style={{ background: colour }} aria-pressed={running}>
        {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {running ? "Pause" : "Play"}
      </button>
      {onReset && (
        <button onClick={onReset} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-line px-3 text-sm font-semibold text-muted transition hover:text-fg">
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      )}
      {children}
    </div>
  );
}

/** A grid of live readings: label, value (LaTeX allowed) and unit. */
export function Readouts({ items, colour = "var(--brand)", className }: { items: { label: string; value: string; tex?: boolean; unit?: string; highlight?: boolean }[]; colour?: string; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 gap-2 sm:grid-cols-3", className)}>
      {items.map((it) => (
        <div key={it.label} className={cn("rounded-xl border px-3 py-2", it.highlight ? "border-transparent" : "border-line bg-surface-2/60")} style={it.highlight ? { background: `color-mix(in oklab, ${colour} 14%, transparent)` } : undefined}>
          <dt className="text-xs font-semibold text-muted">{it.label}</dt>
          <dd className="font-mono text-base font-bold tabular-nums" style={it.highlight ? { color: colour } : undefined}>
            {it.tex ? <Tex tex={it.value} /> : it.value}
            {it.unit && <span className="ml-1 text-xs font-semibold text-muted">{it.unit}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** A labelled arrow for SVG force / velocity / field diagrams. Length in SVG units; angle in degrees (0 = right, 90 = up). */
export function Arrow({ x, y, length, angle, colour, label, width = 3, dashed, labelOffset = 12 }: { x: number; y: number; length: number; angle: number; colour: string; label?: string; width?: number; dashed?: boolean; labelOffset?: number }) {
  if (Math.abs(length) < 1) return null;
  if (length < 0) {
    length = -length;
    angle += 180;
  }
  const a = (angle * Math.PI) / 180;
  const x2 = x + length * Math.cos(a);
  const y2 = y - length * Math.sin(a);
  const head = Math.min(10, Math.abs(length) * 0.45);
  const left = a + Math.PI - 0.45;
  const right = a + Math.PI + 0.45;
  const lx = x2 + labelOffset * Math.cos(a);
  const ly = y2 - labelOffset * Math.sin(a);
  return (
    <g>
      <line x1={x} y1={y} x2={x2} y2={y2} stroke={colour} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? "6 4" : undefined} />
      <path d={`M${x2},${y2} L${x2 + head * Math.cos(left)},${y2 - head * Math.sin(left)} L${x2 + head * Math.cos(right)},${y2 - head * Math.sin(right)} Z`} fill={colour} />
      {label && <text x={lx} y={ly} fontSize="12" fontWeight="700" textAnchor="middle" dominantBaseline="middle" fill={colour} stroke="var(--surface)" strokeWidth="3" paintOrder="stroke">{label}</text>}
    </g>
  );
}

/** A friendly "what's happening" explanation box under a simulation. */
export function Explain({ children, colour = "var(--brand)" }: { children: React.ReactNode; colour?: string }) {
  return (
    <div className="mt-3 rounded-xl border-l-4 bg-surface-2/60 p-3 text-sm leading-relaxed" style={{ borderColor: colour }} aria-live="polite">
      {children}
    </div>
  );
}

/** Formats a number with a decimal comma for widgets (SA style). */
export const dc = (x: number, dp = 2) => (Number.isFinite(x) ? x.toFixed(dp).replace(".", ",").replace(/^-0(,0+)?$/, "0$1") : "–");
