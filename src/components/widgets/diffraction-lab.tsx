"use client";
import { useState } from "react";
import { dc, Explain, Readouts, SimControls, useTicker, useToolUse } from "./sim-kit";
import { Slider, WidgetFrame } from "./widget-frame";

const C = "var(--t-waves)";

/**
 * Wavefronts pass through a single slit and spread out (diffraction). Change
 * the slit width and the wavelength: the narrower the slit compared with λ,
 * the more the waves spread. The screen shows the single-slit pattern with its
 * central bright band and dark minima at sin θ = mλ/a.
 */
export function DiffractionLab({ title = "Diffraction through a single slit" }: { title?: string }) {
  const [lam, setLam] = useState(20); // px (and "nm ×25" for the readout)
  const [a, setA] = useState(50); // slit width, px
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const touch = useToolUse();
  useTicker((dt) => setT((x) => x + dt), running);

  const barrier = 230;
  const cy = 150;
  const offset = ((t * 40) % lam + lam) % lam;
  const ratio = lam / a;
  const theta1 = ratio >= 1 ? 90 : (Math.asin(ratio) * 180) / Math.PI;
  const spread = Math.min(90, theta1 + 12);
  const arcs: number[] = [];
  for (let rr = offset; rr < 340; rr += lam) arcs.push(rr);
  const fronts: number[] = [];
  for (let x = barrier - offset; x > 0; x -= lam) fronts.push(x);
  const arc = (r: number) => {
    const th = (spread * Math.PI) / 180;
    const x1 = barrier + r * Math.cos(th), y1 = cy - r * Math.sin(th);
    const x2 = barrier + r * Math.cos(th), y2 = cy + r * Math.sin(th);
    return `M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 0,1 ${x2.toFixed(1)},${y2.toFixed(1)}`;
  };
  // Single-slit intensity on the screen (x = 560) as a function of the angle.
  const intensity = (th: number) => {
    const beta = (Math.PI * a * Math.sin(th)) / lam;
    return Math.abs(beta) < 1e-6 ? 1 : (Math.sin(beta) / beta) ** 2;
  };
  const screen = 540;
  const D = screen - barrier;
  const pattern = Array.from({ length: 121 }, (_, k) => {
    const y = k * 2.5;
    const th = Math.atan((y - cy) / D);
    return `${k ? "L" : "M"}${(screen + 4 + intensity(th) * 50).toFixed(1)},${y.toFixed(1)}`;
  }).join("");
  const ch = (fn: (n: number) => void) => (n: number) => { fn(n); touch(); };

  return (
    <WidgetFrame title={title} colour={C} instruction="Press Play to send the waves. Then make the slit narrower or the wavelength longer and compare how much the waves bend round the edges.">
      <svg viewBox="0 0 600 300" className="diagram rounded-xl border border-line bg-[#06213a]" role="img" aria-label={`Slit width ${a / 25} units, wavelength ${lam / 25} units: the waves spread through about ${dc(theta1, 0)} degrees to the first minimum`}>
        <defs><clipPath id="right-of-slit"><rect x={barrier} y="0" width={screen - barrier} height="300" /></clipPath></defs>
        {fronts.map((x) => <line key={x} x1={x} x2={x} y1="10" y2="290" stroke="#7dd3fc" strokeWidth="2.5" opacity="0.8" />)}
        <g clipPath="url(#right-of-slit)">{arcs.map((r) => <path key={r} d={arc(r)} fill="none" stroke="#7dd3fc" strokeWidth="2.5" opacity={Math.max(0.2, 1 - r / 380)} />)}</g>
        <rect x={barrier - 4} y="0" width="8" height={cy - a / 2} fill="#cbd5e1" />
        <rect x={barrier - 4} y={cy + a / 2} width="8" height={300 - cy - a / 2} fill="#cbd5e1" />
        <line x1={screen} x2={screen} y1="0" y2="300" stroke="#e2e8f0" strokeWidth="3" />
        <path d={pattern} fill="none" stroke="#fde047" strokeWidth="2.5" />
        {theta1 < 90 && [1, -1].map((sgn) => <line key={sgn} x1={barrier} y1={cy} x2={screen} y2={cy - sgn * D * Math.tan((theta1 * Math.PI) / 180)} stroke="#f472b6" strokeDasharray="5 5" />)}
        <text x="10" y="18" fontSize="11" fill="#bae6fd">plane wavefronts →</text>
        <text x={screen - 6} y="18" fontSize="11" textAnchor="end" fill="#fde68a">screen</text>
      </svg>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Slider label="Wavelength λ" value={lam} min={8} max={60} step={2} onChange={ch(setLam)} colour={C} format={(n) => dc(n / 25, 2)} />
        <Slider label="Slit width a" value={a} min={10} max={140} step={5} onChange={ch(setA)} colour="var(--t-mech)" format={(n) => dc(n / 25, 2)} />
      </div>
      <div className="mt-3"><SimControls running={running} colour={C} onToggle={() => { setRunning((r) => !r); touch(); }} /></div>
      <Readouts className="mt-3" colour={C} items={[
        { label: "λ / a", value: dc(ratio, 2), highlight: true },
        { label: "first dark band at", value: theta1 >= 90 ? "none – spreads everywhere" : `θ = ${dc(theta1, 1)}°` },
        { label: "degree of diffraction", value: ratio >= 1 ? "maximum" : ratio > 0.4 ? "large" : ratio > 0.15 ? "noticeable" : "small" },
      ]} />
      <Explain colour={C}>
        <strong>Huygens&apos; principle:</strong> every point on a wavefront acts as a source of new circular wavelets. At the slit only a few sources are left, so the waves <strong>spread out</strong> (diffract). The degree of diffraction is proportional to <strong>λ / a</strong>: narrow slit or long wavelength → more spreading. The screen shows a wide central bright band with dark bands where <strong>sin θ = mλ/a</strong> (m = 1, 2, 3…).
      </Explain>
    </WidgetFrame>
  );
}
