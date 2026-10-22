import type { Grade, Paper, Strand, Topic } from "@/content/types";

/** Every knowledge area has ONE colour across the whole site (see docs/06-design-system.md). */
export const STRANDS: { strand: Strand; colour: string; emoji: string; slug: string; short: string; blurb: string }[] = [
  { strand: "Mechanics", colour: "var(--t-mech)", emoji: "🚀", slug: "mechanics", short: "Mechanics", blurb: "Motion, forces, Newton's laws, energy, momentum and projectiles – how and why things move." },
  { strand: "Waves, Sound & Light", colour: "var(--t-waves)", emoji: "🌊", slug: "waves", short: "Waves", blurb: "Pulses and waves, sound, light, the EM spectrum, refraction, diffraction and the Doppler effect." },
  { strand: "Electricity & Magnetism", colour: "var(--t-elec)", emoji: "⚡", slug: "electricity", short: "Electricity", blurb: "Charges and fields, magnets, circuits, Ohm's law, induction, motors and generators." },
  { strand: "Matter & Materials", colour: "var(--t-matter)", emoji: "⚛️", slug: "matter", short: "Matter", blurb: "Atoms, the periodic table, bonding, molecular shape, gases, organic molecules and the photoelectric effect." },
  { strand: "Chemical Change", colour: "var(--t-change)", emoji: "🧪", slug: "chemical-change", short: "Chem change", blurb: "Balancing equations, the mole, stoichiometry, energy changes, rates, equilibrium, acids & bases and electrochemistry." },
  { strand: "Chemical Systems", colour: "var(--t-systems)", emoji: "🌍", slug: "chemical-systems", short: "Chem systems", blurb: "The hydrosphere, the lithosphere and mining, and the fertiliser industry." },
];

export interface TopicMeta {
  topic: Topic;
  grade: Grade;
  strand: Strand;
  title: string;
  emoji: string;
  slug: string;
  blurb: string;
  colour: string;
  paper: Paper;
}

const T = (topic: Topic, grade: Grade, strand: Strand, paper: Paper, title: string, emoji: string, blurb: string): TopicMeta => {
  const s = STRANDS.find((x) => x.strand === strand)!;
  return { topic, grade, strand, title, emoji, slug: topic, blurb, colour: s.colour, paper };
};

/** All CAPS Grade 10, 11 & 12 Physical Sciences topics, in teaching order (Physics then Chemistry per grade). */
export const TOPICS: TopicMeta[] = [
  // ------------------------------------------------------------- Grade 10
  T("g10-motion", 10, "Mechanics", 1, "Motion in One Dimension", "🏃", "Vectors and scalars, position, displacement, speed, velocity, acceleration, motion graphs and the equations of motion."),
  T("g10-energy", 10, "Mechanics", 1, "Energy", "🎢", "Gravitational potential energy, kinetic energy and the conservation of mechanical energy."),
  T("g10-waves", 10, "Waves, Sound & Light", 1, "Pulses & Waves", "〰️", "Transverse pulses and superposition, transverse and longitudinal waves, and the wave equation v = fλ."),
  T("g10-sound", 10, "Waves, Sound & Light", 1, "Sound", "🔊", "Sound as a longitudinal wave: pitch, loudness, the speed of sound, echoes and ultrasound."),
  T("g10-em", 10, "Waves, Sound & Light", 1, "Electromagnetic Radiation", "🌈", "The EM spectrum, wave–particle duality, photons and E = hf."),
  T("g10-magnetism", 10, "Electricity & Magnetism", 1, "Magnetism", "🧲", "Magnetic fields, poles, field patterns and the Earth's magnetic field."),
  T("g10-electrostatics", 10, "Electricity & Magnetism", 1, "Electrostatics", "🎈", "Two kinds of charge, charging by friction, conservation and quantisation of charge, and polarisation."),
  T("g10-circuits", 10, "Electricity & Magnetism", 1, "Electric Circuits", "💡", "Emf, potential difference, current and resistance in series and parallel circuits."),
  T("g10-matter", 10, "Matter & Materials", 2, "Matter & Classification", "🧱", "Mixtures and pure substances, elements and compounds, names and formulae, and the properties of materials."),
  T("g10-states", 10, "Matter & Materials", 2, "States of Matter & the KMT", "🧊", "Solids, liquids and gases, the kinetic molecular theory, and heating and cooling curves."),
  T("g10-atom", 10, "Matter & Materials", 2, "The Atom", "⚛️", "Models of the atom, protons, neutrons and electrons, isotopes, relative atomic mass and electron configuration."),
  T("g10-periodic", 10, "Matter & Materials", 2, "The Periodic Table", "🗂️", "Groups and periods, and trends in atomic radius, ionisation energy, electron affinity and electronegativity."),
  T("g10-bonding", 10, "Matter & Materials", 2, "Chemical Bonding", "🔗", "Covalent, ionic and metallic bonding, Lewis diagrams, valency and writing formulae."),
  T("g10-change", 10, "Chemical Change", 2, "Physical & Chemical Change", "🔥", "Physical vs chemical change, conservation of mass, constant composition and balancing equations."),
  T("g10-reactions", 10, "Chemical Change", 2, "Reactions in Aqueous Solution", "💧", "Ions in solution, conductivity, precipitation, and the three types of reactions."),
  T("g10-mole", 10, "Chemical Change", 2, "The Mole", "⚖️", "The mole, molar mass, n = m/M, concentration, percentage composition and empirical formulae."),
  T("g10-hydrosphere", 10, "Chemical Systems", 2, "The Hydrosphere", "🌊", "The water cycle, water as a solvent, water quality and pollution in South Africa."),
  // ------------------------------------------------------------- Grade 11
  T("g11-vectors", 11, "Mechanics", 1, "Vectors in Two Dimensions", "🧭", "Resultants by tail-to-head and by calculation, components of vectors, and Pythagoras with trigonometry."),
  T("g11-newton", 11, "Mechanics", 1, "Newton's Laws", "🍎", "Forces and free-body diagrams, friction, inclined planes and Newton's first, second and third laws."),
  T("g11-gravitation", 11, "Mechanics", 1, "Universal Gravitation", "🪐", "Newton's law of universal gravitation, weight, and g on other planets."),
  T("g11-optics", 11, "Waves, Sound & Light", 1, "Geometrical Optics", "🔦", "Refraction, refractive index, Snell's law, critical angle and total internal reflection."),
  T("g11-wavefronts", 11, "Waves, Sound & Light", 1, "2D & 3D Wavefronts", "🌀", "Huygens' principle, diffraction through a single slit, and interference."),
  T("g11-electrostatics", 11, "Electricity & Magnetism", 1, "Coulomb's Law & Electric Fields", "⚡", "Coulomb's law, electric field patterns and the field strength E = F/q = kQ/r²."),
  T("g11-electromagnetism", 11, "Electricity & Magnetism", 1, "Electromagnetism", "🌀", "The magnetic field of a current, magnetic flux and Faraday's law of induction."),
  T("g11-circuits", 11, "Electricity & Magnetism", 1, "Ohm's Law, Power & Energy", "🔌", "Ohm's law, series-parallel networks, electrical power and the cost of electricity."),
  T("g11-molecules", 11, "Matter & Materials", 2, "Molecular Structure", "🧬", "Lewis diagrams, VSEPR shapes, electronegativity, bond polarity, bond energy and bond length."),
  T("g11-imf", 11, "Matter & Materials", 2, "Intermolecular Forces", "🤝", "Ion-dipole, dipole-dipole, hydrogen bonds and London forces, and how they control physical properties."),
  T("g11-gases", 11, "Matter & Materials", 2, "Ideal Gases", "🎈", "Boyle's, Charles' and the pressure–temperature laws, the general gas equation and pV = nRT."),
  T("g11-stoichiometry", 11, "Chemical Change", 2, "Stoichiometry", "🧮", "Molar gas volume, limiting reagents, percentage yield, purity and concentration calculations."),
  T("g11-energy-change", 11, "Chemical Change", 2, "Energy & Chemical Change", "🌡️", "Exothermic and endothermic reactions, ΔH, activation energy and energy profiles."),
  T("g11-reactions", 11, "Chemical Change", 2, "Acids, Bases & Redox", "🍋", "Arrhenius and Lowry-Brønsted acids and bases, neutralisation, oxidation numbers and redox reactions."),
  T("g11-lithosphere", 11, "Chemical Systems", 2, "The Lithosphere & Mining", "⛏️", "Earth's minerals, gold mining in South Africa, extraction of metals and the environmental impact."),
  // ------------------------------------------------------------- Grade 12
  T("g12-momentum", 12, "Mechanics", 1, "Momentum & Impulse", "🎱", "Momentum, Newton's second law in terms of momentum, impulse, conservation of momentum and collisions."),
  T("g12-projectile", 12, "Mechanics", 1, "Vertical Projectile Motion", "🏀", "Free fall, objects thrown up and down, and position, velocity and acceleration graphs."),
  T("g12-work-energy", 12, "Mechanics", 1, "Work, Energy & Power", "🏋️", "Work, the work-energy theorem, conservative and non-conservative forces, and power."),
  T("g12-doppler", 12, "Waves, Sound & Light", 1, "The Doppler Effect", "🚑", "The Doppler effect for sound, its uses in medicine, and the red shift of light from galaxies."),
  T("g12-circuits", 12, "Electricity & Magnetism", 1, "Circuits & Internal Resistance", "🔋", "Emf and internal resistance, terminal potential difference and series-parallel networks."),
  T("g12-electrodynamics", 12, "Electricity & Magnetism", 1, "Electrodynamics", "⚙️", "Electric motors, generators, alternating current and rms values."),
  T("g12-photoelectric", 12, "Matter & Materials", 1, "Optical Phenomena", "☀️", "The photoelectric effect, work function, threshold frequency, and emission and absorption spectra."),
  T("g12-organic", 12, "Matter & Materials", 2, "Organic Molecules", "🛢️", "Functional groups, IUPAC naming, isomers, physical properties, organic reactions and plastics."),
  T("g12-rates", 12, "Chemical Change", 2, "Rates of Reaction", "⏱️", "Reaction rate, the factors that affect it, collision theory, catalysts and the Maxwell-Boltzmann curve."),
  T("g12-equilibrium", 12, "Chemical Change", 2, "Chemical Equilibrium", "⚖️", "Dynamic equilibrium, Kc, Le Chatelier's principle and equilibrium graphs."),
  T("g12-acids", 12, "Chemical Change", 2, "Acids & Bases", "🧫", "Strong and weak acids, Ka and Kb, pH and Kw, hydrolysis of salts and titrations."),
  T("g12-electrochem", 12, "Chemical Change", 2, "Electrochemical Reactions", "🔋", "Galvanic and electrolytic cells, standard electrode potentials, cell emf and industrial electrolysis."),
  T("g12-fertilisers", 12, "Chemical Systems", 2, "The Fertiliser Industry", "🌾", "NPK, the Haber process, the Ostwald process, the contact process and the impact of fertilisers."),
];

export function topicMeta(t: Topic): TopicMeta {
  return TOPICS.find((x) => x.topic === t)!;
}

export function strandMeta(s: Strand) {
  return STRANDS.find((x) => x.strand === s)!;
}

export function paperLabel(p: Paper) {
  return p === 1 ? "Paper 1 · Physics" : "Paper 2 · Chemistry";
}

/** Short label used on chips, e.g. "Gr 11 · Newton's Laws". */
export function topicLabel(t: Topic) {
  const m = topicMeta(t);
  return `Gr ${m.grade} · ${m.title}`;
}

/**
 * Approximate final-exam mark allocation per paper (DBE examination
 * guidelines; figures are approximate and change from year to year).
 */
export const PAPER_INFO: Record<Grade, Record<Paper, { title: string; duration: string; marks: number; sections: { name: string; marks: number }[] }>> = {
  10: {
    1: {
      title: "Paper 1 – Physics",
      duration: "2 hours",
      marks: 150,
      sections: [
        { name: "Mechanics", marks: 75 },
        { name: "Waves, sound & light", marks: 40 },
        { name: "Electricity & magnetism", marks: 35 },
      ],
    },
    2: {
      title: "Paper 2 – Chemistry",
      duration: "2 hours",
      marks: 150,
      sections: [
        { name: "Matter & materials", marks: 75 },
        { name: "Chemical change", marks: 60 },
        { name: "Chemical systems", marks: 15 },
      ],
    },
  },
  11: {
    1: {
      title: "Paper 1 – Physics",
      duration: "3 hours",
      marks: 150,
      sections: [
        { name: "Mechanics", marks: 68 },
        { name: "Waves, sound & light", marks: 32 },
        { name: "Electricity & magnetism", marks: 50 },
      ],
    },
    2: {
      title: "Paper 2 – Chemistry",
      duration: "3 hours",
      marks: 150,
      sections: [
        { name: "Matter & materials", marks: 58 },
        { name: "Chemical change", marks: 80 },
        { name: "Chemical systems", marks: 12 },
      ],
    },
  },
  12: {
    1: {
      title: "Paper 1 – Physics",
      duration: "3 hours",
      marks: 150,
      sections: [
        { name: "Mechanics (incl. Newton's laws)", marks: 63 },
        { name: "Waves, sound & light", marks: 17 },
        { name: "Electricity & magnetism", marks: 55 },
        { name: "Matter & materials (photoelectric effect)", marks: 15 },
      ],
    },
    2: {
      title: "Paper 2 – Chemistry",
      duration: "3 hours",
      marks: 150,
      sections: [
        { name: "Matter & materials (organic chemistry)", marks: 42 },
        { name: "Chemical change", marks: 90 },
        { name: "Chemical systems (fertilisers)", marks: 18 },
      ],
    },
  },
};
