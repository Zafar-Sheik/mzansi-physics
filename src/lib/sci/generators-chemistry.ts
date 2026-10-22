/**
 * Chemistry problem generators (Paper 2). Deterministic for a seed, each with a
 * full worked solution.
 */
import { seededRandom } from "@/lib/utils";
import { ans, CONST, round, sciAns, sciTex, tex } from "./numbers";
import { atomCounts, configText, element, elementByZ, EQUATIONS, formulaTex, ionicFormula, IONS, molarMass, REDUCTION_POTENTIALS, splitCharge } from "./chem";
import { acceptedNames, condensed, iupacName, isValid, type Molecule, type Sub } from "./organic";
import { type Generator, int, pick, step } from "./gen-kit";

const f = formulaTex;

/** "M(H2O) = 2(1) + 16 = 18 g·mol⁻¹" */
function molarWorking(formula: string): string {
  const counts = atomCounts(formula);
  const parts = Object.entries(counts).map(([el, n]) => `${n > 1 ? `${n}(${tex(element(el)!.mass)})` : tex(element(el)!.mass)}`);
  return `M(${f(formula)}) = ${parts.join(" + ")} = ${tex(molarMass(formula))}\\ \\text{g·mol}^{-1}`;
}

const COMPOUNDS = ["H2O", "CO2", "NaCl", "NaOH", "HCl", "H2SO4", "CaCO3", "NH3", "CH4", "C6H12O6", "MgO", "KMnO4", "CuSO4", "Na2CO3", "HNO3", "Ca(OH)2", "Al2O3", "Fe2O3", "C2H5OH", "(NH4)2SO4", "MgCl2", "KCl", "AgNO3", "CuSO4·5H2O"];

// ------------------------------------------------------------ Grade 10 atom
const atomCount: Generator = {
  id: "atom-count",
  title: "Protons, neutrons & electrons",
  topic: "g10-atom",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const z = int(r, 1, 30);
    const el = elementByZ(z);
    const A = Math.round(el.mass) + pick(r, [0, 0, 0, 1, 2]);
    const charge = z <= 20 && r() < 0.4 ? (el.group <= 2 ? el.group : el.group >= 15 && el.group <= 17 ? el.group - 18 : 0) : 0;
    const what = pick(r, ["protons", "neutrons", "electrons"] as const);
    const value = what === "protons" ? z : what === "neutrons" ? A - z : z - charge;
    const sym = `{}^{${A}}_{${z}}\\mathrm{${el.symbol}}${charge ? `^{${Math.abs(charge) > 1 ? Math.abs(charge) : ""}${charge > 0 ? "+" : "-"}}` : ""}`;
    return {
      q: `How many **${what}** are in $${sym}$?`,
      answer: String(value),
      hint: what === "protons" ? "The atomic number (bottom) is the number of protons." : what === "neutrons" ? "Neutrons = mass number (top) − atomic number (bottom)." : "A neutral atom has as many electrons as protons. A positive ion has **lost** electrons; a negative ion has **gained** them.",
      solution: what === "protons"
        ? `Atomic number $Z = ${z}$, so there are **${z} protons**.`
        : what === "neutrons"
          ? `$$N = A - Z = ${A} - ${z} = ${A - z}$$`
          : charge === 0
            ? `A neutral atom: electrons = protons = **${z}**.`
            : `Protons $= ${z}$. The charge is $${charge > 0 ? "+" : ""}${charge}$, so the ion has ${charge > 0 ? `lost ${charge}` : `gained ${-charge}`} electron${Math.abs(charge) > 1 ? "s" : ""}: $${z} ${charge > 0 ? "-" : "+"} ${Math.abs(charge)} = ${value}$ electrons.`,
    };
  },
};

const electronConfiguration: Generator = {
  id: "electron-config",
  title: "Electron configurations",
  topic: "g10-atom",
  make(seed) {
    const r = seededRandom(seed);
    const z = int(r, 3, 20);
    const el = elementByZ(z);
    const ion = r() < 0.3 && (el.group <= 2 || (el.group >= 16 && el.group <= 17));
    const charge = ion ? (el.group <= 2 ? el.group : el.group - 18) : 0;
    const e = z - charge;
    const name = ion ? `the ${el.symbol}${charge > 0 ? `${charge > 1 ? charge : ""}+` : `${-charge > 1 ? -charge : ""}-`} ion` : `${el.name.toLowerCase()} (Z = ${z})`;
    const cfg = configText(e);
    return {
      q: `Write the electron configuration (sp notation) of ${name}.`,
      answer: cfg,
      kind: "text",
      hint: `Count the electrons (${ion ? "protons ± the charge" : "= the atomic number"}), then fill 1s, 2s, 2p, 3s, 3p, 4s… Each s holds 2 and each p holds 6. Type it like 1s2 2s2 2p6.`,
      solution: `${ion ? `${el.name} has ${z} protons; the ion has ${e} electrons.` : `${el.name} has ${z} electrons.`}\n\n**${cfg}**`,
    };
  },
};

// ------------------------------------------------------------ Grade 10 bonding
const ionicFormulae: Generator = {
  id: "ionic-formula",
  title: "Formulae from ions",
  topic: "g10-bonding",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const cations = IONS.filter((i) => i.charge > 0 && i.formula !== "H+");
    const anions = IONS.filter((i) => i.charge < 0 && !["MnO4-", "CH3COO-", "Cr2O7 2-", "HCO3-", "SO3 2-", "N3-"].includes(i.formula));
    const c = pick(r, cations);
    const a = pick(r, anions);
    const strip = (s: string) => splitCharge(s).body;
    const formula = ionicFormula(strip(c.formula), c.charge, strip(a.formula), a.charge);
    const name = `${c.name} ${a.name}`;
    return {
      q: `Write the chemical formula of **${name}**.`,
      answer: formula,
      kind: "formula",
      hint: `${c.name} is $${f(c.formula)}$ and ${a.name} is $${f(a.formula)}$. Swap the charges to balance them (cross-multiply the valencies) and use brackets around a polyatomic ion that appears more than once.`,
      solution: `Ions: $${f(c.formula)}$ and $${f(a.formula)}$. The total positive charge must equal the total negative charge.\n\n$$${f(formula)}$$`,
    };
  },
};

// ------------------------------------------------------------ Grade 10 change
const balance: Generator = {
  id: "balance",
  title: "Balancing equations",
  topic: "g10-change",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const eq = pick(r, EQUATIONS);
    const side = (xs: string[]) => xs.map((x) => `\\square\\,${f(x)}`).join(" + ");
    const done = (xs: string[], cs: number[]) => xs.map((x, i) => `${cs[i] === 1 ? "" : cs[i]}${f(x)}`).join(" + ");
    const nr = eq.reactants.length;
    return {
      q: `${eq.label}. Balance the equation – give the coefficients in order, separated by “;” (use 1 where no number is needed):\n$$${side(eq.reactants)} \\rightarrow ${side(eq.products)}$$`,
      answer: eq.coeffs.join("; "),
      kind: "list",
      hint: "Balance one element at a time – leave H and O (or a lone element like O₂) until last. Never change the small numbers inside a formula.",
      solution: `$$${done(eq.reactants, eq.coeffs.slice(0, nr))} \\rightarrow ${done(eq.products, eq.coeffs.slice(nr))}$$\nCount each kind of atom on both sides to check: they must be equal.`,
    };
  },
};

// ------------------------------------------------------------ Grade 10 mole
const moles: Generator = {
  id: "moles",
  title: "Moles, mass & particles",
  topic: "g10-mole",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const cmp = pick(r, COMPOUNDS);
    const M = molarMass(cmp);
    const t = int(r, 0, 3);
    if (t === 0) {
      return {
        q: `Calculate the molar mass of $${f(cmp)}$.`,
        answer: ans(M),
        unit: "g·mol⁻¹",
        hint: "Add up the relative atomic masses from the periodic table – multiply each by the number of atoms.",
        solution: `$$${molarWorking(cmp)}$$`,
      };
    }
    if (t === 1) {
      const m = round(M * step(r, 0.1, 5, 0.1), 1);
      const n = m / M;
      return {
        q: `How many moles are in $${tex(m, 1)}\\ \\text{g}$ of $${f(cmp)}$?`,
        answer: ans(n, 3),
        unit: "mol",
        hint: "$n = \\frac{m}{M}$ – work out the molar mass first.",
        solution: `$$${molarWorking(cmp)}$$\n$$n = \\frac{m}{M} = \\frac{${tex(m, 1)}}{${tex(M)}} = ${tex(n, 3)}\\ \\text{mol}$$`,
      };
    }
    if (t === 2) {
      const n = step(r, 0.1, 4, 0.05);
      const m = n * M;
      return {
        q: `Calculate the mass of $${tex(n)}\\ \\text{mol}$ of $${f(cmp)}$.`,
        answer: ans(m),
        unit: "g",
        hint: "$m = nM$",
        solution: `$$${molarWorking(cmp)}$$\n$$m = nM = (${tex(n)})(${tex(M)}) = ${tex(m)}\\ \\text{g}$$`,
      };
    }
    const n = step(r, 0.1, 3, 0.1);
    const N = n * CONST.NA;
    return {
      q: `How many molecules (or formula units) are in $${tex(n)}\\ \\text{mol}$ of $${f(cmp)}$?`,
      answer: sciAns(N),
      unit: "particles",
      hint: "$N = nN_A$ with $N_A = 6{,}02 \\times 10^{23}\\ \\text{mol}^{-1}$.",
      solution: `$$N = nN_A = (${tex(n)})(6{,}02 \\times 10^{23}) = ${sciTex(N)}$$`,
    };
  },
};

const concentration: Generator = {
  id: "concentration",
  title: "Concentration",
  topic: "g10-mole",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const cmp = pick(r, ["NaCl", "NaOH", "KMnO4", "CuSO4", "Na2CO3", "KCl", "MgCl2", "AgNO3"]);
    const M = molarMass(cmp);
    const V = pick(r, [100, 200, 250, 500, 1000]);
    const t = int(r, 0, 1);
    if (t === 0) {
      const m = round(M * step(r, 0.05, 1, 0.05), 2);
      const c = m / M / (V / 1000);
      return {
        q: `$${tex(m)}\\ \\text{g}$ of $${f(cmp)}$ is dissolved in water to make $${V}\\ \\text{cm}^3$ of solution. Calculate the concentration.`,
        answer: ans(c, 3),
        unit: "mol·dm⁻³",
        hint: "$c = \\frac{m}{MV}$ with $V$ in dm³ ($1\\ \\text{dm}^3 = 1\\,000\\ \\text{cm}^3$).",
        solution: `$$${molarWorking(cmp)}$$\n$$c = \\frac{m}{MV} = \\frac{${tex(m)}}{(${tex(M)})(${tex(V / 1000, 3)})} = ${tex(c, 3)}\\ \\text{mol·dm}^{-3}$$`,
      };
    }
    const c = step(r, 0.05, 2, 0.05);
    const m = c * (V / 1000) * M;
    return {
      q: `What mass of $${f(cmp)}$ is needed to make $${V}\\ \\text{cm}^3$ of a $${tex(c)}\\ \\text{mol·dm}^{-3}$ solution?`,
      answer: ans(m),
      unit: "g",
      hint: "$n = cV$ (V in dm³), then $m = nM$.",
      solution: `$$n = cV = (${tex(c)})(${tex(V / 1000, 3)}) = ${tex(c * (V / 1000), 4)}\\ \\text{mol}$$\n$$${molarWorking(cmp)}$$\n$$m = nM = (${tex(c * (V / 1000), 4)})(${tex(M)}) = ${tex(m)}\\ \\text{g}$$`,
    };
  },
};

const percentComposition: Generator = {
  id: "percent-composition",
  title: "Percentage composition",
  topic: "g10-mole",
  make(seed) {
    const r = seededRandom(seed);
    const cmp = pick(r, ["H2O", "CO2", "NaCl", "CaCO3", "NH3", "CH4", "MgO", "H2SO4", "Fe2O3", "C6H12O6", "NH4NO3", "(NH4)2SO4", "CuSO4·5H2O"]);
    const counts = atomCounts(cmp);
    const els = Object.keys(counts);
    const water = cmp.includes("·") && r() < 0.6;
    const M = molarMass(cmp);
    if (water) {
      const mw = 5 * molarMass("H2O");
      const p = (mw / M) * 100;
      return {
        q: `Calculate the percentage by mass of water of crystallisation in $${f(cmp)}$.`,
        answer: ans(p),
        unit: "%",
        hint: "Mass of the water in one mole ÷ molar mass of the whole hydrate × 100.",
        solution: `$$M = ${tex(M)}\\ \\text{g·mol}^{-1}, \\quad m(5\\mathrm{H_2O}) = 5 \\times 18 = 90\\ \\text{g}$$\n$$\\%\\mathrm{H_2O} = \\frac{90}{${tex(M)}} \\times 100 = ${tex(p)}\\%$$`,
      };
    }
    const el = pick(r, els);
    const part = counts[el] * element(el)!.mass;
    const p = (part / M) * 100;
    return {
      q: `Calculate the percentage by mass of **${element(el)!.name.toLowerCase()}** in $${f(cmp)}$.`,
      answer: ans(p),
      unit: "%",
      hint: "$\\%\\ \\text{element} = \\frac{\\text{mass of that element in 1 mol}}{M} \\times 100$",
      solution: `$$${molarWorking(cmp)}$$\n$$\\%\\mathrm{${el}} = \\frac{${counts[el]} \\times ${tex(element(el)!.mass)}}{${tex(M)}} \\times 100 = ${tex(p)}\\%$$`,
    };
  },
};

const empirical: Generator = {
  id: "empirical",
  title: "Empirical formulae",
  topic: "g10-mole",
  make(seed) {
    const r = seededRandom(seed);
    const [formula, emp, alts] = pick(r, [
      ["C6H12O6", "CH2O", []], ["C2H6", "CH3", []], ["C2H4", "CH2", []], ["H2O2", "HO", ["OH"]], ["N2O4", "NO2", []], ["C4H10", "C2H5", []],
      ["P4O10", "P2O5", []], ["Fe2O3", "Fe2O3", []], ["MgO", "MgO", []], ["C3H8", "C3H8", []], ["C6H6", "CH", []], ["Na2O", "Na2O", []],
    ] as const);
    const counts = atomCounts(formula);
    const M = molarMass(formula);
    const pct = Object.entries(counts).map(([el, n]) => [el, (n * element(el)!.mass * 100) / M] as const);
    const shown = pct.map(([el, p]) => `${tex(p, 1)}\\%\\ \\mathrm{${el}}`).join(", ");
    const molesTex = pct.map(([el, p]) => `$$n(\\mathrm{${el}}) = \\frac{${tex(p, 1)}}{${tex(element(el)!.mass)}} = ${tex(p / element(el)!.mass, 3)}\\ \\text{mol}$$`).join("\n");
    const min = Math.min(...pct.map(([el, p]) => p / element(el)!.mass));
    const ratio = pct.map(([el, p]) => `${tex(p / element(el)!.mass / min, 2)}`).join(" : ");
    return {
      q: `A compound contains $${shown}$ by mass. Determine its empirical formula.`,
      answer: [emp, ...alts].join(" | "),
      kind: "formula",
      hint: "Assume 100 g, so each percentage is a mass in grams. Convert each to moles ($n = m/M$), then divide by the smallest number of moles.",
      solution: `Assume 100 g of compound.\n${molesTex}\nDivide by the smallest ($${tex(min, 3)}$): ratio $${ratio}$ → round to whole numbers (multiply up if you get halves).\n\nEmpirical formula: $${f(emp)}$`,
    };
  },
};

// ------------------------------------------------------------ Grade 11
const enDifference: Generator = {
  id: "en-difference",
  title: "Electronegativity & bond type",
  topic: "g11-molecules",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const [a, b] = pick(r, [["H", "Cl"], ["H", "F"], ["H", "O"], ["C", "H"], ["N", "H"], ["Na", "Cl"], ["C", "O"], ["H", "Br"], ["K", "F"], ["Mg", "O"], ["C", "Cl"], ["H", "H"], ["O", "O"], ["S", "O"], ["Ca", "Cl"]] as const);
    const d = Math.abs(element(a)!.en! - element(b)!.en!);
    const type = d === 0 ? "non-polar covalent" : d <= 1 ? "weakly polar covalent" : d <= 2.1 ? "strongly polar covalent" : "ionic";
    return {
      q: `Calculate the electronegativity difference ($\\Delta EN$) for the bond between ${a} and ${b}, using the periodic table.`,
      answer: ans(d, 1),
      tol: 0.001,
      hint: "Subtract the smaller electronegativity from the bigger one.",
      solution: `$$\\Delta EN = |${tex(element(a)!.en!, 1)} - ${tex(element(b)!.en!, 1)}| = ${tex(d, 1)}$$\nSo the ${a}–${b} bond is **${type}** (0 non-polar, < 1 weakly polar, 1–2,1 strongly polar, > 2,1 ionic).`,
    };
  },
};

const gasLaws: Generator = {
  id: "gas-laws",
  title: "The gas laws",
  topic: "g11-gases",
  make(seed) {
    const r = seededRandom(seed);
    const t = int(r, 0, 3);
    if (t === 0) {
      const p1 = pick(r, [100, 101.3, 120, 150, 200]);
      const V1 = int(r, 2, 20);
      const V2 = int(r, 1, 30);
      const p2 = (p1 * V1) / V2;
      return {
        q: `A gas at $${tex(p1)}\\ \\text{kPa}$ occupies $${V1}\\ \\text{dm}^3$. The volume changes to $${V2}\\ \\text{dm}^3$ at constant temperature. Calculate the new pressure.`,
        answer: ans(p2),
        unit: "kPa",
        hint: "Boyle's law: $p_1V_1 = p_2V_2$ (constant T).",
        solution: `$$p_1V_1 = p_2V_2 \\;\\Rightarrow\\; (${tex(p1)})(${V1}) = p_2(${V2}) \\;\\Rightarrow\\; p_2 = ${tex(p2)}\\ \\text{kPa}$$`,
      };
    }
    if (t === 1) {
      const V1 = int(r, 2, 20);
      const T1c = int(r, 0, 40);
      const T2c = int(r, 50, 200);
      const V2 = (V1 * (T2c + 273)) / (T1c + 273);
      return {
        q: `A gas occupies $${V1}\\ \\text{dm}^3$ at $${T1c}\\ ^\\circ\\text{C}$. It is heated to $${T2c}\\ ^\\circ\\text{C}$ at constant pressure. Calculate the new volume.`,
        answer: ans(V2),
        unit: "dm³",
        hint: "Charles' law: $\\frac{V_1}{T_1} = \\frac{V_2}{T_2}$ – temperatures **must** be in kelvin ($T = \\theta + 273$).",
        solution: `$$T_1 = ${T1c} + 273 = ${T1c + 273}\\ \\text{K}, \\quad T_2 = ${T2c} + 273 = ${T2c + 273}\\ \\text{K}$$\n$$V_2 = \\frac{V_1T_2}{T_1} = \\frac{(${V1})(${T2c + 273})}{${T1c + 273}} = ${tex(V2)}\\ \\text{dm}^3$$`,
      };
    }
    if (t === 2) {
      const n = step(r, 0.1, 3, 0.1);
      const Tc = int(r, 0, 100);
      const V = int(r, 1, 50); // dm³
      const p = (n * CONST.R * (Tc + 273)) / (V / 1000);
      return {
        q: `$${tex(n)}\\ \\text{mol}$ of an ideal gas is kept in a $${V}\\ \\text{dm}^3$ container at $${Tc}\\ ^\\circ\\text{C}$. Calculate the pressure of the gas (in Pa).`,
        answer: ans(p, 0),
        unit: "Pa",
        hint: "$pV = nRT$ in SI units: V in m³ ($1\\ \\text{dm}^3 = 10^{-3}\\ \\text{m}^3$), T in K, $R = 8{,}31\\ \\text{J·K}^{-1}\\text{·mol}^{-1}$.",
        solution: `$$V = ${V} \\times 10^{-3}\\ \\text{m}^3, \\quad T = ${Tc + 273}\\ \\text{K}$$\n$$p = \\frac{nRT}{V} = \\frac{(${tex(n)})(8{,}31)(${Tc + 273})}{${tex(V / 1000, 3)}} = ${tex(p, 0)}\\ \\text{Pa}$$`,
      };
    }
    const p1 = pick(r, [100, 120, 150]);
    const T1c = int(r, 10, 30);
    const T2c = int(r, 60, 150);
    const p2 = (p1 * (T2c + 273)) / (T1c + 273);
    return {
      q: `A sealed can holds gas at $${p1}\\ \\text{kPa}$ and $${T1c}\\ ^\\circ\\text{C}$. It is heated to $${T2c}\\ ^\\circ\\text{C}$. Calculate the new pressure.`,
      answer: ans(p2),
      unit: "kPa",
      hint: "Constant volume: $\\frac{p_1}{T_1} = \\frac{p_2}{T_2}$ with temperatures in kelvin.",
      solution: `$$\\frac{${p1}}{${T1c + 273}} = \\frac{p_2}{${T2c + 273}} \\;\\Rightarrow\\; p_2 = ${tex(p2)}\\ \\text{kPa}$$`,
    };
  },
};

const REACTIONS: { eq: string; a: string; b: string; ra: number; rb: number; gasB?: boolean }[] = [
  { eq: "CaCO_3 \\rightarrow CaO + CO_2", a: "CaCO3", b: "CaO", ra: 1, rb: 1 },
  { eq: "CaCO_3 \\rightarrow CaO + CO_2", a: "CaCO3", b: "CO2", ra: 1, rb: 1, gasB: true },
  { eq: "2Mg + O_2 \\rightarrow 2MgO", a: "Mg", b: "MgO", ra: 2, rb: 2 },
  { eq: "N_2 + 3H_2 \\rightarrow 2NH_3", a: "H2", b: "NH3", ra: 3, rb: 2 },
  { eq: "Zn + 2HCl \\rightarrow ZnCl_2 + H_2", a: "Zn", b: "H2", ra: 1, rb: 1, gasB: true },
  { eq: "2H_2O_2 \\rightarrow 2H_2O + O_2", a: "H2O2", b: "O2", ra: 2, rb: 1, gasB: true },
  { eq: "Fe_2O_3 + 3CO \\rightarrow 2Fe + 3CO_2", a: "Fe2O3", b: "Fe", ra: 1, rb: 2 },
  { eq: "2NaHCO_3 \\rightarrow Na_2CO_3 + H_2O + CO_2", a: "NaHCO3", b: "Na2CO3", ra: 2, rb: 1 },
  { eq: "CH_4 + 2O_2 \\rightarrow CO_2 + 2H_2O", a: "CH4", b: "H2O", ra: 1, rb: 2 },
];

const stoichiometry: Generator = {
  id: "stoichiometry",
  title: "Reacting masses & yield",
  topic: "g11-stoichiometry",
  make(seed) {
    const r = seededRandom(seed);
    const rx = pick(r, REACTIONS);
    const Ma = molarMass(rx.a);
    const Mb = molarMass(rx.b);
    const ma = round(Ma * step(r, 0.2, 3, 0.1), 1);
    const na = ma / Ma;
    const nb = (na * rx.rb) / rx.ra;
    const t = rx.gasB ? int(r, 0, 2) : pick(r, [0, 2]);
    if (t === 1) {
      const V = nb * CONST.Vm;
      return {
        q: `$$\\mathrm{${rx.eq}}$$\nCalculate the volume of $${f(rx.b)}$ produced at STP when $${tex(ma, 1)}\\ \\text{g}$ of $${f(rx.a)}$ reacts completely.`,
        answer: ans(V),
        unit: "dm³",
        hint: "Mass → moles of the reactant → mole ratio → moles of gas → $V = nV_m$ with $V_m = 22{,}4\\ \\text{dm}^3\\text{·mol}^{-1}$ at STP.",
        solution: `$$n(${f(rx.a)}) = \\frac{m}{M} = \\frac{${tex(ma, 1)}}{${tex(Ma)}} = ${tex(na, 4)}\\ \\text{mol}$$\nMole ratio ${f(rx.a)} : ${f(rx.b)} = ${rx.ra} : ${rx.rb}\n$$n(${f(rx.b)}) = ${tex(nb, 4)}\\ \\text{mol}$$\n$$V = nV_m = (${tex(nb, 4)})(22{,}4) = ${tex(V)}\\ \\text{dm}^3$$`,
      };
    }
    const mb = nb * Mb;
    if (t === 2) {
      const yieldPct = int(r, 55, 95);
      const actual = round((mb * yieldPct) / 100, 2);
      const pct = (actual / mb) * 100;
      return {
        q: `$$\\mathrm{${rx.eq}}$$\n$${tex(ma, 1)}\\ \\text{g}$ of $${f(rx.a)}$ reacts and $${tex(actual)}\\ \\text{g}$ of $${f(rx.b)}$ is collected. Calculate the percentage yield.`,
        answer: ans(pct),
        unit: "%",
        rtol: 0.015,
        hint: "First calculate the theoretical (maximum) mass of product, then % yield $= \\frac{\\text{actual}}{\\text{theoretical}} \\times 100$.",
        solution: `$$n(${f(rx.a)}) = \\frac{${tex(ma, 1)}}{${tex(Ma)}} = ${tex(na, 4)}\\ \\text{mol} \\;\\Rightarrow\\; n(${f(rx.b)}) = ${tex(nb, 4)}\\ \\text{mol}$$\n$$m_{theoretical} = nM = (${tex(nb, 4)})(${tex(Mb)}) = ${tex(mb)}\\ \\text{g}$$\n$$\\%\\ \\text{yield} = \\frac{${tex(actual)}}{${tex(mb)}} \\times 100 = ${tex(pct)}\\%$$`,
      };
    }
    return {
      q: `$$\\mathrm{${rx.eq}}$$\nCalculate the mass of $${f(rx.b)}$ that forms when $${tex(ma, 1)}\\ \\text{g}$ of $${f(rx.a)}$ reacts completely.`,
      answer: ans(mb),
      unit: "g",
      hint: "Mass → moles ($n = m/M$) → use the mole ratio from the balanced equation → mass ($m = nM$).",
      solution: `$$n(${f(rx.a)}) = \\frac{${tex(ma, 1)}}{${tex(Ma)}} = ${tex(na, 4)}\\ \\text{mol}$$\nMole ratio ${f(rx.a)} : ${f(rx.b)} = ${rx.ra} : ${rx.rb}, so $n(${f(rx.b)}) = ${tex(nb, 4)}\\ \\text{mol}$\n$$m = nM = (${tex(nb, 4)})(${tex(Mb)}) = ${tex(mb)}\\ \\text{g}$$`,
    };
  },
};

const enthalpy: Generator = {
  id: "enthalpy",
  title: "ΔH from energy profiles",
  topic: "g11-energy-change",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const Er = int(r, 10, 300);
    const Ep = int(r, 10, 300);
    const peak = Math.max(Er, Ep) + int(r, 20, 150);
    const askEa = r() < 0.4;
    const dH = Ep - Er;
    const Ea = peak - Er;
    return {
      q: `On an energy profile the reactants have a potential energy of $${Er}\\ \\text{kJ·mol}^{-1}$, the activated complex $${peak}\\ \\text{kJ·mol}^{-1}$ and the products $${Ep}\\ \\text{kJ·mol}^{-1}$. Calculate ${askEa ? "the activation energy" : "$\\Delta H$"}.`,
      answer: String(askEa ? Ea : dH),
      unit: "kJ·mol⁻¹",
      hint: askEa ? "Activation energy = activated complex − reactants." : "$\\Delta H = E_{products} - E_{reactants}$. Negative means exothermic.",
      solution: askEa
        ? `$$E_a = ${peak} - ${Er} = ${Ea}\\ \\text{kJ·mol}^{-1}$$`
        : `$$\\Delta H = E_p - E_r = ${Ep} - ${Er} = ${dH}\\ \\text{kJ·mol}^{-1}$$\n${dH < 0 ? "Negative: energy is released – the reaction is **exothermic**." : dH > 0 ? "Positive: energy is absorbed – the reaction is **endothermic**." : "Zero: neither exothermic nor endothermic."}`,
    };
  },
};

const OX: { species: string; el: string; value: number; working: string }[] = [
  { species: "H2SO4", el: "S", value: 6, working: "2(+1) + x + 4(−2) = 0" },
  { species: "SO2", el: "S", value: 4, working: "x + 2(−2) = 0" },
  { species: "H2S", el: "S", value: -2, working: "2(+1) + x = 0" },
  { species: "KMnO4", el: "Mn", value: 7, working: "(+1) + x + 4(−2) = 0" },
  { species: "MnO2", el: "Mn", value: 4, working: "x + 2(−2) = 0" },
  { species: "Cr2O7 2-", el: "Cr", value: 6, working: "2x + 7(−2) = −2" },
  { species: "NH3", el: "N", value: -3, working: "x + 3(+1) = 0" },
  { species: "HNO3", el: "N", value: 5, working: "(+1) + x + 3(−2) = 0" },
  { species: "NO2", el: "N", value: 4, working: "x + 2(−2) = 0" },
  { species: "NH4+", el: "N", value: -3, working: "x + 4(+1) = +1" },
  { species: "CO2", el: "C", value: 4, working: "x + 2(−2) = 0" },
  { species: "CH4", el: "C", value: -4, working: "x + 4(+1) = 0" },
  { species: "Fe2O3", el: "Fe", value: 3, working: "2x + 3(−2) = 0" },
  { species: "H2O2", el: "O", value: -1, working: "2(+1) + 2x = 0 (peroxide)" },
  { species: "ClO3-", el: "Cl", value: 5, working: "x + 3(−2) = −1" },
  { species: "SO4 2-", el: "S", value: 6, working: "x + 4(−2) = −2" },
];

const oxidationNumber: Generator = {
  id: "oxidation-number",
  title: "Oxidation numbers",
  topic: "g11-reactions",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const o = pick(r, OX);
    return {
      q: `What is the oxidation number of **${o.el}** in $${f(o.species)}$?`,
      answer: String(o.value),
      hint: "H is usually +1 and O is usually −2. The oxidation numbers add up to the charge on the species (0 for a neutral compound).",
      solution: `Let the oxidation number of ${o.el} be $x$: $${o.working.replace(/−/g, "-")}$, so $x = ${o.value > 0 ? "+" : ""}${o.value}$.`,
    };
  },
};

const mining: Generator = {
  id: "ore-grade",
  title: "Ore grades & extraction",
  topic: "g11-lithosphere",
  make(seed) {
    const r = seededRandom(seed);
    const grade = step(r, 2, 12, 0.5); // g per tonne
    const tonnes = int(r, 1, 50) * 100;
    const gold = grade * tonnes;
    const askOz = r() < 0.3;
    return {
      q: askOz
        ? `A mine processes $${tonnes}\\ \\text{t}$ of ore with a grade of $${tex(grade)}\\ \\text{g}$ of gold per tonne. How many kilograms of gold can be extracted (assume 100 % recovery)?`
        : `South African gold ore has a grade of $${tex(grade)}\\ \\text{g·t}^{-1}$. How many grams of gold are in $${tonnes}\\ \\text{t}$ of ore?`,
      answer: askOz ? ans(gold / 1000, 3) : ans(gold),
      unit: askOz ? "kg" : "g",
      hint: "Mass of gold = grade (g per tonne) × number of tonnes.",
      solution: `$$m = (${tex(grade)}\\ \\text{g·t}^{-1})(${tonnes}\\ \\text{t}) = ${tex(gold)}\\ \\text{g}${askOz ? ` = ${tex(gold / 1000, 3)}\\ \\text{kg}` : ""}$$\nThat's why mines must dig, crush and process enormous amounts of rock for a small amount of gold.`,
    };
  },
};

// ------------------------------------------------------------ Grade 12
const rate: Generator = {
  id: "reaction-rate",
  title: "Average reaction rate",
  topic: "g12-rates",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const t = int(r, 0, 1);
    const time = int(r, 10, 120);
    if (t === 0) {
      const m1 = step(r, 2, 10, 0.5);
      const m2 = round(m1 - step(r, 0.5, m1 - 0.5, 0.5), 2);
      const rateV = (m1 - m2) / time;
      return {
        q: `A piece of marble (CaCO₃) has a mass of $${tex(m1)}\\ \\text{g}$. After $${time}\\ \\text{s}$ in excess hydrochloric acid its mass is $${tex(m2)}\\ \\text{g}$. Calculate the average rate at which the marble is used up.`,
        answer: ans(rateV, 4),
        unit: "g·s⁻¹",
        hint: "Rate $= -\\frac{\\Delta m}{\\Delta t}$ for a reactant (a positive number).",
        solution: `$$\\text{rate} = -\\frac{\\Delta m}{\\Delta t} = -\\frac{${tex(m2)} - ${tex(m1)}}{${time}} = ${tex(rateV, 4)}\\ \\text{g·s}^{-1}$$`,
      };
    }
    const V = int(r, 10, 120);
    const rateV = V / time;
    return {
      q: `$${V}\\ \\text{cm}^3$ of hydrogen gas is collected in the first $${time}\\ \\text{s}$ of a reaction. Calculate the average rate of hydrogen production.`,
      answer: ans(rateV, 3),
      unit: "cm³·s⁻¹",
      hint: "Rate $= \\frac{\\Delta V}{\\Delta t}$ for a product.",
      solution: `$$\\text{rate} = \\frac{\\Delta V}{\\Delta t} = \\frac{${V}}{${time}} = ${tex(rateV, 3)}\\ \\text{cm}^3\\text{·s}^{-1}$$`,
    };
  },
};

const kc: Generator = {
  id: "kc",
  title: "Equilibrium constant Kc",
  topic: "g12-equilibrium",
  make(seed) {
    const r = seededRandom(seed);
    const t = int(r, 0, 2);
    if (t === 0) {
      // H2 + I2 ⇌ 2HI
      const h = step(r, 0.1, 1, 0.05);
      const i = step(r, 0.1, 1, 0.05);
      const hi = step(r, 0.2, 3, 0.1);
      const K = (hi * hi) / (h * i);
      return {
        q: `For $\\mathrm{H_2(g) + I_2(g) \\rightleftharpoons 2HI(g)}$ the equilibrium concentrations are $[\\mathrm{H_2}] = ${tex(h)}$, $[\\mathrm{I_2}] = ${tex(i)}$ and $[\\mathrm{HI}] = ${tex(hi)}\\ \\text{mol·dm}^{-3}$. Calculate $K_c$.`,
        answer: ans(K, 3),
        hint: "$K_c = \\frac{[\\text{products}]^{\\text{coefficients}}}{[\\text{reactants}]^{\\text{coefficients}}}$ – the 2 in front of HI becomes a square.",
        solution: `$$K_c = \\frac{[\\mathrm{HI}]^2}{[\\mathrm{H_2}][\\mathrm{I_2}]} = \\frac{(${tex(hi)})^2}{(${tex(h)})(${tex(i)})} = ${tex(K, 3)}$$`,
      };
    }
    if (t === 1) {
      // N2O4 ⇌ 2NO2
      const a = step(r, 0.05, 0.8, 0.05);
      const b = step(r, 0.05, 0.8, 0.05);
      const K = (b * b) / a;
      return {
        q: `For $\\mathrm{N_2O_4(g) \\rightleftharpoons 2NO_2(g)}$ at equilibrium $[\\mathrm{N_2O_4}] = ${tex(a)}\\ \\text{mol·dm}^{-3}$ and $[\\mathrm{NO_2}] = ${tex(b)}\\ \\text{mol·dm}^{-3}$. Calculate $K_c$.`,
        answer: ans(K, 3),
        hint: "$K_c = \\frac{[\\mathrm{NO_2}]^2}{[\\mathrm{N_2O_4}]}$",
        solution: `$$K_c = \\frac{[\\mathrm{NO_2}]^2}{[\\mathrm{N_2O_4}]} = \\frac{(${tex(b)})^2}{${tex(a)}} = ${tex(K, 3)}$$`,
      };
    }
    // ICE table: A + B ⇌ 2C in 1 dm³? Use H2 + I2 ⇌ 2HI starting with equal moles, x reacts
    const n0 = step(r, 0.5, 3, 0.5);
    const V = pick(r, [1, 2]);
    const x = round(n0 * step(r, 0.3, 0.8, 0.1), 2);
    const h = (n0 - x) / V;
    const hi = (2 * x) / V;
    const K = (hi * hi) / (h * h);
    return {
      q: `$${tex(n0)}\\ \\text{mol}$ of $\\mathrm{H_2}$ and $${tex(n0)}\\ \\text{mol}$ of $\\mathrm{I_2}$ are sealed in a $${V}\\ \\text{dm}^3$ flask: $\\mathrm{H_2 + I_2 \\rightleftharpoons 2HI}$. At equilibrium $${tex(2 * x)}\\ \\text{mol}$ of HI is present. Calculate $K_c$.`,
      answer: ans(K, 3),
      rtol: 0.015,
      hint: "Use a table: initial moles → change (use the mole ratio 1 : 1 : 2) → equilibrium moles → divide by the volume → substitute into $K_c$.",
      solution: [
        `| | H₂ | I₂ | HI |`,
        `|---|---|---|---|`,
        `| Initial (mol) | ${tex(n0)} | ${tex(n0)} | 0 |`,
        `| Change (mol) | −${tex(x)} | −${tex(x)} | +${tex(2 * x)} |`,
        `| Equilibrium (mol) | ${tex(n0 - x)} | ${tex(n0 - x)} | ${tex(2 * x)} |`,
        `| Concentration (mol·dm⁻³) | ${tex(h, 3)} | ${tex(h, 3)} | ${tex(hi, 3)} |`,
        ``,
        `$$K_c = \\frac{[\\mathrm{HI}]^2}{[\\mathrm{H_2}][\\mathrm{I_2}]} = \\frac{(${tex(hi, 3)})^2}{(${tex(h, 3)})(${tex(h, 3)})} = ${tex(K, 3)}$$`,
      ].join("\n"),
    };
  },
};

const ph: Generator = {
  id: "ph",
  title: "pH calculations",
  topic: "g12-acids",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const t = int(r, 0, 3);
    const c = pick(r, [0.1, 0.05, 0.01, 0.2, 0.001, 0.5, 0.025]);
    if (t === 0) {
      const p = -Math.log10(c);
      return {
        q: `Calculate the pH of a $${tex(c, 3)}\\ \\text{mol·dm}^{-3}$ hydrochloric acid (HCl) solution.`,
        answer: ans(p),
        tol: 0.011,
        hint: "HCl is a strong acid – it ionises completely, so $[\\mathrm{H_3O^+}] = c$. Then $\\text{pH} = -\\log[\\mathrm{H_3O^+}]$.",
        solution: `$$[\\mathrm{H_3O^+}] = ${tex(c, 3)}\\ \\text{mol·dm}^{-3}$$\n$$\\text{pH} = -\\log(${tex(c, 3)}) = ${tex(p)}$$`,
      };
    }
    if (t === 1) {
      const p = -Math.log10(2 * c);
      return {
        q: `Calculate the pH of a $${tex(c, 3)}\\ \\text{mol·dm}^{-3}$ sulfuric acid ($\\mathrm{H_2SO_4}$) solution. Assume it ionises completely.`,
        answer: ans(p),
        tol: 0.011,
        hint: "Each H₂SO₄ gives **two** H₃O⁺ ions: $[\\mathrm{H_3O^+}] = 2c$.",
        solution: `$$\\mathrm{H_2SO_4 + 2H_2O \\rightarrow 2H_3O^+ + SO_4^{2-}}$$\n$$[\\mathrm{H_3O^+}] = 2(${tex(c, 3)}) = ${tex(2 * c, 3)}\\ \\text{mol·dm}^{-3}, \\quad \\text{pH} = -\\log(${tex(2 * c, 3)}) = ${tex(p)}$$`,
      };
    }
    if (t === 2) {
      const p = 14 + Math.log10(c);
      return {
        q: `Calculate the pH of a $${tex(c, 3)}\\ \\text{mol·dm}^{-3}$ NaOH solution at 25 °C.`,
        answer: ans(p),
        tol: 0.011,
        hint: "NaOH is a strong base: $[\\mathrm{OH^-}] = c$. Use $K_w = [\\mathrm{H_3O^+}][\\mathrm{OH^-}] = 10^{-14}$.",
        solution: `$$[\\mathrm{H_3O^+}] = \\frac{K_w}{[\\mathrm{OH^-}]} = \\frac{10^{-14}}{${tex(c, 3)}} = ${sciTex(1e-14 / c)}\\ \\text{mol·dm}^{-3}$$\n$$\\text{pH} = -\\log(${sciTex(1e-14 / c)}) = ${tex(p)}$$`,
      };
    }
    const pH = step(r, 1, 13, 0.5);
    const h = 10 ** -pH;
    return {
      q: `A solution has a pH of $${tex(pH)}$. Calculate $[\\mathrm{H_3O^+}]$.`,
      answer: sciAns(h),
      unit: "mol·dm⁻³",
      hint: "$[\\mathrm{H_3O^+}] = 10^{-\\text{pH}}$",
      solution: `$$[\\mathrm{H_3O^+}] = 10^{-${tex(pH)}} = ${sciTex(h)}\\ \\text{mol·dm}^{-3}$$`,
    };
  },
};

const titration: Generator = {
  id: "titration",
  title: "Titration calculations",
  topic: "g12-acids",
  make(seed) {
    const r = seededRandom(seed);
    const [acid, base, na, nb, eq] = pick(r, [
      ["HCl", "NaOH", 1, 1, "HCl + NaOH \\rightarrow NaCl + H_2O"],
      ["H2SO4", "NaOH", 1, 2, "H_2SO_4 + 2NaOH \\rightarrow Na_2SO_4 + 2H_2O"],
      ["HNO3", "KOH", 1, 1, "HNO_3 + KOH \\rightarrow KNO_3 + H_2O"],
      ["H2C2O4", "NaOH", 1, 2, "H_2C_2O_4 + 2NaOH \\rightarrow Na_2C_2O_4 + 2H_2O"],
      ["HCl", "Na2CO3", 2, 1, "2HCl + Na_2CO_3 \\rightarrow 2NaCl + H_2O + CO_2"],
    ] as const);
    const cb = pick(r, [0.1, 0.2, 0.15, 0.25, 0.5]);
    const Vb = pick(r, [20, 25]);
    const Va = round(step(r, 12, 30, 0.1), 1);
    const ca = (cb * Vb * na) / (Va * nb);
    return {
      q: `$${Va}\\ \\text{cm}^3$ of $${f(acid)}$ solution neutralises $${Vb}\\ \\text{cm}^3$ of $${tex(cb)}\\ \\text{mol·dm}^{-3}$ $${f(base)}$:\n$$\\mathrm{${eq}}$$\nCalculate the concentration of the acid.`,
      answer: ans(ca, 3),
      unit: "mol·dm⁻³",
      hint: "$\\frac{c_aV_a}{c_bV_b} = \\frac{n_a}{n_b}$ where $n_a : n_b$ is the mole ratio from the equation.",
      solution: `$$\\frac{c_aV_a}{c_bV_b} = \\frac{n_a}{n_b} \\;\\Rightarrow\\; \\frac{c_a(${Va})}{(${tex(cb)})(${Vb})} = \\frac{${na}}{${nb}} \\;\\Rightarrow\\; c_a = ${tex(ca, 3)}\\ \\text{mol·dm}^{-3}$$`,
    };
  },
};

const cellEmf: Generator = {
  id: "cell-emf",
  title: "Galvanic cell emf",
  topic: "g12-electrochem",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const metals = REDUCTION_POTENTIALS.filter((h) => ["Zn", "Cu", "Ag", "Mg", "Fe", "Pb", "Ni", "Al", "Sn", "Cr", "H₂"].includes(h.reduced));
    let a = pick(r, metals);
    let b = pick(r, metals);
    while (b === a) b = pick(r, metals);
    if (a.e > b.e) [a, b] = [b, a];
    const emf = b.e - a.e;
    const label = (h: (typeof metals)[number]) => (h.reduced === "H₂" ? "the standard hydrogen half-cell" : `a ${h.reduced}|${h.oxidised} half-cell`);
    return {
      q: `A galvanic cell is made from ${label(a)} and ${label(b)} under standard conditions. Calculate the initial emf of the cell.`,
      answer: ans(emf),
      unit: "V",
      tol: 0.006,
      hint: "The half-reaction higher in Table 4 (more positive $E^\\circ$) is reduced at the cathode. $E^\\circ_{cell} = E^\\circ_{cathode} - E^\\circ_{anode}$.",
      solution: `Cathode (reduction): $${b.tex}$, $E^\\circ = ${b.e > 0 ? "+" : ""}${tex(b.e)}\\ \\text{V}$\n\nAnode (oxidation): $${a.tex}$ (reversed), $E^\\circ = ${a.e > 0 ? "+" : ""}${tex(a.e)}\\ \\text{V}$\n$$E^\\circ_{cell} = E^\\circ_{cathode} - E^\\circ_{anode} = (${tex(b.e)}) - (${tex(a.e)}) = ${tex(emf)}\\ \\text{V}$$`,
    };
  },
};

const ORGANIC_GROUPS = ["alkane", "alkene", "alkyne", "haloalkane", "alcohol", "aldehyde", "ketone", "acid", "ester"] as const;

const organicName: Generator = {
  id: "organic-name",
  title: "IUPAC naming",
  topic: "g12-organic",
  make(seed) {
    const r = seededRandom(seed);
    let m: Molecule = { chain: 2, group: "alkane", subs: [] };
    for (let k = 0; k < 50; k++) {
      const group = pick(r, ORGANIC_GROUPS);
      const chain = int(r, group === "ketone" ? 3 : 1, 6);
      const pos = group === "alkene" || group === "alkyne" ? int(r, 1, Math.max(1, chain - 1)) : group === "ketone" ? int(r, 2, Math.max(2, chain - 1)) : group === "alcohol" ? int(r, 1, chain) : undefined;
      const subs: Molecule["subs"] = [];
      const nSubs = group === "haloalkane" ? int(r, 1, 2) : chain >= 4 && r() < 0.5 ? int(r, 1, 2) : 0;
      const kind: Sub = group === "haloalkane" ? pick(r, ["chloro", "bromo", "fluoro", "iodo"] as const) : pick(r, ["methyl", "methyl", "ethyl"] as const);
      for (let s = 0; s < nSubs; s++) subs.push({ pos: int(r, 1, chain), kind });
      const cand: Molecule = { chain, group, pos, subs, alkyl: group === "ester" ? int(r, 1, 4) : undefined };
      if (isValid(cand) && !(group !== "haloalkane" && group !== "alkane" && chain < 3 && subs.length)) {
        m = cand;
        break;
      }
    }
    const name = iupacName(m);
    const cf = condensed(m);
    return {
      q: `Give the IUPAC name of: $\\mathrm{${cf.replace(/≡/g, "\\equiv ").replace(/(\d+)/g, "_{$1}")}}$`,
      answer: acceptedNames(m).join(" | "),
      kind: "text",
      hint: "1) Find the functional group. 2) Find the longest chain containing it. 3) Number from the end that gives the functional group (then the branches) the lowest number. 4) Branches in alphabetical order, with di-/tri- for repeats.",
      solution: `Condensed formula: $\\mathrm{${cf.replace(/≡/g, "\\equiv ").replace(/(\d+)/g, "_{$1}")}}$\n\nName: **${name}**`,
    };
  },
};

const npk: Generator = {
  id: "npk",
  title: "Fertiliser NPK calculations",
  topic: "g12-fertilisers",
  make(seed) {
    const r = seededRandom(seed);
    const [n, p, k] = pick(r, [[2, 3, 2], [3, 2, 1], [1, 0, 1], [5, 1, 5], [2, 1, 2], [3, 1, 5], [4, 3, 4]] as const);
    const pct = pick(r, [20, 22, 25, 28, 30, 36]);
    const bag = pick(r, [10, 25, 40, 50]);
    const nutrient = pick(r, ["N", "P", "K"] as const);
    const part = nutrient === "N" ? n : nutrient === "P" ? p : k;
    const total = n + p + k;
    const mass = (part / total) * (pct / 100) * bag;
    return {
      q: `A $${bag}\\ \\text{kg}$ bag of fertiliser is labelled **${n}:${p}:${k} (${pct})**. Calculate the mass of **${nutrient === "N" ? "nitrogen" : nutrient === "P" ? "phosphorus" : "potassium"}** in the bag.`,
      answer: ans(mass, 3),
      unit: "kg",
      hint: "The number in brackets is the percentage of the bag that is nutrient. Share that mass in the ratio N : P : K.",
      solution: `Total nutrients $= \\frac{${pct}}{100} \\times ${bag} = ${tex((pct / 100) * bag)}\\ \\text{kg}$.\n$$m(\\mathrm{${nutrient}}) = \\frac{${part}}{${n} + ${p} + ${k}} \\times ${tex((pct / 100) * bag)} = ${tex(mass, 3)}\\ \\text{kg}$$`,
    };
  },
};

export const CHEMISTRY_GENERATORS: Generator[] = [
  atomCount, electronConfiguration, ionicFormulae, balance, moles, concentration, percentComposition, empirical,
  enDifference, gasLaws, stoichiometry, enthalpy, oxidationNumber, mining,
  rate, kc, ph, titration, cellEmf, organicName, npk,
];
