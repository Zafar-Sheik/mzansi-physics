# Colours, type & design system

## One colour, one meaning

| Token | Light | Meaning |
|---|---|---|
| `--brand` | indigo `#4338ca` | Actions, links, "you can click this" |
| `--t-mech` | orange `#c2410c` | Mechanics |
| `--t-waves` | teal `#0e7490` | Waves, sound & light |
| `--t-elec` | gold `#a16207` | Electricity & magnetism |
| `--t-matter` | emerald `#047857` | Matter & materials |
| `--t-change` | berry `#be185d` | Chemical change |
| `--t-systems` | violet `#6d28d9` | Chemical systems |
| `--danger` | red | ONLY errors and common mistakes |
| `--memory` | pink | Memory hooks, flashcards |
| `--exam` | amber | Exam tips, Exam Room |
| `--mzansi` | blue | "Mzansi moment" real-world callouts |
| `--warning` | amber | Lab safety callouts |
| `--success` | green | Correct answers |

Every token has a dark-mode and a high-contrast value (see `src/app/globals.css`).

## Type

- **Space Grotesk** for headings, **Inter** for reading (switchable to Atkinson Hyperlegible or OpenDyslexic), and **JetBrains Mono** for typed answers.
- Formulas, units and chemical equations are rendered with **KaTeX**: `$…$` inline and `$$…$$` on their own line.
- Units follow the NSC style: `m·s⁻¹`, `mol·dm⁻³`, decimal commas, and a space between the number and its unit.

## Components

- The marketing pages use Aceternity-style components: aurora, spotlight, 3D cards, bento grid, moving borders and glow cards. Inside lessons the cards are calm and flat.
- Simulations are hand-built SVG driven by a shared kit (`src/components/widgets/sim-kit.tsx`):
  - Play/Pause/Reset controls
  - readouts
  - vector arrows
  - an Explain box
- They use the theme's CSS variables, so they follow the light, dark and high-contrast themes.
