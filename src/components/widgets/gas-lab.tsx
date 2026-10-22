"use client";
import { useRef, useState } from "react";
import { Curve, Dot, Plot } from "@/components/sci/plot";
import { dc, Explain, Readouts, SimControls, useTicker, useToolUse } from "./sim-kit";
import { Segmented, Slider, WidgetFrame } from "./widget-frame";

const C = "var(--t-matter)";
const R = 8.31;
type Law = "boyle" | "charles" | "pressure";

/**
 * A gas in a cylinder with a piston. Hold one variable constant and change
 * another: Boyle's law (p ∝ 1/V), Charles' law (V ∝ T) and the pressure law
 * (p ∝ T) – with the particles speeding up and the graph drawing itself.
 */
export function GasLab({ title = "Gas laws lab", law: startLaw = "boyle" }: { title?: string; law?: Law }) {
  const [law, setLaw] = useState<Law>(startLaw);
  const [n, setN] = useState(0.1);
  const [V, setV] = useState(2.5); // dm³
  const [T, setT] = useState(300); // K
  const [running, setRunning] = useState(false);
  const touch = useToolUse();
  const parts = useRef(Array.from({ length: 30 }, (_, i) => ({ x: 30 + ((i * 37) % 160), y: 30 + ((i * 53) % 170), a: i * 1.7 })));
  const [, force] = useState(0);
  const p0 = (n * R * 300) / (2.5 / 1000) / 1000;

  // In Charles' law the pressure is fixed at its starting value, so V follows T.
  const Vshown = law === "charles" ? (n * R * T) / (p0 * 1000) * 1000 : V;
  const pShown = law === "charles" ? p0 : (n * R * T) / (Vshown / 1000) / 1000;
  const pistonY = 230 - (Vshown / 5) * 200;
  const count = Math.round(n * 300);

  useTicker((dt) => {
    const sp = 20 + Math.sqrt(T) * 6;
    parts.current.forEach((q) => {
      q.x += Math.cos(q.a) * sp * dt;
      q.y += Math.sin(q.a) * sp * dt;
      if (q.x < 22 || q.x > 218) { q.a = Math.PI - q.a; q.x = Math.min(218, Math.max(22, q.x)); }
      if (q.y < pistonY + 8 || q.y > 222) { q.a = -q.a; q.y = Math.min(222, Math.max(pistonY + 8, q.y)); }
    });
    force((k) => k + 1);
  }, running);

  const graph = law === "boyle"
    ? { view: { xMin: 0, xMax: 5.2, yMin: 0, yMax: Math.max(400, (n * R * T) / 0.0005 / 1000 * 1.05) }, f: (x: number) => (x < 0.3 ? NaN : (n * R * T) / (x / 1000) / 1000), x: Vshown, y: pShown, xl: "V (dm³)", yl: "p (kPa)" }
    : law === "charles"
      ? { view: { xMin: 0, xMax: 620, yMin: 0, yMax: 5.5 }, f: (x: number) => (n * R * x) / (p0 * 1000) * 1000, x: T, y: Vshown, xl: "T (K)", yl: "V (dm³)" }
      : { view: { xMin: 0, xMax: 620, yMin: 0, yMax: (n * R * 600) / (V / 1000) / 1000 * 1.1 }, f: (x: number) => (n * R * x) / (V / 1000) / 1000, x: T, y: pShown, xl: "T (K)", yl: "p (kPa)" };

  return (
    <WidgetFrame title={title} colour={C} instruction="Choose a gas law, change the variable on the slider and press Play to see the particles.">
      <Segmented colour={C} value={law} onChange={(l) => { setLaw(l); setV(2.5); setT(300); touch(); }} options={[{ id: "boyle", label: "Boyle (T constant)" }, { id: "charles", label: "Charles (p constant)" }, { id: "pressure", label: "Pressure–temperature (V constant)" }]} />
      <div className="mt-3 grid gap-3 md:grid-cols-[240px_minmax(0,1fr)]">
        <svg viewBox="0 0 240 250" className="diagram rounded-xl border border-line bg-surface" role="img" aria-label={`Volume ${dc(Vshown, 2)} cubic decimetres, pressure ${dc(pShown, 0)} kilopascals, temperature ${T} kelvin`}>
          <rect x="18" y="20" width="204" height="210" fill="none" stroke="var(--text-muted)" strokeWidth="3" />
          <rect x="18" y={pistonY - 6} width="204" height="12" fill="#64748b" />
          <rect x="112" y="0" width="16" height={pistonY - 6} fill="#94a3b8" />
          {parts.current.slice(0, count).map((q, i) => <circle key={i} cx={q.x} cy={Math.max(pistonY + 8, q.y)} r="5" fill={`hsl(${Math.max(0, 230 - (T - 150) / 2)} 85% 55%)`} />)}
          <rect x="18" y="232" width="204" height="10" fill={T > 350 ? "#f97316" : T < 250 ? "#38bdf8" : "var(--surface-2)"} />
          <text x="120" y="248" textAnchor="middle" fontSize="10" className="muted">{T > 350 ? "heating" : T < 250 ? "cooling" : "room temperature"}</text>
        </svg>
        <Plot view={graph.view} width={420} height={240} label="Gas law graph" xLabel={graph.xl} yLabel={graph.yl}>
          <Curve f={graph.f} colour={C} />
          <Dot x={graph.x} y={graph.y} colour="var(--t-change)" label="now" />
        </Plot>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {law === "boyle" ? <Slider label="Volume V (dm³)" value={V} min={0.5} max={5} step={0.25} onChange={(v) => { setV(v); touch(); }} colour={C} format={(v) => dc(v, 2)} />
          : <Slider label="Temperature T (K)" value={T} min={150} max={600} step={10} onChange={(v) => { setT(v); touch(); }} colour="#f97316" format={(v) => `${v} K (${v - 273} °C)`} />}
        <Slider label="Amount of gas n (mol)" value={n} min={0.02} max={0.1} step={0.01} onChange={(v) => { setN(v); touch(); }} colour={C} format={(v) => dc(v, 2)} />
      </div>
      <div className="mt-3"><SimControls running={running} colour={C} onToggle={() => { setRunning((r) => !r); touch(); }} /></div>
      <Readouts className="mt-3" colour={C} items={[
        { label: "pressure p", value: dc(pShown, 1), unit: "kPa", highlight: law !== "charles" },
        { label: "volume V", value: dc(Vshown, 2), unit: "dm³", highlight: law === "charles" },
        { label: "temperature T", value: `${T}`, unit: "K" },
        { label: law === "boyle" ? "pV (constant)" : law === "charles" ? "V/T (constant)" : "p/T (constant)", value: law === "boyle" ? dc(pShown * Vshown, 1) : law === "charles" ? dc(Vshown / T, 4) : dc(pShown / T, 3) },
        { label: "pV = nRT check", value: `${dc(pShown * 1000 * (Vshown / 1000), 1)} = ${dc(n * R * T, 1)}`, unit: "J" },
      ]} />
      <Explain colour={C}>
        {law === "boyle" && <><strong>Boyle&apos;s law:</strong> at constant temperature, pressure is <strong>inversely proportional</strong> to volume (p₁V₁ = p₂V₂). Squash the gas into half the space and the particles hit the walls twice as often – double the pressure.</>}
        {law === "charles" && <><strong>Charles&apos; law:</strong> at constant pressure, volume is <strong>directly proportional</strong> to the kelvin temperature (V₁/T₁ = V₂/T₂). Hotter particles move faster and push the piston up. Extend the line back and it reaches V = 0 at 0 K (−273 °C) – absolute zero.</>}
        {law === "pressure" && <><strong>Pressure–temperature law:</strong> at constant volume, pressure is <strong>directly proportional</strong> to the kelvin temperature (p₁/T₁ = p₂/T₂). That&apos;s why an aerosol can must never be heated.</>}
        {" "}Always use kelvin: T(K) = θ(°C) + 273.
      </Explain>
    </WidgetFrame>
  );
}
