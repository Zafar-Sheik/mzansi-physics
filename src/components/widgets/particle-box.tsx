"use client";
import { useRef, useState } from "react";
import { Dot, Label, Plot, Polyline } from "@/components/sci/plot";
import { dc, Explain, Readouts, SimControls, useTicker, useToolUse } from "./sim-kit";
import { Slider, WidgetFrame } from "./widget-frame";

const C = "var(--t-matter)";
const N = 42;
// Heating curve for 1 kg-ish of water (simplified energies in kJ).
const SEG = [
  { to: 50, from: 0, T0: -40, T1: 0, phase: "solid" as const },
  { to: 384, from: 50, T0: 0, T1: 0, phase: "melting" as const },
  { to: 804, from: 384, T0: 0, T1: 100, phase: "liquid" as const },
  { to: 1600, from: 804, T0: 100, T1: 100, phase: "boiling" as const },
  { to: 1680, from: 1600, T0: 100, T1: 140, phase: "gas" as const },
];
const MAX_E = 1680;

function stateAt(E: number) {
  const s = SEG.find((x) => E <= x.to) ?? SEG[SEG.length - 1];
  const f = (E - s.from) / (s.to - s.from);
  const T = s.T0 + (s.T1 - s.T0) * f;
  // fraction of particles that are liquid / gas
  const liquid = s.phase === "solid" ? 0 : s.phase === "melting" ? f : s.phase === "liquid" ? 1 : s.phase === "boiling" ? 1 - f : 0;
  const gas = s.phase === "boiling" ? f : s.phase === "gas" ? 1 : 0;
  return { T, phase: s.phase, liquid, gas };
}

/**
 * Heat a block of ice and watch the particles: vibrating in a lattice, sliding
 * past each other, then flying free. The heating curve shows why the
 * temperature stays constant while the substance melts and boils.
 */
export function ParticleBox({ title = "States of matter & the kinetic molecular theory" }: { title?: string }) {
  const [E, setE] = useState(20);
  const [running, setRunning] = useState(false);
  const touch = useToolUse();
  const parts = useRef(Array.from({ length: N }, (_, i) => ({ x: 0, y: 0, vx: Math.cos(i * 2.3), vy: Math.sin(i * 2.3), hx: 70 + (i % 7) * 22, hy: 150 + Math.floor(i / 7) * 20 })));
  const [, force] = useState(0);
  const st = stateAt(E);
  const TK = st.T + 273;

  useTicker((dt) => {
    const list = parts.current;
    const nGas = Math.round(st.gas * N);
    const nLiq = Math.round(st.liquid * N);
    const jiggle = 1 + (TK / 273) * 1.5;
    list.forEach((p, i) => {
      const kind = i < nGas ? "gas" : i < nGas + nLiq ? "liquid" : "solid";
      if (kind === "solid") {
        p.x = p.hx + (Math.random() - 0.5) * jiggle * 2;
        p.y = p.hy - 40 + (Math.random() - 0.5) * jiggle * 2;
        return;
      }
      const speed = kind === "gas" ? 40 + Math.sqrt(TK) * 9 : 18 + Math.sqrt(TK) * 1.5;
      const m = Math.hypot(p.vx, p.vy) || 1;
      p.vx = (p.vx / m) * speed + (kind === "liquid" ? (Math.random() - 0.5) * 30 : 0);
      p.vy = (p.vy / m) * speed + (kind === "liquid" ? (Math.random() - 0.5) * 30 + 12 : 0);
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const top = kind === "gas" ? 18 : 120;
      if (p.x < 18) { p.x = 18; p.vx = Math.abs(p.vx); }
      if (p.x > 262) { p.x = 262; p.vx = -Math.abs(p.vx); }
      if (p.y < top) { p.y = top; p.vy = Math.abs(p.vy); }
      if (p.y > 222) { p.y = 222; p.vy = -Math.abs(p.vy); }
    });
    force((n) => n + 1);
  }, running);

  // First frame (or calm mode, paused): place the particles where their state says.
  if (!running) {
    const nGas = Math.round(st.gas * N);
    const nLiq = Math.round(st.liquid * N);
    parts.current.forEach((p, i) => {
      const kind = i < nGas ? "gas" : i < nGas + nLiq ? "liquid" : "solid";
      if (kind === "solid") { p.x = p.hx; p.y = p.hy - 40; }
      else if (kind === "liquid") { p.x = 25 + ((i * 53) % 230); p.y = 140 + ((i * 37) % 80); }
      else { p.x = 25 + ((i * 71) % 230); p.y = 25 + ((i * 29) % 190); }
    });
  }

  const nGas = Math.round(st.gas * N);
  const nLiq = Math.round(st.liquid * N);
  const curve = SEG.flatMap((s) => [[s.from, s.T0], [s.to, s.T1]] as [number, number][]);
  const describe = {
    solid: "SOLID: particles are packed closely in a regular pattern. They can only vibrate about fixed positions – strong forces hold them in place.",
    melting: "MELTING: the energy is used to break the forces between particles, not to speed them up – so the temperature stays at 0 °C (the melting point).",
    liquid: "LIQUID: particles are still close together but can slide past each other, so a liquid flows and takes the shape of its container.",
    boiling: "BOILING: the energy is used to overcome the intermolecular forces completely – the temperature stays at 100 °C until all the water is gas.",
    gas: "GAS: particles are far apart and move fast and randomly in all directions, colliding with each other and the walls. Forces between them are very weak.",
  }[st.phase];

  return (
    <WidgetFrame title={title} colour={C} instruction="Drag the heat slider to add energy to ice. Press Play to see the particles move.">
      <div className="grid gap-3 md:grid-cols-[280px_minmax(0,1fr)]">
        <svg viewBox="0 0 280 240" className="diagram rounded-xl border border-line bg-surface" role="img" aria-label={`${st.phase} at ${dc(st.T, 0)} degrees Celsius`}>
          <rect x="10" y="10" width="260" height="220" rx="8" fill="none" stroke="var(--text-muted)" strokeWidth="3" />
          {parts.current.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="8" fill={i < nGas ? "#f97316" : i < nGas + nLiq ? "#3b82f6" : "#93c5fd"} stroke="white" strokeWidth="1" />)}
        </svg>
        <div>
          <Plot view={{ xMin: -40, xMax: MAX_E, yMin: -50, yMax: 150 }} width={420} height={210} label="Heating curve of water" xLabel="energy added (kJ)" yLabel="T (°C)">
            <Polyline points={curve} colour="var(--curve-ghost)" />
            <Polyline points={curve.filter(([e2]) => e2 <= E).concat([[E, st.T]])} colour={C} />
            <Dot x={E} y={st.T} colour={C} />
            <Label x={150} y={8}>melting (0 °C)</Label>
            <Label x={1000} y={108}>boiling (100 °C)</Label>
          </Plot>
        </div>
      </div>
      <div className="mt-3"><Slider label="Heat energy added (kJ)" value={E} min={0} max={MAX_E} step={10} onChange={(v) => { setE(v); touch(); }} colour={C} /></div>
      <div className="mt-3"><SimControls running={running} colour={C} onToggle={() => { setRunning((r) => !r); touch(); }} /></div>
      <Readouts className="mt-3" colour={C} items={[
        { label: "temperature", value: dc(st.T, 0), unit: "°C" },
        { label: "temperature", value: dc(TK, 0), unit: "K" },
        { label: "phase", value: st.phase, highlight: true },
        { label: "average kinetic energy", value: TK < 260 ? "low" : TK < 320 ? "medium" : TK < 373 ? "higher" : "high" },
      ]} />
      <Explain colour={C}>
        <strong>{describe}</strong> The <strong>kinetic molecular theory</strong>: all matter is made of particles in constant motion; temperature is a measure of their <strong>average kinetic energy</strong>. Absolute zero (0 K = −273 °C) is the lowest possible temperature.
      </Explain>
    </WidgetFrame>
  );
}
