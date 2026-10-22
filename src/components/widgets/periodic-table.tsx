"use client";
import { useState } from "react";
import { blockOf, configText, ELEMENTS, IONISATION, RADIUS, stateAtRoomTemp, type Element } from "@/lib/sci/chem";
import { cn } from "@/lib/utils";
import { Explain, Readouts, useToolUse } from "./sim-kit";
import { Segmented, WidgetFrame } from "./widget-frame";

const C = "var(--t-matter)";
type View = "category" | "en" | "ie" | "radius" | "metal" | "block" | "state";

export const CATEGORY_COLOURS: Record<string, string> = {
  alkali: "#f97316", "alkaline-earth": "#eab308", transition: "#94a3b8", "post-transition": "#14b8a6", metalloid: "#22c55e",
  nonmetal: "#3b82f6", halogen: "#a855f7", noble: "#ec4899", lanthanide: "#d97706", actinide: "#dc2626",
};
const CATEGORY_NAMES: Record<string, string> = {
  alkali: "Alkali metals", "alkaline-earth": "Alkaline earth metals", transition: "Transition metals", "post-transition": "Other metals", metalloid: "Metalloids",
  nonmetal: "Non-metals", halogen: "Halogens", noble: "Noble gases", lanthanide: "Lanthanides", actinide: "Actinides",
};

const heat = (v: number, lo: number, hi: number) => `hsl(${220 - Math.max(0, Math.min(1, (v - lo) / (hi - lo))) * 220} 80% 55%)`;

function colourFor(e: Element, view: View): string {
  switch (view) {
    case "category": return CATEGORY_COLOURS[e.category];
    case "en": return e.en === null ? "var(--surface-2)" : heat(e.en, 0.7, 4);
    case "ie": return e.z <= IONISATION.length ? heat(IONISATION[e.z - 1], 370, 2400) : "var(--surface-2)";
    case "radius": return e.z <= RADIUS.length ? heat(RADIUS[e.z - 1], 25, 250) : "var(--surface-2)";
    case "metal": return e.category === "metalloid" ? "#22c55e" : ["nonmetal", "halogen", "noble"].includes(e.category) ? "#3b82f6" : "#94a3b8";
    case "block": return { s: "#f97316", p: "#3b82f6", d: "#94a3b8", f: "#d97706" }[blockOf(e)];
    case "state": return { gas: "#38bdf8", liquid: "#a78bfa", solid: "#94a3b8" }[stateAtRoomTemp(e.symbol)];
  }
}

const VIEW_TEXT: Record<View, string> = {
  category: "Elements in the same group have the same number of valence electrons, so they react in similar ways.",
  en: "Electronegativity INCREASES across a period (more protons pull harder on the bonding electrons) and DECREASES down a group (the electrons are further away). Fluorine is the most electronegative element.",
  ie: "First ionisation energy – the energy to remove the first electron – INCREASES across a period and DECREASES down a group. Noble gases are hardest to ionise; alkali metals the easiest. (Grey = not shown.)",
  radius: "Atomic radius DECREASES across a period (more protons pull the same shell in tighter) and INCREASES down a group (more energy levels). (Grey = not shown.)",
  metal: "Metals (grey) on the left, non-metals (blue) on the right, and the metalloids (green) on the staircase between them.",
  block: "The block tells you which sub-level the last electron goes into: s (orange), p (blue), d (grey) and f (gold).",
  state: "At room temperature most elements are solids (grey). Eleven are gases (light blue) and only two – bromine and mercury – are liquids (purple).",
};

/**
 * An interactive periodic table: colour it by category or by a trend
 * (electronegativity, ionisation energy, atomic radius), and click any element
 * for its data and electron configuration.
 */
export function PeriodicTable({ title = "Interactive periodic table", view: startView = "category" }: { title?: string; view?: View }) {
  const [view, setView] = useState<View>(startView);
  const [sel, setSel] = useState<Element>(ELEMENTS[5]);
  const touch = useToolUse();
  return (
    <WidgetFrame title={title} colour={C} instruction="Click an element. Change the colouring to see the trends across periods and down groups.">
      <Segmented colour={C} value={view} onChange={(v) => { setView(v); touch(); }} options={[
        { id: "category", label: "Families" }, { id: "metal", label: "Metals / non-metals" }, { id: "en", label: "Electronegativity" },
        { id: "ie", label: "Ionisation energy" }, { id: "radius", label: "Atomic radius" }, { id: "block", label: "s, p, d, f blocks" }, { id: "state", label: "State at 25 °C" },
      ]} />
      <div className="mt-3 overflow-x-auto pb-1">
        <div className="grid min-w-[720px] gap-[2px]" style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }} role="grid" aria-label="Periodic table">
          {ELEMENTS.map((e) => (
            <button key={e.z} onClick={() => { setSel(e); touch(); }} aria-pressed={sel.z === e.z} title={e.name}
              className={cn("rounded-[5px] px-0.5 py-1 text-center leading-none transition hover:scale-110 hover:shadow-lg", sel.z === e.z && "ring-2 ring-fg")}
              style={{ gridColumn: e.col, gridRow: e.row, background: `color-mix(in oklab, ${colourFor(e, view)} 70%, var(--surface))`, marginTop: e.row === 9 ? 8 : 0 }}>
              <span className="block text-[8px] opacity-70">{e.z}</span>
              <span className="block text-[13px] font-bold">{e.symbol}</span>
            </button>
          ))}
        </div>
      </div>
      {view === "category" && (
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {Object.entries(CATEGORY_NAMES).map(([k, v]) => <span key={k} className="flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ background: CATEGORY_COLOURS[k] }} />{v}</span>)}
        </div>
      )}
      {["en", "ie", "radius"].includes(view) && <div className="mt-2 flex items-center gap-2 text-xs"><span>low</span><span className="h-3 w-40 rounded" style={{ background: "linear-gradient(90deg, hsl(220 80% 55%), hsl(110 80% 55%), hsl(0 80% 55%))" }} /><span>high</span></div>}
      <div className="mt-3 grid gap-3 md:grid-cols-[120px_minmax(0,1fr)]">
        <div className="grid h-28 place-items-center rounded-2xl text-white" style={{ background: CATEGORY_COLOURS[sel.category] }}>
          <div className="text-center"><div className="text-sm">{sel.z}</div><div className="font-display text-4xl font-bold">{sel.symbol}</div><div className="text-xs">{sel.mass}</div></div>
        </div>
        <Readouts colour={C} items={[
          { label: "name", value: sel.name, highlight: true },
          { label: "group · period", value: `${sel.group} · ${sel.period}` },
          { label: "family", value: CATEGORY_NAMES[sel.category] },
          { label: "molar mass", value: String(sel.mass), unit: "g·mol⁻¹" },
          { label: "electronegativity", value: sel.en === null ? "–" : String(sel.en).replace(".", ",") },
          { label: "1st ionisation energy", value: sel.z <= IONISATION.length ? String(IONISATION[sel.z - 1]) : "–", unit: sel.z <= IONISATION.length ? "kJ·mol⁻¹" : undefined },
          { label: "atomic radius", value: sel.z <= RADIUS.length ? String(RADIUS[sel.z - 1]) : "–", unit: sel.z <= RADIUS.length ? "pm" : undefined },
          { label: "state at 25 °C", value: stateAtRoomTemp(sel.symbol) },
          { label: "electron configuration", value: sel.z <= 36 ? configText(sel.z) : "beyond Grade 10" },
        ]} />
      </div>
      <Explain colour={C}>{VIEW_TEXT[view]}</Explain>
    </WidgetFrame>
  );
}
