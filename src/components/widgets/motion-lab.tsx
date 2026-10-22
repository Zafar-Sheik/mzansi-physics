"use client";
import { useState } from "react";
import { Curve, Dot, Plot } from "@/components/sci/plot";
import { Arrow, dc, Explain, Readouts, SimControls, useTicker, useToolUse } from "./sim-kit";
import { Segmented, Slider, WidgetFrame } from "./widget-frame";

const PRESETS = {
  steady: { label: "Constant velocity", x0: 0, v: 8, a: 0 },
  faster: { label: "Speeding up", x0: 0, v: 2, a: 2 },
  brake: { label: "Braking", x0: 0, v: 18, a: -3 },
  back: { label: "Turns around", x0: 40, v: 10, a: -4 },
} as const;
type Preset = keyof typeof PRESETS;

const DURATION = 8;
const C = "var(--t-mech)";

/**
 * A taxi on a straight road. Set the starting position, velocity and
 * acceleration, press Play, and watch the position-, velocity- and
 * acceleration-time graphs draw themselves in step with the motion.
 */
export function MotionLab({ title = "Motion lab: graphs come alive" }: { title?: string }) {
  const [x0, setX0] = useState<number>(PRESETS.faster.x0);
  const [v0, setV0] = useState<number>(PRESETS.faster.v);
  const [a, setA] = useState<number>(PRESETS.faster.a);
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const touch = useToolUse();

  useTicker((dt) => {
    setT((old) => {
      const n = old + dt;
      if (n >= DURATION) {
        setRunning(false);
        return DURATION;
      }
      return n;
    });
  }, running);

  const x = (s: number) => x0 + v0 * s + 0.5 * a * s * s;
  const v = (s: number) => v0 + a * s;
  const xs = Array.from({ length: 33 }, (_, k) => x((k * DURATION) / 32));
  const vs = [v(0), v(DURATION)];
  const xMin = Math.min(0, ...xs) - 5;
  const xMax = Math.max(20, ...xs) + 5;
  const vMin = Math.min(0, ...vs) - 2;
  const vMax = Math.max(4, ...vs) + 2;
  const road = (p: number) => 20 + ((p - xMin) / (xMax - xMin)) * 560;
  const set = (fn: (n: number) => void) => (n: number) => { fn(n); setT(0); setRunning(false); touch(); };
  const preset = (p: Preset) => { setX0(PRESETS[p].x0); setV0(PRESETS[p].v); setA(PRESETS[p].a); setT(0); setRunning(false); touch(); };

  const vt = v(t);
  const speeding = Math.abs(vt) > 0.05 && a !== 0 && Math.sign(a) === Math.sign(vt);
  const state = Math.abs(vt) < 0.05 ? "momentarily at rest" : `moving in the ${vt > 0 ? "positive" : "negative"} direction${a === 0 ? " at constant velocity" : speeding ? " and speeding up" : " and slowing down"}`;

  return (
    <WidgetFrame title={title} colour={C} instruction="Pick a scenario or set your own values, then press Play. Watch how the shape of each graph matches the motion.">
      <Segmented colour={C} value={(Object.keys(PRESETS) as Preset[]).find((p) => PRESETS[p].x0 === x0 && PRESETS[p].v === v0 && PRESETS[p].a === a) ?? ("" as Preset)} onChange={preset}
        options={(Object.keys(PRESETS) as Preset[]).map((p) => ({ id: p, label: PRESETS[p].label }))} />
      <svg viewBox="0 0 600 110" className="diagram mt-3 rounded-xl border border-line bg-surface-2/40" role="img" aria-label={`Taxi at position ${dc(x(t), 1)} metres, ${state}`}>
        <rect x="0" y="70" width="600" height="26" fill="var(--surface-2)" />
        {Array.from({ length: 13 }, (_, k) => <rect key={k} x={k * 50 + 10} y="82" width="24" height="3" fill="var(--text-muted)" opacity="0.5" />)}
        <line x1={road(0)} x2={road(0)} y1="60" y2="100" stroke="var(--graph-axis)" strokeWidth="2" />
        <text x={road(0)} y="56" textAnchor="middle" fontSize="11" className="muted">x = 0</text>
        <g transform={`translate(${road(x(t))}, 62)`}>
          <rect x="-24" y="-18" width="48" height="16" rx="4" fill="#facc15" stroke="#a16207" />
          <rect x="-14" y="-28" width="26" height="11" rx="3" fill="#fde68a" stroke="#a16207" />
          <circle cx="-13" cy="0" r="5" fill="#1f2937" /><circle cx="13" cy="0" r="5" fill="#1f2937" />
          <text y="-30" textAnchor="middle" fontSize="9" fontWeight="800" fill="#a16207">TAXI</text>
        </g>
        <Arrow x={road(x(t))} y={30} length={vt * 4} angle={0} colour="var(--curve-1)" label={Math.abs(vt) > 0.5 ? "v" : undefined} />
        <Arrow x={road(x(t))} y={14} length={a * 8} angle={0} colour="var(--t-change)" label={a !== 0 ? "a" : undefined} width={2.5} />
      </svg>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <Slider label="Start position x₀ (m)" value={x0} min={-20} max={60} step={5} onChange={set(setX0)} colour={C} />
        <Slider label="Initial velocity vᵢ (m·s⁻¹)" value={v0} min={-10} max={20} step={1} onChange={set(setV0)} colour="var(--curve-1)" />
        <Slider label="Acceleration a (m·s⁻²)" value={a} min={-5} max={5} step={0.5} onChange={set(setA)} colour="var(--t-change)" format={(n) => dc(n, 1)} />
      </div>
      <div className="mt-3"><SimControls running={running} colour={C} onToggle={() => { if (t >= DURATION) setT(0); setRunning((r) => !r); touch(); }} onReset={() => { setT(0); setRunning(false); }}>
        <span className="font-mono text-sm tabular-nums text-muted">t = {dc(t, 1)} s</span>
      </SimControls></div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div><div className="mb-1 text-xs font-bold text-muted">Position vs time (gradient = velocity)</div>
          <Plot view={{ xMin: -0.4, xMax: DURATION, yMin: xMin, yMax: xMax }} width={260} height={180} label="Position-time graph" xLabel="t" yLabel="x">
            <Curve f={x} colour="var(--curve-ghost)" dashed />
            <Curve f={x} from={0} to={t} colour={C} />
            <Dot x={t} y={x(t)} colour={C} />
          </Plot></div>
        <div><div className="mb-1 text-xs font-bold text-muted">Velocity vs time (gradient = a, area = Δx)</div>
          <Plot view={{ xMin: -0.4, xMax: DURATION, yMin: vMin, yMax: vMax }} width={260} height={180} label="Velocity-time graph" xLabel="t" yLabel="v">
            <Curve f={v} colour="var(--curve-ghost)" dashed />
            <Curve f={v} from={0} to={t} colour="var(--curve-1)" />
            <Dot x={t} y={v(t)} colour="var(--curve-1)" />
          </Plot></div>
        <div><div className="mb-1 text-xs font-bold text-muted">Acceleration vs time</div>
          <Plot view={{ xMin: -0.4, xMax: DURATION, yMin: -6, yMax: 6 }} width={260} height={180} label="Acceleration-time graph" xLabel="t" yLabel="a">
            <Curve f={() => a} colour="var(--curve-ghost)" dashed />
            <Curve f={() => a} from={0} to={t} colour="var(--t-change)" />
          </Plot></div>
      </div>
      <Readouts className="mt-3" colour={C} items={[
        { label: "time t", value: dc(t, 1), unit: "s" },
        { label: "position x", value: dc(x(t), 1), unit: "m" },
        { label: "displacement Δx", value: dc(x(t) - x0, 1), unit: "m", highlight: true },
        { label: "velocity v", value: dc(vt, 1), unit: "m·s⁻¹" },
        { label: "acceleration a", value: dc(a, 1), unit: "m·s⁻²" },
        { label: "speed", value: dc(Math.abs(vt), 1), unit: "m·s⁻¹" },
      ]} />
      <Explain colour={C}>
        The taxi is <strong>{state}</strong>. {a === 0 ? "No acceleration means a straight, sloping x-t graph and a flat v-t graph." : `A constant acceleration of ${dc(a, 1)} m·s⁻² makes the v-t graph a straight line with gradient ${dc(a, 1)} and the x-t graph a curve (a parabola).`}
        {" "}When velocity and acceleration point the <em>same</em> way it speeds up; when they point <em>opposite</em> ways it slows down.
      </Explain>
    </WidgetFrame>
  );
}
