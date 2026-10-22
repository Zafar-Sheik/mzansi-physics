"use client";
import { useState } from "react";
import { dc, Explain, SimControls, useTicker, useToolUse } from "./sim-kit";
import { Slider, Toggle, WidgetFrame } from "./widget-frame";

const C = "var(--t-waves)";
const SPEED = 1.2; // m per second on screen
const pulse = (x: number, centre: number, amp: number, w: number) => amp * Math.exp(-(((x - centre) / w) ** 2));

/**
 * Two pulses on a rope travel towards each other, meet and pass through each
 * other. At every point the displacements ADD (superposition): crest + crest
 * builds up, crest + trough cancels.
 */
export function PulseLab({ title = "Superposition of pulses" }: { title?: string }) {
  const [a1, setA1] = useState(2);
  const [a2, setA2] = useState(2);
  const [w, setW] = useState(0.5);
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const [ghosts, setGhosts] = useState(true);
  const touch = useToolUse();
  const END = 5;
  useTicker((dt) => setT((x) => {
    if (x + dt >= END) { setRunning(false); return END; }
    return x + dt;
  }), running);

  const c1 = 0.5 + SPEED * t;
  const c2 = 5.5 - SPEED * t;
  const W = 600;
  const px = (x: number) => x * 100;
  const py = (y: number) => 110 - y * 18;
  const total = (x: number) => pulse(x, c1, a1, w) + pulse(x, c2, a2, w);
  const line = (f: (x: number) => number) => Array.from({ length: 301 }, (_, i) => { const x = (i / 300) * 6; return `${i ? "L" : "M"}${px(x).toFixed(1)},${py(f(x)).toFixed(1)}`; }).join("");
  const overlap = Math.abs(c1 - c2) < 2 * w;
  const peak = Math.max(...Array.from({ length: 121 }, (_, i) => Math.abs(total(i / 20))));
  const kind = Math.sign(a1) === Math.sign(a2) ? "constructive" : "destructive";
  const ch = (fn: (n: number) => void) => (n: number) => { fn(n); setT(0); setRunning(false); touch(); };

  return (
    <WidgetFrame title={title} colour={C} instruction="Set the two amplitudes (negative = a trough pulse) and press Play. Scrub through time with the slider to freeze the moment they meet.">
      <svg viewBox={`0 0 ${W} 220`} className="diagram rounded-xl border border-line bg-surface" role="img" aria-label={`Two pulses of amplitude ${a1} and ${a2}. ${overlap ? `They overlap: ${kind} interference, resultant amplitude about ${dc(peak, 1)}` : "They are apart."}`}>
        <line x1="0" x2={W} y1={py(0)} y2={py(0)} stroke="var(--graph-grid)" />
        {ghosts && <path d={line((x) => pulse(x, c1, a1, w))} fill="none" stroke="var(--curve-1)" strokeWidth="2" strokeDasharray="5 4" opacity="0.8" />}
        {ghosts && <path d={line((x) => pulse(x, c2, a2, w))} fill="none" stroke="var(--t-change)" strokeWidth="2" strokeDasharray="5 4" opacity="0.8" />}
        <path d={line(total)} fill="none" stroke={C} strokeWidth="4" />
        <text x={px(c1)} y={py(a1) + (a1 >= 0 ? -10 : 18)} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--curve-1)">→</text>
        <text x={px(c2)} y={py(a2) + (a2 >= 0 ? -10 : 18)} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--t-change)">←</text>
        {overlap && <text x={W / 2} y="20" textAnchor="middle" fontSize="13" fontWeight="800" fill={kind === "constructive" ? "var(--success)" : "var(--t-change)"}>{kind.toUpperCase()} INTERFERENCE</text>}
      </svg>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Slider label="Amplitude of pulse 1" value={a1} min={-3} max={3} step={0.5} onChange={ch(setA1)} colour="var(--curve-1)" format={(n) => dc(n, 1)} />
        <Slider label="Amplitude of pulse 2" value={a2} min={-3} max={3} step={0.5} onChange={ch(setA2)} colour="var(--t-change)" format={(n) => dc(n, 1)} />
        <Slider label="Pulse width" value={w} min={0.2} max={1} step={0.1} onChange={ch(setW)} colour={C} format={(n) => dc(n, 1)} />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-end">
        <SimControls running={running} colour={C} onToggle={() => { if (t >= END) setT(0); setRunning((r) => !r); touch(); }} onReset={() => { setT(0); setRunning(false); }}>
          <Toggle on={ghosts} onChange={setGhosts}>Show each pulse</Toggle>
        </SimControls>
        <Slider label="Time" value={t} min={0} max={END} step={0.05} onChange={(n) => { setT(n); setRunning(false); touch(); }} colour={C} format={(n) => `${dc(n, 2)} s`} />
      </div>
      <Explain colour={C}>
        <strong>Principle of superposition:</strong> when pulses meet, the resultant displacement is the <em>algebraic sum</em> of the individual displacements.{" "}
        {kind === "constructive" ? `Two pulses on the same side add up: ${dc(a1, 1)} + ${dc(a2, 1)} = ${dc(a1 + a2, 1)} at the peak – constructive interference.` : `A crest and a trough subtract: ${dc(a1, 1)} + (${dc(a2, 1)}) = ${dc(a1 + a2, 1)}${a1 + a2 === 0 ? " – complete destructive interference, the rope is momentarily flat!" : " – destructive interference."}`}
        {" "}Afterwards each pulse carries on <strong>unchanged</strong>, as if the other was never there.
      </Explain>
    </WidgetFrame>
  );
}
