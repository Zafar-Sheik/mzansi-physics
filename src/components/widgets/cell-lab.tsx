"use client";
import { useState } from "react";
import { REDUCTION_POTENTIALS } from "@/lib/sci/chem";
import { Tex } from "@/components/learn/tex";
import { dc, Explain, Readouts, SimControls, useTicker, useToolUse } from "./sim-kit";
import { Segmented, WidgetFrame } from "./widget-frame";

const C = "var(--t-change)";
const METALS = ["Mg", "Al", "Zn", "Fe", "Ni", "Pb", "Cu", "Ag"];
const half = (m: string) => REDUCTION_POTENTIALS.find((h) => h.reduced === m)!;
const ion = (m: string) => half(m).oxidised;
const ionTex = (m: string) => { const h = half(m); return h.tex.replace(/^\\mathrm\{/, "").split(" + ")[0]; };
const COLOURS: Record<string, string> = { Cu: "#b45309", Zn: "#94a3b8", Mg: "#d4d4d8", Al: "#cbd5e1", Fe: "#57534e", Ni: "#a8a29e", Pb: "#475569", Ag: "#e5e7eb" };
const SOLN: Record<string, string> = { Cu: "#38bdf8", Ni: "#86efac", Fe: "#bef264" };

/**
 * Build a galvanic cell from any two metal half-cells and read its emf, or
 * switch to an electrolytic cell (purifying copper). See which electrode is the
 * anode and cathode, which way the electrons flow, and the half-reactions.
 */
export function CellLab({ title = "Electrochemical cells", mode: startMode = "galvanic" }: { title?: string; mode?: "galvanic" | "electrolytic" }) {
  const [mode, setMode] = useState(startMode);
  const [left, setLeft] = useState("Zn");
  const [right, setRight] = useState("Cu");
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(0);
  const touch = useToolUse();
  useTicker((dt) => setT((x) => x + dt), running);

  const a = half(left), b = half(right);
  const same = left === right;
  const [anode, cathode] = a.e <= b.e ? [left, right] : [right, left];
  const emf = same ? 0 : half(cathode).e - half(anode).e;
  const anodeLeft = anode === left;
  const n = Math.max(half(anode).electrons, half(cathode).electrons);
  const dots = Array.from({ length: 6 }, (_, i) => ((t * 0.35 + i / 6) % 1));
  // Wire path: from anode top, over the top, to cathode top.
  const wire = (p: number, fromLeft: boolean) => {
    const xA = fromLeft ? 120 : 400, xC = fromLeft ? 400 : 120;
    const L1 = 70, L2 = Math.abs(xC - xA), L = 2 * L1 + L2;
    const d = p * L;
    if (d < L1) return { x: xA, y: 110 - d };
    if (d < L1 + L2) return { x: xA + Math.sign(xC - xA) * (d - L1), y: 40 };
    return { x: xC, y: 40 + (d - L1 - L2) };
  };

  return (
    <WidgetFrame title={title} colour={C} instruction={mode === "galvanic" ? "Choose the metal for each half-cell. The voltmeter shows the initial emf under standard conditions (1 mol·dm⁻³, 25 °C)." : "An external battery forces a non-spontaneous reaction: copper is purified."}>
      <Segmented colour={C} value={mode} onChange={(m) => { setMode(m); touch(); }} options={[{ id: "galvanic", label: "Galvanic (voltaic) cell" }, { id: "electrolytic", label: "Electrolytic cell" }]} />
      {mode === "galvanic" ? (
        <>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {([["Left electrode", left, setLeft], ["Right electrode", right, setRight]] as const).map(([lab, val, set]) => (
              <div key={lab} className="flex flex-wrap items-center gap-1.5 text-sm">
                <span className="font-semibold">{lab}:</span>
                {METALS.map((m) => <button key={m} onClick={() => { set(m); touch(); }} aria-pressed={val === m} className={`rounded-lg border px-2 py-0.5 text-xs font-semibold ${val === m ? "border-change bg-change text-white" : "border-line text-muted"}`}>{m}</button>)}
              </div>
            ))}
          </div>
          <svg viewBox="0 0 520 280" className="diagram mt-3 rounded-xl border border-line bg-surface" role="img" aria-label={same ? "Both electrodes are the same metal: no emf" : `Anode ${anode}, cathode ${cathode}, emf ${dc(emf, 2)} volts`}>
            <path d="M120,110 V40 H400 V110" fill="none" stroke="var(--text)" strokeWidth="2.5" />
            <g transform="translate(260, 40)"><circle r="20" fill="var(--surface)" stroke={C} strokeWidth="2.5" /><text y="5" textAnchor="middle" fontSize="12" fontWeight="800" fill={C}>V</text></g>
            <text x="260" y="78" textAnchor="middle" fontSize="13" fontWeight="800" fill={C}>{same ? "0,00" : dc(emf, 2)} V</text>
            {[[60, left], [340, right]].map(([x, m]) => (
              <g key={x as number}>
                <path d={`M${x},150 v110 h120 v-110`} fill="none" stroke="var(--text-muted)" strokeWidth="3" />
                <rect x={(x as number) + 3} y="170" width="114" height="88" fill={SOLN[m as string] ?? "#e0f2fe"} opacity="0.45" />
                <rect x={(x as number) + 50} y="105" width="20" height="130" fill={COLOURS[m as string]} stroke="#334155" />
                <text x={(x as number) + 60} y="272" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text)">{m as string} in {ion(m as string)}(aq)</text>
              </g>
            ))}
            <path d="M150,175 v-30 h220 v30" fill="none" stroke="#a3a3a3" strokeWidth="14" strokeLinejoin="round" />
            <text x="260" y="140" textAnchor="middle" fontSize="11" className="muted">salt bridge (KNO₃)</text>
            {!same && (
              <>
                <text x={anodeLeft ? 120 : 400} y="98" textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--danger)">ANODE (−)</text>
                <text x={anodeLeft ? 400 : 120} y="98" textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--success)">CATHODE (+)</text>
                {running && dots.map((p, i) => { const q = wire(p, anodeLeft); return <circle key={i} cx={q.x} cy={q.y} r="5" fill="#3b82f6" />; })}
                <text x="260" y="22" textAnchor="middle" fontSize="11" fill="#3b82f6">e⁻ flow {anodeLeft ? "→" : "←"} (anode to cathode)</text>
              </>
            )}
          </svg>
          <div className="mt-3"><SimControls running={running} colour={C} onToggle={() => { setRunning((r) => !r); touch(); }}><span className="text-xs text-muted">Play shows the electrons moving through the wire.</span></SimControls></div>
          {!same && (
            <div className="mt-3 grid gap-2 rounded-xl bg-surface-2 p-3 text-sm">
              <div><strong className="text-danger">Anode (oxidation):</strong> <Tex tex={`\\mathrm{${anode} \\rightarrow ${ionTex(anode)} + ${half(anode).electrons}e^-}`} /></div>
              <div><strong className="text-success">Cathode (reduction):</strong> <Tex tex={`\\mathrm{${ionTex(cathode)} + ${half(cathode).electrons}e^- \\rightarrow ${cathode}}`} /></div>
              <div><strong>Cell notation:</strong> <Tex tex={`\\mathrm{${anode}\\,|\\,${ionTex(anode)}(1\\ mol{\\cdot}dm^{-3})\\,||\\,${ionTex(cathode)}(1\\ mol{\\cdot}dm^{-3})\\,|\\,${cathode}}`} /></div>
            </div>
          )}
          <Readouts className="mt-3" colour={C} items={[
            { label: `E° ${anode}`, value: `${half(anode).e > 0 ? "+" : ""}${dc(half(anode).e, 2)}`, unit: "V" },
            { label: `E° ${cathode}`, value: `${half(cathode).e > 0 ? "+" : ""}${dc(half(cathode).e, 2)}`, unit: "V" },
            { label: "E°cell = E°cathode − E°anode", value: dc(emf, 2), unit: "V", highlight: true },
            { label: "electrons per formula unit", value: String(n) },
          ]} />
          <Explain colour={C}>
            {same ? "Two identical half-cells have no difference in potential – no reaction, no emf." : <>The metal with the more negative E° is the <strong>stronger reducing agent</strong>, so it is oxidised: {anode} is the <strong>anode</strong>. Electrons flow through the wire from anode to cathode, where {ionTex(cathode).replace(/[{}^]/g, "")} ions are reduced. The salt bridge lets ions move to keep both solutions neutral and completes the circuit. A positive emf means the reaction is <strong>spontaneous</strong>.</>}
          </Explain>
        </>
      ) : (
        <>
          <svg viewBox="0 0 520 260" className="diagram mt-3 rounded-xl border border-line bg-surface" role="img" aria-label="Electrolytic purification of copper">
            <path d="M150,110 V40 H370 V110" fill="none" stroke="var(--text)" strokeWidth="2.5" />
            <g transform="translate(260, 40)"><rect x="-26" y="-14" width="52" height="28" fill="var(--surface)" /><line x1="-8" x2="-8" y1="-12" y2="12" stroke="var(--text)" strokeWidth="3" /><line x1="6" x2="6" y1="-6" y2="6" stroke="var(--text)" strokeWidth="5" /><text x="-16" y="-16" fontSize="12" fill="var(--text)">+</text><text x="12" y="-16" fontSize="12" fill="var(--text)">−</text></g>
            <path d="M90,120 v120 h340 v-120" fill="none" stroke="var(--text-muted)" strokeWidth="3" />
            <rect x="93" y="140" width="334" height="98" fill="#38bdf8" opacity="0.4" />
            <rect x="135" y="100" width="30" height="130" fill="#92400e" /><text x="150" y="252" textAnchor="middle" fontSize="11" fontWeight="700">impure Cu (anode +)</text>
            <rect x="358" y="100" width={12 + Math.min(10, t * 0.6)} height="130" fill="#b45309" /><text x="368" y="252" textAnchor="middle" fontSize="11" fontWeight="700">pure Cu (cathode −)</text>
            {running && Array.from({ length: 8 }, (_, i) => { const p = (t * 0.25 + i / 8) % 1; return <circle key={i} cx={170 + p * 185} cy={160 + (i % 4) * 18} r="5" fill="#1d4ed8" />; })}
            {running && <text x="262" y="132" textAnchor="middle" fontSize="11" fill="#1d4ed8">Cu²⁺ ions →</text>}
            <path d="M140,232 h20" stroke="#78716c" strokeWidth={Math.min(8, t * 0.4)} />
            <text x="150" y="226" textAnchor="middle" fontSize="9" className="muted">anode sludge</text>
          </svg>
          <div className="mt-3"><SimControls running={running} colour={C} onToggle={() => { setRunning((r) => !r); touch(); }} onReset={() => { setT(0); setRunning(false); }} /></div>
          <div className="mt-3 grid gap-2 rounded-xl bg-surface-2 p-3 text-sm">
            <div><strong className="text-danger">Anode (+, oxidation):</strong> <Tex tex="\mathrm{Cu \rightarrow Cu^{2+} + 2e^-}" /></div>
            <div><strong className="text-success">Cathode (−, reduction):</strong> <Tex tex="\mathrm{Cu^{2+} + 2e^- \rightarrow Cu}" /></div>
          </div>
          <Explain colour={C}>
            In an <strong>electrolytic cell</strong> a battery (DC source) drives a <strong>non-spontaneous</strong> reaction: electrical energy → chemical energy. Oxidation still happens at the anode and reduction at the cathode, but now the anode is <strong>positive</strong>. The impure copper anode dissolves, pure copper plates onto the cathode, and impurities like silver and gold fall to the bottom as anode sludge. The same idea is used for electroplating, extracting aluminium, and the chlor-alkali industry.
          </Explain>
        </>
      )}
    </WidgetFrame>
  );
}
