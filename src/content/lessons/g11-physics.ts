import type { Lesson } from "../types";

const m = String.raw;

export const G11_PHYSICS: Lesson[] = [
  // ------------------------------------------------------------------ Vectors in 2D
  {
    slug: "vectors-2d",
    topic: "g11-vectors",
    order: 1,
    title: "Vectors in two dimensions",
    tagline: "Adding forces that don't point the same way.",
    emoji: "🧭",
    caps: "CAPS Gr 11 · Mechanics: resultant of perpendicular vectors (tail-to-head, Pythagoras and trigonometry), resolution of a vector into its parallel and perpendicular components, resultant of vectors in two dimensions.",
    objectives: [
      "Find the resultant of perpendicular vectors with a sketch, Pythagoras and trig",
      "Resolve a vector into horizontal and vertical components",
      "Add several vectors by adding their components",
    ],
    styles: ["visual", "kinaesthetic"],
    xp: 70,
    terms: [
      { term: "Resultant vector", def: "The single vector that has the same effect as two or more vectors acting together." },
      { term: "Tail-to-head method", def: "Draw the vectors one after another, the tail of each at the head of the previous one; the resultant goes from the first tail to the last head." },
      { term: "Components", def: m`Two perpendicular vectors that together replace one vector: $F_x = F\cos\theta$, $F_y = F\sin\theta$.` },
      { term: "Equilibrant", def: "The force that balances the resultant: equal in size and opposite in direction to it." },
      { term: "Pythagoras for vectors", def: m`For perpendicular vectors: $R = \sqrt{R_x^2 + R_y^2}$, and $\tan\theta = \frac{R_y}{R_x}$ gives the direction.` },
    ],
    chunks: [
      {
        id: "hook",
        title: "Tug-of-war at an angle",
        minutes: 6,
        blocks: [
          { type: "callout", variant: "real-world", md: m`Two tug boats pull a container ship into Durban harbour – one pulling north-east, one pulling north-west. Which way does the ship go, and how hard is it pulled? We need to **add vectors that don't lie on one line**.` },
          { type: "widget", widget: "vector-lab" },
        ],
      },
      {
        id: "perpendicular",
        title: "Perpendicular vectors",
        minutes: 9,
        blocks: [
          { type: "text", md: m`Two perpendicular vectors make a **right-angled triangle** when drawn tail-to-head. The resultant is the hypotenuse: $$R = \sqrt{x^2 + y^2} \qquad \tan\theta = \frac{\text{opposite}}{\text{adjacent}}$$ Always give the **direction** – as an angle from a reference direction, or as a bearing.` },
          {
            type: "worked",
            title: "Walking across a field",
            problem: m`A learner walks $80\ \text{m}$ east and then $60\ \text{m}$ north. Find her resultant displacement.`,
            steps: [
              { md: m`Sketch tail-to-head: 80 east, then 60 north; the resultant joins start to finish.` },
              { md: m`$R = \sqrt{80^2 + 60^2} = \sqrt{10\,000} = 100\ \text{m}$` },
              { md: m`$\tan\theta = \frac{60}{80} \Rightarrow \theta = 36{,}87^\circ$` },
              { md: m`Displacement: $100\ \text{m}$ at $36{,}87^\circ$ north of east (a bearing of $053{,}13^\circ$).`, why: "Bearings are measured clockwise from north: 90° − 36,87° = 53,13°." },
            ],
          },
          {
            type: "practice",
            id: "vec-perp-practice",
            problems: [
              { q: m`Forces of $5\ \text{N}$ east and $12\ \text{N}$ south act on an object. Calculate the magnitude of the resultant.`, answer: "13", unit: "N", solution: m`$$R = \sqrt{5^2 + 12^2} = 13\ \text{N}$$` },
              { q: m`For the same forces, calculate the angle between the resultant and the east direction.`, answer: "67.38", unit: "°", solution: m`$$\tan\theta = \frac{12}{5} \Rightarrow \theta = 67{,}38^\circ\ \text{(south of east)}$$` },
            ],
          },
        ],
      },
      {
        id: "components",
        title: "Resolving into components",
        minutes: 9,
        blocks: [
          { type: "text", md: m`Any vector at an angle $\theta$ to the horizontal can be split into a **horizontal component** $F_x = F\cos\theta$ and a **vertical component** $F_y = F\sin\theta$. To add several vectors: resolve each one, add all the $x$-components, add all the $y$-components, then use Pythagoras.` },
          { type: "widget", widget: "vector-lab", props: { title: "Drag the force and watch its components" } },
          {
            type: "worked",
            title: "Pulling a suitcase",
            problem: m`A traveller at O.R. Tambo pulls a suitcase with a force of $50\ \text{N}$ at $35^\circ$ above the horizontal. Find the components.`,
            steps: [
              { md: m`$F_x = 50\cos 35^\circ = 40{,}96\ \text{N}$ (forwards)`, why: "Only this part actually pulls the suitcase along the floor." },
              { md: m`$F_y = 50\sin 35^\circ = 28{,}68\ \text{N}$ (upwards)`, why: "This part lifts the suitcase slightly, reducing the normal force." },
            ],
          },
          {
            type: "practice",
            id: "vec-comp-practice",
            problems: [
              { q: m`A $200\ \text{N}$ force acts at $30^\circ$ above the horizontal. Calculate its horizontal component.`, answer: "173.21", unit: "N", solution: m`$$F_x = 200\cos 30^\circ = 173{,}21\ \text{N}$$` },
              { q: m`For the same force, calculate the vertical component.`, answer: "100", unit: "N", solution: m`$$F_y = 200\sin 30^\circ = 100\ \text{N}$$` },
              { q: m`Forces of $10\ \text{N}$ east, $4\ \text{N}$ west and $8\ \text{N}$ north act on a box. Calculate the magnitude of the resultant.`, answer: "10", unit: "N", hint: "Add east-west first: 10 − 4.", solution: m`$R_x = 10 - 4 = 6\ \text{N}$, $R_y = 8\ \text{N}$ $$R = \sqrt{6^2 + 8^2} = 10\ \text{N}$$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["vector-resultant"], title: "Vector drill" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["Draw vectors tail-to-head; the resultant joins first tail to last head.", m`Perpendicular: $R = \sqrt{x^2 + y^2}$, $\tan\theta = \frac{y}{x}$.`, m`Components: $F_x = F\cos\theta$, $F_y = F\sin\theta$.`, "Always give a direction with a vector answer."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "vectors2d-quiz",
            questions: [
              { q: "Forces of 3 N and 4 N act at right angles. The resultant is…", options: ["7 N", "1 N", "5 N", "12 N"], answer: 2, explain: "√(9 + 16) = 5 N." },
              { q: m`The horizontal component of a force $F$ at angle $\theta$ above the horizontal is…`, options: [m`$F\sin\theta$`, m`$F\cos\theta$`, m`$F\tan\theta$`, m`$\frac{F}{\cos\theta}$`], answer: 1, explain: m`Adjacent side: $F\cos\theta$.` },
              { q: "The equilibrant of a resultant force is…", options: ["the same force", "equal and opposite to the resultant", "perpendicular to it", "always zero"], answer: 1, explain: "It cancels the resultant to give equilibrium." },
              { q: "When three forces are drawn tail-to-head and form a closed triangle, the resultant is…", options: ["the largest force", "zero", "the sum of the magnitudes", "impossible to find"], answer: 1, explain: "The end meets the start: no net force (equilibrium)." },
              { q: "The maximum possible resultant of 6 N and 8 N is…", options: ["10 N", "14 N", "2 N", "48 N"], answer: 1, explain: "When they act in the same direction: 6 + 8 = 14 N." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Newton 1: forces & FBDs
  {
    slug: "forces-and-fbds",
    topic: "g11-newton",
    order: 1,
    title: "Forces, free-body diagrams & friction",
    tagline: "Every push and pull, drawn as an arrow.",
    emoji: "🏋️",
    caps: "CAPS Gr 11 · Mechanics: different kinds of forces – weight, normal force, frictional force (static and kinetic), applied force, tension; force diagrams and free-body diagrams; forces on an inclined plane.",
    objectives: [
      "Identify the forces acting on an object",
      "Draw force and free-body diagrams",
      m`Calculate friction with $f = \mu N$`,
      "Resolve weight into components on an inclined plane",
    ],
    styles: ["visual", "kinaesthetic"],
    xp: 80,
    terms: [
      { term: "Force", def: "A push or a pull; a vector measured in newtons (N)." },
      { term: "Weight (Fg / w)", def: m`The gravitational force the Earth exerts on an object: $w = mg$.` },
      { term: "Normal force (N)", def: "The force a surface exerts on an object in contact with it, perpendicular to the surface." },
      { term: "Frictional force (f)", def: "The force that opposes the motion (or tendency of motion) of an object, acting parallel to the surface." },
      { term: "Static friction", def: m`Friction on an object at rest that opposes the tendency to move; its maximum is $f_s^{max} = \mu_s N$.` },
      { term: "Kinetic friction", def: m`Friction on a sliding object: $f_k = \mu_k N$ (usually less than static friction).` },
      { term: "Tension (T)", def: "The force in a string, rope or cable that is pulled tight." },
      { term: "Free-body diagram", def: "A diagram of the object as a dot with all the forces acting ON it drawn as arrows from the dot." },
    ],
    chunks: [
      {
        id: "forces",
        title: "Spot the forces",
        minutes: 7,
        blocks: [
          { type: "callout", variant: "real-world", md: m`A taxi parked on the steep road up to Signal Hill: gravity pulls it down, the road pushes up on it, and **friction** stops it sliding down. If the handbrake fails, those forces are no longer balanced…` },
          {
            type: "table",
            headers: ["Force", "Symbol", "Direction"],
            rows: [
              ["Weight", m`$F_g$ or $w$`, "straight down (towards the centre of the Earth)"],
              ["Normal force", m`$F_N$ or $N$`, "perpendicular to (out of) the surface"],
              ["Friction", m`$f$`, "parallel to the surface, opposing motion"],
              ["Tension", m`$T$`, "along the string, away from the object"],
              ["Applied force", m`$F_A$ or $F$`, "whichever way it is pushed or pulled"],
            ],
          },
          { type: "callout", variant: "exam", md: m`In a **free-body diagram** draw the object as a **dot** and draw every force as an arrow **starting at the dot**, with a label. Arrows should be roughly to scale. Don't draw forces the object exerts on other things!` },
        ],
      },
      {
        id: "friction",
        title: "Friction",
        minutes: 8,
        blocks: [
          { type: "text", md: m`Friction depends on the **surfaces** (the coefficient of friction $\mu$) and how hard they are pressed together (the **normal force**): $$f_s^{max} = \mu_s N \qquad f_k = \mu_k N$$ Static friction is only as big as it needs to be – up to its maximum. Once the object slides, kinetic friction takes over.` },
          {
            type: "worked",
            title: "Pushing a fridge",
            problem: m`A $60\ \text{kg}$ fridge stands on a horizontal floor ($\mu_s = 0{,}5$, $\mu_k = 0{,}4$). (a) What force is needed to start it moving? (b) What force keeps it moving at constant velocity?`,
            steps: [
              { md: m`$N = mg = (60)(9{,}8) = 588\ \text{N}$`, why: "On a horizontal floor with no other vertical forces, N balances the weight." },
              { md: m`(a) $f_s^{max} = \mu_s N = (0{,}5)(588) = 294\ \text{N}$ – you must push with just more than $294\ \text{N}$.` },
              { md: m`(b) $f_k = \mu_k N = (0{,}4)(588) = 235{,}2\ \text{N}$ – constant velocity means $F_{net} = 0$, so push with $235{,}2\ \text{N}$.`, why: "That's why it's easier to keep something moving than to start it." },
            ],
          },
        ],
      },
      {
        id: "incline",
        title: "Inclined planes",
        minutes: 10,
        blocks: [
          { type: "text", md: m`On a slope we rotate our axes: one **along** the slope and one **perpendicular** to it. Weight is resolved into $$F_{g\parallel} = mg\sin\theta \text{ (down the slope)} \qquad F_{g\perp} = mg\cos\theta \text{ (into the slope)}$$ and the normal force balances the perpendicular part: $N = mg\cos\theta$.` },
          { type: "widget", widget: "incline-lab" },
          {
            type: "practice",
            id: "incline-practice",
            problems: [
              { q: m`A $20\ \text{kg}$ box rests on a $30^\circ$ slope. Calculate the component of its weight parallel to the slope.`, answer: "98", unit: "N", solution: m`$$F_{g\parallel} = mg\sin\theta = (20)(9{,}8)\sin 30^\circ = 98\ \text{N}$$` },
              { q: m`Calculate the normal force on the same box.`, answer: "169.74", unit: "N", solution: m`$$N = mg\cos\theta = (20)(9{,}8)\cos 30^\circ = 169{,}74\ \text{N}$$` },
              { q: m`A $10\ \text{kg}$ crate slides on a horizontal floor with $\mu_k = 0{,}25$. Calculate the kinetic friction.`, answer: "24.5", unit: "N", solution: m`$$f_k = \mu_k mg = (0{,}25)(10)(9{,}8) = 24{,}5\ \text{N}$$` },
            ],
          },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["Weight down, normal force perpendicular to the surface, friction along the surface.", m`$f_s^{max} = \mu_s N$, $f_k = \mu_k N$.`, m`On a slope: $mg\sin\theta$ along, $mg\cos\theta$ into the slope.`, "Free-body diagram: a dot with every force on the object."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "fbd-quiz",
            questions: [
              { q: "The normal force always acts…", options: ["downwards", "parallel to the surface", "perpendicular to the surface", "in the direction of motion"], answer: 2, explain: "Normal means perpendicular." },
              { q: "As a slope gets steeper, the normal force on a block…", options: ["increases", "decreases", "stays the same", "becomes the weight"], answer: 1, explain: m`$N = mg\cos\theta$ and $\cos\theta$ decreases as θ increases.` },
              { q: "Kinetic friction compared with maximum static friction is usually…", options: ["bigger", "smaller", "equal", "zero"], answer: 1, explain: "It's easier to keep something sliding than to start it." },
              { q: "A free-body diagram shows…", options: ["forces the object exerts on others", "all forces acting on the object", "only the weight", "the velocity"], answer: 1, explain: "Only forces acting ON the object." },
              { q: m`The coefficient of friction $\mu$ has the unit…`, options: ["N", "kg", "m·s⁻²", "none – it has no unit"], answer: 3, explain: "It is a ratio of two forces." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Newton 2: the laws
  {
    slug: "newtons-laws",
    topic: "g11-newton",
    order: 2,
    title: "Newton's three laws of motion",
    tagline: "Inertia, F = ma and action-reaction pairs – the rules of every push.",
    emoji: "🍎",
    caps: "CAPS Gr 11 · Mechanics: Newton's first law (inertia), Newton's second law (Fnet = ma), Newton's third law (action-reaction pairs); applications including connected objects, objects on inclined planes and lifts.",
    objectives: [
      "State and apply Newton's first law and explain inertia",
      m`Use $F_{net} = ma$ for single and connected objects`,
      "Identify Newton's third law force pairs",
    ],
    styles: ["visual", "kinaesthetic", "read-write"],
    xp: 90,
    terms: [
      { term: "Newton's first law", def: "A body will remain in its state of rest or motion at constant velocity unless a non-zero resultant (net) force acts on it." },
      { term: "Inertia", def: "The property of an object that causes it to resist a change in its state of rest or uniform motion. More mass = more inertia." },
      { term: "Newton's second law", def: "When a net force acts on an object, it accelerates in the direction of the net force; the acceleration is directly proportional to the net force and inversely proportional to the mass: Fnet = ma." },
      { term: "Newton's third law", def: "When object A exerts a force on object B, object B simultaneously exerts an oppositely directed force of equal magnitude on object A." },
      { term: "Newton (N)", def: m`The force that gives a $1\ \text{kg}$ mass an acceleration of $1\ \text{m·s}^{-2}$: $1\ \text{N} = 1\ \text{kg·m·s}^{-2}$.` },
      { term: "Net force", def: "The vector sum (resultant) of all the forces acting on an object." },
    ],
    chunks: [
      {
        id: "first",
        title: "Newton's first law: inertia",
        minutes: 7,
        blocks: [
          { type: "callout", variant: "real-world", md: m`A taxi brakes suddenly and the passengers lurch forward. No force pushed them forward – their bodies simply **kept moving** (inertia) while the taxi stopped. That's why seatbelts and headrests save lives: they provide the force needed to change your motion.` },
          { type: "text", md: m`**Newton's first law:** an object stays at rest, or keeps moving at **constant velocity**, unless a **net force** acts on it. "Constant velocity" means no acceleration – so if the forces balance ($F_{net} = 0$), nothing changes.` },
          {
            type: "widget",
            widget: "sorter",
            props: {
              id: "newton-laws-sort", title: "Which law explains it?", buckets: ["1st law (inertia)", "2nd law (F = ma)", "3rd law (pairs)"], colour: "var(--t-mech)",
              items: [
                { text: "Passengers jerk forward when a bus brakes", bucket: "1st law (inertia)" }, { text: "A tablecloth whipped from under plates", bucket: "1st law (inertia)" },
                { text: "An empty trolley accelerates faster than a full one", bucket: "2nd law (F = ma)" }, { text: "A harder kick makes the ball faster", bucket: "2nd law (F = ma)" },
                { text: "A rocket pushes gas down and the gas pushes it up", bucket: "3rd law (pairs)" }, { text: "You push off a wall and roll backwards", bucket: "3rd law (pairs)" },
              ],
            },
          },
        ],
      },
      {
        id: "second",
        title: "Newton's second law: F = ma",
        minutes: 10,
        blocks: [
          { type: "text", md: m`$$F_{net} = ma$$ A net force causes an **acceleration** in the same direction. Double the net force → double the acceleration. Double the mass → half the acceleration.` },
          {
            type: "sequence",
            id: "newton2-method",
            title: "Solving a Newton's second law problem",
            steps: ["Draw a free-body diagram for each object", "Choose a positive direction (the direction of motion)", "Write Fnet = ma for each object", "Fill in Fnet as the sum of the forces with signs", "Solve the equations (simultaneously if connected)"],
            explain: "Treat each object separately. For connected objects the acceleration is the same, and the tension in the string pulls both ways.",
          },
          {
            type: "worked",
            title: "Two trolleys and a string",
            problem: m`A $4\ \text{kg}$ trolley A is tied to a $6\ \text{kg}$ trolley B. A force of $30\ \text{N}$ pulls B to the right on a frictionless surface. Find (a) the acceleration and (b) the tension in the string.`,
            steps: [
              { md: m`(a) Whole system: $F_{net} = ma \Rightarrow 30 = (4 + 6)a \Rightarrow a = 3\ \text{m·s}^{-2}$ to the right.`, why: "The tension is internal to the system, so it cancels." },
              { md: m`(b) Trolley A alone: only the tension pulls it: $T = m_Aa = (4)(3) = 12\ \text{N}$` },
              { md: m`Check with B: $30 - T = (6)(3) \Rightarrow T = 12\ \text{N}$ ✔` },
            ],
          },
          {
            type: "worked",
            title: "Friction and F = ma",
            problem: m`A $25\ \text{kg}$ box is pulled along a floor by a horizontal force of $100\ \text{N}$. The kinetic friction is $40\ \text{N}$. Find its acceleration.`,
            steps: [
              { md: m`Take the direction of motion as positive: $F_{net} = F - f = 100 - 40 = 60\ \text{N}$` },
              { md: m`$a = \frac{F_{net}}{m} = \frac{60}{25} = 2{,}4\ \text{m·s}^{-2}$` },
            ],
          },
          {
            type: "practice",
            id: "newton2-practice",
            problems: [
              { q: m`A net force of $1\,500\ \text{N}$ acts on a $1\,200\ \text{kg}$ car. Calculate its acceleration.`, answer: "1.25", unit: "m·s⁻²", solution: m`$$a = \frac{F_{net}}{m} = \frac{1\,500}{1\,200} = 1{,}25\ \text{m·s}^{-2}$$` },
              { q: m`A $5\ \text{kg}$ block is pulled with $40\ \text{N}$ on a surface with friction $15\ \text{N}$. Calculate its acceleration.`, answer: "5", unit: "m·s⁻²", solution: m`$$a = \frac{40 - 15}{5} = 5\ \text{m·s}^{-2}$$` },
              { q: m`A $2\ \text{kg}$ block on a frictionless $30^\circ$ slope is released. Calculate its acceleration down the slope.`, answer: "4.9", unit: "m·s⁻²", hint: m`Only $mg\sin\theta$ acts along the slope.`, solution: m`$$F_{net} = mg\sin\theta = (2)(9{,}8)\sin 30^\circ = 9{,}8\ \text{N} \Rightarrow a = \frac{9{,}8}{2} = 4{,}9\ \text{m·s}^{-2}$$` },
              { q: m`A $70\ \text{kg}$ learner stands in a lift accelerating upwards at $2\ \text{m·s}^{-2}$. Calculate the normal force from the floor.`, answer: "826", unit: "N", hint: m`$N - mg = ma$ (up is positive).`, solution: m`$$N - mg = ma \Rightarrow N = (70)(9{,}8) + (70)(2) = 826\ \text{N}$$ She feels heavier than usual.` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["newton-second"], title: "Newton's second law drill" } },
        ],
      },
      {
        id: "third",
        title: "Newton's third law",
        minutes: 6,
        blocks: [
          { type: "text", md: m`Forces always come in **pairs**. If you push on a wall, the wall pushes back on you with an equal force in the opposite direction. The two forces act on **different objects**, so they **never cancel each other out**.` },
          { type: "callout", variant: "mistake", md: m`The weight of a book and the normal force from the table are **not** a third-law pair: they act on the **same** object (the book). The third-law partner of the book's weight is the book pulling the **Earth** upwards.` },
          { type: "widget", widget: "collision-lab", props: { title: "Equal and opposite impulses in a collision" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["1st law: no net force → no change in velocity.", m`2nd law: $F_{net} = ma$, in the direction of the net force.`, "3rd law: equal and opposite forces on DIFFERENT objects.", "Draw a free-body diagram for every object."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "newton-quiz",
            questions: [
              { q: "A car moves at constant velocity on a straight road. The net force on it is…", options: ["forwards", "backwards", "zero", "equal to its weight"], answer: 2, explain: "Constant velocity → no acceleration → Fnet = 0 (first law)." },
              { q: "The same force acts on a 2 kg and a 4 kg mass. The acceleration of the 4 kg mass is…", options: ["double", "the same", "half", "four times"], answer: 2, explain: "a = F/m: double the mass halves the acceleration." },
              { q: "Newton's third law forces act on…", options: ["the same object", "different objects", "only moving objects", "only objects at rest"], answer: 1, explain: "That's why they don't cancel." },
              { q: "Inertia depends on an object's…", options: ["speed", "mass", "weight on the Moon", "shape"], answer: 1, explain: "More mass = more resistance to a change in motion." },
              { q: "1 newton equals…", options: ["1 kg·m·s⁻¹", "1 kg·m·s⁻²", "1 J·s", "1 kg·m²"], answer: 1, explain: "F = ma: kg × m·s⁻²." },
            ],
          },
          {
            type: "exam",
            question: {
              id: "g11-newton-lesson-exam",
              q: m`A $3\ \text{kg}$ block on a horizontal surface is connected by a light string over a frictionless pulley to a hanging $2\ \text{kg}$ block. The kinetic friction on the $3\ \text{kg}$ block is $5\ \text{N}$. Calculate the acceleration of the system.`,
              marks: 5,
              level: "analysis",
              memo: [m`Hanging block: $m_2g - T = m_2a$, i.e. $(2)(9{,}8) - T = 2a$`, m`Table block: $T - f = m_1a$, i.e. $T - 5 = 3a$`, m`Adding: $19{,}6 - 5 = 5a$`, m`$a = 2{,}92\ \text{m·s}^{-2}$`, "Correct use of signs / one positive direction for the system"],
            },
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Gravitation
  {
    slug: "universal-gravitation",
    topic: "g11-gravitation",
    order: 1,
    title: "Newton's law of universal gravitation",
    tagline: "Why the Moon falls around the Earth – and why you weigh less on Mars.",
    emoji: "🪐",
    caps: "CAPS Gr 11 · Mechanics: Newton's law of universal gravitation, calculations of the force between two masses, weight and g on other planets, mass vs weight.",
    objectives: [
      "State Newton's law of universal gravitation",
      m`Calculate gravitational forces with $F = \frac{Gm_1m_2}{r^2}$`,
      "Use ratios (inverse square law) to compare forces",
      "Calculate g on another planet and distinguish mass from weight",
    ],
    styles: ["visual", "read-write"],
    xp: 70,
    terms: [
      { term: "Newton's law of universal gravitation", def: "Every particle with mass attracts every other particle with a force directly proportional to the product of their masses and inversely proportional to the square of the distance between their centres." },
      { term: "Universal gravitational constant", def: m`$G = 6{,}67 \times 10^{-11}\ \text{N·m}^2\text{·kg}^{-2}$` },
      { term: "Inverse square law", def: m`$F \propto \frac{1}{r^2}$: double the distance → a quarter of the force.` },
      { term: "Gravitational acceleration", def: m`$g = \frac{GM}{r^2}$ – at the Earth's surface $9{,}8\ \text{m·s}^{-2}$.` },
      { term: "Mass vs weight", def: "Mass (kg) is the amount of matter and is the same everywhere; weight (N) is the gravitational force on it and depends on where you are." },
    ],
    chunks: [
      {
        id: "law",
        title: "Everything attracts everything",
        minutes: 8,
        blocks: [
          { type: "text", md: m`$$F = \frac{Gm_1m_2}{r^2}$$ where $r$ is the distance **between the centres** of the two masses. $G$ is tiny, so the force is only noticeable when at least one mass is huge – like a planet.` },
          { type: "widget", widget: "gravity-lab" },
          {
            type: "worked",
            title: "The Earth and the Moon",
            problem: m`The Earth ($5{,}98 \times 10^{24}\ \text{kg}$) and the Moon ($7{,}35 \times 10^{22}\ \text{kg}$) are $3{,}84 \times 10^{8}\ \text{m}$ apart. Calculate the gravitational force between them.`,
            steps: [
              { md: m`$F = \frac{Gm_1m_2}{r^2} = \frac{(6{,}67 \times 10^{-11})(5{,}98 \times 10^{24})(7{,}35 \times 10^{22})}{(3{,}84 \times 10^{8})^2}$` },
              { md: m`$F = 1{,}99 \times 10^{20}\ \text{N}$`, why: "The Moon pulls the Earth with exactly the same force (Newton's third law) – that's what causes the tides at False Bay." },
            ],
          },
        ],
      },
      {
        id: "ratios",
        title: "Ratio problems & g on other planets",
        minutes: 9,
        blocks: [
          { type: "callout", variant: "exam", md: m`A favourite exam trick: "the distance is tripled and one mass doubled – find the new force". Use ratios: $F_{new} = F \times \frac{2}{3^2} = \frac{2}{9}F$.` },
          {
            type: "worked",
            title: "Weight on Mars",
            problem: m`Mars has a mass of $6{,}42 \times 10^{23}\ \text{kg}$ and a radius of $3{,}39 \times 10^{6}\ \text{m}$. Calculate g on Mars and the weight of a $60\ \text{kg}$ learner there.`,
            steps: [
              { md: m`$g = \frac{GM}{R^2} = \frac{(6{,}67 \times 10^{-11})(6{,}42 \times 10^{23})}{(3{,}39 \times 10^{6})^2} = 3{,}73\ \text{m·s}^{-2}$` },
              { md: m`$w = mg = (60)(3{,}73) = 223{,}8\ \text{N}$ (on Earth: $588\ \text{N}$)`, why: "Her mass is still 60 kg – only her weight changes." },
            ],
          },
          {
            type: "practice",
            id: "gravity-practice",
            problems: [
              { q: m`The force between two masses is $40\ \text{N}$. The distance between them is doubled. Calculate the new force.`, answer: "10", unit: "N", solution: m`$$F_{new} = \frac{40}{2^2} = 10\ \text{N}$$` },
              { q: m`The force between two masses is $18\ \text{N}$. Both masses are doubled and the distance is tripled. Calculate the new force.`, answer: "8", unit: "N", solution: m`$$F_{new} = 18 \times \frac{2 \times 2}{3^2} = 8\ \text{N}$$` },
              { q: m`Calculate the gravitational force between two $1\,000\ \text{kg}$ cars parked $2\ \text{m}$ apart (centre to centre).`, answer: "1.6675e-5", unit: "N", solution: m`$$F = \frac{(6{,}67 \times 10^{-11})(1\,000)(1\,000)}{2^2} = 1{,}67 \times 10^{-5}\ \text{N}$$ Far too small to notice!` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["gravitation"], title: "Gravitation drill" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: [m`$F = \frac{Gm_1m_2}{r^2}$ with r between the centres.`, "Inverse square: 2× distance → ¼ force.", m`$g = \frac{GM}{r^2}$.`, "Mass is constant; weight depends on g."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "gravitation-quiz",
            questions: [
              { q: "The distance between two masses is halved. The gravitational force becomes…", options: ["half", "double", "four times bigger", "a quarter"], answer: 2, explain: m`$\frac{1}{(1/2)^2} = 4$.` },
              { q: "The Earth pulls you with 600 N. You pull the Earth with…", options: ["0 N", "600 N", "much less than 600 N", "much more than 600 N"], answer: 1, explain: "Newton's third law: equal and opposite." },
              { q: "An astronaut's mass on the Moon compared with on Earth is…", options: ["smaller", "the same", "larger", "zero"], answer: 1, explain: "Mass doesn't depend on location." },
              { q: m`The unit of $G$ is…`, options: [m`N·m²·kg⁻²`, "N·kg⁻¹", "m·s⁻²", "kg·m"], answer: 0, explain: m`From $G = \frac{Fr^2}{m_1m_2}$.` },
              { q: "g at the surface of a planet depends on…", options: ["the mass of the object", "the planet's mass and radius", "only the radius", "the object's speed"], answer: 1, explain: m`$g = \frac{GM}{R^2}$.` },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Optics
  {
    slug: "geometrical-optics",
    topic: "g11-optics",
    order: 1,
    title: "Refraction, Snell's law & total internal reflection",
    tagline: "Why a straw looks bent – and how optical fibres carry the internet.",
    emoji: "🔦",
    caps: "CAPS Gr 11 · Waves, sound & light: refraction, refractive index, optical density, Snell's law, critical angles and total internal reflection, optical fibres.",
    objectives: [
      "Explain refraction as a change in speed",
      m`Use $n = \frac{c}{v}$ and Snell's law`,
      "Calculate critical angles and state the conditions for total internal reflection",
      "Describe uses of optical fibres",
    ],
    styles: ["visual", "kinaesthetic"],
    xp: 80,
    terms: [
      { term: "Refraction", def: "The change in direction of light as it passes from one medium to another, because its speed changes." },
      { term: "Refractive index", def: m`$n = \frac{c}{v}$: the ratio of the speed of light in a vacuum to its speed in the medium. Air ≈ 1.` },
      { term: "Optical density", def: "A measure of how much a medium slows light down – higher refractive index = optically denser." },
      { term: "Normal", def: "An imaginary line perpendicular to the surface at the point where the ray strikes it; angles are measured from the normal." },
      { term: "Snell's law", def: m`$n_1\sin\theta_1 = n_2\sin\theta_2$` },
      { term: "Critical angle", def: "The angle of incidence in the optically denser medium for which the angle of refraction is 90°." },
      { term: "Total internal reflection", def: "All the light is reflected back into the denser medium; it needs (1) light going from a denser to a less dense medium and (2) an angle of incidence bigger than the critical angle." },
    ],
    chunks: [
      {
        id: "refraction",
        title: "Bending light",
        minutes: 9,
        blocks: [
          { type: "callout", variant: "real-world", md: m`Put a pencil in a glass of water and it looks broken at the surface. Light travels at $3 \times 10^{8}\ \text{m·s}^{-1}$ in air but only $2{,}25 \times 10^{8}\ \text{m·s}^{-1}$ in water – changing speed makes it change direction.` },
          { type: "text", md: m`When light enters an **optically denser** medium (higher $n$) it **slows down** and bends **towards** the normal. Leaving into a less dense medium it speeds up and bends **away** from the normal.` },
          { type: "widget", widget: "refraction-lab" },
          { type: "callout", variant: "memory", md: m`**FAST**: going **F**rom **A** **S**low to fast medium, light bends **A**way – "**F**aster **A**way, **S**lower **T**owards".` },
        ],
      },
      {
        id: "snell",
        title: "Snell's law",
        minutes: 9,
        blocks: [
          { type: "text", md: m`$$n_1\sin\theta_1 = n_2\sin\theta_2$$ $\theta_1$ and $\theta_2$ are measured from the **normal**, not the surface.` },
          {
            type: "worked",
            title: "Into a swimming pool",
            problem: m`Light strikes water ($n = 1{,}33$) at $50^\circ$ to the normal. Find the angle of refraction.`,
            steps: [
              { md: m`$(1)\sin 50^\circ = (1{,}33)\sin\theta_2$` },
              { md: m`$\sin\theta_2 = 0{,}576 \Rightarrow \theta_2 = 35{,}17^\circ$`, why: "Smaller than 50° – the light bent towards the normal as it slowed down." },
            ],
          },
          {
            type: "practice",
            id: "snell-practice",
            problems: [
              { q: m`Calculate the speed of light in glass with refractive index $1{,}5$.`, answer: "2e8", unit: "m·s⁻¹", solution: m`$$v = \frac{c}{n} = \frac{3 \times 10^{8}}{1{,}5} = 2 \times 10^{8}\ \text{m·s}^{-1}$$` },
              { q: m`Light passes from air into glass ($n = 1{,}5$) at an angle of incidence of $30^\circ$. Calculate the angle of refraction.`, answer: "19.47", unit: "°", solution: m`$$\sin\theta_2 = \frac{\sin 30^\circ}{1{,}5} = 0{,}333 \Rightarrow \theta_2 = 19{,}47^\circ$$` },
              { q: m`A ray in air at $45^\circ$ is refracted to $28^\circ$ in a plastic block. Calculate the refractive index of the plastic.`, answer: "1.51", unit: "", solution: m`$$n = \frac{\sin 45^\circ}{\sin 28^\circ} = 1{,}51$$` },
            ],
          },
        ],
      },
      {
        id: "tir",
        title: "Critical angle & total internal reflection",
        minutes: 8,
        blocks: [
          { type: "text", md: m`Going from glass into air, increase the angle of incidence and the refracted ray bends further from the normal until it skims along the surface ($90^\circ$). That angle of incidence is the **critical angle** $c$: $$n_1\sin c = n_2\sin 90^\circ \Rightarrow \sin c = \frac{n_2}{n_1}$$ Beyond it, **all** the light reflects: **total internal reflection**.` },
          { type: "widget", widget: "refraction-lab", props: { top: 3, bottom: 0, title: "From glass into air: find the critical angle" } },
          { type: "callout", variant: "real-world", md: m`**Optical fibres** – thin strands of glass – carry the internet across South Africa and under the sea to Europe on cables like SAT-3 and Equiano. The light bounces along the fibre by total internal reflection, millions of times, hardly losing any energy. Doctors use the same idea in an **endoscope** to see inside your stomach.` },
          { type: "widget", widget: "drill", props: { generators: ["snell"], title: "Refraction drill" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: [m`$n = \frac{c}{v}$; denser medium → slower → bends towards the normal.`, m`Snell: $n_1\sin\theta_1 = n_2\sin\theta_2$.`, m`Critical angle: $\sin c = \frac{n_2}{n_1}$.`, "TIR needs dense → less dense AND i > critical angle."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "optics-quiz",
            questions: [
              { q: "Light travels from air into glass. It…", options: ["speeds up and bends away from the normal", "slows down and bends towards the normal", "doesn't change", "slows down and bends away from the normal"], answer: 1, explain: "Glass is optically denser." },
              { q: "Total internal reflection can happen when light goes from…", options: ["air to water", "air to glass", "glass to air", "vacuum to air"], answer: 2, explain: "It must go from a denser to a less dense medium." },
              { q: "The refractive index of a medium is 2. The speed of light in it is…", options: [m`$6 \times 10^{8}\ \text{m·s}^{-1}$`, m`$1{,}5 \times 10^{8}\ \text{m·s}^{-1}$`, m`$3 \times 10^{8}\ \text{m·s}^{-1}$`, m`$2 \times 10^{8}\ \text{m·s}^{-1}$`], answer: 1, explain: m`$v = \frac{c}{n}$.` },
              { q: "Angles in Snell's law are measured from the…", options: ["surface", "normal", "light source", "horizontal"], answer: 1, explain: "Always from the normal." },
              { q: "The critical angle of diamond is very small (24°), so diamonds…", options: ["look dull", "sparkle – lots of light is totally internally reflected", "don't refract light", "absorb all light"], answer: 1, explain: "Light gets trapped and bounces around inside before escaping." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Wavefronts
  {
    slug: "wavefronts-diffraction",
    topic: "g11-wavefronts",
    order: 1,
    title: "2D & 3D wavefronts: diffraction",
    tagline: "Why you can hear around corners but not see around them.",
    emoji: "🌀",
    caps: "CAPS Gr 11 · Waves, sound & light: wavefronts, Huygens' principle, diffraction, diffraction through a single slit, the degree of diffraction and its dependence on wavelength and slit width.",
    objectives: [
      "Describe wavefronts and Huygens' principle",
      "Define diffraction and describe the single-slit pattern",
      "Explain how wavelength and slit width affect the degree of diffraction",
    ],
    styles: ["visual"],
    xp: 60,
    terms: [
      { term: "Wavefront", def: "An imaginary line (or surface) joining points of a wave that are in phase, e.g. all the crests." },
      { term: "Huygens' principle", def: "Every point on a wavefront is a source of secondary wavelets; the new wavefront is the line tangent to all the wavelets." },
      { term: "Diffraction", def: "The ability of a wave to spread out in wavefronts as it passes through a small opening or around a sharp edge." },
      { term: "Degree of diffraction", def: m`Proportional to $\frac{\lambda}{a}$: longer wavelength or narrower slit → more diffraction.` },
      { term: "Single-slit pattern", def: m`A broad central bright band with dimmer bands either side; dark bands (minima) where $\sin\theta = \frac{m\lambda}{a}$.` },
      { term: "Interference", def: "The superposition of two or more waves, giving constructive (bright) and destructive (dark) regions." },
    ],
    chunks: [
      {
        id: "huygens",
        title: "Wavefronts and Huygens' principle",
        minutes: 8,
        blocks: [
          { type: "callout", variant: "real-world", md: m`You can hear your friend talking in the next classroom even though you can't see them. Sound waves (wavelength about 1 m) **diffract** through the doorway and spread out. Light waves are far too short (≈ 500 nm) to spread much through a door.` },
          { type: "text", md: m`Ripples on a pond make circular **wavefronts**; far from the source they look straight (plane wavefronts). **Huygens' principle**: every point on a wavefront acts like a tiny new source. Add up all those wavelets and you get the next wavefront. At a narrow slit only a few sources are left, so the wave spreads out.` },
          { type: "widget", widget: "diffraction-lab" },
        ],
      },
      {
        id: "slit",
        title: "The single-slit pattern",
        minutes: 8,
        blocks: [
          { type: "text", md: m`Shine a laser through a very narrow slit and the screen shows a **broad bright central band** with smaller, dimmer bands on either side. The dark bands are where wavelets from different parts of the slit cancel (destructive interference). The first dark band is at $$\sin\theta = \frac{\lambda}{a}$$` },
          {
            type: "worked",
            title: "How wide is the central band?",
            problem: m`Red light ($\lambda = 650\ \text{nm}$) passes through a slit $0{,}02\ \text{mm}$ wide. At what angle is the first dark band?`,
            steps: [
              { md: m`$\sin\theta = \frac{\lambda}{a} = \frac{650 \times 10^{-9}}{0{,}02 \times 10^{-3}} = 0{,}0325$` },
              { md: m`$\theta = 1{,}86^\circ$`, why: "A narrower slit would give a bigger angle – a wider central band." },
            ],
          },
          {
            type: "practice",
            id: "diffraction-practice",
            problems: [
              { q: m`Green light ($\lambda = 520\ \text{nm}$) passes through a $0{,}01\ \text{mm}$ slit. Calculate the angle of the first minimum.`, answer: "2.98", unit: "°", solution: m`$$\sin\theta = \frac{520 \times 10^{-9}}{1 \times 10^{-5}} = 0{,}052 \Rightarrow \theta = 2{,}98^\circ$$` },
              { q: m`The slit width is halved. By what factor does $\sin\theta$ for the first minimum change?`, answer: "2", solution: m`$\sin\theta = \frac{\lambda}{a}$: halving $a$ doubles $\sin\theta$ – more diffraction.` },
            ],
          },
          { type: "callout", variant: "key", md: m`Which colour diffracts most? **Red** (longest visible wavelength). Violet diffracts least. This is evidence that light is a **wave**.` },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["Huygens: every point on a wavefront is a source of wavelets.", "Diffraction = spreading through an opening or round an edge.", "More diffraction when λ is big compared with the slit.", m`First minimum: $\sin\theta = \frac{\lambda}{a}$.`] },
          { type: "terms" },
          {
            type: "quiz",
            id: "wavefront-quiz",
            questions: [
              { q: "Diffraction is greatest when the slit width is…", options: ["much bigger than λ", "about equal to λ", "zero", "irrelevant"], answer: 1, explain: "Degree of diffraction ∝ λ/a." },
              { q: "Which colour of light diffracts the most through a slit?", options: ["Violet", "Blue", "Green", "Red"], answer: 3, explain: "Red has the longest wavelength." },
              { q: "In a single-slit pattern, the central bright band is…", options: ["the narrowest", "the widest and brightest", "dark", "the same as the others"], answer: 1, explain: "The central maximum is about twice as wide as the others." },
              { q: "Diffraction is evidence that light behaves as a…", options: ["particle", "wave", "photon only", "sound"], answer: 1, explain: "Only waves spread out and interfere like this." },
              { q: "Huygens' principle says each point on a wavefront…", options: ["stops moving", "acts as a source of secondary wavelets", "reflects", "is a photon"], answer: 1, explain: "That's how the new wavefront forms." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Electrostatics 11
  {
    slug: "coulombs-law-fields",
    topic: "g11-electrostatics",
    order: 1,
    title: "Coulomb's law & electric fields",
    tagline: "The force between charges – and the invisible field around them.",
    emoji: "⚡",
    caps: "CAPS Gr 11 · Electricity & magnetism: Coulomb's law, electrostatic force in one and two dimensions, electric field, field patterns, electric field strength E = F/q and E = kQ/r².",
    objectives: [
      m`State and apply Coulomb's law $F = \frac{kQ_1Q_2}{r^2}$`,
      "Find the net force on a charge from two others",
      "Draw electric field patterns",
      m`Calculate field strength with $E = \frac{F}{q}$ and $E = \frac{kQ}{r^2}$`,
    ],
    styles: ["visual", "read-write"],
    xp: 80,
    terms: [
      { term: "Coulomb's law", def: "The magnitude of the electrostatic force exerted by one point charge on another is directly proportional to the product of the magnitudes of the charges and inversely proportional to the square of the distance between them." },
      { term: "Coulomb's constant", def: m`$k = 9 \times 10^{9}\ \text{N·m}^2\text{·C}^{-2}$` },
      { term: "Electric field", def: "A region in space in which an electric charge experiences a force." },
      { term: "Electric field strength", def: m`The force per unit positive charge at a point: $E = \frac{F}{q}$, in N·C⁻¹.` },
      { term: "Field of a point charge", def: m`$E = \frac{kQ}{r^2}$, pointing away from a positive charge and towards a negative charge.` },
      { term: "Field lines", def: "Lines showing the direction of the force on a positive test charge; they start on + charges, end on − charges and never cross." },
    ],
    chunks: [
      {
        id: "coulomb",
        title: "Coulomb's law",
        minutes: 9,
        blocks: [
          { type: "text", md: m`$$F = \frac{kQ_1Q_2}{r^2}$$ It looks just like gravitation – but charges can **repel** as well as attract, and $k$ is huge, so electric forces are enormously stronger than gravity.` },
          { type: "widget", widget: "charge-lab", props: { mode: "coulomb" } },
          {
            type: "worked",
            title: "Net force on a charge between two others",
            problem: m`Charges $Q_1 = +2\ \mu\text{C}$, $Q_2 = -3\ \mu\text{C}$ and $Q_3 = +4\ \mu\text{C}$ lie on a straight line. $Q_2$ is $0{,}1\ \text{m}$ to the right of $Q_1$, and $Q_3$ is $0{,}2\ \text{m}$ to the right of $Q_2$. Find the net force on $Q_2$.`,
            steps: [
              { md: m`$F_{12} = \frac{(9 \times 10^{9})(2 \times 10^{-6})(3 \times 10^{-6})}{0{,}1^2} = 5{,}4\ \text{N}$ – attraction, so $Q_2$ is pulled **left** towards $Q_1$.`, why: "Use magnitudes in the formula; decide directions from the signs." },
              { md: m`$F_{32} = \frac{(9 \times 10^{9})(4 \times 10^{-6})(3 \times 10^{-6})}{0{,}2^2} = 2{,}7\ \text{N}$ – attraction, so $Q_2$ is pulled **right** towards $Q_3$.` },
              { md: m`Take right as positive: $F_{net} = -5{,}4 + 2{,}7 = -2{,}7\ \text{N}$, i.e. $2{,}7\ \text{N}$ to the left.` },
            ],
          },
          {
            type: "practice",
            id: "coulomb-practice",
            problems: [
              { q: m`Two charges of $+1\ \mu\text{C}$ each are $0{,}3\ \text{m}$ apart. Calculate the force between them.`, answer: "0.1", unit: "N", solution: m`$$F = \frac{(9 \times 10^{9})(1 \times 10^{-6})^2}{0{,}3^2} = 0{,}1\ \text{N (repulsion)}$$` },
              { q: m`The force between two charges is $8\ \text{N}$. The distance between them is halved. Calculate the new force.`, answer: "32", unit: "N", solution: m`$$F_{new} = 8 \times 2^2 = 32\ \text{N}$$` },
            ],
          },
        ],
      },
      {
        id: "fields",
        title: "Electric fields",
        minutes: 9,
        blocks: [
          { type: "text", md: m`A charge sets up an **electric field** around it. The field strength at a point is the force on a **positive test charge** of 1 C placed there: $$E = \frac{F}{q} \qquad E = \frac{kQ}{r^2}$$ Field lines point **away from +** and **towards −**.` },
          { type: "widget", widget: "charge-lab", props: { mode: "field" } },
          {
            type: "practice",
            id: "efield-practice",
            problems: [
              { q: m`Calculate the electric field strength $0{,}5\ \text{m}$ from a $+5\ \mu\text{C}$ charge.`, answer: "180000", unit: "N·C⁻¹", solution: m`$$E = \frac{kQ}{r^2} = \frac{(9 \times 10^{9})(5 \times 10^{-6})}{0{,}5^2} = 1{,}8 \times 10^{5}\ \text{N·C}^{-1}$$ (away from the charge)` },
              { q: m`A $2\ \text{nC}$ charge feels a force of $6 \times 10^{-4}\ \text{N}$ at a point. Calculate the field strength there.`, answer: "300000", unit: "N·C⁻¹", solution: m`$$E = \frac{F}{q} = \frac{6 \times 10^{-4}}{2 \times 10^{-9}} = 3 \times 10^{5}\ \text{N·C}^{-1}$$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["coulomb"], title: "Electrostatics drill" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: [m`$F = \frac{kQ_1Q_2}{r^2}$ – use magnitudes, then decide direction.`, m`$E = \frac{F}{q} = \frac{kQ}{r^2}$, unit N·C⁻¹.`, "Field lines: away from +, towards −, never cross.", "Inverse square law, just like gravity."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "coulomb-quiz",
            questions: [
              { q: "Both charges are doubled and the distance stays the same. The force becomes…", options: ["double", "four times bigger", "half", "the same"], answer: 1, explain: "F ∝ Q₁Q₂, so 2 × 2 = 4 times bigger." },
              { q: "Electric field lines around a negative charge point…", options: ["away from it", "towards it", "in circles", "nowhere"], answer: 1, explain: "A positive test charge would be attracted towards it." },
              { q: "The unit of electric field strength is…", options: ["N·C⁻¹", "C·N⁻¹", "V·m", "J"], answer: 0, explain: m`$E = \frac{F}{q}$.` },
              { q: "Two charges attract. They must be…", options: ["both positive", "both negative", "opposite", "neutral"], answer: 2, explain: "Unlike charges attract." },
              { q: "Where field lines are close together, the field is…", options: ["weak", "strong", "zero", "reversed"], answer: 1, explain: "Line density shows field strength." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Electromagnetism
  {
    slug: "electromagnetism",
    topic: "g11-electromagnetism",
    order: 1,
    title: "Electromagnetism & Faraday's law",
    tagline: "Currents make magnetic fields – and changing fields make currents.",
    emoji: "🌀",
    caps: "CAPS Gr 11 · Electricity & magnetism: the magnetic field around a current-carrying conductor (straight wire, loop, solenoid), right-hand rules, magnetic flux, Faraday's law of electromagnetic induction, Lenz's law.",
    objectives: [
      "Use the right-hand rule for a straight wire and a solenoid",
      m`Calculate magnetic flux $\Phi = BA\cos\theta$`,
      m`State and apply Faraday's law $\varepsilon = -N\frac{\Delta\Phi}{\Delta t}$`,
      "Give everyday uses of electromagnetic induction",
    ],
    styles: ["visual", "kinaesthetic"],
    xp: 80,
    terms: [
      { term: "Right-hand rule (straight wire)", def: "Point your right thumb in the direction of the conventional current; your curled fingers show the direction of the magnetic field." },
      { term: "Solenoid", def: "A coil of wire; with a current it has a magnetic field like a bar magnet. Curl the right-hand fingers with the current – the thumb points to the N-pole." },
      { term: "Magnetic flux (Φ)", def: m`$\Phi = BA\cos\theta$ – a measure of the magnetic field passing through an area, in webers (Wb).` },
      { term: "Electromagnetic induction", def: "Producing an emf (and current) in a conductor by changing the magnetic flux through it." },
      { term: "Faraday's law", def: "The emf induced is directly proportional to the rate of change of magnetic flux (flux linkage): ε = −NΔΦ/Δt." },
      { term: "Lenz's law", def: "The induced current flows in a direction that opposes the change that caused it (the minus sign in Faraday's law)." },
    ],
    chunks: [
      {
        id: "fields",
        title: "Currents make magnetic fields",
        minutes: 8,
        blocks: [
          { type: "text", md: m`In 1820 Ørsted noticed that a compass needle moved when a current flowed in a nearby wire. Every current is surrounded by a **circular magnetic field**. Wind the wire into a coil (a **solenoid**) and the fields add up to a field like a bar magnet's – an **electromagnet**.` },
          { type: "widget", widget: "magnet-lab", props: { mode: "wire" } },
          { type: "widget", widget: "magnet-lab", props: { mode: "solenoid", title: "A solenoid is an electromagnet" } },
          { type: "callout", variant: "real-world", md: m`Electromagnets lift scrap metal at the scrapyard, ring old-fashioned school bells, move the cone in a speaker and lock the doors at the bank – and you can switch them off.` },
        ],
      },
      {
        id: "faraday",
        title: "Flux and Faraday's law",
        minutes: 10,
        blocks: [
          { type: "text", md: m`**Magnetic flux** measures how much magnetic field passes through a loop: $$\Phi = BA\cos\theta$$ where $\theta$ is the angle between the field and the **normal** to the loop. **Faraday's law**: a **changing** flux induces an emf: $$\varepsilon = -N\frac{\Delta\Phi}{\Delta t}$$ Move the magnet faster, use more turns or a stronger magnet → bigger emf.` },
          { type: "widget", widget: "generator-lab", props: { mode: "faraday" } },
          {
            type: "worked",
            title: "A coil in a changing field",
            problem: m`A coil of $200$ turns and area $0{,}05\ \text{m}^2$ is perpendicular to a magnetic field that increases from $0{,}1\ \text{T}$ to $0{,}5\ \text{T}$ in $0{,}2\ \text{s}$. Calculate the induced emf.`,
            steps: [
              { md: m`$\Delta\Phi = \Delta B \cdot A = (0{,}5 - 0{,}1)(0{,}05) = 0{,}02\ \text{Wb}$`, why: m`Perpendicular field → $\theta = 0^\circ$ and $\cos 0^\circ = 1$.` },
              { md: m`$\varepsilon = -N\frac{\Delta\Phi}{\Delta t} = -200 \times \frac{0{,}02}{0{,}2} = -20\ \text{V}$` },
              { md: m`Magnitude: $20\ \text{V}$. The minus sign is Lenz's law – the induced current opposes the increase in flux.` },
            ],
          },
          {
            type: "practice",
            id: "faraday-practice",
            problems: [
              { q: m`A loop of area $0{,}2\ \text{m}^2$ is perpendicular to a $0{,}4\ \text{T}$ field. Calculate the flux through it.`, answer: "0.08", unit: "Wb", solution: m`$$\Phi = BA\cos 0^\circ = (0{,}4)(0{,}2) = 0{,}08\ \text{Wb}$$` },
              { q: m`The flux through a 50-turn coil drops from $0{,}03\ \text{Wb}$ to $0$ in $0{,}1\ \text{s}$. Calculate the magnitude of the induced emf.`, answer: "15", unit: "V", solution: m`$$\varepsilon = N\frac{\Delta\Phi}{\Delta t} = 50 \times \frac{0{,}03}{0{,}1} = 15\ \text{V}$$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["faraday"], title: "Faraday's law drill" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "callout", variant: "real-world", md: m`Induction is everywhere: generators at Medupi power station, wireless phone chargers, the induction stove top, transformers on the pole outside your house, and the metal detectors at the airport.` },
          { type: "keypoints", points: ["A current produces a magnetic field (right-hand rule).", m`$\Phi = BA\cos\theta$ in Wb.`, m`$\varepsilon = -N\frac{\Delta\Phi}{\Delta t}$ – only a CHANGING flux induces an emf.`, "Lenz's law: the induced current opposes the change."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "em-ind-quiz",
            questions: [
              { q: "A magnet is held still inside a coil. The induced emf is…", options: ["large", "small", "zero", "alternating"], answer: 2, explain: "No change in flux → no emf." },
              { q: "Which change would NOT increase the induced emf?", options: ["More turns", "A stronger magnet", "Moving the magnet faster", "Moving the magnet more slowly"], answer: 3, explain: "A slower change gives a smaller rate of change of flux." },
              { q: "The unit of magnetic flux is the…", options: ["tesla", "weber", "volt", "henry"], answer: 1, explain: "The weber: Wb = T·m² (tesla × square metre)." },
              { q: "The magnetic field around a straight current-carrying wire is…", options: ["straight lines", "concentric circles", "zero", "only on one side"], answer: 1, explain: "Circles around the wire." },
              { q: "Lenz's law is shown by the… in Faraday's law.", options: ["N", "Δt", "minus sign", "Φ"], answer: 2, explain: "The minus sign: the induced current opposes the change." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Circuits 11
  {
    slug: "ohms-law-power",
    topic: "g11-circuits",
    order: 1,
    title: "Ohm's law, power & electrical energy",
    tagline: "V = IR, P = VI – and what your prepaid electricity really costs.",
    emoji: "🔌",
    caps: "CAPS Gr 11 · Electricity & magnetism: Ohm's law, ohmic and non-ohmic conductors, series-parallel networks, power and electrical energy, the kilowatt-hour and the cost of electricity.",
    objectives: [
      "State Ohm's law and identify ohmic conductors",
      "Solve series-parallel networks",
      m`Calculate power with $P = VI = I^2R = \frac{V^2}{R}$`,
      "Calculate the cost of electricity in kWh",
    ],
    styles: ["kinaesthetic", "read-write"],
    xp: 90,
    terms: [
      { term: "Ohm's law", def: "The potential difference across a conductor is directly proportional to the current in the conductor at constant temperature." },
      { term: "Ohmic conductor", def: "A conductor that obeys Ohm's law – its V-I graph is a straight line through the origin (constant resistance)." },
      { term: "Non-ohmic conductor", def: "A conductor whose resistance changes, e.g. a light bulb filament (resistance rises as it gets hot)." },
      { term: "Power", def: m`The rate at which electrical energy is converted: $P = \frac{W}{\Delta t} = VI = I^2R = \frac{V^2}{R}$, in watts (W).` },
      { term: "Electrical energy", def: m`$W = VI\Delta t$ in joules.` },
      { term: "Kilowatt-hour (kWh)", def: m`The energy used by a 1 kW appliance in 1 hour: $1\ \text{kWh} = 3{,}6 \times 10^{6}\ \text{J}$ – the "unit" on your electricity bill.` },
    ],
    chunks: [
      {
        id: "ohm",
        title: "Ohm's law",
        minutes: 8,
        blocks: [
          { type: "text", md: m`For many conductors (at constant temperature) doubling the potential difference doubles the current: $V \propto I$. The constant is the resistance: $$R = \frac{V}{I}$$ The **gradient** of a V-I graph (V on the y-axis) gives the resistance.` },
          { type: "widget", widget: "circuit-lab", props: { layout: "combo", title: "Series-parallel network" } },
          {
            type: "worked",
            title: "A series-parallel network",
            problem: m`A $12\ \text{V}$ battery (no internal resistance) is connected to $R_1 = 4\ \Omega$ in series with a parallel pair $R_2 = 6\ \Omega$ and $R_3 = 12\ \Omega$. Find the total current and the current through $R_2$.`,
            steps: [
              { md: m`Parallel part: $\frac{1}{R_p} = \frac{1}{6} + \frac{1}{12} = \frac{3}{12} \Rightarrow R_p = 4\ \Omega$` },
              { md: m`Total: $R = 4 + 4 = 8\ \Omega$; $I = \frac{V}{R} = \frac{12}{8} = 1{,}5\ \text{A}$` },
              { md: m`$V_p = IR_p = (1{,}5)(4) = 6\ \text{V}$`, why: "The full current flows through the parallel combination." },
              { md: m`$I_2 = \frac{V_p}{R_2} = \frac{6}{6} = 1\ \text{A}$ (and $I_3 = 0{,}5\ \text{A}$ – they add to $1{,}5\ \text{A}$ ✔)` },
            ],
          },
        ],
      },
      {
        id: "power",
        title: "Power and the electricity bill",
        minutes: 10,
        blocks: [
          { type: "text", md: m`$$P = VI = I^2R = \frac{V^2}{R}$$ A kettle rated **2 000 W** converts 2 000 J of electrical energy into heat every second. Eskom and municipalities sell energy in **kilowatt-hours**: $$E\ (\text{kWh}) = P\ (\text{kW}) \times t\ (\text{h})$$` },
          {
            type: "worked",
            title: "What does the geyser cost?",
            problem: m`A $3\ \text{kW}$ geyser is on for 4 hours a day. Electricity costs R3,20 per kWh. Calculate the cost for a 30-day month.`,
            steps: [
              { md: m`Energy per day: $3 \times 4 = 12\ \text{kWh}$; per month: $12 \times 30 = 360\ \text{kWh}$` },
              { md: m`Cost $= 360 \times \text{R}3{,}20 = \text{R}1\,152$`, why: "That's why a geyser blanket and a timer save so much money." },
            ],
          },
          {
            type: "practice",
            id: "power-practice",
            problems: [
              { q: m`A $60\ \text{W}$ bulb runs on $230\ \text{V}$. Calculate the current through it.`, answer: "0.26", unit: "A", solution: m`$$I = \frac{P}{V} = \frac{60}{230} = 0{,}26\ \text{A}$$` },
              { q: m`A current of $2\ \text{A}$ flows through a $15\ \Omega$ resistor. Calculate the power.`, answer: "60", unit: "W", solution: m`$$P = I^2R = (2)^2(15) = 60\ \text{W}$$` },
              { q: m`Calculate the resistance of a $1\,000\ \text{W}$ heater designed for $230\ \text{V}$.`, answer: "52.9", unit: "Ω", solution: m`$$R = \frac{V^2}{P} = \frac{230^2}{1\,000} = 52{,}9\ \Omega$$` },
              { q: m`A $2\ \text{kW}$ kettle is used for 15 minutes a day for 30 days at R3 per kWh. Calculate the cost in rand.`, answer: "45", unit: "rand", tol: 0.011, solution: m`$$E = 2 \times 0{,}25 \times 30 = 15\ \text{kWh} \qquad \text{cost} = 15 \times \text{R}3 = \text{R}45$$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["electric-power", "resistors"], title: "Ohm's law & power drill" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: [m`$R = \frac{V}{I}$; ohmic conductors give a straight V-I graph.`, "Solve networks: parallel part first, then series.", m`$P = VI = I^2R = \frac{V^2}{R}$.`, "Cost = kW × hours × price per kWh."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "ohm-quiz",
            questions: [
              { q: "A light bulb filament is non-ohmic because…", options: ["it has no resistance", "its resistance increases as it heats up", "it only works on AC", "it is made of glass"], answer: 1, explain: "Temperature changes its resistance." },
              { q: "1 kWh is equal to…", options: ["1 000 J", "3 600 J", m`$3{,}6 \times 10^{6}\ \text{J}$`, "60 J"], answer: 2, explain: "1 000 W × 3 600 s." },
              { q: "If the current through a resistor doubles, the power becomes…", options: ["double", "four times bigger", "half", "the same"], answer: 1, explain: m`$P = I^2R$.` },
              { q: "The gradient of a V-I graph (V on the y-axis) gives…", options: ["current", "power", "resistance", "charge"], answer: 2, explain: m`$R = \frac{V}{I}$.` },
              { q: "Which uses the most energy?", options: ["A 100 W TV for 2 hours", "A 2 000 W kettle for 3 minutes", "A 10 W LED for 10 hours", "A 1 000 W microwave for 1 minute"], answer: 0, explain: "TV: 0,2 kWh; kettle: 0,1 kWh; LED: 0,1 kWh; microwave: 0,017 kWh." },
            ],
          },
        ],
      },
    ],
  },
];
