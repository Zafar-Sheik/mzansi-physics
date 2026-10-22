import { describe, expect, it } from "vitest";
import katex from "katex";
import { checkAnswer, cleanNumber } from "@/lib/sci/check";
import { GENERATORS } from "@/lib/sci/generators";
import { atomCounts, configText, EQUATIONS, ionicFormula, molarMass, formulaTex, ELEMENTS } from "@/lib/sci/chem";
import { acceptedNames, condensed, iupacName, isValid, molecularFormula, type Molecule } from "@/lib/sci/organic";

const texOk = (md: string) => {
  const parts = [...md.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)].map((m) => m[1] ?? m[2]);
  for (const t of parts) katex.renderToString(t, { throwOnError: true, strict: false });
};

describe("answer checker", () => {
  it("reads units, commas and scientific notation", () => {
    expect(cleanNumber("v = 9,8 m·s⁻²")).toBe("9.8");
    expect(checkAnswer("3 × 10^8 m/s", { answer: "3e8" }).ok).toBe(true);
    expect(checkAnswer("3x10^8", { answer: "3e8" }).ok).toBe(true);
    expect(checkAnswer("3e8", { answer: "3.00e+8" }).ok).toBe(true);
    expect(checkAnswer("1,6 × 10⁻¹⁹ C", { answer: "1.6e-19" }).ok).toBe(true);
    expect(checkAnswer("12 345,6 J", { answer: "12345.6" }).ok).toBe(true);
    expect(checkAnswer("24.5", { answer: "24.48" }).ok).toBe(true);
    expect(checkAnswer("25", { answer: "24.48" }).ok).toBe(false);
    expect(checkAnswer("-9.8", { answer: "9.8" }).message).toMatch(/sign/);
    expect(checkAnswer("2450", { answer: "2.45" }).message).toMatch(/prefix/);
    expect(checkAnswer("4.9", { answer: "9.8" }).message).toMatch(/factor of 2/);
    expect(checkAnswer("5 eV", { answer: "5" }).ok).toBe(true);
    expect(checkAnswer("30°", { answer: "30" }).ok).toBe(true);
  });
  it("checks lists, text and formulae", () => {
    expect(checkAnswer("2; 1; 2", { answer: "2; 1; 2", kind: "list" }).ok).toBe(true);
    expect(checkAnswer("2:1:2", { answer: "2; 1; 2", kind: "list" }).ok).toBe(true);
    expect(checkAnswer("4;2;4", { answer: "2; 1; 2", kind: "list" }).message).toMatch(/smallest/);
    expect(checkAnswer("2 Methyl Propane", { answer: "2-methylpropane", kind: "text" }).ok).toBe(true);
    expect(checkAnswer("butanone", { answer: "butan-2-one | butanone", kind: "text" }).ok).toBe(true);
    expect(checkAnswer("H₂O", { answer: "H2O", kind: "formula" }).ok).toBe(true);
    expect(checkAnswer("CO", { answer: "Co", kind: "formula" }).message).toMatch(/capital/);
  });
});

describe("chemistry engine", () => {
  it("has every element", () => {
    expect(ELEMENTS).toHaveLength(118);
    expect(ELEMENTS[25].symbol).toBe("Fe");
    expect(ELEMENTS[25].group).toBe(8);
    expect(ELEMENTS[56].category).toBe("transition");
    expect(ELEMENTS[57].category).toBe("lanthanide");
    expect(ELEMENTS[71].group).toBe(4);
    expect(ELEMENTS[117].group).toBe(18);
  });
  it("computes molar masses", () => {
    expect(molarMass("H2O")).toBe(18);
    expect(molarMass("Ca(OH)2")).toBe(74);
    expect(molarMass("CuSO4·5H2O")).toBe(249.5);
    expect(molarMass("(NH4)2SO4")).toBe(132);
    expect(atomCounts("SO4 2-")).toEqual({ S: 1, O: 4 });
  });
  it("writes formulae and configurations", () => {
    expect(ionicFormula("Al", 3, "SO4", -2)).toBe("Al2(SO4)3");
    expect(ionicFormula("Na", 1, "Cl", -1)).toBe("NaCl");
    expect(ionicFormula("NH4", 1, "SO4", -2)).toBe("(NH4)2SO4");
    expect(ionicFormula("Ca", 2, "OH", -1)).toBe("Ca(OH)2");
    expect(configText(11)).toBe("1s² 2s² 2p⁶ 3s¹");
    expect(configText(24)).toContain("4s¹ 3d⁵");
    expect(formulaTex("SO4 2-")).toBe("\\mathrm{SO_{4}^{2-}}");
    expect(formulaTex("NH4+")).toBe("\\mathrm{NH_{4}^{+}}");
    expect(formulaTex("Mg2+")).toBe("\\mathrm{Mg^{2+}}");
  });
  it("has balanced equations", () => {
    for (const eq of EQUATIONS) {
      const tally = (xs: string[], cs: number[]) => {
        const t: Record<string, number> = {};
        xs.forEach((x, i) => Object.entries(atomCounts(x)).forEach(([el, n]) => (t[el] = (t[el] ?? 0) + n * cs[i])));
        return t;
      };
      const n = eq.reactants.length;
      expect(tally(eq.reactants, eq.coeffs.slice(0, n)), eq.label).toEqual(tally(eq.products, eq.coeffs.slice(n)));
    }
  });
});

describe("organic namer", () => {
  const cases: [Molecule, string, string][] = [
    [{ chain: 4, group: "alkane", subs: [] }, "butane", "CH3CH2CH2CH3"],
    [{ chain: 4, group: "alkane", subs: [{ pos: 3, kind: "methyl" }] }, "2-methylbutane", "CH3CH2CH(CH3)CH3"],
    [{ chain: 5, group: "alkane", subs: [{ pos: 2, kind: "methyl" }, { pos: 2, kind: "methyl" }] }, "2,2-dimethylpentane", "CH3CH2CH2C(CH3)2CH3"],
    [{ chain: 4, group: "alkene", pos: 3, subs: [] }, "but-1-ene", "CH3CH2CH=CH2"],
    [{ chain: 4, group: "alcohol", pos: 2, subs: [] }, "butan-2-ol", "CH3CH2CH(OH)CH3"],
    [{ chain: 3, group: "alcohol", pos: 2, subs: [{ pos: 2, kind: "methyl" }] }, "2-methylpropan-2-ol", "CH3C(CH3)(OH)CH3"],
    [{ chain: 3, group: "ketone", pos: 2, subs: [] }, "propanone", "CH3COCH3"],
    [{ chain: 3, group: "aldehyde", subs: [] }, "propanal", "CH3CH2CHO"],
    [{ chain: 2, group: "acid", subs: [] }, "ethanoic acid", "CH3COOH"],
    [{ chain: 2, group: "ester", alkyl: 1, subs: [] }, "methyl ethanoate", "CH3COOCH3"],
    [{ chain: 3, group: "ester", alkyl: 2, subs: [] }, "ethyl propanoate", "CH3CH2COOCH2CH3"],
    [{ chain: 3, group: "haloalkane", subs: [{ pos: 2, kind: "chloro" }] }, "2-chloropropane", "CH3CHClCH3"],
    [{ chain: 2, group: "haloalkane", subs: [{ pos: 2, kind: "bromo" }] }, "bromoethane", "CH3CH2Br"],
    [{ chain: 5, group: "alkane", subs: [{ pos: 3, kind: "ethyl" }, { pos: 2, kind: "methyl" }] }, "3-ethyl-2-methylpentane", "CH3CH2CH(CH2CH3)CH(CH3)CH3"],
    [{ chain: 1, group: "alcohol", pos: 1, subs: [] }, "methanol", "CH3OH"],
    [{ chain: 5, group: "alkyne", pos: 2, subs: [] }, "pent-2-yne", "CH3CH2C≡CCH3"],
  ];
  it.each(cases)("names %#", (m, name, cf) => {
    expect(isValid(m)).toBe(true);
    expect(iupacName(m)).toBe(name);
    expect(condensed(m)).toBe(cf);
  });
  it("gives molecular formulae and alternatives", () => {
    expect(molecularFormula({ chain: 4, group: "alcohol", pos: 2, subs: [] })).toBe("C4H10O");
    expect(molecularFormula({ chain: 2, group: "ester", alkyl: 1, subs: [] })).toBe("C3H6O2");
    expect(acceptedNames({ chain: 4, group: "ketone", pos: 2, subs: [] })).toContain("butanone");
    expect(isValid({ chain: 4, group: "alkane", subs: [{ pos: 1, kind: "methyl" }] })).toBe(false);
  });
});

describe("generators", () => {
  it.each(GENERATORS.map((g) => [g.id, g] as const))("%s: memo passes its own checker and renders", (_id, g) => {
    for (let s = 0; s < 150; s++) {
      const p = g.make(s * 7919 + 13);
      expect(checkAnswer(p.answer.split(" | ")[0], p).ok, `${g.id} seed ${s}: ${p.q} → ${p.answer}`).toBe(true);
      texOk(p.q);
      texOk(p.solution);
      if (p.hint) texOk(p.hint);
      expect(p.solution).not.toMatch(/NaN(?![A-Z])|undefined|Infinity/);
      expect(p.q).not.toMatch(/NaN(?![A-Z])|undefined|Infinity/);
    }
  });
});
