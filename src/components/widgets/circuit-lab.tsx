"use client";
import { useState } from "react";
import { dc, Explain, Readouts, SimControls, useTicker, useToolUse } from "./sim-kit";
import { Segmented, Slider, Toggle, WidgetFrame } from "./widget-frame";

const C = "var(--t-elec)";
type Layout = "series" | "parallel" | "combo";

interface Part { id: string; x: number; y: number; vertical?: boolean; R: number; I: number; V: number; P: number }
interface Wire { d: string; I: number }

function solve(layout: Layout, emf: number, r: number, R1: number, R2: number, R3: number, closed: boolean) {
  const Rext = layout === "series" ? R1 + R2 + R3 : layout === "parallel" ? 1 / (1 / R1 + 1 / R2 + 1 / R3) : R1 + (R2 * R3) / (R2 + R3);
  const I = closed ? emf / (Rext + r) : 0;
  const Vt = closed ? I * Rext : emf;
  let parts: { id: string; R: number; I: number }[];
  if (layout === "series") parts = [{ id: "R1", R: R1, I }, { id: "R2", R: R2, I }, { id: "R3", R: R3, I }];
  else if (layout === "parallel") parts = [{ id: "R1", R: R1, I: Vt / R1 * (closed ? 1 : 0) }, { id: "R2", R: R2, I: Vt / R2 * (closed ? 1 : 0) }, { id: "R3", R: R3, I: Vt / R3 * (closed ? 1 : 0) }];
  else {
    const Vp = I * ((R2 * R3) / (R2 + R3));
    parts = [{ id: "R1", R: R1, I }, { id: "R2", R: R2, I: Vp / R2 }, { id: "R3", R: R3, I: Vp / R3 }];
  }
  return { Rext, I, Vt, lost: closed ? I * r : 0, parts: parts.map((p) => ({ ...p, V: p.I * p.R, P: p.I * p.I * p.R })) };
}

/**
 * Build-a-circuit lab: series, parallel or series-parallel resistors (or
 * bulbs) with a battery that can have internal resistance. Ammeter and
 * voltmeter readings update live, and the moving dots show the current.
 */
export function CircuitLab({ title = "Circuit lab", layout: startLayout = "series", internal = false, bulbs: startBulbs = false }: { title?: string; layout?: Layout; internal?: boolean; bulbs?: boolean }) {
  const [layout, setLayout] = useState<Layout>(startLayout);
  const [emf, setEmf] = useState(12);
  const [r, setR] = useState(internal ? 1 : 0);
  const [R1, setR1] = useState(4);
  const [R2, setR2] = useState(6);
  const [R3, setR3] = useState(12);
  const [closed, setClosed] = useState(true);
  const [bulbs, setBulbs] = useState(startBulbs);
  const [flow, setFlow] = useState(false);
  const [t, setT] = useState(0);
  const touch = useToolUse();
  useTicker((dt) => setT((x) => x + dt), flow);

  const s = solve(layout, emf, r, R1, R2, R3, closed);
  const maxP = Math.max(1e-6, ...s.parts.map((p) => p.P));
  const ch = (fn: (n: number) => void) => (n: number) => { fn(n); touch(); };

  // Layout geometry (600 × 300). Battery on the left side, switch on the bottom wire.
  const parts: Part[] = [];
  const wires: Wire[] = [];
  const P = (id: string) => s.parts.find((p) => p.id === id)!;
  if (layout === "series") {
    parts.push({ ...P("R1"), x: 220, y: 50 }, { ...P("R2"), x: 400, y: 50 }, { ...P("R3"), x: 540, y: 150, vertical: true });
    wires.push({ d: "M60,150 V50 H540 V250 H60 V150", I: s.I });
  } else if (layout === "parallel") {
    parts.push({ ...P("R1"), x: 330, y: 50 }, { ...P("R2"), x: 330, y: 120 }, { ...P("R3"), x: 330, y: 190 });
    wires.push({ d: "M60,150 V50 H200", I: s.I }, { d: "M460,50 H540 V250 H60 V150", I: s.I });
    wires.push({ d: "M200,50 H460", I: P("R1").I }, { d: "M200,50 V120 H460 V50", I: P("R2").I }, { d: "M200,120 V190 H460 V120", I: P("R3").I });
  } else {
    parts.push({ ...P("R1"), x: 170, y: 50 }, { ...P("R2"), x: 400, y: 50 }, { ...P("R3"), x: 400, y: 150 });
    wires.push({ d: "M60,150 V50 H290", I: s.I }, { d: "M510,50 H540 V250 H60 V150", I: s.I });
    wires.push({ d: "M290,50 H510", I: P("R2").I }, { d: "M290,50 V150 H510 V50", I: P("R3").I });
  }

  const resistor = (p: Part) => {
    const glow = p.P / maxP;
    return (
      <g key={p.id} transform={`translate(${p.x}, ${p.y}) ${p.vertical ? "rotate(90)" : ""}`}>
        {bulbs ? (
          <>
            {closed && <circle r={14 + glow * 16} fill="#fde047" opacity={0.15 + glow * 0.55} />}
            <circle r="13" fill={closed && glow > 0.02 ? "#fef08a" : "var(--surface)"} stroke="var(--text)" strokeWidth="2" />
            <path d="M-9,-9 L9,9 M9,-9 L-9,9" stroke="var(--text)" strokeWidth="2" />
          </>
        ) : (
          <rect x="-26" y="-10" width="52" height="20" rx="3" fill="var(--surface)" stroke="var(--text)" strokeWidth="2.5" />
        )}
        <text y={bulbs ? -20 : -16} textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--text)" transform={p.vertical ? "rotate(-90)" : undefined}>{p.id} = {p.R} Ω</text>
        <text y={bulbs ? 30 : 28} textAnchor="middle" fontSize="11" fontWeight="700" fill={C} transform={p.vertical ? "rotate(-90)" : undefined}>{dc(p.I, 2)} A · {dc(p.V, 2)} V</text>
      </g>
    );
  };

  return (
    <WidgetFrame title={title} colour={C} instruction="Pick a circuit, change the battery and resistors, open and close the switch. Ammeter (A) and voltmeter (V) readings update instantly.">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented colour={C} value={layout} onChange={(l) => { setLayout(l); touch(); }} options={[{ id: "series", label: "Series" }, { id: "parallel", label: "Parallel" }, { id: "combo", label: "Series + parallel" }]} />
        <Toggle on={bulbs} onChange={setBulbs}>Bulbs</Toggle>
        <Toggle on={closed} onChange={(c) => { setClosed(c); touch(); }}>Switch closed</Toggle>
      </div>
      <svg viewBox="0 0 600 300" className="diagram mt-3 rounded-xl border border-line bg-surface" role="img"
        aria-label={`${layout} circuit. Total current ${dc(s.I, 2)} amps, terminal potential difference ${dc(s.Vt, 2)} volts.`}>
        {wires.map((w, i) => (
          <g key={i}>
            <path d={w.d} fill="none" stroke="var(--text)" strokeWidth="2.5" />
            {closed && w.I > 1e-6 && <path d={w.d} fill="none" stroke={C} strokeWidth="5" strokeLinecap="round" strokeDasharray="1 22" strokeDashoffset={-t * (20 + w.I * 25)} />}
          </g>
        ))}
        {/* battery (cell symbol) with internal resistance */}
        <g transform="translate(60, 150)">
          <rect x="-16" y="-24" width="32" height="40" fill="var(--surface)" />
          <line x1="-14" x2="14" y1="-10" y2="-10" stroke="var(--text)" strokeWidth="3" />
          <line x1="-7" x2="7" y1="2" y2="2" stroke="var(--text)" strokeWidth="5" />
          <text x="-20" y="-6" textAnchor="end" fontSize="12" fontWeight="800" fill="var(--text)">ε = {emf} V</text>
          {r > 0 && <text x="-20" y="10" textAnchor="end" fontSize="11" fill="var(--text-muted)">r = {dc(r, 1)} Ω</text>}
          <text x="10" y="-14" fontSize="11" fill="var(--text-muted)">+</text>
        </g>
        {/* switch */}
        <g transform="translate(300, 250)">
          <rect x="-24" y="-10" width="48" height="20" fill="var(--surface)" />
          <circle cx="-16" cy="0" r="3.5" fill="var(--text)" /><circle cx="16" cy="0" r="3.5" fill="var(--text)" />
          <line x1="-16" y1="0" x2={closed ? 16 : 10} y2={closed ? 0 : -16} stroke="var(--text)" strokeWidth="3" />
          <text y="24" textAnchor="middle" fontSize="11" className="muted">S</text>
        </g>
        {/* ammeter in series on the bottom wire, voltmeter across the battery */}
        <g transform="translate(170, 250)"><circle r="15" fill="var(--surface)" stroke={C} strokeWidth="2.5" /><text y="5" textAnchor="middle" fontSize="13" fontWeight="800" fill={C}>A</text><text y="32" textAnchor="middle" fontSize="11" fontWeight="700" fill={C}>{dc(s.I, 2)} A</text></g>
        <path d="M60,108 H20 V192 H60" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeDasharray="4 3" />
        <g transform="translate(20, 150)"><circle r="14" fill="var(--surface)" stroke="var(--t-systems)" strokeWidth="2.5" /><text y="5" textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--t-systems)">V</text></g>
        <text x="20" y="215" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--t-systems)">{dc(s.Vt, 2)} V</text>
        {parts.map(resistor)}
      </svg>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Slider label="emf ε (V)" value={emf} min={1.5} max={24} step={1.5} onChange={ch(setEmf)} colour={C} format={(n) => dc(n, 1)} />
        <Slider label="R₁ (Ω)" value={R1} min={1} max={20} step={1} onChange={ch(setR1)} colour={C} />
        <Slider label="R₂ (Ω)" value={R2} min={1} max={20} step={1} onChange={ch(setR2)} colour={C} />
        <Slider label="R₃ (Ω)" value={R3} min={1} max={20} step={1} onChange={ch(setR3)} colour={C} />
        <Slider label="internal r (Ω)" value={r} min={0} max={4} step={0.5} onChange={ch(setR)} colour="var(--text-muted)" format={(n) => dc(n, 1)} />
      </div>
      <div className="mt-3"><SimControls running={flow} colour={C} onToggle={() => { setFlow((f) => !f); touch(); }}><span className="text-xs text-muted">Play shows the conventional current (+ to −); faster dots = bigger current.</span></SimControls></div>
      <Readouts className="mt-3" colour={C} items={[
        { label: "external resistance", value: dc(s.Rext, 2), unit: "Ω" },
        { label: "total current I", value: dc(s.I, 3), unit: "A", highlight: true },
        { label: "terminal pd (voltmeter)", value: dc(s.Vt, 2), unit: "V" },
        { label: "lost volts Ir", value: dc(s.lost, 2), unit: "V" },
        { label: "power delivered", value: dc(s.I * s.Vt, 2), unit: "W" },
        { label: "brightest", value: s.parts.reduce((a, b) => (b.P > a.P ? b : a)).id },
      ]} />
      <Explain colour={C}>
        {layout === "series" && <>In <strong>series</strong> the current is the <strong>same</strong> everywhere ({dc(s.I, 2)} A) and the potential difference is <strong>shared</strong>: {s.parts.map((p) => dc(p.V, 2)).join(" + ")} = {dc(s.Vt, 2)} V. Adding a resistor in series <em>increases</em> the total resistance.</>}
        {layout === "parallel" && <>In <strong>parallel</strong> every branch gets the <strong>same</strong> potential difference ({dc(s.Vt, 2)} V) and the current <strong>splits</strong>: {s.parts.map((p) => dc(p.I, 2)).join(" + ")} = {dc(s.I, 2)} A. The smallest resistor takes the biggest current. Adding a branch <em>decreases</em> the total resistance.</>}
        {layout === "combo" && <>R₂ and R₃ are in parallel (equivalent {dc((R2 * R3) / (R2 + R3), 2)} Ω), and that combination is in series with R₁. The full current {dc(s.I, 2)} A goes through R₁, then splits between R₂ and R₃.</>}
        {r > 0 ? <> With internal resistance, <strong>ε = I(R + r)</strong>: the voltmeter reads only {dc(s.Vt, 2)} V because {dc(s.lost, 2)} V is “lost” inside the battery. Open the switch – the voltmeter then reads the emf.</> : <> Ohm&apos;s law for each resistor: V = IR.</>}
      </Explain>
    </WidgetFrame>
  );
}
