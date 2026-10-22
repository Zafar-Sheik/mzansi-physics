# ADHD, dyslexia & accessibility

ADHD brains thrive on **novelty, quick feedback and clear next steps**. They struggle with walls of text, hidden progress and long unbroken tasks. Physical Sciences adds a heavy load of vocabulary, symbols and multi-step calculations, so PhysicsMzansi is designed to reduce it.

## Built in

- **Step mode.** Lessons show one chunk at a time, with a big "Got it – next" button and the ← → keys.
- **Worked examples one step at a time.** No wall of calculations; each line comes with a "Why?".
- **One problem at a time** in practice blocks, with progress dots.
- **Simulations that wait.** Nothing moves until the learner presses Play, and there's always a Pause and a Reset. Calm mode slows or freezes decorative motion.
- **Instant feedback** everywhere, with specific hints instead of a bare ✗.
- **Memory hooks** for the hard-to-remember parts: AN OX / RED CAT, "Monkeys Eat Peanut Butter", "the rich get richer".
- **Focus sprints.** A 5, 10, 15 or 25-minute timer with movement-break suggestions.
- **Consistent colour meaning.** Each strand has one colour (see *Design system*). Red only ever means a mistake. Pink is a memory hook, amber an exam tip, blue a Mzansi moment, and the flask icon marks lab safety.
- **Visible progress**: progress bars per lesson, topic and strand, plus XP and streaks.

## Preferences (top-right button)

| Setting | What it does |
|---|---|
| Theme | Light, dark or high contrast |
| Font | Inter, Atkinson Hyperlegible or OpenDyslexic |
| Text size & line spacing | Bigger text, more space between lines |
| Calm mode | Switches off decorative animation; it also follows the operating system's "reduce motion" setting |
| Reading ruler | A highlight band that follows the pointer |
| Word anchors | Bolds the first half of each word to guide the eye (never inside formulas) |
| Read-aloud speed | Sets the speed of the read-aloud buttons, which also read formulas and units ("v equals 3 metres per second", "lambda", "delta H") |
| Focus mode | Hides the navigation so only the lesson remains |

## Accessibility basics

- Keyboard navigation everywhere, visible focus rings and a skip link.
- ARIA labels on interactive SVGs, and live number readouts beside every simulation, so nothing depends on seeing the animation.
- Touch targets of at least 32 px.
- Information is never shown by colour alone: the periodic table also shows category names, and graphs have labels.
- Formulas are rendered with KaTeX, which includes MathML for screen readers.
