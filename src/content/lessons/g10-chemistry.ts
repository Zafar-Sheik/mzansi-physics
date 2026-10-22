import type { Lesson } from "../types";

const m = String.raw;

export const G10_CHEMISTRY: Lesson[] = [
  // ------------------------------------------------------------------ Matter
  {
    slug: "classifying-matter",
    topic: "g10-matter",
    order: 1,
    title: "Classifying matter",
    tagline: "Mixtures, pure substances, elements and compounds – and how to name them.",
    emoji: "🧱",
    caps: "CAPS Gr 10 · Matter & materials: mixtures (homogeneous, heterogeneous), pure substances, elements and compounds, names and formulae, metals, metalloids and non-metals, electrical and thermal conductors and insulators, magnetic properties.",
    objectives: [
      "Classify matter as mixtures or pure substances, elements or compounds",
      "Tell homogeneous and heterogeneous mixtures apart",
      "Name simple compounds from their formulae",
      "Describe the properties of metals, non-metals and metalloids",
    ],
    styles: ["visual", "read-write", "kinaesthetic"],
    xp: 60,
    terms: [
      { term: "Mixture", def: "Two or more substances that are NOT chemically bonded and can be separated by physical methods." },
      { term: "Homogeneous mixture", def: "A mixture with the same composition throughout, e.g. salt water, air." },
      { term: "Heterogeneous mixture", def: "A mixture whose composition is not uniform – you can see the parts, e.g. sand and water." },
      { term: "Pure substance", def: "Matter with a fixed composition and definite properties (sharp melting and boiling points) – an element or a compound." },
      { term: "Element", def: "A substance that cannot be broken down into simpler substances by chemical means; made of one type of atom." },
      { term: "Compound", def: "A substance of two or more different elements chemically bonded in a fixed ratio." },
      { term: "Metalloid", def: "An element with properties of both metals and non-metals, e.g. silicon – often a semiconductor." },
      { term: "Conductor / insulator", def: "A conductor lets heat or electric charge pass through easily (metals); an insulator does not (plastic, wood)." },
    ],
    chunks: [
      {
        id: "tree",
        title: "The classification tree",
        minutes: 8,
        blocks: [
          { type: "callout", variant: "real-world", md: m`Look in your kitchen: **tap water** (a mixture), **table salt** (a compound, NaCl), **aluminium foil** (an element, Al), **Rooibos tea** (a homogeneous mixture), **a bowl of sugar and rice** (a heterogeneous mixture). Chemists sort all matter in exactly the same way.` },
          {
            type: "table",
            headers: ["Matter", "Pure substance", "Mixture"],
            rows: [
              ["What it is", "one substance, fixed composition", "two or more substances, not bonded, any ratio"],
              ["Types", "elements (Fe, O₂) and compounds (H₂O, CO₂)", "homogeneous (uniform) and heterogeneous (not uniform)"],
              ["Separate by", "chemical methods only (compounds)", "physical methods: filtering, evaporating, distilling, magnets"],
              ["Melting/boiling point", "sharp and fixed", "over a range"],
            ],
          },
          {
            type: "widget",
            widget: "sorter",
            props: {
              id: "classify-matter", title: "Classify it!", buckets: ["Element", "Compound", "Homogeneous mixture", "Heterogeneous mixture"], colour: "var(--t-matter)",
              items: [
                { text: "Copper wire", bucket: "Element" }, { text: "Oxygen gas", bucket: "Element" }, { text: "Water (H₂O)", bucket: "Compound" },
                { text: "Carbon dioxide", bucket: "Compound" }, { text: "Table salt", bucket: "Compound" }, { text: "Air", bucket: "Homogeneous mixture" },
                { text: "Salt water", bucket: "Homogeneous mixture" }, { text: "Brass (alloy)", bucket: "Homogeneous mixture" }, { text: "Sand in water", bucket: "Heterogeneous mixture" },
                { text: "Muesli", bucket: "Heterogeneous mixture" }, { text: "Oil and vinegar", bucket: "Heterogeneous mixture" }, { text: "Gold", bucket: "Element" },
              ],
            },
          },
        ],
      },
      {
        id: "names",
        title: "Names and formulae",
        minutes: 8,
        blocks: [
          { type: "text", md: m`A **chemical formula** shows which elements are in a compound and in what ratio: $\mathrm{H_2O}$ has 2 H atoms for every 1 O atom. Naming rules for simple compounds:` },
          {
            type: "table",
            headers: ["Rule", "Example"],
            rows: [
              ["Metal first, non-metal second, ending in -ide", "NaCl = sodium chlor**ide**, MgO = magnesium ox**ide**"],
              ["Prefixes for two non-metals: mono-, di-, tri-, tetra-", "CO = carbon **mon**oxide, CO₂ = carbon **di**oxide, SO₃ = sulfur **tri**oxide"],
              ["-ate / -ite = polyatomic ions with oxygen", "CaCO₃ = calcium carbon**ate**, Na₂SO₃ = sodium sulf**ite**"],
              ["Roman numeral for the charge of a transition metal", "FeCl₃ = iron(**III**) chloride"],
            ],
          },
          {
            type: "match",
            id: "names-match",
            title: "Match the formula to the name",
            pairs: [
              { left: m`$\mathrm{NaCl}$`, right: "sodium chloride" },
              { left: m`$\mathrm{CO_2}$`, right: "carbon dioxide" },
              { left: m`$\mathrm{CaCO_3}$`, right: "calcium carbonate" },
              { left: m`$\mathrm{H_2SO_4}$`, right: "sulfuric acid" },
              { left: m`$\mathrm{NH_3}$`, right: "ammonia" },
              { left: m`$\mathrm{KMnO_4}$`, right: "potassium permanganate" },
            ],
          },
        ],
      },
      {
        id: "materials",
        title: "Metals, non-metals & metalloids",
        minutes: 7,
        blocks: [
          {
            type: "table",
            headers: ["Property", "Metals", "Non-metals", "Metalloids"],
            rows: [
              ["Lustre", "shiny", "dull", "can be shiny"],
              ["Conduct electricity & heat", "well", "poorly (except graphite)", "semiconductors"],
              ["Malleable & ductile", "yes", "brittle solids", "brittle"],
              ["Examples", "Cu, Fe, Al, Au", "C, S, O, Cl", "Si, Ge, B"],
            ],
          },
          { type: "callout", variant: "real-world", md: m`Copper is used for electrical wiring because it is an excellent **conductor** and **ductile** (it can be drawn into wires). The handles of pots are plastic or wood because they are **thermal insulators**. Silicon – a metalloid – is the heart of every cellphone chip.` },
          { type: "keypoints", points: ["Pure substances: elements and compounds.", "Mixtures can be separated physically; compounds can't.", "Metal first, non-metal -ide; prefixes for two non-metals.", "Metals conduct; non-metals insulate; metalloids are semiconductors."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "matter-quiz",
            questions: [
              { q: "Which is a compound?", options: ["Oxygen", "Air", "Water", "Brass"], answer: 2, explain: "Water is H and O chemically bonded in a fixed 2 : 1 ratio." },
              { q: "Salt dissolved in water is a…", options: ["heterogeneous mixture", "homogeneous mixture", "compound", "element"], answer: 1, explain: "The salt is spread evenly – same composition throughout." },
              { q: m`The name of $\mathrm{MgCl_2}$ is…`, options: ["magnesium dichloride", "magnesium chloride", "magnesium chlorate", "manganese chloride"], answer: 1, explain: "Metal + non-metal: no prefixes, ending -ide." },
              { q: "Silicon is classified as a…", options: ["metal", "non-metal", "metalloid", "noble gas"], answer: 2, explain: "It has properties of both and is a semiconductor." },
              { q: "Which property shows that a substance is pure?", options: ["It is colourless", "It has a sharp melting point", "It dissolves in water", "It conducts electricity"], answer: 1, explain: "Pure substances melt and boil at fixed temperatures." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ States & KMT
  {
    slug: "states-of-matter",
    topic: "g10-states",
    order: 1,
    title: "States of matter & the kinetic molecular theory",
    tagline: "Everything is made of tiny particles that never stop moving.",
    emoji: "🧊",
    caps: "CAPS Gr 10 · Matter & materials: three states of matter, the kinetic molecular theory, melting, freezing, boiling, condensation, sublimation; heating and cooling curves.",
    objectives: [
      "Describe solids, liquids and gases using the kinetic molecular theory",
      "Name the phase changes",
      "Read heating and cooling curves and explain the flat parts",
    ],
    styles: ["visual", "kinaesthetic"],
    xp: 60,
    terms: [
      { term: "Kinetic molecular theory", def: "All matter is made of particles that are in constant motion; there are spaces between them and forces of attraction between them; temperature is a measure of their average kinetic energy." },
      { term: "Melting point", def: "The temperature at which a solid changes into a liquid (and a liquid freezes into a solid)." },
      { term: "Boiling point", def: "The temperature at which a liquid changes into a gas throughout the liquid (at a given pressure)." },
      { term: "Evaporation", def: "A liquid changing into a gas at its surface, below its boiling point." },
      { term: "Condensation", def: "A gas changing into a liquid." },
      { term: "Sublimation", def: "A solid changing directly into a gas without becoming a liquid, e.g. dry ice, iodine." },
      { term: "Heating curve", def: "A graph of temperature against time (or heat added) as a substance is heated; the flat parts are phase changes." },
    ],
    chunks: [
      {
        id: "kmt",
        title: "Particles in motion",
        minutes: 9,
        blocks: [
          { type: "text", md: m`The **kinetic molecular theory** says: (1) all matter is made of tiny particles; (2) the particles are always moving; (3) there are spaces between them; (4) there are attractive forces between them; (5) the hotter the substance, the faster the particles move on average.` },
          { type: "widget", widget: "particle-box" },
          {
            type: "table",
            headers: ["", "Solid", "Liquid", "Gas"],
            rows: [
              ["Arrangement", "packed, regular pattern", "close, irregular", "far apart, random"],
              ["Movement", "vibrate in place", "slide past each other", "move fast in all directions"],
              ["Forces between particles", "strong", "weaker", "very weak"],
              ["Shape & volume", "fixed shape, fixed volume", "takes container's shape, fixed volume", "fills the container"],
            ],
          },
        ],
      },
      {
        id: "changes",
        title: "Changing state",
        minutes: 8,
        blocks: [
          {
            type: "match",
            id: "phase-match",
            title: "Name the phase change",
            pairs: [
              { left: "solid → liquid", right: "melting" },
              { left: "liquid → solid", right: "freezing" },
              { left: "liquid → gas", right: "boiling / evaporation" },
              { left: "gas → liquid", right: "condensation" },
              { left: "solid → gas", right: "sublimation" },
            ],
          },
          { type: "callout", variant: "key", md: m`On a **heating curve** the temperature stays **constant** while a substance melts or boils. The energy is being used to **overcome the forces between the particles**, not to make them move faster.` },
          { type: "callout", variant: "real-world", md: m`Dew on the grass on a cold Karoo morning is **condensation**: water vapour in the air touches the cold grass and turns to liquid. A wet T-shirt drying on the line is **evaporation** – it happens below 100 °C, only at the surface.` },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 5,
        blocks: [
          { type: "keypoints", points: ["Particles are always moving; temperature = average kinetic energy.", "Solids vibrate, liquids slide, gases fly.", "Temperature is constant during melting and boiling.", "Sublimation: solid straight to gas."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "states-quiz",
            questions: [
              { q: "In which state are the forces between particles strongest?", options: ["Solid", "Liquid", "Gas", "They are all equal"], answer: 0, explain: "That's why a solid keeps its shape." },
              { q: "While ice melts at 0 °C, its temperature…", options: ["rises", "falls", "stays constant", "jumps to 100 °C"], answer: 2, explain: "The energy breaks the forces between particles." },
              { q: "Moth balls slowly disappear in a cupboard. This is…", options: ["melting", "condensation", "sublimation", "freezing"], answer: 2, explain: "They change straight from solid to gas." },
              { q: "Gases can be compressed because…", options: ["the particles are tiny", "there are large spaces between the particles", "the particles don't move", "the forces are strong"], answer: 1, explain: "The particles can be pushed closer together." },
              { q: "Temperature is a measure of the particles'…", options: ["mass", "average kinetic energy", "size", "potential energy"], answer: 1, explain: "Faster particles = higher temperature." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Atom
  {
    slug: "the-atom",
    topic: "g10-atom",
    order: 1,
    title: "The atom: structure, isotopes & electrons",
    tagline: "From Democritus to Bohr – and how electrons fill up their energy levels.",
    emoji: "⚛️",
    caps: "CAPS Gr 10 · Matter & materials: models of the atom, atomic mass and diameter, structure of the atom (protons, neutrons, electrons), isotopes, relative atomic mass, electron configuration.",
    objectives: [
      "Describe how the model of the atom developed",
      "Find the number of protons, neutrons and electrons from the symbol",
      "Explain isotopes and calculate relative atomic mass",
      "Write electron configurations for the first 20 elements",
    ],
    styles: ["visual", "kinaesthetic", "read-write"],
    xp: 80,
    terms: [
      { term: "Atomic number (Z)", def: "The number of protons in the nucleus of an atom – it identifies the element." },
      { term: "Mass number (A)", def: "The number of protons plus neutrons in the nucleus." },
      { term: "Isotopes", def: "Atoms of the same element with the same number of protons but different numbers of neutrons." },
      { term: "Relative atomic mass", def: "The weighted average mass of the isotopes of an element, compared with 1/12 of the mass of carbon-12." },
      { term: "Ion", def: "A charged particle formed when an atom loses (cation, +) or gains (anion, −) electrons." },
      { term: "Aufbau principle", def: "Electrons fill the lowest energy orbitals first." },
      { term: "Pauli exclusion principle", def: "An orbital can hold at most two electrons, with opposite spins." },
      { term: "Hund's rule", def: "Electrons occupy orbitals of the same energy singly (one in each) before pairing up." },
      { term: "Valence electrons", def: "The electrons in the outermost energy level – they take part in bonding." },
    ],
    chunks: [
      {
        id: "models",
        title: "How we discovered the atom",
        minutes: 7,
        blocks: [
          {
            type: "sequence",
            id: "atom-models",
            title: "Put the models of the atom in order",
            steps: ["Democritus: matter is made of tiny indivisible 'atomos'", "Dalton: atoms are solid spheres; each element has its own atoms", "Thomson: the 'plum pudding' – electrons in a positive ball", "Rutherford: a tiny, dense, positive nucleus with electrons around it (gold foil)", "Bohr: electrons in fixed energy levels (shells)", "Today: electrons in orbitals – clouds of probability"],
            explain: "Each new experiment showed the old model wasn't quite right. Rutherford's gold foil experiment showed most of the atom is empty space: most alpha particles went straight through, but a few bounced back off the nucleus.",
          },
          { type: "callout", variant: "real-world", md: m`If an atom were the size of the Cape Town Stadium, the nucleus would be a **marble** on the centre spot – yet it holds almost all the mass. The rest is empty space with electrons whizzing around.` },
        ],
      },
      {
        id: "structure",
        title: "Protons, neutrons and electrons",
        minutes: 9,
        blocks: [
          {
            type: "table",
            headers: ["Particle", "Charge", "Relative mass", "Where"],
            rows: [["proton", "+1", "1", "nucleus"], ["neutron", "0", "1", "nucleus"], ["electron", "−1", "≈ 1/1 840", "around the nucleus"]],
          },
          { type: "text", md: m`The symbol ${"$"}{}^{A}_{Z}\mathrm{X}$ tells you everything: protons $= Z$, neutrons $= A - Z$, electrons $= Z$ in a neutral atom. For ${"$"}{}^{23}_{11}\mathrm{Na}$: 11 protons, 12 neutrons, 11 electrons. The ion $\mathrm{Na^+}$ has **lost** one electron: 10 electrons.` },
          { type: "widget", widget: "atom-builder" },
          {
            type: "worked",
            title: "Relative atomic mass of chlorine",
            problem: m`Chlorine is 75 % chlorine-35 and 25 % chlorine-37. Calculate its relative atomic mass.`,
            steps: [
              { md: m`$A_r = (0{,}75)(35) + (0{,}25)(37)$`, why: "A weighted average: each isotope counts in proportion to how common it is." },
              { md: m`$A_r = 26{,}25 + 9{,}25 = 35{,}5$`, why: "That's the 35,5 printed on the periodic table." },
            ],
          },
          {
            type: "practice",
            id: "atom-practice",
            problems: [
              { q: m`How many neutrons are in ${"$"}{}^{56}_{26}\mathrm{Fe}$?`, answer: "30", solution: m`$N = A - Z = 56 - 26 = 30$` },
              { q: m`How many electrons are in the $\mathrm{O^{2-}}$ ion (oxygen has Z = 8)?`, answer: "10", solution: m`It has gained 2 electrons: $8 + 2 = 10$.` },
              { q: m`Copper is 69 % Cu-63 and 31 % Cu-65. Calculate its relative atomic mass.`, answer: "63.62", rtol: 0.002, solution: m`$$A_r = (0{,}69)(63) + (0{,}31)(65) = 63{,}62$$` },
            ],
          },
        ],
      },
      {
        id: "electrons",
        title: "Electron configuration",
        minutes: 9,
        blocks: [
          { type: "text", md: m`Electrons sit in **energy levels** (1, 2, 3…), split into **sub-levels** s, p, d and **orbitals** (each holding 2 electrons). Fill them in order of energy: $1s\ 2s\ 2p\ 3s\ 3p\ 4s\ 3d\dots$` },
          { type: "table", headers: ["Sub-level", "Orbitals", "Max electrons"], rows: [["s", "1", "2"], ["p", "3", "6"], ["d", "5", "10"]] },
          {
            type: "worked",
            title: "Sulfur (Z = 16)",
            problem: m`Write the electron configuration of sulfur and draw its orbital box diagram.`,
            steps: [
              { md: m`16 electrons: $1s^2\ 2s^2\ 2p^6\ 3s^2\ 3p^4$`, why: "2 + 2 + 6 + 2 + 4 = 16." },
              { md: m`In the 3p boxes: ↑↓ ↑ ↑`, why: "Hund's rule: one electron in each p box first, then the 4th one pairs up." },
              { md: m`Valence electrons: $3s^2\ 3p^4$ → 6, so sulfur is in **group 16**.` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["atom-count", "electron-config"], title: "Atoms & electrons drill" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 5,
        blocks: [
          { type: "keypoints", points: ["Z = protons; A = protons + neutrons.", "Isotopes: same Z, different numbers of neutrons.", "Aufbau, Pauli and Hund decide how electrons fill orbitals.", "Valence electrons decide the group (main groups)."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "atom-quiz",
            questions: [
              { q: "Isotopes of an element have different numbers of…", options: ["protons", "electrons", "neutrons", "orbitals"], answer: 2, explain: "Same protons (same element), different neutrons." },
              { q: "Rutherford's gold foil experiment showed that…", options: ["atoms are solid", "the atom has a small dense positive nucleus", "electrons are in shells", "atoms are indivisible"], answer: 1, explain: "A few alpha particles bounced back off something small, dense and positive." },
              { q: m`The electron configuration of Na (Z = 11) is…`, options: [m`$1s^2\ 2s^2\ 2p^7$`, m`$1s^2\ 2s^2\ 2p^6\ 3s^1$`, m`$1s^2\ 2s^2\ 2p^6\ 3p^1$`, m`$1s^2\ 2s^8\ 3s^1$`], answer: 1, explain: "2 + 2 + 6 + 1 = 11." },
              { q: "An orbital can hold at most…", options: ["1 electron", "2 electrons", "6 electrons", "8 electrons"], answer: 1, explain: "Pauli: two electrons with opposite spins." },
              { q: m`${"$"}{}^{40}_{20}\mathrm{Ca^{2+}}$ has how many electrons?`, options: ["20", "22", "18", "40"], answer: 2, explain: "It lost 2 electrons: 20 − 2 = 18." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Periodic table
  {
    slug: "periodic-table",
    topic: "g10-periodic",
    order: 1,
    title: "The periodic table & its trends",
    tagline: "Mendeleev's map of the elements – and the patterns hidden in it.",
    emoji: "🗂️",
    caps: "CAPS Gr 10 · Matter & materials: the position of elements in the periodic table related to electron configuration; periodicity of atomic radius, first ionisation energy, electron affinity and electronegativity; chemical properties of groups 1, 2, 17 and 18.",
    objectives: [
      "Link an element's group and period to its electron configuration",
      "Describe trends in atomic radius, ionisation energy and electronegativity",
      "Compare the reactivity of the alkali metals, halogens and noble gases",
    ],
    styles: ["visual", "kinaesthetic"],
    xp: 70,
    terms: [
      { term: "Group", def: "A vertical column in the periodic table; elements in a group have the same number of valence electrons and similar chemical properties." },
      { term: "Period", def: "A horizontal row; the period number is the number of occupied energy levels." },
      { term: "Atomic radius", def: "The size of an atom; it decreases across a period and increases down a group." },
      { term: "First ionisation energy", def: "The energy needed per mole to remove the first electron from an atom in the gaseous phase." },
      { term: "Electron affinity", def: "The energy released when an electron is added to an atom in the gaseous phase." },
      { term: "Electronegativity", def: "A measure of the tendency of an atom in a molecule to attract bonding electrons." },
      { term: "Alkali metals", def: "Group 1 – very reactive metals with 1 valence electron; reactivity increases down the group." },
      { term: "Halogens", def: "Group 17 – reactive non-metals with 7 valence electrons; reactivity decreases down the group." },
      { term: "Noble gases", def: "Group 18 – unreactive because their outer energy level is full." },
    ],
    chunks: [
      {
        id: "explore",
        title: "Explore the table",
        minutes: 8,
        blocks: [
          { type: "text", md: m`Elements are arranged in order of **atomic number**. Elements in the same **group** (column) have the same number of **valence electrons**, so they behave alike. The **period** (row) tells you how many energy levels are occupied.` },
          { type: "widget", widget: "periodic-table" },
        ],
      },
      {
        id: "trends",
        title: "The trends – and why",
        minutes: 9,
        blocks: [
          {
            type: "table",
            headers: ["Property", "Across a period →", "Down a group ↓", "Why"],
            rows: [
              ["Atomic radius", "decreases", "increases", "across: more protons pull the same energy level closer; down: more energy levels"],
              ["First ionisation energy", "increases", "decreases", "electrons are held more tightly across; further from the nucleus down"],
              ["Electronegativity", "increases", "decreases", "same reason: stronger pull on bonding electrons across, weaker down"],
            ],
          },
          { type: "widget", widget: "periodic-table", props: { view: "ie", title: "See ionisation energy" } },
          { type: "callout", variant: "memory", md: m`Fluorine, in the top right corner, is the **"greedy" element**: smallest of its period, highest electronegativity. Caesium and francium in the bottom left are the **"generous"** ones – they give away their one valence electron most easily.` },
        ],
      },
      {
        id: "groups",
        title: "Families with personalities",
        minutes: 7,
        blocks: [
          { type: "text", md: m`**Group 1 (alkali metals):** soft, shiny and very reactive. They react with water to form an alkaline solution and hydrogen: $\mathrm{2Na + 2H_2O \rightarrow 2NaOH + H_2}$. Reactivity **increases** down the group (the valence electron is further away and easier to lose).

**Group 17 (halogens):** reactive non-metals that exist as diatomic molecules ($\mathrm{F_2, Cl_2, Br_2, I_2}$). Reactivity **decreases** down the group (it is harder for a bigger atom to attract an extra electron).

**Group 18 (noble gases):** full outer energy level → very unreactive. Used in lights (neon) and welding (argon).` },
          { type: "callout", variant: "safety", md: m`Sodium and potassium are stored under oil because they react violently with water and air. Chlorine gas is toxic – that is why pool chlorine must never be mixed with acids.` },
          { type: "keypoints", points: ["Group = valence electrons (main groups); period = energy levels.", "Atomic radius ↓ across, ↑ down.", "Ionisation energy and electronegativity ↑ across, ↓ down.", "Group 1 more reactive down; group 17 less reactive down; group 18 unreactive."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "periodic-quiz",
            questions: [
              { q: "Which element has the largest atomic radius?", options: ["Li", "Na", "K", "Cs"], answer: 3, explain: "Atomic radius increases down group 1." },
              { q: "Which element has the highest electronegativity?", options: ["O", "Cl", "F", "N"], answer: 2, explain: "Fluorine (4,0) – top right of the table." },
              { q: "Elements in the same group have the same…", options: ["number of protons", "number of valence electrons", "atomic radius", "mass"], answer: 1, explain: "That's why they react in similar ways." },
              { q: "Down group 17, the halogens become…", options: ["more reactive", "less reactive", "metals", "noble gases"], answer: 1, explain: "Bigger atoms attract an extra electron less strongly." },
              { q: "First ionisation energy across a period generally…", options: ["increases", "decreases", "stays the same", "becomes zero"], answer: 0, explain: "More protons hold the electrons more tightly." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Bonding
  {
    slug: "chemical-bonding",
    topic: "g10-bonding",
    order: 1,
    title: "Chemical bonding",
    tagline: "Sharing, swapping and seas of electrons – how atoms stick together.",
    emoji: "🔗",
    caps: "CAPS Gr 10 · Matter & materials: covalent, ionic and metallic bonding; Lewis diagrams; valency and writing chemical formulae; properties of ionic, covalent and metallic substances.",
    objectives: [
      "Explain why atoms bond (a full outer energy level)",
      "Describe covalent, ionic and metallic bonds",
      "Draw Lewis diagrams for simple molecules and ions",
      "Write formulae from ions and valencies",
    ],
    styles: ["visual", "read-write"],
    xp: 70,
    terms: [
      { term: "Covalent bond", def: "The sharing of at least one pair of electrons between two non-metal atoms." },
      { term: "Ionic bond", def: "The transfer of electrons from a metal to a non-metal, forming positive and negative ions that attract each other." },
      { term: "Metallic bond", def: "The attraction between positive metal ions and a 'sea' of delocalised valence electrons." },
      { term: "Lewis diagram", def: "A diagram showing the valence electrons of atoms as dots or crosses, and the bonding and lone pairs." },
      { term: "Valency", def: "The number of bonds an atom can form, or the number of electrons it gains, loses or shares." },
      { term: "Octet rule", def: "Atoms tend to gain, lose or share electrons until they have 8 electrons in their outer energy level." },
      { term: "Cation / anion", def: "A positive ion (lost electrons) / a negative ion (gained electrons)." },
    ],
    chunks: [
      {
        id: "types",
        title: "Three ways to bond",
        minutes: 9,
        blocks: [
          { type: "text", md: m`Atoms bond to reach a **stable, full outer energy level** like a noble gas (usually 8 electrons – the **octet rule**).` },
          {
            type: "table",
            headers: ["", "Covalent", "Ionic", "Metallic"],
            rows: [
              ["Between", "non-metal + non-metal", "metal + non-metal", "metal + metal"],
              ["Electrons", "shared in pairs", "transferred", "delocalised 'sea'"],
              ["Example", "H₂O, CH₄, O₂", "NaCl, MgO", "Cu, Fe, Al"],
              ["Properties", "low melting points (molecules), don't conduct", "high melting points, conduct when molten or dissolved", "conduct, malleable, shiny"],
            ],
          },
          {
            type: "widget",
            widget: "sorter",
            props: {
              id: "bond-types", title: "What type of bonding?", buckets: ["Covalent", "Ionic", "Metallic"], colour: "var(--t-matter)",
              items: [
                { text: "H₂O", bucket: "Covalent" }, { text: "CO₂", bucket: "Covalent" }, { text: "Cl₂", bucket: "Covalent" }, { text: "NaCl", bucket: "Ionic" },
                { text: "MgO", bucket: "Ionic" }, { text: "CaF₂", bucket: "Ionic" }, { text: "Copper", bucket: "Metallic" }, { text: "Zinc", bucket: "Metallic" }, { text: "CH₄", bucket: "Covalent" },
              ],
            },
          },
        ],
      },
      {
        id: "lewis",
        title: "Lewis diagrams",
        minutes: 8,
        blocks: [
          { type: "text", md: m`In a Lewis diagram each atom shows only its **valence electrons**. Shared pairs between atoms are **bonds**; pairs that belong to one atom only are **lone pairs**.

- $\mathrm{H_2}$: H:H – one shared pair (a single bond).
- $\mathrm{H_2O}$: O shares one pair with each H and keeps **2 lone pairs**.
- $\mathrm{NaCl}$: Na gives its one electron to Cl → $\mathrm{[Na]^+\ [\,:\!\ddot{Cl}\!:\,]^-}$ (ions in brackets with charges).` },
          {
            type: "worked",
            title: "Lewis diagram of ammonia",
            problem: m`Draw the Lewis diagram for $\mathrm{NH_3}$.`,
            steps: [
              { md: "N is in group 15: 5 valence electrons. Each H has 1.", why: "Count valence electrons first." },
              { md: "N shares one pair with each of the three H atoms (3 bonding pairs).", why: "Each H only needs 2 electrons to be full." },
              { md: "N has 2 electrons left over: 1 lone pair. N now has 8 electrons around it ✔" },
            ],
          },
          { type: "widget", widget: "molecule-shapes", props: { title: "See the molecules in 3D" } },
        ],
      },
      {
        id: "formulae",
        title: "Writing formulae from ions",
        minutes: 8,
        blocks: [
          { type: "text", md: m`An ionic compound has **no overall charge**, so the total positive charge must equal the total negative charge. A quick method: **swap the charges** down as subscripts, then simplify.

$\mathrm{Al^{3+}}$ and $\mathrm{O^{2-}}$ → $\mathrm{Al_2O_3}$ (2 × 3 = 6+ and 3 × 2 = 6−). Put **brackets** round a polyatomic ion when you need more than one: $\mathrm{Ca(OH)_2}$.` },
          {
            type: "practice",
            id: "formula-practice",
            problems: [
              { q: "Write the formula of magnesium chloride (Mg²⁺ and Cl⁻).", answer: "MgCl2", kind: "formula", solution: m`One $\mathrm{Mg^{2+}}$ needs two $\mathrm{Cl^-}$: $\mathrm{MgCl_2}$.` },
              { q: "Write the formula of aluminium oxide (Al³⁺ and O²⁻).", answer: "Al2O3", kind: "formula", solution: m`Swap the charges: $\mathrm{Al_2O_3}$ (6+ and 6−).` },
              { q: "Write the formula of calcium hydroxide (Ca²⁺ and OH⁻).", answer: "Ca(OH)2", kind: "formula", hint: "OH⁻ is a polyatomic ion – use brackets.", solution: m`$\mathrm{Ca(OH)_2}$` },
              { q: "Write the formula of ammonium sulfate (NH₄⁺ and SO₄²⁻).", answer: "(NH4)2SO4", kind: "formula", solution: m`Two $\mathrm{NH_4^+}$ for one $\mathrm{SO_4^{2-}}$: $\mathrm{(NH_4)_2SO_4}$.` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["ionic-formula"], title: "Formula drill" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["Covalent: share; ionic: transfer; metallic: sea of electrons.", "Lewis diagrams show valence electrons, bonds and lone pairs.", "Ionic formulae balance the charges.", "Brackets around polyatomic ions."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "bonding-quiz",
            questions: [
              { q: "Which substance has ionic bonding?", options: ["CH₄", "KCl", "O₂", "Cu"], answer: 1, explain: "Potassium (metal) + chlorine (non-metal)." },
              { q: "Metals conduct electricity because they have…", options: ["ions that move", "delocalised electrons", "shared electron pairs", "lone pairs"], answer: 1, explain: "The 'sea' of free electrons carries the charge." },
              { q: "How many lone pairs does the O atom in water have?", options: ["0", "1", "2", "3"], answer: 2, explain: "6 valence electrons: 2 used in bonds, 4 left = 2 lone pairs." },
              { q: "The formula of sodium carbonate is…", options: ["NaCO₃", "Na₂CO₃", "Na(CO₃)₂", "NaC"], answer: 1, explain: "2 Na⁺ balance one CO₃²⁻." },
              { q: "A covalent bond forms between…", options: ["two metals", "a metal and a non-metal", "two non-metals", "two ions"], answer: 2, explain: "Non-metals share electrons." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Physical & chemical change
  {
    slug: "physical-chemical-change",
    topic: "g10-change",
    order: 1,
    title: "Physical & chemical change and balancing equations",
    tagline: "Melting ice vs burning wood – and the law that mass is never lost.",
    emoji: "🔥",
    caps: "CAPS Gr 10 · Chemical change: physical and chemical change, conservation of atoms and mass, law of constant composition, balancing chemical equations, state symbols.",
    objectives: [
      "Tell physical and chemical changes apart",
      "State the law of conservation of mass and the law of constant composition",
      "Balance chemical equations and add state symbols",
    ],
    styles: ["kinaesthetic", "visual"],
    xp: 70,
    terms: [
      { term: "Physical change", def: "A change in which no new substances form; it is usually easy to reverse, e.g. melting, dissolving." },
      { term: "Chemical change", def: "A change in which new substances with new properties form (bonds break and new bonds form), e.g. burning, rusting." },
      { term: "Law of conservation of mass", def: "The total mass of the reactants equals the total mass of the products in a chemical reaction." },
      { term: "Law of constant composition", def: "A pure compound always contains the same elements in the same proportion by mass." },
      { term: "Balanced equation", def: "A chemical equation with the same number of each kind of atom on both sides." },
      { term: "Coefficient", def: "The number in front of a formula in a balanced equation – it tells you how many molecules or moles." },
      { term: "State symbols", def: "(s) solid, (ℓ) liquid, (g) gas, (aq) aqueous – dissolved in water." },
    ],
    chunks: [
      {
        id: "changes",
        title: "Physical or chemical?",
        minutes: 7,
        blocks: [
          { type: "text", md: m`In a **physical change** the substance stays the same substance – only its form changes (ice → water). In a **chemical change** the atoms rearrange into **new substances**. Signs of a chemical change: a gas is given off, a colour change, a precipitate forms, energy (heat/light) is released or absorbed.` },
          {
            type: "widget",
            widget: "sorter",
            props: {
              id: "phys-chem", title: "Physical or chemical change?", buckets: ["Physical change", "Chemical change"], colour: "var(--t-change)",
              items: [
                { text: "Melting candle wax", bucket: "Physical change" }, { text: "Burning the wick", bucket: "Chemical change" }, { text: "Dissolving sugar", bucket: "Physical change" },
                { text: "Cooking an egg", bucket: "Chemical change" }, { text: "Bread rising (yeast)", bucket: "Chemical change" }, { text: "Breaking a glass", bucket: "Physical change" },
                { text: "Iron gate rusting", bucket: "Chemical change" }, { text: "Water evaporating", bucket: "Physical change" },
              ],
            },
          },
        ],
      },
      {
        id: "balancing",
        title: "Balancing equations",
        minutes: 10,
        blocks: [
          { type: "text", md: m`Atoms are never created or destroyed – so a chemical equation must have the **same number of each kind of atom on both sides**. You may only change the **coefficients** (numbers in front), never the small numbers inside a formula.` },
          {
            type: "worked",
            title: "Methane burns",
            problem: m`Balance: $\mathrm{CH_4 + O_2 \rightarrow CO_2 + H_2O}$`,
            steps: [
              { md: m`C: 1 on each side ✔. H: 4 on the left, 2 on the right → put **2** in front of $\mathrm{H_2O}$.` },
              { md: m`O: now 2 + 2 = 4 on the right, 2 on the left → put **2** in front of $\mathrm{O_2}$.`, why: "Leave the element that appears on its own (O₂) for last." },
              { md: m`$\mathrm{CH_4(g) + 2O_2(g) \rightarrow CO_2(g) + 2H_2O(\ell)}$ ✔` },
            ],
          },
          { type: "widget", widget: "equation-balancer" },
          {
            type: "practice",
            id: "balance-practice",
            problems: [
              { q: m`Balance (coefficients in order): $\mathrm{\square H_2 + \square O_2 \rightarrow \square H_2O}$`, answer: "2; 1; 2", kind: "list", solution: m`$\mathrm{2H_2 + O_2 \rightarrow 2H_2O}$` },
              { q: m`Balance: $\mathrm{\square Mg + \square HCl \rightarrow \square MgCl_2 + \square H_2}$`, answer: "1; 2; 1; 1", kind: "list", solution: m`$\mathrm{Mg + 2HCl \rightarrow MgCl_2 + H_2}$` },
              { q: m`Balance: $\mathrm{\square N_2 + \square H_2 \rightarrow \square NH_3}$`, answer: "1; 3; 2", kind: "list", solution: m`$\mathrm{N_2 + 3H_2 \rightarrow 2NH_3}$ (the Haber process).` },
              { q: m`Balance: $\mathrm{\square C_3H_8 + \square O_2 \rightarrow \square CO_2 + \square H_2O}$`, answer: "1; 5; 3; 4", kind: "list", hint: "C first, then H, then O last.", solution: m`$\mathrm{C_3H_8 + 5O_2 \rightarrow 3CO_2 + 4H_2O}$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["balance"], title: "Balancing drill" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["Chemical change = new substances; physical change = same substance.", "Mass is conserved in every reaction.", "Balance with coefficients only – never change a formula.", "Add state symbols: (s), (ℓ), (g), (aq)."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "change-quiz",
            questions: [
              { q: "Which is a chemical change?", options: ["Ice melting", "Salt dissolving", "Paper burning", "Water boiling"], answer: 2, explain: "Burning makes new substances (CO₂, H₂O, ash)." },
              { q: "When balancing an equation you may change…", options: ["subscripts in formulae", "coefficients in front of formulae", "the products", "the state symbols only"], answer: 1, explain: "Changing a subscript would change the substance." },
              { q: "The state symbol (aq) means…", options: ["a gas", "dissolved in water", "a liquid", "a solid"], answer: 1, explain: "Aqueous: in water solution." },
              { q: "12 g of carbon burns completely in 32 g of oxygen. The mass of CO₂ formed is…", options: ["20 g", "32 g", "44 g", "12 g"], answer: 2, explain: "Conservation of mass: 12 + 32 = 44 g." },
              { q: m`In $\mathrm{2H_2O}$ there are how many hydrogen atoms?`, options: ["2", "3", "4", "6"], answer: 2, explain: "2 molecules × 2 H atoms = 4." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Reactions in aqueous solution
  {
    slug: "aqueous-reactions",
    topic: "g10-reactions",
    order: 1,
    title: "Reactions in aqueous solution",
    tagline: "Ions in water, precipitates and the three big reaction types.",
    emoji: "💧",
    caps: "CAPS Gr 10 · Chemical change: ions in aqueous solution, dissociation and ionisation, electrolytes and conductivity, precipitation reactions, tests for anions, ion exchange, acid-base and redox reactions.",
    objectives: [
      "Explain how ionic compounds dissolve (dissociate) in water",
      "Relate conductivity to the concentration of ions",
      "Predict precipitates and use tests for chloride, sulfate and carbonate ions",
      "Identify precipitation, gas-forming, acid-base and redox reactions",
    ],
    styles: ["visual", "read-write"],
    xp: 60,
    terms: [
      { term: "Dissociation", def: m`Ionic compounds separate into ions when they dissolve in water: $\mathrm{NaCl(s) \rightarrow Na^+(aq) + Cl^-(aq)}$.` },
      { term: "Hydration", def: "Water molecules surround the ions (the polar water molecules point their charged ends at the ions)." },
      { term: "Electrolyte", def: "A substance that forms ions in solution and therefore conducts electricity." },
      { term: "Precipitate", def: "An insoluble solid that forms when two solutions are mixed." },
      { term: "Ion exchange reaction", def: "A reaction in which the positive ions of two compounds swap partners (precipitation, gas-forming, acid-base)." },
      { term: "Acid-base reaction", def: "An acid and a base react to form a salt and (usually) water – neutralisation." },
      { term: "Redox reaction", def: "A reaction in which electrons are transferred: one substance is oxidised (loses electrons), another is reduced (gains electrons)." },
    ],
    chunks: [
      {
        id: "ions",
        title: "Ions in water",
        minutes: 8,
        blocks: [
          { type: "text", md: m`Water molecules are **polar**: the O end is slightly negative and the H ends slightly positive. When salt dissolves, water molecules pull the ions out of the crystal and surround them. The ions are now free to move – so the solution **conducts electricity**. More ions → better conductivity.` },
          { type: "callout", variant: "real-world", md: m`This is why you must never use a hairdryer in the bath: tap water contains dissolved ions and conducts electricity. Pure (distilled) water hardly conducts at all.` },
          { type: "widget", widget: "molecule-shapes", props: { title: "Water is a polar molecule" } },
        ],
      },
      {
        id: "precipitates",
        title: "Precipitates & tests for ions",
        minutes: 9,
        blocks: [
          { type: "text", md: m`Mix two clear solutions and a cloudy solid may appear: a **precipitate**. Example: $$\mathrm{AgNO_3(aq) + NaCl(aq) \rightarrow AgCl(s) + NaNO_3(aq)}$$ The white $\mathrm{AgCl}$ is insoluble, so it drops out of solution.` },
          {
            type: "table",
            headers: ["Test for", "Add", "Positive result"],
            rows: [
              ["chloride Cl⁻", "silver nitrate (AgNO₃)", "white precipitate of AgCl"],
              ["bromide Br⁻ / iodide I⁻", "silver nitrate", "cream (AgBr) / yellow (AgI) precipitate"],
              ["sulfate SO₄²⁻", "barium chloride (BaCl₂)", "white precipitate of BaSO₄ that does NOT dissolve in nitric acid"],
              ["carbonate CO₃²⁻", "an acid, then pass the gas through limewater", "bubbles; limewater turns milky (CO₂)"],
            ],
          },
          {
            type: "match",
            id: "reaction-types",
            title: "Match the reaction to its type",
            pairs: [
              { left: m`$\mathrm{AgNO_3 + NaCl \rightarrow AgCl + NaNO_3}$`, right: "precipitation" },
              { left: m`$\mathrm{HCl + NaOH \rightarrow NaCl + H_2O}$`, right: "acid-base (neutralisation)" },
              { left: m`$\mathrm{Zn + CuSO_4 \rightarrow ZnSO_4 + Cu}$`, right: "redox (electron transfer)" },
              { left: m`$\mathrm{CaCO_3 + 2HCl \rightarrow CaCl_2 + H_2O + CO_2}$`, right: "gas-forming" },
            ],
          },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["Ionic compounds dissociate into hydrated ions.", "Ions make a solution conduct – more ions, better conductivity.", "Precipitate = insoluble solid formed from two solutions.", "Three big types: ion exchange (precipitation, gas, acid-base) and redox."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "aqueous-quiz",
            questions: [
              { q: "Which solution conducts electricity best?", options: ["Distilled water", "Sugar water", "Salt water", "Alcohol"], answer: 2, explain: "Salt dissociates into ions; sugar dissolves as molecules." },
              { q: "Adding silver nitrate to a solution gives a white precipitate. The solution contains…", options: ["sulfate ions", "chloride ions", "carbonate ions", "sodium ions"], answer: 1, explain: "Ag⁺ + Cl⁻ → AgCl (white)." },
              { q: "CO₂ is identified by…", options: ["a pop with a burning splint", "relighting a glowing splint", "turning limewater milky", "bleaching litmus"], answer: 2, explain: "CO₂ forms a white CaCO₃ precipitate in limewater." },
              { q: "In a redox reaction, the substance that is oxidised…", options: ["gains electrons", "loses electrons", "gains protons", "forms a precipitate"], answer: 1, explain: "OIL RIG: Oxidation Is Loss of electrons." },
              { q: "Water dissolves ionic compounds well because water molecules are…", options: ["large", "polar", "non-polar", "charged ions"], answer: 1, explain: "Their partially charged ends attract the ions." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Mole
  {
    slug: "the-mole",
    topic: "g10-mole",
    order: 1,
    title: "The mole & quantitative chemistry",
    tagline: "Counting atoms by weighing them: n = m/M.",
    emoji: "⚖️",
    caps: "CAPS Gr 10 · Chemical change: the mole concept, molar mass, n = m/M, percentage composition, empirical and molecular formulae, water of crystallisation, concentration (c = n/V), basic stoichiometry.",
    objectives: [
      "Explain the mole and Avogadro's number",
      "Calculate molar mass and use n = m/M",
      "Calculate concentration with c = n/V",
      "Find percentage composition and empirical formulae",
    ],
    styles: ["read-write", "kinaesthetic"],
    xp: 90,
    terms: [
      { term: "Mole", def: m`The SI unit of amount of substance: one mole contains $6{,}02 \times 10^{23}$ particles – as many as there are atoms in 12 g of carbon-12.` },
      { term: "Avogadro's number", def: m`$N_A = 6{,}02 \times 10^{23}\ \text{mol}^{-1}$` },
      { term: "Molar mass (M)", def: m`The mass of one mole of a substance, in g·mol⁻¹ – add up the relative atomic masses.` },
      { term: "n = m/M", def: m`Number of moles = mass (g) ÷ molar mass (g·mol⁻¹).` },
      { term: "Concentration", def: m`The amount of solute per unit volume of solution: $c = \frac{n}{V}$ in mol·dm⁻³ (V in dm³).` },
      { term: "Empirical formula", def: "The simplest whole-number ratio of atoms in a compound (e.g. CH₂O for glucose)." },
      { term: "Molecular formula", def: "The actual number of each kind of atom in a molecule (e.g. C₆H₁₂O₆)." },
      { term: "Water of crystallisation", def: "Water molecules built into a crystal, e.g. CuSO₄·5H₂O." },
    ],
    chunks: [
      {
        id: "mole",
        title: "What is a mole?",
        minutes: 7,
        blocks: [
          { type: "callout", variant: "real-world", md: m`A baker doesn't count grains of flour – they weigh it. Chemists do the same with atoms. A **mole** is just a (very big) number, like a "dozen" means 12: $$1\ \text{mol} = 6{,}02 \times 10^{23}\ \text{particles}$$ A mole of R1 coins stacked up would reach to the Sun and back about 4 million times!` },
          { type: "text", md: m`One mole of any substance has a mass equal to its **molar mass** in grams. Carbon: $12\ \text{g·mol}^{-1}$. Water: $2(1) + 16 = 18\ \text{g·mol}^{-1}$. So 18 g of water contains $6{,}02 \times 10^{23}$ molecules.` },
          { type: "widget", widget: "mole-lab" },
        ],
      },
      {
        id: "calc",
        title: "Mole calculations",
        minutes: 10,
        blocks: [
          {
            type: "worked",
            title: "Moles in a spoon of salt",
            problem: m`A teaspoon holds $5{,}85\ \text{g}$ of NaCl. How many moles is that, and how many formula units?`,
            steps: [
              { md: m`$M(\mathrm{NaCl}) = 23 + 35{,}5 = 58{,}5\ \text{g·mol}^{-1}$` },
              { md: m`$n = \frac{m}{M} = \frac{5{,}85}{58{,}5} = 0{,}1\ \text{mol}$` },
              { md: m`$N = nN_A = (0{,}1)(6{,}02 \times 10^{23}) = 6{,}02 \times 10^{22}$ formula units` },
            ],
          },
          {
            type: "worked",
            title: "Making a solution",
            problem: m`$4\ \text{g}$ of NaOH is dissolved to make $250\ \text{cm}^3$ of solution. Calculate the concentration.`,
            steps: [
              { md: m`$M(\mathrm{NaOH}) = 23 + 16 + 1 = 40\ \text{g·mol}^{-1}$; $n = \frac{4}{40} = 0{,}1\ \text{mol}$` },
              { md: m`$V = 250\ \text{cm}^3 = 0{,}25\ \text{dm}^3$`, why: m`Divide cm³ by 1 000 to get dm³.` },
              { md: m`$c = \frac{n}{V} = \frac{0{,}1}{0{,}25} = 0{,}4\ \text{mol·dm}^{-3}$` },
            ],
          },
          {
            type: "practice",
            id: "mole-practice",
            problems: [
              { q: m`Calculate the molar mass of $\mathrm{H_2SO_4}$.`, answer: "98", unit: "g·mol⁻¹", solution: m`$2(1) + 32 + 4(16) = 98\ \text{g·mol}^{-1}$` },
              { q: m`How many moles are in $88\ \text{g}$ of $\mathrm{CO_2}$?`, answer: "2", unit: "mol", solution: m`$M = 12 + 2(16) = 44$; $n = \frac{88}{44} = 2\ \text{mol}$` },
              { q: m`Calculate the mass of $0{,}25\ \text{mol}$ of $\mathrm{CaCO_3}$.`, answer: "25", unit: "g", solution: m`$M = 40 + 12 + 3(16) = 100$; $m = nM = (0{,}25)(100) = 25\ \text{g}$` },
              { q: m`$0{,}5\ \text{mol}$ of glucose is dissolved in water to make $2\ \text{dm}^3$ of solution. Calculate the concentration.`, answer: "0.25", unit: "mol·dm⁻³", solution: m`$$c = \frac{n}{V} = \frac{0{,}5}{2} = 0{,}25\ \text{mol·dm}^{-3}$$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["moles", "concentration"], title: "Mole drill" } },
        ],
      },
      {
        id: "composition",
        title: "Percentage composition & empirical formulae",
        minutes: 9,
        blocks: [
          {
            type: "worked",
            title: "From percentages to a formula",
            problem: m`A compound is 40 % carbon, 6,7 % hydrogen and 53,3 % oxygen by mass. Find its empirical formula.`,
            steps: [
              { md: m`Assume 100 g: 40 g C, 6,7 g H, 53,3 g O.` },
              { md: m`Moles: $\frac{40}{12} = 3{,}33$; $\frac{6{,}7}{1} = 6{,}7$; $\frac{53{,}3}{16} = 3{,}33$` },
              { md: m`Divide by the smallest (3,33): C 1 : H 2 : O 1` },
              { md: m`Empirical formula: $\mathrm{CH_2O}$. (Glucose, $\mathrm{C_6H_{12}O_6}$, has this empirical formula.)` },
            ],
          },
          {
            type: "practice",
            id: "composition-practice",
            problems: [
              { q: m`Calculate the percentage by mass of oxygen in water ($\mathrm{H_2O}$).`, answer: "88.89", unit: "%", solution: m`$$\%\mathrm{O} = \frac{16}{18} \times 100 = 88{,}89\%$$` },
              { q: m`Calculate the percentage of water in $\mathrm{CuSO_4 \cdot 5H_2O}$ ($M = 249{,}5\ \text{g·mol}^{-1}$).`, answer: "36.07", unit: "%", solution: m`$$\frac{5 \times 18}{249{,}5} \times 100 = 36{,}07\%$$` },
              { q: "A compound contains 75 % C and 25 % H by mass. What is its empirical formula?", answer: "CH4", kind: "formula", solution: m`C: $\frac{75}{12} = 6{,}25$; H: $\frac{25}{1} = 25$. Ratio 1 : 4 → $\mathrm{CH_4}$.` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["percent-composition", "empirical"], title: "Composition drill" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: [m`$1\ \text{mol} = 6{,}02 \times 10^{23}$ particles.`, m`$n = \frac{m}{M}$, $N = nN_A$, $c = \frac{n}{V}$ (V in dm³).`, "Empirical formula: moles of each, divide by the smallest.", "Molar mass: add the relative atomic masses."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "mole-quiz",
            questions: [
              { q: m`The molar mass of $\mathrm{NH_3}$ is…`, options: [m`$15\ \text{g·mol}^{-1}$`, m`$17\ \text{g·mol}^{-1}$`, m`$14\ \text{g·mol}^{-1}$`, m`$18\ \text{g·mol}^{-1}$`], answer: 1, explain: "14 + 3(1) = 17." },
              { q: "One mole of oxygen gas (O₂) has a mass of…", options: ["16 g", "32 g", "8 g", "64 g"], answer: 1, explain: "2 × 16 = 32 g." },
              { q: m`$250\ \text{cm}^3$ is the same as…`, options: [m`$2{,}5\ \text{dm}^3$`, m`$0{,}25\ \text{dm}^3$`, m`$25\ \text{dm}^3$`, m`$0{,}025\ \text{dm}^3$`], answer: 1, explain: "Divide by 1 000." },
              { q: "The empirical formula of C₂H₆ is…", options: ["C₂H₆", "CH₃", "CH₂", "CH"], answer: 1, explain: "Divide by 2: CH₃." },
              { q: "Which contains the most particles?", options: ["1 mol of H₂", "1 mol of CO₂", "1 mol of NaCl", "They all contain the same number"], answer: 3, explain: "A mole always contains 6,02 × 10²³ particles." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Hydrosphere
  {
    slug: "hydrosphere",
    topic: "g10-hydrosphere",
    order: 1,
    title: "The hydrosphere",
    tagline: "South Africa is a water-scarce country – here's the chemistry of every drop.",
    emoji: "🌊",
    caps: "CAPS Gr 10 · Chemical systems: the hydrosphere and its interaction with other global systems, the water cycle, ions in water, water hardness, pH, water quality and purification, pollution.",
    objectives: [
      "Describe the hydrosphere and the water cycle",
      "Explain how water interacts with the atmosphere, lithosphere and biosphere",
      "Describe how water is tested and purified",
      "Discuss water pollution and conservation in South Africa",
    ],
    styles: ["read-write", "visual"],
    xp: 50,
    terms: [
      { term: "Hydrosphere", def: "All the water on Earth: oceans, rivers, lakes, groundwater, ice and water vapour." },
      { term: "Water cycle", def: "The continuous movement of water by evaporation, condensation, precipitation, run-off and infiltration." },
      { term: "Hard water", def: "Water containing dissolved calcium and magnesium ions; it makes little lather with soap and leaves scale in kettles." },
      { term: "Water purification", def: "Making water safe to drink: screening, coagulation/flocculation, sedimentation, filtration and disinfection (chlorination)." },
      { term: "Eutrophication", def: "Too many nutrients (e.g. from fertilisers) in water cause algae to bloom; when they die and rot, oxygen is used up and fish die." },
      { term: "Acid rain", def: "Rain with a low pH caused by sulfur and nitrogen oxides from burning fossil fuels dissolving in water." },
    ],
    chunks: [
      {
        id: "cycle",
        title: "The water cycle",
        minutes: 7,
        blocks: [
          { type: "callout", variant: "real-world", md: m`In 2018 Cape Town nearly reached **"Day Zero"** – the day the taps would run dry. South Africa gets about half the world's average rainfall. Understanding the hydrosphere is not just exam work – it's survival.` },
          {
            type: "sequence",
            id: "water-cycle",
            title: "Put the water cycle in order (starting at the sea)",
            steps: ["The Sun heats sea water and it evaporates", "Water vapour rises and cools", "It condenses into clouds", "Precipitation: rain, hail or snow falls", "Water runs off into rivers or infiltrates into groundwater", "Rivers flow back to the sea"],
            explain: "The Sun provides the energy for evaporation; gravity brings the water back down. Plants also release water vapour (transpiration).",
          },
          { type: "widget", widget: "particle-box", props: { title: "Evaporation and condensation are phase changes" } },
        ],
      },
      {
        id: "quality",
        title: "Water quality & purification",
        minutes: 8,
        blocks: [
          { type: "text", md: m`Water is called the **universal solvent** because so many substances dissolve in it. As it flows over rocks it picks up ions ($\mathrm{Ca^{2+}}$, $\mathrm{Mg^{2+}}$, $\mathrm{HCO_3^-}$). Water is tested for **pH**, **dissolved oxygen**, **conductivity** (dissolved ions), **turbidity** (cloudiness) and **bacteria** (E. coli).` },
          {
            type: "sequence",
            id: "purification",
            title: "Steps in a water treatment works",
            steps: ["Screening removes large objects", "Coagulation: chemicals make small particles clump together (flocs)", "Sedimentation: the flocs settle to the bottom", "Filtration through sand and gravel", "Disinfection with chlorine kills bacteria", "pH adjustment, then water is stored and piped to homes"],
            explain: "Rand Water and other water boards treat billions of litres a day this way. Boiling water for one minute also kills bacteria at home.",
          },
          { type: "callout", variant: "safety", md: m`If you don't know whether water is safe, **boil it** or add 1 teaspoon of household bleach to 25 litres and leave it for 2 hours before drinking.` },
        ],
      },
      {
        id: "check",
        title: "Pollution & quick check",
        minutes: 5,
        blocks: [
          { type: "text", md: m`Threats to SA's water: **acid mine drainage** from old gold mines on the Witwatersrand, **sewage** from failing treatment works, **fertiliser run-off** causing eutrophication (e.g. Hartbeespoort Dam's water hyacinth), and **plastic waste**. You can help: fix leaks, take short showers, never pour oil or chemicals down the drain.` },
          { type: "keypoints", points: ["The hydrosphere is all of Earth's water.", "The water cycle is driven by the Sun.", "Purification: screen, coagulate, settle, filter, disinfect.", "Hard water contains Ca²⁺ and Mg²⁺ ions."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "hydrosphere-quiz",
            questions: [
              { q: "Water vapour changing into clouds is…", options: ["evaporation", "condensation", "precipitation", "infiltration"], answer: 1, explain: "Gas → liquid droplets." },
              { q: "Chlorine is added to drinking water to…", options: ["remove hardness", "kill bacteria", "change the colour", "add minerals"], answer: 1, explain: "It disinfects the water." },
              { q: "Hard water contains dissolved…", options: ["Na⁺ and K⁺", "Ca²⁺ and Mg²⁺", "Cl⁻ and Br⁻", "O₂ and N₂"], answer: 1, explain: "Calcium and magnesium ions." },
              { q: "Fertiliser run-off can cause…", options: ["acid rain", "eutrophication", "hard water", "sublimation"], answer: 1, explain: "Excess nutrients → algal blooms → oxygen loss." },
              { q: "Acid mine drainage mostly comes from…", options: ["farms", "old mines", "the ocean", "cars"], answer: 1, explain: "Sulfide minerals in old mines react with water and air to make acid." },
            ],
          },
        ],
      },
    ],
  },
];
