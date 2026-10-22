"use client";
import { useState } from "react";
import { Arrow, dc, Explain, Readouts, SimControls, useTicker, useToolUse } from "./sim-kit";
import { Segmented, Slider, WidgetFrame } from "./widget-frame";

const C = "var(--t-mech)";
type Kind = "elastic" | "inelastic" | "stick" | "explosion";
const KINDS: { id: Kind; label: string }[] = [
  { id: "elastic", label: "Elastic (bounce)" },
  { id: "inelastic", label: "Inelastic" },
  { id: "stick", label: "Stick together" },
  { id: "explosion", label: "Explosion (spring)" },
];

/** Final velocities for a 1D collision with coefficient of restitution e (1 elastic, 0 stick). */
function collide(m1: number, m2: number, u1: number, u2: number, e: number) {
  const p = m1 * u1 + m2 * u2;
  const v1 = (p + m2 * e * (u2 - u1)) / (m1 + m2);
  const v2 = (p + m1 * e * (u1 - u2)) / (m1 + m2);
  return { v1, v2 };
}

/**
 * Two trolleys on a frictionless track. Collide them (elastic, inelastic,
 * sticking) or let a spring push them apart, and compare momentum and kinetic
 * energy before and after.
 */
export function CollisionLab({ title = "Collision lab: momentum is conserved", kind: startKind = "stick" }: { title?: string; kind?: Kind }) {
  const [kind, setKind] = useState<Kind>(startKind);
  const [m1, setM1] = useState(2);
  const [m2, setM2] = useState(1);
  const [u1, setU1] = useState(3);
  const [u2, setU2] = useState(-1);
  const [x, setX] = useState({ a: -3, b: 3 });
  const [vel, setVel] = useState<{ a: number; b: number } | null>(null);
  const [done, setDone] = useState(false);
  const [running, setRunning] = useState(false);
  const touch = useToolUse();

  const ex = kind === "explosion";
  const ui1 = ex ? 0 : u1;
  const ui2 = ex ? 0 : u2;
  const e = kind === "elastic" ? 1 : kind === "inelastic" ? 0.5 : 0;
  // Explosion: the spring gives a fixed impulse J = 6 N·s to each trolley in opposite directions.
  const out = ex ? { v1: -6 / m1, v2: 6 / m2 } : collide(m1, m2, ui1, ui2, e);
  const width = (m: number) => 0.5 + m * 0.18;
  const start = ex ? { a: -width(m1) / 2 - 0.01, b: width(m2) / 2 + 0.01 } : { a: -3, b: 3 };

  const reset = () => { setRunning(false); setX(start); setVel(null); setDone(false); };
  const ch = (fn: (n: number) => void) => (n: number) => { fn(n); setRunning(false); setX(ex ? start : { a: -3, b: 3 }); setVel(null); setDone(false); touch(); };

  useTicker((dt) => {
    const va = vel?.a ?? ui1;
    const vb = vel?.b ?? ui2;
    if (ex && !vel) { setVel({ a: out.v1, b: out.v2 }); setDone(true); return; }
    let na = x.a + va * dt;
    let nb = x.b + vb * dt;
    if (!vel && nb - na <= (width(m1) + width(m2)) / 2) {
      // Contact: switch to the after-collision velocities.
      const gap = (width(m1) + width(m2)) / 2;
      const mid = (na + nb) / 2;
      na = mid - gap / 2;
      nb = mid + gap / 2;
      setVel({ a: out.v1, b: out.v2 });
      setDone(true);
    }
    if (Math.abs(na) > 6 || Math.abs(nb) > 6) setRunning(false);
    setX({ a: Math.max(-6.5, Math.min(6.5, na)), b: Math.max(-6.5, Math.min(6.5, nb)) });
  }, running);

  const pBefore = m1 * ui1 + m2 * ui2;
  const pAfter = m1 * out.v1 + m2 * out.v2;
  const kBefore = 0.5 * m1 * ui1 ** 2 + 0.5 * m2 * ui2 ** 2;
  const kAfter = 0.5 * m1 * out.v1 ** 2 + 0.5 * m2 * out.v2 ** 2;
  const px = (p: number) => 300 + p * 42;
  const va = vel?.a ?? ui1;
  const vb = vel?.b ?? ui2;
  const willMiss = !ex && ui1 <= ui2;

  const trolley = (at: number, m: number, colour: string, label: string) => {
    const w = width(m) * 42;
    return (
      <g transform={`translate(${px(at)}, 120)`}>
        <rect x={-w / 2} y={-34} width={w} height={28} rx="5" fill={colour} />
        <text y={-15} textAnchor="middle" fontSize="12" fontWeight="800" fill="white">{label} {m} kg</text>
        <circle cx={-w / 2 + 8} cy={-2} r="6" fill="#1f2937" /><circle cx={w / 2 - 8} cy={-2} r="6" fill="#1f2937" />
      </g>
    );
  };

  return (
    <WidgetFrame title={title} colour={C} instruction="Choose a type of collision and set the masses and velocities (right is positive). Press Play and compare before and after.">
      <Segmented colour={C} value={kind} onChange={(k) => { setKind(k); setRunning(false); setVel(null); setDone(false); setX(k === "explosion" ? { a: -width(m1) / 2 - 0.01, b: width(m2) / 2 + 0.01 } : { a: -3, b: 3 }); touch(); }} options={KINDS} />
      <svg viewBox="0 0 600 160" className="diagram mt-3 rounded-xl border border-line bg-surface" role="img" aria-label={done ? `After: trolley A ${dc(out.v1, 2)} metres per second, trolley B ${dc(out.v2, 2)} metres per second` : "Before the collision"}>
        <rect x="20" y="124" width="560" height="8" rx="4" fill="var(--surface-2)" stroke="var(--border)" />
        {ex && !done && <path d={`M${px(x.a) + 10},104 l6,-8 l6,16 l6,-16 l6,16 l6,-8`} fill="none" stroke="var(--text-muted)" strokeWidth="2" />}
        {trolley(x.a, m1, "var(--curve-1)", "A")}
        {trolley(x.b, m2, "var(--t-change)", "B")}
        <Arrow x={px(x.a)} y={70} length={va * 14} angle={0} colour="var(--curve-1)" label={Math.abs(va) > 0.2 ? `${dc(va, 1)}` : undefined} />
        <Arrow x={px(x.b)} y={56} length={vb * 14} angle={0} colour="var(--t-change)" label={Math.abs(vb) > 0.2 ? `${dc(vb, 1)}` : undefined} />
        <text x="30" y="24" fontSize="12" fontWeight="700" fill="var(--text-muted)">{done ? "AFTER" : "BEFORE"} · right = +</text>
      </svg>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Slider label="Mass of A (kg)" value={m1} min={0.5} max={5} step={0.5} onChange={ch(setM1)} colour="var(--curve-1)" format={(n) => dc(n, 1)} />
        <Slider label="Mass of B (kg)" value={m2} min={0.5} max={5} step={0.5} onChange={ch(setM2)} colour="var(--t-change)" format={(n) => dc(n, 1)} />
        {!ex && <Slider label="Velocity of A (m·s⁻¹)" value={u1} min={-4} max={6} step={0.5} onChange={ch(setU1)} colour="var(--curve-1)" format={(n) => dc(n, 1)} />}
        {!ex && <Slider label="Velocity of B (m·s⁻¹)" value={u2} min={-6} max={4} step={0.5} onChange={ch(setU2)} colour="var(--t-change)" format={(n) => dc(n, 1)} />}
      </div>
      <div className="mt-3"><SimControls running={running} colour={C} onToggle={() => { if (done && !running) reset(); setRunning((r) => !r); touch(); }} onReset={reset}>
        {willMiss && <span className="text-sm text-warning">A is not catching up with B – they won&apos;t collide.</span>}
      </SimControls></div>
      <Readouts className="mt-3" colour={C} items={[
        { label: "Σp before", value: dc(pBefore, 2), unit: "kg·m·s⁻¹" },
        { label: "Σp after", value: dc(pAfter, 2), unit: "kg·m·s⁻¹", highlight: true },
        { label: "A after / B after", value: `${dc(out.v1, 2)} / ${dc(out.v2, 2)}`, unit: "m·s⁻¹" },
        { label: "ΣEₖ before", value: dc(kBefore, 2), unit: "J" },
        { label: "ΣEₖ after", value: dc(kAfter, 2), unit: "J" },
        { label: "impulse on B = Δp", value: dc(m2 * (out.v2 - ui2), 2), unit: "N·s" },
      ]} />
      <Explain colour={C}>
        <strong>Momentum is conserved</strong> in an isolated system (no external net force): Σp before = Σp after = {dc(pBefore, 2)} kg·m·s⁻¹.{" "}
        {kind === "elastic" && "In an elastic collision kinetic energy is conserved too."}
        {kind === "inelastic" && `Kinetic energy is NOT conserved: ${dc(kBefore - kAfter, 2)} J became sound, heat and deformation – an inelastic collision.`}
        {kind === "stick" && `They move off together at ${dc(out.v1, 2)} m·s⁻¹. This loses the most kinetic energy (${dc(kBefore - kAfter, 2)} J) – an inelastic collision.`}
        {kind === "explosion" && "They start at rest, so the total momentum is zero before AND after: the lighter trolley moves faster. The spring's energy becomes kinetic energy."}
        {" "}Newton&apos;s third law: A and B get equal and opposite impulses ({dc(m2 * (out.v2 - ui2), 2)} N·s and {dc(m1 * (out.v1 - ui1), 2)} N·s).
      </Explain>
    </WidgetFrame>
  );
}
