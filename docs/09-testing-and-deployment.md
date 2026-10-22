# Testing & deployment

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server on http://localhost:3000 |
| `npm run typecheck` | TypeScript strict check |
| `npm run lint` | ESLint, zero warnings allowed |
| `npm test` | Vitest: science engine + content integrity |
| `npm run build` | Production build (all pages are statically generated) |
| `npm run test:e2e` | Playwright on desktop and mobile (needs a production build) |
| `npm run check` | typecheck + lint + test + build |

## What the tests guarantee

- **Answer checker.** Units, scientific notation and decimal commas are understood. Equivalent answers are accepted, and wrong ones get the right feedback.
- **Chemistry engine.** Molar masses, electron configurations, ionic formulae, organic names and the balance of every stored equation are correct.
- **Every generator** produces 150 problems whose memo answers pass their own checker and whose formulas render.
- **Every formula** in every lesson, term, quiz and memo renders in KaTeX.
- **Every practice answer** passes its own checker; quizzes point at real options; puzzles and drills are well formed; exam memos have a line per mark; all 45 topics have lessons.
- **Exam season.** Full mocks contain every question of their grade and paper, and quick mocks can be reproduced from their seed.
- **End-to-end.** Pages load on desktop and mobile without console errors or sideways scrolling. A learner can answer a typed question, run a simulation and self-mark an exam question.

## Deploying

It's a static Next.js app: deploy it to Vercel, Netlify or any Node host. Node 18.18+ is required. There are no environment variables and no backend.

Every page is prerendered at build time, including the six mock papers (`/exam/mock/g10-p1` … `/exam/mock/g12-p2`).

**Vercel:** import the repository. The defaults (framework *Next.js*, `npm run build`) work as they are.

**Any Node host:** run `npm ci && npm run build && npm start`. It serves on port 3000; set `PORT` to change it.
