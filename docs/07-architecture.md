# Architecture

PhysicsMzansi is a **static Next.js site**. There is no database and no server-side learner data.

## Stack

Next.js 15 (App Router, static generation) · React 19 · TypeScript (strict) · Tailwind CSS 4 · KaTeX (remark-math + rehype-katex) · GSAP 3 · Motion (Aceternity UI components) · Vitest · Playwright

## Folders

```
src/
  app/                 routes (learn, flashcards, quiz, exam, exam/mock, toolkit, games, progress, teachers, api/curriculum)
  components/
    learn/             lesson player, quiz, practice, worked examples, flashcards, sequence, match, exam-part, markdown (+KaTeX)
    sci/               plot (SVG axes), answer-input (typed answers + keypad), problem-card
    widgets/           simulations and labs (code-split with next/dynamic), sim-kit, catalogue
    pages/             client components for each page
    home/, layout/, ui/, aceternity/
  content/
    lessons/*.ts       lessons as typed data, one file per grade and paper (g10-physics.ts … g12-chemistry.ts)
    exam.ts, exam-extra.ts  Exam Room questions and memos
    index.ts           LESSONS, LIVE_TOPICS, GLOSSARY, QUESTION_BANK
  lib/
    sci/expr.ts        safe expression parser (no eval)
    sci/check.ts       answer checker: numbers with units, lists, sets, text, formulae, points
    sci/chem.ts        118 elements, molar mass, electron configurations, ions, reduction potentials, equations
    sci/organic.ts     organic molecule model → IUPAC names, condensed and molecular formulae
    sci/generators-*.ts  seeded question generators with worked solutions
    sci/numbers.ts, speech.ts, gen-kit.ts
    topics.ts          grades, strands, topics, papers, colours and paper structure
    progress.ts, cards.ts, prefs.ts, mastery.ts, mock.ts, worksheet.ts
docs/                  this documentation (rendered at /teachers)
tests/                 Vitest unit + content tests, Playwright e2e
```

## The science engine

- **`check.ts`** reads what learners type:
  - numbers with decimal commas, scientific notation (`3 × 10^8`, `3e8`, `10⁻³`) and units
  - "v =" prefixes
  - lists, chemical formulae and names

  It compares numbers with a relative tolerance (1 % by default). Its feedback spots sign errors, powers-of-ten slips from unit prefixes, factor-of-2 slips and a forgotten g.
- **`chem.ts`** holds the periodic table with NSC molar masses and electronegativities. It also has formula parsing, electron configurations (including the Cr and Cu exceptions), ionic formulae, standard reduction potentials and a set of balanced equations.
- **`organic.ts`** models a molecule as a chain, a functional group, positions and branches. From that it generates IUPAC names, accepted alternative names and condensed formulae.
- **Generators** create fresh problems from a seed. The test suite generates 150 problems per generator and checks two things: every memo answer passes its own checker, and every formula renders in KaTeX.

## Data flow

- Lessons are plain TypeScript objects. Server components read them at build time and pass small, serialisable summaries to client components.
- The **glossary** and **quiz bank** are derived automatically from the lessons.
- Learner state lives in `localStorage` under keys prefixed `physicsmzansi:` (prefs, progress, cards, best scores and mock attempts). Each key is managed by a small `useSyncExternalStore` store.

## Topics

`src/lib/topics.ts` lists every CAPS topic (45 in total) with its grade, strand and paper. A topic is "live" once a lesson exists for it, and all 45 are live.
