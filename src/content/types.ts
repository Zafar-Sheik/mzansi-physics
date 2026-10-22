/**
 * Content model for lessons. Lessons are plain TypeScript data so that they
 * are type-checked and can be tested automatically: every quiz answer, every
 * practice answer, every formula (it must render in KaTeX) and every exam memo
 * is validated by the test-suite.
 *
 * Formulas are written in Markdown with LaTeX: `$v = f\lambda$` inline, `$$...$$` display.
 */

export type Grade = 10 | 11 | 12;

/** The six CAPS knowledge areas of Physical Sciences. */
export type Strand = "Mechanics" | "Waves, Sound & Light" | "Electricity & Magnetism" | "Matter & Materials" | "Chemical Change" | "Chemical Systems";

/** Paper 1 is Physics, Paper 2 is Chemistry (each 150 marks, 3 hours in Grade 12). */
export type Paper = 1 | 2;

/** A CAPS topic in a specific grade (see src/lib/topics.ts for titles, colours and papers). */
export type Topic =
  // Grade 10 – Physics
  | "g10-motion"
  | "g10-energy"
  | "g10-waves"
  | "g10-sound"
  | "g10-em"
  | "g10-magnetism"
  | "g10-electrostatics"
  | "g10-circuits"
  // Grade 10 – Chemistry
  | "g10-matter"
  | "g10-states"
  | "g10-atom"
  | "g10-periodic"
  | "g10-bonding"
  | "g10-change"
  | "g10-reactions"
  | "g10-mole"
  | "g10-hydrosphere"
  // Grade 11 – Physics
  | "g11-vectors"
  | "g11-newton"
  | "g11-gravitation"
  | "g11-optics"
  | "g11-wavefronts"
  | "g11-electrostatics"
  | "g11-electromagnetism"
  | "g11-circuits"
  // Grade 11 – Chemistry
  | "g11-molecules"
  | "g11-imf"
  | "g11-gases"
  | "g11-stoichiometry"
  | "g11-energy-change"
  | "g11-reactions"
  | "g11-lithosphere"
  // Grade 12 – Physics
  | "g12-momentum"
  | "g12-projectile"
  | "g12-work-energy"
  | "g12-doppler"
  | "g12-circuits"
  | "g12-electrodynamics"
  | "g12-photoelectric"
  // Grade 12 – Chemistry
  | "g12-organic"
  | "g12-rates"
  | "g12-equilibrium"
  | "g12-acids"
  | "g12-electrochem"
  | "g12-fertilisers";

export type CalloutVariant = "key" | "tip" | "mistake" | "memory" | "exam" | "break" | "real-world" | "safety";

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface Term {
  term: string;
  def: string;
}

/**
 * How a typed answer is checked (see src/lib/sci/check.ts):
 * - number:  one value; units, "v =", decimal commas and scientific notation are understood (3 × 10^8 m/s, 3e8, 1,6 × 10⁻¹⁹ C)
 * - list:    ordered numbers, e.g. balancing coefficients `2; 1; 2`
 * - set:     several values in any order
 * - text:    a word or name (case, spaces and hyphens ignored), alternatives separated by " | "
 * - formula: a chemical formula (case matters, spaces and sub/superscript style don't), alternatives separated by " | "
 * - point, expr: rarely used here (kept for graphs and algebra)
 */
export type AnswerKind = "number" | "list" | "set" | "text" | "formula" | "point" | "expr";

export interface PracticeProblem {
  q: string;
  /** The memo answer, written so the checker can read it (e.g. `24.5`, `3e8`, `2; 1; 2`, `butan-2-ol`). */
  answer: string;
  kind?: AnswerKind;
  /** The SI unit shown after the answer box, e.g. `m·s⁻¹`. */
  unit?: string;
  /** Absolute tolerance. */
  tol?: number;
  /** Relative tolerance (default 1 % – physics answers are rounded). */
  rtol?: number;
  /** Variables for `expr` answers (default: x). */
  vars?: string[];
  form?: "simplified-surd";
  hint?: string;
  /** Full worked solution (markdown), shown after an attempt. */
  solution: string;
  /** Optional diagram shown with the question. */
  figure?: { widget: WidgetName; props?: Record<string, unknown> };
}

export interface WorkedStep {
  md: string;
  /** Why this step is allowed – the bit learners usually skip. */
  why?: string;
}

export type Block =
  | { type: "text"; md: string }
  | { type: "callout"; variant: CalloutVariant; title?: string; md: string }
  | { type: "keypoints"; points: string[] }
  | { type: "flashcards"; cards: { front: string; back: string }[] }
  /** Renders the lesson's own key terms as flashcards. */
  | { type: "terms" }
  | { type: "quiz"; id: string; questions: QuizQuestion[] }
  | { type: "widget"; widget: WidgetName; props?: Record<string, unknown> }
  /** Put the steps of a method in order. */
  | { type: "sequence"; id: string; title: string; steps: string[]; explain: string }
  /** Match each item to its partner (term ↔ definition, quantity ↔ unit…). */
  | { type: "match"; id: string; title: string; pairs: { left: string; right: string }[] }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  /** A worked example revealed one step at a time ("predict, then reveal"). */
  | { type: "worked"; title: string; problem: string; steps: WorkedStep[] }
  /** Typed-answer practice with hints, instant checking and full solutions. */
  | { type: "practice"; id: string; title?: string; problems: PracticeProblem[] }
  /** A short exam-style question with a memo the learner self-marks against. */
  | { type: "exam"; question: ExamPart & { id: string } };

export type WidgetName =
  | "sorter"
  | "drill"
  | "motion-lab"
  | "projectile-lab"
  | "energy-lab"
  | "vector-lab"
  | "incline-lab"
  | "collision-lab"
  | "gravity-lab"
  | "wave-lab"
  | "pulse-lab"
  | "em-spectrum"
  | "refraction-lab"
  | "diffraction-lab"
  | "doppler-lab"
  | "circuit-lab"
  | "charge-lab"
  | "magnet-lab"
  | "generator-lab"
  | "photoelectric-lab"
  | "atom-builder"
  | "periodic-table"
  | "particle-box"
  | "gas-lab"
  | "equation-balancer"
  | "mole-lab"
  | "molecule-shapes"
  | "energy-profile"
  | "rate-lab"
  | "equilibrium-lab"
  | "titration-lab"
  | "cell-lab"
  | "organic-namer"
  | "property-chart"
  | "data-sheet";

export interface Chunk {
  id: string;
  title: string;
  /** Rough reading/doing time in minutes – chunks are kept short (2–10 min). */
  minutes: number;
  blocks: Block[];
}

export interface Lesson {
  slug: string;
  topic: Topic;
  order: number;
  title: string;
  tagline: string;
  emoji: string;
  /** CAPS reference. */
  caps: string;
  objectives: string[];
  /** Learning style tags used in docs: visual, auditory, read-write, kinaesthetic */
  styles: ("visual" | "auditory" | "read-write" | "kinaesthetic")[];
  xp: number;
  /** Key concepts and formulas – feed the lesson flashcards, the global deck and the games. */
  terms: Term[];
  chunks: Chunk[];
}

/** Cognitive levels used in the DBE Physical Sciences examination guidelines. */
export type CognitiveLevel = "recall" | "comprehension" | "analysis" | "evaluation";

export interface ExamPart {
  q: string;
  marks: number;
  /** Each memo line is one mark (one tick), exactly like an NSC marking memo. */
  memo: string[];
  level?: CognitiveLevel;
}

export interface ExamQuestion {
  id: string;
  topic: Topic;
  title: string;
  /** Stimulus: information, a diagram description or data that the questions refer to. */
  source?: string;
  /** Optional interactive figure shown with the source. */
  figure?: { widget: WidgetName; props?: Record<string, unknown> };
  parts: ExamPart[];
}
