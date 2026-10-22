import type { Lesson } from "../types";

const m = String.raw;

export const G11_CHEMISTRY: Lesson[] = [
  // ------------------------------------------------------------------ Molecular structure
  {
    slug: "molecular-structure",
    topic: "g11-molecules",
    order: 1,
    title: "Molecular structure: bonds, shapes & polarity",
    tagline: "Why water is bent, CO₂ is straight – and why it matters.",
    emoji: "🧬",
    caps: "CAPS Gr 11 · Matter & materials: covalent bonding, Lewis diagrams, dative bonds, molecular shape (VSEPR), electronegativity and bond polarity, polar and non-polar molecules, bond energy and bond length.",
    objectives: [
      "Draw Lewis diagrams, including double bonds and dative bonds",
      "Predict molecular shapes with VSEPR",
      "Use electronegativity differences to classify bonds",
      "Decide whether a molecule is polar",
      "Relate bond length to bond energy",
    ],
    styles: ["visual", "kinaesthetic"],
    xp: 90,
    terms: [
      { term: "Covalent bond", def: "The sharing of at least one pair of electrons by two atoms." },
      { term: "Dative (coordinate) covalent bond", def: m`A covalent bond in which both shared electrons come from the same atom, e.g. in $\mathrm{NH_4^+}$ and $\mathrm{H_3O^+}$.` },
      { term: "VSEPR theory", def: "Valence shell electron pair repulsion: electron pairs around a central atom repel and move as far apart as possible, which decides the shape." },
      { term: "Electronegativity", def: "A measure of the tendency of an atom in a molecule to attract bonding electrons." },
      { term: "Bond polarity", def: "ΔEN = 0: non-polar covalent; 0 < ΔEN ≤ 1: weakly polar; 1 < ΔEN ≤ 2,1: strongly polar; ΔEN > 2,1: ionic." },
      { term: "Polar molecule", def: "A molecule with an uneven charge distribution (a dipole), e.g. H₂O, NH₃, HCl." },
      { term: "Bond energy", def: "The energy needed to break one mole of a particular bond to separate the atoms (in kJ·mol⁻¹)." },
      { term: "Bond length", def: "The average distance between the nuclei of two bonded atoms. Shorter bonds are stronger." },
    ],
    chunks: [
      {
        id: "lewis",
        title: "Lewis diagrams & multiple bonds",
        minutes: 8,
        blocks: [
          { type: "text", md: m`Atoms share enough electron pairs to complete their octet. Sometimes one pair isn't enough:

- $\mathrm{O_2}$ shares **two** pairs: a **double bond** (O=O).
- $\mathrm{N_2}$ shares **three** pairs: a **triple bond** (N≡N) – very strong, which is why nitrogen gas is so unreactive.
- In $\mathrm{NH_4^+}$, the lone pair on N bonds to an $\mathrm{H^+}$ ion: a **dative covalent bond**.` },
          {
            type: "match",
            id: "lewis-match",
            title: "Bonding pairs and lone pairs on the central atom",
            pairs: [
              { left: m`$\mathrm{CH_4}$`, right: "4 bonding pairs, 0 lone pairs" },
              { left: m`$\mathrm{NH_3}$`, right: "3 bonding pairs, 1 lone pair" },
              { left: m`$\mathrm{H_2O}$`, right: "2 bonding pairs, 2 lone pairs" },
              { left: m`$\mathrm{BF_3}$`, right: "3 bonding pairs, 0 lone pairs" },
              { left: m`$\mathrm{CO_2}$`, right: "2 double bonds, 0 lone pairs on C" },
            ],
          },
        ],
      },
      {
        id: "shapes",
        title: "VSEPR shapes",
        minutes: 9,
        blocks: [
          { type: "text", md: m`Count the electron pairs around the **central atom** (bonding + lone pairs), then let them push apart. **Lone pairs push harder** than bonding pairs, squeezing the bond angles.` },
          { type: "widget", widget: "molecule-shapes" },
          {
            type: "table",
            headers: ["Bonding pairs", "Lone pairs", "Shape", "Example", "Angle"],
            rows: [
              ["2", "0", "linear", "CO₂, BeCl₂", "180°"],
              ["3", "0", "trigonal planar", "BF₃", "120°"],
              ["4", "0", "tetrahedral", "CH₄", "109,5°"],
              ["3", "1", "trigonal pyramidal", "NH₃", "≈ 107°"],
              ["2", "2", "angular (bent)", "H₂O", "≈ 104,5°"],
              ["5", "0", "trigonal bipyramidal", "PCl₅", "90° and 120°"],
              ["6", "0", "octahedral", "SF₆", "90°"],
            ],
          },
        ],
      },
      {
        id: "polarity",
        title: "Electronegativity & polarity",
        minutes: 9,
        blocks: [
          { type: "text", md: m`When two atoms with different electronegativities share electrons, the more electronegative atom pulls them closer and becomes slightly negative ($\delta^-$). The bond is **polar**. Whether the **molecule** is polar also depends on its **shape**: in a symmetrical molecule the bond dipoles cancel.` },
          {
            type: "worked",
            title: "Is CCl₄ polar?",
            problem: m`Use electronegativity to classify the C–Cl bond, then decide whether $\mathrm{CCl_4}$ is a polar molecule.`,
            steps: [
              { md: m`$\Delta EN = 3{,}0 - 2{,}5 = 0{,}5$ → weakly polar covalent bond` },
              { md: m`Shape: tetrahedral (4 bonding pairs, no lone pairs) – completely symmetrical.` },
              { md: m`The four bond dipoles cancel, so $\mathrm{CCl_4}$ is a **non-polar molecule** with polar bonds.`, why: "Shape matters! Compare CHCl₃, which is not symmetrical and is polar." },
            ],
          },
          {
            type: "widget",
            widget: "sorter",
            props: {
              id: "polar-molecules", title: "Polar or non-polar molecule?", buckets: ["Polar", "Non-polar"], colour: "var(--t-matter)",
              items: [
                { text: "H₂O", bucket: "Polar" }, { text: "NH₃", bucket: "Polar" }, { text: "HCl", bucket: "Polar" }, { text: "CHCl₃", bucket: "Polar" },
                { text: "CO₂", bucket: "Non-polar" }, { text: "CH₄", bucket: "Non-polar" }, { text: "CCl₄", bucket: "Non-polar" }, { text: "O₂", bucket: "Non-polar" }, { text: "BF₃", bucket: "Non-polar" },
              ],
            },
          },
          { type: "callout", variant: "key", md: m`**Bond length and bond energy:** the shorter the bond, the stronger it is (higher bond energy). Bond strength increases from single to double to triple bonds: C–C (347 kJ·mol⁻¹), C=C (614), C≡C (839).` },
          { type: "widget", widget: "drill", props: { generators: ["en-difference"], title: "Electronegativity drill" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["VSEPR: pairs repel; lone pairs repel most.", "ΔEN decides bond polarity; shape decides molecule polarity.", "Shorter bond → stronger bond → higher bond energy.", "A dative bond: both electrons from one atom."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "molecules-quiz",
            questions: [
              { q: "The shape of NH₃ is…", options: ["tetrahedral", "trigonal planar", "trigonal pyramidal", "angular"], answer: 2, explain: "3 bonding pairs and 1 lone pair." },
              { q: "CO₂ is non-polar because…", options: ["its bonds are non-polar", "it is linear so the dipoles cancel", "it has lone pairs", "it is a gas"], answer: 1, explain: "Polar C=O bonds, but symmetrical shape." },
              { q: "ΔEN for H–F is 1,9. The bond is…", options: ["non-polar", "weakly polar", "strongly polar", "ionic"], answer: 2, explain: "1 < 1,9 ≤ 2,1." },
              { q: "Which bond is the strongest?", options: ["C–C", "C=C", "C≡C", "they are equal"], answer: 2, explain: "Triple bonds are shortest and strongest." },
              { q: m`The bond in $\mathrm{H_3O^+}$ between O and the extra $\mathrm{H^+}$ is…`, options: ["ionic", "metallic", "dative covalent", "a hydrogen bond"], answer: 2, explain: "Both electrons come from a lone pair on O." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ IMF
  {
    slug: "intermolecular-forces",
    topic: "g11-imf",
    order: 1,
    title: "Intermolecular forces",
    tagline: "The weak 'stickiness' between molecules that decides boiling points.",
    emoji: "🤝",
    caps: "CAPS Gr 11 · Matter & materials: intermolecular and interatomic forces, ion-dipole, ion-induced dipole, dipole-dipole, dipole-induced dipole, induced dipole (London) forces, hydrogen bonds; the effect on melting point, boiling point, solubility, vapour pressure, viscosity and surface tension; the special properties of water.",
    objectives: [
      "Tell intramolecular bonds from intermolecular forces",
      "Name and describe the types of intermolecular forces",
      "Explain trends in boiling point, vapour pressure and solubility",
      "Explain the unusual properties of water",
    ],
    styles: ["visual", "read-write"],
    xp: 80,
    terms: [
      { term: "Intramolecular bond", def: "A strong bond WITHIN a molecule (covalent bond)." },
      { term: "Intermolecular force", def: "A weaker force of attraction BETWEEN molecules." },
      { term: "London (induced dipole) forces", def: "Weak attractions between temporary dipoles; present between ALL molecules and stronger for bigger molecules." },
      { term: "Dipole-dipole forces", def: "Attractions between the δ+ end of one polar molecule and the δ− end of another." },
      { term: "Hydrogen bond", def: "A strong dipole-dipole attraction between an H atom bonded to N, O or F and a lone pair on an N, O or F atom of another molecule." },
      { term: "Ion-dipole force", def: "The attraction between an ion and a polar molecule, e.g. Na⁺ ions and water when salt dissolves." },
      { term: "Vapour pressure", def: "The pressure exerted by a vapour in equilibrium with its liquid; weaker intermolecular forces → higher vapour pressure." },
      { term: "Like dissolves like", def: "Polar substances dissolve in polar solvents; non-polar substances dissolve in non-polar solvents." },
    ],
    chunks: [
      {
        id: "types",
        title: "Bonds vs forces",
        minutes: 8,
        blocks: [
          { type: "text", md: m`Boiling water does **not** break the O–H bonds inside the molecules – it only pulls the molecules **apart from each other**. Those attractions between molecules are **intermolecular forces**, and they are much weaker than covalent bonds.` },
          {
            type: "table",
            headers: ["Force", "Between", "Strength", "Example"],
            rows: [
              ["Ion-dipole", "ions and polar molecules", "strong", "NaCl dissolving in water"],
              ["Hydrogen bonds", "H on N/O/F and N/O/F of another molecule", "strongest IMF", "H₂O, NH₃, HF, alcohols"],
              ["Dipole-dipole", "polar molecules", "medium", "HCl, CH₃COCH₃"],
              ["London (induced dipole)", "all molecules (only force for non-polar ones)", "weak, grows with size", "CH₄, I₂, Ar"],
            ],
          },
          { type: "callout", variant: "mistake", md: m`A "hydrogen **bond**" is not a bond inside a molecule – it is an **intermolecular force** between molecules. It is only about 5–10 % as strong as a covalent bond.` },
        ],
      },
      {
        id: "properties",
        title: "Forces decide physical properties",
        minutes: 9,
        blocks: [
          { type: "text", md: m`**Stronger intermolecular forces → more energy needed to separate the molecules →** higher melting point, higher boiling point, **lower** vapour pressure, higher viscosity, higher surface tension.` },
          { type: "widget", widget: "property-chart" },
          { type: "widget", widget: "property-chart", props: { set: "hydrides", title: "Why water is special" } },
        ],
      },
      {
        id: "water",
        title: "Water: the hydrogen-bond champion",
        minutes: 6,
        blocks: [
          { type: "text", md: m`Thanks to hydrogen bonds, water has:

- a **high boiling point** for such a small molecule (liquid at room temperature);
- a **high specific heat capacity** – it heats up and cools down slowly, which is why coastal towns like Durban have milder climates than inland Bloemfontein;
- **ice is less dense than water** – the hydrogen bonds lock the molecules into an open lattice, so ice floats and lakes freeze from the top down, protecting fish below;
- a high **surface tension** (insects can walk on water).` },
          { type: "keypoints", points: ["IMFs are between molecules; bonds are inside them.", "Order: London < dipole-dipole < hydrogen bonds < ion-dipole.", "Stronger IMFs → higher bp and mp, lower vapour pressure.", "Like dissolves like."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "imf-quiz",
            questions: [
              { q: "Which substance has hydrogen bonds between its molecules?", options: ["CH₄", "HCl", "H₂O", "CO₂"], answer: 2, explain: "H bonded to O, with lone pairs on O." },
              { q: "Why does I₂ have a higher boiling point than F₂?", options: ["It is polar", "It forms hydrogen bonds", "It is bigger, so it has stronger London forces", "It is ionic"], answer: 2, explain: "Larger electron clouds → stronger induced dipoles." },
              { q: "A liquid with weak intermolecular forces has a…", options: ["high boiling point", "high vapour pressure", "high viscosity", "high surface tension"], answer: 1, explain: "Molecules escape easily into the gas phase." },
              { q: "Oil does not dissolve in water because…", options: ["oil is denser", "oil is non-polar and water is polar", "water is non-polar", "oil is ionic"], answer: 1, explain: "Like dissolves like." },
              { q: "When water boils, what is broken?", options: ["O–H covalent bonds", "hydrogen bonds between molecules", "the H and O atoms", "ionic bonds"], answer: 1, explain: "Only the intermolecular forces." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Gases
  {
    slug: "ideal-gases",
    topic: "g11-gases",
    order: 1,
    title: "Ideal gases & the gas laws",
    tagline: "Pressure, volume and temperature – one equation rules them all.",
    emoji: "🎈",
    caps: "CAPS Gr 11 · Matter & materials: the kinetic theory of gases, Boyle's law, Charles' law, the pressure-temperature law, the general gas equation, the ideal gas equation pV = nRT, ideal vs real gases.",
    objectives: [
      "Explain pressure in terms of the kinetic theory of gases",
      "State and use Boyle's, Charles' and the pressure-temperature law",
      m`Use $\frac{p_1V_1}{T_1} = \frac{p_2V_2}{T_2}$ and $pV = nRT$`,
      "Explain when real gases deviate from ideal behaviour",
    ],
    styles: ["visual", "kinaesthetic"],
    xp: 90,
    terms: [
      { term: "Boyle's law", def: "The pressure of an enclosed gas is inversely proportional to its volume, provided the temperature and amount of gas stay constant: p₁V₁ = p₂V₂." },
      { term: "Charles' law", def: "The volume of an enclosed gas is directly proportional to its kelvin temperature, provided the pressure and amount of gas stay constant: V₁/T₁ = V₂/T₂." },
      { term: "Pressure-temperature law", def: "The pressure of an enclosed gas is directly proportional to its kelvin temperature at constant volume: p₁/T₁ = p₂/T₂." },
      { term: "General gas equation", def: m`$\frac{p_1V_1}{T_1} = \frac{p_2V_2}{T_2}$` },
      { term: "Ideal gas equation", def: m`$pV = nRT$ with p in Pa, V in m³, T in K and $R = 8{,}31\ \text{J·K}^{-1}\text{·mol}^{-1}$.` },
      { term: "Kelvin temperature", def: m`$T = \theta + 273$; 0 K (−273 °C) is absolute zero.` },
      { term: "Ideal gas", def: "A gas whose particles have no volume and no intermolecular forces. Real gases behave least ideally at HIGH pressure and LOW temperature." },
    ],
    chunks: [
      {
        id: "pressure",
        title: "What is gas pressure?",
        minutes: 7,
        blocks: [
          { type: "text", md: m`Gas particles move fast and randomly and keep colliding with the walls of their container. Each collision pushes on the wall; **pressure** is the total force per unit area of all these collisions.

- **Smaller volume** → particles hit the walls more often → higher pressure.
- **Higher temperature** → faster particles hit harder and more often → higher pressure.` },
          { type: "widget", widget: "gas-lab" },
        ],
      },
      {
        id: "laws",
        title: "The three gas laws",
        minutes: 10,
        blocks: [
          { type: "widget", widget: "gas-lab", props: { law: "charles", title: "Charles' law: heat the gas" } },
          { type: "callout", variant: "mistake", md: m`Always convert °C to **kelvin** in gas law calculations. Doubling the temperature from 20 °C to 40 °C does NOT double the volume – that would need 293 K → 586 K.` },
          {
            type: "worked",
            title: "A tyre on a hot day",
            problem: m`A car tyre has a pressure of $220\ \text{kPa}$ at $17\ ^\circ\text{C}$. After a long drive on the N1 the tyre is at $47\ ^\circ\text{C}$. Assuming the volume stays the same, calculate the new pressure.`,
            steps: [
              { md: m`$T_1 = 17 + 273 = 290\ \text{K}$; $T_2 = 47 + 273 = 320\ \text{K}$` },
              { md: m`$\frac{p_1}{T_1} = \frac{p_2}{T_2} \Rightarrow \frac{220}{290} = \frac{p_2}{320}$` },
              { md: m`$p_2 = 242{,}76\ \text{kPa}$`, why: "That's why you check tyre pressure when the tyres are cold." },
            ],
          },
          {
            type: "practice",
            id: "gas-practice",
            problems: [
              { q: m`A gas occupies $6\ \text{dm}^3$ at $100\ \text{kPa}$. It is compressed to $2\ \text{dm}^3$ at constant temperature. Calculate the new pressure.`, answer: "300", unit: "kPa", solution: m`$$p_2 = \frac{p_1V_1}{V_2} = \frac{(100)(6)}{2} = 300\ \text{kPa}$$` },
              { q: m`A balloon has a volume of $3\ \text{dm}^3$ at $27\ ^\circ\text{C}$. Calculate its volume at $127\ ^\circ\text{C}$ (constant pressure).`, answer: "4", unit: "dm³", solution: m`$$V_2 = \frac{V_1T_2}{T_1} = \frac{(3)(400)}{300} = 4\ \text{dm}^3$$` },
              { q: m`A gas at $100\ \text{kPa}$, $10\ \text{dm}^3$ and $300\ \text{K}$ changes to $200\ \text{kPa}$ and $450\ \text{K}$. Calculate its new volume.`, answer: "7.5", unit: "dm³", solution: m`$$V_2 = \frac{p_1V_1T_2}{T_1p_2} = \frac{(100)(10)(450)}{(300)(200)} = 7{,}5\ \text{dm}^3$$` },
            ],
          },
        ],
      },
      {
        id: "ideal",
        title: "pV = nRT",
        minutes: 8,
        blocks: [
          { type: "text", md: m`$$pV = nRT$$ Use **SI units**: p in **Pa** (1 kPa = 1 000 Pa), V in **m³** (1 dm³ = 10⁻³ m³), T in **K**.` },
          {
            type: "worked",
            title: "Moles in a gas cylinder",
            problem: m`A $20\ \text{dm}^3$ cylinder holds gas at $500\ \text{kPa}$ and $27\ ^\circ\text{C}$. How many moles of gas are inside?`,
            steps: [
              { md: m`$p = 500\,000\ \text{Pa}$; $V = 0{,}02\ \text{m}^3$; $T = 300\ \text{K}$` },
              { md: m`$n = \frac{pV}{RT} = \frac{(500\,000)(0{,}02)}{(8{,}31)(300)} = 4{,}01\ \text{mol}$` },
            ],
          },
          {
            type: "practice",
            id: "pvnrt-practice",
            problems: [
              { q: m`Calculate the pressure (in Pa) of $2\ \text{mol}$ of gas in a $0{,}05\ \text{m}^3$ container at $300\ \text{K}$.`, answer: "99720", unit: "Pa", solution: m`$$p = \frac{nRT}{V} = \frac{(2)(8{,}31)(300)}{0{,}05} = 99\,720\ \text{Pa}$$` },
              { q: m`What volume (in m³) does $1\ \text{mol}$ of gas occupy at $101\,300\ \text{Pa}$ and $273\ \text{K}$?`, answer: "0.0224", unit: "m³", solution: m`$$V = \frac{(1)(8{,}31)(273)}{101\,300} = 0{,}0224\ \text{m}^3 = 22{,}4\ \text{dm}^3$$ – the molar gas volume at STP!` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["gas-laws"], title: "Gas law drill" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["Pressure comes from particles colliding with the walls.", "Boyle: p ∝ 1/V; Charles: V ∝ T; pressure law: p ∝ T (T in kelvin).", m`$pV = nRT$ in SI units.`, "Real gases deviate at high pressure and low temperature."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "gases-quiz",
            questions: [
              { q: "At constant temperature, the volume of a gas is halved. Its pressure…", options: ["halves", "doubles", "stays the same", "quadruples"], answer: 1, explain: "Boyle's law: p ∝ 1/V." },
              { q: "27 °C in kelvin is…", options: ["−246 K", "27 K", "300 K", "273 K"], answer: 2, explain: "27 + 273 = 300 K." },
              { q: "Real gases behave most like ideal gases at…", options: ["high pressure, low temperature", "low pressure, high temperature", "high pressure, high temperature", "absolute zero"], answer: 1, explain: "The particles are far apart and fast, so their size and attractions matter least." },
              { q: m`In $pV = nRT$, volume must be in…`, options: ["dm³", "cm³", "m³", "litres"], answer: 2, explain: "SI units: m³." },
              { q: "A V-T graph (T in K) for a gas at constant pressure is…", options: ["a straight line through the origin", "a curve", "horizontal", "vertical"], answer: 0, explain: "V is directly proportional to T." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Stoichiometry
  {
    slug: "stoichiometry",
    topic: "g11-stoichiometry",
    order: 1,
    title: "Stoichiometry: limiting reagents, yield & purity",
    tagline: "Recipe maths for chemists – how much product can you really make?",
    emoji: "🧮",
    caps: "CAPS Gr 11 · Chemical change: molar volume of gases, volume relationships in gaseous reactions, concentration of solutions, limiting reagents, percentage yield, percentage purity, empirical and molecular formulae.",
    objectives: [
      "Use mole ratios from balanced equations",
      "Use the molar gas volume at STP",
      "Find the limiting reagent",
      "Calculate percentage yield and percentage purity",
    ],
    styles: ["read-write", "kinaesthetic"],
    xp: 100,
    terms: [
      { term: "Stoichiometry", def: "Calculating the amounts of reactants and products using the mole ratios in a balanced equation." },
      { term: "Molar gas volume", def: m`One mole of any gas occupies $22{,}4\ \text{dm}^3$ at STP (273 K and 101,3 kPa): $n = \frac{V}{V_m}$.` },
      { term: "Limiting reagent", def: "The reactant that is completely used up first; it determines the maximum amount of product." },
      { term: "Excess reagent", def: "The reactant left over when the reaction stops." },
      { term: "Percentage yield", def: m`$\frac{\text{actual yield}}{\text{theoretical yield}} \times 100$` },
      { term: "Percentage purity", def: m`$\frac{\text{mass of pure substance}}{\text{mass of impure sample}} \times 100$` },
    ],
    chunks: [
      {
        id: "ratios",
        title: "The mole ratio road map",
        minutes: 9,
        blocks: [
          { type: "callout", variant: "real-world", md: m`A vetkoek recipe needs 2 cups of flour for every egg. With 10 cups of flour and 3 eggs, you can only make 3 batches – the **eggs are the limiting ingredient**. Chemical reactions work exactly the same way, using **moles** instead of cups.` },
          {
            type: "sequence",
            id: "stoich-roadmap",
            title: "Mass of A → mass of B",
            steps: ["Write the balanced equation", "Convert the given mass of A to moles: n = m/M", "Use the mole ratio from the equation to get moles of B", "Convert moles of B to what is asked (mass, volume or concentration)"],
            explain: "You can never go straight from grams to grams – always go through moles.",
          },
          {
            type: "worked",
            title: "Making ammonia",
            problem: m`$\mathrm{N_2 + 3H_2 \rightarrow 2NH_3}$. What mass of ammonia forms from $12\ \text{g}$ of hydrogen (excess nitrogen)?`,
            steps: [
              { md: m`$n(\mathrm{H_2}) = \frac{12}{2} = 6\ \text{mol}$` },
              { md: m`Ratio $\mathrm{H_2 : NH_3} = 3 : 2$, so $n(\mathrm{NH_3}) = 6 \times \frac{2}{3} = 4\ \text{mol}$` },
              { md: m`$m = nM = (4)(17) = 68\ \text{g}$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["stoichiometry"], title: "Reacting masses drill" } },
        ],
      },
      {
        id: "limiting",
        title: "Limiting reagents",
        minutes: 9,
        blocks: [
          {
            type: "worked",
            title: "Magnesium and hydrochloric acid",
            problem: m`$\mathrm{Mg + 2HCl \rightarrow MgCl_2 + H_2}$. $4{,}8\ \text{g}$ of Mg is added to $0{,}3\ \text{mol}$ of HCl. Which is the limiting reagent, and what volume of $\mathrm{H_2}$ (at STP) forms?`,
            steps: [
              { md: m`$n(\mathrm{Mg}) = \frac{4{,}8}{24} = 0{,}2\ \text{mol}$` },
              { md: m`0,2 mol Mg needs $2 \times 0{,}2 = 0{,}4\ \text{mol}$ HCl – but only 0,3 mol is there.`, why: "Check what each reactant needs according to the ratio." },
              { md: m`So **HCl is the limiting reagent** (Mg is in excess).` },
              { md: m`$n(\mathrm{H_2}) = \frac{0{,}3}{2} = 0{,}15\ \text{mol}$; $V = nV_m = (0{,}15)(22{,}4) = 3{,}36\ \text{dm}^3$` },
            ],
          },
          {
            type: "practice",
            id: "limiting-practice",
            problems: [
              { q: m`$\mathrm{2H_2 + O_2 \rightarrow 2H_2O}$. $3\ \text{mol}$ of $\mathrm{H_2}$ reacts with $2\ \text{mol}$ of $\mathrm{O_2}$. How many moles of water form?`, answer: "3", unit: "mol", hint: "3 mol H₂ needs only 1,5 mol O₂ – so H₂ is limiting.", solution: m`H₂ is limiting: $n(\mathrm{H_2O}) = n(\mathrm{H_2}) = 3\ \text{mol}$ (0,5 mol O₂ is left over).` },
              { q: m`What volume (dm³, at STP) does $0{,}5\ \text{mol}$ of $\mathrm{CO_2}$ occupy?`, answer: "11.2", unit: "dm³", solution: m`$$V = nV_m = (0{,}5)(22{,}4) = 11{,}2\ \text{dm}^3$$` },
              { q: m`$\mathrm{CaCO_3 \rightarrow CaO + CO_2}$. What mass of CaO forms from $50\ \text{g}$ of $\mathrm{CaCO_3}$?`, answer: "28", unit: "g", solution: m`$$n = \frac{50}{100} = 0{,}5\ \text{mol} \Rightarrow m(\mathrm{CaO}) = (0{,}5)(56) = 28\ \text{g}$$` },
            ],
          },
        ],
      },
      {
        id: "yield",
        title: "Percentage yield & purity",
        minutes: 8,
        blocks: [
          { type: "text", md: m`In real life you rarely get the full theoretical amount: some product sticks to the glassware, side reactions happen, reactants are impure. $$\%\ \text{yield} = \frac{\text{actual}}{\text{theoretical}} \times 100 \qquad \%\ \text{purity} = \frac{\text{pure}}{\text{sample}} \times 100$$` },
          {
            type: "worked",
            title: "Impure limestone",
            problem: m`$20\ \text{g}$ of impure limestone produces $3{,}52\ \text{g}$ of $\mathrm{CO_2}$ when heated ($\mathrm{CaCO_3 \rightarrow CaO + CO_2}$). Calculate the percentage purity of the limestone.`,
            steps: [
              { md: m`$n(\mathrm{CO_2}) = \frac{3{,}52}{44} = 0{,}08\ \text{mol} = n(\mathrm{CaCO_3})$` },
              { md: m`$m(\mathrm{CaCO_3}) = (0{,}08)(100) = 8\ \text{g}$ of pure $\mathrm{CaCO_3}$` },
              { md: m`$\%\ \text{purity} = \frac{8}{20} \times 100 = 40\%$` },
            ],
          },
          {
            type: "practice",
            id: "yield-practice",
            problems: [
              { q: "The theoretical yield of a reaction is 25 g, but only 21 g is collected. Calculate the percentage yield.", answer: "84", unit: "%", solution: m`$$\frac{21}{25} \times 100 = 84\%$$` },
              { q: "A 50 g sample of ore contains 35 g of iron oxide. Calculate the percentage purity of the ore.", answer: "70", unit: "%", solution: m`$$\frac{35}{50} \times 100 = 70\%$$` },
            ],
          },
          { type: "widget", widget: "mole-lab", props: { mode: "gas", title: "Gas volumes at STP" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["Mass → moles → mole ratio → moles → answer.", m`At STP: $n = \frac{V}{22{,}4}$.`, "The limiting reagent runs out first and sets the yield.", "% yield = actual/theoretical × 100."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "stoich-quiz",
            questions: [
              { q: "The limiting reagent is the reactant that…", options: ["is in excess", "is used up first", "has the biggest mass", "is a gas"], answer: 1, explain: "When it runs out, the reaction stops." },
              { q: m`In $\mathrm{N_2 + 3H_2 \rightarrow 2NH_3}$, 2 mol of N₂ makes how much NH₃?`, options: ["2 mol", "3 mol", "4 mol", "6 mol"], answer: 2, explain: "Ratio 1 : 2." },
              { q: "At STP, 44,8 dm³ of any gas contains…", options: ["1 mol", "2 mol", "22,4 mol", "0,5 mol"], answer: 1, explain: "44,8 / 22,4 = 2 mol." },
              { q: "A percentage yield above 100 % suggests…", options: ["a perfect experiment", "the product is impure or still wet", "the limiting reagent was in excess", "this is normal"], answer: 1, explain: "You can't make more than the theoretical amount." },
              { q: "Gases react in simple volume ratios equal to…", options: ["their masses", "their mole ratios", "their densities", "1 : 1 always"], answer: 1, explain: "Equal volumes contain equal numbers of moles (Avogadro)." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Energy & chemical change
  {
    slug: "energy-chemical-change",
    topic: "g11-energy-change",
    order: 1,
    title: "Energy & chemical change",
    tagline: "Why some reactions get hot and others get cold.",
    emoji: "🌡️",
    caps: "CAPS Gr 11 · Chemical change: energy changes in reactions related to bond energy, exothermic and endothermic reactions, heat of reaction ΔH, activation energy, the activated complex, potential energy diagrams.",
    objectives: [
      "Explain energy changes in terms of breaking and forming bonds",
      "Classify reactions as exothermic or endothermic using ΔH",
      "Draw and interpret potential energy diagrams",
      "Define activation energy and the activated complex",
    ],
    styles: ["visual", "read-write"],
    xp: 70,
    terms: [
      { term: "Exothermic reaction", def: "A reaction that releases energy to the surroundings; ΔH < 0 (the surroundings get warmer)." },
      { term: "Endothermic reaction", def: "A reaction that absorbs energy from the surroundings; ΔH > 0 (the surroundings get colder)." },
      { term: "Heat of reaction (ΔH)", def: "The energy absorbed or released in a reaction: ΔH = E(products) − E(reactants), in kJ·mol⁻¹." },
      { term: "Activation energy (Eₐ)", def: "The minimum energy needed for a reaction to take place." },
      { term: "Activated complex", def: "The unstable, high-energy temporary arrangement of atoms at the top of the energy profile, where old bonds are breaking and new bonds forming." },
      { term: "Bond breaking / forming", def: "Breaking bonds ABSORBS energy; forming bonds RELEASES energy." },
    ],
    chunks: [
      {
        id: "bonds",
        title: "Breaking and making bonds",
        minutes: 8,
        blocks: [
          { type: "callout", variant: "real-world", md: m`A gas braai stove gets hot – burning propane is **exothermic**. A cold pack for a sports injury gets icy – dissolving ammonium nitrate is **endothermic**. Every reaction either gives energy out or takes it in.` },
          { type: "text", md: m`In every reaction, bonds in the reactants **break** (this **absorbs** energy) and new bonds in the products **form** (this **releases** energy).

- More energy released than absorbed → **exothermic**, ΔH **negative**.
- More energy absorbed than released → **endothermic**, ΔH **positive**.` },
          {
            type: "widget",
            widget: "sorter",
            props: {
              id: "exo-endo", title: "Exothermic or endothermic?", buckets: ["Exothermic (ΔH < 0)", "Endothermic (ΔH > 0)"], colour: "var(--t-change)",
              items: [
                { text: "Burning wood", bucket: "Exothermic (ΔH < 0)" }, { text: "Respiration", bucket: "Exothermic (ΔH < 0)" }, { text: "Neutralising an acid", bucket: "Exothermic (ΔH < 0)" },
                { text: "A hand warmer", bucket: "Exothermic (ΔH < 0)" }, { text: "Photosynthesis", bucket: "Endothermic (ΔH > 0)" }, { text: "Decomposing CaCO₃ by heating", bucket: "Endothermic (ΔH > 0)" },
                { text: "A cold pack", bucket: "Endothermic (ΔH > 0)" }, { text: "Cooking an egg", bucket: "Endothermic (ΔH > 0)" },
              ],
            },
          },
        ],
      },
      {
        id: "profiles",
        title: "Potential energy diagrams",
        minutes: 9,
        blocks: [
          { type: "widget", widget: "energy-profile" },
          {
            type: "worked",
            title: "Reading an energy profile",
            problem: m`Reactants: $80\ \text{kJ·mol}^{-1}$; activated complex: $200\ \text{kJ·mol}^{-1}$; products: $20\ \text{kJ·mol}^{-1}$. Find ΔH and Eₐ, and classify the reaction.`,
            steps: [
              { md: m`$\Delta H = E_p - E_r = 20 - 80 = -60\ \text{kJ·mol}^{-1}$ → exothermic` },
              { md: m`$E_a = 200 - 80 = 120\ \text{kJ·mol}^{-1}$`, why: "Activation energy is measured from the REACTANTS up to the activated complex." },
              { md: m`(The reverse reaction would have $E_a = 200 - 20 = 180\ \text{kJ·mol}^{-1}$ and $\Delta H = +60$.)` },
            ],
          },
          {
            type: "practice",
            id: "dh-practice",
            problems: [
              { q: m`The reactants have $250\ \text{kJ·mol}^{-1}$ and the products $310\ \text{kJ·mol}^{-1}$ of potential energy. Calculate ΔH.`, answer: "60", unit: "kJ·mol⁻¹", solution: m`$\Delta H = 310 - 250 = +60\ \text{kJ·mol}^{-1}$ (endothermic).` },
              { q: m`For the reaction above, the activated complex is at $400\ \text{kJ·mol}^{-1}$. Calculate the activation energy.`, answer: "150", unit: "kJ·mol⁻¹", solution: m`$E_a = 400 - 250 = 150\ \text{kJ·mol}^{-1}$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["enthalpy"], title: "ΔH & Eₐ drill" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["Breaking bonds absorbs energy; forming bonds releases it.", "Exothermic: ΔH < 0; endothermic: ΔH > 0.", "Eₐ = activated complex − reactants.", "The activated complex is unstable and short-lived."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "energy-change-quiz",
            questions: [
              { q: "In an exothermic reaction, ΔH is…", options: ["positive", "negative", "zero", "always 100"], answer: 1, explain: "Energy leaves the system." },
              { q: "Breaking chemical bonds…", options: ["releases energy", "absorbs energy", "doesn't involve energy", "creates mass"], answer: 1, explain: "You must put energy in to pull atoms apart." },
              { q: "The activated complex is found…", options: ["at the start", "at the top of the energy profile", "at the end", "only in endothermic reactions"], answer: 1, explain: "It's the highest-energy point." },
              { q: "A reaction makes its test tube feel cold. It is…", options: ["exothermic", "endothermic", "a physical change only", "neutral"], answer: 1, explain: "It absorbs heat from the surroundings (including your hand)." },
              { q: "Activation energy is the…", options: ["energy released", "minimum energy needed to start a reaction", "energy of the products", "same as ΔH"], answer: 1, explain: "The energy 'hill' that must be climbed." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Acids, bases & redox
  {
    slug: "acids-bases-redox",
    topic: "g11-reactions",
    order: 1,
    title: "Acids, bases & redox reactions",
    tagline: "Proton donors, electron thieves and the reactions that power batteries.",
    emoji: "🍋",
    caps: "CAPS Gr 11 · Chemical change: acids and bases (Arrhenius and Lowry-Brønsted), conjugate acid-base pairs, ampholytes, neutralisation, indicators; redox reactions, oxidation numbers, oxidising and reducing agents, balancing half-reactions.",
    objectives: [
      "Define acids and bases (Arrhenius and Lowry-Brønsted)",
      "Identify conjugate acid-base pairs and ampholytes",
      "Assign oxidation numbers",
      "Identify oxidation, reduction, oxidising agents and reducing agents",
    ],
    styles: ["read-write", "visual"],
    xp: 90,
    terms: [
      { term: "Arrhenius acid / base", def: "An acid produces H⁺ (H₃O⁺) ions in water; a base produces OH⁻ ions in water." },
      { term: "Lowry-Brønsted acid", def: "A proton (H⁺) donor." },
      { term: "Lowry-Brønsted base", def: "A proton (H⁺) acceptor." },
      { term: "Conjugate acid-base pair", def: m`Two substances that differ by one H⁺, e.g. $\mathrm{HCl/Cl^-}$ or $\mathrm{NH_4^+/NH_3}$.` },
      { term: "Ampholyte (amphiprotic)", def: m`A substance that can act as an acid or a base, e.g. $\mathrm{H_2O}$, $\mathrm{HCO_3^-}$.` },
      { term: "Neutralisation", def: "An acid reacts with a base to form a salt and water." },
      { term: "Oxidation", def: "A loss of electrons (an increase in oxidation number)." },
      { term: "Reduction", def: "A gain of electrons (a decrease in oxidation number)." },
      { term: "Oxidising agent", def: "The substance that is reduced (it takes electrons from another)." },
      { term: "Reducing agent", def: "The substance that is oxidised (it gives electrons to another)." },
    ],
    chunks: [
      {
        id: "acids",
        title: "Acids and bases",
        minutes: 9,
        blocks: [
          { type: "text", md: m`**Arrhenius** (1887): acids release $\mathrm{H^+}$ in water; bases release $\mathrm{OH^-}$.

**Lowry-Brønsted** (1923): an **acid donates a proton** ($\mathrm{H^+}$) and a **base accepts a proton**. This works even without water and for bases like $\mathrm{NH_3}$ that contain no $\mathrm{OH^-}$.` },
          {
            type: "worked",
            title: "Conjugate pairs",
            problem: m`Identify the acids, bases and conjugate pairs in $\mathrm{NH_3 + H_2O \rightleftharpoons NH_4^+ + OH^-}$.`,
            steps: [
              { md: m`$\mathrm{H_2O}$ gives an $\mathrm{H^+}$ to $\mathrm{NH_3}$ → $\mathrm{H_2O}$ is the **acid**, $\mathrm{NH_3}$ the **base**.` },
              { md: m`Conjugate pairs: $\mathrm{NH_4^+ / NH_3}$ and $\mathrm{H_2O / OH^-}$.`, why: "Each pair differs by exactly one H⁺." },
              { md: m`In $\mathrm{HCl + H_2O \rightarrow H_3O^+ + Cl^-}$ water acts as a **base** – so water is an **ampholyte**.` },
            ],
          },
          {
            type: "match",
            id: "conjugate-match",
            title: "Match each acid to its conjugate base",
            pairs: [
              { left: m`$\mathrm{HCl}$`, right: m`$\mathrm{Cl^-}$` },
              { left: m`$\mathrm{H_2SO_4}$`, right: m`$\mathrm{HSO_4^-}$` },
              { left: m`$\mathrm{NH_4^+}$`, right: m`$\mathrm{NH_3}$` },
              { left: m`$\mathrm{H_3O^+}$`, right: m`$\mathrm{H_2O}$` },
              { left: m`$\mathrm{H_2CO_3}$`, right: m`$\mathrm{HCO_3^-}$` },
            ],
          },
          { type: "callout", variant: "real-world", md: m`Farmers spread **lime** ($\mathrm{CaO}$ or $\mathrm{CaCO_3}$) on acidic soils in Mpumalanga to neutralise them. An antacid tablet neutralises excess stomach acid. Both are acid-base reactions.` },
        ],
      },
      {
        id: "redox",
        title: "Redox: electron transfer",
        minutes: 10,
        blocks: [
          { type: "callout", variant: "memory", md: m`**OIL RIG** – **O**xidation **I**s **L**oss, **R**eduction **I**s **G**ain (of electrons).` },
          {
            type: "table",
            headers: ["Rule for oxidation numbers", "Example"],
            rows: [
              ["An element on its own is 0", m`$\mathrm{Fe}$, $\mathrm{O_2}$: 0`],
              ["A monatomic ion = its charge", m`$\mathrm{Na^+}$: +1, $\mathrm{Cl^-}$: −1`],
              ["O is usually −2 (−1 in peroxides)", m`$\mathrm{H_2O}$`],
              ["H is usually +1 (−1 in metal hydrides)", m`$\mathrm{HCl}$`],
              ["The sum = the charge on the species", m`$\mathrm{SO_4^{2-}}$: $x + 4(-2) = -2$, $x = +6$`],
            ],
          },
          {
            type: "worked",
            title: "Zinc in copper sulfate",
            problem: m`$\mathrm{Zn + CuSO_4 \rightarrow ZnSO_4 + Cu}$. Identify the substance oxidised, the substance reduced, and the oxidising and reducing agents.`,
            steps: [
              { md: m`Zn: $0 \rightarrow +2$ – loses 2 electrons: **oxidised** ($\mathrm{Zn \rightarrow Zn^{2+} + 2e^-}$)` },
              { md: m`Cu: $+2 \rightarrow 0$ – gains 2 electrons: **reduced** ($\mathrm{Cu^{2+} + 2e^- \rightarrow Cu}$)` },
              { md: m`Oxidising agent: $\mathrm{Cu^{2+}}$ (it was reduced). Reducing agent: $\mathrm{Zn}$ (it was oxidised).`, why: "The agent is named after what it does to the OTHER substance." },
            ],
          },
          {
            type: "practice",
            id: "ox-practice",
            problems: [
              { q: m`What is the oxidation number of Mn in $\mathrm{KMnO_4}$?`, answer: "7", solution: m`$(+1) + x + 4(-2) = 0 \Rightarrow x = +7$` },
              { q: m`What is the oxidation number of N in $\mathrm{NO_3^-}$?`, answer: "5", solution: m`$x + 3(-2) = -1 \Rightarrow x = +5$` },
              { q: m`What is the oxidation number of Cr in $\mathrm{Cr_2O_7^{2-}}$?`, answer: "6", solution: m`$2x + 7(-2) = -2 \Rightarrow x = +6$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["oxidation-number"], title: "Oxidation number drill" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["Lowry-Brønsted: acid donates H⁺, base accepts H⁺.", "Conjugate pairs differ by one H⁺; water is an ampholyte.", "OIL RIG: oxidation is loss, reduction is gain of electrons.", "The oxidising agent is reduced; the reducing agent is oxidised."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "acid-redox-quiz",
            questions: [
              { q: "According to Lowry-Brønsted, a base is a…", options: ["proton donor", "proton acceptor", "electron donor", "OH⁻ donor"], answer: 1, explain: "It accepts an H⁺ ion." },
              { q: m`The conjugate base of $\mathrm{H_2O}$ is…`, options: [m`$\mathrm{H_3O^+}$`, m`$\mathrm{OH^-}$`, m`$\mathrm{O^{2-}}$`, m`$\mathrm{H_2}$`], answer: 1, explain: "Remove one H⁺." },
              { q: "In a redox reaction, the reducing agent…", options: ["is reduced", "gains electrons", "is oxidised", "is always oxygen"], answer: 2, explain: "It gives electrons away, so it is oxidised." },
              { q: m`The oxidation number of S in $\mathrm{H_2SO_4}$ is…`, options: ["+4", "+6", "−2", "+2"], answer: 1, explain: "2(+1) + x + 4(−2) = 0." },
              { q: "An acid and a base react to form…", options: ["a salt and water", "only water", "a gas", "a metal"], answer: 0, explain: "Neutralisation." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Lithosphere
  {
    slug: "lithosphere-mining",
    topic: "g11-lithosphere",
    order: 1,
    title: "The lithosphere: mining & minerals",
    tagline: "How a tonne of rock becomes a few grams of Witwatersrand gold.",
    emoji: "⛏️",
    caps: "CAPS Gr 11 · Chemical systems: the lithosphere, minerals and ores, mining and mineral processing (gold, iron, phosphate), the extraction of gold (cyanide process), the environmental impact of mining.",
    objectives: [
      "Describe the lithosphere, minerals and ores",
      "Explain the steps in mining and extracting gold",
      "Write the equations for extracting gold and iron",
      "Discuss the environmental and social impact of mining in South Africa",
    ],
    styles: ["read-write", "visual"],
    xp: 60,
    terms: [
      { term: "Lithosphere", def: "The crust and the upper part of the mantle of the Earth – the source of all minerals." },
      { term: "Mineral", def: "A naturally occurring, inorganic solid with a definite chemical composition." },
      { term: "Ore", def: "Rock that contains enough of a mineral to be mined profitably." },
      { term: "Gangue", def: "The unwanted rock and minerals mixed with the ore." },
      { term: "Cyanide leaching", def: m`Gold is dissolved by a cyanide solution with oxygen: $\mathrm{4Au + 8CN^- + O_2 + 2H_2O \rightarrow 4[Au(CN)_2]^- + 4OH^-}$.` },
      { term: "Blast furnace", def: m`Iron is extracted from iron ore by reduction with carbon monoxide: $\mathrm{Fe_2O_3 + 3CO \rightarrow 2Fe + 3CO_2}$.` },
      { term: "Acid mine drainage", def: "Acidic, metal-rich water flowing from mines, formed when sulfide minerals react with air and water." },
    ],
    chunks: [
      {
        id: "minerals",
        title: "South Africa's treasure chest",
        minutes: 7,
        blocks: [
          { type: "callout", variant: "real-world", md: m`Johannesburg exists because of the gold found on the Witwatersrand in 1886. South Africa has the world's largest reserves of **platinum**, **manganese** and **chromium**, and major deposits of gold, iron ore, coal, diamonds and phosphates. Mining employs about 450 000 people.` },
          { type: "widget", widget: "periodic-table", props: { title: "Find SA's mined elements: Au, Pt, Mn, Cr, Fe, C" } },
        ],
      },
      {
        id: "gold",
        title: "Extracting gold",
        minutes: 9,
        blocks: [
          {
            type: "sequence",
            id: "gold-steps",
            title: "From rock to gold bar",
            steps: ["Mine the gold-bearing rock (reef) deep underground", "Crush and grind the ore into a fine powder", "Dissolve the gold with cyanide solution and air (leaching)", "Recover the gold from the solution with zinc or activated carbon", "Smelt the gold and pour it into bars"],
            explain: "Witwatersrand ore has only about 5 g of gold per tonne of rock – so a huge amount of rock must be processed for a small amount of gold.",
          },
          { type: "text", md: m`**Leaching:** $$\mathrm{4Au(s) + 8CN^-(aq) + O_2(g) + 2H_2O(\ell) \rightarrow 4[Au(CN)_2]^-(aq) + 4OH^-(aq)}$$ Gold is **oxidised** (it loses electrons) and oxygen is reduced. **Recovery with zinc:** $$\mathrm{Zn + 2[Au(CN)_2]^- \rightarrow [Zn(CN)_4]^{2-} + 2Au}$$ Zinc is a stronger reducing agent, so it reduces the gold back to the metal.` },
          {
            type: "practice",
            id: "ore-practice",
            problems: [
              { q: "An ore contains 6 g of gold per tonne. How many grams of gold are in 500 tonnes of ore?", answer: "3000", unit: "g", solution: m`$$6 \times 500 = 3\,000\ \text{g} = 3\ \text{kg}$$` },
              { q: m`In $\mathrm{Fe_2O_3 + 3CO \rightarrow 2Fe + 3CO_2}$, what mass of iron (in g) is made from 1 mol of $\mathrm{Fe_2O_3}$?`, answer: "112", unit: "g", solution: m`1 mol $\mathrm{Fe_2O_3}$ gives 2 mol Fe: $m = (2)(56) = 112\ \text{g}$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["ore-grade"], title: "Ore grade drill" } },
        ],
      },
      {
        id: "impact",
        title: "Impact & quick check",
        minutes: 5,
        blocks: [
          { type: "text", md: m`Mining brings jobs and foreign income, but also: **acid mine drainage** polluting rivers, mine **dumps** blowing dust into nearby communities, **cyanide** spills, land **subsidence**, huge **energy** use, and health problems such as silicosis for miners. Mines must now rehabilitate the land when they close.` },
          { type: "keypoints", points: ["An ore has enough mineral to mine profitably.", "Gold: crush, leach with cyanide, recover with zinc or carbon, smelt.", "Iron: reduced by CO in a blast furnace.", "Mining has big environmental and social costs."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "litho-quiz",
            questions: [
              { q: "In cyanide leaching, gold is…", options: ["reduced", "oxidised", "neutralised", "precipitated"], answer: 1, explain: "Au (0) → Au⁺ in [Au(CN)₂]⁻: it loses electrons." },
              { q: "The unwanted rock in an ore is called…", options: ["gangue", "slag", "reef", "tailings dam"], answer: 0, explain: "Gangue is separated from the valuable mineral." },
              { q: "Zinc is used to recover gold because zinc is a…", options: ["weaker reducing agent", "stronger reducing agent", "noble metal", "catalyst"], answer: 1, explain: "Zinc gives electrons to the gold ions." },
              { q: "Acid mine drainage is caused by…", options: ["cyanide", "sulfide minerals reacting with air and water", "gold dust", "limestone"], answer: 1, explain: "Pyrite (FeS₂) oxidises to make sulfuric acid." },
              { q: "In the blast furnace, iron oxide is reduced by…", options: ["oxygen", "carbon monoxide", "nitrogen", "water"], answer: 1, explain: m`$\mathrm{Fe_2O_3 + 3CO \rightarrow 2Fe + 3CO_2}$.` },
            ],
          },
        ],
      },
    ],
  },
];
