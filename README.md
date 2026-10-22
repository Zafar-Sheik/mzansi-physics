# PhysicsMzansi

**An interactive Grade 10, 11 & 12 Physical Sciences companion for South African learners (CAPS, NSC Paper 1 Physics & Paper 2 Chemistry).**

It's the sister app of *MathsMzansi*, *CodeMzansi* (IT) and *GeoMzansi* (Geography), with the same learning design and accessibility features. Built with Next.js, KaTeX, GSAP and Aceternity UI patterns. It's designed to be fun, and to work for every learner, including learners with ADHD, dyslexia and other learning differences.

## What's inside

- 📚 **48 lessons, covering all 45 CAPS topics**, in short steps:
  - *Grade 10:* motion, energy, waves, sound, EM radiation, magnetism, electrostatics, circuits; matter, states and the KMT, the atom, the periodic table, bonding, physical and chemical change, reactions in water, the mole, the hydrosphere
  - *Grade 11:* vectors, Newton's laws, gravitation, optics, wavefronts and diffraction, Coulomb's law and fields, electromagnetism, Ohm's law and power; molecular structure, intermolecular forces, ideal gases, stoichiometry, energy change, acids, bases and redox, the lithosphere and mining
  - *Grade 12:* momentum and impulse, vertical projectile motion, work, energy and power, the Doppler effect, internal resistance, electrodynamics, the photoelectric effect; organic chemistry (naming and reactions), rates, equilibrium, acids and bases, electrochemistry, fertilisers
- 🔬 **39 simulations and labs.** Nothing moves until the learner presses Play, and each lab has an *Explain* box:
  - motion graphs, an energy skate park, vectors, forces on a slope, gravitation, collisions, projectiles, work and energy with friction
  - pulses and waves, sound, the EM spectrum, refraction and TIR, diffraction, the Doppler effect
  - charge sharing, magnetic fields, a circuit builder, Coulomb's law and fields, Faraday's law, internal resistance, generators and motors
  - the photoelectric effect, atomic spectra, states of matter, an atom builder, a periodic table with trends, VSEPR shapes, boiling-point charts, gas laws
  - an organic-molecule builder, an equation balancer, a mole calculator, energy profiles, collision theory, Le Chatelier, a virtual titration, galvanic and electrolytic cells
  - the NSC data sheets
- ✍️ **Typed answers that are actually checked**: `12 m/s`, `3 × 10^8`, `6,4e-19 J`, `CH3COOH`, `propan-1-ol`. Units, decimal commas and scientific notation are understood. Feedback is specific (sign, unit prefix, factor of 2, forgotten g) and there are hints and full worked solutions.
- ♾️ **Endless practice**: 43 question generators with worked solutions and streaks.
- 🪜 **Worked examples revealed one step at a time**, with a "Why?" for every step.
- 🃏 **Flashcards** with spaced repetition for 349 terms and laws, plus a glossary.
- ⚔️ **Quiz Arena**: mixed-topic rounds, relaxed or timed.
- 📝 **Exam Room**: 95 NSC-style questions (299 parts) with marking memos.
- ⏱️ **Mock papers**: Paper 1 and Paper 2 for each grade, full (116–158 marks) or quick (~50 marks), timed or untimed. They are self-marked and give an NSC level and a breakdown by topic.
- 🎯 **Weak-spot coach** and a 🖨️ **worksheet generator** for teachers.
- 🎮 **Games**: Speed Solve, Element Quest, Formula Pairs, True/False Blitz, Odd One Out, Science Hangman.
- 🧠 **Accessibility**: step mode, focus mode, focus sprints, calm mode, a reading ruler, word anchors, dyslexia-friendly fonts, read-aloud that reads formulas and units, high contrast.
- 🔒 **No accounts, no tracking**: everything is stored on the learner's device.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Command | |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run typecheck` | TypeScript strict check |
| `npm run lint` | ESLint (zero warnings) |
| `npm test` | Science-engine and content-integrity tests (Vitest) |
| `npm run test:e2e` | Browser tests on desktop + mobile (Playwright; needs a production build) |
| `npm run check` | typecheck + lint + test + build |

## Deploying

Every page is statically generated. There is no backend and there are no environment variables. Node 18.18+ is required.

```bash
npm ci
npm run check
npm start          # http://localhost:3000 (set PORT to change)
```

## Documentation

Teacher and developer docs live in [`docs/`](docs) and are rendered in the site at **`/teachers`**. They cover:
- overview and teacher quick-start
- CAPS curriculum map
- learning design
- ADHD, dyslexia and accessibility
- data sheets
- design system and architecture
- content authoring
- testing and deployment
- privacy
- FAQ

> An independent study aid, not a replacement for practical work. Always confirm exam details with your teacher and the latest DBE examination guidelines.
