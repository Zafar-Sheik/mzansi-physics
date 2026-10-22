"use client";
import { useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { dc, Explain, Readouts, SimControls, useTicker, useToolUse } from "./sim-kit";
import { Slider, WidgetFrame } from "./widget-frame";

const C = "var(--t-waves)";
const V = 340;

/**
 * An ambulance drives past two listeners. Its wavefronts bunch up in front
 * (higher frequency) and stretch out behind (lower frequency). The Listen
 * button plays the pitch the listeners hear as it approaches and then moves away.
 */
export function DopplerLab({ title = "The Doppler effect" }: { title?: string }) {
  const [vs, setVs] = useState(30);
  const [fs, setFs] = useState(500);
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(0);
  const touch = useToolUse();
  const ctx = useRef<AudioContext | null>(null);

  // On screen the wavefronts travel at 120 px/s and the source at the same fraction of that as vₛ is of v.
  const WAVE = 120;
  const ratio = vs / V;
  const sp = WAVE * ratio;
  const period = 0.25;
  const xs = (time: number) => 120 + sp * time;
  useTicker((dt) => setT((x) => (x + dt > 5 || xs(x + dt) > 560 ? 0 : x + dt)), running);
  const fronts: { x: number; r: number }[] = [];
  for (let e = 0; e <= t; e += period) fronts.push({ x: xs(e), r: WAVE * (t - e) });
  const fTowards = (V / (V - vs)) * fs;
  const fAway = (V / (V + vs)) * fs;
  const srcX = xs(t);

  const listen = async () => {
    touch();
    try {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx.current = ctx.current ?? new AC();
      const ac = ctx.current;
      await ac.resume();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "triangle";
      const now = ac.currentTime;
      osc.frequency.setValueAtTime(fTowards, now);
      osc.frequency.setValueAtTime(fTowards, now + 1.2);
      osc.frequency.linearRampToValueAtTime(fAway, now + 1.45);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.15, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
      osc.connect(gain).connect(ac.destination);
      osc.start(now);
      osc.stop(now + 2.9);
    } catch {
      /* audio not available */
    }
  };

  return (
    <WidgetFrame title={title} colour={C} instruction="Press Play to watch the wavefronts, and Listen to hear the pitch drop as the ambulance passes. Change its speed.">
      <svg viewBox="0 0 640 220" className="diagram rounded-xl border border-line bg-surface" role="img" aria-label={`Source moving at ${vs} metres per second. Listener in front hears ${dc(fTowards, 0)} hertz, listener behind hears ${dc(fAway, 0)} hertz.`}>
        <defs><clipPath id="dop-clip"><rect x="0" y="0" width="640" height="220" /></clipPath></defs>
        <g clipPath="url(#dop-clip)">
          {fronts.map((f, i) => <circle key={i} cx={f.x} cy="110" r={f.r} fill="none" stroke={C} strokeWidth="2" opacity={Math.max(0.15, 1 - f.r / 500)} />)}
        </g>
        <g transform={`translate(${srcX}, 110)`}>
          <rect x="-22" y="-12" width="44" height="24" rx="5" fill="white" stroke="#dc2626" strokeWidth="2" />
          <path d="M-4,-6 h8 v4 h4 v4 h-4 v4 h-8 v-4 h-4 v-4 h4 z" fill="#dc2626" />
          <circle cx="0" cy="-15" r="4" fill={Math.floor(t * 4) % 2 ? "#3b82f6" : "#ef4444"} />
        </g>
        <g><circle cx="610" cy="110" r="10" fill="#22c55e" /><text x="610" y="140" textAnchor="middle" fontSize="11" fontWeight="700" fill="#16a34a">in front</text></g>
        <g><circle cx="20" cy="110" r="10" fill="#a855f7" /><text x="22" y="140" textAnchor="middle" fontSize="11" fontWeight="700" fill="#9333ea">behind</text></g>
        <text x="320" y="210" textAnchor="middle" fontSize="11" className="muted">waves bunched up in front, stretched out behind</text>
      </svg>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Slider label="Speed of the source vₛ (m·s⁻¹)" value={vs} min={5} max={120} step={5} onChange={(n) => { setVs(n); setT(0); touch(); }} colour={C} />
        <Slider label="Frequency of the siren fₛ (Hz)" value={fs} min={200} max={1000} step={50} onChange={(n) => { setFs(n); touch(); }} colour="var(--t-mech)" />
      </div>
      <div className="mt-3"><SimControls running={running} colour={C} onToggle={() => { setRunning((r) => !r); touch(); }} onReset={() => { setT(0); setRunning(false); }}>
        <button onClick={listen} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-line px-3 text-sm font-semibold"><Volume2 className="h-4 w-4" /> Listen</button>
      </SimControls></div>
      <Readouts className="mt-3" colour={C} items={[
        { label: "speed of sound v", value: "340", unit: "m·s⁻¹" },
        { label: "listener in front hears", value: dc(fTowards, 0), unit: "Hz", highlight: true },
        { label: "listener behind hears", value: dc(fAway, 0), unit: "Hz" },
        { label: "wavelength in front", value: dc((V - vs) / fs, 3), unit: "m" },
        { label: "wavelength behind", value: dc((V + vs) / fs, 3), unit: "m" },
      ]} />
      <Explain colour={C}>
        <strong>f_L = (v ± v_L)/(v ± v_s) · f_s</strong>. The source moves towards the listener in front, so each new wavefront is emitted closer: shorter wavelength, <strong>higher frequency</strong> ({dc(fTowards, 0)} Hz). Behind, the waves are stretched: lower frequency ({dc(fAway, 0)} Hz). The siren itself never changes! Doctors use the Doppler effect (ultrasound) to measure blood flow and a baby&apos;s heartbeat, and the <strong>red shift</strong> of light from galaxies shows the universe is expanding.
      </Explain>
    </WidgetFrame>
  );
}
