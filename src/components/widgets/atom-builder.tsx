"use client";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { configText, electronConfig, elementByZ } from "@/lib/sci/chem";
import { Tex } from "@/components/learn/tex";
import { Explain, Readouts, useToolUse } from "./sim-kit";
import { Toggle, WidgetFrame } from "./widget-frame";

const C = "var(--t-matter)";
const SHELLS = [2, 8, 8, 18];

function Counter({ label, value, set, min, max, colour }: { label: string; value: number; set: (n: number) => void; min: number; max: number; colour: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-line p-2">
      <span className="text-sm font-semibold" style={{ color: colour }}>{label}</span>
      <span className="flex items-center gap-1">
        <button onClick={() => set(Math.max(min, value - 1))} className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2" aria-label={`Remove one ${label}`}><Minus className="h-4 w-4" /></button>
        <span className="w-8 text-center font-mono text-lg font-bold tabular-nums">{value}</span>
        <button onClick={() => set(Math.min(max, value + 1))} className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2" aria-label={`Add one ${label}`}><Plus className="h-4 w-4" /></button>
      </span>
    </div>
  );
}

/**
 * Build an atom from protons, neutrons and electrons. The element, mass
 * number, charge, isotope notation, shell diagram, orbital box diagram
 * (Aufbau, Pauli, Hund) and sp-notation update as you go.
 */
export function AtomBuilder({ title = "Build an atom" }: { title?: string }) {
  const [p, setP] = useState(6);
  const [n, setN] = useState(6);
  const [e, setE] = useState(6);
  const [boxes, setBoxes] = useState(true);
  const touch = useToolUse();
  const el = elementByZ(Math.max(1, p));
  const A = p + n;
  const charge = p - e;
  const chargeTex = charge === 0 ? "" : `^{${Math.abs(charge) > 1 ? Math.abs(charge) : ""}${charge > 0 ? "+" : "-"}}`;
  const expectedN = Math.round(el.mass) - p;
  // Shell model (Bohr) for the electrons, max 36.
  const shells: number[] = [];
  let left = e;
  for (const cap of SHELLS) { if (left <= 0) break; shells.push(Math.min(cap, left)); left -= cap; }
  const cfg = electronConfig(e);
  const wrap = (fn: (v: number) => void) => (v: number) => { fn(v); touch(); };

  // Interleave protons and neutrons so the nucleus looks mixed.
  const kinds: ("p" | "n")[] = [];
  for (let i = 0; i < Math.max(p, n); i++) {
    if (i < p) kinds.push("p");
    if (i < n) kinds.push("n");
  }
  const nucleus = kinds.slice(0, 40).map((kind, i) => {
    const a = i * 2.4;
    const rr = 4 + 2.6 * Math.sqrt(i);
    return { x: 150 + rr * Math.cos(a), y: 150 + rr * Math.sin(a), kind };
  });

  return (
    <WidgetFrame title={title} colour={C} instruction="Add and remove particles. The number of protons decides the element; neutrons make isotopes; electrons make ions.">
      <div className="grid gap-4 md:grid-cols-[300px_minmax(0,1fr)]">
        <svg viewBox="0 0 300 300" className="diagram rounded-xl border border-line bg-surface" role="img" aria-label={`${el.name} atom: ${p} protons, ${n} neutrons, ${e} electrons`}>
          {shells.map((count, si) => {
            const R = 42 + si * 30;
            return (
              <g key={si}>
                <circle cx="150" cy="150" r={R} fill="none" stroke="var(--border)" strokeWidth="1.5" />
                {Array.from({ length: count }, (_, k) => <circle key={k} cx={150 + R * Math.cos((k / count) * 2 * Math.PI - Math.PI / 2)} cy={150 + R * Math.sin((k / count) * 2 * Math.PI - Math.PI / 2)} r="5.5" fill="#3b82f6" />)}
              </g>
            );
          })}
          {nucleus.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r="5" fill={d.kind === "p" ? "#ef4444" : "#94a3b8"} stroke="white" strokeWidth="0.8" />)}
        </svg>
        <div>
          <div className="grid gap-2 sm:grid-cols-3">
            <Counter label="Protons" value={p} set={wrap(setP)} min={1} max={36} colour="#ef4444" />
            <Counter label="Neutrons" value={n} set={wrap(setN)} min={0} max={50} colour="#64748b" />
            <Counter label="Electrons" value={e} set={wrap(setE)} min={0} max={36} colour="#3b82f6" />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface-2/60 p-4">
            <div className="grid h-20 w-20 place-items-center rounded-xl text-white" style={{ background: C }}>
              <div className="text-center"><div className="text-xs">{p}</div><div className="font-display text-3xl font-bold leading-none">{el.symbol}</div><div className="text-[10px]">{el.mass}</div></div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold">{el.name}{charge !== 0 ? " ion" : ""}</div>
              <div className="text-lg"><Tex tex={`{}^{${A}}_{${p}}\\mathrm{${el.symbol}}${chargeTex}`} /></div>
              <div className="text-sm text-muted">{n === expectedN ? "the most common isotope" : `an isotope (the common one has ${expectedN} neutrons)`}</div>
            </div>
          </div>
          <Readouts className="mt-3" colour={C} items={[
            { label: "atomic number Z", value: String(p) },
            { label: "mass number A = Z + N", value: String(A) },
            { label: "charge", value: charge === 0 ? "0 (neutral atom)" : `${charge > 0 ? "+" : ""}${charge} (${charge > 0 ? "cation" : "anion"})`, highlight: charge !== 0 },
            { label: "electron configuration", value: e ? configText(e) : "–" },
            { label: "valence electrons", value: shells.length ? String(shells[shells.length - 1]) : "0" },
            { label: "group · period", value: `${el.group} · ${el.period}` },
          ]} />
          <div className="mt-3"><Toggle on={boxes} onChange={setBoxes}>Orbital box diagram</Toggle></div>
          {boxes && e > 0 && (
            <div className="mt-2 flex flex-wrap items-end gap-3" aria-label="Orbital box diagram">
              {cfg.map(([orb, cnt]) => {
                const nBoxes = orb.endsWith("s") ? 1 : orb.endsWith("p") ? 3 : orb.endsWith("d") ? 5 : 7;
                // Hund's rule: one electron in each box first, then pair up.
                const fill = Array.from({ length: nBoxes }, (_, b) => (cnt > b ? 1 : 0) + (cnt > nBoxes + b ? 1 : 0));
                return (
                  <div key={orb} className="text-center">
                    <div className="flex">{fill.map((f, b) => <div key={b} className="grid h-9 w-8 place-items-center border border-line bg-surface text-sm font-bold">{f === 2 ? "↑↓" : f === 1 ? "↑" : ""}</div>)}</div>
                    <div className="mt-0.5 font-mono text-xs">{orb}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Explain colour={C}>
        The <strong>atomic number</strong> (protons) is the atom&apos;s identity – change it and you get a new element. Atoms of the same element with different numbers of neutrons are <strong>isotopes</strong>. Lose electrons → positive ion; gain electrons → negative ion. Electrons fill the lowest energy orbitals first (<strong>Aufbau principle</strong>), at most two per orbital with opposite spins (<strong>Pauli</strong>), and spread out one per orbital before pairing (<strong>Hund&apos;s rule</strong>).
      </Explain>
    </WidgetFrame>
  );
}
