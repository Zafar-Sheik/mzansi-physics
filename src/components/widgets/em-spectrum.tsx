"use client";
import { useState } from "react";
import { sciTex } from "@/lib/sci/numbers";
import { Explain, Readouts, useToolUse } from "./sim-kit";
import { WidgetFrame } from "./widget-frame";

const C = "var(--t-waves)";
const h = 6.63e-34;
const c = 3e8;

/** Regions of the EM spectrum by wavelength (m), longest first. */
const BANDS = [
  { name: "Radio waves", from: 1e4, to: 1e-1, colour: "#64748b", use: "Radio and TV broadcasts, cellphones (lower bands), RFID tags.", danger: "Harmless in normal doses." },
  { name: "Microwaves", from: 1e-1, to: 1e-3, colour: "#0ea5e9", use: "Microwave ovens, Wi-Fi, Bluetooth, satellite TV, radar, cellphone signals.", danger: "Heats water in the body at high power." },
  { name: "Infrared", from: 1e-3, to: 7e-7, colour: "#ef4444", use: "TV remotes, night-vision and thermal cameras, heaters, fibre-optic data.", danger: "Burns at high intensity." },
  { name: "Visible light", from: 7e-7, to: 4e-7, colour: "url(#rainbow)", use: "Seeing! Photosynthesis, photography, lasers.", danger: "Very bright light can damage the eye." },
  { name: "Ultraviolet", from: 4e-7, to: 1e-8, colour: "#8b5cf6", use: "Sterilising water and tools, detecting forged banknotes, making vitamin D.", danger: "Sunburn, skin cancer and eye damage – wear sunscreen!" },
  { name: "X-rays", from: 1e-8, to: 1e-11, colour: "#14b8a6", use: "Medical X-rays, airport security scanners, studying crystals.", danger: "Ionising: can damage cells and DNA, so exposure is limited." },
  { name: "Gamma rays", from: 1e-11, to: 1e-14, colour: "#22c55e", use: "Killing cancer cells (radiotherapy), sterilising food and medical equipment.", danger: "Most penetrating and most ionising – very dangerous." },
];

/** Slider position 0..1 ↔ wavelength on a log scale from 10⁴ m to 10⁻¹⁴ m. */
const lamAt = (p: number) => 10 ** (4 - p * 18);

function visibleColour(lam: number) {
  const nm = lam * 1e9;
  const hue = nm >= 700 ? 0 : nm <= 400 ? 275 : ((700 - nm) / 300) * 275;
  return `hsl(${hue} 90% 55%)`;
}

/**
 * Slide along the electromagnetic spectrum from radio waves to gamma rays and
 * watch the wavelength shrink while the frequency and photon energy grow.
 */
export function EmSpectrum({ title = "The electromagnetic spectrum" }: { title?: string }) {
  const [p, setP] = useState(0.6);
  const touch = useToolUse();
  const lam = lamAt(p);
  const f = c / lam;
  const E = h * f;
  const band = BANDS.find((b) => lam <= b.from && lam > b.to) ?? BANDS[BANDS.length - 1];
  const W = 600;
  const xOf = (l: number) => ((4 - Math.log10(l)) / 18) * W;
  // Draw a wave whose on-screen wavelength shrinks with the real one (log-scaled for visibility).
  const shown = 14 + (1 - p) * 220;
  const wave = Array.from({ length: 301 }, (_, i) => { const x = (i / 300) * W; return `${i ? "L" : "M"}${x.toFixed(1)},${(45 + 28 * Math.sin((2 * Math.PI * x) / shown)).toFixed(1)}`; }).join("");
  const isVisible = band.name === "Visible light";

  return (
    <WidgetFrame title={title} colour={C} instruction="Drag the slider (or click a band). Same speed for all of them in a vacuum: c = 3 × 10⁸ m·s⁻¹.">
      <svg viewBox={`0 0 ${W} 150`} className="diagram rounded-xl border border-line bg-surface" role="img" aria-label={`${band.name}: wavelength ${lam.toExponential(1)} metres`}>
        <defs>
          <linearGradient id="rainbow" x1="0" x2="1">
            {["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#8b00ff"].map((col, i) => <stop key={col} offset={i / 5} stopColor={col} />)}
          </linearGradient>
        </defs>
        <path d={wave} fill="none" stroke={isVisible ? visibleColour(lam) : band.colour === "url(#rainbow)" ? "#f59e0b" : band.colour} strokeWidth="3" />
        {BANDS.map((b) => (
          <g key={b.name} className="cursor-pointer" onClick={() => { setP((4 - Math.log10(Math.sqrt(b.from * b.to))) / 18); touch(); }}>
            <rect x={xOf(b.from)} y="90" width={Math.max(4, xOf(b.to) - xOf(b.from))} height="26" fill={b.colour} opacity={b === band ? 1 : 0.55} />
            <text x={(xOf(b.from) + xOf(b.to)) / 2} y="132" textAnchor="middle" fontSize="10" fontWeight={b === band ? 800 : 500} fill="var(--text)">{b.name.split(" ")[0]}</text>
          </g>
        ))}
        <line x1={p * W} x2={p * W} y1="84" y2="122" stroke="var(--text)" strokeWidth="3" />
        <text x="4" y="146" fontSize="9" className="muted">long λ, low f, low energy</text>
        <text x={W - 4} y="146" textAnchor="end" fontSize="9" className="muted">short λ, high f, high energy</text>
      </svg>
      <input type="range" min={0} max={1} step={0.002} value={p} onChange={(e) => { setP(Number(e.target.value)); touch(); }} className="mt-2 w-full" style={{ accentColor: "var(--t-waves)" }} aria-label="Position on the electromagnetic spectrum" />
      <Readouts className="mt-3" colour={C} items={[
        { label: "region", value: band.name, highlight: true },
        { label: "wavelength λ", value: sciTex(lam, 2), tex: true, unit: "m" },
        { label: "frequency f = c/λ", value: sciTex(f, 2), tex: true, unit: "Hz" },
        { label: "photon energy E = hf", value: sciTex(E, 2), tex: true, unit: "J" },
      ]} />
      <Explain colour={C}>
        <strong>{band.name}.</strong> Uses: {band.use} <span className="text-muted">Safety: {band.danger}</span>
        <br />Light behaves like a wave <em>and</em> like a stream of energy packets called <strong>photons</strong>. A photon&apos;s energy is <strong>E = hf</strong>: the higher the frequency, the more energetic – and more penetrating – the radiation.
      </Explain>
    </WidgetFrame>
  );
}
