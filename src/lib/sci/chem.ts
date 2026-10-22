/**
 * Chemistry data and helpers: the periodic table (molar masses and
 * electronegativities as on the NSC data sheet), a formula parser for molar
 * masses, and electron configurations.
 */

export type ElementCategory = "alkali" | "alkaline-earth" | "transition" | "post-transition" | "metalloid" | "nonmetal" | "halogen" | "noble" | "lanthanide" | "actinide";

export interface Element {
  z: number;
  symbol: string;
  name: string;
  /** Relative atomic mass as printed on the NSC periodic table. */
  mass: number;
  /** Pauling electronegativity (null for the noble gases). */
  en: number | null;
  group: number;
  period: number;
  category: ElementCategory;
  /** Row and column in the classic 18-column layout (f-block in rows 9 and 10). */
  row: number;
  col: number;
}

// symbol, name, mass, electronegativity – in order of atomic number
const RAW: [string, string, number, number | null][] = [
  ["H", "Hydrogen", 1, 2.1], ["He", "Helium", 4, null], ["Li", "Lithium", 7, 1.0], ["Be", "Beryllium", 9, 1.5], ["B", "Boron", 11, 2.0],
  ["C", "Carbon", 12, 2.5], ["N", "Nitrogen", 14, 3.0], ["O", "Oxygen", 16, 3.5], ["F", "Fluorine", 19, 4.0], ["Ne", "Neon", 20, null],
  ["Na", "Sodium", 23, 0.9], ["Mg", "Magnesium", 24, 1.2], ["Al", "Aluminium", 27, 1.5], ["Si", "Silicon", 28, 1.8], ["P", "Phosphorus", 31, 2.1],
  ["S", "Sulfur", 32, 2.5], ["Cl", "Chlorine", 35.5, 3.0], ["Ar", "Argon", 40, null], ["K", "Potassium", 39, 0.8], ["Ca", "Calcium", 40, 1.0],
  ["Sc", "Scandium", 45, 1.3], ["Ti", "Titanium", 48, 1.5], ["V", "Vanadium", 51, 1.6], ["Cr", "Chromium", 52, 1.6], ["Mn", "Manganese", 55, 1.5],
  ["Fe", "Iron", 56, 1.8], ["Co", "Cobalt", 59, 1.8], ["Ni", "Nickel", 59, 1.8], ["Cu", "Copper", 63.5, 1.9], ["Zn", "Zinc", 65, 1.6],
  ["Ga", "Gallium", 70, 1.6], ["Ge", "Germanium", 73, 1.8], ["As", "Arsenic", 75, 2.0], ["Se", "Selenium", 79, 2.4], ["Br", "Bromine", 80, 2.8],
  ["Kr", "Krypton", 84, null], ["Rb", "Rubidium", 86, 0.8], ["Sr", "Strontium", 88, 1.0], ["Y", "Yttrium", 89, 1.2], ["Zr", "Zirconium", 91, 1.4],
  ["Nb", "Niobium", 92, 1.6], ["Mo", "Molybdenum", 96, 1.8], ["Tc", "Technetium", 98, 1.9], ["Ru", "Ruthenium", 101, 2.2], ["Rh", "Rhodium", 103, 2.2],
  ["Pd", "Palladium", 106, 2.2], ["Ag", "Silver", 108, 1.9], ["Cd", "Cadmium", 112, 1.7], ["In", "Indium", 115, 1.7], ["Sn", "Tin", 119, 1.8],
  ["Sb", "Antimony", 122, 1.9], ["Te", "Tellurium", 128, 2.1], ["I", "Iodine", 127, 2.5], ["Xe", "Xenon", 131, null], ["Cs", "Caesium", 133, 0.7],
  ["Ba", "Barium", 137, 0.9], ["La", "Lanthanum", 139, 1.1], ["Ce", "Cerium", 140, 1.1], ["Pr", "Praseodymium", 141, 1.1], ["Nd", "Neodymium", 144, 1.1],
  ["Pm", "Promethium", 145, 1.1], ["Sm", "Samarium", 150, 1.2], ["Eu", "Europium", 152, 1.2], ["Gd", "Gadolinium", 157, 1.2], ["Tb", "Terbium", 159, 1.2],
  ["Dy", "Dysprosium", 163, 1.2], ["Ho", "Holmium", 165, 1.2], ["Er", "Erbium", 167, 1.2], ["Tm", "Thulium", 169, 1.3], ["Yb", "Ytterbium", 173, 1.1],
  ["Lu", "Lutetium", 175, 1.3], ["Hf", "Hafnium", 179, 1.3], ["Ta", "Tantalum", 181, 1.5], ["W", "Tungsten", 184, 1.7], ["Re", "Rhenium", 186, 1.9],
  ["Os", "Osmium", 190, 2.2], ["Ir", "Iridium", 192, 2.2], ["Pt", "Platinum", 195, 2.2], ["Au", "Gold", 197, 2.4], ["Hg", "Mercury", 201, 1.9],
  ["Tl", "Thallium", 204, 1.8], ["Pb", "Lead", 207, 1.8], ["Bi", "Bismuth", 209, 1.9], ["Po", "Polonium", 209, 2.0], ["At", "Astatine", 210, 2.5],
  ["Rn", "Radon", 222, null], ["Fr", "Francium", 223, 0.7], ["Ra", "Radium", 226, 0.9], ["Ac", "Actinium", 227, 1.1], ["Th", "Thorium", 232, 1.3],
  ["Pa", "Protactinium", 231, 1.5], ["U", "Uranium", 238, 1.7], ["Np", "Neptunium", 237, 1.3], ["Pu", "Plutonium", 244, 1.3], ["Am", "Americium", 243, 1.3],
  ["Cm", "Curium", 247, 1.3], ["Bk", "Berkelium", 247, 1.3], ["Cf", "Californium", 251, 1.3], ["Es", "Einsteinium", 252, 1.3], ["Fm", "Fermium", 257, 1.3],
  ["Md", "Mendelevium", 258, 1.3], ["No", "Nobelium", 259, 1.3], ["Lr", "Lawrencium", 262, 1.3], ["Rf", "Rutherfordium", 267, null], ["Db", "Dubnium", 268, null],
  ["Sg", "Seaborgium", 269, null], ["Bh", "Bohrium", 270, null], ["Hs", "Hassium", 277, null], ["Mt", "Meitnerium", 278, null], ["Ds", "Darmstadtium", 281, null],
  ["Rg", "Roentgenium", 282, null], ["Cn", "Copernicium", 285, null], ["Nh", "Nihonium", 286, null], ["Fl", "Flerovium", 289, null], ["Mc", "Moscovium", 290, null],
  ["Lv", "Livermorium", 293, null], ["Ts", "Tennessine", 294, null], ["Og", "Oganesson", 294, null],
];

const METALLOIDS = new Set(["B", "Si", "Ge", "As", "Sb", "Te"]);
const NONMETALS = new Set(["H", "C", "N", "O", "P", "S", "Se"]);

function place(z: number): { period: number; group: number; row: number; col: number; f: "lanthanide" | "actinide" | null } {
  const ends = [2, 10, 18, 36, 54, 86, 118];
  const period = ends.findIndex((e) => z <= e) + 1;
  const start = period === 1 ? 1 : ends[period - 2] + 1;
  const i = z - start;
  let group: number;
  let f: "lanthanide" | "actinide" | null = null;
  if (period === 1) group = z === 1 ? 1 : 18;
  else if (period <= 3) group = i < 2 ? i + 1 : i + 11;
  else if (period <= 5) group = i + 1;
  else {
    const base = period === 6 ? 57 : 89;
    if (i < 2) group = i + 1;
    else if (z === base) group = 3;
    else if (z < base + 15) {
      group = 3;
      f = period === 6 ? "lanthanide" : "actinide";
    } else group = z - (base + 15) + 4;
  }
  if (f) return { period, group, row: period === 6 ? 9 : 10, col: z - (period === 6 ? 57 : 89) + 3, f };
  return { period, group, row: period, col: group, f };
}

export const ELEMENTS: Element[] = RAW.map(([symbol, name, mass, en], k) => {
  const z = k + 1;
  const p = place(z);
  let category: ElementCategory;
  if (p.f) category = p.f;
  else if (p.group === 18) category = "noble";
  else if (p.group === 17) category = "halogen";
  else if (METALLOIDS.has(symbol)) category = "metalloid";
  else if (NONMETALS.has(symbol)) category = "nonmetal";
  else if (p.group === 1) category = "alkali";
  else if (p.group === 2) category = "alkaline-earth";
  else if (p.group >= 3 && p.group <= 12) category = "transition";
  else category = "post-transition";
  return { z, symbol, name, mass, en, group: p.group, period: p.period, category, row: p.row, col: p.col };
});

const BY_SYMBOL = new Map(ELEMENTS.map((e) => [e.symbol, e]));
export const element = (symbol: string) => BY_SYMBOL.get(symbol);
export const elementByZ = (z: number) => ELEMENTS[z - 1];

export class FormulaError extends Error {}

/**
 * Count the atoms in a formula: "Ca(OH)2" → { Ca: 1, O: 2, H: 2 }.
 * Understands brackets, hydrates (CuSO4·5H2O or CuSO4.5H2O) and charges (SO4^2-, NH4+ – ignored).
 */
export function atomCounts(formula: string): Record<string, number> {
  const clean = splitCharge(formula).body.replace(/\s/g, "").replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 8320));
  const parts = clean.split(/[·.*]/);
  const total: Record<string, number> = {};
  for (const part of parts) {
    const m = /^(\d*)(.*)$/.exec(part)!;
    const mult = m[1] ? Number(m[1]) : 1;
    const counts = parseGroup(m[2]);
    for (const [el, n] of Object.entries(counts)) total[el] = (total[el] ?? 0) + n * mult;
  }
  return total;
}

function parseGroup(s: string): Record<string, number> {
  const stack: Record<string, number>[] = [{}];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === "(" || c === "[") {
      stack.push({});
      i++;
    } else if (c === ")" || c === "]") {
      i++;
      const n = /^\d+/.exec(s.slice(i));
      const k = n ? Number(n[0]) : 1;
      if (n) i += n[0].length;
      const top = stack.pop();
      if (!top || !stack.length) throw new FormulaError("A bracket is not matched.");
      for (const [el, v] of Object.entries(top)) stack[stack.length - 1][el] = (stack[stack.length - 1][el] ?? 0) + v * k;
    } else {
      const m = /^([A-Z][a-z]?)(\d*)/.exec(s.slice(i));
      if (!m) throw new FormulaError(`I can't read “${s.slice(i, i + 3)}” – element symbols start with a capital letter.`);
      if (!BY_SYMBOL.has(m[1])) throw new FormulaError(`“${m[1]}” is not an element symbol.`);
      const top = stack[stack.length - 1];
      top[m[1]] = (top[m[1]] ?? 0) + (m[2] ? Number(m[2]) : 1);
      i += m[0].length;
    }
  }
  if (stack.length !== 1) throw new FormulaError("A bracket is not closed.");
  return stack[0];
}

/** Molar mass in g·mol⁻¹ using the data-sheet relative atomic masses. */
export function molarMass(formula: string): number {
  const counts = atomCounts(formula);
  return Math.round(Object.entries(counts).reduce((a, [el, n]) => a + BY_SYMBOL.get(el)!.mass * n, 0) * 100) / 100;
}

/**
 * Split an ion's charge from its formula. Write polyatomic charges after a space
 * or caret ("SO4 2-", "SO4^2-"); "Mg2+" (one element) and "NH4+" also work.
 */
export function splitCharge(formula: string): { body: string; charge: string } {
  const sep = /[\s^](\d*)([+\-])$/.exec(formula);
  if (sep) return { body: formula.slice(0, sep.index), charge: `${sep[1]}${sep[2]}` };
  const mono = /^([A-Z][a-z]?)(\d*)([+\-])$/.exec(formula);
  if (mono) return { body: mono[1], charge: `${mono[2]}${mono[3]}` };
  if (/[A-Za-z)\d][+\-]$/.test(formula)) return { body: formula.slice(0, -1), charge: formula.slice(-1) };
  return { body: formula, charge: "" };
}

/** "Ca(OH)2" → "\mathrm{Ca(OH)_{2}}", "SO4 2-" → "\mathrm{SO_{4}^{2-}}" for KaTeX. */
export function formulaTex(formula: string): string {
  const { body, charge } = splitCharge(formula.trim());
  const t = body.replace(/([A-Za-z)\]])(\d+)/g, "$1_{$2}").replace(/[·.](\d*)/g, "\\cdot $1");
  return `\\mathrm{${t}${charge ? `^{${charge}}` : ""}}`;
}

// ------------------------------------------------------------- electrons
const ORBITALS: [string, number][] = [
  ["1s", 2], ["2s", 2], ["2p", 6], ["3s", 2], ["3p", 6], ["4s", 2], ["3d", 10], ["4p", 6], ["5s", 2], ["4d", 10], ["5p", 6], ["6s", 2], ["4f", 14], ["5d", 10], ["6p", 6], ["7s", 2], ["5f", 14], ["6d", 10], ["7p", 6],
];

/** Aufbau filling order (with the Cr and Cu exceptions): [["1s", 2], ["2s", 2], ["2p", 3]] for nitrogen. */
export function electronConfig(electrons: number): [string, number][] {
  const out: [string, number][] = [];
  let left = electrons;
  for (const [o, cap] of ORBITALS) {
    if (left <= 0) break;
    const n = Math.min(cap, left);
    out.push([o, n]);
    left -= n;
  }
  // Half-full and full d sub-levels are extra stable: Cr is 4s¹ 3d⁵, Cu is 4s¹ 3d¹⁰.
  if (electrons === 24 || electrons === 29) {
    const s = out.find(([o]) => o === "4s");
    const d = out.find(([o]) => o === "3d");
    if (s && d) {
      s[1] = 1;
      d[1] += 1;
    }
  }
  return out;
}

/** "1s² 2s² 2p⁶ 3s¹" */
export function configText(electrons: number): string {
  const sup = (n: number) => String(n).replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(d)]);
  return electronConfig(electrons).map(([o, n]) => `${o}${sup(n)}`).join(" ");
}

/** "1s^{2} 2s^{2} 2p^{6}" for KaTeX. */
export function configTex(electrons: number): string {
  return electronConfig(electrons).map(([o, n]) => `${o}^{${n}}`).join("\\ ");
}

/** Electrons in the outermost energy level (main-group elements). */
export function valenceElectrons(z: number): number {
  const e = elementByZ(z);
  if (e.group === 18) return z === 2 ? 2 : 8;
  if (e.group <= 2) return e.group;
  if (e.group >= 13) return e.group - 10;
  return 2;
}

/** Ions learners must know (Grade 10 table of cations and anions). */
export const IONS: { formula: string; name: string; charge: number }[] = [
  { formula: "H+", name: "hydrogen", charge: 1 }, { formula: "Li+", name: "lithium", charge: 1 }, { formula: "Na+", name: "sodium", charge: 1 },
  { formula: "K+", name: "potassium", charge: 1 }, { formula: "Ag+", name: "silver", charge: 1 }, { formula: "NH4+", name: "ammonium", charge: 1 },
  { formula: "Mg2+", name: "magnesium", charge: 2 }, { formula: "Ca2+", name: "calcium", charge: 2 }, { formula: "Ba2+", name: "barium", charge: 2 },
  { formula: "Zn2+", name: "zinc", charge: 2 }, { formula: "Cu2+", name: "copper(II)", charge: 2 }, { formula: "Fe2+", name: "iron(II)", charge: 2 },
  { formula: "Pb2+", name: "lead(II)", charge: 2 }, { formula: "Fe3+", name: "iron(III)", charge: 3 }, { formula: "Al3+", name: "aluminium", charge: 3 },
  { formula: "F-", name: "fluoride", charge: -1 }, { formula: "Cl-", name: "chloride", charge: -1 }, { formula: "Br-", name: "bromide", charge: -1 },
  { formula: "I-", name: "iodide", charge: -1 }, { formula: "OH-", name: "hydroxide", charge: -1 }, { formula: "NO3-", name: "nitrate", charge: -1 },
  { formula: "HCO3-", name: "hydrogen carbonate", charge: -1 }, { formula: "MnO4-", name: "permanganate", charge: -1 }, { formula: "CH3COO-", name: "acetate (ethanoate)", charge: -1 },
  { formula: "O2-", name: "oxide", charge: -2 }, { formula: "S2-", name: "sulfide", charge: -2 }, { formula: "SO4 2-", name: "sulfate", charge: -2 },
  { formula: "SO3 2-", name: "sulfite", charge: -2 }, { formula: "CO3 2-", name: "carbonate", charge: -2 }, { formula: "Cr2O7 2-", name: "dichromate", charge: -2 },
  { formula: "N3-", name: "nitride", charge: -3 }, { formula: "PO4 3-", name: "phosphate", charge: -3 },
];

/** Combine a cation and an anion into a neutral formula: Al³⁺ + SO₄²⁻ → Al2(SO4)3. */
export function ionicFormula(cation: string, cCharge: number, anion: string, aCharge: number): string {
  const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
  const k = g(Math.abs(cCharge), Math.abs(aCharge));
  const nc = Math.abs(aCharge) / k;
  const na = Math.abs(cCharge) / k;
  const poly = (s: string) => (s.match(/[A-Z]/g) ?? []).length > 1;
  const part = (s: string, n: number) => (n === 1 ? s : poly(s) ? `(${s})${n}` : `${s}${n}`);
  return part(cation, nc) + part(anion, na);
}

/** Standard reduction potentials (NSC data sheet, Table 4), strongest reducing agent first. */
export const REDUCTION_POTENTIALS: { half: string; tex: string; oxidised: string; reduced: string; e: number; electrons: number }[] = [
  { half: "Li⁺ + e⁻ ⇌ Li", tex: "\\mathrm{Li^+ + e^- \\rightleftharpoons Li}", oxidised: "Li⁺", reduced: "Li", e: -3.05, electrons: 1 },
  { half: "K⁺ + e⁻ ⇌ K", tex: "\\mathrm{K^+ + e^- \\rightleftharpoons K}", oxidised: "K⁺", reduced: "K", e: -2.93, electrons: 1 },
  { half: "Ca²⁺ + 2e⁻ ⇌ Ca", tex: "\\mathrm{Ca^{2+} + 2e^- \\rightleftharpoons Ca}", oxidised: "Ca²⁺", reduced: "Ca", e: -2.87, electrons: 2 },
  { half: "Na⁺ + e⁻ ⇌ Na", tex: "\\mathrm{Na^+ + e^- \\rightleftharpoons Na}", oxidised: "Na⁺", reduced: "Na", e: -2.71, electrons: 1 },
  { half: "Mg²⁺ + 2e⁻ ⇌ Mg", tex: "\\mathrm{Mg^{2+} + 2e^- \\rightleftharpoons Mg}", oxidised: "Mg²⁺", reduced: "Mg", e: -2.36, electrons: 2 },
  { half: "Al³⁺ + 3e⁻ ⇌ Al", tex: "\\mathrm{Al^{3+} + 3e^- \\rightleftharpoons Al}", oxidised: "Al³⁺", reduced: "Al", e: -1.66, electrons: 3 },
  { half: "Mn²⁺ + 2e⁻ ⇌ Mn", tex: "\\mathrm{Mn^{2+} + 2e^- \\rightleftharpoons Mn}", oxidised: "Mn²⁺", reduced: "Mn", e: -1.18, electrons: 2 },
  { half: "Zn²⁺ + 2e⁻ ⇌ Zn", tex: "\\mathrm{Zn^{2+} + 2e^- \\rightleftharpoons Zn}", oxidised: "Zn²⁺", reduced: "Zn", e: -0.76, electrons: 2 },
  { half: "Cr³⁺ + 3e⁻ ⇌ Cr", tex: "\\mathrm{Cr^{3+} + 3e^- \\rightleftharpoons Cr}", oxidised: "Cr³⁺", reduced: "Cr", e: -0.74, electrons: 3 },
  { half: "Fe²⁺ + 2e⁻ ⇌ Fe", tex: "\\mathrm{Fe^{2+} + 2e^- \\rightleftharpoons Fe}", oxidised: "Fe²⁺", reduced: "Fe", e: -0.44, electrons: 2 },
  { half: "Cd²⁺ + 2e⁻ ⇌ Cd", tex: "\\mathrm{Cd^{2+} + 2e^- \\rightleftharpoons Cd}", oxidised: "Cd²⁺", reduced: "Cd", e: -0.4, electrons: 2 },
  { half: "Co²⁺ + 2e⁻ ⇌ Co", tex: "\\mathrm{Co^{2+} + 2e^- \\rightleftharpoons Co}", oxidised: "Co²⁺", reduced: "Co", e: -0.28, electrons: 2 },
  { half: "Ni²⁺ + 2e⁻ ⇌ Ni", tex: "\\mathrm{Ni^{2+} + 2e^- \\rightleftharpoons Ni}", oxidised: "Ni²⁺", reduced: "Ni", e: -0.27, electrons: 2 },
  { half: "Sn²⁺ + 2e⁻ ⇌ Sn", tex: "\\mathrm{Sn^{2+} + 2e^- \\rightleftharpoons Sn}", oxidised: "Sn²⁺", reduced: "Sn", e: -0.14, electrons: 2 },
  { half: "Pb²⁺ + 2e⁻ ⇌ Pb", tex: "\\mathrm{Pb^{2+} + 2e^- \\rightleftharpoons Pb}", oxidised: "Pb²⁺", reduced: "Pb", e: -0.13, electrons: 2 },
  { half: "2H⁺ + 2e⁻ ⇌ H₂", tex: "\\mathrm{2H^+ + 2e^- \\rightleftharpoons H_2}", oxidised: "H⁺", reduced: "H₂", e: 0, electrons: 2 },
  { half: "Cu²⁺ + 2e⁻ ⇌ Cu", tex: "\\mathrm{Cu^{2+} + 2e^- \\rightleftharpoons Cu}", oxidised: "Cu²⁺", reduced: "Cu", e: 0.34, electrons: 2 },
  { half: "I₂ + 2e⁻ ⇌ 2I⁻", tex: "\\mathrm{I_2 + 2e^- \\rightleftharpoons 2I^-}", oxidised: "I₂", reduced: "I⁻", e: 0.54, electrons: 2 },
  { half: "Fe³⁺ + e⁻ ⇌ Fe²⁺", tex: "\\mathrm{Fe^{3+} + e^- \\rightleftharpoons Fe^{2+}}", oxidised: "Fe³⁺", reduced: "Fe²⁺", e: 0.77, electrons: 1 },
  { half: "Ag⁺ + e⁻ ⇌ Ag", tex: "\\mathrm{Ag^+ + e^- \\rightleftharpoons Ag}", oxidised: "Ag⁺", reduced: "Ag", e: 0.8, electrons: 1 },
  { half: "Br₂ + 2e⁻ ⇌ 2Br⁻", tex: "\\mathrm{Br_2 + 2e^- \\rightleftharpoons 2Br^-}", oxidised: "Br₂", reduced: "Br⁻", e: 1.07, electrons: 2 },
  { half: "Pt²⁺ + 2e⁻ ⇌ Pt", tex: "\\mathrm{Pt^{2+} + 2e^- \\rightleftharpoons Pt}", oxidised: "Pt²⁺", reduced: "Pt", e: 1.2, electrons: 2 },
  { half: "Cl₂ + 2e⁻ ⇌ 2Cl⁻", tex: "\\mathrm{Cl_2 + 2e^- \\rightleftharpoons 2Cl^-}", oxidised: "Cl₂", reduced: "Cl⁻", e: 1.36, electrons: 2 },
  { half: "Au³⁺ + 3e⁻ ⇌ Au", tex: "\\mathrm{Au^{3+} + 3e^- \\rightleftharpoons Au}", oxidised: "Au³⁺", reduced: "Au", e: 1.5, electrons: 3 },
  { half: "F₂ + 2e⁻ ⇌ 2F⁻", tex: "\\mathrm{F_2 + 2e^- \\rightleftharpoons 2F^-}", oxidised: "F₂", reduced: "F⁻", e: 2.87, electrons: 2 },
];

/** Skeleton equations with their balancing coefficients – used by the balancer widget and the generator. */
export const EQUATIONS: { reactants: string[]; products: string[]; coeffs: number[]; label: string }[] = [
  { reactants: ["H2", "O2"], products: ["H2O"], coeffs: [2, 1, 2], label: "Hydrogen burns in oxygen" },
  { reactants: ["N2", "H2"], products: ["NH3"], coeffs: [1, 3, 2], label: "The Haber process" },
  { reactants: ["Mg", "O2"], products: ["MgO"], coeffs: [2, 1, 2], label: "Magnesium burns" },
  { reactants: ["CH4", "O2"], products: ["CO2", "H2O"], coeffs: [1, 2, 1, 2], label: "Methane burns" },
  { reactants: ["C3H8", "O2"], products: ["CO2", "H2O"], coeffs: [1, 5, 3, 4], label: "Propane (gas braai) burns" },
  { reactants: ["Na", "Cl2"], products: ["NaCl"], coeffs: [2, 1, 2], label: "Making table salt" },
  { reactants: ["Fe", "O2"], products: ["Fe2O3"], coeffs: [4, 3, 2], label: "Iron rusts" },
  { reactants: ["Al", "O2"], products: ["Al2O3"], coeffs: [4, 3, 2], label: "Aluminium oxidises" },
  { reactants: ["Zn", "HCl"], products: ["ZnCl2", "H2"], coeffs: [1, 2, 1, 1], label: "Zinc in hydrochloric acid" },
  { reactants: ["CaCO3", "HCl"], products: ["CaCl2", "H2O", "CO2"], coeffs: [1, 2, 1, 1, 1], label: "Limestone and acid" },
  { reactants: ["NaOH", "H2SO4"], products: ["Na2SO4", "H2O"], coeffs: [2, 1, 1, 2], label: "Neutralisation" },
  { reactants: ["C6H12O6", "O2"], products: ["CO2", "H2O"], coeffs: [1, 6, 6, 6], label: "Respiration" },
  { reactants: ["CO2", "H2O"], products: ["C6H12O6", "O2"], coeffs: [6, 6, 1, 6], label: "Photosynthesis" },
  { reactants: ["KClO3"], products: ["KCl", "O2"], coeffs: [2, 2, 3], label: "Heating potassium chlorate" },
  { reactants: ["H2O2"], products: ["H2O", "O2"], coeffs: [2, 2, 1], label: "Hydrogen peroxide decomposes" },
  { reactants: ["C2H6", "O2"], products: ["CO2", "H2O"], coeffs: [2, 7, 4, 6], label: "Ethane burns" },
  { reactants: ["Fe2O3", "CO"], products: ["Fe", "CO2"], coeffs: [1, 3, 2, 3], label: "The blast furnace" },
  { reactants: ["NH3", "O2"], products: ["NO", "H2O"], coeffs: [4, 5, 4, 6], label: "The Ostwald process (step 1)" },
  { reactants: ["SO2", "O2"], products: ["SO3"], coeffs: [2, 1, 2], label: "The contact process" },
  { reactants: ["AgNO3", "NaCl"], products: ["AgCl", "NaNO3"], coeffs: [1, 1, 1, 1], label: "A precipitation reaction" },
  { reactants: ["Pb(NO3)2", "KI"], products: ["PbI2", "KNO3"], coeffs: [1, 2, 1, 2], label: "Golden rain" },
  { reactants: ["Ca(OH)2", "HNO3"], products: ["Ca(NO3)2", "H2O"], coeffs: [1, 2, 1, 2], label: "Lime neutralises nitric acid" },
];

/** First ionisation energies (kJ·mol⁻¹) for Z = 1–56 (used to show the trends). */
export const IONISATION: number[] = [
  1312, 2372, 520, 900, 801, 1086, 1402, 1314, 1681, 2081, 496, 738, 578, 787, 1012, 1000, 1251, 1521, 419, 590,
  633, 659, 651, 653, 717, 762, 760, 737, 745, 906, 579, 762, 947, 941, 1140, 1351, 403, 550, 600, 640,
  652, 684, 702, 710, 720, 804, 731, 868, 558, 709, 834, 869, 1008, 1170, 376, 503,
];

/** Covalent (atomic) radii in pm for Z = 1–56. */
export const RADIUS: number[] = [
  31, 28, 128, 96, 84, 76, 71, 66, 57, 58, 166, 141, 121, 111, 107, 105, 102, 106, 203, 176,
  170, 160, 153, 139, 139, 132, 126, 124, 132, 122, 122, 120, 119, 120, 120, 116, 220, 195, 190, 175,
  164, 154, 147, 146, 142, 139, 145, 144, 142, 139, 139, 138, 139, 140, 244, 215,
];

/** State at room temperature (25 °C). */
export function stateAtRoomTemp(symbol: string): "gas" | "liquid" | "solid" {
  if (["H", "He", "N", "O", "F", "Ne", "Cl", "Ar", "Kr", "Xe", "Rn"].includes(symbol)) return "gas";
  if (["Br", "Hg"].includes(symbol)) return "liquid";
  return "solid";
}

/** s, p, d or f block. */
export function blockOf(e: Element): "s" | "p" | "d" | "f" {
  if (e.category === "lanthanide" || e.category === "actinide") return "f";
  if (e.group <= 2 || e.z === 2) return "s";
  if (e.group >= 13) return "p";
  return "d";
}
