import type { Lesson } from "../types";

const m = String.raw;

export const G12_PHYSICS: Lesson[] = [
  // ------------------------------------------------------------------ Momentum
  {
    slug: "momentum-impulse",
    topic: "g12-momentum",
    order: 1,
    title: "Momentum & impulse",
    tagline: "Why airbags, crumple zones and follow-through all work.",
    emoji: "🎱",
    caps: "CAPS Gr 12 · Mechanics: momentum, Newton's second law in terms of momentum, impulse, impulse-momentum theorem, conservation of linear momentum, elastic and inelastic collisions.",
    objectives: [
      m`Calculate momentum $p = mv$ and change in momentum`,
      m`Use the impulse-momentum theorem $F_{net}\Delta t = \Delta p$`,
      "Apply the conservation of linear momentum to collisions and explosions",
      "Decide whether a collision is elastic or inelastic",
    ],
    styles: ["visual", "kinaesthetic"],
    xp: 100,
    terms: [
      { term: "Momentum", def: m`The product of an object's mass and its velocity: $p = mv$ (a vector, in kg·m·s⁻¹).` },
      { term: "Newton's second law (momentum)", def: "The net force acting on an object is equal to the rate of change of momentum of the object: Fnet = Δp/Δt." },
      { term: "Impulse", def: m`The product of the net force and the contact time: $F_{net}\Delta t$ (in N·s). Impulse = change in momentum.` },
      { term: "Isolated system", def: "A system on which the net external force is zero." },
      { term: "Principle of conservation of linear momentum", def: "The total linear momentum of an isolated system remains constant (is conserved)." },
      { term: "Elastic collision", def: "A collision in which the total kinetic energy is conserved." },
      { term: "Inelastic collision", def: "A collision in which the total kinetic energy is NOT conserved (some is converted to heat, sound or deformation)." },
    ],
    chunks: [
      {
        id: "momentum",
        title: "Momentum and Δp",
        minutes: 8,
        blocks: [
          { type: "callout", variant: "real-world", md: m`A minibus taxi and a scooter both moving at 60 km/h: which is harder to stop? The taxi – it has far more **momentum** ($p = mv$). Momentum is "mass in motion", and it's a **vector**: direction matters.` },
          {
            type: "worked",
            title: "A tennis ball bounces off a wall",
            problem: m`A $0{,}06\ \text{kg}$ ball hits a wall at $20\ \text{m·s}^{-1}$ and rebounds at $15\ \text{m·s}^{-1}$. Calculate the change in momentum.`,
            steps: [
              { md: m`Take **towards the wall** as positive: $v_i = +20$, $v_f = -15\ \text{m·s}^{-1}$.`, why: "Rebound means the direction reverses, so the sign changes." },
              { md: m`$\Delta p = m(v_f - v_i) = 0{,}06(-15 - 20) = -2{,}1\ \text{kg·m·s}^{-1}$` },
              { md: m`So $\Delta p = 2{,}1\ \text{kg·m·s}^{-1}$ **away from the wall**.`, why: "A common mistake is to subtract the speeds and get 0,3 – the direction change makes Δp much bigger." },
            ],
          },
          { type: "callout", variant: "mistake", md: m`Forgetting that a **rebound** changes the sign of the velocity. Always choose a positive direction first and write the signs in.` },
        ],
      },
      {
        id: "impulse",
        title: "Impulse: force × time",
        minutes: 9,
        blocks: [
          { type: "text", md: m`Newton's second law in terms of momentum: $$F_{net} = \frac{\Delta p}{\Delta t} \Rightarrow F_{net}\Delta t = \Delta p$$ For the same change in momentum, a **longer contact time** means a **smaller force**.` },
          { type: "callout", variant: "real-world", md: m`**Airbags**, **crumple zones**, **helmets** and the sand in a long-jump pit all increase the time of the collision, so the force on your body is smaller. Bending your knees when you land from a jump does the same thing.` },
          {
            type: "practice",
            id: "impulse-practice",
            problems: [
              { q: m`Calculate the momentum of a $1\,500\ \text{kg}$ car travelling at $20\ \text{m·s}^{-1}$ east.`, answer: "30000", unit: "kg·m·s⁻¹", solution: m`$$p = mv = (1\,500)(20) = 30\,000\ \text{kg·m·s}^{-1}\ \text{east}$$` },
              { q: m`A force of $500\ \text{N}$ acts on a ball for $0{,}02\ \text{s}$. Calculate the impulse.`, answer: "10", unit: "N·s", solution: m`$$F\Delta t = (500)(0{,}02) = 10\ \text{N·s}$$` },
              { q: m`A $70\ \text{kg}$ driver moving at $15\ \text{m·s}^{-1}$ is stopped by an airbag in $0{,}5\ \text{s}$. Calculate the magnitude of the average force on the driver.`, answer: "2100", unit: "N", solution: m`$$F = \frac{\Delta p}{\Delta t} = \frac{70(0 - 15)}{0{,}5} = -2\,100\ \text{N}$$ Magnitude $2\,100\ \text{N}$. Without the airbag (0,05 s) it would be $21\,000\ \text{N}$!` },
            ],
          },
        ],
      },
      {
        id: "conservation",
        title: "Conservation of momentum",
        minutes: 10,
        blocks: [
          { type: "text", md: m`In an **isolated system** (no external net force), the total momentum before a collision equals the total momentum after: $$m_1v_{1i} + m_2v_{2i} = m_1v_{1f} + m_2v_{2f}$$` },
          { type: "widget", widget: "collision-lab" },
          {
            type: "worked",
            title: "Rugby tackle",
            problem: m`A $90\ \text{kg}$ forward running at $6\ \text{m·s}^{-1}$ tackles a stationary $80\ \text{kg}$ player. They move off together. Find their velocity and check whether kinetic energy is conserved.`,
            steps: [
              { md: m`$(90)(6) + (80)(0) = (90 + 80)v_f \Rightarrow v_f = 3{,}18\ \text{m·s}^{-1}$ in the original direction` },
              { md: m`$E_{k,before} = \tfrac{1}{2}(90)(6)^2 = 1\,620\ \text{J}$; $E_{k,after} = \tfrac{1}{2}(170)(3{,}18)^2 = 859{,}6\ \text{J}$` },
              { md: m`$E_k$ is not conserved → **inelastic** collision.`, why: "Objects that stick together always lose kinetic energy." },
            ],
          },
          {
            type: "practice",
            id: "conservation-practice",
            problems: [
              { q: m`A $2\ \text{kg}$ trolley moving at $3\ \text{m·s}^{-1}$ collides with a stationary $1\ \text{kg}$ trolley and they stick together. Calculate their velocity afterwards.`, answer: "2", unit: "m·s⁻¹", solution: m`$$(2)(3) = (3)v_f \Rightarrow v_f = 2\ \text{m·s}^{-1}$$` },
              { q: m`A $4\ \text{kg}$ rifle fires a $0{,}02\ \text{kg}$ bullet at $400\ \text{m·s}^{-1}$. Calculate the recoil speed of the rifle.`, answer: "2", unit: "m·s⁻¹", solution: m`$$0 = (0{,}02)(400) + (4)v \Rightarrow v = -2\ \text{m·s}^{-1}$$ The rifle recoils backwards at $2\ \text{m·s}^{-1}$.` },
              { q: m`Ball A ($0{,}5\ \text{kg}$, $4\ \text{m·s}^{-1}$ right) hits ball B ($0{,}5\ \text{kg}$, at rest). Afterwards A moves at $1\ \text{m·s}^{-1}$ right. Calculate B's velocity.`, answer: "3", unit: "m·s⁻¹", solution: m`$$(0{,}5)(4) = (0{,}5)(1) + (0{,}5)v_B \Rightarrow v_B = 3\ \text{m·s}^{-1}\ \text{right}$$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["momentum"], title: "Momentum drill" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: [m`$p = mv$; $\Delta p = m(v_f - v_i)$ with signs.`, m`$F_{net}\Delta t = \Delta p$: longer time → smaller force.`, "Isolated system: Σp before = Σp after.", "Elastic: Eₖ conserved; inelastic: Eₖ lost."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "momentum-quiz",
            questions: [
              { q: "The unit of momentum is…", options: ["N", "kg·m·s⁻¹", "J", "kg·m·s⁻²"], answer: 1, explain: "kg × m·s⁻¹." },
              { q: "Airbags reduce injuries by…", options: ["reducing the change in momentum", "increasing the time of impact", "increasing the force", "reducing the mass"], answer: 1, explain: "Same Δp over a longer time → smaller force." },
              { q: "Momentum is conserved when…", options: ["there is friction", "the net external force is zero", "objects stick together", "kinetic energy is conserved"], answer: 1, explain: "That's an isolated system." },
              { q: "In an inelastic collision…", options: ["momentum is lost", "kinetic energy is not conserved", "both are conserved", "nothing is conserved"], answer: 1, explain: "Momentum is still conserved; kinetic energy is not." },
              { q: "A ball hits a wall at 5 m·s⁻¹ and bounces back at 5 m·s⁻¹. Its change in momentum is…", options: ["zero", "m × 5", "m × 10", "m × 25"], answer: 2, explain: "Δv = −5 − 5 = −10 m·s⁻¹." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Vertical projectile motion
  {
    slug: "vertical-projectile-motion",
    topic: "g12-projectile",
    order: 1,
    title: "Vertical projectile motion",
    tagline: "Throw it up, watch it fall – the only force is gravity.",
    emoji: "🏀",
    caps: "CAPS Gr 12 · Mechanics: vertical projectile motion in one dimension, free fall, equations of motion for objects thrown up and down, position-time, velocity-time and acceleration-time graphs, bouncing balls.",
    objectives: [
      "Explain projectile motion and free fall",
      "Use the equations of motion with a = g",
      "Sketch and interpret x-t, v-t and a-t graphs (including bounces)",
    ],
    styles: ["visual", "kinaesthetic"],
    xp: 100,
    terms: [
      { term: "Projectile", def: "An object upon which the only force acting is the force of gravity." },
      { term: "Free fall", def: "Motion in which the only force acting is the gravitational force." },
      { term: "Acceleration due to gravity", def: m`$g = 9{,}8\ \text{m·s}^{-2}$ downwards, for every projectile (ignoring air resistance), whether it is going up, down or is at the top.` },
      { term: "Maximum height", def: m`At the highest point the velocity is momentarily zero: $v_f = 0$.` },
      { term: "Symmetry of motion", def: "Time up = time down to the same level, and the speed at a level on the way down equals the speed at that level on the way up." },
    ],
    chunks: [
      {
        id: "free-fall",
        title: "Only gravity",
        minutes: 8,
        blocks: [
          { type: "text", md: m`A **projectile** is anything moving under gravity alone: a ball thrown up, a coin dropped from a balcony, a stone thrown down a well. Ignoring air resistance, **every** projectile accelerates at $9{,}8\ \text{m·s}^{-2}$ **downwards** – even at the top, where it is momentarily still.` },
          { type: "widget", widget: "projectile-lab" },
          { type: "callout", variant: "mistake", md: m`"At the top the acceleration is zero." **No!** The velocity is zero at the top, but gravity still acts, so the acceleration is still $9{,}8\ \text{m·s}^{-2}$ downwards. If it were zero, the ball would hang in the air forever.` },
        ],
      },
      {
        id: "equations",
        title: "Equations of motion with g",
        minutes: 10,
        blocks: [
          { type: "text", md: m`Use the same four equations of motion, with $a = g = 9{,}8\ \text{m·s}^{-2}$. **Choose a direction as positive and stick to it.** If up is positive, $g = -9{,}8\ \text{m·s}^{-2}$; if down is positive, $g = +9{,}8\ \text{m·s}^{-2}$.` },
          {
            type: "worked",
            title: "A ball thrown up from a balcony",
            problem: m`A ball is thrown vertically upwards at $10\ \text{m·s}^{-1}$ from a balcony $15\ \text{m}$ above the ground. Take up as positive. Find (a) the time to reach its highest point, (b) its maximum height above the ground, (c) its velocity when it hits the ground.`,
            steps: [
              { md: m`(a) $v_f = v_i + a\Delta t \Rightarrow 0 = 10 + (-9{,}8)\Delta t \Rightarrow \Delta t = 1{,}02\ \text{s}$` },
              { md: m`(b) $v_f^2 = v_i^2 + 2a\Delta y \Rightarrow 0 = 10^2 + 2(-9{,}8)\Delta y \Rightarrow \Delta y = 5{,}10\ \text{m}$; height above ground $= 15 + 5{,}10 = 20{,}10\ \text{m}$` },
              { md: m`(c) From the release point to the ground: $\Delta y = -15\ \text{m}$. $v_f^2 = 10^2 + 2(-9{,}8)(-15) = 394 \Rightarrow v_f = -19{,}85\ \text{m·s}^{-1}$`, why: "Take the negative root – the ball is moving DOWN (negative direction)." },
              { md: m`So it hits the ground at $19{,}85\ \text{m·s}^{-1}$ downwards.` },
            ],
          },
          {
            type: "practice",
            id: "projectile-practice",
            problems: [
              { q: m`A stone is dropped from rest down a well and hits the water after $2{,}5\ \text{s}$. How deep is the well (to the water)?`, answer: "30.63", unit: "m", solution: m`Down positive: $$\Delta y = v_i\Delta t + \tfrac{1}{2}g\Delta t^2 = 0 + \tfrac{1}{2}(9{,}8)(2{,}5)^2 = 30{,}63\ \text{m}$$` },
              { q: m`A ball is thrown straight up at $14\ \text{m·s}^{-1}$. Calculate the maximum height it reaches above the point of release.`, answer: "10", unit: "m", solution: m`Up positive: $$0 = 14^2 + 2(-9{,}8)\Delta y \Rightarrow \Delta y = 10\ \text{m}$$` },
              { q: m`For the same ball, how long is it in the air before it returns to the thrower's hand?`, answer: "2.86", unit: "s", hint: "Time up = time down.", solution: m`Time to top: $\frac{14}{9{,}8} = 1{,}43\ \text{s}$; total $= 2 \times 1{,}43 = 2{,}86\ \text{s}$` },
              { q: m`A ball is thrown downwards at $5\ \text{m·s}^{-1}$ from a $20\ \text{m}$ high bridge. Calculate its speed when it hits the water.`, answer: "20.42", unit: "m·s⁻¹", solution: m`Down positive: $$v_f^2 = 5^2 + 2(9{,}8)(20) = 417 \Rightarrow v_f = 20{,}42\ \text{m·s}^{-1}$$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["projectile"], title: "Projectile drill" } },
        ],
      },
      {
        id: "graphs",
        title: "Graphs of projectile motion",
        minutes: 8,
        blocks: [
          {
            type: "table",
            headers: ["Graph (up positive)", "Shape", "Key features"],
            rows: [
              ["position-time", "upside-down parabola", "maximum at the top; gradient = velocity"],
              ["velocity-time", "straight line, gradient −9,8", "crosses the t-axis at the top; area = displacement"],
              ["acceleration-time", "horizontal line at −9,8", "the same throughout the flight"],
            ],
          },
          { type: "widget", widget: "projectile-lab", props: { title: "Bounce the ball and compare the graphs" } },
          { type: "callout", variant: "exam", md: m`**Bouncing balls:** each bounce shows as a sudden jump in velocity on the v-t graph (the sign flips) – the lines between bounces stay **parallel** because the gradient is always $g$. If the bounce is not perfectly elastic, the rebound speed is smaller each time.` },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["Only gravity acts: a = 9,8 m·s⁻² down throughout.", "At the top v = 0 but a ≠ 0.", "Choose a positive direction and use the signs consistently.", "v-t graphs are straight lines with gradient = g."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "projectile-quiz",
            questions: [
              { q: "At the highest point of its flight, a ball's acceleration is…", options: ["zero", m`$9{,}8\ \text{m·s}^{-2}$ downwards`, m`$9{,}8\ \text{m·s}^{-2}$ upwards`, "changing direction"], answer: 1, explain: "Gravity never switches off." },
              { q: "The v-t graph of a projectile (no air resistance) is…", options: ["a parabola", "a straight line", "horizontal", "a curve that flattens out"], answer: 1, explain: "Constant acceleration → straight line." },
              { q: "A ball thrown up at 20 m·s⁻¹ returns to the same height. Its speed then is…", options: ["0", "10 m·s⁻¹", "20 m·s⁻¹", "40 m·s⁻¹"], answer: 2, explain: "Symmetry: same speed, opposite direction." },
              { q: "A heavy and a light ball are dropped together (no air resistance). The heavy ball…", options: ["lands first", "lands at the same time", "lands later", "falls at constant speed"], answer: 1, explain: "Both accelerate at g." },
              { q: "With up as positive, the velocity of a falling ball is…", options: ["positive", "negative", "zero", "always 9,8"], answer: 1, explain: "It moves in the negative (down) direction." },
            ],
          },
          {
            type: "exam",
            question: {
              id: "g12-projectile-lesson-exam",
              q: m`A ball is thrown vertically upwards from the ground at $15\ \text{m·s}^{-1}$. Ignore air resistance. Calculate (a) the time it takes to reach its maximum height, and (b) the maximum height.`,
              marks: 6,
              level: "analysis",
              memo: [m`Up positive: $v_f = v_i + a\Delta t$`, m`$0 = 15 + (-9{,}8)\Delta t$`, m`$\Delta t = 1{,}53\ \text{s}$`, m`$v_f^2 = v_i^2 + 2a\Delta y$`, m`$0 = 15^2 + 2(-9{,}8)\Delta y$`, m`$\Delta y = 11{,}48\ \text{m}$`],
            },
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Work, energy & power
  {
    slug: "work-energy-power",
    topic: "g12-work-energy",
    order: 1,
    title: "Work, energy & power",
    tagline: "The work-energy theorem – and why your car needs more power going up hills.",
    emoji: "🏋️",
    caps: "CAPS Gr 12 · Mechanics: work done by a force, the work-energy theorem, conservative and non-conservative forces, conservation of mechanical energy, Wnc = ΔEk + ΔEp, power and efficiency.",
    objectives: [
      m`Calculate work with $W = F\Delta x\cos\theta$`,
      "Apply the work-energy theorem",
      "Tell conservative and non-conservative forces apart",
      m`Calculate power with $P = \frac{W}{\Delta t}$ and $P = Fv$`,
    ],
    styles: ["visual", "read-write"],
    xp: 100,
    terms: [
      { term: "Work", def: m`The product of the force and the displacement in the direction of the force: $W = F\Delta x\cos\theta$ (in joules).` },
      { term: "Work-energy theorem", def: "The net (total) work done on an object is equal to the change in the object's kinetic energy: Wnet = ΔEk." },
      { term: "Conservative force", def: "A force for which the work done in moving an object between two points is independent of the path taken, e.g. gravity." },
      { term: "Non-conservative force", def: "A force for which the work done depends on the path, e.g. friction, air resistance, tension, an applied force." },
      { term: "Wnc = ΔEk + ΔEp", def: "The work done by non-conservative forces equals the change in mechanical energy." },
      { term: "Power", def: m`The rate at which work is done or energy is transferred: $P = \frac{W}{\Delta t}$ (in watts). For constant velocity, $P_{ave} = Fv_{ave}$.` },
      { term: "Efficiency", def: m`$\frac{\text{useful energy out}}{\text{energy in}} \times 100\%$` },
    ],
    chunks: [
      {
        id: "work",
        title: "Work done by a force",
        minutes: 9,
        blocks: [
          { type: "text", md: m`In physics, **work** is only done when a force makes something **move** in the direction of the force: $$W = F\Delta x\cos\theta$$ $\theta$ is the angle between the force and the displacement.

- $\theta = 0^\circ$: positive work (the force helps the motion).
- $\theta = 90^\circ$: **no work** (e.g. the normal force on a box sliding along a floor).
- $\theta = 180^\circ$: negative work (e.g. friction always does negative work).` },
          {
            type: "worked",
            title: "Pulling a sledge",
            problem: m`A child pulls a sledge $25\ \text{m}$ along flat ground with a force of $40\ \text{N}$ at $30^\circ$ to the horizontal. Friction is $20\ \text{N}$. Calculate the work done by each force.`,
            steps: [
              { md: m`Applied: $W = (40)(25)\cos 30^\circ = 866\ \text{J}$` },
              { md: m`Friction: $W = (20)(25)\cos 180^\circ = -500\ \text{J}$` },
              { md: m`Weight and normal force: $\theta = 90^\circ$, so $W = 0$.`, why: "They are perpendicular to the displacement." },
              { md: m`Net work: $866 - 500 = 366\ \text{J}$ – this becomes kinetic energy.` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["work-energy"], title: "Work, energy & power drill" } },
        ],
      },
      {
        id: "theorem",
        title: "The work-energy theorem",
        minutes: 9,
        blocks: [
          { type: "text", md: m`$$W_{net} = \Delta E_k = \tfrac{1}{2}mv_f^2 - \tfrac{1}{2}mv_i^2$$ When non-conservative forces (friction, air resistance, applied forces) act, mechanical energy is **not** conserved: $$W_{nc} = \Delta E_k + \Delta E_p$$` },
          { type: "widget", widget: "energy-lab", props: { friction: true, title: "Friction does negative work" } },
          {
            type: "worked",
            title: "A crate sliding down a ramp",
            problem: m`A $10\ \text{kg}$ crate slides from rest down a ramp, dropping $2\ \text{m}$ vertically. It reaches the bottom at $5\ \text{m·s}^{-1}$. Calculate the work done by friction.`,
            steps: [
              { md: m`$W_{nc} = \Delta E_k + \Delta E_p$` },
              { md: m`$\Delta E_k = \tfrac{1}{2}(10)(5)^2 - 0 = 125\ \text{J}$; $\Delta E_p = (10)(9{,}8)(0 - 2) = -196\ \text{J}$` },
              { md: m`$W_f = 125 + (-196) = -71\ \text{J}$`, why: "Negative: friction removed 71 J of mechanical energy as heat." },
            ],
          },
          {
            type: "practice",
            id: "work-practice",
            problems: [
              { q: m`A force of $50\ \text{N}$ pushes a trolley $8\ \text{m}$ in the direction of the force. Calculate the work done.`, answer: "400", unit: "J", solution: m`$$W = F\Delta x\cos 0^\circ = (50)(8) = 400\ \text{J}$$` },
              { q: m`The net work on a $2\ \text{kg}$ ball at rest is $36\ \text{J}$. Calculate its final speed.`, answer: "6", unit: "m·s⁻¹", solution: m`$$36 = \tfrac{1}{2}(2)v^2 \Rightarrow v = 6\ \text{m·s}^{-1}$$` },
              { q: m`Friction of $15\ \text{N}$ acts on a box sliding $4\ \text{m}$. Calculate the work done by friction.`, answer: "-60", unit: "J", solution: m`$$W = (15)(4)\cos 180^\circ = -60\ \text{J}$$` },
            ],
          },
        ],
      },
      {
        id: "power",
        title: "Power",
        minutes: 7,
        blocks: [
          { type: "text", md: m`**Power** is how fast work is done: $$P = \frac{W}{\Delta t}$$ A vehicle moving at **constant velocity** against a resistive force $f$ needs a driving force $F = f$, so $$P_{ave} = Fv_{ave}$$` },
          {
            type: "practice",
            id: "power12-practice",
            problems: [
              { q: m`A crane lifts a $500\ \text{kg}$ load $12\ \text{m}$ in $20\ \text{s}$ at constant speed. Calculate its power output.`, answer: "2940", unit: "W", solution: m`$$P = \frac{mgh}{\Delta t} = \frac{(500)(9{,}8)(12)}{20} = 2\,940\ \text{W}$$` },
              { q: m`A truck moves at a constant $25\ \text{m·s}^{-1}$ against resistive forces of $3\,000\ \text{N}$. Calculate the power of its engine.`, answer: "75000", unit: "W", solution: m`$$P = Fv = (3\,000)(25) = 75\,000\ \text{W} = 75\ \text{kW}$$` },
            ],
          },
          { type: "callout", variant: "real-world", md: m`A taxi climbing the long hill out of Durban on the N3 needs much more **power** than on a flat road: the engine must also do work against gravity, $mgh$, every second.` },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: [m`$W = F\Delta x\cos\theta$ – no work if the force is perpendicular.`, m`$W_{net} = \Delta E_k$; $W_{nc} = \Delta E_k + \Delta E_p$.`, "Gravity is conservative; friction is non-conservative.", m`$P = \frac{W}{\Delta t} = Fv$.`] },
          { type: "terms" },
          {
            type: "quiz",
            id: "work-quiz",
            questions: [
              { q: "A waiter carries a tray horizontally across a room. The work done by the upward force on the tray is…", options: ["positive", "negative", "zero", "equal to mgh"], answer: 2, explain: "The force (up) is perpendicular to the displacement (sideways)." },
              { q: "Which force is conservative?", options: ["Friction", "Air resistance", "Gravity", "Tension"], answer: 2, explain: "Work done by gravity depends only on the start and end heights." },
              { q: "The net work done on an object equals its change in…", options: ["potential energy", "kinetic energy", "momentum", "power"], answer: 1, explain: "The work-energy theorem." },
              { q: "1 watt is equal to…", options: ["1 J·s", "1 J·s⁻¹", "1 N·m", "1 kg·m·s⁻¹"], answer: 1, explain: "Power = energy per second." },
              { q: "Work done by friction is always…", options: ["positive", "negative", "zero", "equal to the weight"], answer: 1, explain: "Friction opposes the displacement (θ = 180°)." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Doppler
  {
    slug: "doppler-effect",
    topic: "g12-doppler",
    order: 1,
    title: "The Doppler effect",
    tagline: "The 'neeee-yowww' of a passing ambulance – and the expanding universe.",
    emoji: "🚑",
    caps: "CAPS Gr 12 · Waves, sound & light: the Doppler effect with sound (moving source or listener), calculations with fL = (v ± vL)/(v ± vs) fs, uses in medicine (ultrasound, blood flow), the red shift of light and the expanding universe.",
    objectives: [
      "Explain the Doppler effect using wavefronts",
      "Calculate the frequency a listener hears",
      "Describe medical uses of the Doppler effect",
      "Explain red shift and what it tells us about the universe",
    ],
    styles: ["auditory", "visual"],
    xp: 80,
    terms: [
      { term: "Doppler effect", def: "The change in frequency (or pitch) of the sound detected by a listener because the sound source and the listener have different velocities relative to the medium." },
      { term: "Doppler equation", def: m`$f_L = \frac{v \pm v_L}{v \pm v_s}f_s$ – use the signs that make the frequency go UP when they approach and DOWN when they move apart.` },
      { term: "Source approaching", def: "The wavefronts bunch up: shorter wavelength, higher frequency (higher pitch)." },
      { term: "Source receding", def: "The wavefronts spread out: longer wavelength, lower frequency (lower pitch)." },
      { term: "Red shift", def: "Light from a galaxy moving away from us is shifted to longer wavelengths (towards red) – evidence that the universe is expanding." },
      { term: "Doppler flow meter", def: "Uses reflected ultrasound to measure the speed of blood flow (or a foetus's heartbeat)." },
    ],
    chunks: [
      {
        id: "explain",
        title: "Squashed and stretched waves",
        minutes: 8,
        blocks: [
          { type: "callout", variant: "real-world", md: m`Stand next to the N2 when a taxi hoots as it passes: "**neeee-yowww**". The driver hears the same note the whole time – only YOU hear the pitch drop. That's the **Doppler effect**.` },
          { type: "widget", widget: "doppler-lab" },
          { type: "text", md: m`As the source moves **towards** you, each new wavefront is emitted a little closer to you than the last: the wavelength is **shorter** and the frequency **higher**. Behind the source the wavefronts are spread out: **longer** wavelength, **lower** frequency.` },
        ],
      },
      {
        id: "equation",
        title: "The Doppler equation",
        minutes: 10,
        blocks: [
          { type: "text", md: m`$$f_L = \frac{v \pm v_L}{v \pm v_s}f_s$$ $v$ = speed of sound (usually $340\ \text{m·s}^{-1}$), $v_L$ = listener's speed, $v_s$ = source's speed. In CAPS questions usually one of them is stationary.` },
          {
            type: "table",
            headers: ["Situation", "Equation"],
            rows: [
              ["Source moves TOWARDS a still listener", m`$f_L = \frac{v}{v - v_s}f_s$ (bigger)`],
              ["Source moves AWAY from a still listener", m`$f_L = \frac{v}{v + v_s}f_s$ (smaller)`],
              ["Listener moves TOWARDS a still source", m`$f_L = \frac{v + v_L}{v}f_s$ (bigger)`],
              ["Listener moves AWAY from a still source", m`$f_L = \frac{v - v_L}{v}f_s$ (smaller)`],
            ],
          },
          {
            type: "worked",
            title: "Finding the speed of the ambulance",
            problem: m`An ambulance siren has a frequency of $800\ \text{Hz}$. A stationary listener hears $850\ \text{Hz}$ as it approaches. Calculate the speed of the ambulance ($v = 340\ \text{m·s}^{-1}$).`,
            steps: [
              { md: m`$f_L = \frac{v}{v - v_s}f_s \Rightarrow 850 = \frac{340}{340 - v_s}(800)$` },
              { md: m`$850(340 - v_s) = 272\,000 \Rightarrow 340 - v_s = 320$` },
              { md: m`$v_s = 20\ \text{m·s}^{-1}$ (72 km/h)` },
            ],
          },
          {
            type: "practice",
            id: "doppler-practice",
            problems: [
              { q: m`A car hooting at $400\ \text{Hz}$ moves at $30\ \text{m·s}^{-1}$ towards a stationary listener. What frequency is heard? ($v = 340\ \text{m·s}^{-1}$)`, answer: "438.71", unit: "Hz", solution: m`$$f_L = \frac{340}{340 - 30}(400) = 438{,}71\ \text{Hz}$$` },
              { q: m`The same car moves away at $30\ \text{m·s}^{-1}$. What frequency is heard now?`, answer: "367.57", unit: "Hz", solution: m`$$f_L = \frac{340}{340 + 30}(400) = 367{,}57\ \text{Hz}$$` },
              { q: m`A cyclist rides at $10\ \text{m·s}^{-1}$ towards a stationary $500\ \text{Hz}$ siren. What frequency does she hear?`, answer: "514.71", unit: "Hz", solution: m`$$f_L = \frac{340 + 10}{340}(500) = 514{,}71\ \text{Hz}$$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["doppler"], title: "Doppler drill" } },
        ],
      },
      {
        id: "uses",
        title: "Medicine and the universe",
        minutes: 6,
        blocks: [
          { type: "text", md: m`**In medicine:** ultrasound reflected off moving blood cells comes back with a changed frequency. A **Doppler flow meter** uses this to measure the speed of blood flow and find blocked arteries, and to listen to a baby's heartbeat during pregnancy.

**In space:** light from distant galaxies is **red-shifted** – their spectral lines are shifted to longer wavelengths. They are moving **away** from us, which tells astronomers the **universe is expanding**.` },
          { type: "widget", widget: "photoelectric-lab", props: { mode: "spectra", title: "Spectral lines – the fingerprints that shift" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["Approaching → higher frequency; receding → lower frequency.", m`$f_L = \frac{v \pm v_L}{v \pm v_s}f_s$.`, "The source's own frequency never changes.", "Red shift → galaxies moving away → expanding universe."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "doppler-quiz",
            questions: [
              { q: "As an ambulance moves away from you, the sound you hear has…", options: ["a higher frequency", "a lower frequency", "the same frequency", "a higher speed"], answer: 1, explain: "The wavefronts are stretched out behind it." },
              { q: "Red shift means that a galaxy is…", options: ["moving towards us", "moving away from us", "very hot", "made of hydrogen"], answer: 1, explain: "Wavelengths are stretched → it is receding." },
              { q: "The driver of the ambulance hears…", options: ["a higher pitch", "a lower pitch", "the actual siren frequency", "no sound"], answer: 2, explain: "There's no relative motion between the driver and the siren." },
              { q: "A Doppler flow meter is used to…", options: ["see bones", "measure blood flow", "kill cancer cells", "measure temperature"], answer: 1, explain: "Reflected ultrasound from moving blood." },
              { q: m`In $f_L = \frac{v}{v - v_s}f_s$ the source is moving…`, options: ["away from the listener", "towards the listener", "at the speed of sound", "not at all"], answer: 1, explain: "A smaller denominator gives a bigger frequency." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Circuits 12
  {
    slug: "internal-resistance",
    topic: "g12-circuits",
    order: 1,
    title: "Electric circuits: emf & internal resistance",
    tagline: "Why your car's headlights dim when you start the engine.",
    emoji: "🔋",
    caps: "CAPS Gr 12 · Electricity & magnetism: emf and internal resistance, ε = I(R + r), terminal potential difference, lost volts, series-parallel networks with internal resistance, power.",
    objectives: [
      "Define emf and internal resistance",
      m`Use $\varepsilon = I(R + r)$ and $V_{terminal} = \varepsilon - Ir$`,
      "Solve series-parallel networks with internal resistance",
      "Explain what happens to the readings when resistors are added or removed",
    ],
    styles: ["kinaesthetic", "read-write"],
    xp: 100,
    terms: [
      { term: "Emf (ε)", def: "The maximum energy provided by a battery per coulomb of charge passing through it – the voltmeter reading across the battery when no current flows." },
      { term: "Internal resistance (r)", def: "The resistance inside a battery, caused by the chemicals and materials it is made of." },
      { term: "Terminal potential difference", def: m`The potential difference across the battery's terminals when a current flows: $V = IR = \varepsilon - Ir$.` },
      { term: "Lost volts", def: m`The potential difference across the internal resistance: $Ir$. Energy is "lost" as heat inside the battery.` },
      { term: "Emf equation", def: m`$\varepsilon = I(R + r)$` },
    ],
    chunks: [
      {
        id: "emf",
        title: "Lost volts",
        minutes: 9,
        blocks: [
          { type: "callout", variant: "real-world", md: m`Turn the key in an old car with the headlights on – they dim. The starter motor draws a huge current, and the battery's **internal resistance** "uses up" more of its emf, so the terminal voltage drops.` },
          { type: "text", md: m`A real battery behaves like a perfect source of emf $\varepsilon$ in series with a small **internal resistance** $r$. $$\varepsilon = I(R + r) = V_{terminal} + Ir$$ The bigger the current, the more volts are "lost" inside: $V_{terminal} = \varepsilon - Ir$.` },
          { type: "widget", widget: "circuit-lab", props: { internal: true, layout: "series", title: "Watch the voltmeter as you change R" } },
          { type: "callout", variant: "key", md: m`**Switch open:** no current, no lost volts → the voltmeter reads the **emf**. **Switch closed:** the voltmeter reads the **terminal p.d.**, which is smaller.` },
        ],
      },
      {
        id: "calc",
        title: "Calculations",
        minutes: 10,
        blocks: [
          {
            type: "worked",
            title: "Finding the internal resistance",
            problem: m`A voltmeter across a battery reads $12\ \text{V}$ with the switch open. With the switch closed, the ammeter reads $2\ \text{A}$ and the voltmeter $11{,}2\ \text{V}$. Find (a) the internal resistance and (b) the external resistance.`,
            steps: [
              { md: m`Emf $\varepsilon = 12\ \text{V}$ (open switch)` },
              { md: m`(a) Lost volts $= 12 - 11{,}2 = 0{,}8\ \text{V} = Ir \Rightarrow r = \frac{0{,}8}{2} = 0{,}4\ \Omega$` },
              { md: m`(b) $R = \frac{V}{I} = \frac{11{,}2}{2} = 5{,}6\ \Omega$` },
            ],
          },
          {
            type: "worked",
            title: "Adding a resistor in parallel",
            problem: m`A second resistor is added in parallel to the external resistor. What happens to (a) the total current, (b) the terminal p.d.? Explain.`,
            steps: [
              { md: m`(a) The external resistance **decreases** (parallel), so the total resistance $R + r$ decreases and the current $I = \frac{\varepsilon}{R + r}$ **increases**.` },
              { md: m`(b) The lost volts $Ir$ **increase**, so the terminal p.d. $V = \varepsilon - Ir$ **decreases**.`, why: "This is a favourite exam explanation – always link resistance → current → lost volts → terminal p.d." },
            ],
          },
          {
            type: "practice",
            id: "internal-practice",
            problems: [
              { q: m`A battery of emf $9\ \text{V}$ and internal resistance $0{,}5\ \Omega$ is connected to a $4\ \Omega$ resistor. Calculate the current.`, answer: "2", unit: "A", solution: m`$$I = \frac{\varepsilon}{R + r} = \frac{9}{4{,}5} = 2\ \text{A}$$` },
              { q: m`For the same circuit, calculate the terminal potential difference.`, answer: "8", unit: "V", solution: m`$$V = IR = (2)(4) = 8\ \text{V}$$ (lost volts $= 1\ \text{V}$)` },
              { q: m`A $6\ \text{V}$ battery delivers $1{,}5\ \text{A}$ to a $3{,}6\ \Omega$ resistor. Calculate its internal resistance.`, answer: "0.4", unit: "Ω", solution: m`$$6 = 1{,}5(3{,}6 + r) \Rightarrow r = 0{,}4\ \Omega$$` },
              { q: m`A $12\ \text{V}$ battery ($r = 1\ \Omega$) is connected to $6\ \Omega$ and $3\ \Omega$ resistors in parallel. Calculate the total current.`, answer: "4", unit: "A", hint: "First find the parallel resistance.", solution: m`$$R_p = \frac{(6)(3)}{9} = 2\ \Omega \qquad I = \frac{12}{2 + 1} = 4\ \text{A}$$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["internal-resistance", "electric-power"], title: "Circuits drill" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "widget", widget: "circuit-lab", props: { internal: true, layout: "combo", title: "Exam-style network with internal resistance" } },
          { type: "keypoints", points: [m`$\varepsilon = I(R + r)$; $V_{terminal} = \varepsilon - Ir$.`, "Open switch → voltmeter reads the emf.", "Less external resistance → more current → more lost volts → lower terminal p.d.", "Work out parallel parts first."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "internal-quiz",
            questions: [
              { q: "When the switch is open, a voltmeter across the battery reads…", options: ["zero", "the terminal p.d.", "the emf", "the lost volts"], answer: 2, explain: "No current → no lost volts." },
              { q: "If the external resistance decreases, the terminal p.d.…", options: ["increases", "decreases", "stays the same", "becomes the emf"], answer: 1, explain: "Bigger current → bigger Ir → smaller V." },
              { q: "Internal resistance causes the battery to…", options: ["cool down", "heat up", "gain emf", "store charge"], answer: 1, explain: "Energy is dissipated inside the battery." },
              { q: m`A battery has $\varepsilon = 6\ \text{V}$ and gives $5{,}4\ \text{V}$ across its terminals. The lost volts are…`, options: ["5,4 V", "0,6 V", "6 V", "11,4 V"], answer: 1, explain: "6 − 5,4 = 0,6 V." },
              { q: "Adding a resistor in series to the external circuit makes the current…", options: ["increase", "decrease", "stay the same", "reverse"], answer: 1, explain: "Total resistance increases." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Electrodynamics
  {
    slug: "electrodynamics",
    topic: "g12-electrodynamics",
    order: 1,
    title: "Electrodynamics: motors, generators & AC",
    tagline: "How Eskom makes electricity – and how a fan turns it back into motion.",
    emoji: "⚙️",
    caps: "CAPS Gr 12 · Electricity & magnetism: electrical machines – motors and generators (AC and DC), the motor effect, split-ring commutators and slip rings, alternating current, rms values, average power.",
    objectives: [
      "Explain how an electric motor works (the motor effect)",
      "Explain how AC and DC generators work",
      "Compare slip rings and split-ring commutators",
      m`Calculate rms values: $V_{rms} = \frac{V_{max}}{\sqrt{2}}$ and average power`,
    ],
    styles: ["visual", "kinaesthetic"],
    xp: 90,
    terms: [
      { term: "Motor effect", def: m`A current-carrying conductor in a magnetic field experiences a force: $F = BIL$ (when perpendicular).` },
      { term: "Electric motor", def: "Converts electrical energy into mechanical (kinetic) energy." },
      { term: "Generator", def: "Converts mechanical energy into electrical energy by electromagnetic induction." },
      { term: "Slip rings", def: "Used in an AC generator: each end of the coil is always connected to the same brush, so the current alternates." },
      { term: "Split-ring commutator", def: "Used in DC motors and generators: reverses the connections every half turn so the current in the external circuit (or the torque) keeps one direction." },
      { term: "Alternating current (AC)", def: "Current that changes direction periodically – in South Africa at 50 Hz." },
      { term: "rms value", def: m`The DC value that would dissipate the same energy as the AC: $I_{rms} = \frac{I_{max}}{\sqrt{2}}$, $V_{rms} = \frac{V_{max}}{\sqrt{2}}$.` },
      { term: "Average power (AC)", def: m`$P_{ave} = V_{rms}I_{rms} = I_{rms}^2R = \frac{V_{rms}^2}{R}$` },
    ],
    chunks: [
      {
        id: "motor",
        title: "The electric motor",
        minutes: 8,
        blocks: [
          { type: "text", md: m`Put a current-carrying coil in a magnetic field and the two long sides feel forces in **opposite directions** – the coil turns. A **split-ring commutator** reverses the current every half turn so the coil keeps turning the same way.` },
          { type: "widget", widget: "generator-lab", props: { mode: "motor", title: "A DC motor" } },
          { type: "callout", variant: "real-world", md: m`Motors are in fans, fridges, washing machines, drills, the Gautrain, electric cars and the hard drive of a computer. To make a motor turn faster: more current, a stronger magnet, more turns on the coil.` },
        ],
      },
      {
        id: "generator",
        title: "Generators: AC and DC",
        minutes: 9,
        blocks: [
          { type: "text", md: m`Turn the motor by hand and it becomes a **generator**. As the coil rotates in the field, the flux through it changes, inducing an emf (Faraday's law). The emf is **maximum** when the plane of the coil is **parallel** to the field (flux changing fastest) and **zero** when it is perpendicular.` },
          { type: "widget", widget: "generator-lab", props: { mode: "ac" } },
          {
            type: "table",
            headers: ["", "AC generator", "DC generator"],
            rows: [
              ["Connection", "slip rings", "split-ring commutator"],
              ["Output", "sine wave – reverses direction", "pulses in one direction"],
              ["Example", "power stations, car alternators", "old dynamos, some battery chargers"],
            ],
          },
          { type: "widget", widget: "generator-lab", props: { mode: "dc", title: "Compare: a DC generator" } },
        ],
      },
      {
        id: "ac",
        title: "AC and rms values",
        minutes: 9,
        blocks: [
          { type: "text", md: m`South African mains electricity is **230 V AC at 50 Hz**. The voltage swings between $+325\ \text{V}$ and $-325\ \text{V}$; 230 V is the **rms** ("root mean square") value – the steady DC voltage that would give the same heating effect: $$V_{rms} = \frac{V_{max}}{\sqrt{2}} \qquad I_{rms} = \frac{I_{max}}{\sqrt{2}} \qquad P_{ave} = V_{rms}I_{rms}$$` },
          {
            type: "worked",
            title: "A kettle on the mains",
            problem: m`A kettle rated $2\,300\ \text{W}$ is connected to $230\ \text{V}$ rms. Calculate (a) the rms current, (b) the peak current and (c) the resistance of the element.`,
            steps: [
              { md: m`(a) $I_{rms} = \frac{P}{V_{rms}} = \frac{2\,300}{230} = 10\ \text{A}$` },
              { md: m`(b) $I_{max} = \sqrt{2}\,I_{rms} = 14{,}14\ \text{A}$` },
              { md: m`(c) $R = \frac{V_{rms}}{I_{rms}} = \frac{230}{10} = 23\ \Omega$` },
            ],
          },
          {
            type: "practice",
            id: "rms-practice",
            problems: [
              { q: m`The peak voltage of an AC supply is $170\ \text{V}$. Calculate the rms voltage.`, answer: "120.21", unit: "V", solution: m`$$V_{rms} = \frac{170}{\sqrt{2}} = 120{,}21\ \text{V}$$` },
              { q: m`An rms current of $3\ \text{A}$ flows through a $40\ \Omega$ resistor. Calculate the average power.`, answer: "360", unit: "W", solution: m`$$P_{ave} = I_{rms}^2R = (3)^2(40) = 360\ \text{W}$$` },
              { q: m`Calculate the peak voltage of the $230\ \text{V}$ rms mains.`, answer: "325.27", unit: "V", solution: m`$$V_{max} = \sqrt{2}(230) = 325{,}27\ \text{V}$$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["rms"], title: "AC & rms drill" } },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: ["Motor: electrical → mechanical; generator: mechanical → electrical.", "AC generator: slip rings; DC: split-ring commutator.", m`$V_{rms} = \frac{V_{max}}{\sqrt{2}}$, $P_{ave} = V_{rms}I_{rms}$.`, "SA mains: 230 V rms, 50 Hz."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "electrodynamics-quiz",
            questions: [
              { q: "An AC generator uses…", options: ["a split-ring commutator", "slip rings", "a battery", "a transformer"], answer: 1, explain: "Slip rings let the current alternate in the external circuit." },
              { q: "A generator converts…", options: ["electrical to mechanical energy", "mechanical to electrical energy", "heat to light", "chemical to electrical energy"], answer: 1, explain: "Moving a coil in a field induces a current." },
              { q: "The emf of a rotating coil is maximum when the plane of the coil is…", options: ["perpendicular to the field", "parallel to the field", "at 45°", "not moving"], answer: 1, explain: "That's when the flux changes fastest." },
              { q: m`The rms value of an AC voltage with peak $100\ \text{V}$ is…`, options: ["100 V", "141 V", "70,7 V", "50 V"], answer: 2, explain: m`$\frac{100}{\sqrt{2}} = 70{,}7\ \text{V}$.` },
              { q: "The frequency of SA mains electricity is…", options: ["60 Hz", "50 Hz", "230 Hz", "100 Hz"], answer: 1, explain: "Eskom's generators turn 50 times a second (for a 2-pole machine)." },
            ],
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ Photoelectric
  {
    slug: "photoelectric-effect",
    topic: "g12-photoelectric",
    order: 1,
    title: "The photoelectric effect & atomic spectra",
    tagline: "The experiment that proved light is made of particles.",
    emoji: "☀️",
    caps: "CAPS Gr 12 · Matter & materials: optical phenomena – the photoelectric effect, threshold frequency, work function, E = W₀ + Ek(max), the particle nature of light; emission and absorption spectra.",
    objectives: [
      "Describe the photoelectric effect",
      "Define threshold frequency and work function",
      m`Use $E = W_0 + E_{k(max)}$ and $W_0 = hf_0$`,
      "Explain how intensity and frequency affect the emission",
      "Explain emission and absorption line spectra",
    ],
    styles: ["visual", "read-write"],
    xp: 100,
    terms: [
      { term: "Photoelectric effect", def: "The process whereby electrons are ejected from a metal surface when light of suitable frequency is incident on that surface." },
      { term: "Threshold frequency (f₀)", def: "The minimum frequency of light needed to emit electrons from a certain metal surface." },
      { term: "Work function (W₀)", def: m`The minimum energy needed to emit an electron from the surface of a metal: $W_0 = hf_0$.` },
      { term: "Photoelectric equation", def: m`$E = W_0 + E_{k(max)}$, i.e. $hf = hf_0 + \tfrac{1}{2}mv_{max}^2$.` },
      { term: "Intensity", def: "The number of photons arriving per second (per unit area) – more intensity → more electrons, NOT faster electrons." },
      { term: "Emission spectrum", def: "Bright lines of specific wavelengths given off when excited electrons drop to lower energy levels." },
      { term: "Absorption spectrum", def: "Dark lines in a continuous spectrum where atoms have absorbed specific wavelengths to jump to higher energy levels." },
    ],
    chunks: [
      {
        id: "effect",
        title: "Light that knocks out electrons",
        minutes: 9,
        blocks: [
          { type: "callout", variant: "real-world", md: m`**Solar panels** on roofs across South Africa, the light sensor that switches on street lights, and the old automatic doors at the shops all depend on light ejecting electrons from materials.` },
          { type: "widget", widget: "photoelectric-lab" },
          { type: "text", md: m`Experiments showed three surprises the **wave** model couldn't explain:

1. Below a **threshold frequency**, no electrons come out – no matter how bright the light.
2. Above it, electrons come out **instantly**, even with dim light.
3. Brighter light gives **more** electrons, but **not faster** ones; higher frequency gives faster ones.

**Einstein's explanation (Nobel Prize 1921):** light is a stream of **photons**, each with energy $E = hf$. One photon gives all its energy to one electron.` },
        ],
      },
      {
        id: "equation",
        title: "The photoelectric equation",
        minutes: 10,
        blocks: [
          { type: "text", md: m`$$E = W_0 + E_{k(max)} \qquad hf = hf_0 + \tfrac{1}{2}mv_{max}^2$$ The photon's energy pays the "exit fee" (the work function $W_0$); what's left over is the electron's maximum kinetic energy.` },
          {
            type: "worked",
            title: "UV light on zinc",
            problem: m`Ultraviolet light of wavelength $200\ \text{nm}$ shines on zinc (work function $6{,}9 \times 10^{-19}\ \text{J}$). Calculate (a) the threshold frequency of zinc, (b) the maximum kinetic energy of the ejected electrons.`,
            steps: [
              { md: m`(a) $f_0 = \frac{W_0}{h} = \frac{6{,}9 \times 10^{-19}}{6{,}63 \times 10^{-34}} = 1{,}04 \times 10^{15}\ \text{Hz}$` },
              { md: m`(b) $E = \frac{hc}{\lambda} = \frac{(6{,}63 \times 10^{-34})(3 \times 10^{8})}{200 \times 10^{-9}} = 9{,}95 \times 10^{-19}\ \text{J}$` },
              { md: m`$E_{k(max)} = E - W_0 = 9{,}95 \times 10^{-19} - 6{,}9 \times 10^{-19} = 3{,}05 \times 10^{-19}\ \text{J}$` },
            ],
          },
          {
            type: "practice",
            id: "photo-practice",
            problems: [
              { q: m`The threshold frequency of potassium is $5{,}55 \times 10^{14}\ \text{Hz}$. Calculate its work function.`, answer: "3.68e-19", unit: "J", solution: m`$$W_0 = hf_0 = (6{,}63 \times 10^{-34})(5{,}55 \times 10^{14}) = 3{,}68 \times 10^{-19}\ \text{J}$$` },
              { q: m`Light of frequency $8 \times 10^{14}\ \text{Hz}$ falls on a metal with $W_0 = 3{,}5 \times 10^{-19}\ \text{J}$. Calculate $E_{k(max)}$.`, answer: "1.804e-19", unit: "J", solution: m`$$E_k = hf - W_0 = (6{,}63 \times 10^{-34})(8 \times 10^{14}) - 3{,}5 \times 10^{-19} = 1{,}80 \times 10^{-19}\ \text{J}$$` },
              { q: m`An electron is ejected with $E_k = 2 \times 10^{-19}\ \text{J}$. Calculate its speed ($m_e = 9{,}11 \times 10^{-31}\ \text{kg}$).`, answer: "6.63e5", unit: "m·s⁻¹", rtol: 0.015, solution: m`$$v = \sqrt{\frac{2E_k}{m}} = \sqrt{\frac{2(2 \times 10^{-19})}{9{,}11 \times 10^{-31}}} = 6{,}63 \times 10^{5}\ \text{m·s}^{-1}$$` },
            ],
          },
          { type: "widget", widget: "drill", props: { generators: ["photoelectric", "photon-energy"], title: "Photoelectric drill" } },
        ],
      },
      {
        id: "spectra",
        title: "Emission & absorption spectra",
        minutes: 7,
        blocks: [
          { type: "text", md: m`Electrons in atoms can only have certain **energy levels**. When an excited electron drops to a lower level, it emits a photon with exactly the energy difference: $$\Delta E = hf = \frac{hc}{\lambda}$$ This gives an **emission spectrum** of bright lines. Shine white light through a cool gas and the same wavelengths are **absorbed**, leaving dark lines: an **absorption spectrum**.` },
          { type: "widget", widget: "photoelectric-lab", props: { mode: "spectra" } },
          { type: "callout", variant: "real-world", md: m`Every element has its own pattern of lines – a fingerprint. By looking at the absorption lines in sunlight, scientists discovered **helium** in the Sun (helios) before it was found on Earth! The orange glow of sodium street lights is sodium's emission line at 589 nm.` },
        ],
      },
      {
        id: "check",
        title: "Quick check",
        minutes: 4,
        blocks: [
          { type: "keypoints", points: [m`$E = W_0 + E_{k(max)}$, $W_0 = hf_0$, $E = hf = \frac{hc}{\lambda}$.`, "Below f₀: no electrons, whatever the intensity.", "Intensity → number of electrons; frequency → their energy.", "The photoelectric effect shows light behaves as particles."] },
          { type: "terms" },
          {
            type: "quiz",
            id: "photo-quiz",
            questions: [
              { q: "Increasing the intensity of light above the threshold frequency…", options: ["increases the speed of electrons", "increases the number of electrons ejected", "has no effect", "decreases the work function"], answer: 1, explain: "More photons per second → more electrons per second." },
              { q: "The work function depends on…", options: ["the frequency of the light", "the intensity", "the metal", "the speed of the electrons"], answer: 2, explain: "Each metal holds its electrons with a different strength." },
              { q: "Red light shines on a metal and no electrons are ejected. To eject electrons you could use…", options: ["brighter red light", "ultraviolet light", "infrared light", "a longer exposure time"], answer: 1, explain: "Higher frequency photons have more energy." },
              { q: "The photoelectric effect supports the…", options: ["wave nature of light", "particle nature of light", "Doppler effect", "law of reflection"], answer: 1, explain: "One photon gives its energy to one electron." },
              { q: "Bright lines on a dark background form an…", options: ["absorption spectrum", "emission spectrum", "continuous spectrum", "X-ray"], answer: 1, explain: "Light emitted by excited atoms." },
            ],
          },
        ],
      },
    ],
  },
];
