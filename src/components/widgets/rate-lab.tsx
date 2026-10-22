"use client";
import { useRef, useState } from "react";
import { AreaBetween, Curve, Guide, Plot, Polyline } from "@/components/sci/plot";
import { dc, Explain, Readouts, SimControls, useTicker, useToolUse } from "./sim-kit";
import { Segmented, Slider, Toggle, WidgetFrame } from "./widget-frame";

const C = "var(--t-change)";
type P = { x: number; y: number; vx: number; vy: number; kind: "A" | "B" | "P" };

function makeParts(n: number): P[] {
  return Array.from({ length: n * 2 }, (_, i) => {
    const a = i * 2.39;
    return { x: 20 + ((i * 47) % 300), y: 20 + ((i * 31) % 200), vx: Math.cos(a), vy: Math.sin(a), kind: i % 2 ? "B" : "A" };
  });
}

/** Maxwell-Boltzmann style distribution of kinetic energies at temperature T (arbitrary units). */
const mb = (E: number, T: number) => (E <= 0 ? 0 : (2 / Math.sqrt(Math.PI)) * Math.sqrt(E) * (1 / T) ** 1.5 * Math.exp(-E / T) * 100);

/**
 * Collision theory in a box: A and B particles must collide with at least the
 * activation energy (and the right orientation) to react. Change the
 * temperature, the concentration and add a catalyst; watch the rate and the
 * Maxwell-Boltzmann distribution.
 */
export function RateLab({ title = "Rates of reaction: collision theory" }: { title?: string }) {
  const [T, setT] = useState(3);
  const [conc, setConc] = useState(14);
  const [cat, setCat] = useState(false);
  const [view, setView] = useState<"box" | "mb">("box");
  const [running, setRunning] = useState(false);
  const touch = useToolUse();
  const Ea = cat ? 5 : 9;
  const parts = useRef<P[]>(makeParts(14));
  const timeline = useRef<[number, number][]>([[0, 0]]);
  const clock = useRef(0);
  const [, force] = useState(0);

  const reset = (n = conc) => {
    parts.current = makeParts(n);
    timeline.current = [[0, 0]];
    clock.current = 0;
    force((x) => x + 1);
  };

  useTicker((dt) => {
    clock.current += dt;
    const list = parts.current;
    const speed = 30 + Math.sqrt(T) * 30;
    for (const p of list) {
      const m = Math.hypot(p.vx, p.vy) || 1;
      p.x += (p.vx / m) * speed * dt;
      p.y += (p.vy / m) * speed * dt;
      if (p.x < 10 || p.x > 330) p.vx *= -1;
      if (p.y < 10 || p.y > 230) p.vy *= -1;
      p.x = Math.max(10, Math.min(330, p.x));
      p.y = Math.max(10, Math.min(230, p.y));
    }
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const a = list[i], b = list[j];
      if (a.kind === "P" || b.kind === "P" || a.kind === b.kind) continue;
      if (Math.hypot(a.x - b.x, a.y - b.y) < 14) {
        // Fraction of collisions with E ≥ Ea ≈ e^(−Ea/T); orientation factor ½.
        if (Math.random() < Math.exp(-Ea / T) * 0.5 * 3) { a.kind = "P"; b.kind = "P"; a.vx *= 0.6; b.vx *= 0.6; }
        else { [a.vx, b.vx] = [b.vx, a.vx]; [a.vy, b.vy] = [b.vy, a.vy]; }
      }
    }
    const made = list.filter((p) => p.kind === "P").length / 2;
    const tl = timeline.current;
    if (clock.current - tl[tl.length - 1][0] > 0.25) tl.push([clock.current, made]);
    force((x) => x + 1);
  }, running && view === "box");

  const made = parts.current.filter((p) => p.kind === "P").length / 2;
  const tl = timeline.current;
  const tEnd = Math.max(10, clock.current);
  const fractionAbove = (() => { let s = 0, tot = 0; for (let E = 0.05; E < 40; E += 0.05) { const v = mb(E, T); tot += v; if (E >= Ea) s += v; } return s / tot; })();

  return (
    <WidgetFrame title={title} colour={C} instruction="Press Play. Then make it hotter, add more particles (concentration) or a catalyst and compare how fast the product forms.">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented colour={C} value={view} onChange={(v) => { setView(v); touch(); }} options={[{ id: "box", label: "Collisions" }, { id: "mb", label: "Maxwell-Boltzmann" }]} />
        <Toggle on={cat} onChange={(c) => { setCat(c); touch(); }}>Catalyst</Toggle>
      </div>
      {view === "box" ? (
        <div className="mt-3 grid gap-3 md:grid-cols-[340px_minmax(0,1fr)]">
          <svg viewBox="0 0 340 240" className="diagram rounded-xl border border-line bg-surface" role="img" aria-label={`${made} product molecules formed`}>
            <rect x="4" y="4" width="332" height="232" rx="8" fill={`hsl(${220 - T * 22} 80% 60% / 0.08)`} stroke="var(--text-muted)" strokeWidth="2" />
            {parts.current.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.kind === "P" ? 6 : 7} fill={p.kind === "A" ? "#3b82f6" : p.kind === "B" ? "#f97316" : "#22c55e"} stroke="white" />)}
          </svg>
          <div>
            <div className="mb-1 text-xs font-bold text-muted">Product formed vs time (gradient = rate)</div>
            <Plot view={{ xMin: 0, xMax: tEnd, yMin: 0, yMax: conc + 1 }} width={320} height={200} label="Amount of product against time" xLabel="t" yLabel="product">
              <Polyline points={tl} colour="var(--t-matter)" />
            </Plot>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <Plot view={{ xMin: 0, xMax: 20, yMin: 0, yMax: 40 }} width={560} height={240} label="Distribution of kinetic energies" xLabel="kinetic energy" yLabel="number of particles">
            <AreaBetween f={(E) => mb(E, T)} from={Ea} to={20} colour={C} opacity={0.3} />
            <Curve f={(E) => mb(E, 2)} colour="var(--curve-ghost)" dashed />
            <Curve f={(E) => mb(E, T)} colour={C} />
            <Guide x={Ea} label={cat ? "Eₐ with catalyst" : "Eₐ"} />
          </Plot>
          <p className="mt-1 text-xs text-muted">Dashed: a cooler temperature for comparison. Shaded: particles with enough energy to react.</p>
        </div>
      )}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Slider label="Temperature" value={T} min={1.5} max={6} step={0.5} onChange={(v) => { setT(v); touch(); }} colour="#f97316" format={(v) => `${Math.round(200 + v * 50)} K`} />
        <Slider label="Concentration (particles of each)" value={conc} min={4} max={24} step={2} onChange={(v) => { setConc(v); reset(v); setRunning(false); touch(); }} colour="#3b82f6" />
      </div>
      <div className="mt-3"><SimControls running={running} colour={C} onToggle={() => { setRunning((r) => !r); touch(); }} onReset={() => { reset(); setRunning(false); }} /></div>
      <Readouts className="mt-3" colour={C} items={[
        { label: "product molecules", value: String(made) },
        { label: "average rate so far", value: clock.current > 0 ? dc(made / clock.current, 2) : "–", unit: "per s", highlight: true },
        { label: "fraction with E ≥ Eₐ", value: `${dc(fractionAbove * 100, 1)} %` },
      ]} />
      <Explain colour={C}>
        <strong>Collision theory:</strong> particles react only if they collide with the <strong>correct orientation</strong> and with at least the <strong>activation energy</strong>. Higher <strong>concentration</strong> (or pressure, or surface area) → more collisions per second. Higher <strong>temperature</strong> → faster particles, and a much bigger fraction with E ≥ Eₐ (the shaded area). A <strong>catalyst</strong> lowers Eₐ, so more collisions are effective – without being used up.
      </Explain>
    </WidgetFrame>
  );
}
