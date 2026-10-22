"use client";
import { useRef, useState } from "react";
import { Plot, Polyline } from "@/components/sci/plot";
import { Tex } from "@/components/learn/tex";
import { dc, Explain, Readouts, SimControls, useTicker, useToolUse } from "./sim-kit";
import { WidgetFrame } from "./widget-frame";

const C = "var(--t-change)";
const KC: Record<number, number> = { 300: 0.2, 350: 0.8, 400: 3 };
const kr = 1.5;

/**
 * Le Chatelier's principle in a sealed flask: N₂O₄ (colourless) ⇌ 2NO₂ (brown),
 * ΔH > 0. Disturb the equilibrium – add gas, squeeze it, heat it, add a
 * catalyst – and watch the concentration-time graph and the colour respond.
 */
export function EquilibriumLab({ title = "Le Chatelier's principle" }: { title?: string }) {
  const [T, setT] = useState(350);
  const [running, setRunning] = useState(false);
  const [catalyst, setCatalyst] = useState(false);
  const [msg, setMsg] = useState("Press Play and wait for equilibrium – the lines go flat when the forward and reverse rates are equal.");
  const touch = useToolUse();
  const st = useRef({ A: 1, B: 0, t: 0 });
  const hist = useRef<[number, number, number][]>([[0, 1, 0]]);
  const [, force] = useState(0);
  const speed = catalyst ? 3 : 1;

  useTicker((dt) => {
    const s = st.current;
    for (let k = 0; k < 10; k++) {
      const h = (dt / 10) * speed;
      const rf = KC[T] * kr * s.A;
      const rr = kr * s.B * s.B;
      s.A += (rr - rf) * h;
      s.B += 2 * (rf - rr) * h;
    }
    s.t += dt;
    const H = hist.current;
    if (s.t - H[H.length - 1][0] > 0.1) H.push([s.t, s.A, s.B]);
    while (H.length && s.t - H[0][0] > 30) H.shift();
    force((n) => n + 1);
  }, running);

  const s = st.current;
  const Q = s.A > 0 ? (s.B * s.B) / s.A : Infinity;
  const K = KC[T];
  const settled = Math.abs(Q - K) / K < 0.02;
  const disturb = (fn: () => void, text: string) => {
    fn();
    hist.current.push([st.current.t, st.current.A, st.current.B]);
    setMsg(text);
    setRunning(true);
    touch();
    force((n) => n + 1);
  };
  const H = hist.current;
  const t0 = H[0][0];
  const brown = Math.min(1, s.B / 1.6);

  return (
    <WidgetFrame title={title} colour={C} instruction="Let the system reach equilibrium, then apply a disturbance and predict which way it will shift before you look.">
      <div className="text-center text-lg"><Tex tex="\mathrm{N_2O_4(g)} \rightleftharpoons \mathrm{2NO_2(g)} \qquad \Delta H > 0" /></div>
      <div className="mt-3 grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
        <svg viewBox="0 0 180 220" className="diagram" role="img" aria-label={`Flask colour ${brown > 0.6 ? "dark brown" : brown > 0.3 ? "brown" : "pale"}`}>
          <path d="M70,10 h40 v60 l55,110 a20,20 0 0 1 -18,30 h-114 a20,20 0 0 1 -18,-30 l55,-110 z" fill={`rgba(146, 64, 14, ${0.08 + brown * 0.8})`} stroke="var(--text-muted)" strokeWidth="3" />
          <text x="90" y="160" textAnchor="middle" fontSize="12" fontWeight="700" fill={brown > 0.5 ? "white" : "var(--text)"}>{T} K</text>
        </svg>
        <div>
          <Plot view={{ xMin: 0, xMax: 30, yMin: 0, yMax: 2.4 }} width={420} height={210} label="Concentration against time" xLabel="t (s)" yLabel="c (mol·dm⁻³)">
            <Polyline points={H.map(([t, A]) => [t - t0, A] as [number, number])} colour="#64748b" />
            <Polyline points={H.map(([t, , B]) => [t - t0, B] as [number, number])} colour="#b45309" />
          </Plot>
          <div className="mt-1 flex gap-4 text-xs"><span className="flex items-center gap-1"><span className="h-1 w-4 rounded bg-[#64748b]" />[N₂O₄]</span><span className="flex items-center gap-1"><span className="h-1 w-4 rounded bg-[#b45309]" />[NO₂]</span></div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="rounded-xl border border-line px-3 py-1.5 text-sm font-semibold" onClick={() => disturb(() => { st.current.A += 0.6; }, "You added N₂O₄. The system shifts FORWARD (to the right) to use up some of the extra N₂O₄ – more brown NO₂ forms.")}>+ add N₂O₄</button>
        <button className="rounded-xl border border-line px-3 py-1.5 text-sm font-semibold" onClick={() => disturb(() => { st.current.B += 0.6; }, "You added NO₂. The REVERSE reaction is favoured to use up some of it, so [N₂O₄] increases.")}>+ add NO₂</button>
        <button className="rounded-xl border border-line px-3 py-1.5 text-sm font-semibold" onClick={() => disturb(() => { st.current.A *= 2; st.current.B *= 2; }, "You halved the volume, so the pressure doubled (both concentrations jumped). The system shifts to the side with FEWER gas moles – the reverse reaction (1 mol N₂O₄ vs 2 mol NO₂).")}>Increase pressure</button>
        {([300, 350, 400] as const).map((tt) => tt !== T && (
          <button key={tt} className="rounded-xl border border-line px-3 py-1.5 text-sm font-semibold" onClick={() => disturb(() => setT(tt), tt > T ? "You increased the temperature. The ENDOTHERMIC (forward) reaction is favoured to absorb the heat: more NO₂, darker brown, and Kc INCREASES." : "You lowered the temperature. The EXOTHERMIC (reverse) reaction is favoured to release heat: more N₂O₄, paler, and Kc DECREASES.")}>{tt > T ? "Heat" : "Cool"} to {tt} K</button>
        ))}
        <button className="rounded-xl border border-line px-3 py-1.5 text-sm font-semibold" onClick={() => disturb(() => setCatalyst((c) => !c), catalyst ? "Catalyst removed." : "A catalyst speeds up the forward AND reverse reactions equally, so equilibrium is reached faster – but the amounts at equilibrium don't change.")}>{catalyst ? "Remove catalyst" : "Add catalyst"}</button>
      </div>
      <div className="mt-3"><SimControls running={running} colour={C} onToggle={() => { setRunning((r) => !r); touch(); }} onReset={() => { st.current = { A: 1, B: 0, t: 0 }; hist.current = [[0, 1, 0]]; setT(350); setCatalyst(false); setRunning(false); setMsg("Reset: only N₂O₄ in the flask."); }} /></div>
      <Readouts className="mt-3" colour={C} items={[
        { label: "[N₂O₄]", value: dc(s.A, 3), unit: "mol·dm⁻³" },
        { label: "[NO₂]", value: dc(s.B, 3), unit: "mol·dm⁻³" },
        { label: "Qc = [NO₂]²/[N₂O₄]", value: Number.isFinite(Q) ? dc(Q, 3) : "∞" },
        { label: `Kc at ${T} K`, value: dc(K, 2), highlight: true },
        { label: "state", value: settled ? "at equilibrium" : Q < K ? "shifting forward →" : "shifting backward ←" },
      ]} />
      <Explain colour={C}>
        <strong>{msg}</strong> <span className="text-muted">Le Chatelier: when an equilibrium is disturbed, the system shifts to partly cancel the disturbance. Only a change in temperature changes the value of Kc.</span>
      </Explain>
    </WidgetFrame>
  );
}
