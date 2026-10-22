"use client";
import { useState } from "react";
import { atomCounts, element, FormulaError, formulaTex, molarMass } from "@/lib/sci/chem";
import { sciTex } from "@/lib/sci/numbers";
import { Tex } from "@/components/learn/tex";
import { dc, Explain, Readouts, useToolUse } from "./sim-kit";
import { Segmented, Slider, WidgetFrame } from "./widget-frame";

const C = "var(--t-change)";
const NA = 6.02e23;
type Mode = "mass" | "conc" | "gas";
const QUICK = ["H2O", "NaCl", "CO2", "CaCO3", "H2SO4", "C6H12O6", "NaOH", "CuSO4·5H2O"];

/**
 * The mole calculator: type any formula to get its molar mass with the
 * working, then convert between mass, moles, particles, concentration and gas
 * volume – with the "magic triangle" for n = m/M.
 */
export function MoleLab({ title = "Mole calculator", mode: startMode = "mass" }: { title?: string; mode?: Mode }) {
  const [formula, setFormula] = useState("H2O");
  const [mode, setMode] = useState<Mode>(startMode);
  const [m, setM] = useState(36);
  const [V, setV] = useState(250);
  const [vol, setVol] = useState(11.2);
  const touch = useToolUse();

  let M = 0;
  let error = "";
  let counts: Record<string, number> = {};
  try {
    counts = atomCounts(formula);
    M = molarMass(formula);
    if (!Object.keys(counts).length) error = "Type a formula.";
  } catch (e) {
    error = e instanceof FormulaError ? e.message : "I can't read that formula.";
  }
  const n = M ? m / M : 0;
  const working = Object.entries(counts).map(([el, k]) => `${k > 1 ? `${k}(${dc(element(el)!.mass, element(el)!.mass % 1 ? 1 : 0)})` : dc(element(el)!.mass, element(el)!.mass % 1 ? 1 : 0)}`).join(" + ").replace(/\./g, "{,}");

  return (
    <WidgetFrame title={title} colour={C} instruction="Type a chemical formula (capital letter for each element, e.g. Ca(OH)2), then use the sliders.">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2">
          <span className="text-sm font-semibold">Formula:</span>
          <input value={formula} onChange={(e) => { setFormula(e.target.value); touch(); }} className="w-40 rounded-xl border-2 border-line bg-bg px-3 py-1.5 font-mono text-base outline-none focus:border-brand" aria-label="Chemical formula" spellCheck={false} autoCapitalize="off" />
        </label>
        {QUICK.map((q) => <button key={q} onClick={() => setFormula(q)} className="rounded-lg border border-line px-2 py-0.5 text-xs font-semibold text-muted hover:text-fg"><Tex tex={formulaTex(q)} /></button>)}
      </div>
      {error ? (
        <p role="alert" className="mt-3 rounded-xl bg-warning/10 p-3 text-sm">{error}</p>
      ) : (
        <>
          <div className="mt-3 rounded-xl bg-surface-2 p-3 text-center text-lg"><Tex display tex={`M(${formulaTex(formula)}) = ${working} = ${dc(M, 1).replace(",0", "")}\\ \\text{g·mol}^{-1}`} /></div>
          <div className="mt-3"><Segmented colour={C} value={mode} onChange={(v) => { setMode(v); touch(); }} options={[{ id: "mass", label: "Mass ↔ moles ↔ particles" }, { id: "conc", label: "Making a solution" }, { id: "gas", label: "Gas at STP" }]} /></div>
          {mode === "mass" && (
            <div className="mt-3 grid gap-4 md:grid-cols-[200px_minmax(0,1fr)]">
              <svg viewBox="0 0 200 170" className="diagram" role="img" aria-label="Formula triangle: m at the top, n and M at the bottom">
                <path d="M100,10 L190,160 L10,160 Z" fill="color-mix(in oklab, var(--t-change) 15%, transparent)" stroke={C} strokeWidth="3" />
                <line x1="45" y1="100" x2="155" y2="100" stroke={C} strokeWidth="3" /><line x1="100" y1="100" x2="100" y2="160" stroke={C} strokeWidth="3" />
                <text x="100" y="78" textAnchor="middle" fontSize="26" fontWeight="800" fill="var(--text)">m</text>
                <text x="65" y="142" textAnchor="middle" fontSize="26" fontWeight="800" fill="var(--text)">n</text>
                <text x="135" y="142" textAnchor="middle" fontSize="26" fontWeight="800" fill="var(--text)">M</text>
              </svg>
              <div>
                <Slider label="Mass m (g)" value={m} min={1} max={500} step={1} onChange={(v) => { setM(v); touch(); }} colour={C} />
                <Readouts className="mt-3" colour={C} items={[
                  { label: "n = m / M", value: dc(n, 3), unit: "mol", highlight: true },
                  { label: "particles N = n × Nₐ", value: sciTex(n * NA, 3), tex: true },
                  { label: "atoms in total", value: sciTex(n * NA * Object.values(counts).reduce((a, b) => a + b, 0), 3), tex: true },
                ]} />
              </div>
            </div>
          )}
          {mode === "conc" && (
            <div className="mt-3 grid gap-4 md:grid-cols-[160px_minmax(0,1fr)]">
              <svg viewBox="0 0 160 200" className="diagram" role="img" aria-label={`Flask holding ${V} cubic centimetres of solution`}>
                <defs><clipPath id="flask"><path d="M65,10 h30 v70 l45,90 a12,12 0 0 1 -10,18 h-100 a12,12 0 0 1 -10,-18 l45,-90 z" /></clipPath></defs>
                <rect x="0" y={188 - 150 * Math.min(1, V / 1000)} width="160" height="200" fill={C} opacity={0.25 + Math.min(0.6, n / (V / 1000) / 4)} clipPath="url(#flask)" />
                <path d="M65,10 h30 v70 l45,90 a12,12 0 0 1 -10,18 h-100 a12,12 0 0 1 -10,-18 l45,-90 z" fill="none" stroke="var(--text-muted)" strokeWidth="3" />
              </svg>
              <div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Slider label="Mass dissolved m (g)" value={m} min={1} max={200} step={1} onChange={(v) => { setM(v); touch(); }} colour={C} />
                  <Slider label="Volume of solution V (cm³)" value={V} min={50} max={1000} step={50} onChange={(v) => { setV(v); touch(); }} colour={C} />
                </div>
                <Readouts className="mt-3" colour={C} items={[
                  { label: "n = m / M", value: dc(n, 3), unit: "mol" },
                  { label: "V in dm³", value: dc(V / 1000, 3), unit: "dm³" },
                  { label: "c = n / V", value: dc(n / (V / 1000), 3), unit: "mol·dm⁻³", highlight: true },
                ]} />
              </div>
            </div>
          )}
          {mode === "gas" && (
            <div className="mt-3">
              <Slider label="Volume of gas at STP (dm³)" value={vol} min={1} max={100} step={0.2} onChange={(v) => { setVol(v); touch(); }} colour={C} format={(v) => dc(v, 1)} />
              <Readouts className="mt-3" colour={C} items={[
                { label: "n = V / Vₘ", value: dc(vol / 22.4, 3), unit: "mol", highlight: true },
                { label: "mass m = nM", value: dc((vol / 22.4) * M, 2), unit: "g" },
                { label: "molecules", value: sciTex((vol / 22.4) * NA, 3), tex: true },
              ]} />
            </div>
          )}
        </>
      )}
      <Explain colour={C}>
        A <strong>mole</strong> is the amount of substance that contains 6,02 × 10²³ particles (Avogadro&apos;s number) – the same number as there are atoms in 12 g of carbon-12. The <strong>molar mass</strong> M is the mass of one mole, in g·mol⁻¹. Cover the quantity you want in the triangle: n = m/M, m = nM, M = m/n. For solutions c = n/V (V in dm³), and one mole of any gas at STP takes up 22,4 dm³.
      </Explain>
    </WidgetFrame>
  );
}
