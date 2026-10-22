/**
 * Turn markdown + LaTeX into something a screen reader / speech engine can say:
 * "\frac{3}{4}" → "3 over 4", "v^2" → "v squared", "\Delta x" → "delta x",
 * "\lambda" → "lambda", "\text{m·s}^{-1}" → "m s to the power minus 1".
 */
export function speakable(md: string): string {
  let s = md.replace(/\$\$?([^$]+)\$\$?/g, (_m, tex: string) => ` ${speakTex(tex)} `);
  s = s.replace(/```[\s\S]*?```/g, " ").replace(/[`*_#>|]/g, "").replace(/\s+/g, " ");
  return s.trim();
}

export function speakTex(tex: string): string {
  let t = tex;
  for (let i = 0; i < 4; i++) {
    t = t
      .replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, " $1 over $2 ")
      .replace(/\\sqrt\[3\]\{([^{}]*)\}/g, " cube root of $1 ")
      .replace(/\\sqrt\{([^{}]*)\}/g, " root $1 ")
      .replace(/\^\{?2\}?/g, " squared ")
      .replace(/\^\{?3\}?/g, " cubed ")
      .replace(/\^\{([^{}]*)\}/g, " to the power $1 ")
      .replace(/\^(\S)/g, " to the power $1 ")
      .replace(/_\{?([^{}\s]+)\}?/g, " $1 ");
  }
  return t
    .replace(/\\(left|right|quad|qquad|,|;|!|displaystyle|text|mathrm|ce)/g, " ")
    .replace(/\{,\}/g, " comma ")
    .replace(/\\(lambda|alpha|beta|gamma|mu|theta|phi|omega|rho|epsilon|varepsilon)/g, " $1 ")
    .replace(/\\Omega/g, " ohm ")
    .replace(/\\Phi/g, " phi ")
    .replace(/\\(rightarrow|to|longrightarrow)/g, " gives ")
    .replace(/\\rightleftharpoons/g, " is in equilibrium with ")
    .replace(/\\circ/g, " degrees ")
    .replace(/\\times|\\cdot/g, " times ")
    .replace(/\\div/g, " divided by ")
    .replace(/\\pm/g, " plus or minus ")
    .replace(/\\leq?/g, " less than or equal to ")
    .replace(/\\geq?/g, " greater than or equal to ")
    .replace(/\\neq/g, " not equal to ")
    .replace(/\\Rightarrow|\\therefore/g, " so ")
    .replace(/\\pi/g, " pi ")
    .replace(/\\theta/g, " theta ")
    .replace(/\\Delta/g, " delta ")
    .replace(/\\infty/g, " infinity ")
    .replace(/\\(sin|cos|tan)/g, " $1 ")
    .replace(/\\[a-zA-Z]+/g, " ")
    .replace(/</g, " less than ")
    .replace(/>/g, " greater than ")
    .replace(/=/g, " equals ")
    .replace(/(\d)\s*-\s*(\d)/g, "$1 minus $2")
    .replace(/power -/g, "power minus ")
    .replace(/[{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
