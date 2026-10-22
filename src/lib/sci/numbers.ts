/** Number helpers shared by widgets, generators and tests. */

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export function round(x: number, dp = 2): number {
  const f = 10 ** dp;
  return Math.round((x + Number.EPSILON * Math.sign(x)) * f) / f;
}

/** Round to significant figures. */
export function sig(x: number, n = 3): number {
  if (x === 0 || !Number.isFinite(x)) return x;
  const p = Math.floor(Math.log10(Math.abs(x)));
  const f = 10 ** (n - 1 - p);
  return Math.round(x * f) / f;
}

/** 12 345,67 – SA style: thin-space thousands separators and a decimal comma (plain text). */
export function fmt(x: number, dp = 2): string {
  const [i, f] = Math.abs(round(x, dp)).toFixed(dp).split(".");
  const grouped = i.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${x < 0 ? "-" : ""}${grouped}${f ? `,${f}` : ""}`;
}

/** Trim trailing zeros: 2.50 → "2.5", 3.00 → "3". Plain JS number string (checker syntax). */
export function ans(x: number, dp = 2): string {
  return String(round(x, dp));
}

/**
 * A number for LaTeX with a decimal comma, e.g. 9.8 → "9{,}8", rounded to dp
 * decimals with trailing zeros removed. Very large/small numbers use scientific notation.
 */
export function tex(x: number, dp = 2): string {
  if (x !== 0 && (Math.abs(x) >= 1e5 || Math.abs(x) < 1e-3)) return sciTex(x, 3);
  const r = round(x, dp);
  const [i, f] = String(Math.abs(r)).split(".");
  const grouped = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,");
  return `${r < 0 ? "-" : ""}${grouped}${f ? `{,}${f}` : ""}`;
}

/** Scientific notation for LaTeX: 3,00 × 10⁸ → "3{,}00 \times 10^{8}" (n significant figures). */
export function sciTex(x: number, n = 3): string {
  if (x === 0) return "0";
  const p = Math.floor(Math.log10(Math.abs(x)));
  let m = x / 10 ** p;
  let e = p;
  if (Math.abs(Number(m.toFixed(n - 1))) >= 10) {
    m /= 10;
    e += 1;
  }
  const mant = m.toFixed(n - 1).replace(".", "{,}");
  return e === 0 ? mant : `${mant} \\times 10^{${e}}`;
}

/** Scientific notation in checker syntax: "3.00e8". */
export function sciAns(x: number, n = 3): string {
  return x.toExponential(n - 1);
}

/** Signed term for building expressions: ` + 3`, ` - 2`, `` for 0. */
export function signed(v: number, suffix = ""): string {
  if (v === 0) return "";
  const body = Math.abs(v) === 1 && suffix ? suffix : `${Math.abs(v)}${suffix}`;
  return v < 0 ? ` - ${body}` : ` + ${body}`;
}

/** Physical constants used on the NSC data sheets. */
export const CONST = {
  g: 9.8,
  G: 6.67e-11,
  c: 3.0e8,
  h: 6.63e-34,
  k: 9.0e9,
  e: 1.6e-19,
  me: 9.11e-31,
  Vm: 22.4,
  R: 8.31,
  NA: 6.02e23,
  Kw: 1e-14,
  ME: 5.98e24,
  RE: 6.38e6,
  vSound: 340,
} as const;
