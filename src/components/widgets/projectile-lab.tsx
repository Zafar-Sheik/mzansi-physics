"use client";
import { useMemo, useState } from "react";
import { Dot, Guide, Plot, Polyline } from "@/components/sci/plot";
import { Arrow, dc, Explain, Readouts, SimControls, useTicker, useToolUse } from "./sim-kit";
import { Segmented, Slider, Toggle, WidgetFrame } from "./widget-frame";

const g = 9.8;
const C = "var(--t-mech)";
const MAX_T = 8;

interface Sample { t: number; h: number; v: number }

/** Simulate a ball released at height h0 with velocity u (up positive), with optional bounces. */
function simulate(h0: number, u: number, bounce: boolean, e: number): Sample[] {
  const out: Sample[] = [];
  let h = h0;
  let v = u;
  const dt = 0.005;
  for (let t = 0; t <= MAX_T; t += dt) {
    if (Math.round(t / dt) % 4 === 0) out.push({ t, h, v });
    v -= g * dt;
    h += v * dt;
    if (h <= 0) {
      h = 0;
      if (!bounce || Math.abs(v) < 0.6) {
        out.push({ t: t + dt, h: 0, v });
        break;
      }
      out.push({ t: t + dt, h: 0, v });
      v = -v * e;
      out.push({ t: t + dt, h: 0, v });
    }
  }
  return out;
}

/**
 * Vertical projectile motion: throw a ball up or down from any height, with or
 * without bouncing. Switch between "up is positive" and "down is positive" and
 * watch every graph flip – the sign convention made visible.
 */
export function ProjectileLab({ title = "Projectile lab: up, up and down" }: { title?: string }) {
  const [u, setU] = useState(15);
  const [h0, setH0] = useState(0);
  const [bounce, setBounce] = useState(false);
  const [e, setE] = useState(0.7);
  const [upPositive, setUpPositive] = useState(true);
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const touch = useToolUse();
  const data = useMemo(() => simulate(h0, u, bounce, e), [h0, u, bounce, e]);
  const end = data[data.length - 1].t;

  useTicker((dt) => setT((old) => {
    const n = old + dt;
    if (n >= end) { setRunning(false); return end; }
    return n;
  }), running);

  const at = data.reduce((best, s) => (Math.abs(s.t - t) < Math.abs(best.t - t) ? s : best), data[0]);
  const sign = upPositive ? 1 : -1;
  const shown = data.filter((s) => s.t <= t + 1e-9);
  const maxH = Math.max(...data.map((s) => s.h));
  const tTop = u > 0 ? u / g : 0;
  const vMax = Math.max(...data.map((s) => Math.abs(s.v))) + 2;
  const sky = (h: number) => 230 - (h / Math.max(10, maxH * 1.1)) * 200;
  const reset = () => { setT(0); setRunning(false); };
  const ch = (fn: (n: number) => void) => (n: number) => { fn(n); reset(); touch(); };
  const moving = Math.abs(at.v) < 0.3 ? "at the top – momentarily at rest (but a is still 9,8 m·s⁻² downwards!)" : at.v > 0 ? "moving upwards and slowing down" : "moving downwards and speeding up";

  return (
    <WidgetFrame title={title} colour={C} instruction="Set the launch velocity and height, choose a sign convention, then press Play. Air resistance is ignored, so the only force is gravity.">
      <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
        <svg viewBox="0 0 180 250" className="diagram rounded-xl border border-line bg-gradient-to-b from-sky-200/40 to-transparent" role="img" aria-label={`Ball at height ${dc(at.h, 1)} metres, ${moving}`}>
          <rect x="0" y="230" width="180" height="20" fill="#65a30d" opacity="0.6" />
          {h0 > 0 && <rect x="20" y={sky(h0)} width="40" height={230 - sky(h0)} fill="var(--surface-2)" stroke="var(--border)" />}
          <line x1="110" x2="110" y1={sky(maxH)} y2="230" stroke="var(--graph-grid)" strokeDasharray="4 4" />
          <text x="118" y={sky(maxH) + 4} fontSize="10" className="muted">max {dc(maxH, 1)} m</text>
          <circle cx="90" cy={sky(at.h) - 8} r="8" fill={C} />
          <Arrow x={90} y={sky(at.h) - 8} length={at.v * 3} angle={90} colour="var(--curve-1)" label={Math.abs(at.v) > 1 ? "v" : undefined} labelOffset={10} />
          <Arrow x={60 + 85} y={40} length={-28} angle={90} colour="var(--t-change)" label="g" width={2.5} />
          <text x="150" y="88" fontSize="10" textAnchor="middle" fill="var(--t-change)">always</text>
          <text x="20" y="20" fontSize="11" fontWeight="700" fill="var(--text-muted)">{upPositive ? "↑ up = +" : "↓ down = +"}</text>
        </svg>
        <div className="min-w-0">
          <div className="grid gap-3 sm:grid-cols-2">
            <Slider label="Launch velocity (up = +) m·s⁻¹" value={u} min={-15} max={25} step={1} onChange={ch(setU)} colour={C} />
            <Slider label="Release height (m)" value={h0} min={0} max={40} step={5} onChange={ch(setH0)} colour={C} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Segmented colour={C} value={upPositive ? "up" : "down"} onChange={(v) => { setUpPositive(v === "up"); touch(); }} options={[{ id: "up", label: "Upwards positive" }, { id: "down", label: "Downwards positive" }]} />
            <Toggle on={bounce} onChange={(b) => { setBounce(b); reset(); touch(); }}>Bounce</Toggle>
          </div>
          {bounce && <div className="mt-2 max-w-xs"><Slider label="Bounce keeps this fraction of the speed" value={e} min={0.3} max={0.95} step={0.05} onChange={ch(setE)} colour={C} format={(n) => dc(n, 2)} /></div>}
          <div className="mt-3"><SimControls running={running} colour={C} onToggle={() => { if (t >= end) setT(0); setRunning((r) => !r); touch(); }} onReset={reset}>
            <span className="font-mono text-sm tabular-nums text-muted">t = {dc(t, 2)} s</span>
          </SimControls></div>
        </div>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div><div className="mb-1 text-xs font-bold text-muted">Position (height) vs time</div>
          <Plot view={{ xMin: -0.2, xMax: Math.max(2, end), yMin: upPositive ? -2 : -maxH * 1.1 - 2, yMax: upPositive ? maxH * 1.1 + 2 : 2 }} width={260} height={180} label="Position-time graph" xLabel="t" yLabel={upPositive ? "height" : "−height"}>
            <Polyline points={data.map((s) => [s.t, sign * s.h])} colour="var(--curve-ghost)" dashed />
            <Polyline points={shown.map((s) => [s.t, sign * s.h])} colour={C} />
            <Dot x={at.t} y={sign * at.h} colour={C} />
          </Plot></div>
        <div><div className="mb-1 text-xs font-bold text-muted">Velocity vs time (gradient = {upPositive ? "−9,8" : "+9,8"})</div>
          <Plot view={{ xMin: -0.2, xMax: Math.max(2, end), yMin: -vMax, yMax: vMax }} width={260} height={180} label="Velocity-time graph" xLabel="t" yLabel="v">
            <Polyline points={data.map((s) => [s.t, sign * s.v])} colour="var(--curve-ghost)" dashed />
            <Polyline points={shown.map((s) => [s.t, sign * s.v])} colour="var(--curve-1)" />
            {tTop > 0 && <Guide x={tTop} label="top" />}
            <Dot x={at.t} y={sign * at.v} colour="var(--curve-1)" />
          </Plot></div>
        <div><div className="mb-1 text-xs font-bold text-muted">Acceleration vs time</div>
          <Plot view={{ xMin: -0.2, xMax: Math.max(2, end), yMin: -12, yMax: 12 }} width={260} height={180} label="Acceleration-time graph" xLabel="t" yLabel="a">
            <Polyline points={[[0, -sign * g], [Math.max(0.01, t), -sign * g]]} colour="var(--t-change)" />
          </Plot></div>
      </div>
      <Readouts className="mt-3" colour={C} items={[
        { label: "height above ground", value: dc(at.h, 2), unit: "m" },
        { label: `velocity (${upPositive ? "up" : "down"} +)`, value: dc(sign * at.v, 2), unit: "m·s⁻¹", highlight: true },
        { label: `acceleration (${upPositive ? "up" : "down"} +)`, value: dc(-sign * g, 1), unit: "m·s⁻²" },
        { label: "time to the top", value: u > 0 ? dc(tTop, 2) : "–", unit: u > 0 ? "s" : undefined },
        { label: "max height above ground", value: dc(maxH, 2), unit: "m" },
        { label: "first landing", value: dc((data.find((s, i) => i > 0 && s.h === 0) ?? data[data.length - 1]).t, 2), unit: "s" },
      ]} />
      <Explain colour={C}>
        Right now the ball is <strong>{moving}</strong>. The velocity-time graph is a <strong>straight line</strong> because the acceleration is constant ({upPositive ? "−9,8" : "+9,8"} m·s⁻² with {upPositive ? "up" : "down"} positive).
        {u > 0 && ` Time up = time down from the same level: ${dc(tTop, 2)} s each way.`} {bounce && " At each bounce the velocity suddenly changes sign – a vertical jump on the v-t graph."}
      </Explain>
    </WidgetFrame>
  );
}
