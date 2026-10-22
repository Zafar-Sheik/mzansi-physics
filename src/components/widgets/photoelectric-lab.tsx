"use client";
import { useRef, useState } from "react";
import { Curve, Dot, Guide, Plot } from "@/components/sci/plot";
import { sciTex } from "@/lib/sci/numbers";
import { dc, Explain, Readouts, SimControls, useTicker, useToolUse } from "./sim-kit";
import { Segmented, Slider, WidgetFrame } from "./widget-frame";

const C = "var(--t-matter)";
const h = 6.63e-34;
const c = 3e8;
const eV = 1.6e-19;
const me = 9.11e-31;
const METALS = [
  { name: "Caesium", W: 2.14 },
  { name: "Sodium", W: 2.28 },
  { name: "Calcium", W: 2.9 },
  { name: "Zinc", W: 4.3 },
  { name: "Platinum", W: 6.35 },
];

function colourOf(nm: number) {
  if (nm < 380) return "#a78bfa";
  if (nm > 700) return "#7f1d1d";
  const hue = ((700 - nm) / 320) * 275;
  return `hsl(${hue} 95% 55%)`;
}

/** Hydrogen energy levels Eₙ = −13,6/n² eV. */
const En = (n: number) => -13.6 / (n * n);

/**
 * The photoelectric effect: shine light on a metal and see whether electrons
 * escape. Frequency (colour) decides IF they escape and how fast; intensity
 * only decides HOW MANY. Plus atomic spectra: click an electron jump in
 * hydrogen to see the photon it emits or absorbs.
 */
export function PhotoelectricLab({ title = "Photoelectric effect & spectra", mode: startMode = "photo" }: { title?: string; mode?: "photo" | "spectra" }) {
  const [mode, setMode] = useState(startMode);
  const [nm, setNm] = useState(400);
  const [intensity, setIntensity] = useState(5);
  const [metal, setMetal] = useState(1);
  const [running, setRunning] = useState(false);
  const [jump, setJump] = useState<[number, number]>([3, 2]);
  const [absorb, setAbsorb] = useState(false);
  const electrons = useRef<{ x: number; y: number; vx: number; vy: number }[]>([]);
  const [, force] = useState(0);
  const touch = useToolUse();

  const f = c / (nm * 1e-9);
  const E = h * f;
  const W0 = METALS[metal].W * eV;
  const f0 = W0 / h;
  const Ek = E - W0;
  const emits = Ek > 0;
  const vmax = emits ? Math.sqrt((2 * Ek) / me) : 0;

  useTicker((dt) => {
    const list = electrons.current;
    if (emits && Math.random() < intensity * dt * 3) {
      const a = (-30 - Math.random() * 120) * (Math.PI / 180);
      const sp = 40 + (vmax / 1.5e6) * 160 * (0.6 + Math.random() * 0.4);
      list.push({ x: 120 + Math.random() * 280, y: 200, vx: sp * Math.cos(a) * 0.4, vy: sp * Math.sin(a) });
    }
    for (const el of list) { el.x += el.vx * dt; el.y += el.vy * dt; }
    electrons.current = list.filter((el) => el.y > -10 && el.x > -10 && el.x < 530).slice(-80);
    force((n) => n + 1);
  }, running && mode === "photo");

  const [hi, lo] = jump[0] > jump[1] ? jump : [jump[1], jump[0]];
  const dE = (En(lo) - En(hi)) * -1; // positive eV
  const lam = (h * c) / (dE * eV) * 1e9;
  const region = lam < 380 ? "ultraviolet" : lam > 700 ? "infrared" : "visible";

  return (
    <WidgetFrame title={title} colour={C} instruction={mode === "photo" ? "Choose a metal, set the colour (wavelength) and brightness of the light, and press Play." : "Click two energy levels to make an electron jump between them."}>
      <Segmented colour={C} value={mode} onChange={(m) => { setMode(m); touch(); }} options={[{ id: "photo", label: "Photoelectric effect" }, { id: "spectra", label: "Emission & absorption spectra" }]} />
      {mode === "photo" ? (
        <>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {METALS.map((m2, i) => <button key={m2.name} onClick={() => { setMetal(i); electrons.current = []; touch(); }} aria-pressed={metal === i} className={`rounded-lg border px-2 py-0.5 text-xs font-semibold ${metal === i ? "border-matter bg-matter text-white" : "border-line text-muted"}`}>{m2.name} ({dc(m2.W, 2)} eV)</button>)}
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
            <svg viewBox="0 0 520 240" className="diagram rounded-xl border border-line bg-[#0b1020]" role="img" aria-label={emits ? `Electrons are ejected with maximum kinetic energy ${sciTex(Ek, 2)} joules` : "No electrons are ejected: the photons do not have enough energy"}>
              {Array.from({ length: Math.max(1, intensity) }, (_, i) => (
                <line key={i} x1={20 + i * 18} y1="10" x2={140 + i * 26} y2="196" stroke={colourOf(nm)} strokeWidth="3" opacity={0.25 + intensity / 20} strokeDasharray="10 8" />
              ))}
              <rect x="100" y="200" width="320" height="26" rx="4" fill="#94a3b8" />
              <text x="260" y="218" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0f172a">{METALS[metal].name} plate</text>
              {electrons.current.map((el, i) => <circle key={i} cx={el.x} cy={el.y} r="4" fill="#60a5fa" />)}
              {!emits && <text x="260" y="110" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fca5a5">No electrons – photon energy too small</text>}
            </svg>
            <Plot view={{ xMin: 0, xMax: 2.2e15 / 1e15, yMin: -7, yMax: 8 }} width={260} height={220} label="Maximum kinetic energy against frequency" xLabel="f (×10¹⁵ Hz)" yLabel="Eₖ (eV)">
              <Curve f={(x) => (x * 1e15 * h) / eV - METALS[metal].W} colour="var(--curve-ghost)" dashed />
              <Curve f={(x) => (x * 1e15 * h) / eV - METALS[metal].W} from={f0 / 1e15} colour={C} />
              <Guide x={f0 / 1e15} label="f₀" />
              <Dot x={f / 1e15} y={Math.max(Ek / eV, 0)} colour={emits ? C : "var(--danger)"} label={emits ? "now" : "none"} />
            </Plot>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Slider label="Wavelength of the light (nm)" value={nm} min={120} max={750} step={10} onChange={(n) => { setNm(n); touch(); }} colour={colourOf(nm)} />
            <Slider label="Intensity (brightness)" value={intensity} min={1} max={10} step={1} onChange={(n) => { setIntensity(n); touch(); }} colour="#facc15" />
          </div>
          <div className="mt-3"><SimControls running={running} colour={C} onToggle={() => { setRunning((r) => !r); touch(); }} onReset={() => { electrons.current = []; setRunning(false); }} /></div>
          <Readouts className="mt-3" colour={C} items={[
            { label: "photon energy E = hf", value: `${sciTex(E, 3)}\\ \\text{J} = ${dc(E / eV, 2)}\\ \\text{eV}`, tex: true },
            { label: "work function W₀", value: `${sciTex(W0, 3)}\\ \\text{J}`, tex: true },
            { label: "threshold frequency f₀ = W₀/h", value: sciTex(f0, 3), tex: true, unit: "Hz" },
            { label: "E_k(max) = E − W₀", value: emits ? sciTex(Ek, 3) : "0", tex: true, unit: "J", highlight: true },
            { label: "fastest electron", value: emits ? sciTex(vmax, 3) : "0", tex: true, unit: "m·s⁻¹" },
          ]} />
          <Explain colour={C}>
            {emits
              ? <>Each photon has more energy than the work function, so it can knock one electron out: <strong>E = W₀ + E_k(max)</strong>. Brighter light means <strong>more photons</strong>, so more electrons – but not faster ones. Only a higher frequency makes them faster.</>
              : <>Each photon carries only E = hf = {dc(E / eV, 2)} eV, less than the work function ({dc(METALS[metal].W, 2)} eV). However bright you make the light, <strong>no electrons escape</strong> – one photon gives its energy to one electron. This proves light behaves as <strong>particles</strong> (photons), which the wave model can&apos;t explain.</>}
          </Explain>
        </>
      ) : (
        <>
          <div className="mt-3 grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
            <svg viewBox="0 0 260 300" className="diagram rounded-xl border border-line bg-surface" role="img" aria-label="Energy levels of hydrogen">
              {[1, 2, 3, 4, 5, 6].map((n) => {
                const y = 280 + (En(n) / 13.6) * 260;
                const on = jump.includes(n);
                return (
                  <g key={n} className="cursor-pointer" onClick={() => { setJump(([a]) => (a === n ? [a, a === 1 ? 2 : 1] : [n, a])); touch(); }}>
                    <rect x="20" y={y - 7} width="220" height="14" fill="transparent" />
                    <line x1="40" x2="200" y1={y} y2={y} stroke={on ? C : "var(--text-muted)"} strokeWidth={on ? 4 : 2} />
                    <text x="34" y={y + 4} textAnchor="end" fontSize="11" fontWeight="700" fill="var(--text)">n={n}</text>
                    <text x="206" y={y + 4} fontSize="10" className="muted">{dc(En(n), 2)} eV</text>
                  </g>
                );
              })}
              {(() => {
                const y1 = 280 + (En(hi) / 13.6) * 260, y2 = 280 + (En(lo) / 13.6) * 260;
                return <line x1="120" x2="120" y1={absorb ? y2 : y1} y2={absorb ? y1 : y2} stroke={colourOf(lam)} strokeWidth="4" markerEnd="" />;
              })()}
            </svg>
            <div>
              <Segmented colour={C} value={absorb ? "abs" : "em"} onChange={(v) => { setAbsorb(v === "abs"); touch(); }} options={[{ id: "em", label: "Emission (electron drops)" }, { id: "abs", label: "Absorption (electron jumps up)" }]} />
              <div className="mt-3 h-14 overflow-hidden rounded-xl border border-line" style={{ background: absorb ? "linear-gradient(90deg,#8b00ff,#0000ff,#00ff00,#ffff00,#ff7f00,#ff0000)" : "#000" }} aria-label={`${absorb ? "Absorption" : "Emission"} spectrum line at ${dc(lam, 0)} nanometres`}>
                {region === "visible" && <div className="h-full w-1.5" style={{ marginLeft: `${((lam - 380) / 320) * 100}%`, background: absorb ? "#000" : colourOf(lam) }} />}
              </div>
              <div className="mt-1 flex justify-between text-xs text-muted"><span>380 nm</span><span>700 nm</span></div>
              <Readouts className="mt-3" colour={C} items={[
                { label: "jump", value: `n=${absorb ? lo : hi} → n=${absorb ? hi : lo}` },
                { label: "photon energy ΔE", value: `${dc(dE, 2)}\\ \\text{eV} = ${sciTex(dE * eV, 3)}\\ \\text{J}`, tex: true },
                { label: "wavelength λ = hc/ΔE", value: dc(lam, 0), unit: "nm", highlight: true },
                { label: "region", value: region },
              ]} />
            </div>
          </div>
          <Explain colour={C}>
            Electrons in an atom can only have certain <strong>energy levels</strong>. When an electron <strong>drops</strong> to a lower level the atom <strong>emits</strong> a photon with exactly the energy difference (E = hf = hc/λ) – a bright line in an <strong>emission spectrum</strong>. When white light passes through a cool gas, electrons <strong>absorb</strong> those same photons to jump up, leaving dark lines in an <strong>absorption spectrum</strong>. Every element has its own pattern of lines – a fingerprint astronomers use to find out what stars are made of.
          </Explain>
        </>
      )}
    </WidgetFrame>
  );
}
