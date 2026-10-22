"use client";
import { useRef, useState } from "react";
import { dc, Explain, Readouts, SimControls, useTicker, useToolUse } from "./sim-kit";
import { Segmented, Slider, Toggle, WidgetFrame } from "./widget-frame";

const g = 9.8;
const C = "var(--t-mech)";

const TRACKS = {
  pipe: { label: "Half-pipe", y: (x: number) => 0.24 * (x - 5) ** 2, top: 6 },
  double: { label: "Double dip", y: (x: number) => 0.024 * (x - 5) ** 4 - 0.6 * (x - 5) ** 2 + 4, top: 4 },
} as const;
type Track = keyof typeof TRACKS;

/**
 * Energy skate park: a skateboarder rolls on a track. Potential and kinetic
 * energy trade places while the total mechanical energy stays constant –
 * until you switch on friction and watch energy turn into heat.
 */
export function EnergyLab({ title = "Energy skate park", friction: frictionStart = false }: { title?: string; friction?: boolean }) {
  const [track, setTrack] = useState<Track>("pipe");
  const [m, setM] = useState(50);
  const [H, setH] = useState(5);
  const [friction, setFriction] = useState(frictionStart);
  const [running, setRunning] = useState(false);
  const touch = useToolUse();
  const sim = useRef({ x: 0, v: 0, lost: 0 });
  const [, force] = useState(0);
  const scale = H / TRACKS[track].top;
  const y = (x: number) => TRACKS[track].y(x) * scale;
  const dy = (x: number) => (y(x + 0.001) - y(x - 0.001)) / 0.002;
  const mu = friction ? 0.06 : 0;

  // Speed from energy conservation, so E_mech stays exactly constant on screen without friction.
  const speedAt = (x: number, lost: number) => Math.sqrt(Math.max(0, 2 * g * (H - y(x)) - (2 * lost) / m));

  useTicker((dt) => {
    const s = sim.current;
    for (let k = 0; k < 25; k++) {
      const h = dt / 25;
      const slope = dy(s.x);
      const cos = 1 / Math.sqrt(1 + slope * slope);
      const sin = slope * cos;
      // Along the track: a = −g sinθ − μg cosθ (friction opposes the motion).
      if (Math.abs(s.v) < 0.02 && Math.abs(sin) <= mu * cos) {
        s.v = 0;
        continue;
      }
      s.v += (-g * sin - (s.v === 0 ? Math.sign(-sin) : Math.sign(s.v)) * mu * g * cos) * h;
      const nx = s.x + s.v * cos * h;
      s.lost += mu * m * g * cos * Math.abs(nx - s.x) / cos;
      s.x = nx;
      if (s.x <= 0 || s.x >= 10) {
        s.x = Math.min(10, Math.max(0, s.x));
        s.v = -s.v;
      }
    }
    force((n) => n + 1);
  }, running);

  const s = sim.current;
  const v = friction ? Math.abs(s.v) : speedAt(s.x, 0);
  const Ep = m * g * y(s.x);
  const Ek = 0.5 * m * v * v;
  const total = m * g * H;
  const W = 600;
  const px = (x: number) => 30 + x * 54;
  const py = (h: number) => 230 - (h / 7) * 200;
  const path = Array.from({ length: 101 }, (_, i) => `${i ? "L" : "M"}${px(i / 10).toFixed(1)},${py(y(i / 10)).toFixed(1)}`).join("");
  const reset = () => { sim.current = { x: 0, v: 0, lost: 0 }; setRunning(false); force((n) => n + 1); };
  const slope = dy(s.x);
  const ang = (Math.atan(slope) * 180) / Math.PI;
  const bar = (val: number) => `${Math.max(0, Math.min(100, (val / total) * 100))}%`;

  return (
    <WidgetFrame title={title} colour={C} instruction="Choose a track and a drop height, then press Play. Watch the energy bars: the total stays the same unless friction is on.">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented colour={C} value={track} onChange={(t) => { setTrack(t); reset(); touch(); }} options={(Object.keys(TRACKS) as Track[]).map((t) => ({ id: t, label: TRACKS[t].label }))} />
        <Toggle on={friction} onChange={(f) => { setFriction(f); reset(); touch(); }}>Friction</Toggle>
      </div>
      <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <svg viewBox={`0 0 ${W} 250`} className="diagram rounded-xl border border-line bg-gradient-to-b from-sky-200/30 to-transparent" role="img" aria-label={`Skateboarder at height ${dc(y(s.x), 1)} metres moving at ${dc(v, 1)} metres per second`}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((h) => <g key={h}><line x1="20" x2={W - 20} y1={py(h)} y2={py(h)} stroke="var(--graph-grid)" /><text x="6" y={py(h) + 3} fontSize="9" className="muted">{h}</text></g>)}
          <line x1="20" x2={W - 20} y1={py(H)} y2={py(H)} stroke={C} strokeDasharray="6 4" />
          <text x={W - 24} y={py(H) - 4} textAnchor="end" fontSize="10" fill={C}>release height {dc(H, 1)} m</text>
          <path d={`${path} L${px(10)},240 L${px(0)},240 Z`} fill="var(--surface-2)" />
          <path d={path} fill="none" stroke="var(--text-muted)" strokeWidth="4" strokeLinecap="round" />
          <g transform={`translate(${px(s.x)}, ${py(y(s.x))}) rotate(${-ang})`}>
            <rect x="-14" y="-6" width="28" height="4" rx="2" fill="#7c2d12" />
            <circle cx="-9" cy="-1" r="2.5" fill="#111" /><circle cx="9" cy="-1" r="2.5" fill="#111" />
            <line x1="0" y1="-6" x2="0" y2="-22" stroke={C} strokeWidth="3" strokeLinecap="round" />
            <circle cx="0" cy="-27" r="5" fill="#fbbf24" />
            <line x1="-8" y1="-16" x2="8" y2="-16" stroke={C} strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
        <div className="flex items-end justify-around gap-2 rounded-xl border border-line p-3" aria-label="Energy bar chart">
          {[["Eₚ", Ep, "var(--t-systems)"], ["Eₖ", Ek, "var(--t-mech)"], ["Heat", s.lost, "var(--danger)"], ["E_mech", Ep + Ek, "var(--t-matter)"]].map(([lab, val, col]) => (
            <div key={lab as string} className="flex h-48 w-10 flex-col items-center justify-end gap-1">
              <div className="w-full rounded-t-md transition-[height]" style={{ height: bar(val as number), background: col as string }} />
              <div className="text-xs font-bold">{lab as string}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Slider label="Mass (kg)" value={m} min={20} max={100} step={5} onChange={(n) => { setM(n); reset(); touch(); }} colour={C} />
        <Slider label="Release height (m)" value={H} min={1} max={6.5} step={0.5} onChange={(n) => { setH(n); reset(); touch(); }} colour={C} format={(n) => dc(n, 1)} />
      </div>
      <div className="mt-3"><SimControls running={running} colour={C} onToggle={() => { setRunning((r) => !r); touch(); }} onReset={reset} /></div>
      <Readouts className="mt-3" colour={C} items={[
        { label: "height h", value: dc(y(s.x), 2), unit: "m" },
        { label: "speed v", value: dc(v, 2), unit: "m·s⁻¹" },
        { label: "Eₚ = mgh", value: dc(Ep, 0), unit: "J" },
        { label: "Eₖ = ½mv²", value: dc(Ek, 0), unit: "J" },
        { label: "E_mech = Eₚ + Eₖ", value: dc(Ep + Ek, 0), unit: "J", highlight: true },
        { label: "work done by friction", value: dc(s.lost, 0), unit: "J" },
      ]} />
      <Explain colour={C}>
        {friction
          ? <>Friction is a <strong>non-conservative force</strong>: it does negative work, so mechanical energy is <strong>not</strong> conserved – it changes into heat (thermal energy). The total energy (mechanical + heat) is still {dc(total, 0)} J.</>
          : <>With no friction, <strong>mechanical energy is conserved</strong>: E_mech = Eₚ + Eₖ = {dc(total, 0)} J everywhere on the track. At the bottom Eₚ is smallest and Eₖ biggest. The skater can never rise above the release height – and notice the mass cancels: v = √(2gΔh).</>}
      </Explain>
    </WidgetFrame>
  );
}
