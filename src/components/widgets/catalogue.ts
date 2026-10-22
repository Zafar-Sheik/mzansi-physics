import type { Grade, Topic, WidgetName } from "@/content/types";

/** Every simulation and tool, used by the Toolkit page and the docs. `grades` lists other grades the tool is useful for. */
export const WIDGET_CATALOGUE: { name: WidgetName; title: string; topic: Topic; description: string; grades?: Grade[]; props?: Record<string, unknown> }[] = [
  { name: "data-sheet", title: "Data sheets", topic: "g12-momentum", grades: [10, 11, 12], description: "Constants, the physics and chemistry formula sheets, Table 4 and the periodic table." },
  // Mechanics
  { name: "motion-lab", title: "Motion lab", topic: "g10-motion", grades: [12], description: "A taxi on a road – position, velocity and acceleration graphs that draw themselves." },
  { name: "energy-lab", title: "Energy skate park", topic: "g10-energy", grades: [12], description: "Eₚ and Eₖ trade places; switch on friction and watch energy turn into heat." },
  { name: "vector-lab", title: "Vector lab", topic: "g11-vectors", description: "Drag force vectors: tail-to-head, resultants and components." },
  { name: "incline-lab", title: "Forces on a slope", topic: "g11-newton", grades: [12], description: "Free-body diagrams, friction, components of weight and Newton's second law." },
  { name: "gravity-lab", title: "Universal gravitation", topic: "g11-gravitation", description: "The inverse square law, and your weight above the Earth." },
  { name: "collision-lab", title: "Collision lab", topic: "g12-momentum", description: "Elastic, inelastic and sticky collisions and explosions – momentum is conserved." },
  { name: "projectile-lab", title: "Projectile lab", topic: "g12-projectile", description: "Throw a ball up or down, bounce it, flip the sign convention – live graphs." },
  { name: "energy-lab", title: "Work & energy with friction", topic: "g12-work-energy", description: "Non-conservative forces and the work-energy theorem.", props: { friction: true, title: "Work & energy with friction" } },
  // Waves, sound & light
  { name: "pulse-lab", title: "Superposition of pulses", topic: "g10-waves", description: "Constructive and destructive interference when pulses meet." },
  { name: "wave-lab", title: "Wave machine", topic: "g10-waves", description: "Transverse and longitudinal waves – amplitude, frequency, wavelength and v = fλ." },
  { name: "wave-lab", title: "Sound waves", topic: "g10-sound", description: "Compressions and rarefactions in a longitudinal wave.", props: { mode: "longitudinal", title: "Sound waves" } },
  { name: "em-spectrum", title: "EM spectrum explorer", topic: "g10-em", grades: [12], description: "Radio to gamma: wavelength, frequency, photon energy, uses and dangers." },
  { name: "refraction-lab", title: "Refraction & TIR", topic: "g11-optics", description: "Snell's law, critical angles and total internal reflection." },
  { name: "diffraction-lab", title: "Single-slit diffraction", topic: "g11-wavefronts", description: "Huygens' principle and how much waves spread through a slit." },
  { name: "doppler-lab", title: "Doppler effect", topic: "g12-doppler", description: "See – and hear – the pitch change as an ambulance passes." },
  // Electricity & magnetism
  { name: "charge-lab", title: "Charge sharing", topic: "g10-electrostatics", description: "Touch two charged spheres: conservation and quantisation of charge.", props: { mode: "share", title: "Charge sharing" } },
  { name: "magnet-lab", title: "Magnetic field lab", topic: "g10-magnetism", grades: [11], description: "Bar magnets, attraction and repulsion, a straight wire and a solenoid." },
  { name: "circuit-lab", title: "Circuit lab", topic: "g10-circuits", grades: [11], description: "Series and parallel resistors or bulbs, with ammeter and voltmeter readings." },
  { name: "charge-lab", title: "Coulomb's law & fields", topic: "g11-electrostatics", grades: [12], description: "Forces between point charges, field patterns and a draggable test charge." },
  { name: "generator-lab", title: "Faraday's law", topic: "g11-electromagnetism", description: "Push a magnet into a coil and watch the induced emf.", props: { mode: "faraday", title: "Faraday's law" } },
  { name: "circuit-lab", title: "Internal resistance", topic: "g12-circuits", description: "Emf, terminal potential difference and lost volts.", props: { internal: true, layout: "combo", title: "Internal resistance" } },
  { name: "generator-lab", title: "Generators & motors", topic: "g12-electrodynamics", description: "AC and DC generators, slip rings and commutators, and the DC motor." },
  { name: "photoelectric-lab", title: "Photoelectric effect", topic: "g12-photoelectric", description: "Frequency vs intensity, work function and threshold frequency." },
  { name: "photoelectric-lab", title: "Atomic spectra", topic: "g12-photoelectric", description: "Electron jumps in hydrogen: emission and absorption lines.", props: { mode: "spectra", title: "Atomic spectra" } },
  // Matter & materials
  { name: "particle-box", title: "States of matter", topic: "g10-states", description: "The kinetic molecular theory and the heating curve of water." },
  { name: "atom-builder", title: "Build an atom", topic: "g10-atom", description: "Protons, neutrons and electrons – isotopes, ions, shells and orbital boxes." },
  { name: "periodic-table", title: "Periodic table & trends", topic: "g10-periodic", grades: [11, 12], description: "Families, electronegativity, ionisation energy and atomic radius." },
  { name: "molecule-shapes", title: "Molecular shapes (VSEPR)", topic: "g11-molecules", description: "Turn 3D molecules: bonding and lone pairs, angles and polarity." },
  { name: "property-chart", title: "Intermolecular forces & boiling points", topic: "g11-imf", grades: [12], description: "Chain length, branching, functional groups and the water anomaly." },
  { name: "gas-lab", title: "Gas laws lab", topic: "g11-gases", description: "Boyle, Charles and the pressure law with a piston and moving particles." },
  { name: "organic-namer", title: "Organic molecule builder", topic: "g12-organic", description: "Build molecules and get their IUPAC names – or test yourself." },
  // Chemical change & systems
  {
    name: "sorter", title: "Physical or chemical change?", topic: "g10-change", description: "Sort everyday changes.",
    props: {
      id: "toolkit-change", title: "Physical or chemical change?", buckets: ["Physical change", "Chemical change"], colour: "var(--t-change)",
      items: [
        { text: "Ice melting", bucket: "Physical change" }, { text: "Wood burning", bucket: "Chemical change" }, { text: "Sugar dissolving in tea", bucket: "Physical change" },
        { text: "Iron rusting", bucket: "Chemical change" }, { text: "Boiling water", bucket: "Physical change" }, { text: "Baking a cake", bucket: "Chemical change" },
        { text: "Cutting paper", bucket: "Physical change" }, { text: "Milk going sour", bucket: "Chemical change" },
      ],
    },
  },
  { name: "equation-balancer", title: "Equation balancer", topic: "g10-change", grades: [11, 12], description: "Balance 22 real equations with a live atom count and see-saw." },
  { name: "mole-lab", title: "Mole calculator", topic: "g10-mole", grades: [11], description: "Molar mass of any formula, n = m/M, particles, concentration and gas volume." },
  { name: "energy-profile", title: "Energy profiles", topic: "g11-energy-change", grades: [12], description: "Exothermic vs endothermic, activation energy and catalysts." },
  { name: "rate-lab", title: "Collision theory", topic: "g12-rates", description: "Temperature, concentration and catalysts – plus the Maxwell-Boltzmann curve." },
  { name: "equilibrium-lab", title: "Le Chatelier's principle", topic: "g12-equilibrium", description: "Disturb N₂O₄ ⇌ 2NO₂ and watch it respond." },
  { name: "titration-lab", title: "Virtual titration", topic: "g12-acids", description: "Strong and weak acids, pH curves, equivalence points and indicators." },
  { name: "cell-lab", title: "Galvanic & electrolytic cells", topic: "g12-electrochem", description: "Build any two-metal cell and read its emf; purify copper." },
  { name: "drill", title: "Endless drill (everything)", topic: "g10-motion", grades: [10, 11, 12], description: "Randomly generated calculations from every topic, with full working." },
];

export const WIDGET_COUNT = new Set(WIDGET_CATALOGUE.map((w) => w.title)).size;
