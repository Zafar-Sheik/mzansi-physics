/**
 * More Exam Room questions, so that each full mock comes close to a 150-mark
 * NSC paper. Same rules as exam.ts: one memo line per mark, g = 9,8 m·s⁻².
 */
import type { ExamQuestion } from "./types";

const m = String.raw;

export const EXAM_EXTRA: ExamQuestion[] = [
  // ======================================================== Grade 10 · Physics
  {
    id: "g10-motion-graph",
    topic: "g10-motion",
    title: "Reading a velocity-time graph",
    source: m`A cyclist's velocity increases uniformly from $2\ \text{m·s}^{-1}$ to $8\ \text{m·s}^{-1}$ in $4\ \text{s}$, then decreases uniformly to rest in a further $2\ \text{s}$. East is positive.`,
    figure: { widget: "motion-lab" },
    parts: [
      { q: "Distinguish between distance and displacement.", marks: 2, level: "recall", memo: ["Distance is the total length of the path travelled (scalar)", "Displacement is the change in position, with a direction (vector)"] },
      { q: "Calculate the acceleration in the first 4 s.", marks: 3, level: "comprehension", memo: [m`$a = \frac{\Delta v}{\Delta t}$`, m`$a = \frac{8 - 2}{4}$`, m`$a = 1{,}5\ \text{m·s}^{-2}$ east`] },
      { q: "Use the graph to calculate the total displacement in 6 s.", marks: 4, level: "analysis", memo: ["Displacement = area under the v-t graph", m`First 4 s: $\tfrac12(2 + 8)(4) = 20\ \text{m}$`, m`Last 2 s: $\tfrac12(8)(2) = 8\ \text{m}$`, m`Total $= 28\ \text{m}$ east`] },
      { q: "Describe the shape of the position-time graph for the first 4 s.", marks: 2, level: "comprehension", memo: ["A curve (parabola) with an increasing gradient", "because the velocity is increasing"] },
    ],
  },
  {
    id: "g10-motion-braking",
    topic: "g10-motion",
    title: "Stopping distance",
    source: m`A car travels at $20\ \text{m·s}^{-1}$. The driver sees a dog in the road and brakes, decelerating uniformly at $5\ \text{m·s}^{-2}$. The driver's reaction time is $0{,}5\ \text{s}$.`,
    parts: [
      { q: "Calculate the distance travelled during the reaction time.", marks: 2, level: "comprehension", memo: [m`$\Delta x = v\Delta t = (20)(0{,}5)$`, m`$\Delta x = 10\ \text{m}$`] },
      { q: "Calculate the braking distance.", marks: 3, level: "comprehension", memo: [m`$v_f^2 = v_i^2 + 2a\Delta x$`, m`$0 = 20^2 + 2(-5)\Delta x$`, m`$\Delta x = 40\ \text{m}$`] },
      { q: "Explain why driving after drinking alcohol increases the stopping distance.", marks: 2, level: "evaluation", memo: ["Alcohol increases the reaction time", "so the car travels further before the brakes are applied"] },
    ],
  },
  {
    id: "g10-energy-pendulum",
    topic: "g10-energy",
    title: "A swinging pendulum",
    source: m`A $0{,}5\ \text{kg}$ pendulum bob is released from rest $0{,}2\ \text{m}$ above its lowest point. Ignore air resistance.`,
    parts: [
      { q: "Define kinetic energy.", marks: 2, level: "recall", memo: ["The energy an object has", "because of its motion"] },
      { q: "Calculate the maximum speed of the bob.", marks: 4, level: "analysis", memo: [m`$mgh = \tfrac12 mv^2$`, m`$(0{,}5)(9{,}8)(0{,}2) = \tfrac12(0{,}5)v^2$`, m`$v^2 = 3{,}92$`, m`$v = 1{,}98\ \text{m·s}^{-1}$`] },
      { q: "In reality the bob slowly stops swinging. Is mechanical energy conserved? Explain.", marks: 2, level: "evaluation", memo: ["No", "Air resistance (friction) converts mechanical energy to heat and sound"] },
    ],
  },
  {
    id: "g10-waves-superposition",
    topic: "g10-waves",
    title: "Pulses meeting",
    source: "Two pulses travel towards each other on a slinky spring. Pulse A has an amplitude of 3 cm and pulse B an amplitude of 2 cm.",
    figure: { widget: "pulse-lab" },
    parts: [
      { q: "State the principle of superposition.", marks: 2, level: "recall", memo: ["The resultant displacement at a point is", "the algebraic sum of the displacements of the individual pulses"] },
      { q: "Calculate the amplitude of the resultant pulse if (a) both pulses are crests (b) A is a crest and B a trough.", marks: 2, level: "comprehension", memo: ["(a) 5 cm (constructive interference)", "(b) 1 cm (destructive interference)"] },
      { q: "Define a longitudinal wave and give ONE example.", marks: 3, level: "recall", memo: ["A wave in which the particles of the medium vibrate", "parallel to the direction of motion of the wave", "e.g. sound"] },
    ],
  },
  {
    id: "g10-sound-sonar",
    topic: "g10-sound",
    title: "Sonar on a fishing boat",
    source: m`A fishing boat off Hout Bay sends an ultrasound pulse down to a shoal of fish. The echo returns after $0{,}2\ \text{s}$. Speed of sound in sea water $= 1\,500\ \text{m·s}^{-1}$.`,
    parts: [
      { q: "Calculate the depth of the shoal.", marks: 3, level: "comprehension", memo: [m`$\Delta x = v\Delta t = (1\,500)(0{,}2) = 300\ \text{m}$ (there and back)`, "Divide by 2", m`Depth $= 150\ \text{m}$`] },
      { q: "Why does sound travel faster in water than in air?", marks: 2, level: "comprehension", memo: ["Particles in water are closer together", "so vibrations are passed on more quickly"] },
      { q: "Which property of a sound wave determines its loudness?", marks: 1, level: "recall", memo: ["Amplitude"] },
    ],
  },
  {
    id: "g10-em-spectrum",
    topic: "g10-em",
    title: "The electromagnetic spectrum",
    figure: { widget: "em-spectrum" },
    parts: [
      { q: "Arrange in order of increasing frequency: visible light, radio waves, X-rays, microwaves.", marks: 2, level: "comprehension", memo: ["Radio waves, microwaves", "visible light, X-rays"] },
      { q: "State TWO properties shared by all electromagnetic waves.", marks: 2, level: "recall", memo: ["They travel at the speed of light (3 × 10⁸ m·s⁻¹) in a vacuum", "They do not need a medium / are transverse"] },
      { q: m`A cellphone signal has a frequency of $900\ \text{MHz}$. Calculate its wavelength.`, marks: 3, level: "comprehension", memo: [m`$c = f\lambda$`, m`$3 \times 10^8 = (900 \times 10^6)\lambda$`, m`$\lambda = 0{,}33\ \text{m}$`] },
    ],
  },
  {
    id: "g10-circuits-meters",
    topic: "g10-circuits",
    title: "Meters and charge",
    source: m`A current of $0{,}5\ \text{A}$ flows through a torch bulb for $2$ minutes. The potential difference across the bulb is $3\ \text{V}$.`,
    parts: [
      { q: "Define electric current.", marks: 2, level: "recall", memo: ["The rate of flow of charge", m`($I = \frac{Q}{\Delta t}$)`] },
      { q: "Calculate the charge that flows through the bulb.", marks: 3, level: "comprehension", memo: [m`$Q = I\Delta t$`, m`$Q = (0{,}5)(120)$`, m`$Q = 60\ \text{C}$`] },
      { q: "Calculate the energy transferred by the bulb.", marks: 3, level: "comprehension", memo: [m`$W = VQ$`, m`$W = (3)(60)$`, m`$W = 180\ \text{J}$`] },
      { q: "How should an ammeter and a voltmeter be connected in a circuit?", marks: 2, level: "recall", memo: ["Ammeter in series", "Voltmeter in parallel"] },
    ],
  },
  {
    id: "g10-electrostatics-rubbing",
    topic: "g10-electrostatics",
    title: "Charging by friction",
    source: m`A plastic ruler is rubbed with a cloth and gains a charge of $-4 \times 10^{-9}\ \text{C}$.`,
    parts: [
      { q: "Did the ruler gain or lose electrons? How many?", marks: 3, level: "comprehension", memo: ["Gained electrons", m`$n = \frac{Q}{e} = \frac{4 \times 10^{-9}}{1{,}6 \times 10^{-19}}$`, m`$n = 2{,}5 \times 10^{10}$`] },
      { q: "The ruler attracts small pieces of uncharged paper. Explain.", marks: 2, level: "analysis", memo: ["The ruler induces a positive charge on the near side of the paper (polarisation)", "Opposite charges attract more strongly because they are closer"] },
    ],
  },
  // ======================================================== Grade 10 · Chemistry
  {
    id: "g10-matter-names",
    topic: "g10-matter",
    title: "Names and formulae",
    parts: [
      { q: "Write the chemical formula of (a) sodium sulfate (b) calcium hydroxide (c) ammonium chloride.", marks: 3, level: "comprehension", memo: [m`(a) $\mathrm{Na_2SO_4}$`, m`(b) $\mathrm{Ca(OH)_2}$`, m`(c) $\mathrm{NH_4Cl}$`] },
      { q: m`Name the compounds: (a) $\mathrm{KNO_3}$ (b) $\mathrm{CO}$`, marks: 2, level: "comprehension", memo: ["(a) potassium nitrate", "(b) carbon monoxide"] },
      { q: "Name TWO properties of metals and give a use linked to each.", marks: 2, level: "comprehension", memo: ["e.g. good conductor of electricity → electrical wiring", "e.g. malleable / ductile → sheets, wires"] },
    ],
  },
  {
    id: "g10-states-kmt",
    topic: "g10-states",
    title: "The kinetic molecular theory",
    figure: { widget: "particle-box" },
    parts: [
      { q: "State TWO assumptions of the kinetic molecular theory.", marks: 2, level: "recall", memo: ["Matter is made of particles in constant motion", "There are spaces and forces of attraction between particles"] },
      { q: "Explain, in terms of particles, why a gas fills its container.", marks: 2, level: "comprehension", memo: ["Gas particles move freely and randomly at high speed", "the forces between them are very weak"] },
      { q: "Define the boiling point.", marks: 2, level: "recall", memo: ["The temperature at which a liquid changes into a gas", "(the vapour pressure equals the atmospheric pressure)"] },
    ],
  },
  {
    id: "g10-atom-models",
    topic: "g10-atom",
    title: "Models of the atom",
    parts: [
      { q: "What did Rutherford's gold-foil experiment show about the atom?", marks: 2, level: "comprehension", memo: ["Most of the atom is empty space", "The positive charge and most of the mass are in a tiny nucleus"] },
      { q: "Describe Bohr's contribution to the atomic model.", marks: 2, level: "recall", memo: ["Electrons move in fixed energy levels (orbits) around the nucleus", "They absorb or emit energy when moving between levels"] },
      { q: "Define the mass number of an atom.", marks: 2, level: "recall", memo: ["The total number of protons and neutrons", "in the nucleus"] },
    ],
  },
  {
    id: "g10-periodic-groups",
    topic: "g10-periodic",
    title: "Groups of the periodic table",
    parts: [
      { q: "Why do elements in the same group have similar chemical properties?", marks: 1, level: "comprehension", memo: ["They have the same number of valence electrons"] },
      { q: "Write a balanced equation for the reaction of sodium with water.", marks: 3, level: "comprehension", memo: ["Reactants correct", m`$\mathrm{2Na + 2H_2O \rightarrow 2NaOH + H_2}$`, "Balanced"] },
      { q: "Explain why the noble gases are unreactive.", marks: 2, level: "comprehension", memo: ["They have a full outer energy level", "so they do not easily gain, lose or share electrons"] },
      { q: "Define electronegativity and state its trend across a period.", marks: 3, level: "recall", memo: ["A measure of the tendency of an atom in a molecule", "to attract bonding electrons", "It increases from left to right across a period"] },
    ],
  },
  {
    id: "g10-bonding-metallic",
    topic: "g10-bonding",
    title: "Metallic and ionic bonding",
    parts: [
      { q: "Describe metallic bonding.", marks: 2, level: "recall", memo: ["A lattice of positive metal ions", "in a sea of delocalised electrons"] },
      { q: "Explain why solid sodium chloride does not conduct electricity, but molten sodium chloride does.", marks: 2, level: "analysis", memo: ["In the solid the ions are fixed in a lattice", "When molten the ions are free to move and carry charge"] },
      { q: "Draw the Lewis diagram for sodium chloride (show the ions).", marks: 2, level: "comprehension", memo: [m`$\mathrm{Na^+}$ with no dots`, m`$\mathrm{[Cl]^-}$ with 8 dots and a negative charge`] },
    ],
  },
  {
    id: "g10-change-mass",
    topic: "g10-change",
    title: "Mass and chemical change",
    source: m`Learners burn $2{,}4\ \text{g}$ of magnesium ribbon in a crucible to form $4{,}0\ \text{g}$ of magnesium oxide.`,
    parts: [
      { q: "Calculate the mass of oxygen that reacted.", marks: 2, level: "comprehension", memo: [m`$m(\mathrm{O_2}) = 4{,}0 - 2{,}4$`, m`$= 1{,}6\ \text{g}$`] },
      { q: "State the law of constant composition.", marks: 2, level: "recall", memo: ["A pure compound always consists of the same elements", "combined in the same proportion by mass"] },
      { q: "Write a balanced equation for the reaction.", marks: 2, level: "comprehension", memo: [m`$\mathrm{2Mg + O_2}$`, m`$\mathrm{\rightarrow 2MgO}$`] },
    ],
  },
  {
    id: "g10-reactions-conductivity",
    topic: "g10-reactions",
    title: "Electrolytes and conductivity",
    parts: [
      { q: "Define an electrolyte.", marks: 2, level: "recall", memo: ["A substance that dissolves in water to form ions", "so the solution conducts electricity"] },
      { q: "Write an equation for the dissociation of calcium chloride in water.", marks: 3, level: "comprehension", memo: [m`$\mathrm{CaCl_2(s)}$`, m`$\mathrm{\rightarrow Ca^{2+}(aq) + 2Cl^-(aq)}$`, "Phases and balancing correct"] },
      { q: "Name the type of reaction and the products when HCl reacts with NaOH.", marks: 3, level: "comprehension", memo: ["Acid-base (neutralisation) reaction", "Sodium chloride", "and water"] },
    ],
  },
  {
    id: "g10-mole-empirical",
    topic: "g10-mole",
    title: "Empirical formula and concentration",
    parts: [
      { q: "A compound contains 40 % C, 6,7 % H and 53,3 % O by mass. Determine its empirical formula.", marks: 4, level: "analysis", memo: [m`$n(\mathrm{C}) = \frac{40}{12} = 3{,}33$; $n(\mathrm{H}) = \frac{6{,}7}{1} = 6{,}7$; $n(\mathrm{O}) = \frac{53{,}3}{16} = 3{,}33$`, "Divide by the smallest", "Ratio 1 : 2 : 1", m`$\mathrm{CH_2O}$`] },
      { q: m`Calculate the concentration of a solution with $5{,}85\ \text{g}$ NaCl in $250\ \text{cm}^3$ of solution.`, marks: 4, level: "comprehension", memo: [m`$n = \frac{5{,}85}{58{,}5} = 0{,}1\ \text{mol}$`, m`$V = 0{,}25\ \text{dm}^3$`, m`$c = \frac{n}{V} = \frac{0{,}1}{0{,}25}$`, m`$c = 0{,}4\ \text{mol·dm}^{-3}$`] },
    ],
  },
  {
    id: "g10-hydrosphere-quality",
    topic: "g10-hydrosphere",
    title: "Testing water quality",
    parts: [
      { q: "Name TWO properties that can be measured to test water quality.", marks: 2, level: "recall", memo: ["e.g. pH", "e.g. conductivity / dissolved oxygen / turbidity"] },
      { q: "Why does water from a polluted river have a high conductivity?", marks: 2, level: "comprehension", memo: ["It contains many dissolved salts", "whose ions conduct electricity"] },
      { q: "Describe the water cycle in ONE sentence that includes TWO phase changes.", marks: 2, level: "comprehension", memo: ["Water evaporates from oceans and rivers", "and condenses to form clouds, before falling as rain"] },
    ],
  },
  // ======================================================== Grade 11 · Physics
  {
    id: "g11-vectors-components",
    topic: "g11-vectors",
    title: "Resolving a force",
    source: m`A learner pulls a suitcase with a force of $80\ \text{N}$ at $35°$ above the horizontal.`,
    figure: { widget: "vector-lab" },
    parts: [
      { q: "Calculate the horizontal and vertical components of the force.", marks: 4, level: "comprehension", memo: [m`$F_x = F\cos 35°$`, m`$F_x = 65{,}53\ \text{N}$`, m`$F_y = F\sin 35°$`, m`$F_y = 45{,}89\ \text{N}$`] },
      { q: "Explain why pulling at an angle makes the suitcase easier to drag.", marks: 2, level: "evaluation", memo: ["The vertical component reduces the normal force", "so the friction force is smaller"] },
    ],
  },
  {
    id: "g11-newton-connected",
    topic: "g11-newton",
    title: "Connected blocks",
    source: m`A $3\ \text{kg}$ block on a horizontal table is connected by a light string over a frictionless pulley to a hanging $2\ \text{kg}$ block. The coefficient of kinetic friction between the 3 kg block and the table is $0{,}2$.`,
    parts: [
      { q: "Calculate the frictional force on the 3 kg block.", marks: 3, level: "comprehension", memo: [m`$f_k = \mu_k N$`, m`$f_k = (0{,}2)(3)(9{,}8)$`, m`$f_k = 5{,}88\ \text{N}$`] },
      { q: "Calculate the acceleration of the system.", marks: 5, level: "analysis", memo: [m`For the 2 kg block: $(2)(9{,}8) - T = 2a$`, m`For the 3 kg block: $T - 5{,}88 = 3a$`, "Add the equations", m`$19{,}6 - 5{,}88 = 5a$`, m`$a = 2{,}74\ \text{m·s}^{-2}$`] },
      { q: "Calculate the tension in the string.", marks: 2, level: "analysis", memo: [m`$T = 3(2{,}74) + 5{,}88$`, m`$T = 14{,}10\ \text{N}$`] },
    ],
  },
  {
    id: "g11-gravitation-weight",
    topic: "g11-gravitation",
    title: "Weight on another planet",
    source: m`A planet has twice the mass of the Earth and twice its radius.`,
    parts: [
      { q: "Define weight.", marks: 2, level: "recall", memo: ["The gravitational force", "that the Earth (a planet) exerts on an object"] },
      { q: m`Calculate the gravitational acceleration on this planet, in terms of $g$ on Earth.`, marks: 3, level: "analysis", memo: [m`$g = \frac{GM}{r^2}$`, m`$g_P = \frac{G(2M)}{(2r)^2} = \frac{2}{4}\frac{GM}{r^2}$`, m`$g_P = \tfrac12 g = 4{,}9\ \text{m·s}^{-2}$`] },
      { q: "Calculate the weight of an 80 kg astronaut on this planet.", marks: 2, level: "comprehension", memo: [m`$w = mg_P = (80)(4{,}9)$`, m`$w = 392\ \text{N}$`] },
    ],
  },
  {
    id: "g11-optics-refraction",
    topic: "g11-optics",
    title: "Refraction at a water surface",
    source: m`Light passes from air ($n = 1$) into water ($n = 1{,}33$) at an angle of incidence of $40°$.`,
    parts: [
      { q: "Define the refractive index.", marks: 2, level: "recall", memo: ["The ratio of the speed of light in a vacuum", "to the speed of light in the medium"] },
      { q: "Calculate the angle of refraction.", marks: 3, level: "comprehension", memo: [m`$n_1\sin\theta_1 = n_2\sin\theta_2$`, m`$(1)\sin 40° = 1{,}33\sin\theta_2$`, m`$\theta_2 = 28{,}9°$`] },
      { q: "Calculate the speed of light in water.", marks: 2, level: "comprehension", memo: [m`$v = \frac{c}{n} = \frac{3 \times 10^8}{1{,}33}$`, m`$v = 2{,}26 \times 10^8\ \text{m·s}^{-1}$`] },
      { q: "Give ONE use of total internal reflection.", marks: 1, level: "recall", memo: ["Optical fibres (internet cables / endoscopes)"] },
    ],
  },
  {
    id: "g11-wavefronts-colour",
    topic: "g11-wavefronts",
    title: "Diffraction and colour",
    parts: [
      { q: "Red light and blue light pass through the same narrow slit. Which spreads more? Explain.", marks: 3, level: "analysis", memo: ["Red light", "Red light has a longer wavelength", m`and diffraction $\propto \frac{\lambda}{w}$`] },
      { q: "Explain why you can hear someone around a corner, but not see them.", marks: 2, level: "evaluation", memo: ["Sound has a wavelength similar to the doorway, so it diffracts a lot", "Light has a tiny wavelength, so it diffracts very little"] },
    ],
  },
  {
    id: "g11-electromagnetism-rule",
    topic: "g11-electromagnetism",
    title: "Magnetic field of a current",
    parts: [
      { q: "Describe the magnetic field around a straight wire carrying a current.", marks: 2, level: "comprehension", memo: ["Concentric circles around the wire", "The direction is given by the right-hand rule"] },
      { q: "Name TWO ways to make an electromagnet stronger.", marks: 2, level: "comprehension", memo: ["Increase the current / number of turns", "Use a soft-iron core"] },
      { q: "Give ONE everyday use of electromagnetic induction.", marks: 1, level: "recall", memo: ["e.g. generators / transformers / induction stoves / card readers"] },
    ],
  },
  {
    id: "g11-circuits-parallel",
    topic: "g11-circuits",
    title: "Lamps in parallel",
    source: m`Two identical $6\ \Omega$ lamps are connected in parallel to a $12\ \text{V}$ battery with negligible internal resistance.`,
    parts: [
      { q: "Calculate the total current from the battery.", marks: 4, level: "comprehension", memo: [m`$\frac{1}{R_p} = \frac16 + \frac16$`, m`$R_p = 3\ \Omega$`, m`$I = \frac{V}{R} = \frac{12}{3}$`, m`$I = 4\ \text{A}$`] },
      { q: "Calculate the power of each lamp.", marks: 3, level: "comprehension", memo: [m`$P = \frac{V^2}{R}$`, m`$P = \frac{12^2}{6}$`, m`$P = 24\ \text{W}$`] },
      { q: "One lamp blows. What happens to the brightness of the other lamp? Explain.", marks: 2, level: "evaluation", memo: ["It stays the same", "The potential difference across it is still 12 V"] },
    ],
  },
  // ======================================================== Grade 11 · Chemistry
  {
    id: "g11-molecules-bonds",
    topic: "g11-molecules",
    title: "Bond energy and bond length",
    parts: [
      { q: "Define bond energy.", marks: 2, level: "recall", memo: ["The energy needed to break one mole of its molecules", "into separate atoms"] },
      { q: "Explain why a C=C bond is shorter and stronger than a C–C bond.", marks: 2, level: "analysis", memo: ["More electron pairs are shared", "so the atoms are pulled closer and held more strongly"] },
      { q: m`Calculate the electronegativity difference in an H–Cl bond (H 2,1; Cl 3,0) and classify the bond.`, marks: 3, level: "comprehension", memo: [m`$\Delta\text{EN} = 3{,}0 - 2{,}1$`, m`$= 0{,}9$`, "Polar covalent"] },
      { q: m`Draw the Lewis diagram of $\mathrm{NH_3}$ and name the type of bond formed when it reacts with $\mathrm{H^+}$.`, marks: 2, level: "comprehension", memo: ["N with three bonding pairs to H and one lone pair", "Dative covalent (coordinate) bond"] },
    ],
  },
  {
    id: "g11-imf-solubility",
    topic: "g11-imf",
    title: "Solubility and intermolecular forces",
    figure: { widget: "property-chart", props: { set: "alcohols" } },
    parts: [
      { q: "Explain why ethanol dissolves in water, but oil does not.", marks: 3, level: "analysis", memo: ["Ethanol forms hydrogen bonds with water", "Oil is non-polar, with only London forces", "'Like dissolves like'"] },
      { q: "Name the type of intermolecular force between iodine molecules.", marks: 1, level: "recall", memo: ["London (dispersion) forces"] },
      { q: "Explain why the boiling points of the alkanes increase with chain length.", marks: 3, level: "analysis", memo: ["Longer chains have a larger surface area", "so the London forces are stronger", "more energy is needed to overcome them"] },
    ],
  },
  {
    id: "g11-gases-moles",
    topic: "g11-gases",
    title: "The ideal gas equation",
    source: m`A $5\ \text{dm}^3$ cylinder contains oxygen gas at $150\ \text{kPa}$ and $27\ °\text{C}$.`,
    parts: [
      { q: "State Boyle's law.", marks: 2, level: "recall", memo: ["The pressure of a fixed mass of gas is inversely proportional to its volume", "at constant temperature"] },
      { q: "Calculate the number of moles of oxygen.", marks: 5, level: "analysis", memo: [m`$pV = nRT$`, m`$p = 1{,}5 \times 10^5\ \text{Pa}$; $V = 5 \times 10^{-3}\ \text{m}^3$; $T = 300\ \text{K}$`, m`$(1{,}5 \times 10^5)(5 \times 10^{-3}) = n(8{,}31)(300)$`, m`$750 = 2\,493n$`, m`$n = 0{,}30\ \text{mol}$`] },
      { q: "Calculate the mass of the oxygen.", marks: 2, level: "comprehension", memo: [m`$m = nM = (0{,}30)(32)$`, m`$m = 9{,}63\ \text{g}$`] },
    ],
  },
  {
    id: "g11-stoichiometry-yield",
    topic: "g11-stoichiometry",
    title: "Percentage yield",
    source: m`$50\ \text{g}$ of limestone ($\mathrm{CaCO_3}$) is heated: $\mathrm{CaCO_3 \rightarrow CaO + CO_2}$. $25\ \text{g}$ of CaO is obtained.`,
    parts: [
      { q: "Calculate the theoretical mass of CaO.", marks: 4, level: "comprehension", memo: [m`$n(\mathrm{CaCO_3}) = \frac{50}{100} = 0{,}5\ \text{mol}$`, "Mole ratio 1 : 1", m`$n(\mathrm{CaO}) = 0{,}5\ \text{mol}$`, m`$m = (0{,}5)(56) = 28\ \text{g}$`] },
      { q: "Calculate the percentage yield.", marks: 2, level: "comprehension", memo: [m`$\% = \frac{25}{28} \times 100$`, m`$= 89{,}29\%$`] },
      { q: "Give ONE reason why the actual yield is less than the theoretical yield.", marks: 1, level: "evaluation", memo: ["e.g. the limestone is impure / the reaction is incomplete / product is lost"] },
    ],
  },
  {
    id: "g11-energy-change-bonds",
    topic: "g11-energy-change",
    title: "Bond breaking and forming",
    parts: [
      { q: "Is bond breaking endothermic or exothermic? Explain.", marks: 2, level: "comprehension", memo: ["Endothermic", "Energy must be absorbed to overcome the attraction between atoms"] },
      { q: "Define heat of reaction (ΔH).", marks: 2, level: "recall", memo: ["The energy absorbed or released", "in a chemical reaction"] },
      { q: "Give ONE example each of an exothermic and an endothermic process in everyday life.", marks: 2, level: "comprehension", memo: ["Exothermic: e.g. burning paraffin / respiration", "Endothermic: e.g. photosynthesis / cold packs / melting ice"] },
    ],
  },
  {
    id: "g11-reactions-balance-redox",
    topic: "g11-reactions",
    title: "Balancing a redox reaction",
    source: m`Acidified potassium dichromate ($\mathrm{Cr_2O_7^{2-}}$) oxidises iron(II) ions to iron(III) ions and is reduced to $\mathrm{Cr^{3+}}$.`,
    parts: [
      { q: "Define reduction in terms of electron transfer.", marks: 2, level: "recall", memo: ["The gain", "of electrons"] },
      { q: "Write the reduction half-reaction.", marks: 2, level: "analysis", memo: [m`$\mathrm{Cr_2O_7^{2-} + 14H^+ + 6e^-}$`, m`$\mathrm{\rightarrow 2Cr^{3+} + 7H_2O}$`] },
      { q: "Write the balanced overall ionic equation.", marks: 3, level: "analysis", memo: [m`Oxidation: $\mathrm{Fe^{2+} \rightarrow Fe^{3+} + e^-}$ (×6)`, m`$\mathrm{Cr_2O_7^{2-} + 14H^+ + 6Fe^{2+}}$`, m`$\mathrm{\rightarrow 2Cr^{3+} + 6Fe^{3+} + 7H_2O}$`] },
    ],
  },
  {
    id: "g11-reactions-amphiprotic",
    topic: "g11-reactions",
    title: "Amphiprotic substances",
    parts: [
      { q: "Define an amphiprotic (amphoteric) substance and give an example.", marks: 3, level: "recall", memo: ["A substance that can act as an acid or a base", "(donate or accept protons)", m`e.g. $\mathrm{H_2O}$ or $\mathrm{HCO_3^-}$`] },
      { q: m`Write the formula of the conjugate base of $\mathrm{H_2SO_4}$.`, marks: 1, level: "comprehension", memo: [m`$\mathrm{HSO_4^-}$`] },
      { q: "Write a balanced equation for the reaction of hydrochloric acid with sodium carbonate.", marks: 3, level: "comprehension", memo: [m`$\mathrm{2HCl + Na_2CO_3}$`, m`$\mathrm{\rightarrow 2NaCl + H_2O + CO_2}$`, "Balanced"] },
    ],
  },
  {
    id: "g11-lithosphere-iron",
    topic: "g11-lithosphere",
    title: "Extracting iron",
    source: "Iron is extracted from haematite (Fe₂O₃) in a blast furnace using coke (carbon).",
    parts: [
      { q: "Write a balanced equation for the reduction of haematite by carbon monoxide.", marks: 3, level: "comprehension", memo: [m`$\mathrm{Fe_2O_3 + 3CO}$`, m`$\mathrm{\rightarrow 2Fe + 3CO_2}$`, "Balanced"] },
      { q: "What is the role of limestone in the blast furnace?", marks: 2, level: "comprehension", memo: ["It removes impurities (silica)", "forming slag"] },
      { q: "Calculate the percentage of iron in haematite.", marks: 2, level: "comprehension", memo: [m`$\%\mathrm{Fe} = \frac{2(56)}{160} \times 100$`, m`$= 70\%$`] },
    ],
  },
  {
    id: "g11-gases-kmt",
    topic: "g11-gases",
    title: "Ideal versus real gases",
    parts: [
      { q: "State TWO assumptions of the kinetic theory for an ideal gas.", marks: 2, level: "recall", memo: ["Gas molecules have negligible volume", "There are no forces between the molecules (collisions are elastic)"] },
      { q: "Use the kinetic theory to explain why the pressure of a gas increases when it is heated in a closed container.", marks: 3, level: "analysis", memo: ["The molecules gain kinetic energy and move faster", "They collide with the walls more often", "and with greater force"] },
    ],
  },
  // ======================================================== Grade 12 · Physics
  {
    id: "g12-projectile-drop",
    topic: "g12-projectile",
    title: "A ball dropped and bouncing",
    source: m`A $0{,}2\ \text{kg}$ ball is dropped from rest from a height of $1{,}8\ \text{m}$. It bounces and rises to $0{,}8\ \text{m}$.`,
    parts: [
      { q: "Calculate the speed of the ball just before it hits the ground.", marks: 3, level: "comprehension", memo: [m`$v_f^2 = v_i^2 + 2a\Delta y$`, m`$v_f^2 = 0 + 2(9{,}8)(1{,}8)$`, m`$v_f = 5{,}94\ \text{m·s}^{-1}$`] },
      { q: "Calculate the speed of the ball just after the bounce.", marks: 3, level: "comprehension", memo: [m`$0 = v_i^2 + 2(-9{,}8)(0{,}8)$`, m`$v_i^2 = 15{,}68$`, m`$v_i = 3{,}96\ \text{m·s}^{-1}$`] },
      { q: "Calculate the change in momentum of the ball during the bounce.", marks: 3, level: "analysis", memo: [m`Up positive: $\Delta p = m(v_f - v_i)$`, m`$\Delta p = 0{,}2(3{,}96 - (-5{,}94))$`, m`$\Delta p = 1{,}98\ \text{kg·m·s}^{-1}$ upwards`] },
    ],
  },
  {
    id: "g12-doppler-bat",
    topic: "g12-doppler",
    title: "Doppler effect and medicine",
    parts: [
      { q: "A source of sound moves away from a stationary listener. Is the observed frequency higher or lower? Explain using wavefronts.", marks: 3, level: "comprehension", memo: ["Lower", "The wavefronts behind the source are further apart", "so the wavelength is longer and fewer wavefronts reach the listener per second"] },
      { q: "Explain how the Doppler effect is used to measure blood flow.", marks: 2, level: "comprehension", memo: ["Ultrasound reflects off moving blood cells", "The change in frequency gives the speed (and direction) of the blood"] },
      { q: m`A stationary police siren emits $500\ \text{Hz}$. A car moves towards it at $30\ \text{m·s}^{-1}$. Calculate the frequency the driver hears ($v = 340\ \text{m·s}^{-1}$).`, marks: 3, level: "analysis", memo: [m`$f_L = \frac{v + v_L}{v}f_s$`, m`$f_L = \frac{340 + 30}{340}(500)$`, m`$f_L = 544{,}12\ \text{Hz}$`] },
    ],
  },
  {
    id: "g12-electrodynamics-motor",
    topic: "g12-electrodynamics",
    title: "The DC motor",
    figure: { widget: "generator-lab", props: { mode: "motor" } },
    parts: [
      { q: "State the energy conversion in an electric motor.", marks: 2, level: "recall", memo: ["Electrical energy", "to mechanical (kinetic) energy"] },
      { q: "What is the function of the split-ring commutator?", marks: 2, level: "comprehension", memo: ["It reverses the direction of the current in the coil every half turn", "so the coil keeps turning in the same direction"] },
      { q: "Name TWO ways to make the motor turn faster.", marks: 2, level: "comprehension", memo: ["Increase the current", "Use a stronger magnet / more turns on the coil"] },
    ],
  },
  {
    id: "g12-photoelectric-threshold",
    topic: "g12-photoelectric",
    title: "Threshold frequency and spectra",
    source: m`The threshold frequency of a metal is $5{,}5 \times 10^{14}\ \text{Hz}$.`,
    parts: [
      { q: "Define threshold frequency.", marks: 2, level: "recall", memo: ["The minimum frequency of light needed", "to eject electrons from the surface of a metal"] },
      { q: "Calculate the work function of the metal.", marks: 3, level: "comprehension", memo: [m`$W_0 = hf_0$`, m`$W_0 = (6{,}63 \times 10^{-34})(5{,}5 \times 10^{14})$`, m`$W_0 = 3{,}65 \times 10^{-19}\ \text{J}$`] },
      { q: "Explain how line emission spectra are formed.", marks: 3, level: "comprehension", memo: ["Electrons in excited atoms drop to lower energy levels", "They emit photons of specific energies (frequencies)", "Each element produces its own pattern of lines"] },
    ],
  },
  // ======================================================== Grade 12 · Chemistry
  {
    id: "g12-organic-isomers",
    topic: "g12-organic",
    title: "Isomers and boiling points",
    figure: { widget: "property-chart", props: { set: "branching" } },
    parts: [
      { q: "Define structural isomers.", marks: 2, level: "recall", memo: ["Organic molecules with the same molecular formula", "but different structural formulae"] },
      { q: m`Write the names of TWO chain isomers of $\mathrm{C_5H_{12}}$ other than pentane.`, marks: 2, level: "comprehension", memo: ["2-methylbutane", "2,2-dimethylpropane"] },
      { q: "Which of the three isomers of C₅H₁₂ has the lowest boiling point? Explain.", marks: 4, level: "analysis", memo: ["2,2-dimethylpropane", "It is the most branched (most compact)", "so it has the smallest surface area and the weakest London forces", "Least energy is needed to overcome the forces"] },
    ],
  },
  {
    id: "g12-organic-elimination",
    topic: "g12-organic",
    title: "Substitution and elimination",
    source: "2-bromobutane is heated with (A) dilute aqueous NaOH and (B) concentrated NaOH in ethanol.",
    parts: [
      { q: "Name the type of reaction and the organic product in A.", marks: 2, level: "comprehension", memo: ["Substitution (hydrolysis)", "butan-2-ol"] },
      { q: "Name the type of reaction in B and the major organic product.", marks: 2, level: "comprehension", memo: ["Elimination (dehydrohalogenation)", "but-2-ene"] },
      { q: "Write the structural or condensed formula of the monomer of polyethene and state the type of polymerisation.", marks: 2, level: "recall", memo: [m`$\mathrm{CH_2{=}CH_2}$ (ethene)`, "Addition polymerisation"] },
      { q: "Write a balanced equation for the complete combustion of butane.", marks: 3, level: "comprehension", memo: [m`$\mathrm{2C_4H_{10} + 13O_2}$`, m`$\mathrm{\rightarrow 8CO_2 + 10H_2O}$`, "Balanced"] },
    ],
  },
  {
    id: "g12-rates-mb",
    topic: "g12-rates",
    title: "Temperature and catalysts",
    figure: { widget: "energy-profile", props: { catalyst: true } },
    parts: [
      { q: "Define a catalyst.", marks: 2, level: "recall", memo: ["A substance that increases the rate of a reaction", "without itself undergoing a permanent change"] },
      { q: "Sketch Maxwell-Boltzmann distribution curves at two temperatures and label them.", marks: 3, level: "comprehension", memo: ["Axes: number of particles against kinetic energy", "The higher-temperature curve is flatter and shifted right", "Activation energy marked; more particles above Eₐ at the higher T"] },
      { q: "Use collision theory to explain why a catalyst increases the rate.", marks: 3, level: "analysis", memo: ["It provides an alternative pathway of lower activation energy", "More particles have enough kinetic energy", "More effective collisions per unit time"] },
    ],
  },
  {
    id: "g12-equilibrium-graph",
    topic: "g12-equilibrium",
    title: "Disturbing an equilibrium",
    source: m`$\mathrm{2NO_2(g) \rightleftharpoons N_2O_4(g)}$, $\Delta H < 0$. $\mathrm{NO_2}$ is brown and $\mathrm{N_2O_4}$ is colourless.`,
    parts: [
      { q: "Define a closed system.", marks: 1, level: "recall", memo: ["A system that does not exchange matter with its surroundings"] },
      { q: "The flask is placed in ice water. How does the colour change? Explain.", marks: 4, level: "analysis", memo: ["The colour becomes lighter", "A decrease in temperature favours the exothermic reaction", "The forward reaction is favoured", m`so less brown $\mathrm{NO_2}$ is present`] },
      { q: "The pressure is increased by decreasing the volume. Which reaction is favoured? Explain.", marks: 3, level: "analysis", memo: ["The forward reaction", "An increase in pressure favours the reaction that produces fewer gas moles", "2 mol → 1 mol"] },
      { q: "State how adding a catalyst affects the equilibrium.", marks: 2, level: "comprehension", memo: ["It does not change the position of equilibrium (or Kc)", "Equilibrium is reached faster"] },
    ],
  },
  {
    id: "g12-acids-weak",
    topic: "g12-acids",
    title: "Weak acids and indicators",
    parts: [
      { q: "Distinguish between a weak acid and a dilute acid.", marks: 2, level: "comprehension", memo: ["A weak acid ionises incompletely in water", "A dilute acid has a small amount of acid per volume of solution"] },
      { q: m`Write the equation for the ionisation of ethanoic acid in water.`, marks: 2, level: "comprehension", memo: [m`$\mathrm{CH_3COOH + H_2O}$`, m`$\mathrm{\rightleftharpoons CH_3COO^- + H_3O^+}$`] },
      { q: m`Calculate the pH of a solution with $[\mathrm{OH^-}] = 2 \times 10^{-3}\ \text{mol·dm}^{-3}$.`, marks: 3, level: "comprehension", memo: [m`$[\mathrm{H_3O^+}] = \frac{10^{-14}}{2 \times 10^{-3}} = 5 \times 10^{-12}$`, m`$\text{pH} = -\log(5 \times 10^{-12})$`, m`$\text{pH} = 11{,}3$`] },
      { q: "Choose a suitable indicator for the titration of HCl with ammonia, and give a reason.", marks: 2, level: "evaluation", memo: ["Methyl orange", "The salt (NH₄Cl) is acidic, so the equivalence point is below pH 7"] },
    ],
  },
  {
    id: "g12-electrochem-chlor-alkali",
    topic: "g12-electrochem",
    title: "The chlor-alkali industry",
    source: "Concentrated sodium chloride solution (brine) is electrolysed in a membrane cell.",
    parts: [
      { q: "Write the half-reaction at the anode.", marks: 2, level: "comprehension", memo: [m`$\mathrm{2Cl^- \rightarrow Cl_2}$`, m`$+ 2e^-$`] },
      { q: "Name the products formed at the cathode.", marks: 2, level: "comprehension", memo: ["Hydrogen gas", "and hydroxide ions (sodium hydroxide)"] },
      { q: "Give ONE use of each product: chlorine and sodium hydroxide.", marks: 2, level: "recall", memo: ["Chlorine: water purification / PVC / bleach", "Sodium hydroxide: soap / paper / drain cleaner"] },
      { q: "In a galvanic cell, is the reaction at the cathode oxidation or reduction? Which electrode gains mass in a Zn–Cu cell?", marks: 2, level: "comprehension", memo: ["Reduction", "The copper electrode (cathode)"] },
    ],
  },
  {
    id: "g12-fertilisers-ostwald",
    topic: "g12-fertilisers",
    title: "Making nitric acid and ammonium nitrate",
    parts: [
      { q: "Name the industrial process used to make nitric acid and its catalyst.", marks: 2, level: "recall", memo: ["Ostwald process", "Platinum (Pt-Rh gauze)"] },
      { q: "Write a balanced equation for the preparation of ammonium sulfate.", marks: 3, level: "comprehension", memo: [m`$\mathrm{2NH_3 + H_2SO_4}$`, m`$\mathrm{\rightarrow (NH_4)_2SO_4}$`, "Balanced"] },
      { q: m`Calculate the percentage of nitrogen in ammonium sulfate ($M = 132\ \text{g·mol}^{-1}$).`, marks: 2, level: "comprehension", memo: [m`$\%\mathrm{N} = \frac{2(14)}{132} \times 100$`, m`$= 21{,}21\%$`] },
      { q: "Why does the Haber process use a temperature of about 450 °C rather than a low temperature?", marks: 2, level: "evaluation", memo: ["A low temperature would give a higher yield, but the rate would be too slow", "450 °C is a compromise between yield and rate"] },
    ],
  },
];
