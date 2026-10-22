"use client";
import { useMemo, useState } from "react";
import { Plus, Shuffle, Trash2 } from "lucide-react";
import { acceptedNames, canonical, condensed, GROUP_INFO, iupacName, isUnsaturated, isValid, molecularFormula, STEMS, type Group, type Molecule, type Sub } from "@/lib/sci/organic";
import { checkAnswer } from "@/lib/sci/check";
import { seededRandom } from "@/lib/utils";
import { addXp } from "@/lib/progress";
import { Tex } from "@/components/learn/tex";
import { Explain, Readouts, useToolUse } from "./sim-kit";
import { Segmented, Slider, WidgetFrame } from "./widget-frame";

const C = "var(--t-matter)";
const GROUPS = Object.keys(GROUP_INFO) as Group[];
const SUBS: Sub[] = ["methyl", "ethyl", "chloro", "bromo", "fluoro", "iodo"];
const LABEL: Record<Sub, string> = { methyl: "CH₃", ethyl: "CH₂CH₃", fluoro: "F", chloro: "Cl", bromo: "Br", iodo: "I" };
const sub = (s: string) => s.replace(/(\d+)/g, (d) => d.replace(/\d/g, (x) => "₀₁₂₃₄₅₆₇₈₉"[Number(x)]));

/** Structural (displayed) formula: every atom and bond, drawn from the canonical numbering. */
function Structure({ m }: { m: Molecule }) {
  const n = m.chain;
  const dx = Math.min(70, 460 / Math.max(1, n));
  const x0 = 300 - ((n - 1) * dx) / 2;
  const y = 120;
  const H = (() => {
    // Hydrogens = 4 − bonds, same rule as the namer.
    return Array.from({ length: n }, (_, i) => {
      const c = i + 1;
      let b = (c > 1 ? 1 : 0) + (c < n ? 1 : 0) + m.subs.filter((s) => s.pos === c).length;
      if ((m.group === "alkene" || m.group === "alkyne") && (c === m.pos || c === (m.pos ?? 0) + 1)) b += m.group === "alkene" ? 1 : 2;
      if (m.group === "alcohol" && c === m.pos) b += 1;
      if (m.group === "ketone" && c === m.pos) b += 2;
      if (["aldehyde", "acid", "ester"].includes(m.group) && c === 1) b += m.group === "aldehyde" ? 2 : 3;
      return Math.max(0, 4 - b);
    });
  })();
  const els: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const c = i + 1;
    const x = x0 + i * dx;
    const att: string[] = [];
    if (m.group === "ketone" && c === m.pos) att.push("=O");
    if (c === 1 && m.group === "aldehyde") att.push("=O");
    if (c === 1 && m.group === "acid") att.push("=O", "OH");
    if (c === 1 && m.group === "ester") att.push("=O", `O–${sub(m.alkyl === 1 ? "CH3" : m.alkyl === 2 ? "CH2CH3" : `C${m.alkyl}H${2 * (m.alkyl ?? 1) + 1}`)}`);
    m.subs.filter((s) => s.pos === c).forEach((s) => att.push(LABEL[s.kind]));
    if (m.group === "alcohol" && c === m.pos) att.push("OH");
    for (let k = 0; k < H[i]; k++) att.push("H");
    const slots: [number, number][] = [[0, -1], [0, 1], ...(c === 1 ? [[-1, 0] as [number, number]] : []), ...(c === n ? [[1, 0] as [number, number]] : [])];
    att.slice(0, slots.length).forEach((a, k) => {
      const [sx, sy] = slots[k];
      const ax = x + sx * 46, ay = y + sy * 46;
      const dbl = a.startsWith("=");
      const off = dbl ? 3.5 : 0;
      els.push(
        <g key={`${i}-${k}`}>
          {dbl ? (
            <>
              <line x1={x - off * sy} y1={y - off * sx} x2={ax - off * sy - sx * 10} y2={ay - off * sx - sy * 10} stroke="var(--text)" strokeWidth="2" />
              <line x1={x + off * sy} y1={y + off * sx} x2={ax + off * sy - sx * 10} y2={ay + off * sx - sy * 10} stroke="var(--text)" strokeWidth="2" />
            </>
          ) : <line x1={x + sx * 9} y1={y + sy * 11} x2={ax - sx * (a.length > 2 ? 22 : 9)} y2={ay - sy * 10} stroke="var(--text)" strokeWidth="2" />}
          <text x={ax} y={ay + 5} textAnchor="middle" fontSize="15" fontWeight={a === "H" ? 500 : 800} fill={a === "H" ? "var(--text-muted)" : a.includes("O") ? "#ef4444" : ["Cl", "Br", "F", "I"].includes(a) ? "#16a34a" : "var(--text)"}>{a.replace(/^=/, "")}</text>
        </g>,
      );
    });
    if (i < n - 1) {
      const multi = (m.group === "alkene" || m.group === "alkyne") && m.pos === c ? (m.group === "alkene" ? 2 : 3) : 1;
      for (let b = 0; b < multi; b++) {
        const o = (b - (multi - 1) / 2) * 6;
        els.push(<line key={`b${i}-${b}`} x1={x + 11} y1={y + o} x2={x + dx - 11} y2={y + o} stroke={multi > 1 ? "var(--t-change)" : "var(--text)"} strokeWidth={multi > 1 ? 2.5 : 2} />);
      }
    }
    els.push(<text key={`c${i}`} x={x} y={y + 6} textAnchor="middle" fontSize="17" fontWeight="800" fill="var(--text)">C</text>);
    els.push(<text key={`n${i}`} x={x + 9} y={y + 22} fontSize="10" fill="var(--brand)">{c}</text>);
  }
  return (
    <svg viewBox="0 0 600 240" className="diagram rounded-xl border border-line bg-surface" role="img" aria-label={`Structural formula of ${iupacName(m)}`}>
      {els}
    </svg>
  );
}

function randomMolecule(seed: number): Molecule {
  const r = seededRandom(seed);
  for (let k = 0; k < 80; k++) {
    const group = GROUPS[Math.floor(r() * GROUPS.length)];
    const chain = 1 + Math.floor(r() * 6);
    const pos = group === "alkene" || group === "alkyne" ? 1 + Math.floor(r() * Math.max(1, chain - 1)) : group === "ketone" ? 2 + Math.floor(r() * Math.max(1, chain - 2)) : group === "alcohol" ? 1 + Math.floor(r() * chain) : undefined;
    const subs: Molecule["subs"] = [];
    const ns = group === "haloalkane" ? 1 + Math.floor(r() * 2) : chain >= 4 && r() < 0.5 ? 1 : 0;
    const kind: Sub = group === "haloalkane" ? (["chloro", "bromo"] as const)[Math.floor(r() * 2)] : "methyl";
    for (let s = 0; s < ns; s++) subs.push({ pos: 1 + Math.floor(r() * chain), kind });
    const m: Molecule = { chain, group, pos, subs, alkyl: group === "ester" ? 1 + Math.floor(r() * 3) : undefined };
    if (isValid(m) && !(group !== "haloalkane" && group !== "alkane" && chain < 3 && subs.length)) return m;
  }
  return { chain: 3, group: "alcohol", pos: 2, subs: [] };
}

/**
 * Organic molecule builder: choose the chain, the functional group and any
 * branches, and get the structural formula, the condensed and molecular
 * formulae and the IUPAC name – or switch to "Name it!" and test yourself.
 */
export function OrganicNamer({ title = "Organic molecule builder" }: { title?: string }) {
  const [mode, setMode] = useState<"build" | "quiz">("build");
  const [m, setM] = useState<Molecule>({ chain: 4, group: "alcohol", pos: 2, subs: [] });
  const [seed, setSeed] = useState(7);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const touch = useToolUse();
  const q = useMemo(() => randomMolecule(seed), [seed]);
  const shown = mode === "build" ? m : q;
  const valid = isValid(shown);
  const update = (patch: Partial<Molecule>) => {
    setM((old) => {
      const next = { ...old, ...patch };
      const n = next.chain;
      if (next.group === "alkene" || next.group === "alkyne") next.pos = Math.min(Math.max(1, next.pos ?? 1), Math.max(1, n - 1));
      else if (next.group === "ketone") next.pos = Math.min(Math.max(2, next.pos ?? 2), Math.max(2, n - 1));
      else if (next.group === "alcohol") next.pos = Math.min(Math.max(1, next.pos ?? 1), n);
      else next.pos = undefined;
      if (next.group === "ester") next.alkyl = next.alkyl ?? 1;
      next.subs = next.subs.map((s) => ({ ...s, pos: Math.min(s.pos, n) }));
      return next;
    });
    touch();
  };
  const info = GROUP_INFO[shown.group];
  const check = () => {
    const ok = checkAnswer(guess, { answer: acceptedNames(q).join(" | "), kind: "text" }).ok;
    setResult(ok);
    if (ok) { const s = streak + 1; setStreak(s); addXp(s % 3 === 0 ? 15 : 3, "Organic naming"); } else setStreak(0);
    touch();
  };

  return (
    <WidgetFrame title={title} colour={C} instruction={mode === "build" ? "Build a molecule with the controls. The name, formulae and structure update live." : "Name the molecule. Spelling and numbers count – hyphens and spaces don't."}>
      <Segmented colour={C} value={mode} onChange={(v) => { setMode(v); setResult(null); setGuess(""); touch(); }} options={[{ id: "build", label: "Build it" }, { id: "quiz", label: "Name it!" }]} />
      {mode === "build" && (
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {GROUPS.map((g) => <button key={g} onClick={() => update({ group: g, subs: g === "haloalkane" && !m.subs.some((s) => !["methyl", "ethyl"].includes(s.kind)) ? [...m.subs, { pos: 1, kind: "chloro" }] : m.subs })} aria-pressed={m.group === g} className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${m.group === g ? "border-matter bg-matter text-white" : "border-line text-muted"}`}>{GROUP_INFO[g].series}</button>)}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Slider label="Carbons in the main chain" value={m.chain} min={1} max={8} step={1} onChange={(v) => update({ chain: v })} colour={C} format={(v) => `${v} (${STEMS[v]}-)`} />
            {m.pos !== undefined && <Slider label={isUnsaturated(m.group) ? "Position of the multiple bond" : m.group === "ketone" ? "Position of C=O" : "Position of –OH"} value={m.pos} min={m.group === "ketone" ? 2 : 1} max={isUnsaturated(m.group) || m.group === "ketone" ? Math.max(2, m.chain - 1) : m.chain} step={1} onChange={(v) => update({ pos: v })} colour={C} />}
            {m.group === "ester" && <Slider label="Carbons in the alkyl part (from the alcohol)" value={m.alkyl ?? 1} min={1} max={4} step={1} onChange={(v) => update({ alkyl: v })} colour={C} />}
          </div>
          <div className="space-y-2">
            {m.subs.map((s, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2 text-sm">
                <select value={s.kind} onChange={(e) => update({ subs: m.subs.map((x, j) => (j === i ? { ...x, kind: e.target.value as Sub } : x)) })} className="rounded-lg border border-line bg-surface px-2 py-1" aria-label="Branch type">
                  {SUBS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
                <span>on carbon</span>
                <select value={s.pos} onChange={(e) => update({ subs: m.subs.map((x, j) => (j === i ? { ...x, pos: Number(e.target.value) } : x)) })} className="rounded-lg border border-line bg-surface px-2 py-1" aria-label="Branch position">
                  {Array.from({ length: m.chain }, (_, k) => <option key={k} value={k + 1}>{k + 1}</option>)}
                </select>
                <button onClick={() => update({ subs: m.subs.filter((_, j) => j !== i) })} className="rounded-lg p-1 text-muted hover:text-danger" aria-label="Remove branch"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            {m.subs.length < 3 && <button onClick={() => update({ subs: [...m.subs, { pos: Math.min(2, m.chain), kind: m.group === "haloalkane" ? "bromo" : "methyl" }] })} className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-xs font-semibold"><Plus className="h-3.5 w-3.5" /> Add a branch / halogen</button>}
          </div>
        </div>
      )}
      <div className="mt-3">{valid ? <Structure m={canonical(shown)} /> : <p role="alert" className="rounded-xl bg-warning/10 p-3 text-sm">That isn&apos;t a valid molecule for naming – a carbon would have more than 4 bonds, or a branch on the end would make the chain longer. Move a branch inwards or choose another position.</p>}</div>
      {mode === "build" && valid && (
        <Readouts className="mt-3" colour={C} items={[
          { label: "IUPAC name", value: iupacName(m), highlight: true },
          { label: "condensed formula", value: sub(condensed(m)) },
          { label: "molecular formula", value: sub(molecularFormula(m)) },
          { label: "homologous series", value: info.series },
          { label: "functional group", value: info.functional },
          { label: "saturated?", value: isUnsaturated(m.group) ? "unsaturated (multiple bond)" : "saturated" },
        ]} />
      )}
      {mode === "quiz" && (
        <div className="mt-3">
          <div className="text-sm text-muted">Condensed: <Tex tex={`\\mathrm{${condensed(q).replace(/≡/g, "\\equiv ").replace(/(\d+)/g, "_{$1}")}}`} /> · streak {streak}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <input value={guess} onChange={(e) => { setGuess(e.target.value); setResult(null); }} onKeyDown={(e) => e.key === "Enter" && check()} placeholder="e.g. 2-methylbutan-2-ol" className="min-w-0 flex-1 rounded-xl border-2 border-line bg-bg px-3 py-2 font-mono outline-none focus:border-brand" aria-label="IUPAC name" spellCheck={false} autoCapitalize="off" />
            <button onClick={check} className="rounded-xl bg-matter px-4 text-sm font-semibold text-white">Check</button>
            <button onClick={() => { setSeed((s) => s + 1); setGuess(""); setResult(null); }} className="inline-flex items-center gap-1 rounded-xl border border-line px-3 text-sm"><Shuffle className="h-4 w-4" /> New</button>
          </div>
          {result !== null && <div role="status" className={`mt-2 rounded-xl p-3 text-sm ${result ? "bg-success/10" : "bg-warning/10"}`}>{result ? "Correct! 🎉" : <>Not yet. The answer is <strong>{iupacName(q)}</strong> – {info.series.toLowerCase()} ({info.suffix}).</>}</div>}
        </div>
      )}
      <Explain colour={C}>
        <strong>Naming in 4 steps:</strong> (1) find the <strong>functional group</strong> – it gives the suffix (-ane, -ene, -ol, -al, -one, -oic acid); (2) find the <strong>longest chain</strong> containing it – the stem (meth, eth, prop, but, pent…); (3) number the chain so the functional group gets the <strong>lowest number</strong>, then the branches; (4) name the branches in <strong>alphabetical order</strong> with di-/tri- for repeats, e.g. 2,2-dimethyl.
      </Explain>
    </WidgetFrame>
  );
}
