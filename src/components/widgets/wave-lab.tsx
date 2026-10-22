"use client";
import { useState } from "react";
import { dc, Explain, Readouts, SimControls, useTicker, useToolUse } from "./sim-kit";
import { Segmented, Slider, Toggle, WidgetFrame } from "./widget-frame";

const C = "var(--t-waves)";
type Mode = "transverse" | "longitudinal";

/**
 * A wave machine. Transverse: particles move up and down while the wave moves
 * along. Longitudinal: particles move back and forth, making compressions and
 * rarefactions. Change amplitude, frequency and wavelength and check v = fλ.
 */
export function WaveLab({ title = "Wave machine", mode: startMode = "transverse" }: { title?: string; mode?: Mode }) {
  const [mode, setMode] = useState<Mode>(startMode);
  const [A, setA] = useState(30);
  const [f, setF] = useState(0.5);
  const [lam, setLam] = useState(2);
  const [labels, setLabels] = useState(true);
  const [lock, setLock] = useState(false);
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(0);
  const touch = useToolUse();
  useTicker((dt) => setT((x) => x + dt), running);

  const v = f * lam;
  const T = 1 / f;
  const W = 600;
  const pxPerM = 100; // 6 m of rope on screen
  const k = (2 * Math.PI) / lam;
  const w = 2 * Math.PI * f;
  const phase = (xm: number) => k * xm - w * t;
  const yOf = (xm: number) => A * Math.sin(phase(xm));
  const ch = (fn: (n: number) => void) => (n: number) => { fn(n); touch(); };

  const crestX = (((Math.PI / 2 + w * t) / k) % lam + lam) % lam; // first crest position (m)
  const crests: number[] = [];
  for (let c = crestX; c < 6; c += lam) crests.push(c);
  const marked = 1.5; // the red particle, 1,5 m from the left

  return (
    <WidgetFrame title={title} colour={C} instruction="Press Play. Follow the red particle: it only moves around its own spot – the energy moves along, the medium doesn't.">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented colour={C} value={mode} onChange={(m) => { setMode(m); touch(); }} options={[{ id: "transverse", label: "Transverse (rope)" }, { id: "longitudinal", label: "Longitudinal (slinky / sound)" }]} />
        <Toggle on={labels} onChange={setLabels}>Labels</Toggle>
        <Toggle on={lock} onChange={setLock}>Same medium (fixed speed)</Toggle>
      </div>
      <svg viewBox={`0 0 ${W} 200`} className="diagram mt-3 rounded-xl border border-line bg-surface" role="img"
        aria-label={`${mode} wave, amplitude ${A / 10} centimetres-units, frequency ${dc(f, 2)} hertz, wavelength ${dc(lam, 1)} metres, speed ${dc(v, 2)} metres per second`}>
        <line x1="0" x2={W} y1="100" y2="100" stroke="var(--graph-grid)" strokeDasharray="4 4" />
        {mode === "transverse" ? (
          <>
            <path d={Array.from({ length: 241 }, (_, i) => { const xm = (i / 240) * 6; return `${i ? "L" : "M"}${(xm * pxPerM).toFixed(1)},${(100 - yOf(xm)).toFixed(1)}`; }).join("")} fill="none" stroke={C} strokeWidth="3.5" />
            {Array.from({ length: 25 }, (_, i) => i * 0.25).map((xm) => <circle key={xm} cx={xm * pxPerM} cy={100 - yOf(xm)} r={xm === marked ? 7 : 3.5} fill={xm === marked ? "var(--danger)" : C} />)}
            {labels && crests.slice(0, 2).map((c, i) => <text key={i} x={c * pxPerM} y={100 - A - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text-muted)">crest</text>)}
            {labels && crests.slice(0, 2).map((c, i) => c + lam / 2 < 6 && <text key={`t${i}`} x={(c + lam / 2) * pxPerM} y={100 + A + 18} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text-muted)">trough</text>)}
            {labels && crests.length > 1 && (
              <g>
                <line x1={crests[0] * pxPerM} x2={crests[1] * pxPerM} y1={100 - A - 26} y2={100 - A - 26} stroke="var(--t-change)" strokeWidth="2" markerEnd="" />
                <text x={((crests[0] + crests[1]) / 2) * pxPerM} y={100 - A - 31} textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--t-change)">λ = {dc(lam, 1)} m</text>
              </g>
            )}
            {labels && <g><line x1="585" x2="585" y1="100" y2={100 - A} stroke="var(--t-mech)" strokeWidth="2" /><text x="580" y={100 - A / 2} textAnchor="end" fontSize="11" fontWeight="700" fill="var(--t-mech)">A</text></g>}
          </>
        ) : (
          <>
            {Array.from({ length: 61 }, (_, i) => i * 0.1).map((xm) => {
              const dx = (A / 60) * 0.35 * Math.sin(phase(xm));
              const x = (xm + dx) * pxPerM;
              return <line key={xm} x1={x} x2={x} y1="45" y2="155" stroke={Math.abs(xm - marked) < 0.01 ? "var(--danger)" : C} strokeWidth={Math.abs(xm - marked) < 0.01 ? 4 : 2.5} />;
            })}
            {labels && crests.slice(0, 2).map((c, i) => {
              // Compressions sit where the displacement gradient is most negative: a quarter wavelength after a crest of displacement.
              const comp = c + lam / 4 < 6 ? c + lam / 4 : c - (3 * lam) / 4;
              const rare = comp + lam / 2;
              return (
                <g key={i}>
                  {comp > 0 && <text x={comp * pxPerM} y="30" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--t-change)">compression</text>}
                  {rare < 6 && <text x={rare * pxPerM} y="180" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text-muted)">rarefaction</text>}
                </g>
              );
            })}
          </>
        )}
        <text x="8" y="16" fontSize="11" fill="var(--text-muted)">wave travels →</text>
      </svg>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Slider label="Amplitude" value={A} min={5} max={60} step={5} onChange={ch(setA)} colour="var(--t-mech)" format={(n) => `${n / 10} cm`} />
        <Slider label="Frequency f (Hz)" value={f} min={0.1} max={2} step={0.1} onChange={ch((n) => { if (lock) setLam(Math.min(8, v / n)); setF(n); })} colour={C} format={(n) => dc(n, 1)} />
        <Slider label="Wavelength λ (m)" value={lam} min={0.25} max={8} step={0.25} onChange={ch((n) => { if (lock) setF(Math.max(0.05, v / n)); setLam(n); })} colour="var(--t-change)" format={(n) => dc(n, 2)} />
      </div>
      <div className="mt-3"><SimControls running={running} colour={C} onToggle={() => { setRunning((r) => !r); touch(); }} onReset={() => { setT(0); setRunning(false); }}>
        <span className="text-xs text-muted">(slowed down so you can see it)</span>
      </SimControls></div>
      <Readouts className="mt-3" colour={C} items={[
        { label: "frequency f", value: dc(f, 2), unit: "Hz" },
        { label: "period T = 1/f", value: dc(T, 2), unit: "s" },
        { label: "wavelength λ", value: dc(lam, 2), unit: "m" },
        { label: "wave speed v = fλ", value: dc(v, 2), unit: "m·s⁻¹", highlight: true },
        { label: "amplitude", value: dc(A / 10, 1), unit: "cm" },
      ]} />
      <Explain colour={C}>
        {mode === "transverse"
          ? <>In a <strong>transverse</strong> wave the particles move <strong>perpendicular</strong> to the direction the wave travels. The distance between two crests is one <strong>wavelength</strong>. Amplitude changes the energy, not the speed.</>
          : <>In a <strong>longitudinal</strong> wave (like sound) the particles move <strong>parallel</strong> to the direction the wave travels, making <strong>compressions</strong> (particles squashed together) and <strong>rarefactions</strong> (spread out). The distance between two compressions is one wavelength.</>}
        {" "}{lock ? "The speed is fixed by the medium, so doubling the frequency halves the wavelength – that's v = fλ." : "Switch on “Same medium” to keep the speed fixed – then f and λ are inversely proportional."}
      </Explain>
    </WidgetFrame>
  );
}
