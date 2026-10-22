"use client";
import { useMemo, useState } from "react";
import { Explain, useToolUse } from "./sim-kit";
import { Segmented, Toggle, WidgetFrame } from "./widget-frame";

const C = "var(--t-elec)";
type Mode = "bar" | "pair" | "wire" | "solenoid";
type Src = { kind: "pole"; x: number; y: number; s: number } | { kind: "wire"; x: number; y: number; i: number };

/** Field in math coordinates (y up) from magnetic "poles" (1/r²) and long straight wires (1/r, anticlockwise for current out of the page). */
function field(x: number, y: number, srcs: Src[]) {
  let bx = 0, by = 0;
  for (const s of srcs) {
    const dx = x - s.x, dy = -(y - s.y);
    const r2 = dx * dx + dy * dy;
    if (r2 < 4) continue;
    if (s.kind === "pole") {
      const r = Math.sqrt(r2);
      bx += (s.s * dx) / (r2 * r);
      by += (s.s * dy) / (r2 * r);
    } else {
      bx += (s.i * -dy) / r2 * 30;
      by += (s.i * dx) / r2 * 30;
    }
  }
  return { bx, by };
}

function trace(seed: [number, number], srcs: Src[], both: boolean): string {
  const run = (sign: number) => {
    const pts: [number, number][] = [];
    let [x, y] = seed;
    for (let n = 0; n < 500; n++) {
      pts.push([x, y]);
      const { bx, by } = field(x, y, srcs);
      const m = Math.hypot(bx, by);
      if (!m) break;
      x += (sign * 3 * bx) / m;
      y -= (sign * 3 * by) / m;
      if (x < -5 || x > 605 || y < -5 || y > 305) break;
      if (srcs.some((s) => s.kind === "pole" && Math.hypot(x - s.x, y - s.y) < 6)) break;
      if (n > 30 && Math.hypot(x - seed[0], y - seed[1]) < 3) { pts.push(seed); break; }
    }
    return pts;
  };
  const fwd = run(1);
  const pts = both ? [...run(-1).reverse(), ...fwd.slice(1)] : fwd;
  return pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");
}

/**
 * Magnetic fields made visible: a bar magnet, two magnets (attract or
 * repel), a straight current-carrying wire and a solenoid – with field lines
 * and a grid of compass needles that line up with the field.
 */
export function MagnetLab({ title = "Magnetic field lab", mode: startMode = "bar" }: { title?: string; mode?: Mode }) {
  const [mode, setMode] = useState<Mode>(startMode);
  const [flip, setFlip] = useState(false);
  const [compasses, setCompasses] = useState(true);
  const touch = useToolUse();

  const { srcs, seeds, both } = useMemo(() => {
    const f = flip ? -1 : 1;
    if (mode === "bar") {
      const srcs: Src[] = [{ kind: "pole", x: 230, y: 150, s: f }, { kind: "pole", x: 370, y: 150, s: -f }];
      const from = srcs.find((s) => s.kind === "pole" && s.s > 0)!;
      return { srcs, both: false, seeds: Array.from({ length: 16 }, (_, k) => [from.x + 8 * Math.cos((k / 16) * 2 * Math.PI + 0.2), from.y + 8 * Math.sin((k / 16) * 2 * Math.PI + 0.2)] as [number, number]) };
    }
    if (mode === "pair") {
      // Left magnet N on the right; right magnet N (repel) or S (attract) facing it.
      const srcs: Src[] = [{ kind: "pole", x: 90, y: 150, s: -1 }, { kind: "pole", x: 230, y: 150, s: 1 }, { kind: "pole", x: 370, y: 150, s: flip ? -1 : 1 }, { kind: "pole", x: 510, y: 150, s: flip ? 1 : -1 }];
      const ns = srcs.filter((s) => s.kind === "pole" && s.s > 0) as { x: number; y: number }[];
      return { srcs, both: false, seeds: ns.flatMap((n) => Array.from({ length: 12 }, (_, k) => [n.x + 8 * Math.cos((k / 12) * 2 * Math.PI + 0.25), n.y + 8 * Math.sin((k / 12) * 2 * Math.PI + 0.25)] as [number, number])) };
    }
    if (mode === "wire") {
      const srcs: Src[] = [{ kind: "wire", x: 300, y: 150, i: f }];
      return { srcs, both: false, seeds: [30, 55, 85, 120].map((d) => [300 + d, 150] as [number, number]) };
    }
    const srcs: Src[] = [];
    for (let x = 190; x <= 410; x += 22) {
      srcs.push({ kind: "wire", x, y: 115, i: f }, { kind: "wire", x, y: 185, i: -f });
    }
    return { srcs, both: true, seeds: [135, 150, 165, 125, 175].map((y) => [300, y] as [number, number]) };
  }, [mode, flip]);

  const lines = useMemo(() => seeds.map((sd) => trace(sd, srcs, both)), [seeds, srcs, both]);
  const needles = useMemo(() => {
    const out: { x: number; y: number; a: number }[] = [];
    for (let gx = 40; gx < 600; gx += 56) for (let gy = 30; gy < 300; gy += 54) {
      if (srcs.some((s) => Math.hypot(gx - s.x, gy - s.y) < 22)) continue;
      if ((mode === "bar" || mode === "pair") && gy > 125 && gy < 175 && ((gx > 200 && gx < 400) || (mode === "pair" && ((gx > 60 && gx < 260) || (gx > 340 && gx < 540))))) continue;
      const { bx, by } = field(gx, gy, srcs);
      out.push({ x: gx, y: gy, a: (Math.atan2(by, bx) * 180) / Math.PI });
    }
    return out;
  }, [srcs, mode]);

  const magnet = (x1: number, x2: number, leftN: boolean) => (
    <g>
      <rect x={x1} y="132" width={(x2 - x1) / 2} height="36" fill={leftN ? "#ef4444" : "#3b82f6"} />
      <rect x={(x1 + x2) / 2} y="132" width={(x2 - x1) / 2} height="36" fill={leftN ? "#3b82f6" : "#ef4444"} />
      <text x={x1 + 14} y="156" fontSize="16" fontWeight="800" fill="white">{leftN ? "N" : "S"}</text>
      <text x={x2 - 14} y="156" fontSize="16" fontWeight="800" fill="white" textAnchor="end">{leftN ? "S" : "N"}</text>
    </g>
  );

  return (
    <WidgetFrame title={title} colour={C} instruction="Field lines show the direction a compass N-pole points. Flip the magnet or the current and watch everything turn around.">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented colour={C} value={mode} onChange={(m) => { setMode(m); touch(); }} options={[{ id: "bar", label: "Bar magnet" }, { id: "pair", label: "Two magnets" }, { id: "wire", label: "Straight wire" }, { id: "solenoid", label: "Solenoid" }]} />
        <button onClick={() => { setFlip((f) => !f); touch(); }} className="rounded-full border border-line px-3 py-1 text-xs font-semibold">{mode === "pair" ? (flip ? "Make them repel" : "Make them attract") : mode === "bar" ? "Flip the magnet" : "Reverse the current"}</button>
        <Toggle on={compasses} onChange={setCompasses}>Compasses</Toggle>
      </div>
      <svg viewBox="0 0 600 300" className="diagram mt-3 rounded-xl border border-line bg-surface" role="img" aria-label={`Magnetic field lines for a ${mode}`}>
        {lines.map((d, i) => <path key={i} d={d} fill="none" stroke={C} strokeWidth="1.6" opacity="0.8" />)}
        {compasses && needles.map((n, i) => (
          <g key={i} transform={`translate(${n.x}, ${n.y}) rotate(${-n.a})`}>
            <circle r="11" fill="var(--surface)" stroke="var(--border)" />
            <path d="M0,-3 L9,0 L0,3 Z" fill="#ef4444" /><path d="M0,-3 L-9,0 L0,3 Z" fill="#cbd5e1" />
          </g>
        ))}
        {mode === "bar" && magnet(220, 380, !flip)}
        {mode === "pair" && <>{magnet(80, 240, false)}{magnet(360, 520, !flip)}</>}
        {mode === "wire" && (
          <g>
            <circle cx="300" cy="150" r="12" fill="var(--surface)" stroke="var(--text)" strokeWidth="2.5" />
            {flip ? <path d="M293,143 L307,157 M307,143 L293,157" stroke="var(--text)" strokeWidth="2.5" /> : <circle cx="300" cy="150" r="3.5" fill="var(--text)" />}
            <text x="300" y="290" textAnchor="middle" fontSize="12" className="muted">current {flip ? "into the page (×)" : "out of the page (•)"} → field {flip ? "clockwise" : "anticlockwise"}</text>
          </g>
        )}
        {mode === "solenoid" && srcs.map((s, i) => s.kind === "wire" && (
          <g key={i}>
            <circle cx={s.x} cy={s.y} r="7" fill="var(--surface)" stroke="#b45309" strokeWidth="2" />
            {s.i > 0 ? <circle cx={s.x} cy={s.y} r="2.2" fill="#b45309" /> : <path d={`M${s.x - 4},${s.y - 4} L${s.x + 4},${s.y + 4} M${s.x + 4},${s.y - 4} L${s.x - 4},${s.y + 4}`} stroke="#b45309" strokeWidth="2" />}
          </g>
        ))}
        {mode === "solenoid" && <text x="300" y="290" textAnchor="middle" fontSize="12" className="muted">{flip ? "N-pole on the left" : "N-pole on the right"} · field inside is strong and uniform</text>}
      </svg>
      <Explain colour={C}>
        {mode === "bar" && <>Field lines leave the <strong>north</strong> pole and enter the <strong>south</strong> pole. They are closest together near the poles, where the field is strongest, and they never cross. The Earth behaves like a giant bar magnet – its <em>magnetic south pole</em> is near the geographic North Pole, which is why a compass needle&apos;s N points north.</>}
        {mode === "pair" && (flip ? <>Unlike poles (N facing S) <strong>attract</strong>: the field lines run straight across the gap from N to S.</> : <>Like poles (N facing N) <strong>repel</strong>: the lines push away from each other and there is a <strong>neutral point</strong> in the middle where the fields cancel.</>)}
        {mode === "wire" && <>A current makes a <strong>circular</strong> magnetic field around the wire. <strong>Right-hand rule:</strong> point your right thumb along the conventional current – your fingers curl in the direction of the field. Further from the wire, the field is weaker.</>}
        {mode === "solenoid" && <>A coil (solenoid) adds the fields of every turn: inside it the field is strong and uniform, and outside it looks just like a bar magnet. Curl the fingers of your right hand with the current – your thumb points to the N-pole. Add an iron core and you have an electromagnet.</>}
      </Explain>
    </WidgetFrame>
  );
}
