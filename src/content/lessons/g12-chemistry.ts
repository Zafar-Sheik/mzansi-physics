import type { Lesson } from "../types";

const m = String.raw;

export const G12_CHEMISTRY: Lesson[] = [
  // ------------------------------------------------------------------ Organic 1
  {
    slug: "organic-naming",
    topic: "g12-organic",
    order: 1,
    title: "Organic molecules: functional groups & IUPAC names",
    tagline: "Carbon's endless family – and the rules for naming every member.",
    emoji: "🛢️",
    caps: "CAPS Gr 12 · Matter & materials: organic molecules, homologous series and functional groups (alkanes, alkenes, alkynes, haloalkanes, alcohols, aldehydes, ketones, carboxylic acids, esters), structural, condensed and molecular formulae, IUPAC naming, structural isomers, saturated and unsaturated compounds.",
    objectives: [
      "Identify the functional group and homologous series of a compound",
      "Write structural, condensed and molecular formulae",
      "Name compounds using IUPAC rules (up to 8 carbons)",
      "Identify chain, positional and functional isomers",
    ],
    styles: ["visual", "kinaesthetic", "read-write"],
    xp: 110,
    terms: [
      { term: "Organic molecule", def: "A molecule containing carbon atoms (except CO, CO₂ and carbonates)." },
      { term: "Homologous series", def: "A series of organic compounds that can be described by the same general formula and in which each member differs from the next by a CH₂ group." },
      { term: "Functional group", def: "A bond or an atom or a group of atoms that determines the physical and chemical properties of a group of organic compounds." },
      { term: "Saturated compound", def: "A compound with only single bonds between carbon atoms (e.g. alkanes)." },
      { term: "Unsaturated compound", def: "A compound with at least one multiple bond between carbon atoms (e.g. alkenes, alkynes)." },
      { term: "Structural isomers", def: "Organic molecules with the same molecular formula but different structural formulae (chain, positional or functional isomers)." },
      { term: "Alkanes", def: m`Saturated hydrocarbons, general formula $\mathrm{C_nH_{2n+2}}$, suffix -ane.` },
      { term: "Alkenes", def: m`Hydrocarbons with a C=C double bond, $\mathrm{C_nH_{2n}}$, suffix -ene.` },
      { term: "Alcohols", def: "Contain a hydroxyl group (–OH); suffix -ol." },
      { term: "Carboxylic acids", def: "Contain a carboxyl group (–COOH); suffix -oic acid." },
      { term: "Esters", def: "Formed from an alcohol and a carboxylic acid; named alkyl alkanoate, e.g. methyl ethanoate." },
      { term: "Aldehydes and ketones", def: "Both contain a carbonyl group (C=O): at the end of the chain in aldehydes (-al), inside the chain in ketones (-one)." },
    ],
    chunks: [
      {
        id: "groups",
        title: "Homologous series & functional groups",
        minutes: 9,
        blocks: [
          { type: "callout", variant: "real-world", md: m`Sasol in Secunda turns coal into petrol, diesel, plastics and waxes – all organic molecules. LPG for the gas braai is propane and butane; the vinegar on your slap chips is ethanoic acid; the fruity smell of a sweet is an ester.` },
          {
            type: "table",
            headers: ["Series", "Functional group", "Suffix", "Example"],
            rows: [
              ["Alkanes", "C–C single bonds only", "-ane", "propane CH₃CH₂CH₃"],
              ["Alkenes", "C=C double bond", "-ene", "but-1-ene CH₂=CHCH₂CH₃"],
              ["Alkynes", "C≡C triple bond", "-yne", "ethyne HC≡CH"],
              ["Haloalkanes", "–F, –Cl, –Br, –I", "halo- prefix", "chloromethane CH₃Cl"],
              ["Alcohols", "–OH (hydroxyl)", "-ol", "ethanol CH₃CH₂OH"],
              ["Aldehydes", "–CHO (formyl) at the end", "-al", "propanal CH₃CH₂CHO"],
              ["Ketones", "C=O inside the chain", "-one", "propanone CH₃COCH₃"],
              ["Carboxylic acids", "–COOH (carboxyl)", "-oic acid", "ethanoic acid CH₃COOH"],
              ["Esters", "–COO– between chains", "alkyl -oate", "methyl ethanoate CH₃COOCH₃"],
            ],
          },
          { type: "callout", variant: "memory", md: m`Stems: **M**onkeys **E**at **P**eanut **B**utter – **P**lease **H**elp **H**im **O**ut → meth (1), eth (2), prop (3), but (4), pent (5), hex (6), hept (7), oct (8).` },
        ],
      },
      {
        id: "naming",
        title: "IUPAC naming, step by step",
        minutes: 10,
        blocks: [
          {
            type: "sequence",
            id: "iupac-steps",
            title: "Naming an organic compound",
            steps: ["Identify the functional group (it gives the suffix)", "Find the longest continuous carbon chain that contains the functional group (the stem)", "Number the chain from the end that gives the functional group the lowest number", "Identify and number the branches (substituents)", "Write the name: branches in alphabetical order with numbers, then stem, then functional group with its number"],
            explain: "Example: CH₃CH(CH₃)CH(OH)CH₃ → the –OH is on C2 when numbered from the right, a methyl branch on C3 → 3-methylbutan-2-ol.",
          },
          { type: "widget", widget: "organic-namer" },
          {
            type: "worked",
            title: "Name this alkene",
            problem: m`Name: $\mathrm{CH_3CH(CH_3)CH{=}CH_2}$`,
            steps: [
              { md: "Functional group: C=C → alkene (-ene). Longest chain with the C=C: 4 carbons → but-." },
              { md: "Number from the right so the double bond starts at C1: C1=C2.", why: "The functional group gets the lowest number, before the branches." },
              { md: "The methyl branch is on C3." },
              { md: "Name: **3-methylbut-1-ene**" },
            ],
          },
          {
            type: "practice",
            id: "naming-practice",
            problems: [
              { q: m`Name: $\mathrm{CH_3CH_2CH_2OH}$`, answer: "propan-1-ol | 1-propanol", kind: "text", solution: "Alcohol, 3 carbons, –OH on C1: **propan-1-ol**." },
              { q: m`Name: $\mathrm{CH_3CH_2COOH}$`, answer: "propanoic acid", kind: "text", solution: "Carboxylic acid with 3 carbons (including the COOH carbon): **propanoic acid**." },
              { q: m`Name: $\mathrm{CH_3CH(CH_3)CH_2CH_3}$`, answer: "2-methylbutane", kind: "text", solution: "Longest chain: 4 C (butane); methyl on C2: **2-methylbutane**." },
              { q: m`Name the ester: $\mathrm{CH_3COOCH_2CH_3}$`, answer: "ethyl ethanoate", kind: "text", hint: "The part attached to the single-bonded O came from the alcohol: name it first (-yl).", solution: "From ethanol + ethanoic acid: **ethyl ethanoate**." },
              { q: m`Write the condensed formula of butan-2-one.`, answer: "CH3COCH2CH3 | CH3CH2COCH3", kind: "formula", solution: m`4 carbons, C=O on C2: $\mathrm{CH_3COCH_2CH_3}$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["organic-name"], title: "IUPAC naming drill" } },
        ],
      },
      {
        id: "isomers",
        title: "Isomers",
        minutes: 6,
        blocks: [
          { type: "text", md: m`**Structural isomers** have the same molecular formula but different structures:

- **Chain isomers** – different chains: butane and 2-methylpropane (both $\mathrm{C_4H_{10}}$).
- **Positional isomers** – the functional group in a different position: propan-1-ol and propan-2-ol.
- **Functional isomers** – different functional groups: propanal and propanone ($\mathrm{C_3H_6O}$), or butanoic acid and ethyl ethanoate ($\mathrm{C_4H_8O_2}$).` },
          {
            type: "match",
            id: "isomer-match",
            title: "Match the isomer pair to its type",
            pairs: [
              { left: "butane & 2-methylpropane", right: "chain isomers" },
              { left: "but-1-ene & but-2-ene", right: "positional isomers" },
              { left: "propanal & propanone", right: "functional isomers" },
            ],
          },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["The functional group decides the series and the suffix.", "Longest chain with the functional group; lowest number to the functional group.", "Branches in alphabetical order; di-, tri- for repeats.", "Isomers: same molecular formula, different structure."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "organic-naming-quiz",
            questions: [
              { q: m`$\mathrm{CH_3CHO}$ belongs to the…`, options: ["alcohols", "aldehydes", "ketones", "carboxylic acids"], answer: 1, explain: "–CHO at the end of the chain: ethanal." },
              { q: "Which compound is unsaturated?", options: ["Ethane", "Ethanol", "Ethene", "Ethanoic acid"], answer: 2, explain: "Ethene has a C=C double bond." },
              { q: "The general formula of the alkanes is…", options: [m`$\mathrm{C_nH_{2n}}$`, m`$\mathrm{C_nH_{2n+2}}$`, m`$\mathrm{C_nH_{2n-2}}$`, m`$\mathrm{C_nH_n}$`], answer: 1, explain: "e.g. propane C₃H₈." },
              { q: "Propanal and propanone are…", options: ["chain isomers", "positional isomers", "functional isomers", "the same compound"], answer: 2, explain: "Same formula C₃H₆O, different functional groups." },
              { q: "An ester is formed from…", options: ["two alcohols", "an alcohol and a carboxylic acid", "an alkane and water", "two acids"], answer: 1, explain: "Esterification." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Organic 2
  {
    slug: "organic-properties-reactions",
    topic: "g12-organic",
    order: 2,
    title: "Organic molecules: properties, reactions & plastics",
    tagline: "Boiling points, combustion, substitution, addition, elimination – and plastic.",
    emoji: "⚗️",
    caps: "CAPS Gr 12 · Matter & materials: physical properties (boiling point, melting point, vapour pressure) related to intermolecular forces, chain length and branching; reactions – combustion, esterification, substitution, addition (hydrogenation, halogenation, hydrohalogenation, hydration), elimination (dehydration, dehydrohalogenation, cracking); addition and condensation polymers.",
    objectives: [
      "Explain trends in boiling points using intermolecular forces",
      "Write equations for combustion and esterification",
      "Identify substitution, addition and elimination reactions and their conditions",
      "Describe addition and condensation polymers",
    ],
    styles: ["visual", "read-write"],
    xp: 110,
    terms: [
      { term: "Combustion", def: "An organic compound reacts with oxygen to form CO₂ and H₂O, releasing energy (exothermic)." },
      { term: "Substitution reaction", def: "A reaction in which an atom or group of atoms is replaced by another, e.g. an alkane + halogen in light → haloalkane." },
      { term: "Addition reaction", def: "A reaction in which atoms are added across a double bond (unsaturated → saturated), e.g. hydrogenation, hydration." },
      { term: "Elimination reaction", def: "A reaction in which atoms are removed to form a double bond, e.g. dehydration of an alcohol, cracking." },
      { term: "Esterification", def: "An alcohol + a carboxylic acid → an ester + water, catalysed by concentrated H₂SO₄ and heated." },
      { term: "Cracking", def: "Breaking long-chain alkanes into shorter alkanes and alkenes using heat (thermal) or a catalyst." },
      { term: "Polymer", def: "A large molecule made of many small repeating units (monomers)." },
      { term: "Addition polymerisation", def: "Monomers with double bonds join without losing atoms, e.g. ethene → polyethene." },
      { term: "Condensation polymerisation", def: "Monomers join and a small molecule (usually water) is released, e.g. polyesters." },
    ],
    chunks: [
      {
        id: "properties",
        title: "Physical properties",
        minutes: 9,
        blocks: [
          { type: "text", md: m`Boiling points depend on the **strength of the intermolecular forces**:

- **Chain length:** longer chain → larger surface area → stronger London forces → higher boiling point.
- **Branching:** more branches → more compact → smaller surface area → weaker forces → lower boiling point.
- **Functional group:** alkanes (London only) < aldehydes & ketones (dipole-dipole) < alcohols (hydrogen bonds) < carboxylic acids (two hydrogen bonds, form dimers).` },
          { type: "widget", widget: "property-chart", props: { set: "groups" } },
          { type: "widget", widget: "property-chart", props: { set: "branching", title: "Branching lowers the boiling point" } },
          { type: "callout", variant: "exam", md: m`Explaining a boiling point difference needs **three steps** for full marks: (1) name the intermolecular forces in each compound, (2) compare their strength, (3) link it to the energy needed to overcome them.` },
        ],
      },
      {
        id: "reactions",
        title: "Reactions of organic compounds",
        minutes: 10,
        blocks: [
          {
            type: "table",
            headers: ["Reaction", "Type", "Conditions", "Example"],
            rows: [
              ["Hydrogenation", "addition", "Pt/Ni/Pd catalyst, heat", "ethene + H₂ → ethane"],
              ["Halogenation (of alkenes)", "addition", "no water, room temperature", "ethene + Br₂ → 1,2-dibromoethane"],
              ["Hydrohalogenation", "addition", "no water", "propene + HBr → 2-bromopropane (major)"],
              ["Hydration", "addition", "excess water, H₃PO₄ or H₂SO₄ catalyst", "ethene + H₂O → ethanol"],
              ["Halogenation (of alkanes)", "substitution", "light (hf) or heat", "methane + Cl₂ → chloromethane + HCl"],
              ["Hydrolysis of haloalkanes", "substitution", "warm dilute NaOH / water", "bromoethane + NaOH → ethanol + NaBr"],
              ["Dehydration", "elimination", "conc. H₂SO₄ or H₃PO₄, heat", "ethanol → ethene + H₂O"],
              ["Dehydrohalogenation", "elimination", "hot concentrated NaOH in ethanol", "bromoethane → ethene + HBr"],
              ["Cracking", "elimination", "high temperature, catalyst", "C₁₀H₂₂ → C₈H₁₈ + C₂H₄"],
            ],
          },
          {
            type: "widget",
            widget: "sorter",
            props: {
              id: "reaction-type-sort", title: "Addition, substitution or elimination?", buckets: ["Addition", "Substitution", "Elimination"], colour: "var(--t-matter)",
              items: [
                { text: "ethene + H₂ → ethane", bucket: "Addition" }, { text: "ethene + H₂O → ethanol", bucket: "Addition" }, { text: "propene + HCl → 2-chloropropane", bucket: "Addition" },
                { text: "methane + Cl₂ → chloromethane + HCl", bucket: "Substitution" }, { text: "bromoethane + NaOH → ethanol + NaBr", bucket: "Substitution" },
                { text: "ethanol → ethene + H₂O", bucket: "Elimination" }, { text: "2-bromobutane → but-2-ene + HBr", bucket: "Elimination" }, { text: "cracking of decane", bucket: "Elimination" },
              ],
            },
          },
          { type: "callout", variant: "memory", md: m`**Markovnikov's rule** (hydrohalogenation and hydration): "the rich get richer" – the H atom adds to the carbon of the double bond that **already has more H atoms**.` },
        ],
      },
      {
        id: "esters",
        title: "Combustion, esterification & polymers",
        minutes: 8,
        blocks: [
          { type: "text", md: m`**Combustion** (complete): $$\mathrm{C_3H_8 + 5O_2 \rightarrow 3CO_2 + 4H_2O}$$ **Esterification:** $$\mathrm{CH_3COOH + CH_3CH_2OH \rightleftharpoons CH_3COOCH_2CH_3 + H_2O}$$ (ethanoic acid + ethanol → ethyl ethanoate + water, with concentrated $\mathrm{H_2SO_4}$ and gentle heating).` },
          {
            type: "practice",
            id: "reactions-practice",
            problems: [
              { q: m`Balance the complete combustion of ethane: $\mathrm{\square C_2H_6 + \square O_2 \rightarrow \square CO_2 + \square H_2O}$`, answer: "2; 7; 4; 6", kind: "list", solution: m`$\mathrm{2C_2H_6 + 7O_2 \rightarrow 4CO_2 + 6H_2O}$` },
              { q: "Name the ester formed from methanol and propanoic acid.", answer: "methyl propanoate", kind: "text", solution: "The alcohol gives the -yl part (methyl), the acid gives the -oate part (propanoate): **methyl propanoate**." },
              { q: "Name the product when but-2-ene reacts with hydrogen (Pt catalyst).", answer: "butane", kind: "text", solution: "Hydrogenation (addition): the C=C becomes C–C → **butane**." },
            ],
          },
          { type: "text", md: m`**Plastics** are polymers. **Addition polymers** like polyethene (shopping bags) form from alkene monomers: $n\,\mathrm{CH_2{=}CH_2 \rightarrow -[CH_2-CH_2]_n-}$. **Condensation polymers** like polyesters (clothes) form when monomers join and release water. South Africa recycles about 40 % of its plastic packaging – the rest can last hundreds of years in the environment.` },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["Longer chain ↑ bp; more branching ↓ bp; H-bonds ↑ bp.", "Addition: unsaturated → saturated; elimination: makes a double bond; substitution: swaps atoms.", "Esterification: alcohol + acid (conc. H₂SO₄) → ester + water.", "Polymers: addition (no by-product) or condensation (water released)."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "organic-reactions-quiz",
            questions: [
              { q: "Which has the highest boiling point?", options: ["butane", "propanal", "propan-1-ol", "ethanoic acid"], answer: 3, explain: "Carboxylic acids have two hydrogen-bonding sites per molecule." },
              { q: "The conversion of ethanol to ethene is…", options: ["addition", "substitution", "elimination", "esterification"], answer: 2, explain: "Water is removed to form a double bond (dehydration)." },
              { q: "Bromine water decolourises quickly with…", options: ["hexane", "hex-1-ene", "hexan-1-ol", "hexanoic acid"], answer: 1, explain: "Alkenes undergo addition with Br₂ – a test for unsaturation." },
              { q: "The catalyst for esterification is…", options: ["platinum", "concentrated sulfuric acid", "sodium hydroxide", "light"], answer: 1, explain: "Concentrated H₂SO₄." },
              { q: "Polyethene is an example of…", options: ["a condensation polymer", "an addition polymer", "an ester", "a protein"], answer: 1, explain: "Ethene monomers add together without losing atoms." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Rates
  {
    slug: "reaction-rates",
    topic: "g12-rates",
    order: 1,
    title: "Rates of reaction",
    tagline: "Why food goes off faster in summer – and how catalysts speed things up.",
    emoji: "⏱️",
    caps: "CAPS Gr 12 · Chemical change: reaction rate, measuring rates, factors affecting rate (nature of reactants, surface area, concentration, pressure, temperature, catalysts), collision theory, activation energy, the Maxwell-Boltzmann distribution, catalysts and energy profiles.",
    objectives: [
      "Define reaction rate and calculate average rates",
      "Explain the factors that affect rate using collision theory",
      "Interpret the Maxwell-Boltzmann distribution",
      "Explain how a catalyst works",
    ],
    styles: ["visual", "kinaesthetic"],
    xp: 100,
    terms: [
      { term: "Reaction rate", def: "The change in concentration (or amount, mass or volume) of reactants or products per unit time." },
      { term: "Collision theory", def: "Molecules must collide with sufficient energy (at least the activation energy) and the correct orientation for a reaction to take place." },
      { term: "Effective collision", def: "A collision that leads to a reaction." },
      { term: "Activation energy", def: "The minimum energy needed for a reaction to take place." },
      { term: "Catalyst", def: "A substance that increases the rate of a reaction without being used up, by providing an alternative pathway of lower activation energy." },
      { term: "Maxwell-Boltzmann distribution", def: "A graph of the number of particles against their kinetic energy; at a higher temperature it shifts right and more particles have E ≥ Eₐ." },
    ],
    chunks: [
      {
        id: "rate",
        title: "What is reaction rate?",
        minutes: 8,
        blocks: [
          { type: "callout", variant: "real-world", md: m`Milk goes sour faster on a hot Durban day than in the fridge. Powdered sugar burns explosively but a sugar cube hardly at all. A catalytic converter cleans your car's exhaust in a fraction of a second. All of these are about **reaction rate**.` },
          { type: "text", md: m`$$\text{rate} = \frac{\Delta c}{\Delta t} \quad \text{or} \quad \frac{\Delta m}{\Delta t},\ \frac{\Delta V}{\Delta t},\ \frac{\Delta n}{\Delta t}$$ Measure it by following a change you can see: the volume of gas produced, the mass lost as a gas escapes, a colour change or a precipitate forming. On a graph of product against time, the **gradient** is the rate – steep at the start, flattening as the reactants run out.` },
          {
            type: "practice",
            id: "rate-practice",
            problems: [
              { q: m`$60\ \text{cm}^3$ of gas is produced in the first $40\ \text{s}$. Calculate the average rate.`, answer: "1.5", unit: "cm³·s⁻¹", solution: m`$$\text{rate} = \frac{60}{40} = 1{,}5\ \text{cm}^3\text{·s}^{-1}$$` },
              { q: m`A $5\ \text{g}$ marble chip has a mass of $3{,}2\ \text{g}$ after $2$ minutes in acid. Calculate the average rate of reaction (in g·s⁻¹).`, answer: "0.015", unit: "g·s⁻¹", solution: m`$$\text{rate} = \frac{5 - 3{,}2}{120} = 0{,}015\ \text{g·s}^{-1}$$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["reaction-rate"], title: "Reaction rate drill" } },
        ],
      },
      {
        id: "factors",
        title: "Collision theory & the factors",
        minutes: 10,
        blocks: [
          { type: "widget", widget: "rate-lab" },
          {
            type: "table",
            headers: ["Factor", "Effect", "Collision-theory explanation"],
            rows: [
              ["Concentration (or pressure for gases)", "↑ rate", "more particles per unit volume → more collisions per second → more effective collisions"],
              ["Surface area", "↑ rate", "more particles exposed → more collisions per second"],
              ["Temperature", "↑ rate", "particles move faster AND more have E ≥ Eₐ → many more effective collisions per second"],
              ["Catalyst", "↑ rate", "alternative path with lower Eₐ → more particles have enough energy"],
              ["Nature of reactants", "varies", "some bonds are easier to break than others"],
            ],
          },
          { type: "callout", variant: "exam", md: m`For temperature, the exam wants **"more molecules have kinetic energy equal to or greater than the activation energy"** – that's the main reason, more important than "they collide more often".` },
        ],
      },
      {
        id: "mb",
        title: "Maxwell-Boltzmann & catalysts",
        minutes: 7,
        blocks: [
          { type: "widget", widget: "rate-lab", props: { title: "Switch to the Maxwell-Boltzmann view" } },
          { type: "widget", widget: "energy-profile", props: { catalyst: true, title: "A catalyst lowers the activation energy" } },
          { type: "callout", variant: "real-world", md: m`**Enzymes** are biological catalysts: amylase in your saliva starts digesting the starch in your pap. In industry, **iron** catalyses the Haber process and **platinum** cleans car exhausts.` },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["Rate = change in amount ÷ time.", "Effective collisions need enough energy AND the right orientation.", "Higher T: more particles with E ≥ Eₐ.", "A catalyst lowers Eₐ and is not used up – ΔH doesn't change."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "rates-quiz",
            questions: [
              { q: "Powdered zinc reacts faster with acid than a zinc lump because it has a larger…", options: ["mass", "surface area", "activation energy", "concentration"], answer: 1, explain: "More particles are exposed to collisions." },
              { q: "A catalyst increases the rate by…", options: ["increasing the temperature", "lowering the activation energy", "increasing the concentration", "changing ΔH"], answer: 1, explain: "It provides an alternative pathway." },
              { q: "When the temperature increases, the Maxwell-Boltzmann curve…", options: ["shifts left and gets taller", "shifts right and flattens", "doesn't change", "disappears"], answer: 1, explain: "More particles at higher energies." },
              { q: "On a graph of product volume against time, the rate is given by the…", options: ["area", "gradient", "y-intercept", "x-intercept"], answer: 1, explain: "Δ(volume)/Δt." },
              { q: "Why does the rate decrease as a reaction proceeds?", options: ["The catalyst is used up", "The concentration of reactants decreases", "The temperature drops", "Eₐ increases"], answer: 1, explain: "Fewer reactant particles → fewer collisions per second." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Equilibrium
  {
    slug: "chemical-equilibrium",
    topic: "g12-equilibrium",
    order: 1,
    title: "Chemical equilibrium",
    tagline: "Reactions that go both ways – and how to push them where you want.",
    emoji: "⚖️",
    caps: "CAPS Gr 12 · Chemical change: open and closed systems, reversible reactions, dynamic equilibrium, the equilibrium constant Kc, calculations, factors affecting equilibrium, Le Chatelier's principle, rate-time and concentration-time graphs, industrial applications (Haber process).",
    objectives: [
      "Describe dynamic equilibrium in a closed system",
      "Write Kc expressions and do Kc calculations (with ICE tables)",
      "Use Le Chatelier's principle to predict shifts",
      "Interpret equilibrium graphs",
    ],
    styles: ["visual", "read-write"],
    xp: 110,
    terms: [
      { term: "Closed system", def: "A system that cannot exchange matter with its surroundings (energy can still be exchanged)." },
      { term: "Reversible reaction", def: "A reaction in which the products can be converted back to the reactants." },
      { term: "Dynamic equilibrium", def: "The state in a closed system where the rate of the forward reaction equals the rate of the reverse reaction; concentrations stay constant but both reactions continue." },
      { term: "Equilibrium constant (Kc)", def: m`For $a\mathrm{A} + b\mathrm{B} \rightleftharpoons c\mathrm{C} + d\mathrm{D}$: $K_c = \frac{[\mathrm{C}]^c[\mathrm{D}]^d}{[\mathrm{A}]^a[\mathrm{B}]^b}$ (solids and pure liquids are left out).` },
      { term: "Le Chatelier's principle", def: "When the equilibrium in a closed system is disturbed, the system will re-instate a new equilibrium by favouring the reaction that will oppose the disturbance." },
      { term: "Meaning of Kc", def: "Kc > 1: products favoured (high yield); Kc < 1: reactants favoured. Only TEMPERATURE changes the value of Kc." },
    ],
    chunks: [
      {
        id: "dynamic",
        title: "Dynamic equilibrium",
        minutes: 8,
        blocks: [
          { type: "text", md: m`In a **closed** container some reactions never finish: as products form, they react back into reactants. Eventually the **forward and reverse rates are equal**. Concentrations stop changing – but the reactions don't stop. That's **dynamic equilibrium**.` },
          { type: "callout", variant: "real-world", md: m`Think of a busy escalator at Sandton City going up while the next one goes down, with the same number of people per minute on each: the number of people on each floor stays the same, but people keep moving.` },
          { type: "widget", widget: "equilibrium-lab" },
        ],
      },
      {
        id: "kc",
        title: "The equilibrium constant Kc",
        minutes: 10,
        blocks: [
          { type: "text", md: m`$$K_c = \frac{[\text{products}]^{\text{coefficients}}}{[\text{reactants}]^{\text{coefficients}}}$$ Use **equilibrium** concentrations (mol·dm⁻³). Leave out **solids** and **pure liquids** (like water as a solvent).` },
          {
            type: "worked",
            title: "An ICE table",
            problem: m`$2\ \text{mol}$ of $\mathrm{H_2}$ and $2\ \text{mol}$ of $\mathrm{I_2}$ are sealed in a $1\ \text{dm}^3$ flask: $\mathrm{H_2 + I_2 \rightleftharpoons 2HI}$. At equilibrium $3\ \text{mol}$ of HI are present. Calculate Kc.`,
            steps: [
              { md: m`Change: HI increased by 3 mol, so $\mathrm{H_2}$ and $\mathrm{I_2}$ each decreased by $1{,}5\ \text{mol}$ (ratio 1 : 1 : 2).`, why: "Use the mole ratio for the CHANGE row only." },
              { md: m`Equilibrium: $\mathrm{H_2} = 0{,}5$, $\mathrm{I_2} = 0{,}5$, $\mathrm{HI} = 3\ \text{mol}$ → divide by $1\ \text{dm}^3$ for concentrations.` },
              { md: m`$K_c = \frac{[\mathrm{HI}]^2}{[\mathrm{H_2}][\mathrm{I_2}]} = \frac{3^2}{(0{,}5)(0{,}5)} = 36$`, why: "Kc > 1, so products are favoured." },
            ],
          },
          {
            type: "practice",
            id: "kc-practice",
            problems: [
              { q: m`For $\mathrm{N_2O_4 \rightleftharpoons 2NO_2}$: $[\mathrm{N_2O_4}] = 0{,}04$ and $[\mathrm{NO_2}] = 0{,}02\ \text{mol·dm}^{-3}$. Calculate Kc.`, answer: "0.01", solution: m`$$K_c = \frac{(0{,}02)^2}{0{,}04} = 0{,}01$$` },
              { q: m`For $\mathrm{2SO_2 + O_2 \rightleftharpoons 2SO_3}$: $[\mathrm{SO_2}] = 0{,}2$, $[\mathrm{O_2}] = 0{,}1$, $[\mathrm{SO_3}] = 0{,}4\ \text{mol·dm}^{-3}$. Calculate Kc.`, answer: "40", solution: m`$$K_c = \frac{(0{,}4)^2}{(0{,}2)^2(0{,}1)} = 40$$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["kc"], title: "Kc drill" } },
        ],
      },
      {
        id: "le-chatelier",
        title: "Le Chatelier's principle",
        minutes: 9,
        blocks: [
          {
            type: "table",
            headers: ["Disturbance", "System responds by…", "Kc changes?"],
            rows: [
              ["Add a reactant", "favouring the forward reaction", "no"],
              ["Remove a product", "favouring the forward reaction", "no"],
              ["Increase pressure (gases)", "favouring the side with FEWER gas moles", "no"],
              ["Increase temperature", "favouring the ENDOTHERMIC reaction", "yes"],
              ["Add a catalyst", "no shift – equilibrium is reached faster", "no"],
            ],
          },
          {
            type: "worked",
            title: "The Haber process",
            problem: m`$\mathrm{N_2(g) + 3H_2(g) \rightleftharpoons 2NH_3(g)}$, $\Delta H = -92\ \text{kJ·mol}^{-1}$. What conditions give the highest yield of ammonia?`,
            steps: [
              { md: m`**High pressure**: the forward reaction makes fewer gas moles (4 → 2), so high pressure favours ammonia.` },
              { md: m`**Low temperature**: the forward reaction is exothermic, so cooling favours it… but then the rate is too slow.`, why: "A compromise temperature of about 450 °C is used, with an iron catalyst to speed things up." },
              { md: m`**Remove** the ammonia as it forms (liquefy it) – the system keeps making more.` },
            ],
          },
          { type: "widget", widget: "equilibrium-lab", props: { title: "Test each disturbance" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["Dynamic equilibrium: forward rate = reverse rate in a closed system.", "Kc = products/reactants, powers = coefficients; no solids or pure liquids.", "Le Chatelier: the system opposes the disturbance.", "Only temperature changes Kc; a catalyst changes neither the position nor Kc."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "equilibrium-quiz",
            questions: [
              { q: "At dynamic equilibrium…", options: ["the reactions have stopped", "forward and reverse rates are equal", "the concentrations are equal", "Kc = 1"], answer: 1, explain: "Both reactions continue at the same rate." },
              { q: "Increasing the temperature of an exothermic equilibrium…", options: ["increases Kc", "decreases Kc", "doesn't change Kc", "makes Kc zero"], answer: 1, explain: "The endothermic (reverse) reaction is favoured, so Kc decreases." },
              { q: "Adding a catalyst to an equilibrium mixture…", options: ["increases the yield", "shifts it forward", "makes it reach equilibrium faster only", "changes Kc"], answer: 2, explain: "It speeds up both directions equally." },
              { q: m`For $\mathrm{CaCO_3(s) \rightleftharpoons CaO(s) + CO_2(g)}$, Kc equals…`, options: [m`$[\mathrm{CO_2}]$`, m`$\frac{[\mathrm{CaO}][\mathrm{CO_2}]}{[\mathrm{CaCO_3}]}$`, m`$[\mathrm{CaO}]$`, m`$\frac{1}{[\mathrm{CO_2}]}$`], answer: 0, explain: "Solids are left out of Kc." },
              { q: "A very large Kc means that at equilibrium…", options: ["mostly reactants are present", "mostly products are present", "the reaction is fast", "the reaction is endothermic"], answer: 1, explain: "The numerator (products) is much bigger." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Acids & bases 12
  {
    slug: "acids-and-bases",
    topic: "g12-acids",
    order: 1,
    title: "Acids & bases: pH, Kw & titrations",
    tagline: "From vinegar to battery acid – measuring, calculating and neutralising.",
    emoji: "🧫",
    caps: "CAPS Gr 12 · Chemical change: strong and weak acids and bases, concentrated and dilute, Ka and Kb, auto-ionisation of water and Kw, pH calculations, hydrolysis of salts, titrations and indicators, the equivalence point.",
    objectives: [
      "Tell strong from weak and concentrated from dilute",
      "Calculate pH and concentrations using Kw",
      "Predict the pH of salt solutions (hydrolysis)",
      "Do titration calculations and choose indicators",
    ],
    styles: ["visual", "kinaesthetic"],
    xp: 110,
    terms: [
      { term: "Strong acid", def: "An acid that ionises completely in water to form a high concentration of H₃O⁺ ions (e.g. HCl, H₂SO₄, HNO₃)." },
      { term: "Weak acid", def: "An acid that ionises incompletely in water (e.g. CH₃COOH, H₂C₂O₄) – it has a small Ka." },
      { term: "Concentrated vs dilute", def: "A concentrated solution has a large amount of solute per volume; a dilute one a small amount. (Not the same as strong/weak!)" },
      { term: "Auto-ionisation of water", def: m`$\mathrm{H_2O + H_2O \rightleftharpoons H_3O^+ + OH^-}$, with $K_w = [\mathrm{H_3O^+}][\mathrm{OH^-}] = 1 \times 10^{-14}$ at 25 °C.` },
      { term: "pH", def: m`$\text{pH} = -\log[\mathrm{H_3O^+}]$; pH < 7 acidic, 7 neutral, > 7 basic (at 25 °C).` },
      { term: "Hydrolysis", def: "The reaction of a salt's ions with water, which can make a salt solution acidic or basic." },
      { term: "Equivalence point", def: "The point in a titration where the acid and base have reacted completely in the mole ratio of the balanced equation." },
      { term: "End point", def: "The point in a titration where the indicator changes colour." },
      { term: "Titration formula", def: m`$\frac{c_aV_a}{c_bV_b} = \frac{n_a}{n_b}$` },
    ],
    chunks: [
      {
        id: "strong-weak",
        title: "Strong, weak, concentrated, dilute",
        minutes: 8,
        blocks: [
          { type: "text", md: m`**Strength** is about how much the acid **ionises**; **concentration** is about how much acid is **dissolved**. A dilute solution of a strong acid (0,01 M HCl) can have a lower pH than a concentrated weak acid (1 M vinegar).

$$\mathrm{HCl + H_2O \rightarrow H_3O^+ + Cl^-} \ \text{(complete)} \qquad \mathrm{CH_3COOH + H_2O \rightleftharpoons H_3O^+ + CH_3COO^-}\ \text{(partial)}$$` },
          {
            type: "widget",
            widget: "sorter",
            props: {
              id: "strong-weak-sort", title: "Strong or weak?", buckets: ["Strong acid", "Weak acid", "Strong base", "Weak base"], colour: "var(--t-change)",
              items: [
                { text: "HCl", bucket: "Strong acid" }, { text: "H₂SO₄", bucket: "Strong acid" }, { text: "HNO₃", bucket: "Strong acid" }, { text: "CH₃COOH", bucket: "Weak acid" },
                { text: "H₂C₂O₄ (oxalic acid)", bucket: "Weak acid" }, { text: "NaOH", bucket: "Strong base" }, { text: "KOH", bucket: "Strong base" }, { text: "NH₃", bucket: "Weak base" }, { text: "Na₂CO₃", bucket: "Weak base" },
              ],
            },
          },
        ],
      },
      {
        id: "ph",
        title: "pH and Kw",
        minutes: 10,
        blocks: [
          { type: "text", md: m`$$\text{pH} = -\log[\mathrm{H_3O^+}] \qquad K_w = [\mathrm{H_3O^+}][\mathrm{OH^-}] = 1 \times 10^{-14}$$ For a strong base, first find $[\mathrm{H_3O^+}] = \frac{K_w}{[\mathrm{OH^-}]}$.` },
          {
            type: "worked",
            title: "pH of sulfuric acid and of a base",
            problem: m`Calculate the pH of (a) $0{,}05\ \text{mol·dm}^{-3}$ $\mathrm{H_2SO_4}$ and (b) $0{,}02\ \text{mol·dm}^{-3}$ $\mathrm{NaOH}$.`,
            steps: [
              { md: m`(a) Diprotic: $[\mathrm{H_3O^+}] = 2 \times 0{,}05 = 0{,}1$; $\text{pH} = -\log 0{,}1 = 1$`, why: "Each H₂SO₄ gives two H₃O⁺ (assume complete ionisation)." },
              { md: m`(b) $[\mathrm{OH^-}] = 0{,}02$; $[\mathrm{H_3O^+}] = \frac{10^{-14}}{0{,}02} = 5 \times 10^{-13}$` },
              { md: m`$\text{pH} = -\log(5 \times 10^{-13}) = 12{,}3$` },
            ],
          },
          {
            type: "practice",
            id: "ph-practice",
            problems: [
              { q: m`Calculate the pH of $0{,}001\ \text{mol·dm}^{-3}$ HCl.`, answer: "3", tol: 0.011, solution: m`$$\text{pH} = -\log(0{,}001) = 3$$` },
              { q: m`A solution has pH 4. Calculate $[\mathrm{H_3O^+}]$.`, answer: "1e-4", unit: "mol·dm⁻³", solution: m`$$[\mathrm{H_3O^+}] = 10^{-4}\ \text{mol·dm}^{-3}$$` },
              { q: m`Calculate the pH of $0{,}1\ \text{mol·dm}^{-3}$ KOH.`, answer: "13", tol: 0.011, solution: m`$$[\mathrm{H_3O^+}] = \frac{10^{-14}}{0{,}1} = 10^{-13} \Rightarrow \text{pH} = 13$$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["ph"], title: "pH drill" } },
          { type: "callout", variant: "key", md: m`**Salt hydrolysis:** strong acid + strong base → neutral salt (NaCl, pH 7). Weak acid + strong base → basic salt (CH₃COONa, pH > 7). Strong acid + weak base → acidic salt (NH₄Cl, pH < 7).` },
        ],
      },
      {
        id: "titration",
        title: "Titrations",
        minutes: 10,
        blocks: [
          { type: "widget", widget: "titration-lab" },
          {
            type: "worked",
            title: "Finding an unknown concentration",
            problem: m`$25\ \text{cm}^3$ of NaOH is neutralised by $20\ \text{cm}^3$ of $0{,}1\ \text{mol·dm}^{-3}$ $\mathrm{H_2SO_4}$. Calculate the concentration of the NaOH. ($\mathrm{H_2SO_4 + 2NaOH \rightarrow Na_2SO_4 + 2H_2O}$)`,
            steps: [
              { md: m`$\frac{c_aV_a}{c_bV_b} = \frac{n_a}{n_b} \Rightarrow \frac{(0{,}1)(20)}{c_b(25)} = \frac{1}{2}$`, why: "The mole ratio comes from the balanced equation: 1 acid : 2 base." },
              { md: m`$c_b = \frac{(0{,}1)(20)(2)}{25} = 0{,}16\ \text{mol·dm}^{-3}$` },
            ],
          },
          {
            type: "practice",
            id: "titration-practice",
            problems: [
              { q: m`$30\ \text{cm}^3$ of HCl neutralises $25\ \text{cm}^3$ of $0{,}12\ \text{mol·dm}^{-3}$ NaOH. Calculate the concentration of the HCl.`, answer: "0.1", unit: "mol·dm⁻³", solution: m`$$\frac{c_a(30)}{(0{,}12)(25)} = \frac{1}{1} \Rightarrow c_a = 0{,}1\ \text{mol·dm}^{-3}$$` },
              { q: "Which indicator should be used for a titration of ethanoic acid with sodium hydroxide?", answer: "phenolphthalein", kind: "text", solution: "The salt (sodium ethanoate) is basic, so the equivalence point is above pH 7 – use **phenolphthalein** (range 8,3–10)." },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["titration"], title: "Titration drill" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["Strong = ionises completely; concentrated = lots dissolved.", m`pH = −log[H₃O⁺]; $K_w = 10^{-14}$.`, m`$\frac{c_aV_a}{c_bV_b} = \frac{n_a}{n_b}$.`, "Choose an indicator that changes colour at the equivalence-point pH."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "acids12-quiz",
            questions: [
              { q: "A weak acid…", options: ["is always dilute", "ionises only partially", "has a pH above 7", "cannot be neutralised"], answer: 1, explain: "Weak describes incomplete ionisation." },
              { q: m`If $[\mathrm{H_3O^+}] = 10^{-9}\ \text{mol·dm}^{-3}$, the solution is…`, options: ["acidic", "neutral", "basic", "impossible"], answer: 2, explain: "pH = 9 > 7." },
              { q: "A solution of NH₄Cl in water is…", options: ["acidic", "neutral", "basic", "insoluble"], answer: 0, explain: "NH₄⁺ hydrolyses to form H₃O⁺ (salt of a strong acid and weak base)." },
              { q: "The point where the indicator changes colour is the…", options: ["equivalence point", "end point", "neutral point", "Kw point"], answer: 1, explain: "Ideally the end point is at the equivalence point." },
              { q: "Diluting an acid ten times (strong acid) changes the pH by…", options: ["0", "+1", "−1", "+10"], answer: 1, explain: "[H₃O⁺] becomes 10 times smaller: pH increases by 1." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Electrochemistry
  {
    slug: "electrochemistry",
    topic: "g12-electrochem",
    order: 1,
    title: "Electrochemical reactions",
    tagline: "Batteries, electroplating and the chemistry of the cellphone in your pocket.",
    emoji: "🔋",
    caps: "CAPS Gr 12 · Chemical change: galvanic and electrolytic cells, oxidation at the anode and reduction at the cathode, the salt bridge, cell notation, standard electrode potentials (Table 4), the standard hydrogen electrode, calculating emf, spontaneity, electrolysis (electroplating, purification of copper, chlor-alkali, extraction of aluminium).",
    objectives: [
      "Compare galvanic and electrolytic cells",
      "Use Table 4 to identify the anode and cathode and write half-reactions",
      m`Calculate $E^\theta_{cell} = E^\theta_{cathode} - E^\theta_{anode}$`,
      "Write cell notation and describe industrial electrolysis",
    ],
    styles: ["visual", "kinaesthetic"],
    xp: 110,
    terms: [
      { term: "Galvanic (voltaic) cell", def: "A cell in which chemical energy is converted into electrical energy by a spontaneous redox reaction." },
      { term: "Electrolytic cell", def: "A cell in which electrical energy is converted into chemical energy (a non-spontaneous reaction is forced by a DC source)." },
      { term: "Anode", def: "The electrode where OXIDATION takes place (negative in a galvanic cell, positive in an electrolytic cell)." },
      { term: "Cathode", def: "The electrode where REDUCTION takes place." },
      { term: "Salt bridge", def: "Completes the circuit by allowing ions to move between the half-cells, keeping each solution electrically neutral." },
      { term: "Standard conditions", def: "1 mol·dm⁻³ solutions, 25 °C (298 K) and 101,3 kPa for gases." },
      { term: "Standard hydrogen electrode", def: "The reference half-cell (Pt in 1 mol·dm⁻³ H⁺ with H₂ at 101,3 kPa), given E° = 0,00 V." },
      { term: "Cell emf", def: m`$E^\theta_{cell} = E^\theta_{cathode} - E^\theta_{anode}$; positive → spontaneous reaction.` },
      { term: "Cell notation", def: "anode | anode solution || cathode solution | cathode, e.g. Zn | Zn²⁺ || Cu²⁺ | Cu." },
    ],
    chunks: [
      {
        id: "galvanic",
        title: "Galvanic cells",
        minutes: 10,
        blocks: [
          { type: "callout", variant: "memory", md: m`**AN OX** and a **RED CAT**: **AN**ode = **OX**idation, **RED**uction = **CAT**hode. Electrons flow from anode to cathode through the wire.` },
          { type: "widget", widget: "cell-lab" },
          {
            type: "worked",
            title: "A zinc-silver cell",
            problem: m`A cell is made from a Zn | Zn²⁺ and an Ag | Ag⁺ half-cell under standard conditions. Find the anode, the cathode, the half-reactions, the overall reaction and the emf.`,
            steps: [
              { md: m`From Table 4: $E^\theta(\mathrm{Zn^{2+}/Zn}) = -0{,}76\ \text{V}$; $E^\theta(\mathrm{Ag^+/Ag}) = +0{,}80\ \text{V}$` },
              { md: m`Zn has the more negative E° → stronger reducing agent → **oxidised**: Zn is the **anode**: $\mathrm{Zn \rightarrow Zn^{2+} + 2e^-}$` },
              { md: m`Cathode (reduction): $\mathrm{Ag^+ + e^- \rightarrow Ag}$ (×2 to balance electrons)` },
              { md: m`Overall: $\mathrm{Zn + 2Ag^+ \rightarrow Zn^{2+} + 2Ag}$`, why: "Multiply the half-reactions so the electrons cancel – but NEVER multiply E° values." },
              { md: m`$E^\theta_{cell} = 0{,}80 - (-0{,}76) = 1{,}56\ \text{V}$ – positive, so spontaneous.` },
            ],
          },
          {
            type: "practice",
            id: "cell-practice",
            problems: [
              { q: m`Calculate the emf of a standard Mg | Mg²⁺ || Cu²⁺ | Cu cell. ($E^\theta$: Mg −2,36 V; Cu +0,34 V)`, answer: "2.7", unit: "V", tol: 0.006, solution: m`$$E^\theta_{cell} = 0{,}34 - (-2{,}36) = 2{,}70\ \text{V}$$` },
              { q: m`Calculate the emf of a standard cell made from a Ni | Ni²⁺ half-cell and the standard hydrogen electrode. ($E^\theta$(Ni) = −0,27 V)`, answer: "0.27", unit: "V", tol: 0.006, solution: m`H₂ is the cathode: $$E^\theta_{cell} = 0{,}00 - (-0{,}27) = 0{,}27\ \text{V}$$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["cell-emf"], title: "Cell emf drill" } },
        ],
      },
      {
        id: "electrolytic",
        title: "Electrolytic cells & industry",
        minutes: 9,
        blocks: [
          { type: "widget", widget: "cell-lab", props: { mode: "electrolytic" } },
          {
            type: "table",
            headers: ["", "Galvanic cell", "Electrolytic cell"],
            rows: [
              ["Energy change", "chemical → electrical", "electrical → chemical"],
              ["Reaction", "spontaneous", "non-spontaneous (needs a DC source)"],
              ["Anode", "negative, oxidation", "positive, oxidation"],
              ["Cathode", "positive, reduction", "negative, reduction"],
              ["Examples", "torch batteries, lithium-ion cells", "electroplating, copper purification, aluminium extraction, chlor-alkali"],
            ],
          },
          { type: "callout", variant: "real-world", md: m`Hillside Aluminium in Richards Bay uses as much electricity as a big city to extract aluminium by electrolysis. The **chlor-alkali** industry electrolyses brine (salt water) to make chlorine (for water treatment and PVC), hydrogen and sodium hydroxide (for soap and paper).` },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["AN OX, RED CAT – in every cell.", "Higher E° → reduced at the cathode; lower E° → oxidised at the anode.", m`$E^\theta_{cell} = E^\theta_{cathode} - E^\theta_{anode}$ (never multiply E°).`, "Galvanic: spontaneous, makes electricity; electrolytic: uses electricity."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "electrochem-quiz",
            questions: [
              { q: "In a galvanic cell, oxidation happens at the…", options: ["cathode", "anode", "salt bridge", "voltmeter"], answer: 1, explain: "AN OX: the ANode is where OXidation happens." },
              { q: "The function of the salt bridge is to…", options: ["provide electrons", "complete the circuit and keep the solutions neutral", "stop the reaction", "measure the emf"], answer: 1, explain: "Ions move through it." },
              { q: "In an electrolytic cell the anode is…", options: ["negative", "positive", "neutral", "always made of platinum"], answer: 1, explain: "It is connected to the positive terminal of the DC source." },
              { q: "Standard conditions for a cell include a concentration of…", options: ["0,1 mol·dm⁻³", "1 mol·dm⁻³", "2 mol·dm⁻³", "any concentration"], answer: 1, explain: "1 mol·dm⁻³, 25 °C, 101,3 kPa." },
              { q: "A positive cell emf shows that the reaction is…", options: ["spontaneous", "non-spontaneous", "at equilibrium", "endothermic"], answer: 0, explain: "It can run by itself and deliver electrical energy." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Fertilisers
  {
    slug: "fertiliser-industry",
    topic: "g12-fertilisers",
    order: 1,
    title: "The chemical industry: fertilisers",
    tagline: "Feeding South Africa: from air and water to bags of NPK.",
    emoji: "🌾",
    caps: "CAPS Gr 12 · Chemical systems: the fertiliser industry – nutrients (N, P, K), the Haber process, the Ostwald process, the contact process, making ammonium nitrate and ammonium sulfate, NPK ratios, the environmental impact (eutrophication).",
    objectives: [
      "Explain why plants need nitrogen, phosphorus and potassium",
      "Describe the Haber, Ostwald and contact processes",
      "Interpret and calculate NPK ratios",
      "Discuss the environmental impact of fertilisers",
    ],
    styles: ["read-write", "visual"],
    xp: 80,
    terms: [
      { term: "Primary nutrients", def: "Nitrogen (N – leaf growth), phosphorus (P – roots and flowers) and potassium (K – fruit and disease resistance)." },
      { term: "Haber process", def: m`$\mathrm{N_2(g) + 3H_2(g) \rightleftharpoons 2NH_3(g)}$, ΔH < 0; iron catalyst, about 450 °C and 200 atm.` },
      { term: "Ostwald process", def: m`Ammonia is oxidised to make nitric acid: $\mathrm{4NH_3 + 5O_2 \rightarrow 4NO + 6H_2O}$ (Pt catalyst), then $\mathrm{NO \rightarrow NO_2 \rightarrow HNO_3}$.` },
      { term: "Contact process", def: m`Making sulfuric acid: $\mathrm{2SO_2 + O_2 \rightleftharpoons 2SO_3}$ (V₂O₅ catalyst), then $\mathrm{SO_3 + H_2SO_4 \rightarrow H_2S_2O_7}$ (oleum) and $\mathrm{H_2S_2O_7 + H_2O \rightarrow 2H_2SO_4}$.` },
      { term: "NPK ratio", def: "The ratio of N : P : K in a fertiliser, followed by the total percentage of nutrients, e.g. 2:3:2 (22)." },
      { term: "Eutrophication", def: "Excess fertiliser washes into rivers and dams, causing algal blooms that use up the oxygen and kill fish." },
    ],
    chunks: [
      {
        id: "nutrients",
        title: "Why plants need fertilisers",
        minutes: 7,
        blocks: [
          { type: "callout", variant: "real-world", md: m`Maize farmers in the Free State, citrus growers in Limpopo and home gardeners all buy bags labelled like **2:3:2 (22)**. Omnia and Sasol make millions of tonnes of fertiliser a year in South Africa – the chemistry starts with air, natural gas and sulfur.` },
          {
            type: "table",
            headers: ["Nutrient", "Needed for", "Fertiliser sources"],
            rows: [
              ["Nitrogen (N)", "leaf and stem growth, chlorophyll", "ammonium nitrate, ammonium sulfate, urea"],
              ["Phosphorus (P)", "roots, flowers, energy transfer", "superphosphates, ammonium phosphate"],
              ["Potassium (K)", "fruit, resistance to disease and drought", "potassium chloride, potassium sulfate"],
            ],
          },
        ],
      },
      {
        id: "processes",
        title: "The industrial processes",
        minutes: 10,
        blocks: [
          {
            type: "sequence",
            id: "fertiliser-flow",
            title: "From air to ammonium nitrate",
            steps: ["Fractional distillation of liquid air gives nitrogen", "Haber process: N₂ + 3H₂ ⇌ 2NH₃", "Ostwald process: oxidise NH₃ to NO, then NO₂, then HNO₃", "Neutralise: NH₃ + HNO₃ → NH₄NO₃ (ammonium nitrate)"],
            explain: "Hydrogen for the Haber process comes from natural gas (methane) or coal gasification. Ammonium sulfate is made similarly, using sulfuric acid from the contact process: 2NH₃ + H₂SO₄ → (NH₄)₂SO₄.",
          },
          { type: "widget", widget: "equation-balancer", props: { start: 1, title: "Balance the industrial equations" } },
          { type: "widget", widget: "equilibrium-lab", props: { title: "Le Chatelier in industry" } },
        ],
      },
      {
        id: "npk",
        title: "NPK calculations",
        minutes: 8,
        blocks: [
          {
            type: "worked",
            title: "What's in the bag?",
            problem: m`A $50\ \text{kg}$ bag of fertiliser is labelled **3:1:5 (36)**. Calculate the mass of potassium in the bag.`,
            steps: [
              { md: m`Total nutrients: $36\%$ of $50\ \text{kg} = 18\ \text{kg}$` },
              { md: m`Potassium share: $\frac{5}{3 + 1 + 5} = \frac{5}{9}$` },
              { md: m`$m(\mathrm{K}) = \frac{5}{9} \times 18 = 10\ \text{kg}$` },
            ],
          },
          {
            type: "practice",
            id: "npk-practice",
            problems: [
              { q: "A 20 kg bag is labelled 2:3:2 (22). Calculate the mass of phosphorus in the bag.", answer: "1.886", unit: "kg", solution: m`Nutrients: $0{,}22 \times 20 = 4{,}4\ \text{kg}$. $$m(\mathrm{P}) = \frac{3}{7} \times 4{,}4 = 1{,}89\ \text{kg}$$` },
              { q: m`Calculate the percentage of nitrogen in ammonium nitrate, $\mathrm{NH_4NO_3}$ ($M = 80\ \text{g·mol}^{-1}$).`, answer: "35", unit: "%", solution: m`$$\%\mathrm{N} = \frac{2 \times 14}{80} \times 100 = 35\%$$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["npk", "percent-composition"], title: "Fertiliser drill" } },
          { type: "callout", variant: "safety", md: m`Ammonium nitrate is an oxidiser and can explode if heated or contaminated. Fertilisers must be stored dry and away from fuels. Too much fertiliser washing into rivers causes **eutrophication** – use the right amount at the right time.` },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["N for leaves, P for roots, K for fruit.", "Haber: ammonia; Ostwald: nitric acid; contact: sulfuric acid.", "NPK (x): share x% of the bag in the ratio N : P : K.", "Overuse causes eutrophication."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "fertiliser-quiz",
            questions: [
              { q: "The Haber process produces…", options: ["nitric acid", "ammonia", "sulfuric acid", "urea"], answer: 1, explain: "N₂ + 3H₂ ⇌ 2NH₃." },
              { q: "The catalyst in the contact process is…", options: ["iron", "platinum", "vanadium(V) oxide", "nickel"], answer: 2, explain: "Vanadium(V) oxide, V₂O₅." },
              { q: "Which nutrient mainly promotes leaf growth?", options: ["Nitrogen", "Phosphorus", "Potassium", "Calcium"], answer: 0, explain: "Nitrogen is needed for proteins and chlorophyll." },
              { q: "In '2:3:2 (22)', the 22 is the…", options: ["mass of the bag", "percentage of the bag that is nutrients", "price", "pH"], answer: 1, explain: "22 % of the mass is N, P and K." },
              { q: "Ammonium nitrate is made by reacting ammonia with…", options: ["sulfuric acid", "nitric acid", "water", "oxygen"], answer: 1, explain: "NH₃ + HNO₃ → NH₄NO₃." },
            ],
          },
        ],
      },
    ],
  },
];
