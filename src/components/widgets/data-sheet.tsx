"use client";
import { useState } from "react";
import { REDUCTION_POTENTIALS } from "@/lib/sci/chem";
import { Tex } from "@/components/learn/tex";
import { Segmented, WidgetFrame } from "./widget-frame";
import { PeriodicTable } from "./periodic-table";

const CONSTANTS: [string, string, string][] = [
  ["Acceleration due to gravity", "g", "9{,}8\\ \\text{m·s}^{-2}"],
  ["Universal gravitational constant", "G", "6{,}67 \\times 10^{-11}\\ \\text{N·m}^2\\text{·kg}^{-2}"],
  ["Radius of the Earth", "R_E", "6{,}38 \\times 10^{6}\\ \\text{m}"],
  ["Mass of the Earth", "M_E", "5{,}98 \\times 10^{24}\\ \\text{kg}"],
  ["Speed of light in a vacuum", "c", "3{,}0 \\times 10^{8}\\ \\text{m·s}^{-1}"],
  ["Planck's constant", "h", "6{,}63 \\times 10^{-34}\\ \\text{J·s}"],
  ["Coulomb's constant", "k", "9{,}0 \\times 10^{9}\\ \\text{N·m}^2\\text{·C}^{-2}"],
  ["Charge on an electron", "e", "-1{,}6 \\times 10^{-19}\\ \\text{C}"],
  ["Electron mass", "m_e", "9{,}11 \\times 10^{-31}\\ \\text{kg}"],
  ["Molar gas volume at STP", "V_m", "22{,}4\\ \\text{dm}^3\\text{·mol}^{-1}"],
  ["Standard pressure", "p^\\theta", "1{,}013 \\times 10^{5}\\ \\text{Pa}"],
  ["Standard temperature", "T^\\theta", "273\\ \\text{K}"],
  ["Avogadro's constant", "N_A", "6{,}02 \\times 10^{23}\\ \\text{mol}^{-1}"],
  ["Universal gas constant", "R", "8{,}31\\ \\text{J·K}^{-1}\\text{·mol}^{-1}"],
  ["Ionisation constant of water (25 °C)", "K_w", "1 \\times 10^{-14}"],
];

const PHYSICS: [string, string[]][] = [
  ["Motion", ["v_f = v_i + a\\Delta t", "\\Delta x = v_i\\Delta t + \\tfrac{1}{2}a\\Delta t^2", "v_f^2 = v_i^2 + 2a\\Delta x", "\\Delta x = \\left(\\frac{v_i + v_f}{2}\\right)\\Delta t"]],
  ["Force", ["F_{net} = ma", "p = mv", "F_{net}\\Delta t = \\Delta p = mv_f - mv_i", "w = mg", "f_s^{max} = \\mu_s N", "f_k = \\mu_k N", "F = \\frac{Gm_1m_2}{r^2}", "g = \\frac{GM}{r^2}"]],
  ["Work, energy & power", ["W = F\\Delta x\\cos\\theta", "U = E_p = mgh", "K = E_k = \\tfrac{1}{2}mv^2", "W_{net} = \\Delta K = \\Delta E_k", "W_{nc} = \\Delta K + \\Delta U", "P = \\frac{W}{\\Delta t}", "P_{ave} = Fv_{ave}"]],
  ["Waves, sound & light", ["v = f\\lambda", "T = \\frac{1}{f}", "f_L = \\frac{v \\pm v_L}{v \\pm v_s}f_s", "E = hf = \\frac{hc}{\\lambda}", "E = W_0 + E_{k(max)}", "W_0 = hf_0", "n = \\frac{c}{v}", "n_1\\sin\\theta_1 = n_2\\sin\\theta_2", "\\sin\\theta = \\frac{m\\lambda}{a}"]],
  ["Electrostatics", ["F = \\frac{kQ_1Q_2}{r^2}", "E = \\frac{kQ}{r^2}", "E = \\frac{F}{q}", "n = \\frac{Q}{q_e}"]],
  ["Electric circuits", ["R = \\frac{V}{I}", "Q = I\\Delta t", "R_s = R_1 + R_2 + \\dots", "\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots", "\\varepsilon = I(R + r)", "W = Vq = VI\\Delta t = I^2R\\Delta t", "P = VI = I^2R = \\frac{V^2}{R}"]],
  ["Electromagnetism & AC", ["\\Phi = BA\\cos\\theta", "\\varepsilon = -N\\frac{\\Delta\\Phi}{\\Delta t}", "I_{rms} = \\frac{I_{max}}{\\sqrt{2}}", "V_{rms} = \\frac{V_{max}}{\\sqrt{2}}", "P_{ave} = V_{rms}I_{rms} = I_{rms}^2R"]],
];

const CHEMISTRY: string[] = [
  "n = \\frac{m}{M}", "n = \\frac{N}{N_A}", "n = \\frac{V}{V_m}", "c = \\frac{n}{V}", "c = \\frac{m}{MV}",
  "\\frac{c_aV_a}{c_bV_b} = \\frac{n_a}{n_b}", "pH = -\\log[\\mathrm{H_3O^+}]", "K_w = [\\mathrm{H_3O^+}][\\mathrm{OH^-}] = 1 \\times 10^{-14}",
  "pV = nRT", "\\frac{p_1V_1}{T_1} = \\frac{p_2V_2}{T_2}", "E^\\theta_{cell} = E^\\theta_{cathode} - E^\\theta_{anode}", "\\Delta H = E_{products} - E_{reactants}",
];

/** The NSC data sheets in one place: constants, the physics and chemistry formula sheets, Table 4 and the periodic table. */
export function DataSheet({ title = "Data sheets", tab: startTab = "constants" }: { title?: string; tab?: "constants" | "physics" | "chemistry" | "table4" | "periodic" }) {
  const [tab, setTab] = useState(startTab);
  return (
    <WidgetFrame title={title} colour="var(--brand)" instruction="Everything you get with the exam paper. Learn where to find things – it saves time in the exam.">
      <Segmented value={tab} onChange={setTab} options={[{ id: "constants", label: "Constants" }, { id: "physics", label: "Physics formulas" }, { id: "chemistry", label: "Chemistry formulas" }, { id: "table4", label: "Table 4 (E°)" }, { id: "periodic", label: "Periodic table" }]} />
      <div className="mt-3">
        {tab === "constants" && (
          <table className="w-full text-sm"><tbody>{CONSTANTS.map(([n, s, v]) => <tr key={n} className="border-b border-line"><td className="py-1.5 pr-2">{n}</td><td className="pr-2"><Tex tex={s} /></td><td><Tex tex={v} /></td></tr>)}</tbody></table>
        )}
        {tab === "physics" && (
          <div className="grid gap-3 md:grid-cols-2">
            {PHYSICS.map(([h, fs]) => (
              <div key={h} className="rounded-xl border border-line p-3">
                <div className="mb-1 text-xs font-bold tracking-wider text-muted uppercase">{h}</div>
                <ul className="space-y-1.5">{fs.map((f) => <li key={f}><Tex tex={f} /></li>)}</ul>
              </div>
            ))}
          </div>
        )}
        {tab === "chemistry" && <ul className="grid gap-2 sm:grid-cols-2">{CHEMISTRY.map((f) => <li key={f} className="rounded-xl border border-line p-2"><Tex tex={f} /></li>)}</ul>}
        {tab === "table4" && (
          <div>
            <p className="mb-2 text-sm text-muted">Standard reduction potentials. The more <strong>positive</strong> E°, the stronger the oxidising agent (left side); the more <strong>negative</strong>, the stronger the reducing agent (right side).</p>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-muted"><th className="py-1">Half-reaction</th><th className="text-right">E° (V)</th></tr></thead>
              <tbody>{[...REDUCTION_POTENTIALS].reverse().map((h) => <tr key={h.half} className="border-b border-line"><td className="py-1"><Tex tex={h.tex} /></td><td className="text-right font-mono">{h.e > 0 ? "+" : ""}{h.e.toFixed(2).replace(".", ",")}</td></tr>)}</tbody>
            </table>
          </div>
        )}
        {tab === "periodic" && <PeriodicTable title="Periodic table" />}
      </div>
    </WidgetFrame>
  );
}
