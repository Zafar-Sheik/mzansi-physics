/**
 * A tiny, safe maths-expression parser (no eval!). It understands what learners
 * actually type: implicit multiplication (2x, 3sqrt(2), (x+1)(x-2)), powers
 * (x^2, 2^-1, x², 10⁻³), roots (sqrt, √, cbrt), π, scientific notation
 * (3 × 10^8, 3e8, 1,6 × 10⁻¹⁹) and degree-based trig.
 *
 * Used to check typed answers and to show a live LaTeX preview of the input.
 */

export type Node =
  | { k: "num"; v: number; s: string }
  | { k: "var"; n: string }
  | { k: "const"; n: "pi" | "e" }
  | { k: "neg"; a: Node }
  | { k: "bin"; op: "+" | "-" | "*" | "/" | "^"; a: Node; b: Node; implicit?: boolean }
  | { k: "fn"; f: Fn; a: Node };

export type Fn = "sqrt" | "cbrt" | "sin" | "cos" | "tan" | "log" | "ln" | "abs";

const FNS: Fn[] = ["sqrt", "cbrt", "sin", "cos", "tan", "log", "ln", "abs"];

export class ParseError extends Error {}

type Tok = { t: "num"; v: string } | { t: "id"; v: string } | { t: "op"; v: string } | { t: "("; } | { t: ")" };

const SUPER: Record<string, string> = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-", "⁺": "+" };

/** Normalise unicode a learner may paste or type on a phone keyboard. */
export function normalise(src: string): string {
  return src
    .replace(/[−–—]/g, "-")
    .replace(/[×·∙]/g, "*")
    .replace(/÷/g, "/")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g, (m) => `^(${[...m].map((c) => SUPER[c]).join("")})`)
    // Scientific notation: 3e8, 1.6E-19 → 3*10^(8)
    .replace(/(\d|\.)[eE]([-+]?\d+)(?![a-zA-Z])/g, "$1*10^($2)")
    .replace(/π/g, "pi")
    .replace(/°/g, "")
    .replace(/[θΘ]/g, "x")
    .replace(/√/g, "sqrt")
    .replace(/∛/g, "cbrt")
    .replace(/\*\*/g, "^")
    // log with a base: log_2(x), log_{1/2} x, log2(8) → change of base
    .replace(/log_?\{?(\d+(?:[./]\d+)?)\}?\s*\(([^()]*)\)/g, "(log($2)/log($1))")
    .replace(/log_\{?(\d+(?:[./]\d+)?)\}?\s*([a-zA-Z0-9.]+)/g, "(log($2)/log($1))")
    .replace(/[[{]/g, "(")
    .replace(/[\]}]/g, ")");
}

function tokenize(src: string, vars: string[]): Tok[] {
  const s = normalise(src);
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9.]/.test(c)) {
      const m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));
      if (!m) throw new ParseError(`I can't read the number near “${s.slice(i, i + 4)}”.`);
      out.push({ t: "num", v: m[1] });
      i += m[1].length;
      continue;
    }
    if (/[a-zA-Z]/.test(c)) {
      const word = /^[a-zA-Z]+/.exec(s.slice(i))![0];
      // Split a run of letters into known functions, pi, and single-letter variables.
      let j = 0;
      while (j < word.length) {
        const rest = word.slice(j).toLowerCase();
        const fn = FNS.find((f) => rest.startsWith(f));
        if (fn) { out.push({ t: "id", v: fn }); j += fn.length; continue; }
        if (rest.startsWith("pi")) { out.push({ t: "id", v: "pi" }); j += 2; continue; }
        const ch = word[j];
        if (!vars.includes(ch) && ch !== "e") throw new ParseError(vars.length ? `Unexpected letter “${ch}” – use only ${vars.join(", ")}.` : `Unexpected letter “${ch}”.`);
        out.push({ t: "id", v: ch });
        j++;
      }
      i += word.length;
      continue;
    }
    if ("+-*/^".includes(c)) { out.push({ t: "op", v: c }); i++; continue; }
    if (c === "(") { out.push({ t: "(" }); i++; continue; }
    if (c === ")") { out.push({ t: ")" }); i++; continue; }
    throw new ParseError(`Unexpected symbol “${c}”.`);
  }
  return out;
}

/** Parse an expression. `vars` are the letters allowed as variables (e.g. ["x"]). */
export function parse(src: string, vars: string[] = []): Node {
  const toks = tokenize(src, vars);
  if (!toks.length) throw new ParseError("Type an answer first.");
  let p = 0;
  const peek = () => toks[p];
  const startsPrimary = (t?: Tok) => !!t && (t.t === "num" || t.t === "id" || t.t === "(");

  function expr(): Node {
    let left = term();
    while (peek()?.t === "op" && (peek() as { v: string }).v.match(/^[+-]$/)) {
      const op = (toks[p++] as { v: "+" | "-" }).v;
      left = { k: "bin", op, a: left, b: term() };
    }
    return left;
  }
  function term(): Node {
    let left = unary();
    for (;;) {
      const t = peek();
      if (t?.t === "op" && (t.v === "*" || t.v === "/")) {
        p++;
        left = { k: "bin", op: t.v, a: left, b: unary() };
      } else if (startsPrimary(t)) {
        left = { k: "bin", op: "*", a: left, b: power(), implicit: true };
      } else break;
    }
    return left;
  }
  function unary(): Node {
    const t = peek();
    if (t?.t === "op" && (t.v === "-" || t.v === "+")) {
      p++;
      const a = unary();
      return t.v === "-" ? { k: "neg", a } : a;
    }
    return power();
  }
  function power(): Node {
    const base = primary();
    const t = peek();
    if (t?.t === "op" && t.v === "^") {
      p++;
      return { k: "bin", op: "^", a: base, b: unary() };
    }
    return base;
  }
  function primary(): Node {
    const t = toks[p++];
    if (!t) throw new ParseError("The answer ends too early – is something missing?");
    if (t.t === "num") return { k: "num", v: Number(t.v), s: t.v };
    if (t.t === "(") {
      const e = expr();
      if (toks[p++]?.t !== ")") throw new ParseError("A bracket is not closed.");
      return e;
    }
    if (t.t === "id") {
      if ((FNS as string[]).includes(t.v)) {
        // sin^2 x, cos^2(x): a power written on the function name
        let pow: Node | null = null;
        if (peek()?.t === "op" && (peek() as { v: string }).v === "^") {
          p++;
          pow = unary();
        }
        // sqrt(2), sqrt 2, sqrt x, sin30, sin(30)
        const nxt = peek();
        if (!nxt) throw new ParseError(`${t.v} needs something after it.`);
        const a = nxt.t === "(" ? primary() : nxt.t === "op" && nxt.v === "-" ? (p++, { k: "neg", a: primary() } as Node) : primary();
        const call: Node = { k: "fn", f: t.v as Fn, a };
        return pow ? { k: "bin", op: "^", a: call, b: pow } : call;
      }
      if (t.v === "pi") return { k: "const", n: "pi" };
      if (t.v === "e" && !vars.includes("e")) return { k: "const", n: "e" };
      return { k: "var", n: t.v };
    }
    if (t.t === ")") throw new ParseError("There is an extra closing bracket.");
    throw new ParseError(`Unexpected “${(t as { v: string }).v}”.`);
  }

  const tree = expr();
  if (p < toks.length) throw new ParseError("I couldn't read the end of that answer.");
  return tree;
}

const RAD = Math.PI / 180;

/** Evaluate a parsed expression. Trig functions use DEGREES (as in CAPS). */
export function evaluate(n: Node, scope: Record<string, number> = {}): number {
  switch (n.k) {
    case "num": return n.v;
    case "const": return n.n === "pi" ? Math.PI : Math.E;
    case "var": {
      if (!(n.n in scope)) return NaN;
      return scope[n.n];
    }
    case "neg": return -evaluate(n.a, scope);
    case "bin": {
      const a = evaluate(n.a, scope);
      const b = evaluate(n.b, scope);
      switch (n.op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return a / b;
        case "^": {
          // Real odd roots of negatives: (-8)^(1/3) = -2
          if (a < 0 && !Number.isInteger(b)) {
            const inv = 1 / b;
            if (Math.abs(inv - Math.round(inv)) < 1e-9 && Math.round(inv) % 2 !== 0) return -Math.pow(-a, b);
          }
          return Math.pow(a, b);
        }
      }
      return NaN;
    }
    case "fn": {
      const a = evaluate(n.a, scope);
      switch (n.f) {
        case "sqrt": return a < 0 ? NaN : Math.sqrt(a);
        case "cbrt": return Math.cbrt(a);
        case "sin": return Math.sin(a * RAD);
        case "cos": return Math.cos(a * RAD);
        case "tan": return Math.tan(a * RAD);
        case "log": return Math.log10(a);
        case "ln": return Math.log(a);
        case "abs": return Math.abs(a);
      }
    }
  }
}

/** Convenience: parse and evaluate a constant expression (NaN on error). */
export function value(src: string): number {
  try {
    return evaluate(parse(src));
  } catch {
    return NaN;
  }
}

const isAtom = (n: Node) => n.k === "num" || n.k === "var" || n.k === "const" || n.k === "fn";

/** Render a parsed expression as LaTeX (for the live "this is what you typed" preview). */
export function toTex(n: Node): string {
  switch (n.k) {
    case "num": return n.s;
    case "var": return n.n;
    case "const": return n.n === "pi" ? "\\pi" : "e";
    case "neg": {
      const inner = toTex(n.a);
      return n.a.k === "bin" && (n.a.op === "+" || n.a.op === "-") ? `-\\left(${inner}\\right)` : `-${inner}`;
    }
    case "fn": {
      const a = toTex(n.a);
      if (n.f === "sqrt") return `\\sqrt{${a}}`;
      if (n.f === "cbrt") return `\\sqrt[3]{${a}}`;
      if (n.f === "abs") return `\\left|${a}\\right|`;
      return `\\${n.f}\\left(${a}\\right)`;
    }
    case "bin": {
      const wrapSum = (x: Node) => (x.k === "bin" && (x.op === "+" || x.op === "-")) || x.k === "neg" ? `\\left(${toTex(x)}\\right)` : toTex(x);
      switch (n.op) {
        case "+": return `${toTex(n.a)} + ${toTex(n.b)}`;
        case "-": return `${toTex(n.a)} - ${n.b.k === "bin" && (n.b.op === "+" || n.b.op === "-") ? `\\left(${toTex(n.b)}\\right)` : toTex(n.b)}`;
        case "*": {
          const l = wrapSum(n.a);
          const r = wrapSum(n.b);
          // 2x, 2\sqrt{3}, 3(x+1) look right juxtaposed; 2 · 3 needs a dot.
          const juxtapose = n.implicit && !(n.b.k === "num");
          return juxtapose ? `${l}${r}` : `${l} \\times ${r}`;
        }
        case "/": return `\\frac{${toTex(n.a)}}{${toTex(n.b)}}`;
        case "^": {
          const base = isAtom(n.a) && n.a.k !== "fn" ? toTex(n.a) : `\\left(${toTex(n.a)}\\right)`;
          return `${base}^{${toTex(n.b)}}`;
        }
      }
    }
  }
}

/** Walk every node (used for "form" checks such as simplest surd form). */
export function walk(n: Node, visit: (n: Node) => void) {
  visit(n);
  if (n.k === "neg" || n.k === "fn") walk(n.a, visit);
  if (n.k === "bin") {
    walk(n.a, visit);
    walk(n.b, visit);
  }
}

/** Letters used as variables in an expression. */
export function variablesIn(n: Node): string[] {
  const s = new Set<string>();
  walk(n, (x) => {
    if (x.k === "var") s.add(x.n);
  });
  return [...s];
}
