/**
 * A small IUPAC namer for the Grade 12 homologous series: alkanes, alkenes,
 * alkynes, haloalkanes, alcohols, aldehydes, ketones, carboxylic acids and
 * esters, with up to two kinds of methyl / ethyl / halogen substituents on a
 * straight main chain of up to 8 carbons. Used by the organic namer widget and
 * the naming generator, and checked against hand-named molecules in the tests.
 */

export type Group = "alkane" | "alkene" | "alkyne" | "alcohol" | "aldehyde" | "ketone" | "acid" | "ester" | "haloalkane";
export type Sub = "methyl" | "ethyl" | "fluoro" | "chloro" | "bromo" | "iodo";

export interface Molecule {
  /** Carbons in the main chain (for esters: the acid part, including the C=O carbon). */
  chain: number;
  group: Group;
  /** Locant of the functional group as numbered left-to-right in `chain` (C=C / C≡C: the lower carbon; OH, C=O). */
  pos?: number;
  subs: { pos: number; kind: Sub }[];
  /** Esters: carbons in the alkyl part that came from the alcohol. */
  alkyl?: number;
}

export const STEMS = ["", "meth", "eth", "prop", "but", "pent", "hex", "hept", "oct"];
const MULT = ["", "", "di", "tri", "tetra"];
const SUB_SYMBOL: Record<Sub, string> = { methyl: "CH3", ethyl: "CH2CH3", fluoro: "F", chloro: "Cl", bromo: "Br", iodo: "I" };

export const GROUP_INFO: Record<Group, { series: string; functional: string; suffix: string; example: string }> = {
  alkane: { series: "Alkanes", functional: "only C–C single bonds", suffix: "-ane", example: "propane" },
  alkene: { series: "Alkenes", functional: "a C=C double bond", suffix: "-ene", example: "but-1-ene" },
  alkyne: { series: "Alkynes", functional: "a C≡C triple bond", suffix: "-yne", example: "but-2-yne" },
  haloalkane: { series: "Haloalkanes", functional: "a halogen atom (F, Cl, Br, I)", suffix: "halo- prefix", example: "2-chloropropane" },
  alcohol: { series: "Alcohols", functional: "a hydroxyl group (–OH)", suffix: "-ol", example: "butan-2-ol" },
  aldehyde: { series: "Aldehydes", functional: "a formyl group (–CHO) at the end of the chain", suffix: "-al", example: "propanal" },
  ketone: { series: "Ketones", functional: "a carbonyl group (C=O) inside the chain", suffix: "-one", example: "butan-2-one" },
  acid: { series: "Carboxylic acids", functional: "a carboxyl group (–COOH)", suffix: "-oic acid", example: "ethanoic acid" },
  ester: { series: "Esters", functional: "–COO– between two carbon chains", suffix: "alkyl -oate", example: "methyl ethanoate" },
};

/** Groups whose functional carbon is always C1 (no locant, numbering fixed). */
const END_GROUPS: Group[] = ["aldehyde", "acid", "ester"];

function reflect(m: Molecule): Molecule {
  const n = m.chain;
  const pos = m.pos === undefined ? undefined : m.group === "alkene" || m.group === "alkyne" ? n - m.pos : n + 1 - m.pos;
  return { ...m, pos, subs: m.subs.map((s) => ({ ...s, pos: n + 1 - s.pos })) };
}

const firstDifference = (a: number[], b: number[]) => {
  for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i];
  return 0;
};

/** Number the chain the IUPAC way: lowest locant to the functional group, then to the substituents. */
export function canonical(m: Molecule): Molecule {
  if (END_GROUPS.includes(m.group)) return m;
  const r = reflect(m);
  if (m.pos !== undefined && r.pos !== undefined && m.pos !== r.pos) return m.pos < r.pos ? m : r;
  const a = m.subs.map((s) => s.pos).sort((x, y) => x - y);
  const b = r.subs.map((s) => s.pos).sort((x, y) => x - y);
  const d = firstDifference(a, b);
  if (d !== 0) return d < 0 ? m : r;
  // Tie: the substituent first in alphabetical order gets the lower number.
  const alpha = (x: Molecule) => [...x.subs].sort((p, q) => p.kind.localeCompare(q.kind))[0]?.pos ?? 0;
  return alpha(r) < alpha(m) ? r : m;
}

function prefixes(subs: Molecule["subs"]): string {
  const kinds = [...new Set(subs.map((s) => s.kind))].sort((a, b) => a.localeCompare(b));
  return kinds
    .map((k) => {
      const locs = subs.filter((s) => s.kind === k).map((s) => s.pos).sort((a, b) => a - b);
      return `${locs.join(",")}-${MULT[locs.length]}${k}`;
    })
    .join("-");
}

/** The IUPAC name, e.g. "2-methylbutan-2-ol", "methyl propanoate". */
export function iupacName(input: Molecule): string {
  const m = canonical(input);
  const stem = STEMS[m.chain];
  // Locants are left out when they can't be anything else: chloromethane, chloroethane.
  const pre = m.chain === 1 || (m.chain === 2 && m.subs.length === 1 && m.group === "haloalkane") ? prefixes(m.subs).replace(/^[\d,]+-/, "") : prefixes(m.subs);
  const needsLocant = (minChain: number) => m.chain >= minChain || m.subs.length > 0;
  switch (m.group) {
    case "alkane":
    case "haloalkane":
      return `${pre}${stem}ane`;
    case "alkene":
      return `${pre}${needsLocant(4) ? `${stem}-${m.pos}-ene` : `${stem}ene`}`;
    case "alkyne":
      return `${pre}${needsLocant(4) ? `${stem}-${m.pos}-yne` : `${stem}yne`}`;
    case "alcohol":
      return `${pre}${needsLocant(3) ? `${stem}an-${m.pos}-ol` : `${stem}anol`}`;
    case "ketone":
      return m.chain === 3 && !m.subs.length ? "propanone" : `${pre}${stem}an-${m.pos}-one`;
    case "aldehyde":
      return `${pre}${stem}anal`;
    case "acid":
      return `${pre}${stem}anoic acid`;
    case "ester":
      return `${STEMS[m.alkyl ?? 1]}yl ${pre}${stem}anoate`;
  }
}

/** Names a learner may also give (e.g. "butanone" for butan-2-one, "propan-2-one" for propanone, "prop-1-ene"). */
export function acceptedNames(m: Molecule): string[] {
  const c = canonical(m);
  const name = iupacName(c);
  const names = [name];
  if (c.group === "ketone" && c.chain === 3 && !c.subs.length) names.push("propan-2-one");
  if (c.group === "ketone" && c.chain === 4 && !c.subs.length) names.push("butanone");
  if ((c.group === "alkene" || c.group === "alkyne") && c.chain === 3 && !c.subs.length) names.push(`prop-1-${c.group === "alkene" ? "ene" : "yne"}`);
  if ((c.group === "alkene" || c.group === "alkyne") && c.chain <= 3 && c.subs.length) names.push(name.replace(/-1-(ene|yne)$/, "$1"));
  if (c.group === "alcohol" && c.chain <= 2 && !c.subs.length) names.push(`${STEMS[c.chain]}an-1-ol`);
  if (c.group === "haloalkane" && c.chain === 2 && c.subs.length === 1) names.push(`1-${name}`);
  return [...new Set(names)];
}

/** Bonds each main-chain carbon (index 0 = C1) makes to the chain, multiple bonds, substituents and functional groups. */
function bondCount(m: Molecule): number[] {
  const n = m.chain;
  return Array.from({ length: n }, (_, i) => {
    const c = i + 1;
    let bonds = (c > 1 ? 1 : 0) + (c < n ? 1 : 0);
    if ((m.group === "alkene" || m.group === "alkyne") && (c === m.pos || c === (m.pos ?? 0) + 1)) bonds += m.group === "alkene" ? 1 : 2;
    bonds += m.subs.filter((s) => s.pos === c).length;
    if (m.group === "alcohol" && c === m.pos) bonds += 1;
    if (m.group === "ketone" && c === m.pos) bonds += 2;
    if (END_GROUPS.includes(m.group) && c === 1) bonds += m.group === "aldehyde" ? 2 : 3;
    return bonds;
  });
}

const hydrogens = (m: Molecule) => bondCount(m).map((b) => Math.max(0, 4 - b));
const hx = (h: number) => (h === 0 ? "" : h === 1 ? "H" : `H${h}`);

/** Condensed structural formula, written from the far end to C1: CH3CH(OH)CH3, CH3CH2CH=CH2, CH3CH2COOCH3. */
export function condensed(input: Molecule): string {
  const m = canonical(input);
  const H = hydrogens(m);
  const atom = (c: number, last: boolean) => {
    if (END_GROUPS.includes(m.group) && c === 1) {
      if (m.group === "aldehyde") return m.chain === 1 ? "HCHO" : "CHO";
      if (m.group === "acid") return m.chain === 1 ? "HCOOH" : "COOH";
      return `${m.chain === 1 ? "HCOO" : "COO"}${"CH2".repeat(Math.max(0, (m.alkyl ?? 1) - 1))}CH3`;
    }
    if (m.group === "ketone" && c === m.pos) return "CO";
    let s = `C${hx(H[c - 1])}`;
    const here = m.subs.filter((x) => x.pos === c);
    const kinds = [...new Set(here.map((x) => x.kind))];
    for (const k of kinds) {
      const sym = SUB_SYMBOL[k];
      const count = here.filter((x) => x.kind === k).length;
      s += sym.startsWith("CH") ? `(${sym})${count > 1 ? count : ""}` : `${sym}${count > 1 ? count : ""}`;
    }
    if (m.group === "alcohol" && c === m.pos) s += last ? "OH" : "(OH)";
    return s;
  };
  const order = Array.from({ length: m.chain }, (_, i) => m.chain - i);
  let out = "";
  order.forEach((c, k) => {
    out += atom(c, k === order.length - 1);
    const nxt = order[k + 1];
    if (nxt !== undefined && (m.group === "alkene" || m.group === "alkyne") && Math.min(c, nxt) === m.pos) out += m.group === "alkene" ? "=" : "≡";
  });
  return out;
}

/** Molecular formula for the whole molecule, e.g. C4H10O. */
export function molecularFormula(input: Molecule): string {
  const m = canonical(input);
  let C = m.chain;
  let h = hydrogens(m).reduce((a, b) => a + b, 0);
  let O = 0;
  const hal: Record<string, number> = {};
  for (const x of m.subs) {
    if (x.kind === "methyl") { C += 1; h += 3; }
    else if (x.kind === "ethyl") { C += 2; h += 5; }
    else hal[SUB_SYMBOL[x.kind]] = (hal[SUB_SYMBOL[x.kind]] ?? 0) + 1;
  }
  if (m.group === "alcohol") { O = 1; h += 1; }
  if (m.group === "ketone") O = 1;
  if (m.group === "aldehyde") { O = 1; h += 1; }
  if (m.group === "acid") { O = 2; h += 1; }
  if (m.group === "ester") { O = 2; C += m.alkyl ?? 1; h += 2 * (m.alkyl ?? 1) + 1; }
  const part = (el: string, k: number) => (k === 0 ? "" : k === 1 ? el : `${el}${k}`);
  return part("C", C) + part("H", h) + Object.keys(hal).sort().map((el) => part(el, hal[el])).join("") + part("O", O);
}

/** Is this a valid molecule for the namer (longest chain, sensible positions, no carbon with five bonds)? */
export function isValid(m: Molecule): boolean {
  const n = m.chain;
  if (n < 1 || n > 8) return false;
  if ((m.group === "alkene" || m.group === "alkyne") && (n < 2 || !m.pos || m.pos < 1 || m.pos > n - 1)) return false;
  if (m.group === "ketone" && (n < 3 || !m.pos || m.pos < 2 || m.pos > n - 1)) return false;
  if (m.group === "alcohol" && (!m.pos || m.pos < 1 || m.pos > n)) return false;
  if (m.group === "ester" && (!m.alkyl || m.alkyl < 1 || m.alkyl > 8)) return false;
  if (m.group === "haloalkane" && !m.subs.some((x) => x.kind !== "methyl" && x.kind !== "ethyl")) return false;
  for (const x of m.subs) {
    if (x.pos < 1 || x.pos > n) return false;
    // Alkyl groups on the ends (or ethyl on C2) would make a longer chain.
    if (x.kind === "methyl" && (x.pos < 2 || x.pos > n - 1)) return false;
    if (x.kind === "ethyl" && (x.pos < 3 || x.pos > n - 2)) return false;
    if (END_GROUPS.includes(m.group) && x.pos === 1) return false;
  }
  return bondCount(m).every((b) => b <= 4);
}

/** Saturated or unsaturated? Alkenes and alkynes are unsaturated. */
export const isUnsaturated = (g: Group) => g === "alkene" || g === "alkyne";
