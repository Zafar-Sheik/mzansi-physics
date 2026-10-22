"use client";
import { useState } from "react";
import { Curve, Dot, Plot } from "@/components/sci/plot";
import { sciTex } from "@/lib/sci/numbers";
import { Tex } from "@/components/learn/tex";
import { Arrow, dc, Explain, Readouts, useToolUse } from "./sim-kit";
import { Segmented, Slider, WidgetFrame } from "./widget-frame";

const G = 6.67e-11;
const ME = 5.98e24;
const RE = 6.38e6;
const C = "var(--t-mech)";

/**
 * Newton's law of universal gravitation in two views: two bodies with an
 * adjustable distance (inverse-square law, equal and opposite forces), and
 * "you vs the Earth" – your weight as you rise above the surface.
 */
export function GravityLab({ title = "Universal gravitation" }: { title?: string }) {
  const [mode, setMode] = useState<"bodies" | "earth">("bodies");
  const [m1, setM1] = useState(6);
  const [m2, setM2] = useState(2);
  const [r, setR] = useState(2);
  const [you, setYou] = useState(60);
  const [alt, setAlt] = useState(0); // km
  const touch = useToolUse();

  // "bodies": masses in units of 10^24 kg, distance in units of 10^8 m
  const F = (G * m1 * 1e24 * m2 * 1e24) / (r * 1e8) ** 2;
  const F1 = (G * m1 * 1e24 * m2 * 1e24) / (1e8) ** 2;
  const rr = RE + alt * 1000;
  const gh = (G * ME) / rr ** 2;
  const ch = (fn: (n: number) => void) => (n: number) => { fn(n); touch(); };

  return (
    <WidgetFrame title={title} colour={C} instruction="Every mass attracts every other mass. Change the masses and the distance between their centres.">
      <Segmented colour={C} value={mode} onChange={(m) => { setMode(m); touch(); }} options={[{ id: "bodies", label: "Two bodies" }, { id: "earth", label: "You and the Earth" }]} />
      {mode === "bodies" ? (
        <>
          <svg viewBox="0 0 600 170" className="diagram mt-3 rounded-xl border border-line bg-[#0b1020]" role="img" aria-label={`Two bodies ${dc(r, 1)} times ten to the eight metres apart attract with ${sciTex(F)} newtons`}>
            {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 97) % 600} cy={(i * 53) % 170} r="1" fill="white" opacity="0.5" />)}
            {(() => {
              const a = 300 - r * 50, b = 300 + r * 50;
              const ra = 10 + m1 * 2.4, rb = 10 + m2 * 2.4;
              const len = Math.min(110, 18 + Math.log10(F / F1 * 100 + 1) * 40);
              return (
                <g>
                  <line x1={a} x2={b} y1="120" y2="120" stroke="#94a3b8" strokeDasharray="4 4" />
                  <text x="300" y="140" textAnchor="middle" fontSize="12" fill="#cbd5e1">r = {dc(r, 1)} × 10⁸ m</text>
                  <circle cx={a} cy="70" r={ra} fill="#3b82f6" /><circle cx={b} cy="70" r={rb} fill="#f59e0b" />
                  <text x={a} y={74} textAnchor="middle" fontSize="11" fontWeight="800" fill="white">m₁</text>
                  <text x={b} y={74} textAnchor="middle" fontSize="11" fontWeight="800" fill="white">m₂</text>
                  <Arrow x={a + ra} y={70} length={len} angle={0} colour="#f472b6" label="F" />
                  <Arrow x={b - rb} y={70} length={-len} angle={0} colour="#f472b6" label="F" />
                </g>
              );
            })()}
          </svg>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Slider label="m₁ (× 10²⁴ kg)" value={m1} min={1} max={10} step={1} onChange={ch(setM1)} colour="#3b82f6" />
            <Slider label="m₂ (× 10²⁴ kg)" value={m2} min={1} max={10} step={1} onChange={ch(setM2)} colour="#f59e0b" />
            <Slider label="distance r (× 10⁸ m)" value={r} min={0.5} max={5} step={0.5} onChange={ch(setR)} colour={C} format={(n) => dc(n, 1)} />
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_260px]">
            <div>
              <div className="rounded-xl bg-surface-2 p-3 text-center"><Tex display tex={`F = \\frac{Gm_1m_2}{r^2} = \\frac{(6{,}67\\times10^{-11})(${m1}\\times10^{24})(${m2}\\times10^{24})}{(${dc(r, 1)}\\times10^{8})^2} = ${sciTex(F)}\\ \\text{N}`} /></div>
              <Explain colour={C}>
                Double the distance and the force drops to <strong>¼</strong>; triple it and it drops to <strong>1/9</strong> – an <strong>inverse square law</strong>. Double one mass and the force doubles. The two forces are always <strong>equal and opposite</strong> (Newton&apos;s third law), even when one body is much bigger.
              </Explain>
            </div>
            <Plot view={{ xMin: 0, xMax: 5.2, yMin: 0, yMax: (G * m1 * m2 * 1e48) / (0.5e8) ** 2 / 1e20 * 1.05 }} width={260} height={200} label="Force against distance" xLabel="r" yLabel="F">
              <Curve f={(d) => (d < 0.45 ? NaN : (G * m1 * m2 * 1e48) / (d * 1e8) ** 2 / 1e20)} colour={C} />
              <Dot x={r} y={F / 1e20} colour={C} label="now" />
            </Plot>
          </div>
        </>
      ) : (
        <>
          <svg viewBox="0 0 600 200" className="diagram mt-3 rounded-xl border border-line bg-[#0b1020]" role="img" aria-label={`At ${alt} kilometres altitude, g is ${dc(gh, 2)} metres per second squared`}>
            <circle cx="140" cy="210" r="150" fill="#2563eb" /><path d="M40,120 q40,-30 80,0 t70,10" fill="#16a34a" opacity="0.8" />
            {(() => {
              const y = 60 - Math.min(40, alt / 250);
              return (
                <g>
                  <circle cx="380" cy={y + 60} r="8" fill="#fbbf24" />
                  <text x="395" y={y + 64} fontSize="12" fill="#e2e8f0">you ({you} kg)</text>
                  <Arrow x={380} y={y + 60} length={10 + gh * 6} angle={-90} colour="#f472b6" label="w" />
                  <text x="380" y="190" textAnchor="middle" fontSize="12" fill="#cbd5e1">{alt} km above the surface</text>
                </g>
              );
            })()}
          </svg>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Slider label="Your mass (kg)" value={you} min={30} max={120} step={5} onChange={ch(setYou)} colour={C} />
            <Slider label="Height above Earth's surface (km)" value={alt} min={0} max={20000} step={100} onChange={ch(setAlt)} colour={C} />
          </div>
          <Readouts className="mt-3" colour={C} items={[
            { label: "distance to Earth's centre", value: sciTex(rr), tex: true, unit: "m" },
            { label: "g = GM/r²", value: dc(gh, 2), unit: "m·s⁻²", highlight: true },
            { label: "your weight w = mg", value: dc(you * gh, 1), unit: "N" },
            { label: "your mass", value: String(you), unit: "kg" },
          ]} />
          <Explain colour={C}>
            Your <strong>mass</strong> never changes, but your <strong>weight</strong> (the gravitational force on you) gets smaller as you move away from the Earth&apos;s centre. At the surface g = 9,8 m·s⁻². The International Space Station orbits at about 400 km, where g is still about 8,7 m·s⁻² – astronauts float because they are in free fall, not because there is no gravity!
          </Explain>
        </>
      )}
    </WidgetFrame>
  );
}
