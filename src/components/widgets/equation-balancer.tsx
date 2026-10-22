"use client";
import { useEffect, useMemo, useState } from "react";
import { Check, Minus, Plus, Shuffle } from "lucide-react";
import { atomCounts, EQUATIONS, formulaTex } from "@/lib/sci/chem";
import { solvePuzzle } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { Tex } from "@/components/learn/tex";
import { Explain, useToolUse } from "./sim-kit";
import { WidgetFrame } from "./widget-frame";

const C = "var(--t-change)";
const ATOM_COLOURS: Record<string, string> = { H: "#e5e7eb", O: "#ef4444", C: "#374151", N: "#3b82f6", Cl: "#22c55e", Na: "#a855f7", Mg: "#84cc16", Fe: "#b45309", Al: "#94a3b8", Zn: "#64748b", Ca: "#f59e0b", S: "#eab308", K: "#c084fc", Ag: "#cbd5e1", Pb: "#475569", I: "#7c3aed" };

/**
 * Balance chemical equations by changing the coefficients. A live atom count
 * for each side (with a see-saw) shows which elements still need fixing.
 * Formulas can't change – only the numbers in front of them.
 */
export function EquationBalancer({ title = "Equation balancer", start = 0 }: { title?: string; start?: number }) {
  const [k, setK] = useState(start);
  const eq = EQUATIONS[k % EQUATIONS.length];
  const species = useMemo(() => [...eq.reactants, ...eq.products], [eq]);
  const [coef, setCoef] = useState<number[]>(() => species.map(() => 1));
  const [won, setWon] = useState(false);
  const touch = useToolUse();
  const nr = eq.reactants.length;

  const tally = useMemo(() => {
    const left: Record<string, number> = {};
    const right: Record<string, number> = {};
    species.forEach((s, i) => {
      for (const [el, nn] of Object.entries(atomCounts(s))) {
        const side = i < nr ? left : right;
        side[el] = (side[el] ?? 0) + nn * (coef[i] ?? 1);
      }
    });
    return { left, right, els: [...new Set([...Object.keys(left), ...Object.keys(right)])] };
  }, [species, coef, nr]);
  const balanced = tally.els.every((el) => tally.left[el] === tally.right[el]);
  const g = coef.reduce((a, b) => { const f = (x: number, y: number): number => (y ? f(y, x % y) : x); return f(a, b); });
  const lowest = balanced && g === 1;
  useEffect(() => {
    if (lowest && !won) {
      setWon(true);
      solvePuzzle(`balance:${eq.label}`, 10);
    }
  }, [lowest, won, eq.label]);
  const totalL = Object.values(tally.left).reduce((a, b) => a + b, 0);
  const totalR = Object.values(tally.right).reduce((a, b) => a + b, 0);
  const tilt = Math.max(-12, Math.min(12, (totalR - totalL) * 1.5));

  const next = () => {
    const nk = (k + 1) % EQUATIONS.length;
    setK(nk);
    setCoef([...EQUATIONS[nk].reactants, ...EQUATIONS[nk].products].map(() => 1));
    setWon(false);
  };
  const change = (i: number, d: number) => { setCoef((cs) => cs.map((c, j) => (j === i ? Math.max(1, Math.min(12, c + d)) : c))); setWon(false); touch(); };

  return (
    <WidgetFrame title={title} colour={C} instruction="Use + and − to change the coefficients until every element has the same number of atoms on both sides.">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold text-muted">{eq.label} · equation {(k % EQUATIONS.length) + 1} of {EQUATIONS.length}</div>
        <button onClick={next} className="inline-flex items-center gap-1 rounded-lg border border-line px-3 py-1 text-sm font-semibold"><Shuffle className="h-4 w-4" /> Next equation</button>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-line bg-surface-2/50 p-4 text-lg">
        {species.map((s, i) => (
          <span key={`${k}-${i}`} className="flex items-center gap-2">
            {i > 0 && <span className="font-bold text-muted">{i === nr ? <Tex tex="\rightarrow" /> : "+"}</span>}
            <span className="flex flex-col items-center gap-1 rounded-xl border border-line bg-surface px-2 py-1.5">
              <span className="flex items-center gap-1">
                <button onClick={() => change(i, -1)} className="grid h-7 w-7 place-items-center rounded-md bg-surface-2" aria-label={`Decrease coefficient of ${s}`}><Minus className="h-3.5 w-3.5" /></button>
                <span className="w-6 text-center font-mono text-xl font-bold" style={{ color: C }}>{coef[i]}</span>
                <button onClick={() => change(i, 1)} className="grid h-7 w-7 place-items-center rounded-md bg-surface-2" aria-label={`Increase coefficient of ${s}`}><Plus className="h-3.5 w-3.5" /></button>
              </span>
              <Tex tex={formulaTex(s)} />
              <span className="flex max-w-36 flex-wrap justify-center gap-0.5" aria-hidden>
                {Array.from({ length: Math.min(4, coef[i]) }, (_, m) => (
                  <span key={m} className="flex gap-[1px] rounded-full bg-surface-2 px-1 py-0.5">
                    {Object.entries(atomCounts(s)).flatMap(([el, nn]) => Array.from({ length: Math.min(6, nn) }, (_, q) => <span key={`${el}${q}`} className="h-2.5 w-2.5 rounded-full border border-black/20" style={{ background: ATOM_COLOURS[el] ?? "#a3a3a3" }} />))}
                  </span>
                ))}
                {coef[i] > 4 && <span className="text-[10px] text-muted">+{coef[i] - 4}</span>}
              </span>
            </span>
          </span>
        ))}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_200px]">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-muted"><th className="py-1">Element</th><th>Reactants</th><th>Products</th><th></th></tr></thead>
          <tbody>
            {tally.els.map((el) => {
              const ok = tally.left[el] === tally.right[el];
              return (
                <tr key={el} className={cn("border-t border-line", ok ? "text-success" : "text-danger")}>
                  <td className="py-1.5 font-semibold"><span className="mr-1 inline-block h-3 w-3 rounded-full align-middle" style={{ background: ATOM_COLOURS[el] ?? "#a3a3a3" }} />{el}</td>
                  <td className="font-mono">{tally.left[el] ?? 0}</td>
                  <td className="font-mono">{tally.right[el] ?? 0}</td>
                  <td>{ok ? "✓" : "✗"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <svg viewBox="0 0 200 110" className="diagram" role="img" aria-label={balanced ? "Balanced" : "Not balanced yet"}>
          <path d="M100,100 L85,105 L115,105 Z" fill="var(--text-muted)" />
          <line x1="100" y1="100" x2="100" y2="55" stroke="var(--text-muted)" strokeWidth="3" />
          <g transform={`rotate(${balanced ? 0 : tilt} 100 55)`}>
            <line x1="20" y1="55" x2="180" y2="55" stroke="var(--text)" strokeWidth="4" strokeLinecap="round" />
            <rect x="10" y="35" width="40" height="18" rx="4" fill={balanced ? "var(--success)" : C} /><text x="30" y="48" textAnchor="middle" fontSize="10" fontWeight="800" fill="white">{totalL}</text>
            <rect x="150" y="35" width="40" height="18" rx="4" fill={balanced ? "var(--success)" : C} /><text x="170" y="48" textAnchor="middle" fontSize="10" fontWeight="800" fill="white">{totalR}</text>
          </g>
        </svg>
      </div>
      {balanced && (
        <div role="status" className={cn("mt-3 flex items-center gap-2 rounded-xl p-3 text-sm font-semibold", lowest ? "bg-success/10 text-success" : "bg-warning/10")}>
          <Check className="h-5 w-5" /> {lowest ? "Balanced! Mass is conserved – the same atoms, just rearranged." : "Balanced – but use the smallest whole numbers (divide all the coefficients by the same number)."}
        </div>
      )}
      <Explain colour={C}>
        The <strong>law of conservation of mass</strong>: atoms are not created or destroyed in a reaction, only rearranged, so each element must have the same number of atoms on both sides. Tip: balance the element that appears in the fewest formulas first, and leave H, O (or a lone element like O₂) for last.
      </Explain>
    </WidgetFrame>
  );
}
