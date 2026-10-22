"use client";
import { useState } from "react";
import { Explain, useToolUse } from "./sim-kit";
import { Segmented, WidgetFrame } from "./widget-frame";

const C = "var(--t-matter)";
type Bar = { name: string; bp: number; note?: string; colour?: string };
const DATA: Record<string, { label: string; bars: Bar[]; text: string }> = {
  alkanes: {
    label: "Alkanes: chain length",
    bars: [{ name: "methane", bp: -162 }, { name: "ethane", bp: -89 }, { name: "propane", bp: -42 }, { name: "butane", bp: -0.5 }, { name: "pentane", bp: 36 }, { name: "hexane", bp: 69 }, { name: "heptane", bp: 98 }, { name: "octane", bp: 126 }],
    text: "Longer chain → bigger molecule with a larger surface area → stronger London (dispersion) forces → more energy needed to separate the molecules → higher boiling point. That's why methane to butane are gases at room temperature (LPG, natural gas) and petrol (≈ octane) is a liquid.",
  },
  branching: {
    label: "Branching (C₅H₁₂ isomers)",
    bars: [{ name: "pentane", bp: 36 }, { name: "2-methylbutane", bp: 28 }, { name: "2,2-dimethylpropane", bp: 10 }],
    text: "Same molecular formula, same molar mass – but more branching makes the molecule more compact (spherical), so there is less surface area in contact, weaker London forces and a lower boiling point.",
  },
  groups: {
    label: "Functional groups (M ≈ 58–60)",
    bars: [{ name: "butane", bp: -0.5, note: "London only", colour: "#94a3b8" }, { name: "propanal", bp: 49, note: "dipole-dipole", colour: "#3b82f6" }, { name: "propanone", bp: 56, note: "dipole-dipole", colour: "#3b82f6" }, { name: "propan-1-ol", bp: 97, note: "one H-bond site", colour: "#ef4444" }, { name: "ethanoic acid", bp: 118, note: "two H-bond sites", colour: "#be185d" }],
    text: "With almost the same molar mass, the type of intermolecular force decides the boiling point: London forces (alkanes) < dipole-dipole forces (aldehydes, ketones) < hydrogen bonds (alcohols) < two hydrogen bonds per molecule (carboxylic acids form dimers).",
  },
  alcohols: {
    label: "Alcohols vs alkanes",
    bars: [{ name: "methanol", bp: 65, colour: "#ef4444" }, { name: "ethanol", bp: 78, colour: "#ef4444" }, { name: "propan-1-ol", bp: 97, colour: "#ef4444" }, { name: "butan-1-ol", bp: 118, colour: "#ef4444" }, { name: "ethane", bp: -89, colour: "#94a3b8" }, { name: "propane", bp: -42, colour: "#94a3b8" }, { name: "butane", bp: -0.5, colour: "#94a3b8" }, { name: "pentane", bp: 36, colour: "#94a3b8" }],
    text: "Each alcohol boils far higher than the alkane of similar size because –OH groups form hydrogen bonds between molecules. Down each series the boiling point rises as the chain (and the London forces) grows.",
  },
  hydrides: {
    label: "Hydrides: the water anomaly",
    bars: [{ name: "H₂O", bp: 100, colour: "#ef4444" }, { name: "H₂S", bp: -60 }, { name: "H₂Se", bp: -41 }, { name: "H₂Te", bp: -2 }, { name: "HF", bp: 20, colour: "#ef4444" }, { name: "HCl", bp: -85 }, { name: "HBr", bp: -67 }, { name: "HI", bp: -35 }, { name: "NH₃", bp: -33, colour: "#ef4444" }, { name: "PH₃", bp: -88 }],
    text: "Going down a group the boiling point normally rises (bigger molecules, stronger London forces) – except for H₂O, HF and NH₃. Their very electronegative O, F and N atoms form hydrogen bonds, so they boil much higher. Without hydrogen bonds, water would boil at about −80 °C and there would be no liquid water on Earth!",
  },
};

/** Boiling-point bar charts that make intermolecular forces visible. */
export function PropertyChart({ title = "Boiling points & intermolecular forces", set: startSet = "groups" }: { title?: string; set?: string }) {
  const [set, setSet] = useState(startSet in DATA ? startSet : "groups");
  const touch = useToolUse();
  const d = DATA[set];
  const lo = -180, hi = 140;
  const W = 600, H = 300, base = 40;
  const y = (t: number) => H - 30 - ((t - lo) / (hi - lo)) * (H - 50);
  const bw = Math.min(56, (W - base - 20) / d.bars.length - 10);
  return (
    <WidgetFrame title={title} colour={C} instruction="Pick a set of compounds and compare the boiling points. Room temperature is the dashed line.">
      <Segmented colour={C} value={set} onChange={(v) => { setSet(v); touch(); }} options={Object.entries(DATA).map(([id, v]) => ({ id, label: v.label }))} />
      <svg viewBox={`0 0 ${W} ${H}`} className="diagram mt-3 rounded-xl border border-line bg-surface" role="img" aria-label={`${d.label}: ${d.bars.map((b) => `${b.name} ${b.bp} degrees`).join(", ")}`}>
        {[-150, -100, -50, 0, 50, 100].map((t) => <g key={t}><line x1={base} x2={W - 10} y1={y(t)} y2={y(t)} stroke="var(--graph-grid)" /><text x={base - 4} y={y(t) + 4} textAnchor="end" fontSize="10" className="muted">{t}</text></g>)}
        <line x1={base} x2={W - 10} y1={y(25)} y2={y(25)} stroke="#f59e0b" strokeDasharray="6 4" strokeWidth="2" />
        <text x={W - 12} y={y(25) - 4} textAnchor="end" fontSize="10" fill="#b45309">25 °C</text>
        {d.bars.map((b, i) => {
          const x = base + 14 + i * (bw + 10);
          const top = Math.min(y(b.bp), y(0)), h = Math.abs(y(b.bp) - y(0));
          return (
            <g key={b.name}>
              <rect x={x} y={top} width={bw} height={Math.max(2, h)} rx="4" fill={b.colour ?? C} opacity="0.85" />
              <text x={x + bw / 2} y={b.bp >= 0 ? top - 5 : top + h + 13} textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--text)">{String(b.bp).replace(".", ",")}</text>
              <text x={x + bw / 2} y={H - 14} textAnchor="middle" fontSize={bw < 40 ? 8 : 10} fill="var(--text)">{b.name}</text>
              {b.note && <text x={x + bw / 2} y={H - 3} textAnchor="middle" fontSize="8" className="muted">{b.note}</text>}
            </g>
          );
        })}
        <line x1={base} x2={W - 10} y1={y(0)} y2={y(0)} stroke="var(--graph-axis)" />
        <text x="8" y="20" fontSize="10" className="muted">boiling point (°C)</text>
      </svg>
      <Explain colour={C}>{d.text}</Explain>
    </WidgetFrame>
  );
}
