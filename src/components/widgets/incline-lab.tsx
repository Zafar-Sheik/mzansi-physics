"use client";
import { useState } from "react";
import { Arrow, dc, Explain, Readouts, SimControls, useTicker, useToolUse } from "./sim-kit";
import { Slider, Toggle, WidgetFrame } from "./widget-frame";

const g = 9.8;
const C = "var(--t-mech)";

/**
 * A crate on a slope: tilt it, change the mass and the friction, push it, and
 * see the free-body diagram, the components of weight, whether static friction
 * can hold it, and the acceleration from Newton's second law.
 */
export function InclineLab({ title = "Forces on a slope" }: { title?: string }) {
  const [theta, setTheta] = useState(25);
  const [m, setM] = useState(10);
  const [mus, setMus] = useState(0.4);
  const [muk, setMuk] = useState(0.3);
  const [F, setF] = useState(0);
  const [comps, setComps] = useState(true);
  const [running, setRunning] = useState(false);
  const [s, setS] = useState(0);
  const [v, setV] = useState(0);
  const touch = useToolUse();

  const rad = (theta * Math.PI) / 180;
  const W = m * g;
  const par = W * Math.sin(rad); // down the slope
  const perp = W * Math.cos(rad);
  const N = perp;
  const fsMax = mus * N;
  const drive = F - par; // positive = up the slope
  const staticHolds = Math.abs(v) < 1e-6 && Math.abs(drive) <= fsMax;
  const fk = muk * N;
  const dirMove = Math.abs(v) > 1e-6 ? Math.sign(v) : Math.sign(drive);
  const friction = staticHolds ? -drive : -dirMove * fk;
  const Fnet = staticHolds ? 0 : drive + friction;
  const a = Fnet / m;

  useTicker((dt) => {
    setV((old) => {
      if (staticHolds) return 0;
      const nv = old + a * dt;
      // Kinetic friction cannot reverse the motion: stop when v crosses 0.
      if (old !== 0 && Math.sign(nv) !== Math.sign(old) && Math.abs(drive) <= fsMax) return 0;
      return nv;
    });
    setS((old) => Math.max(-6, Math.min(6, old + v * dt)));
  }, running);

  const reset = () => { setRunning(false); setS(0); setV(0); };
  const ch = (fn: (n: number) => void) => (n: number) => { fn(n); reset(); touch(); };

  // Geometry: slope from bottom-left (40, 260) rising to the right.
  const L = 420;
  const x0 = 40, y0 = 270;
  const along = (d: number) => ({ x: x0 + d * Math.cos(rad), y: y0 - d * Math.sin(rad) });
  const pos = 210 + s * 25;
  const c = along(pos);
  const nX = -Math.sin(rad), nY = -Math.cos(rad); // outward normal in SVG coords
  const centre = { x: c.x + nX * 22, y: c.y + nY * 22 };
  const k = 1.4; // px per newton
  const state = staticHolds ? (Math.abs(drive) < 0.01 ? "balanced with no friction needed" : "held still by static friction") : Math.abs(v) > 0.05 ? `sliding ${v > 0 ? "up" : "down"} the slope` : `about to slide ${drive > 0 ? "up" : "down"}`;

  return (
    <WidgetFrame title={title} colour={C} instruction="Tilt the slope and change the friction. Add a push along the slope if you like, then press Play.">
      <svg viewBox="0 0 520 300" className="diagram rounded-xl border border-line bg-surface" role="img" aria-label={`Crate on a ${theta} degree slope, ${state}`}>
        <path d={`M${x0},${y0} L${along(L).x},${along(L).y} L${along(L).x},${y0} Z`} fill="var(--surface-2)" stroke="var(--border)" />
        <path d={`M${x0 + 50},${y0} A50,50 0 0,0 ${along(50).x},${along(50).y}`} fill="none" stroke="var(--text-muted)" />
        <text x={x0 + 58} y={y0 - 6} fontSize="12" className="muted">θ = {theta}°</text>
        <g transform={`translate(${centre.x}, ${centre.y}) rotate(${-theta})`}>
          <rect x="-22" y="-22" width="44" height="44" rx="4" fill="#d97706" stroke="#92400e" strokeWidth="2" />
          <path d="M-22,-22 L22,22 M22,-22 L-22,22" stroke="#92400e" strokeWidth="1.5" opacity="0.5" />
          <text y="5" textAnchor="middle" fontSize="12" fontWeight="800" fill="white">{m} kg</text>
        </g>
        <Arrow x={centre.x} y={centre.y} length={W * k * 0.5} angle={-90} colour="var(--t-systems)" label="Fg" width={3} />
        {comps && <>
          <Arrow x={centre.x} y={centre.y} length={par * k * 0.5} angle={180 + theta} colour="var(--t-systems)" label="Fg∥" dashed width={2} />
          <Arrow x={centre.x} y={centre.y} length={perp * k * 0.5} angle={theta - 90} colour="var(--t-systems)" label="Fg⊥" dashed width={2} />
        </>}
        <Arrow x={centre.x} y={centre.y} length={N * k * 0.5} angle={90 + theta} colour="var(--t-matter)" label="N" width={3} />
        {Math.abs(friction) > 0.05 && <Arrow x={c.x} y={c.y} length={friction * k * 0.5} angle={theta} colour="var(--danger)" label="f" width={3} />}
        {F > 0 && <Arrow x={centre.x} y={centre.y} length={F * k * 0.5} angle={theta} colour="var(--curve-1)" label="F" width={3} />}
      </svg>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Slider label="Angle of slope θ (°)" value={theta} min={0} max={60} step={1} onChange={ch(setTheta)} colour={C} />
        <Slider label="Mass m (kg)" value={m} min={1} max={30} step={1} onChange={ch(setM)} colour={C} />
        <Slider label="Push up the slope F (N)" value={F} min={0} max={250} step={5} onChange={ch(setF)} colour="var(--curve-1)" />
        <Slider label="Static friction coefficient μs" value={mus} min={0} max={1} step={0.05} onChange={ch((n) => { setMus(n); if (muk > n) setMuk(n); })} colour="var(--danger)" format={(n) => dc(n, 2)} />
        <Slider label="Kinetic friction coefficient μk" value={muk} min={0} max={mus} step={0.05} onChange={ch(setMuk)} colour="var(--danger)" format={(n) => dc(n, 2)} />
        <div className="flex items-end"><Toggle on={comps} onChange={setComps}>Show components of Fg</Toggle></div>
      </div>
      <div className="mt-3"><SimControls running={running} colour={C} onToggle={() => { setRunning((r) => !r); touch(); }} onReset={reset} /></div>
      <Readouts className="mt-3" colour={C} items={[
        { label: "weight Fg = mg", value: dc(W, 1), unit: "N" },
        { label: "Fg∥ = mg sin θ", value: dc(par, 1), unit: "N" },
        { label: "N = mg cos θ", value: dc(N, 1), unit: "N" },
        { label: "max static friction μsN", value: dc(fsMax, 1), unit: "N" },
        { label: "friction now", value: dc(Math.abs(friction), 1), unit: "N" },
        { label: "a = Fnet / m", value: dc(a, 2), unit: "m·s⁻²", highlight: true },
      ]} />
      <Explain colour={C}>
        The crate is <strong>{state}</strong>.{" "}
        {staticHolds
          ? <>Static friction ({dc(Math.abs(friction), 1)} N) is just big enough to cancel the other forces along the slope, so Fnet = 0 and the crate stays at rest (Newton&apos;s first law). It can reach at most μsN = {dc(fsMax, 1)} N.</>
          : <>The forces along the slope don&apos;t balance: Fnet = {dc(Fnet, 1)} N {Fnet >= 0 ? "up" : "down"} the slope, so a = Fnet/m = {dc(Math.abs(a), 2)} m·s⁻² (Newton&apos;s second law). Kinetic friction μkN = {dc(fk, 1)} N always opposes the motion.</>}
        {" "}Notice N = mg cos θ gets smaller as the slope gets steeper.
      </Explain>
    </WidgetFrame>
  );
}
