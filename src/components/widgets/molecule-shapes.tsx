"use client";
import { useRef, useState } from "react";
import { element } from "@/lib/sci/chem";
import { Tex } from "@/components/learn/tex";
import { Explain, Readouts, SimControls, useTicker, useToolUse } from "./sim-kit";
import { Toggle, WidgetFrame } from "./widget-frame";

const C = "var(--t-matter)";
type V3 = [number, number, number];
const T = 1 / Math.sqrt(3);

const GEOM: Record<string, { bonds: V3[]; lone: V3[] }> = {
  linear: { bonds: [[1, 0, 0], [-1, 0, 0]], lone: [] },
  diatomic: { bonds: [[1, 0, 0]], lone: [] },
  "trigonal planar": { bonds: [[0, 1, 0], [0.866, -0.5, 0], [-0.866, -0.5, 0]], lone: [] },
  tetrahedral: { bonds: [[T, T, T], [-T, -T, T], [-T, T, -T], [T, -T, -T]], lone: [] },
  "trigonal pyramidal": { bonds: [[-T, -T, T], [-T, T, -T], [T, -T, -T]], lone: [[T, T, T]] },
  "angular (bent)": { bonds: [[-T, -T, T], [T, -T, -T]], lone: [[T, T, T], [-T, T, -T]] },
  "trigonal bipyramidal": { bonds: [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-0.5, 0, 0.866], [-0.5, 0, -0.866]], lone: [] },
  octahedral: { bonds: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]], lone: [] },
};

const MOLECULES = [
  { f: "H2", tex: "H_2", centre: "H", outer: ["H"], shape: "diatomic", angle: "–", polar: false, note: "Two identical atoms share electrons equally: a non-polar covalent bond." },
  { f: "HCl", tex: "HCl", centre: "Cl", outer: ["H"], shape: "diatomic", angle: "–", polar: true, note: "Cl (3,0) is more electronegative than H (2,1), so the shared pair is pulled towards Cl: a polar molecule." },
  { f: "CO2", tex: "CO_2", centre: "C", outer: ["O", "O"], shape: "linear", angle: "180°", polar: false, note: "Each C=O bond is polar, but the molecule is linear and symmetrical, so the dipoles cancel: CO₂ is non-polar." },
  { f: "BeCl2", tex: "BeCl_2", centre: "Be", outer: ["Cl", "Cl"], shape: "linear", angle: "180°", polar: false, note: "Two bonding pairs and no lone pairs on Be push as far apart as possible: 180°." },
  { f: "BF3", tex: "BF_3", centre: "B", outer: ["F", "F", "F"], shape: "trigonal planar", angle: "120°", polar: false, note: "Three bonding pairs, no lone pairs, all in one flat plane at 120°. Symmetrical, so non-polar." },
  { f: "CH4", tex: "CH_4", centre: "C", outer: ["H", "H", "H", "H"], shape: "tetrahedral", angle: "109,5°", polar: false, note: "Four bonding pairs spread out in 3D to 109,5°. Symmetrical, so non-polar." },
  { f: "NH3", tex: "NH_3", centre: "N", outer: ["H", "H", "H"], shape: "trigonal pyramidal", angle: "107°", polar: true, note: "Three bonding pairs and ONE lone pair. The lone pair repels more strongly, squeezing the angle to about 107°. Polar." },
  { f: "H2O", tex: "H_2O", centre: "O", outer: ["H", "H"], shape: "angular (bent)", angle: "104,5°", polar: true, note: "Two bonding pairs and TWO lone pairs: a bent shape at about 104,5°. Very polar – that's why water forms hydrogen bonds." },
  { f: "PCl5", tex: "PCl_5", centre: "P", outer: ["Cl", "Cl", "Cl", "Cl", "Cl"], shape: "trigonal bipyramidal", angle: "90° and 120°", polar: false, note: "Five bonding pairs: three in a triangle (120°) and two above and below (90°). P can have more than 8 valence electrons (expanded octet)." },
  { f: "SF6", tex: "SF_6", centre: "S", outer: ["F", "F", "F", "F", "F", "F"], shape: "octahedral", angle: "90°", polar: false, note: "Six bonding pairs point to the corners of an octahedron, all at 90°." },
];

const COLOURS: Record<string, string> = { H: "#f1f5f9", C: "#334155", N: "#3b82f6", O: "#ef4444", F: "#84cc16", Cl: "#22c55e", B: "#fda4af", Be: "#a3e635", P: "#f97316", S: "#facc15" };

/**
 * VSEPR made 3D: pick a molecule and turn it around. Bonding pairs and lone
 * pairs on the central atom push each other as far apart as possible, which
 * decides the shape, the bond angle and whether the molecule is polar.
 */
export function MoleculeShapes({ title = "Molecular shapes (VSEPR)" }: { title?: string }) {
  const [k, setK] = useState(7);
  const [spin, setSpin] = useState(false);
  const [lone, setLone] = useState(true);
  const [rot, setRot] = useState({ a: 0.6, b: 0.35 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const touch = useToolUse();
  useTicker((dt) => setRot((r) => ({ ...r, a: r.a + dt * 0.8 })), spin);
  const mol = MOLECULES[k];
  const g = GEOM[mol.shape];

  const project = ([x, y, z]: V3) => {
    const ca = Math.cos(rot.a), sa = Math.sin(rot.a), cb = Math.cos(rot.b), sb = Math.sin(rot.b);
    const x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
    const y1 = y * cb - z1 * sb, z2 = y * sb + z1 * cb;
    return { x: 160 + x1 * 95, y: 150 - y1 * 95, z: z2 };
  };
  const centreAt = mol.shape === "diatomic" ? project([-0.5, 0, 0]) : project([0, 0, 0]);
  const atoms = g.bonds.map((b, i) => ({ ...project(mol.shape === "diatomic" ? [0.5, 0, 0] : b), el: mol.outer[i] ?? mol.outer[0] }));
  const lones = lone ? g.lone.map((l) => project([l[0] * 0.75, l[1] * 0.75, l[2] * 0.75])) : [];
  const items = [
    ...atoms.map((a) => ({ kind: "atom" as const, ...a })),
    ...lones.map((l) => ({ kind: "lone" as const, ...l, el: "" })),
    { kind: "centre" as const, ...centreAt, el: mol.centre },
  ].sort((p, q) => p.z - q.z);
  const lonePairs = g.lone.length;
  const en = (s: string) => element(s)?.en ?? 0;

  return (
    <WidgetFrame title={title} colour={C} instruction="Pick a molecule. Drag the model to turn it, or press Play to spin it.">
      <div className="flex flex-wrap gap-1.5">
        {MOLECULES.map((m, i) => <button key={m.f} onClick={() => { setK(i); touch(); }} aria-pressed={k === i} className={`rounded-lg border px-2.5 py-1 text-sm ${k === i ? "border-matter bg-matter text-white" : "border-line"}`}><Tex tex={`\\mathrm{${m.tex}}`} /></button>)}
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-[320px_minmax(0,1fr)]">
        <svg viewBox="0 0 320 300" className="diagram touch-none rounded-xl border border-line bg-surface" role="img" aria-label={`${mol.f}: ${mol.shape}, bond angle ${mol.angle}`}
          onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY }; (e.currentTarget as Element).setPointerCapture?.(e.pointerId); touch(); }}
          onPointerMove={(e) => { if (!drag.current) return; const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y; drag.current = { x: e.clientX, y: e.clientY }; setRot((r) => ({ a: r.a + dx * 0.01, b: Math.max(-1.4, Math.min(1.4, r.b + dy * 0.01)) })); }}
          onPointerUp={() => (drag.current = null)}>
          {atoms.map((a, i) => <line key={`b${i}`} x1={centreAt.x} y1={centreAt.y} x2={a.x} y2={a.y} stroke="#94a3b8" strokeWidth="9" strokeLinecap="round" />)}
          {items.map((it, i) => it.kind === "lone" ? (
            <g key={i} opacity="0.55"><ellipse cx={(it.x + centreAt.x) / 2 + (it.x - centreAt.x) * 0.3} cy={(it.y + centreAt.y) / 2 + (it.y - centreAt.y) * 0.3} rx="22" ry="22" fill="#c4b5fd" /><circle cx={it.x - 5} cy={it.y} r="3" fill="#4c1d95" /><circle cx={it.x + 5} cy={it.y} r="3" fill="#4c1d95" /></g>
          ) : (
            <g key={i}>
              <circle cx={it.x} cy={it.y} r={it.kind === "centre" ? 30 : it.el === "H" ? 17 : 24} fill={COLOURS[it.el] ?? "#a3a3a3"} stroke="#0f172a" strokeOpacity="0.3" strokeWidth="1.5" />
              <circle cx={it.x - 7} cy={it.y - 8} r="6" fill="white" opacity="0.35" />
              <text x={it.x} y={it.y + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill={["C", "N"].includes(it.el) ? "white" : "#0f172a"}>{it.el}</text>
            </g>
          ))}
        </svg>
        <div>
          <Readouts colour={C} className="sm:grid-cols-2" items={[
            { label: "shape", value: mol.shape, highlight: true },
            { label: "bond angle", value: mol.angle },
            { label: "bonding pairs on central atom", value: String(mol.shape === "diatomic" ? 1 : g.bonds.length) },
            { label: "lone pairs on central atom", value: String(lonePairs) },
            { label: "ΔEN of each bond", value: String(Math.abs(en(mol.centre) - en(mol.outer[0])).toFixed(1)).replace(".", ",") },
            { label: "molecule is", value: mol.polar ? "polar" : "non-polar" },
          ]} />
          <div className="mt-3 flex flex-wrap gap-2">
            <SimControls running={spin} colour={C} onToggle={() => { setSpin((s) => !s); touch(); }} />
            <Toggle on={lone} onChange={setLone}>Show lone pairs</Toggle>
          </div>
          <Explain colour={C}>{mol.note} <span className="text-muted">VSEPR: electron pairs around the central atom repel each other and move as far apart as possible; lone pairs repel more than bonding pairs.</span></Explain>
        </div>
      </div>
    </WidgetFrame>
  );
}
