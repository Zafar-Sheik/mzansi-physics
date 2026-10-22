"use client";
import { useState } from "react";
import { sciTex } from "@/lib/sci/numbers";
import { Arrow, dc, Explain, Readouts, useToolUse } from "./sim-kit";
import { Slider, WidgetFrame } from "./widget-frame";

const C = "var(--t-waves)";
const MEDIA = [
  { name: "Air", n: 1.0, fill: "transparent" },
  { name: "Water", n: 1.33, fill: "#38bdf8" },
  { name: "Perspex", n: 1.49, fill: "#a5f3fc" },
  { name: "Glass", n: 1.5, fill: "#99f6e4" },
  { name: "Diamond", n: 2.42, fill: "#e0e7ff" },
];
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/**
 * Shine a ray from one medium into another. Snell's law gives the angle of
 * refraction; past the critical angle the light can't get out and reflects
 * totally (total internal reflection – how optical fibres work).
 */
export function RefractionLab({ title = "Refraction & total internal reflection", top = 0, bottom = 3 }: { title?: string; top?: number; bottom?: number }) {
  const [m1, setM1] = useState(top);
  const [m2, setM2] = useState(bottom);
  const [i, setI] = useState(40);
  const touch = useToolUse();
  const n1 = MEDIA[m1].n;
  const n2 = MEDIA[m2].n;
  const s = (n1 / n2) * Math.sin(rad(i));
  const tir = s > 1;
  const r = tir ? null : deg(Math.asin(s));
  const crit = n1 > n2 ? deg(Math.asin(n2 / n1)) : null;
  const O = { x: 300, y: 150 };
  const L = 140;
  const inc = { x: O.x - L * Math.sin(rad(i)), y: O.y - L * Math.cos(rad(i)) };
  const refl = { x: O.x + L * Math.sin(rad(i)), y: O.y - L * Math.cos(rad(i)) };
  const refr = r === null ? null : { x: O.x + L * Math.sin(rad(r)), y: O.y + L * Math.cos(rad(r)) };
  // Fraction reflected rises towards the critical angle (a rough Fresnel-like cue).
  const reflectBrightness = tir ? 1 : 0.15 + 0.6 * (crit ? Math.max(0, i / crit) ** 6 : 0);
  const pick = (which: 1 | 2, k: number) => { if (which === 1) setM1(k); else setM2(k); touch(); };
  const bend = n2 > n1 ? "towards" : n2 < n1 ? "away from" : "neither towards nor away from";

  return (
    <WidgetFrame title={title} colour={C} instruction="Choose the two materials and change the angle of incidence. Angles are measured from the normal (the dashed line).">
      <div className="grid gap-2 sm:grid-cols-2">
        {([1, 2] as const).map((which) => (
          <div key={which} className="flex flex-wrap items-center gap-1.5 text-sm">
            <span className="font-semibold">{which === 1 ? "Light starts in:" : "Goes into:"}</span>
            {MEDIA.map((md, k) => (
              <button key={md.name} onClick={() => pick(which, k)} aria-pressed={(which === 1 ? m1 : m2) === k}
                className={`rounded-lg border px-2 py-0.5 text-xs font-semibold ${(which === 1 ? m1 : m2) === k ? "border-waves bg-waves text-white" : "border-line text-muted"}`}>{md.name}</button>
            ))}
          </div>
        ))}
      </div>
      <svg viewBox="0 0 600 300" className="diagram mt-3 rounded-xl border border-line bg-surface" role="img"
        aria-label={tir ? `Total internal reflection: angle of incidence ${i} degrees is bigger than the critical angle` : `Angle of incidence ${i} degrees, angle of refraction ${dc(r ?? 0, 1)} degrees`}>
        <rect x="0" y="0" width="600" height="150" fill={MEDIA[m1].fill} opacity="0.25" />
        <rect x="0" y="150" width="600" height="150" fill={MEDIA[m2].fill} opacity="0.35" />
        <text x="10" y="20" fontSize="13" fontWeight="700" fill="var(--text)">{MEDIA[m1].name} (n = {dc(n1, 2)})</text>
        <text x="10" y="290" fontSize="13" fontWeight="700" fill="var(--text)">{MEDIA[m2].name} (n = {dc(n2, 2)})</text>
        <line x1="0" x2="600" y1="150" y2="150" stroke="var(--graph-axis)" strokeWidth="2" />
        <line x1={O.x} x2={O.x} y1="10" y2="290" stroke="var(--text-muted)" strokeDasharray="6 5" />
        <text x={O.x + 6} y="22" fontSize="11" className="muted">normal</text>
        <line x1={inc.x} y1={inc.y} x2={O.x} y2={O.y} stroke="#f59e0b" strokeWidth="4" />
        <Arrow x={inc.x} y={inc.y} length={L * 0.6} angle={i - 90} colour="#f59e0b" width={4} />
        <line x1={O.x} y1={O.y} x2={refl.x} y2={refl.y} stroke="#f59e0b" strokeWidth={tir ? 4 : 2} opacity={reflectBrightness} />
        {refr && <line x1={O.x} y1={O.y} x2={refr.x} y2={refr.y} stroke="#f59e0b" strokeWidth="4" />}
        <path d={`M${O.x},${O.y - 50} A50,50 0 0,0 ${O.x - 50 * Math.sin(rad(i))},${O.y - 50 * Math.cos(rad(i))}`} fill="none" stroke="var(--t-mech)" strokeWidth="2" />
        <text x={O.x - 30 * Math.sin(rad(i / 2)) - 8} y={O.y - 62} fontSize="12" fontWeight="800" fill="var(--t-mech)" textAnchor="end">i = {i}°</text>
        {refr && r !== null && (
          <>
            <path d={`M${O.x},${O.y + 50} A50,50 0 0,0 ${O.x + 50 * Math.sin(rad(r))},${O.y + 50 * Math.cos(rad(r))}`} fill="none" stroke="var(--t-change)" strokeWidth="2" />
            <text x={O.x + 10} y={O.y + 72} fontSize="12" fontWeight="800" fill="var(--t-change)">r = {dc(r, 1)}°</text>
          </>
        )}
        {tir && <text x="300" y="215" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--danger)">TOTAL INTERNAL REFLECTION</text>}
      </svg>
      <div className="mt-3"><Slider label="Angle of incidence i (°)" value={i} min={0} max={89} step={1} onChange={(n) => { setI(n); touch(); }} colour={C} /></div>
      <Readouts className="mt-3" colour={C} items={[
        { label: "n₁ sin i", value: dc(n1 * Math.sin(rad(i)), 3) },
        { label: "angle of refraction r", value: r === null ? "none" : `${dc(r, 1)}°`, highlight: true },
        { label: "critical angle", value: crit === null ? "none (n₁ ≤ n₂)" : `${dc(crit, 1)}°` },
        { label: `speed in ${MEDIA[m1].name.toLowerCase()}`, value: sciTex(3e8 / n1, 3), tex: true, unit: "m·s⁻¹" },
        { label: `speed in ${MEDIA[m2].name.toLowerCase()}`, value: sciTex(3e8 / n2, 3), tex: true, unit: "m·s⁻¹" },
      ]} />
      <Explain colour={C}>
        {tir
          ? <>The angle of incidence ({i}°) is bigger than the critical angle ({dc(crit ?? 0, 1)}°), so no light leaves {MEDIA[m1].name.toLowerCase()}: it is <strong>totally internally reflected</strong>. This needs light going from a <strong>more</strong> optically dense medium to a <strong>less</strong> dense one. Optical fibres and the sparkle of diamonds work this way.</>
          : <>Snell&apos;s law: <strong>n₁ sin θ₁ = n₂ sin θ₂</strong>. Going from {MEDIA[m1].name.toLowerCase()} into {MEDIA[m2].name.toLowerCase()} the light {n2 === n1 ? "doesn't bend" : n2 > n1 ? "slows down" : "speeds up"} and bends <strong>{bend}</strong> the normal.{crit !== null && ` Keep increasing i: at ${dc(crit, 1)}° the refracted ray skims along the surface (r = 90°) – that's the critical angle.`}</>}
      </Explain>
    </WidgetFrame>
  );
}
