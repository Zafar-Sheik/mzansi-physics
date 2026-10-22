"use client";
import { useRef, useState } from "react";
import { Arrow, dc, Explain, Readouts, useToolUse } from "./sim-kit";
import { Segmented, Toggle, WidgetFrame } from "./widget-frame";

const C = "var(--t-mech)";
const COLS = ["var(--curve-1)", "var(--curve-2)", "var(--t-change)"];
const UNIT = 30; // px per newton on the grid
const O = { x: 210, y: 210 };

type V = { x: number; y: number };
const mag = (v: V) => Math.hypot(v.x, v.y);
const angleOf = (v: V) => ((Math.atan2(v.y, v.x) * 180) / Math.PI + 360) % 360;
const bearing = (v: V) => (90 - angleOf(v) + 360) % 360;

/**
 * Drag the tips of up to three force vectors on a grid. See the tail-to-head
 * construction, the resultant, its magnitude and direction, and the x and y
 * components – the whole of Grade 11 vectors in one picture.
 */
export function VectorLab({ title = "Vector lab: add forces tail-to-head" }: { title?: string }) {
  const [vecs, setVecs] = useState<V[]>([{ x: 4, y: 0 }, { x: 0, y: 3 }]);
  const [mode, setMode] = useState<"add" | "components">("add");
  const [headToTail, setHeadToTail] = useState(true);
  const [drag, setDrag] = useState<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const touch = useToolUse();

  const R = vecs.reduce((a, v) => ({ x: a.x + v.x, y: a.y + v.y }), { x: 0, y: 0 });
  const toPx = (v: V) => ({ x: O.x + v.x * UNIT, y: O.y - v.y * UNIT });
  const pointer = (e: React.PointerEvent) => {
    const r = svg.current!.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 420;
    const py = ((e.clientY - r.top) / r.height) * 420;
    return { x: Math.round((px - O.x) / UNIT), y: Math.round((O.y - py) / UNIT) };
  };
  const tails = vecs.map((_, i) => (mode === "add" && headToTail ? vecs.slice(0, i).reduce((a, v) => ({ x: a.x + v.x, y: a.y + v.y }), { x: 0, y: 0 }) : { x: 0, y: 0 }));

  const onMove = (e: React.PointerEvent) => {
    if (drag === null) return;
    const p = pointer(e);
    const tail = tails[drag];
    const nv = { x: Math.max(-6, Math.min(6, p.x - tail.x)), y: Math.max(-6, Math.min(6, p.y - tail.y)) };
    setVecs((vs) => vs.map((v, i) => (i === drag ? nv : v)));
  };

  const shown = mode === "components" ? [vecs[0]] : vecs;
  const comp = vecs[0];
  return (
    <WidgetFrame title={title} colour={C} instruction="Drag the round handles at the arrow tips. Each grid square is 1 N.">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented colour={C} value={mode} onChange={(m) => { setMode(m); touch(); }} options={[{ id: "add", label: "Add vectors" }, { id: "components", label: "Resolve into components" }]} />
        {mode === "add" && <Toggle on={headToTail} onChange={setHeadToTail}>Tail-to-head</Toggle>}
        {mode === "add" && vecs.length < 3 && <button className="rounded-full border border-line px-3 py-1 text-xs font-semibold" onClick={() => setVecs((v) => [...v, { x: -2, y: 2 }])}>+ add a third force</button>}
        {mode === "add" && vecs.length > 2 && <button className="rounded-full border border-line px-3 py-1 text-xs font-semibold" onClick={() => setVecs((v) => v.slice(0, 2))}>− remove</button>}
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,420px)_1fr]">
        <svg ref={svg} viewBox="0 0 420 420" className="diagram touch-none select-none rounded-xl border border-line bg-surface" role="img"
          aria-label={`Resultant ${dc(mag(R), 2)} newtons at ${dc(angleOf(R), 1)} degrees`}
          onPointerMove={onMove} onPointerUp={() => setDrag(null)} onPointerLeave={() => setDrag(null)}>
          {Array.from({ length: 15 }, (_, i) => i - 7).map((k) => (
            <g key={k}><line x1={O.x + k * UNIT} x2={O.x + k * UNIT} y1="0" y2="420" stroke="var(--graph-grid)" /><line y1={O.y + k * UNIT} y2={O.y + k * UNIT} x1="0" x2="420" stroke="var(--graph-grid)" /></g>
          ))}
          <line x1="0" x2="420" y1={O.y} y2={O.y} stroke="var(--graph-axis)" />
          <line y1="0" y2="420" x1={O.x} x2={O.x} stroke="var(--graph-axis)" />
          <text x="410" y={O.y - 6} textAnchor="end" fontSize="11" className="muted">E (+x)</text>
          <text x={O.x + 6} y="14" fontSize="11" className="muted">N (+y)</text>
          {mode === "components" && (
            <>
              <Arrow x={O.x} y={O.y} length={comp.x * UNIT} angle={0} colour="var(--t-waves)" label="Fx" dashed />
              <Arrow x={O.x + comp.x * UNIT} y={O.y} length={comp.y * UNIT} angle={90} colour="var(--t-change)" label="Fy" dashed />
            </>
          )}
          {mode === "add" && vecs.length > 1 && <Arrow x={O.x} y={O.y} length={mag(R) * UNIT} angle={angleOf(R)} colour={C} width={5} label="R" labelOffset={16} />}
          {shown.map((v, i) => {
            const t = toPx(tails[i]);
            const tip = toPx({ x: tails[i].x + v.x, y: tails[i].y + v.y });
            return (
              <g key={i}>
                <Arrow x={t.x} y={t.y} length={mag(v) * UNIT} angle={angleOf(v)} colour={COLS[i]} label={`F${i + 1}`} />
                <circle cx={tip.x} cy={tip.y} r="11" fill={COLS[i]} fillOpacity="0.25" stroke={COLS[i]} strokeWidth="2" className="cursor-grab"
                  onPointerDown={(e) => { (e.target as Element).setPointerCapture?.(e.pointerId); setDrag(i); touch(); }} role="slider" aria-label={`Tip of force ${i + 1}`} aria-valuetext={`${dc(mag(v), 1)} newtons`} tabIndex={0}
                  onKeyDown={(e) => {
                    const d = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
                    if (d) { e.preventDefault(); setVecs((vs) => vs.map((w, j) => (j === i ? { x: Math.max(-6, Math.min(6, w.x + d[0])), y: Math.max(-6, Math.min(6, w.y + d[1])) } : w))); touch(); }
                  }} />
              </g>
            );
          })}
        </svg>
        <div>
          {mode === "add" ? (
            <>
              <Readouts colour={C} className="sm:grid-cols-2" items={[
                ...vecs.map((v, i) => ({ label: `F${i + 1}`, value: `${dc(mag(v), 2)} N @ ${dc(angleOf(v), 0)}°` })),
                { label: "Rx = ΣFx", value: dc(R.x, 0), unit: "N" },
                { label: "Ry = ΣFy", value: dc(R.y, 0), unit: "N" },
                { label: "resultant |R|", value: dc(mag(R), 2), unit: "N", highlight: true },
                { label: "direction", value: mag(R) ? `${dc(angleOf(R), 1)}° (bearing ${dc(bearing(R), 0)}°)` : "–" },
              ]} />
              <Explain colour={C}>
                {mag(R) < 0.01 ? <>The forces <strong>cancel</strong>: the resultant is zero, so the object is in <strong>equilibrium</strong> – the tail-to-head arrows form a closed shape.</> : <>
                  Add the <strong>x-components</strong> and the <strong>y-components</strong> separately, then use Pythagoras: |R| = √(Rx² + Ry²) = √({dc(R.x, 0)}² + {dc(R.y, 0)}²) = <strong>{dc(mag(R), 2)} N</strong>, and tan θ = Ry/Rx for the direction.</>}
                {" "}The order you add them in doesn&apos;t matter – try it.
              </Explain>
            </>
          ) : (
            <>
              <Readouts colour={C} className="sm:grid-cols-2" items={[
                { label: "F", value: dc(mag(comp), 2), unit: "N", highlight: true },
                { label: "angle θ with +x", value: dc(angleOf(comp), 1), unit: "°" },
                { label: "Fx = F cos θ", value: dc(comp.x, 2), unit: "N" },
                { label: "Fy = F sin θ", value: dc(comp.y, 2), unit: "N" },
              ]} />
              <Explain colour={C}>
                Any vector can be replaced by two perpendicular <strong>components</strong> that have the same effect together: Fx = F cos θ = {dc(comp.x, 2)} N and Fy = F sin θ = {dc(comp.y, 2)} N. Drag the tip and watch the dashed components change.
              </Explain>
            </>
          )}
        </div>
      </div>
    </WidgetFrame>
  );
}
