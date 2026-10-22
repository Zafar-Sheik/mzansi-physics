# Writing lessons & exam questions

Lessons are TypeScript data in `src/content/lessons/<grade>-<physics|chemistry>.ts`. The type system and the test suite catch most mistakes.

## Formulas and chemistry in content

Use `String.raw` (aliased `m`) so LaTeX backslashes stay readable:

```ts
const m = String.raw;
{ type: "text", md: m`$$v_f^2 = v_i^2 + 2a\Delta x$$ and $\mathrm{2H_2 + O_2 \rightarrow 2H_2O}$` }
```

- `$…$` is inline and `$$…$$` is a display equation.
- Use real line breaks, not `\n`, inside `m` strings. A test fails if a stray `\n` sneaks in.
- Use `{,}` for decimal commas in LaTeX: `$9{,}8\ \text{m·s}^{-2}$`.
- Write chemical formulae in `\mathrm{…}`.
- For a nuclide, `${}^{A}_{Z}X` has to be written as `${"$"}{}^{A}_{Z}\mathrm{X}` inside an `m` string, because `${` would start a template expression.

## Blocks

| Block | Use it for |
|---|---|
| `text`, `callout`, `keypoints`, `table` | Teaching. Callout variants: key, tip, mistake, memory, exam, break, real-world ("Mzansi moment"), safety |
| `worked` | A worked example: `problem` plus `steps` (each with an optional `why`) |
| `practice` | Typed-answer problems: `q`, `answer`, optional `kind`, `unit`, `tol`/`rtol`, `hint`, and a full `solution` |
| `quiz` | Multiple choice with an explanation |
| `sequence`, `match` | Put-in-order and matching puzzles |
| `widget` | Any simulation, e.g. `{ widget: "circuit-lab", props: { internal: true } }`, or a `drill` with `generators` |
| `exam` | An exam-style question with a memo line per mark |
| `terms` | Shows the lesson's key terms as flashcards |

## Writing answers the checker can read

| Kind | Memo answer | Learner may type |
|---|---|---|
| `number` (default) | `4.375e10`, `1.5` (+ `unit`) | `4,375 × 10^10`, `v = 1,5 m/s` |
| `list` | `2; 7; 4; 6` | `2, 7, 4, 6` |
| `text` | `propan-1-ol \| 1-propanol` | either name; separate alternatives with ` \| ` |
| `formula` | `CH3COOH` | `CH₃COOH` |

Numbers are compared with a 1 % relative tolerance by default. Set `tol` for an absolute tolerance (e.g. `0.011` for pH to 2 decimals) or `rtol` for a different relative tolerance.

## Exam questions

They live in `src/content/exam.ts` and `exam-extra.ts`. Write one memo line per mark, with method marks as separate lines. Pick a `level` for each part: recall, comprehension, analysis or evaluation. Add a `figure: { widget: "…" }` to put a simulation next to the source.

## Adding content

1. Add lessons to the right file with a unique `slug` and `topic`.
2. Add question generators in `src/lib/sci/generators-physics.ts` or `generators-chemistry.ts`, then register them in `generators.ts`.
3. Register new widgets in `src/components/widgets/index.tsx` and `catalogue.ts`.
4. Run `npm run check`.
