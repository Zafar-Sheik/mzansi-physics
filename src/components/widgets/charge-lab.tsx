"use client";
import { useMemo, useRef, useState } from "react";
import { sciTex } from "@/lib/sci/numbers";
import { Arrow, dc, Explain, Readouts, useToolUse } from "./sim-kit";
import { Segmented, Slider, WidgetFrame } from "./widget-frame";

const C = "var(--t-elec)";
const k = 9e9;
const e = 1.6e-19;
type Mode = "share" | "coulomb" | "field";
type Q = { x: number; y: number; q: number };

const CONFIGS: Record<string, { label: string; charges: Q[] }> = {
  plus: { label: "Single +", charges: [{ x: 300, y: 150, q: 1 }] },
  minus: { label: "Single −", charges: [{ x: 300, y: 150, q: -1 }] },
  dipole: { label: "+ and −", charges: [{ x: 210, y: 150, q: 1 }, { x: 390, y: 150, q: -1 }] },
  like: { label: "+ and +", charges: [{ x: 210, y: 150, q: 1 }, { x: 390, y: 150, q: 1 }] },
};

function fieldAt(x: number, y: number, qs: Q[]) {
  let ex = 0, ey = 0;
  for (const c of qs) {
    const dx = x - c.x, dy = y - c.y;
    const r2 = dx * dx + dy * dy;
    const r = Math.sqrt(r2);
    if (r < 1) continue;
    ex += (c.q * dx) / (r2 * r);
    ey += (c.q * dy) / (r2 * r);
  }
  return { ex, ey };
}

function traceLines(qs: Q[]): string[] {
  const sources = qs.some((c) => c.q > 0) ? qs.filter((c) => c.q > 0) : qs;
  const dir = qs.some((c) => c.q > 0) ? 1 : -1;
  const lines: string[] = [];
  for (const s of sources) {
    for (let k2 = 0; k2 < 14; k2++) {
      const a = (k2 / 14) * 2 * Math.PI + 0.11;
      let x = s.x + 14 * Math.cos(a), y = s.y + 14 * Math.sin(a);
      let d = `M${x.toFixed(1)},${y.toFixed(1)}`;
      for (let n = 0; n < 400; n++) {
        const { ex, ey } = fieldAt(x, y, qs);
        const m = Math.hypot(ex, ey);
        if (m === 0) break;
        x += (dir * 4 * ex) / m;
        y += (dir * 4 * ey) / m;
        d += `L${x.toFixed(1)},${y.toFixed(1)}`;
        if (x < 0 || x > 600 || y < 0 || y > 300 || qs.some((c) => c !== s && Math.hypot(x - c.x, y - c.y) < 10)) break;
      }
      lines.push(d);
    }
  }
  return lines;
}

/**
 * Electrostatics lab: share charge between touching spheres (Grade 10), measure
 * the Coulomb force between point charges, and explore electric field patterns
 * with a test charge you can drag (Grade 11).
 */
export function ChargeLab({ title = "Electrostatics lab", mode: startMode = "coulomb" }: { title?: string; mode?: Mode }) {
  const [mode, setMode] = useState<Mode>(startMode);
  const [q1, setQ1] = useState(6);
  const [q2, setQ2] = useState(-2);
  const [touched, setTouched] = useState(false);
  const [r, setR] = useState(0.3);
  const [cfg, setCfg] = useState("dipole");
  const [probe, setProbe] = useState({ x: 300, y: 70 });
  const svg = useRef<SVGSVGElement>(null);
  const touch = useToolUse();

  const shared = (q1 + q2) / 2;
  const n = Math.abs(shared - q1) * 1e-9 / e;
  const F = (k * q1 * 1e-6 * q2 * 1e-6) / (r * r);
  const qs = CONFIGS[cfg].charges;
  const lines = useMemo(() => traceLines(qs), [qs]);
  // Probe field with 1 unit = 1 nC at 1 px = 1 mm.
  const Ep = fieldAt(probe.x, probe.y, qs);
  const Emag = Math.hypot(Ep.ex, Ep.ey) * k * 1e-9 / 1e-6; // nC charges, mm distances → N·C⁻¹
  const Eang = (Math.atan2(-Ep.ey, Ep.ex) * 180) / Math.PI;
  const sign = (q: number) => (q > 0 ? `+${q}` : `${q}`);

  return (
    <WidgetFrame title={title} colour={C} instruction={mode === "share" ? "Set the charges on two identical metal spheres, then let them touch." : mode === "coulomb" ? "Change the charges (in μC) and their separation." : "Pick an arrangement and drag the yellow test charge around."}>
      <Segmented colour={C} value={mode} onChange={(m) => { setMode(m); touch(); }} options={[{ id: "share", label: "Touch & share (Gr 10)" }, { id: "coulomb", label: "Coulomb's law (Gr 11)" }, { id: "field", label: "Electric fields (Gr 11)" }]} />
      {mode === "share" && (
        <>
          <svg viewBox="0 0 600 180" className="diagram mt-3 rounded-xl border border-line bg-surface" role="img" aria-label={touched ? `After touching both spheres carry ${shared} nanocoulombs` : `Sphere A ${q1} nanocoulombs, sphere B ${q2} nanocoulombs`}>
            {[0, 1].map((i) => {
              const q = touched ? shared : i === 0 ? q1 : q2;
              const cx = touched ? 300 + (i ? 46 : -46) : i ? 420 : 180;
              return (
                <g key={i}>
                  <line x1={cx} x2={cx} y1="150" y2="130" stroke="var(--text-muted)" strokeWidth="4" />
                  <circle cx={cx} cy="85" r="45" fill={q > 0 ? "#fecaca" : q < 0 ? "#bfdbfe" : "var(--surface-2)"} stroke="var(--text)" strokeWidth="2" />
                  {Array.from({ length: Math.min(12, Math.abs(Math.round(q))) }, (_, j) => (
                    <text key={j} x={cx + 30 * Math.cos((j / 12) * 2 * Math.PI)} y={89 + 30 * Math.sin((j / 12) * 2 * Math.PI)} textAnchor="middle" fontSize="14" fontWeight="800" fill={q > 0 ? "#b91c1c" : "#1d4ed8"}>{q > 0 ? "+" : "−"}</text>
                  ))}
                  <text x={cx} y="91" textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--text)">{sign(q)} nC</text>
                  <text x={cx} y="172" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--text-muted)">{i ? "B" : "A"}</text>
                </g>
              );
            })}
          </svg>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <Slider label="Charge on A (nC)" value={q1} min={-12} max={12} step={2} onChange={(v) => { setQ1(v); setTouched(false); touch(); }} colour={C} />
            <Slider label="Charge on B (nC)" value={q2} min={-12} max={12} step={2} onChange={(v) => { setQ2(v); setTouched(false); touch(); }} colour={C} />
            <button onClick={() => { setTouched((x) => !x); touch(); }} className="h-10 rounded-xl px-4 text-sm font-semibold text-white" style={{ background: C }}>{touched ? "Separate & reset" : "Let them touch"}</button>
          </div>
          <Readouts className="mt-3" colour={C} items={[
            { label: "total charge (conserved)", value: sign(q1 + q2), unit: "nC" },
            { label: "each sphere after", value: sign(shared), unit: "nC", highlight: true },
            { label: "electrons transferred", value: n === 0 ? "0" : sciTex(n, 3), tex: n !== 0 },
            { label: "electrons moved", value: shared === q1 ? "none" : shared > q1 ? "from A to B" : "from B to A" },
          ]} />
          <Explain colour={C}>
            Only <strong>electrons</strong> move. Charge is <strong>conserved</strong> (the total stays {sign(q1 + q2)} nC) and identical spheres share it equally: Q = (Q₁ + Q₂)/2. Charge is also <strong>quantised</strong> – it comes in whole numbers of electrons: n = ΔQ / qₑ = {Math.abs(shared - q1)} × 10⁻⁹ / 1,6 × 10⁻¹⁹.
          </Explain>
        </>
      )}
      {mode === "coulomb" && (
        <>
          <svg viewBox="0 0 600 170" className="diagram mt-3 rounded-xl border border-line bg-surface" role="img" aria-label={`Force ${sciTex(Math.abs(F), 3)} newtons, ${F < 0 ? "attraction" : "repulsion"}`}>
            {(() => {
              const a = 300 - r * 400, b = 300 + r * 400;
              const len = Math.min(120, 10 + Math.log10(Math.abs(F) + 1) * 28);
              const att = F < 0;
              return (
                <g>
                  <line x1={a} x2={b} y1="135" y2="135" stroke="var(--text-muted)" strokeDasharray="4 4" />
                  <text x="300" y="155" textAnchor="middle" fontSize="12" className="muted">r = {dc(r, 2)} m</text>
                  {[[a, q1], [b, q2]].map(([x, q], i) => (
                    <g key={i}>
                      <circle cx={x} cy="80" r="20" fill={q > 0 ? "#ef4444" : "#3b82f6"} />
                      <text x={x} y="85" textAnchor="middle" fontSize="12" fontWeight="800" fill="white">{sign(q)}</text>
                    </g>
                  ))}
                  {F !== 0 && <Arrow x={a + (att ? 20 : -20)} y={80} length={att ? len : -len} angle={0} colour={C} label="F" />}
                  {F !== 0 && <Arrow x={b + (att ? -20 : 20)} y={80} length={att ? -len : len} angle={0} colour={C} label="F" />}
                </g>
              );
            })()}
          </svg>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Slider label="Q₁ (μC)" value={q1} min={-10} max={10} step={1} onChange={(v) => { setQ1(v); touch(); }} colour="#ef4444" />
            <Slider label="Q₂ (μC)" value={q2} min={-10} max={10} step={1} onChange={(v) => { setQ2(v); touch(); }} colour="#3b82f6" />
            <Slider label="separation r (m)" value={r} min={0.05} max={0.6} step={0.05} onChange={(v) => { setR(v); touch(); }} colour={C} format={(v) => dc(v, 2)} />
          </div>
          <Readouts className="mt-3" colour={C} items={[
            { label: "F = kQ₁Q₂/r²", value: sciTex(Math.abs(F), 3), tex: true, unit: "N", highlight: true },
            { label: "type", value: F === 0 ? "no force" : F < 0 ? "attraction" : "repulsion" },
            { label: "if r doubles", value: sciTex(Math.abs(F) / 4, 3), tex: true, unit: "N" },
          ]} />
          <Explain colour={C}>
            <strong>Coulomb&apos;s law:</strong> the force between two point charges is directly proportional to the product of the charges and inversely proportional to the square of the distance between them. Like charges repel, unlike charges attract – and the two forces are always equal and opposite. Use magnitudes in the formula; decide the direction from the signs.
          </Explain>
        </>
      )}
      {mode === "field" && (
        <>
          <div className="mt-3"><Segmented colour={C} value={cfg} onChange={(c) => { setCfg(c); touch(); }} options={Object.entries(CONFIGS).map(([id, c]) => ({ id, label: c.label }))} /></div>
          <svg ref={svg} viewBox="0 0 600 300" className="diagram mt-3 touch-none rounded-xl border border-line bg-surface" role="img" aria-label={`Electric field lines for ${CONFIGS[cfg].label}. Field at the test point: ${sciTex(Emag, 2)} newtons per coulomb`}
            onPointerMove={(ev) => {
              if (ev.buttons !== 1 || !svg.current) return;
              const b = svg.current.getBoundingClientRect();
              setProbe({ x: ((ev.clientX - b.left) / b.width) * 600, y: ((ev.clientY - b.top) / b.height) * 300 });
              touch();
            }}>
            {lines.map((d, i) => <path key={i} d={d} fill="none" stroke={C} strokeWidth="1.6" opacity="0.75" />)}
            {lines.map((d, i) => {
              const pts = d.slice(1).split("L").map((pp) => pp.split(",").map(Number));
              const mid = pts[Math.min(pts.length - 1, 18)];
              const nxt = pts[Math.min(pts.length - 1, 19)];
              if (!mid || !nxt) return null;
              const ang = (Math.atan2(-(nxt[1] - mid[1]), nxt[0] - mid[0]) * 180) / Math.PI;
              const flip = qs.some((c) => c.q > 0) ? 0 : 180;
              return <Arrow key={`a${i}`} x={mid[0]} y={mid[1]} length={9} angle={ang + flip} colour={C} width={1.5} />;
            })}
            {qs.map((c, i) => (
              <g key={i}><circle cx={c.x} cy={c.y} r="14" fill={c.q > 0 ? "#ef4444" : "#3b82f6"} /><text x={c.x} y={c.y + 5} textAnchor="middle" fontSize="16" fontWeight="800" fill="white">{c.q > 0 ? "+" : "−"}</text></g>
            ))}
            <Arrow x={probe.x} y={probe.y} length={Math.min(70, 12 + Math.log10(Emag + 1) * 9)} angle={Eang} colour="var(--t-mech)" label="E" width={3} />
            <circle cx={probe.x} cy={probe.y} r="8" fill="#facc15" stroke="#a16207" strokeWidth="2" className="cursor-grab" />
          </svg>
          <Readouts className="mt-3" colour={C} items={[
            { label: "field at the test point", value: sciTex(Emag, 2), tex: true, unit: "N·C⁻¹", highlight: true },
            { label: "direction", value: `${dc((Eang + 360) % 360, 0)}°` },
            { label: "charges", value: "1 nC each, 1 px = 1 mm" },
          ]} />
          <Explain colour={C}>
            An <strong>electric field</strong> is a region where a charge experiences a force. Field lines point the way a <strong>positive</strong> test charge would be pushed: <strong>away from +</strong> and <strong>towards −</strong>. They never cross, and they are closest together where the field is strongest. E = F/q = kQ/r².
          </Explain>
        </>
      )}
    </WidgetFrame>
  );
}
