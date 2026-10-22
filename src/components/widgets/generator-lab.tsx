"use client";
import { useRef, useState } from "react";
import { Plot, Polyline } from "@/components/sci/plot";
import { Arrow, dc, Explain, Readouts, SimControls, useTicker, useToolUse } from "./sim-kit";
import { Segmented, Slider, WidgetFrame } from "./widget-frame";

const C = "var(--t-elec)";
type Mode = "faraday" | "ac" | "dc" | "motor";

/**
 * Electromagnetic induction and its machines: push a magnet into a coil
 * (Faraday's law), spin a coil in a field to make AC (slip rings) or DC
 * (split-ring commutator), or run it backwards as a motor.
 */
export function GeneratorLab({ title = "Induction, generators & motors", mode: startMode = "ac" }: { title?: string; mode?: Mode }) {
  const [mode, setMode] = useState<Mode>(startMode);
  const [N, setN] = useState(100);
  const [speed, setSpeed] = useState(1); // rotations per second (slowed) or magnet speed
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(0);
  const [magX, setMagX] = useState(0); // 0 = far away, 1 = fully inside
  const history = useRef<[number, number, number][]>([]);
  const touch = useToolUse();
  const B = 0.2, A = 0.01;
  const omega = 2 * Math.PI * speed;
  const Emax = N * B * A * omega;

  useTicker((dt) => {
    setT((x) => {
      const nt = x + dt;
      if (mode === "faraday") {
        // Oscillate the magnet in and out of the coil.
        const p = 0.5 - 0.5 * Math.cos(nt * speed * 2);
        setMagX(p);
      }
      return nt;
    });
  }, running);

  // Faraday: flux through the coil rises smoothly as the magnet enters.
  const fluxOf = (p: number) => B * A * (1 / (1 + Math.exp(-(p - 0.5) * 10)));
  const dFlux = mode === "faraday" ? (fluxOf(magX + 0.001) - fluxOf(magX - 0.001)) / 0.002 * (speed * Math.sin(t * speed * 2)) : 0;
  const emfF = -N * dFlux;
  const theta = omega * t;
  // For the motor the graph shows the (relative) turning effect instead of an emf.
  const emf = mode === "faraday" ? emfF : mode === "ac" ? Emax * Math.sin(theta) : mode === "dc" ? Math.abs(Emax * Math.sin(theta)) : Math.abs(Math.sin(theta));

  const hist = history.current;
  if (running && (hist.length === 0 || t - hist[hist.length - 1][0] > 0.02)) {
    hist.push([t, emf, mode === "faraday" ? fluxOf(magX) : B * A * Math.cos(theta)]);
    while (hist.length && t - hist[0][0] > 4) hist.shift();
  }
  const reset = () => { setRunning(false); setT(0); setMagX(0); history.current = []; };
  const t0 = hist.length ? hist[0][0] : 0;
  const yMax = mode === "faraday" ? Math.max(0.5, N * B * A * speed * 2.6) : mode === "motor" ? 1.15 : Math.max(0.5, Emax) * 1.15;

  const needle = Math.max(-60, Math.min(60, (emf / Math.max(0.01, yMax)) * 60));
  const coilAngle = (theta * 180) / Math.PI;
  const proj = Math.cos(theta); // width of the coil seen side-on

  return (
    <WidgetFrame title={title} colour={C} instruction="Pick a machine, press Play and change the number of turns or the speed. Watch the galvanometer and the graph.">
      <Segmented colour={C} value={mode} onChange={(m) => { setMode(m); reset(); touch(); }} options={[{ id: "faraday", label: "Magnet & coil (Gr 11)" }, { id: "ac", label: "AC generator" }, { id: "dc", label: "DC generator" }, { id: "motor", label: "DC motor" }]} />
      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
        <svg viewBox="0 0 520 240" className="diagram rounded-xl border border-line bg-surface" role="img" aria-label={`${mode} – induced emf ${dc(emf, 2)} volts`}>
          {mode === "faraday" ? (
            <g>
              {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={300 + i * 14} cy="110" rx="9" ry="46" fill="none" stroke="#b45309" strokeWidth="4" />)}
              <path d="M300,156 V200 H200 M412,156 V200 H460" fill="none" stroke="var(--text)" strokeWidth="2" />
              <g transform={`translate(${60 + magX * 240}, 110)`}>
                <rect x="-70" y="-16" width="70" height="32" fill="#3b82f6" /><rect x="0" y="-16" width="70" height="32" fill="#ef4444" />
                <text x="-40" y="6" fontSize="15" fontWeight="800" fill="white">S</text><text x="30" y="6" fontSize="15" fontWeight="800" fill="white">N</text>
              </g>
            </g>
          ) : (
            <g>
              <rect x="40" y="60" width="70" height="120" rx="6" fill="#ef4444" /><text x="75" y="126" textAnchor="middle" fontSize="18" fontWeight="800" fill="white">N</text>
              <rect x="410" y="60" width="70" height="120" rx="6" fill="#3b82f6" /><text x="445" y="126" textAnchor="middle" fontSize="18" fontWeight="800" fill="white">S</text>
              {[80, 100, 120, 140, 160].map((y) => <line key={y} x1="112" x2="408" y1={y} y2={y} stroke="var(--graph-grid)" strokeWidth="1.5" strokeDasharray="6 6" />)}
              <text x="260" y="52" textAnchor="middle" fontSize="11" className="muted">magnetic field B →</text>
              {/* coil seen from the side: its width shrinks as it turns */}
              <rect x={260 - 90 * Math.abs(proj)} y="70" width={180 * Math.abs(proj)} height="100" fill="none" stroke="#b45309" strokeWidth="5" />
              <line x1="260" x2="260" y1="170" y2="205" stroke="var(--text)" strokeWidth="3" />
              {mode === "ac" ? (
                <g><rect x="242" y="196" width="36" height="8" rx="3" fill="#a16207" /><rect x="242" y="208" width="36" height="8" rx="3" fill="#ca8a04" /><text x="290" y="212" fontSize="10" className="muted">slip rings</text></g>
              ) : (
                <g><path d="M242,204 h16 v10 h-16 z M262,204 h16 v10 h-16 z" fill="#a16207" /><text x="290" y="212" fontSize="10" className="muted">split ring</text></g>
              )}
              {mode === "motor" && (
                <>
                  <Arrow x={260 - 90 * proj} y={120} length={34} angle={Math.sin(theta) >= 0 ? 90 : -90} colour="var(--t-change)" label="F" />
                  <Arrow x={260 + 90 * proj} y={120} length={34} angle={Math.sin(theta) >= 0 ? -90 : 90} colour="var(--t-change)" label="F" />
                </>
              )}
              <text x="260" y="234" textAnchor="middle" fontSize="11" className="muted">coil angle {dc(((coilAngle % 360) + 360) % 360, 0)}°</text>
            </g>
          )}
          {mode !== "motor" && (
            <g transform="translate(470, 200)">
              <circle r="26" fill="var(--surface)" stroke="var(--text)" strokeWidth="2" />
              <line x1="0" y1="8" x2={22 * Math.sin((needle * Math.PI) / 180)} y2={8 - 22 * Math.cos((needle * Math.PI) / 180)} stroke="var(--danger)" strokeWidth="3" strokeLinecap="round" />
              <text y="20" textAnchor="middle" fontSize="9" className="muted">G</text>
            </g>
          )}
        </svg>
        <div>
          <div className="mb-1 text-xs font-bold text-muted">{mode === "motor" ? "Torque keeps turning the same way" : "Induced emf vs time"}</div>
          <Plot view={{ xMin: 0, xMax: 4, yMin: -yMax, yMax }} width={280} height={190} label="emf against time" xLabel="t" yLabel="ε">
            <Polyline points={hist.map(([tt, e]) => [tt - t0, e] as [number, number])} colour={C} />
          </Plot>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Slider label="Number of turns N" value={N} min={10} max={300} step={10} onChange={(n) => { setN(n); touch(); }} colour={C} />
        <Slider label={mode === "faraday" ? "How fast the magnet moves" : "Rotation speed (turns per second)"} value={speed} min={0.25} max={3} step={0.25} onChange={(n) => { setSpeed(n); touch(); }} colour={C} format={(n) => dc(n, 2)} />
      </div>
      <div className="mt-3"><SimControls running={running} colour={C} onToggle={() => { setRunning((r) => !r); touch(); }} onReset={reset} /></div>
      {mode !== "motor" && (
        <Readouts className="mt-3" colour={C} items={mode === "faraday" ? [
          { label: "flux Φ = BA cos θ", value: dc(fluxOf(magX) * 1000, 2), unit: "mWb" },
          { label: "induced emf ε", value: dc(emf, 3), unit: "V", highlight: true },
          { label: "turns N", value: String(N) },
        ] : [
          { label: "peak emf", value: dc(Emax, 2), unit: "V" },
          { label: "emf now", value: dc(emf, 2), unit: "V", highlight: true },
          { label: mode === "ac" ? "rms emf = peak/√2" : "frequency", value: mode === "ac" ? dc(Emax / Math.SQRT2, 2) : dc(speed, 2), unit: mode === "ac" ? "V" : "Hz" },
        ]} />
      )}
      <Explain colour={C}>
        {mode === "faraday" && <><strong>Faraday&apos;s law:</strong> the induced emf is proportional to the <strong>rate of change of magnetic flux</strong>: ε = −NΔΦ/Δt. No movement, no emf – even with the magnet inside the coil! Move faster or use more turns for a bigger emf. The minus sign (Lenz&apos;s law) means the induced current opposes the change, so the needle swings the other way when the magnet comes out.</>}
        {mode === "ac" && <>An <strong>AC generator</strong> turns mechanical energy into electrical energy. As the coil spins, the flux through it changes continuously, so the emf is a <strong>sine wave</strong> that reverses direction every half turn. <strong>Slip rings</strong> keep each end of the coil connected to the same brush. Eskom&apos;s power stations do this at 50 Hz; the 230 V of a wall socket is the rms value.</>}
        {mode === "dc" && <>A <strong>DC generator</strong> uses a <strong>split-ring commutator</strong>: every half turn it swaps the connections, so the current in the outside circuit always flows the same way. The emf rises and falls but never changes sign.</>}
        {mode === "motor" && <>A <strong>DC motor</strong> is a generator in reverse: it turns electrical energy into mechanical energy. A current-carrying wire in a magnetic field feels a force (F = BIL). The forces on the two sides of the coil point in opposite directions, making it turn. The <strong>split-ring commutator</strong> reverses the current every half turn so the coil keeps turning the same way.</>}
      </Explain>
    </WidgetFrame>
  );
}
