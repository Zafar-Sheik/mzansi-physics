"use client";
import { useState } from "react";
import { Curve, Dot, Guide, Plot } from "@/components/sci/plot";
import { dc, Explain, Readouts, useToolUse } from "./sim-kit";
import { Segmented, Slider, WidgetFrame } from "./widget-frame";

const C = "var(--t-change)";
const Kw = 1e-14;
const Ka = 1.8e-5;
type Acid = "HCl" | "CH3COOH";

const INDICATORS = {
  phenolphthalein: { name: "Phenolphthalein", lo: 8.3, hi: 10, acid: "rgba(255,255,255,0.15)", base: "#ec4899" },
  "methyl orange": { name: "Methyl orange", lo: 3.1, hi: 4.4, acid: "#ef4444", base: "#f59e0b" },
  "bromothymol blue": { name: "Bromothymol blue", lo: 6, hi: 7.6, acid: "#eab308", base: "#2563eb" },
} as const;
type Ind = keyof typeof INDICATORS;

/** pH after adding Vb cm³ of NaOH (cb) to 25 cm³ of acid (ca). */
function pHAt(acid: Acid, ca: number, cb: number, Vb: number) {
  const Va = 25;
  const na = (ca * Va) / 1000;
  const nb = (cb * Vb) / 1000;
  const Vt = (Va + Vb) / 1000;
  if (acid === "HCl") {
    if (Math.abs(na - nb) < 1e-12) return 7;
    if (na > nb) return -Math.log10((na - nb) / Vt);
    return 14 + Math.log10((nb - na) / Vt);
  }
  if (nb === 0) return -Math.log10(Math.sqrt(Ka * ca));
  if (nb < na) return -Math.log10(Ka) + Math.log10(nb / (na - nb));
  if (Math.abs(nb - na) < 1e-9) {
    const cs = na / Vt;
    return 14 + Math.log10(Math.sqrt((Kw / Ka) * cs));
  }
  return 14 + Math.log10((nb - na) / Vt);
}

function mix(a: string, b: string, f: number) {
  return `color-mix(in oklab, ${b} ${Math.round(f * 100)}%, ${a})`;
}

/**
 * A virtual titration: run NaOH from the burette into 25 cm³ of a strong or
 * weak acid, watch the pH curve and the indicator colour, and find the
 * equivalence point. Choose the right indicator for the job.
 */
export function TitrationLab({ title = "Virtual titration" }: { title?: string }) {
  const [acid, setAcid] = useState<Acid>("HCl");
  const [ca, setCa] = useState(0.1);
  const [cb, setCb] = useState(0.1);
  const [Vb, setVb] = useState(0);
  const [ind, setInd] = useState<Ind>("phenolphthalein");
  const touch = useToolUse();
  const pH = pHAt(acid, ca, cb, Vb);
  const Veq = (ca * 25) / cb;
  const I = INDICATORS[ind];
  const f = Math.max(0, Math.min(1, (pH - I.lo) / (I.hi - I.lo)));
  const colour = mix(I.acid, I.base, f);
  const pHeq = pHAt(acid, ca, cb, Veq);
  const goodIndicator = pHeq >= I.lo - 1.5 && pHeq <= I.hi + 0.5 && (acid === "HCl" ? true : I.lo > 6.5);
  const add = (d: number) => { setVb((v) => Math.max(0, Math.min(50, Math.round((v + d) * 100) / 100))); touch(); };
  const level = 1 - Vb / 50;

  return (
    <WidgetFrame title={title} colour={C} instruction="Add the base from the burette – in big steps far from the end point, then drop by drop. Stop when the indicator just changes colour.">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented colour={C} value={acid} onChange={(a) => { setAcid(a); setVb(0); touch(); }} options={[{ id: "HCl", label: "HCl (strong acid)" }, { id: "CH3COOH", label: "CH₃COOH (weak acid)" }]} />
        <Segmented colour={C} value={ind} onChange={(i) => { setInd(i); touch(); }} options={(Object.keys(INDICATORS) as Ind[]).map((k) => ({ id: k, label: INDICATORS[k].name }))} />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-[170px_minmax(0,1fr)]">
        <svg viewBox="0 0 170 300" className="diagram" role="img" aria-label={`${dc(Vb, 2)} cubic centimetres of NaOH added, pH ${dc(pH, 2)}`}>
          <rect x="72" y="10" width="26" height="170" rx="3" fill="var(--surface)" stroke="var(--text-muted)" strokeWidth="2" />
          <rect x="74" y={12 + (1 - level) * 166} width="22" height={level * 166} fill="#bfdbfe" />
          {Array.from({ length: 11 }, (_, i) => <line key={i} x1="72" x2="80" y1={12 + i * 16.6} y2={12 + i * 16.6} stroke="var(--text-muted)" />)}
          <path d="M80,180 h10 v14 l-3,10 h-4 l-3,-10 z" fill="var(--text-muted)" />
          <text x="104" y="24" fontSize="10" className="muted">NaOH</text>
          <text x="104" y="36" fontSize="10" className="muted">{dc(cb, 2)} M</text>
          <path d="M60,220 h50 l35,60 a10,10 0 0 1 -8,14 h-104 a10,10 0 0 1 -8,-14 z" fill={colour} stroke="var(--text-muted)" strokeWidth="2.5" />
          <text x="85" y="275" textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--text)">pH {dc(pH, 2)}</text>
        </svg>
        <Plot view={{ xMin: 0, xMax: 50, yMin: 0, yMax: 14 }} width={440} height={260} label="Titration curve: pH against volume of base" xLabel="V(NaOH) cm³" yLabel="pH" yStep={2}>
          <Curve f={(v) => (v < 0 ? NaN : pHAt(acid, ca, cb, v))} colour="var(--curve-ghost)" dashed />
          <Curve f={(v) => pHAt(acid, ca, cb, v)} from={0} to={Vb} colour={C} />
          <Guide x={Veq} label="equivalence" />
          <Guide y={I.lo} colour={I.base} />
          <Guide y={I.hi} colour={I.base} label={`${I.name} range`} />
          <Dot x={Vb} y={pH} colour={C} />
        </Plot>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {[-1, -0.1, 0.05, 0.1, 1, 5].map((d) => <button key={d} onClick={() => add(d)} className="rounded-xl border border-line px-3 py-1.5 text-sm font-semibold">{d > 0 ? "+" : ""}{dc(d, d % 1 ? 2 : 0)} cm³</button>)}
        <button onClick={() => { setVb(0); touch(); }} className="rounded-xl border border-line px-3 py-1.5 text-sm text-muted">Empty flask</button>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Slider label="Concentration of the acid (mol·dm⁻³)" value={ca} min={0.05} max={0.2} step={0.05} onChange={(v) => { setCa(v); touch(); }} colour={C} format={(v) => dc(v, 2)} />
        <Slider label="Concentration of NaOH (mol·dm⁻³)" value={cb} min={0.05} max={0.2} step={0.05} onChange={(v) => { setCb(v); touch(); }} colour={C} format={(v) => dc(v, 2)} />
      </div>
      <Readouts className="mt-3" colour={C} items={[
        { label: "volume of base added", value: dc(Vb, 2), unit: "cm³" },
        { label: "pH", value: dc(pH, 2), highlight: true },
        { label: "equivalence point at", value: dc(Veq, 2), unit: "cm³" },
        { label: "pH at equivalence", value: dc(pHeq, 2) },
        { label: "indicator suitable?", value: goodIndicator ? "yes" : "no – changes too early/late" },
      ]} />
      <Explain colour={C}>
        At the <strong>equivalence point</strong> the acid and base have reacted in exactly the mole ratio of the equation: n(acid) = n(base). {acid === "HCl" ? "Strong acid + strong base gives a neutral salt solution, pH = 7 – most indicators work because the curve is so steep." : "A weak acid + strong base gives a salt that hydrolyses (CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻), so the solution at equivalence is BASIC (pH > 7). Use phenolphthalein, not methyl orange."}
        {" "}The <strong>end point</strong> is when the indicator changes colour – choose an indicator whose range includes the pH at equivalence.
      </Explain>
    </WidgetFrame>
  );
}
