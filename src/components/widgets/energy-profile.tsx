"use client";
import { useState } from "react";
import { dc, Explain, Readouts, useToolUse } from "./sim-kit";
import { Segmented, Slider, Toggle, WidgetFrame } from "./widget-frame";

const C = "var(--t-change)";

/**
 * Potential energy diagram for a reaction: reactants, activated complex and
 * products. Set the energies (or pick exothermic / endothermic) and add a
 * catalyst to lower the activation energy – ΔH doesn't change.
 */
export function EnergyProfile({ title = "Energy profile of a reaction", catalyst: startCat = false }: { title?: string; catalyst?: boolean }) {
  const [Er, setEr] = useState(150);
  const [Ep, setEp] = useState(60);
  const [Ea, setEa] = useState(120);
  const [cat, setCat] = useState(startCat);
  const touch = useToolUse();
  // The activated complex must sit above both the reactants and the products.
  const EaEff = Math.max(Ea, Ep - Er + 10);
  const top = Er + EaEff;
  const catTop = Math.max(Er + EaEff * 0.55, Ep + 5);
  const dH = Ep - Er;
  const W = 560, H = 300;
  const maxE = Math.max(320, top + 30);
  const Y = (e: number) => H - 30 - (e / maxE) * (H - 60);
  const curve = (topE: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = i / 100;
      // Flat reactants, smooth hump, flat products.
      const s = x < 0.2 ? 0 : x > 0.8 ? 1 : (1 - Math.cos(((x - 0.2) / 0.6) * Math.PI)) / 2;
      const base = Er + (Ep - Er) * s;
      const hump = x < 0.2 || x > 0.8 ? 0 : Math.sin(((x - 0.2) / 0.6) * Math.PI) ** 2;
      const e = base + (topE - (Er + (Ep - Er) * 0.5)) * hump;
      pts.push(`${i ? "L" : "M"}${(40 + x * (W - 60)).toFixed(1)},${Y(e).toFixed(1)}`);
    }
    return pts.join("");
  };
  const ch = (fn: (n: number) => void) => (n: number) => { fn(n); touch(); };

  return (
    <WidgetFrame title={title} colour={C} instruction="Drag the sliders or pick a type of reaction. Switch on the catalyst and compare the two paths.">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented colour={C} value={dH < 0 ? "exo" : "endo"} onChange={(v) => { if (v === "exo") { setEr(150); setEp(60); } else { setEr(60); setEp(150); } touch(); }} options={[{ id: "exo", label: "Exothermic" }, { id: "endo", label: "Endothermic" }]} />
        <Toggle on={cat} onChange={(c) => { setCat(c); touch(); }}>Add a catalyst</Toggle>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="diagram mt-3 rounded-xl border border-line bg-surface" role="img" aria-label={`Energy profile: ΔH = ${dH} kilojoules per mole, activation energy ${EaEff} kilojoules per mole${cat ? ", catalysed path lower" : ""}`}>
        <line x1="40" x2="40" y1="10" y2={H - 25} stroke="var(--graph-axis)" strokeWidth="1.5" />
        <line x1="40" x2={W - 10} y1={H - 25} y2={H - 25} stroke="var(--graph-axis)" strokeWidth="1.5" />
        <text x="14" y="150" fontSize="11" className="muted" transform="rotate(-90 14 150)" textAnchor="middle">potential energy (kJ·mol⁻¹)</text>
        <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="11" className="muted">course of reaction</text>
        <path d={curve(top)} fill="none" stroke={C} strokeWidth="4" />
        {cat && <path d={curve(catTop)} fill="none" stroke="var(--t-matter)" strokeWidth="3" strokeDasharray="7 5" />}
        <line x1="40" x2={W / 2} y1={Y(Er)} y2={Y(Er)} stroke="var(--text-muted)" strokeDasharray="3 4" />
        <line x1={W / 2} x2={W - 20} y1={Y(Ep)} y2={Y(Ep)} stroke="var(--text-muted)" strokeDasharray="3 4" />
        <line x1="40" x2={W / 2 + 40} y1={Y(top)} y2={Y(top)} stroke="var(--text-muted)" strokeDasharray="3 4" />
        <text x="60" y={Y(Er) - 6} fontSize="12" fontWeight="700" fill="var(--text)">reactants</text>
        <text x={W - 30} y={Y(Ep) - 6} fontSize="12" fontWeight="700" textAnchor="end" fill="var(--text)">products</text>
        <text x={W / 2 + 4} y={Y(top) - 8} fontSize="12" fontWeight="700" textAnchor="middle" fill={C}>activated complex</text>
        {/* Ea arrow */}
        <line x1="120" x2="120" y1={Y(Er)} y2={Y(top)} stroke={C} strokeWidth="2.5" />
        <text x="126" y={(Y(Er) + Y(top)) / 2} fontSize="12" fontWeight="800" fill={C}>Eₐ = {EaEff}</text>
        {cat && <><line x1="170" x2="170" y1={Y(Er)} y2={Y(catTop)} stroke="var(--t-matter)" strokeWidth="2.5" /><text x="176" y={(Y(Er) + Y(catTop)) / 2 + 14} fontSize="11" fontWeight="800" fill="var(--t-matter)">Eₐ (catalyst) = {Math.round(catTop - Er)}</text></>}
        {/* ΔH arrow */}
        <line x1={W - 70} x2={W - 70} y1={Y(Er)} y2={Y(Ep)} stroke="var(--t-systems)" strokeWidth="2.5" />
        <line x1={W / 2} x2={W - 60} y1={Y(Er)} y2={Y(Er)} stroke="var(--text-muted)" strokeDasharray="3 4" />
        <text x={W - 76} y={(Y(Er) + Y(Ep)) / 2} fontSize="12" fontWeight="800" textAnchor="end" fill="var(--t-systems)">ΔH = {dH > 0 ? "+" : ""}{dH}</text>
      </svg>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Slider label="Energy of reactants" value={Er} min={0} max={250} step={10} onChange={ch(setEr)} colour={C} />
        <Slider label="Energy of products" value={Ep} min={0} max={250} step={10} onChange={ch(setEp)} colour={C} />
        <Slider label="Activation energy Eₐ" value={Ea} min={20} max={200} step={10} onChange={ch(setEa)} colour={C} />
      </div>
      <Readouts className="mt-3" colour={C} items={[
        { label: "ΔH = E(products) − E(reactants)", value: `${dH > 0 ? "+" : ""}${dH}`, unit: "kJ·mol⁻¹", highlight: true },
        { label: "type", value: dH < 0 ? "exothermic" : dH > 0 ? "endothermic" : "neither" },
        { label: "activation energy", value: String(EaEff), unit: "kJ·mol⁻¹" },
        { label: "energy of activated complex", value: String(top), unit: "kJ·mol⁻¹" },
        { label: "reverse reaction Eₐ", value: String(top - Ep), unit: "kJ·mol⁻¹" },
        { label: "catalyst lowers Eₐ by", value: cat ? dc(top - catTop, 0) : "–", unit: cat ? "kJ·mol⁻¹" : undefined },
      ]} />
      <Explain colour={C}>
        {dH < 0 ? <><strong>Exothermic</strong>: the products have less energy than the reactants, so energy is <strong>released</strong> to the surroundings (they get warmer) and ΔH is negative. Burning fuel and respiration are exothermic.</> : <><strong>Endothermic</strong>: the products have more energy, so energy is <strong>absorbed</strong> from the surroundings (they get colder) and ΔH is positive. Photosynthesis and melting ice are endothermic.</>}
        {" "}The <strong>activation energy</strong> is the minimum energy needed to start the reaction (to form the activated complex).{cat && " A catalyst gives an alternative path with a LOWER activation energy, so more collisions are successful – but ΔH stays the same and the catalyst is not used up."}
      </Explain>
    </WidgetFrame>
  );
}
