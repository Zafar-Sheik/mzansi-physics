/**
 * Physics problem generators (Paper 1). Each is deterministic for a seed so the
 * test-suite can check that every generated memo answer passes its own checker
 * and every formula renders in KaTeX.
 */
import { seededRandom } from "@/lib/utils";
import { ans, CONST, round, sciAns, sciTex, tex } from "./numbers";
import { type Generator, int, pick, step } from "./gen-kit";

const g = CONST.g;

// ------------------------------------------------------------ Grade 10 motion
const eqMotion: Generator = {
  id: "eq-motion",
  title: "Equations of motion",
  topic: "g10-motion",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const t = int(r, 0, 3);
    const thing = pick(r, ["A taxi", "A cyclist", "A cheetah", "A Gautrain carriage", "A minibus", "A skateboarder"]);
    if (t === 0) {
      const u = int(r, 0, 12);
      const a = step(r, 0.5, 4, 0.5);
      const time = int(r, 2, 10);
      const v = u + a * time;
      return {
        q: `${thing} moving at $${tex(u)}\\ \\text{m·s}^{-1}$ accelerates uniformly at $${tex(a)}\\ \\text{m·s}^{-2}$ for $${time}\\ \\text{s}$. Calculate its final velocity.`,
        answer: ans(v),
        unit: "m·s⁻¹",
        hint: "You know $v_i$, $a$ and $\\Delta t$ – use $v_f = v_i + a\\Delta t$.",
        solution: `$$v_f = v_i + a\\Delta t = ${tex(u)} + (${tex(a)})(${time}) = ${tex(v)}\\ \\text{m·s}^{-1}$$`,
      };
    }
    if (t === 1) {
      const u = int(r, 0, 10);
      const a = step(r, 0.5, 3, 0.5);
      const time = int(r, 2, 8);
      const dx = u * time + 0.5 * a * time * time;
      return {
        q: `${thing} starts with a velocity of $${tex(u)}\\ \\text{m·s}^{-1}$ and accelerates at $${tex(a)}\\ \\text{m·s}^{-2}$. How far does it travel in $${time}\\ \\text{s}$?`,
        answer: ans(dx),
        unit: "m",
        hint: "Displacement from $v_i$, $a$ and $\\Delta t$: $\\Delta x = v_i\\Delta t + \\tfrac{1}{2}a\\Delta t^2$.",
        solution: `$$\\Delta x = v_i\\Delta t + \\tfrac{1}{2}a\\Delta t^2 = (${tex(u)})(${time}) + \\tfrac{1}{2}(${tex(a)})(${time})^2 = ${tex(dx)}\\ \\text{m}$$`,
      };
    }
    if (t === 2) {
      const u = int(r, 15, 30);
      const dx = int(r, 20, 80);
      const a = -(u * u) / (2 * dx);
      return {
        q: `A driver travelling at $${u}\\ \\text{m·s}^{-1}$ brakes and stops in $${dx}\\ \\text{m}$. Calculate the acceleration of the car.`,
        answer: ans(a),
        unit: "m·s⁻²",
        hint: "No time is given – use $v_f^2 = v_i^2 + 2a\\Delta x$ with $v_f = 0$.",
        solution: [
          `$$v_f^2 = v_i^2 + 2a\\Delta x$$`,
          `$$0 = (${u})^2 + 2a(${dx})$$`,
          `$$a = ${tex(a)}\\ \\text{m·s}^{-2}$$`,
          `The negative sign means the acceleration is opposite to the motion (the car is slowing down): $${tex(Math.abs(a))}\\ \\text{m·s}^{-2}$ backwards.`,
        ].join("\n"),
      };
    }
    const u = int(r, 2, 10);
    const v = u + int(r, 4, 20);
    const time = int(r, 2, 8);
    const dx = ((u + v) / 2) * time;
    return {
      q: `${thing} speeds up uniformly from $${u}\\ \\text{m·s}^{-1}$ to $${v}\\ \\text{m·s}^{-1}$ in $${time}\\ \\text{s}$. Calculate its displacement in this time.`,
      answer: ans(dx),
      unit: "m",
      hint: "With $v_i$, $v_f$ and $\\Delta t$ use $\\Delta x = \\left(\\frac{v_i + v_f}{2}\\right)\\Delta t$.",
      solution: `$$\\Delta x = \\left(\\frac{v_i + v_f}{2}\\right)\\Delta t = \\left(\\frac{${u} + ${v}}{2}\\right)(${time}) = ${tex(dx)}\\ \\text{m}$$`,
    };
  },
};

const speedVelocity: Generator = {
  id: "speed-velocity",
  title: "Speed vs velocity",
  topic: "g10-motion",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const east = int(r, 200, 900);
    const west = int(r, 50, east - 50);
    const time = int(r, 2, 10) * 60;
    const which = int(r, 0, 1);
    const dist = east + west;
    const disp = east - west;
    const val = which === 0 ? dist / time : disp / time;
    return {
      q: `Thandi walks $${east}\\ \\text{m}$ east and then $${west}\\ \\text{m}$ west. The walk takes $${time / 60}$ minutes. Calculate her average ${which === 0 ? "**speed**" : "**velocity** (magnitude)"}.`,
      answer: ans(val),
      unit: "m·s⁻¹",
      hint: which === 0 ? "Speed uses the total **distance** travelled. Convert minutes to seconds." : "Velocity uses the **displacement** (east minus west). Convert minutes to seconds.",
      solution: which === 0
        ? `Distance $= ${east} + ${west} = ${dist}\\ \\text{m}$, $\\Delta t = ${time}\\ \\text{s}$.\n$$\\text{average speed} = \\frac{\\text{distance}}{\\Delta t} = \\frac{${dist}}{${time}} = ${tex(val)}\\ \\text{m·s}^{-1}$$`
        : `Displacement $= ${east} - ${west} = ${disp}\\ \\text{m}$ east, $\\Delta t = ${time}\\ \\text{s}$.\n$$v_{ave} = \\frac{\\Delta x}{\\Delta t} = \\frac{${disp}}{${time}} = ${tex(val)}\\ \\text{m·s}^{-1}\\ \\text{east}$$`,
    };
  },
};

// ------------------------------------------------------------ Grade 10 energy
const mechEnergy: Generator = {
  id: "mech-energy",
  title: "Kinetic & potential energy",
  topic: "g10-energy",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const t = int(r, 0, 3);
    if (t === 0) {
      const m = int(r, 2, 80);
      const v = int(r, 2, 25);
      const ek = 0.5 * m * v * v;
      return {
        q: `Calculate the kinetic energy of a $${m}\\ \\text{kg}$ object moving at $${v}\\ \\text{m·s}^{-1}$.`,
        answer: ans(ek),
        unit: "J",
        hint: "$E_k = \\tfrac{1}{2}mv^2$ – square the speed first.",
        solution: `$$E_k = \\tfrac{1}{2}mv^2 = \\tfrac{1}{2}(${m})(${v})^2 = ${tex(ek)}\\ \\text{J}$$`,
      };
    }
    if (t === 1) {
      const m = step(r, 0.5, 60, 0.5);
      const h = int(r, 2, 50);
      const ep = m * g * h;
      return {
        q: `A $${tex(m)}\\ \\text{kg}$ object is lifted to a height of $${h}\\ \\text{m}$. Calculate its gravitational potential energy.`,
        answer: ans(ep),
        unit: "J",
        hint: "$E_p = mgh$ with $g = 9{,}8\\ \\text{m·s}^{-2}$.",
        solution: `$$E_p = mgh = (${tex(m)})(9{,}8)(${h}) = ${tex(ep)}\\ \\text{J}$$`,
      };
    }
    if (t === 2) {
      const h = int(r, 2, 40);
      const v = Math.sqrt(2 * g * h);
      return {
        q: `A ball is dropped from rest from a height of $${h}\\ \\text{m}$. Ignore air resistance. Use the conservation of mechanical energy to calculate its speed just before it hits the ground.`,
        answer: ans(v),
        unit: "m·s⁻¹",
        hint: "$E_{p,top} = E_{k,bottom}$, so $mgh = \\tfrac{1}{2}mv^2$ – the mass cancels.",
        solution: [
          `$$E_{M,top} = E_{M,bottom}$$`,
          `$$mgh + 0 = 0 + \\tfrac{1}{2}mv^2 \\;\\Rightarrow\\; v = \\sqrt{2gh} = \\sqrt{2(9{,}8)(${h})} = ${tex(v)}\\ \\text{m·s}^{-1}$$`,
        ].join("\n"),
      };
    }
    const v = int(r, 4, 20);
    const h = (v * v) / (2 * g);
    return {
      q: `A skateboarder rolls at $${v}\\ \\text{m·s}^{-1}$ towards a smooth ramp. Ignoring friction, what is the maximum height she can reach?`,
      answer: ans(h),
      unit: "m",
      hint: "All the kinetic energy becomes potential energy at the top: $\\tfrac{1}{2}mv^2 = mgh$.",
      solution: `$$\\tfrac{1}{2}mv^2 = mgh \\;\\Rightarrow\\; h = \\frac{v^2}{2g} = \\frac{(${v})^2}{2(9{,}8)} = ${tex(h)}\\ \\text{m}$$`,
    };
  },
};

// ------------------------------------------------------------ Grade 10 waves, sound, EM
const waveEquation: Generator = {
  id: "wave-equation",
  title: "The wave equation",
  topic: "g10-waves",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const t = int(r, 0, 2);
    if (t === 0) {
      const f = int(r, 2, 50);
      const lam = step(r, 0.2, 5, 0.1);
      const v = f * lam;
      return {
        q: `A wave has a frequency of $${f}\\ \\text{Hz}$ and a wavelength of $${tex(lam)}\\ \\text{m}$. Calculate the speed of the wave.`,
        answer: ans(v),
        unit: "m·s⁻¹",
        hint: "$v = f\\lambda$",
        solution: `$$v = f\\lambda = (${f})(${tex(lam)}) = ${tex(v)}\\ \\text{m·s}^{-1}$$`,
      };
    }
    if (t === 1) {
      const v = pick(r, [340, 330, 1500, 5, 12, 24]);
      const f = pick(r, [50, 100, 250, 440, 512, 1000, 2, 4, 8]);
      const lam = v / f;
      return {
        q: `A wave travels at $${v}\\ \\text{m·s}^{-1}$ with a frequency of $${f}\\ \\text{Hz}$. Calculate its wavelength.`,
        answer: ans(lam, 3),
        unit: "m",
        hint: "Rearrange $v = f\\lambda$ to $\\lambda = \\frac{v}{f}$.",
        solution: `$$\\lambda = \\frac{v}{f} = \\frac{${v}}{${f}} = ${tex(lam, 3)}\\ \\text{m}$$`,
      };
    }
    const n = int(r, 5, 40);
    const time = int(r, 2, 10);
    const f = n / time;
    const T = 1 / f;
    const askT = r() < 0.5;
    return {
      q: `${n} complete waves pass a point in $${time}\\ \\text{s}$. Calculate the ${askT ? "period" : "frequency"} of the wave.`,
      answer: askT ? ans(T, 3) : ans(f, 3),
      unit: askT ? "s" : "Hz",
      hint: askT ? "Frequency = waves per second; then $T = \\frac{1}{f}$." : "Frequency = number of waves per second.",
      solution: askT
        ? `$$f = \\frac{${n}}{${time}} = ${tex(f, 3)}\\ \\text{Hz}, \\qquad T = \\frac{1}{f} = ${tex(T, 3)}\\ \\text{s}$$`
        : `$$f = \\frac{\\text{number of waves}}{\\text{time}} = \\frac{${n}}{${time}} = ${tex(f, 3)}\\ \\text{Hz}$$`,
    };
  },
};

const echo: Generator = {
  id: "echo",
  title: "Echoes & the speed of sound",
  topic: "g10-sound",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const water = r() < 0.4;
    const v = water ? 1500 : 340;
    const time = step(r, 0.2, 4, 0.1);
    const d = (v * time) / 2;
    return {
      q: water
        ? `A ship's sonar sends an ultrasound pulse to the sea floor. The echo returns after $${tex(time)}\\ \\text{s}$. If sound travels at $1\\,500\\ \\text{m·s}^{-1}$ in sea water, how deep is the sea?`
        : `Sipho shouts towards a cliff and hears the echo $${tex(time)}\\ \\text{s}$ later. The speed of sound in air is $340\\ \\text{m·s}^{-1}$. How far away is the cliff?`,
      answer: ans(d),
      unit: "m",
      hint: "The sound travels there **and back** – the distance to the reflector is half the total.",
      solution: `$$\\text{total distance} = v\\Delta t = (${v})(${tex(time)}) = ${tex(v * time)}\\ \\text{m}$$\n$$\\text{distance to reflector} = \\frac{${tex(v * time)}}{2} = ${tex(d)}\\ \\text{m}$$`,
    };
  },
};

const photonEnergy: Generator = {
  id: "photon-energy",
  title: "Photon energy",
  topic: "g10-em",
  make(seed) {
    const r = seededRandom(seed);
    const [name, nm] = pick(r, [["red light", 700], ["orange light", 610], ["green light", 530], ["blue light", 470], ["violet light", 400], ["ultraviolet radiation", 250]] as const);
    const lam = nm * 1e-9;
    const f = CONST.c / lam;
    const E = CONST.h * f;
    const askF = r() < 0.4;
    return {
      q: askF
        ? `Calculate the frequency of ${name} with a wavelength of $${nm}\\ \\text{nm}$.`
        : `Calculate the energy of one photon of ${name} with a wavelength of $${nm}\\ \\text{nm}$.`,
      answer: askF ? sciAns(f) : sciAns(E),
      unit: askF ? "Hz" : "J",
      hint: askF ? "$c = f\\lambda$, so $f = \\frac{c}{\\lambda}$. Remember $1\\ \\text{nm} = 10^{-9}\\ \\text{m}$." : "$E = hf = \\frac{hc}{\\lambda}$ with $h = 6{,}63 \\times 10^{-34}\\ \\text{J·s}$. Convert nm to m first.",
      solution: askF
        ? `$$f = \\frac{c}{\\lambda} = \\frac{3 \\times 10^{8}}{${nm} \\times 10^{-9}} = ${sciTex(f)}\\ \\text{Hz}$$`
        : `$$E = \\frac{hc}{\\lambda} = \\frac{(6{,}63 \\times 10^{-34})(3 \\times 10^{8})}{${nm} \\times 10^{-9}} = ${sciTex(E)}\\ \\text{J}$$`,
    };
  },
};

// ------------------------------------------------------------ Grade 10 electricity
const chargeSharing: Generator = {
  id: "charge-sharing",
  title: "Charge sharing & electrons",
  topic: "g10-electrostatics",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const q1 = int(r, -12, 12) || 4;
    let q2 = int(r, -12, 12);
    if ((q1 + q2) % 2 !== 0) q2 += 1;
    if (q2 === q1) q2 -= 2;
    const share = (q1 + q2) / 2;
    const askN = r() < 0.5;
    const dq = Math.abs(share - q1) * 1e-9;
    const n = dq / CONST.e;
    const qs = (x: number) => `${x > 0 ? "+" : ""}${x}\\ \\text{nC}`;
    return {
      q: askN
        ? `Two identical metal spheres carry charges of $${qs(q1)}$ and $${qs(q2)}$. They touch and are separated. How many electrons were transferred?`
        : `Two identical metal spheres carry charges of $${qs(q1)}$ and $${qs(q2)}$. They touch and are then separated. What is the charge on each sphere afterwards (in nC)?`,
      answer: askN ? sciAns(n) : ans(share),
      unit: askN ? "electrons" : "nC",
      hint: askN ? "First find the new charge on each sphere: $Q = \\frac{Q_1 + Q_2}{2}$. Then $n = \\frac{\\Delta Q}{q_e}$ with $q_e = 1{,}6 \\times 10^{-19}\\ \\text{C}$." : "Identical spheres share the total charge equally: $Q = \\frac{Q_1 + Q_2}{2}$.",
      solution: [
        `$$Q_{new} = \\frac{Q_1 + Q_2}{2} = \\frac{(${q1}) + (${q2})}{2} = ${share}\\ \\text{nC}$$`,
        ...(askN
          ? [
            `Charge gained or lost by sphere 1: $\\Delta Q = ${share} - (${q1}) = ${share - q1}\\ \\text{nC} = ${sciTex((share - q1) * 1e-9)}\\ \\text{C}$`,
            `$$n = \\frac{|\\Delta Q|}{q_e} = \\frac{${sciTex(dq)}}{1{,}6 \\times 10^{-19}} = ${sciTex(n)}\\ \\text{electrons}$$`,
          ]
          : []),
      ].join("\n"),
    };
  },
};

const resistors: Generator = {
  id: "resistors",
  title: "Series & parallel resistors",
  topic: "g10-circuits",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const t = int(r, 0, 2);
    if (t === 0) {
      const R = [int(r, 1, 12), int(r, 1, 12), int(r, 1, 12)].slice(0, int(r, 2, 3));
      const Rs = R.reduce((a, b) => a + b, 0);
      return {
        q: `Resistors of ${R.map((x) => `$${x}\\ \\Omega$`).join(", ")} are connected **in series**. Calculate the total resistance.`,
        answer: ans(Rs),
        unit: "Ω",
        hint: "In series, resistances simply add: $R_s = R_1 + R_2 + \\dots$",
        solution: `$$R_s = ${R.join(" + ")} = ${Rs}\\ \\Omega$$`,
      };
    }
    if (t === 1) {
      const [a, b] = pick(r, [[2, 2], [3, 6], [4, 4], [6, 12], [4, 12], [10, 10], [5, 20], [12, 6], [6, 6], [20, 30]] as const);
      const Rp = (a * b) / (a + b);
      return {
        q: `Resistors of $${a}\\ \\Omega$ and $${b}\\ \\Omega$ are connected **in parallel**. Calculate the total (equivalent) resistance.`,
        answer: ans(Rp),
        unit: "Ω",
        hint: "$\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2}$ – or for two resistors, $R_p = \\frac{R_1R_2}{R_1 + R_2}$.",
        solution: `$$\\frac{1}{R_p} = \\frac{1}{${a}} + \\frac{1}{${b}} \\;\\Rightarrow\\; R_p = \\frac{(${a})(${b})}{${a} + ${b}} = ${tex(Rp)}\\ \\Omega$$`,
      };
    }
    const I = step(r, 0.2, 3, 0.1);
    const time = int(r, 10, 120);
    const Q = I * time;
    return {
      q: `A current of $${tex(I)}\\ \\text{A}$ flows through a bulb for $${time}\\ \\text{s}$. How much charge passes through the bulb?`,
      answer: ans(Q),
      unit: "C",
      hint: "$Q = I\\Delta t$",
      solution: `$$Q = I\\Delta t = (${tex(I)})(${time}) = ${tex(Q)}\\ \\text{C}$$`,
    };
  },
};

// ------------------------------------------------------------ Grade 11
const vectorResultant: Generator = {
  id: "vector-resultant",
  title: "Resultants & components",
  topic: "g11-vectors",
  make(seed) {
    const r = seededRandom(seed);
    const t = int(r, 0, 1);
    if (t === 0) {
      const [a, b] = pick(r, [[3, 4], [6, 8], [5, 12], [8, 15], [7, 24], [9, 12], [10, 6], [20, 15], [12, 9]] as const);
      const R = Math.hypot(a, b);
      const askAngle = r() < 0.5;
      const theta = (Math.atan(b / a) * 180) / Math.PI;
      return {
        q: `Two forces act on an object: $${a}\\ \\text{N}$ east and $${b}\\ \\text{N}$ north. ${askAngle ? "Calculate the angle between the resultant and the east direction." : "Calculate the magnitude of the resultant force."}`,
        answer: askAngle ? ans(theta) : ans(R),
        unit: askAngle ? "°" : "N",
        hint: askAngle ? "$\\tan\\theta = \\frac{\\text{north}}{\\text{east}}$" : "The forces are perpendicular – use Pythagoras.",
        solution: askAngle
          ? `$$\\tan\\theta = \\frac{${b}}{${a}} \\;\\Rightarrow\\; \\theta = ${tex(theta)}^\\circ \\text{ (north of east)}$$`
          : `$$F_R = \\sqrt{${a}^2 + ${b}^2} = ${tex(R)}\\ \\text{N}$$`,
      };
    }
    const F = int(r, 10, 200);
    const angle = pick(r, [20, 25, 30, 35, 40, 45, 50, 60]);
    const horiz = r() < 0.5;
    const comp = horiz ? F * Math.cos((angle * Math.PI) / 180) : F * Math.sin((angle * Math.PI) / 180);
    return {
      q: `A learner pulls a trolley with a force of $${F}\\ \\text{N}$ at $${angle}^\\circ$ above the horizontal. Calculate the ${horiz ? "horizontal" : "vertical"} component of the force.`,
      answer: ans(comp),
      unit: "N",
      hint: horiz ? "Horizontal component: $F_x = F\\cos\\theta$." : "Vertical component: $F_y = F\\sin\\theta$.",
      solution: `$$F_${horiz ? "x" : "y"} = F\\${horiz ? "cos" : "sin"}\\theta = ${F}\\${horiz ? "cos" : "sin"} ${angle}^\\circ = ${tex(comp)}\\ \\text{N}$$`,
    };
  },
};

const newton2: Generator = {
  id: "newton-second",
  title: "Newton's second law",
  topic: "g11-newton",
  make(seed) {
    const r = seededRandom(seed);
    const t = int(r, 0, 3);
    if (t === 0) {
      const m = int(r, 2, 50);
      const F = int(r, 10, 200);
      const f = int(r, 0, Math.floor(F * 0.6));
      const a = (F - f) / m;
      return {
        q: `A $${m}\\ \\text{kg}$ crate is pulled across a floor by a horizontal force of $${F}\\ \\text{N}$. The kinetic friction is $${f}\\ \\text{N}$. Calculate the acceleration of the crate.`,
        answer: ans(a),
        unit: "m·s⁻²",
        hint: "$F_{net} = ma$, and $F_{net} = F_{applied} - f_k$ (take the direction of motion as positive).",
        solution: `$$F_{net} = ma \\;\\Rightarrow\\; ${F} - ${f} = ${m}a \\;\\Rightarrow\\; a = ${tex(a)}\\ \\text{m·s}^{-2}$$`,
      };
    }
    if (t === 1) {
      const m = int(r, 2, 40);
      const mu = pick(r, [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5]);
      const fk = mu * m * g;
      return {
        q: `A $${m}\\ \\text{kg}$ box slides on a horizontal surface. The coefficient of kinetic friction is $${tex(mu)}$. Calculate the kinetic frictional force.`,
        answer: ans(fk),
        unit: "N",
        hint: "$f_k = \\mu_k N$, and on a horizontal surface $N = mg$.",
        solution: `$$N = mg = (${m})(9{,}8) = ${tex(m * g)}\\ \\text{N}$$\n$$f_k = \\mu_k N = (${tex(mu)})(${tex(m * g)}) = ${tex(fk)}\\ \\text{N}$$`,
      };
    }
    if (t === 2) {
      const m = int(r, 2, 30);
      const angle = pick(r, [15, 20, 25, 30, 35, 40]);
      const rad = (angle * Math.PI) / 180;
      const along = m * g * Math.sin(rad);
      const perp = m * g * Math.cos(rad);
      const askPar = r() < 0.5;
      return {
        q: `A $${m}\\ \\text{kg}$ block rests on a slope inclined at $${angle}^\\circ$. Calculate the component of its weight ${askPar ? "**parallel** to the slope" : "**perpendicular** to the slope"}.`,
        answer: ans(askPar ? along : perp),
        unit: "N",
        hint: askPar ? "$F_{g\\parallel} = mg\\sin\\theta$" : "$F_{g\\perp} = mg\\cos\\theta$",
        solution: askPar
          ? `$$F_{g\\parallel} = mg\\sin\\theta = (${m})(9{,}8)\\sin ${angle}^\\circ = ${tex(along)}\\ \\text{N}$$`
          : `$$F_{g\\perp} = mg\\cos\\theta = (${m})(9{,}8)\\cos ${angle}^\\circ = ${tex(perp)}\\ \\text{N}$$`,
      };
    }
    // Two blocks connected by a string, pulled by F on a frictionless surface
    const m1 = int(r, 1, 10);
    const m2 = int(r, 1, 10);
    const F = int(r, 10, 80);
    const a = F / (m1 + m2);
    const T = m1 * a;
    const askT = r() < 0.5;
    return {
      q: `Blocks A ($${m1}\\ \\text{kg}$) and B ($${m2}\\ \\text{kg}$) are joined by a light string on a frictionless floor. A force of $${F}\\ \\text{N}$ pulls B, which pulls A. Calculate ${askT ? "the tension in the string" : "the acceleration of the system"}.`,
      answer: ans(askT ? T : a),
      unit: askT ? "N" : "m·s⁻²",
      hint: askT ? "First find $a$ for the whole system, then apply $F_{net} = ma$ to A alone: only the tension pulls A." : "Treat both blocks as one system: $F = (m_A + m_B)a$.",
      solution: [
        `Whole system: $$F = (m_A + m_B)a \\;\\Rightarrow\\; ${F} = (${m1 + m2})a \\;\\Rightarrow\\; a = ${tex(a)}\\ \\text{m·s}^{-2}$$`,
        ...(askT ? [`Block A: $$T = m_Aa = (${m1})(${tex(a)}) = ${tex(T)}\\ \\text{N}$$`] : []),
      ].join("\n"),
    };
  },
};

const gravitation: Generator = {
  id: "gravitation",
  title: "Universal gravitation",
  topic: "g11-gravitation",
  make(seed) {
    const r = seededRandom(seed);
    const t = int(r, 0, 2);
    if (t === 0) {
      const k = pick(r, [2, 3, 4, 0.5]);
      const F = int(r, 8, 400);
      const F2 = F / (k * k);
      return {
        q: `The gravitational force between two objects is $${F}\\ \\text{N}$. The distance between their centres is changed to $${k === 0.5 ? "half" : `${k} times`}$ the original distance. Calculate the new force.`,
        answer: ans(F2),
        unit: "N",
        hint: "$F \\propto \\frac{1}{r^2}$ (inverse square law).",
        solution: `$$F_{new} = \\frac{F}{(${tex(k)})^2} = \\frac{${F}}{${tex(k * k)}} = ${tex(F2)}\\ \\text{N}$$`,
      };
    }
    if (t === 1) {
      const m1 = int(r, 50, 120);
      const m2 = int(r, 50, 120);
      const d = step(r, 0.5, 3, 0.5);
      const F = (CONST.G * m1 * m2) / (d * d);
      return {
        q: `Two learners of mass $${m1}\\ \\text{kg}$ and $${m2}\\ \\text{kg}$ sit $${tex(d)}\\ \\text{m}$ apart. Calculate the gravitational force between them.`,
        answer: sciAns(F),
        unit: "N",
        hint: "$F = \\frac{Gm_1m_2}{r^2}$ with $G = 6{,}67 \\times 10^{-11}\\ \\text{N·m}^2\\text{·kg}^{-2}$.",
        solution: `$$F = \\frac{Gm_1m_2}{r^2} = \\frac{(6{,}67 \\times 10^{-11})(${m1})(${m2})}{(${tex(d)})^2} = ${sciTex(F)}\\ \\text{N}$$`,
      };
    }
    const [planet, M, R] = pick(r, [["Mars", 6.42e23, 3.39e6], ["the Moon", 7.35e22, 1.74e6], ["Venus", 4.87e24, 6.05e6], ["Mercury", 3.3e23, 2.44e6]] as const);
    const gp = (CONST.G * M) / (R * R);
    return {
      q: `${planet} has a mass of $${sciTex(M)}\\ \\text{kg}$ and a radius of $${sciTex(R)}\\ \\text{m}$. Calculate the gravitational acceleration at its surface.`,
      answer: ans(gp),
      unit: "m·s⁻²",
      hint: "$g = \\frac{GM}{R^2}$",
      solution: `$$g = \\frac{GM}{R^2} = \\frac{(6{,}67 \\times 10^{-11})(${sciTex(M)})}{(${sciTex(R)})^2} = ${tex(gp)}\\ \\text{m·s}^{-2}$$`,
    };
  },
};

const snell: Generator = {
  id: "snell",
  title: "Snell's law & critical angle",
  topic: "g11-optics",
  make(seed) {
    const r = seededRandom(seed);
    const [name, n] = pick(r, [["water", 1.33], ["glass", 1.5], ["crown glass", 1.52], ["diamond", 2.42], ["Perspex", 1.49], ["ice", 1.31]] as const);
    const t = int(r, 0, 2);
    if (t === 0) {
      const i = pick(r, [20, 25, 30, 35, 40, 45, 50, 55, 60]);
      const ref = (Math.asin(Math.sin((i * Math.PI) / 180) / n) * 180) / Math.PI;
      return {
        q: `Light travels from air ($n = 1$) into ${name} ($n = ${tex(n)}$) with an angle of incidence of $${i}^\\circ$. Calculate the angle of refraction.`,
        answer: ans(ref),
        unit: "°",
        hint: "$n_1\\sin\\theta_1 = n_2\\sin\\theta_2$",
        solution: `$$(1)\\sin ${i}^\\circ = (${tex(n)})\\sin\\theta_2 \\;\\Rightarrow\\; \\theta_2 = ${tex(ref)}^\\circ$$`,
      };
    }
    if (t === 1) {
      const c = (Math.asin(1 / n) * 180) / Math.PI;
      return {
        q: `Calculate the critical angle for light travelling from ${name} ($n = ${tex(n)}$) into air.`,
        answer: ans(c),
        unit: "°",
        hint: "At the critical angle the refracted ray is at $90^\\circ$: $n_1\\sin c = n_2\\sin 90^\\circ$.",
        solution: `$$(${tex(n)})\\sin c = (1)\\sin 90^\\circ \\;\\Rightarrow\\; \\sin c = \\frac{1}{${tex(n)}} \\;\\Rightarrow\\; c = ${tex(c)}^\\circ$$`,
      };
    }
    const v = CONST.c / n;
    return {
      q: `Calculate the speed of light in ${name} (refractive index $${tex(n)}$).`,
      answer: sciAns(v),
      unit: "m·s⁻¹",
      hint: "$n = \\frac{c}{v}$, so $v = \\frac{c}{n}$.",
      solution: `$$v = \\frac{c}{n} = \\frac{3 \\times 10^{8}}{${tex(n)}} = ${sciTex(v)}\\ \\text{m·s}^{-1}$$`,
    };
  },
};

const coulomb: Generator = {
  id: "coulomb",
  title: "Coulomb's law & electric field",
  topic: "g11-electrostatics",
  make(seed) {
    const r = seededRandom(seed);
    const t = int(r, 0, 2);
    const q1 = int(r, 1, 9);
    const q2 = int(r, 1, 9);
    const d = pick(r, [0.01, 0.02, 0.03, 0.05, 0.1, 0.2, 0.3, 0.5]);
    if (t === 0) {
      const F = (CONST.k * q1 * 1e-6 * q2 * 1e-6) / (d * d);
      return {
        q: `Two point charges of $+${q1}\\ \\mu\\text{C}$ and $-${q2}\\ \\mu\\text{C}$ are $${tex(d)}\\ \\text{m}$ apart. Calculate the magnitude of the electrostatic force between them.`,
        answer: sciAns(F),
        unit: "N",
        hint: "$F = \\frac{kQ_1Q_2}{r^2}$ with $k = 9 \\times 10^{9}$. Convert μC to C ($\\times 10^{-6}$). Use magnitudes – the sign only tells you attraction or repulsion.",
        solution: `$$F = \\frac{kQ_1Q_2}{r^2} = \\frac{(9 \\times 10^{9})(${q1} \\times 10^{-6})(${q2} \\times 10^{-6})}{(${tex(d)})^2} = ${sciTex(F)}\\ \\text{N (attraction)}$$`,
      };
    }
    if (t === 1) {
      const E = (CONST.k * q1 * 1e-6) / (d * d);
      return {
        q: `Calculate the magnitude of the electric field $${tex(d)}\\ \\text{m}$ from a point charge of $+${q1}\\ \\mu\\text{C}$.`,
        answer: sciAns(E),
        unit: "N·C⁻¹",
        hint: "$E = \\frac{kQ}{r^2}$",
        solution: `$$E = \\frac{kQ}{r^2} = \\frac{(9 \\times 10^{9})(${q1} \\times 10^{-6})}{(${tex(d)})^2} = ${sciTex(E)}\\ \\text{N·C}^{-1}\\ \\text{(away from the charge)}$$`,
      };
    }
    const E = int(r, 2, 90) * 1000;
    const F = E * q2 * 1e-9;
    return {
      q: `A charge of $${q2}\\ \\text{nC}$ is placed in an electric field of $${tex(E)}\\ \\text{N·C}^{-1}$. Calculate the force on the charge.`,
      answer: sciAns(F),
      unit: "N",
      hint: "$E = \\frac{F}{q}$, so $F = Eq$. Convert nC to C ($\\times 10^{-9}$).",
      solution: `$$F = Eq = (${tex(E)})(${q2} \\times 10^{-9}) = ${sciTex(F)}\\ \\text{N}$$`,
    };
  },
};

const faraday: Generator = {
  id: "faraday",
  title: "Flux & Faraday's law",
  topic: "g11-electromagnetism",
  make(seed) {
    const r = seededRandom(seed);
    const N = pick(r, [50, 100, 150, 200, 250, 500]);
    const A = pick(r, [0.01, 0.02, 0.04, 0.05, 0.1]);
    const B1 = step(r, 0.1, 0.8, 0.1);
    const time = pick(r, [0.1, 0.2, 0.25, 0.5, 1]);
    const askFlux = r() < 0.35;
    const phi = B1 * A;
    const emf = (N * phi) / time;
    return {
      q: askFlux
        ? `A coil of area $${tex(A)}\\ \\text{m}^2$ is perpendicular to a magnetic field of $${tex(B1)}\\ \\text{T}$. Calculate the magnetic flux through the coil.`
        : `A coil of $${N}$ turns and area $${tex(A)}\\ \\text{m}^2$ is perpendicular to a magnetic field of $${tex(B1)}\\ \\text{T}$. The field drops to zero in $${tex(time)}\\ \\text{s}$. Calculate the magnitude of the induced emf.`,
      answer: askFlux ? ans(phi, 4) : ans(emf),
      unit: askFlux ? "Wb" : "V",
      hint: askFlux ? "$\\Phi = BA\\cos\\theta$, where $\\theta$ is the angle between the field and the normal – here $0^\\circ$." : "$\\varepsilon = -N\\frac{\\Delta\\Phi}{\\Delta t}$ and $\\Phi = BA$ (field perpendicular to the coil).",
      solution: askFlux
        ? `$$\\Phi = BA\\cos\\theta = (${tex(B1)})(${tex(A)})\\cos 0^\\circ = ${tex(phi, 4)}\\ \\text{Wb}$$`
        : `$$\\Delta\\Phi = 0 - (${tex(B1)})(${tex(A)}) = -${tex(phi, 4)}\\ \\text{Wb}$$\n$$\\varepsilon = -N\\frac{\\Delta\\Phi}{\\Delta t} = -${N}\\left(\\frac{-${tex(phi, 4)}}{${tex(time)}}\\right) = ${tex(emf)}\\ \\text{V}$$`,
    };
  },
};

const power11: Generator = {
  id: "electric-power",
  title: "Ohm's law, power & cost",
  topic: "g11-circuits",
  speed: true,
  make(seed) {
    const r = seededRandom(seed);
    const t = int(r, 0, 3);
    if (t === 0) {
      const R = int(r, 2, 60);
      const I = step(r, 0.2, 4, 0.1);
      const V = I * R;
      return {
        q: `A current of $${tex(I)}\\ \\text{A}$ flows through a $${R}\\ \\Omega$ resistor. Calculate the potential difference across it.`,
        answer: ans(V),
        unit: "V",
        hint: "Ohm's law: $R = \\frac{V}{I}$, so $V = IR$.",
        solution: `$$V = IR = (${tex(I)})(${R}) = ${tex(V)}\\ \\text{V}$$`,
      };
    }
    if (t === 1) {
      const V = pick(r, [6, 9, 12, 24, 230]);
      const R = V === 230 ? int(r, 20, 100) : int(r, 2, 30);
      const P = (V * V) / R;
      return {
        q: `A $${R}\\ \\Omega$ heater element is connected to a $${V}\\ \\text{V}$ supply. Calculate the power dissipated.`,
        answer: ans(P),
        unit: "W",
        hint: "$P = \\frac{V^2}{R}$",
        solution: `$$P = \\frac{V^2}{R} = \\frac{(${V})^2}{${R}} = ${tex(P)}\\ \\text{W}$$`,
      };
    }
    if (t === 2) {
      const I = step(r, 0.5, 5, 0.5);
      const R = int(r, 2, 40);
      const P = I * I * R;
      return {
        q: `Calculate the power dissipated in a $${R}\\ \\Omega$ resistor carrying a current of $${tex(I)}\\ \\text{A}$.`,
        answer: ans(P),
        unit: "W",
        hint: "$P = I^2R$",
        solution: `$$P = I^2R = (${tex(I)})^2(${R}) = ${tex(P)}\\ \\text{W}$$`,
      };
    }
    const [item, W] = pick(r, [["kettle", 2000], ["geyser", 3000], ["microwave", 1200], ["TV", 150], ["fridge", 200], ["hairdryer", 1800]] as const);
    const hours = pick(r, [0.5, 1, 2, 3, 4, 6, 8]);
    const days = pick(r, [1, 7, 30]);
    const price = pick(r, [2.5, 2.8, 3.1, 3.5]);
    const kWh = (W / 1000) * hours * days;
    const cost = kWh * price;
    return {
      q: `A $${W}\\ \\text{W}$ ${item} is used for $${tex(hours)}$ hours a day for ${days} day${days > 1 ? "s" : ""}. Electricity costs R${tex(price)} per kWh. Calculate the cost (in rand).`,
      answer: ans(cost),
      unit: "rand",
      tol: 0.011,
      hint: "Energy in kWh = power in kW × time in hours. Then multiply by the price per kWh.",
      solution: `$$E = Pt = (${tex(W / 1000)}\\ \\text{kW})(${tex(hours * days)}\\ \\text{h}) = ${tex(kWh)}\\ \\text{kWh}$$\n$$\\text{cost} = ${tex(kWh)} \\times \\text{R}${tex(price)} = \\text{R}${tex(cost)}$$`,
    };
  },
};

// ------------------------------------------------------------ Grade 12
const momentum: Generator = {
  id: "momentum",
  title: "Momentum & impulse",
  topic: "g12-momentum",
  make(seed) {
    const r = seededRandom(seed);
    const t = int(r, 0, 3);
    if (t === 0) {
      const m = step(r, 0.05, 2, 0.05);
      const u = int(r, 5, 30);
      const v = int(r, 2, 25);
      const dt = pick(r, [0.01, 0.02, 0.05, 0.1, 0.2]);
      const dp = m * (-v - u);
      const F = dp / dt;
      return {
        q: `A $${tex(m)}\\ \\text{kg}$ ball hits a wall at $${u}\\ \\text{m·s}^{-1}$ and rebounds at $${v}\\ \\text{m·s}^{-1}$. It is in contact with the wall for $${tex(dt)}\\ \\text{s}$. Calculate the magnitude of the average force of the wall on the ball.`,
        answer: ans(Math.abs(F)),
        unit: "N",
        hint: "Take towards the wall as positive, so the rebound velocity is **negative**. $F_{net}\\Delta t = \\Delta p = m(v_f - v_i)$.",
        solution: `$$F_{net}\\Delta t = m(v_f - v_i)$$\n$$F_{net}(${tex(dt)}) = ${tex(m)}(-${v} - ${u}) \\;\\Rightarrow\\; F_{net} = ${tex(F)}\\ \\text{N}$$\nMagnitude $${tex(Math.abs(F))}\\ \\text{N}$, directed away from the wall.`,
      };
    }
    if (t === 1) {
      const m1 = int(r, 1, 10) * 100;
      const m2 = int(r, 1, 10) * 100;
      const u1 = int(r, 5, 25);
      const v = (m1 * u1) / (m1 + m2);
      return {
        q: `A $${m1}\\ \\text{kg}$ car moving at $${u1}\\ \\text{m·s}^{-1}$ collides with a stationary $${m2}\\ \\text{kg}$ car. They stick together. Calculate their common velocity just after the collision.`,
        answer: ans(v),
        unit: "m·s⁻¹",
        hint: "Momentum is conserved in an isolated system: $\\Sigma p_{before} = \\Sigma p_{after}$.",
        solution: `$$m_1u_1 + m_2u_2 = (m_1 + m_2)v$$\n$$(${m1})(${u1}) + (${m2})(0) = (${m1 + m2})v \\;\\Rightarrow\\; v = ${tex(v)}\\ \\text{m·s}^{-1}$$`,
      };
    }
    if (t === 2) {
      const m = int(r, 40, 90);
      const M = int(r, 2, 10) * 10;
      const v = int(r, 1, 4);
      const V = (m * v) / M;
      return {
        q: `A $${m}\\ \\text{kg}$ learner stands on a $${M}\\ \\text{kg}$ boat at rest on a still dam. She jumps off the front at $${v}\\ \\text{m·s}^{-1}$. Calculate the velocity of the boat just after she jumps.`,
        answer: ans(-V),
        unit: "m·s⁻¹",
        hint: "Total momentum before is zero, so after: $m_1v_1 + m_2v_2 = 0$. Take her direction as positive.",
        solution: `$$0 = (${m})(${v}) + (${M})v_{boat} \\;\\Rightarrow\\; v_{boat} = ${tex(-V)}\\ \\text{m·s}^{-1}$$\nThe minus sign means the boat moves backwards at $${tex(V)}\\ \\text{m·s}^{-1}$.`,
      };
    }
    const m = int(r, 1, 20) * 50;
    const v = int(r, 2, 30);
    const p = m * v;
    return {
      q: `Calculate the momentum of a $${m}\\ \\text{kg}$ vehicle moving at $${v}\\ \\text{m·s}^{-1}$ north.`,
      answer: ans(p),
      unit: "kg·m·s⁻¹",
      hint: "$p = mv$ – momentum is a vector, so give the direction too.",
      solution: `$$p = mv = (${m})(${v}) = ${tex(p)}\\ \\text{kg·m·s}^{-1}\\ \\text{north}$$`,
    };
  },
};

const projectile: Generator = {
  id: "projectile",
  title: "Vertical projectile motion",
  topic: "g12-projectile",
  make(seed) {
    const r = seededRandom(seed);
    const u = int(r, 5, 30);
    const t = int(r, 0, 3);
    if (t === 0) {
      const h = (u * u) / (2 * g);
      return {
        q: `A ball is thrown vertically upwards at $${u}\\ \\text{m·s}^{-1}$. Ignore air resistance. Calculate the maximum height it reaches above the point of release.`,
        answer: ans(h),
        unit: "m",
        hint: "At the highest point $v_f = 0$. Take up as positive so $a = -9{,}8\\ \\text{m·s}^{-2}$ and use $v_f^2 = v_i^2 + 2a\\Delta y$.",
        solution: `Take up as positive.\n$$v_f^2 = v_i^2 + 2a\\Delta y \\;\\Rightarrow\\; 0 = (${u})^2 + 2(-9{,}8)\\Delta y \\;\\Rightarrow\\; \\Delta y = ${tex(h)}\\ \\text{m}$$`,
      };
    }
    if (t === 1) {
      const tt = u / g;
      return {
        q: `A stone is thrown vertically upwards at $${u}\\ \\text{m·s}^{-1}$. How long does it take to reach its highest point?`,
        answer: ans(tt),
        unit: "s",
        hint: "At the top $v_f = 0$: $v_f = v_i + a\\Delta t$ with $a = -9{,}8\\ \\text{m·s}^{-2}$ (up positive).",
        solution: `$$v_f = v_i + a\\Delta t \\;\\Rightarrow\\; 0 = ${u} + (-9{,}8)\\Delta t \\;\\Rightarrow\\; \\Delta t = ${tex(tt)}\\ \\text{s}$$`,
      };
    }
    if (t === 2) {
      const h = int(r, 5, 80);
      const tt = Math.sqrt((2 * h) / g);
      return {
        q: `A coin is dropped from rest from a building $${h}\\ \\text{m}$ high. How long does it take to reach the ground?`,
        answer: ans(tt),
        unit: "s",
        hint: "Dropped means $v_i = 0$. Take down as positive and use $\\Delta y = v_i\\Delta t + \\tfrac{1}{2}a\\Delta t^2$.",
        solution: `Take down as positive.\n$$${h} = 0 + \\tfrac{1}{2}(9{,}8)\\Delta t^2 \\;\\Rightarrow\\; \\Delta t = \\sqrt{\\frac{2(${h})}{9{,}8}} = ${tex(tt)}\\ \\text{s}$$`,
      };
    }
    const tt = step(r, 0.5, (2 * u) / g, 0.5);
    const v = u - g * tt;
    return {
      q: `A ball is thrown vertically upwards at $${u}\\ \\text{m·s}^{-1}$. Calculate its velocity $${tex(tt)}\\ \\text{s}$ later. (Take upwards as positive.)`,
      answer: ans(v),
      unit: "m·s⁻¹",
      hint: "$v_f = v_i + a\\Delta t$ with $a = -9{,}8\\ \\text{m·s}^{-2}$. A negative answer means it is already coming down.",
      solution: `$$v_f = v_i + a\\Delta t = ${u} + (-9{,}8)(${tex(tt)}) = ${tex(v)}\\ \\text{m·s}^{-1}$$\n${v < 0 ? "Negative: the ball is moving **downwards**." : "Positive: the ball is still moving **upwards**."}`,
    };
  },
};

const workEnergy: Generator = {
  id: "work-energy",
  title: "Work, energy & power",
  topic: "g12-work-energy",
  make(seed) {
    const r = seededRandom(seed);
    const t = int(r, 0, 3);
    if (t === 0) {
      const F = int(r, 10, 200);
      const dx = int(r, 2, 30);
      const angle = pick(r, [0, 20, 30, 37, 45, 60]);
      const W = F * dx * Math.cos((angle * Math.PI) / 180);
      return {
        q: `A force of $${F}\\ \\text{N}$ acting at $${angle}^\\circ$ to the horizontal pulls a box $${dx}\\ \\text{m}$ along a horizontal floor. Calculate the work done by the force.`,
        answer: ans(W),
        unit: "J",
        hint: "$W = F\\Delta x\\cos\\theta$, with $\\theta$ the angle between the force and the displacement.",
        solution: `$$W = F\\Delta x\\cos\\theta = (${F})(${dx})\\cos ${angle}^\\circ = ${tex(W)}\\ \\text{J}$$`,
      };
    }
    if (t === 1) {
      const m = int(r, 2, 20);
      const u = int(r, 0, 8);
      const W = int(r, 50, 600);
      const v = Math.sqrt(u * u + (2 * W) / m);
      return {
        q: `The net work done on a $${m}\\ \\text{kg}$ trolley is $${W}\\ \\text{J}$. Its initial speed was $${u}\\ \\text{m·s}^{-1}$. Use the work-energy theorem to calculate its final speed.`,
        answer: ans(v),
        unit: "m·s⁻¹",
        hint: "$W_{net} = \\Delta E_k = \\tfrac{1}{2}mv_f^2 - \\tfrac{1}{2}mv_i^2$",
        solution: `$$W_{net} = \\tfrac{1}{2}mv_f^2 - \\tfrac{1}{2}mv_i^2$$\n$$${W} = \\tfrac{1}{2}(${m})v_f^2 - \\tfrac{1}{2}(${m})(${u})^2 \\;\\Rightarrow\\; v_f = ${tex(v)}\\ \\text{m·s}^{-1}$$`,
      };
    }
    if (t === 2) {
      const m = int(r, 40, 90);
      const h = int(r, 3, 20);
      const time = int(r, 4, 30);
      const P = (m * g * h) / time;
      return {
        q: `A $${m}\\ \\text{kg}$ learner runs up a flight of stairs $${h}\\ \\text{m}$ high in $${time}\\ \\text{s}$. Calculate the average power she develops.`,
        answer: ans(P),
        unit: "W",
        hint: "Work done against gravity is $mgh$, and $P = \\frac{W}{\\Delta t}$.",
        solution: `$$W = mgh = (${m})(9{,}8)(${h}) = ${tex(m * g * h)}\\ \\text{J}$$\n$$P = \\frac{W}{\\Delta t} = \\frac{${tex(m * g * h)}}{${time}} = ${tex(P)}\\ \\text{W}$$`,
      };
    }
    const F = int(r, 200, 3000);
    const v = int(r, 2, 30);
    const P = F * v;
    return {
      q: `A car's engine exerts a driving force of $${F}\\ \\text{N}$ while the car moves at a constant $${v}\\ \\text{m·s}^{-1}$. Calculate the power delivered.`,
      answer: ans(P),
      unit: "W",
      hint: "At constant velocity: $P_{ave} = Fv_{ave}$.",
      solution: `$$P = Fv = (${F})(${v}) = ${tex(P)}\\ \\text{W}$$`,
    };
  },
};

const doppler: Generator = {
  id: "doppler",
  title: "The Doppler effect",
  topic: "g12-doppler",
  make(seed) {
    const r = seededRandom(seed);
    const v = 340;
    const fs = pick(r, [400, 500, 600, 750, 800, 900, 1000, 1200]);
    const vs = int(r, 10, 40);
    const towards = r() < 0.5;
    const fL = (v / (towards ? v - vs : v + vs)) * fs;
    return {
      q: `An ambulance siren emits sound at $${fs}\\ \\text{Hz}$. The ambulance moves at $${vs}\\ \\text{m·s}^{-1}$ ${towards ? "**towards**" : "**away from**"} a stationary listener. Take the speed of sound as $340\\ \\text{m·s}^{-1}$. Calculate the frequency the listener hears.`,
      answer: ans(fL),
      unit: "Hz",
      hint: `$f_L = \\frac{v \\pm v_L}{v \\pm v_s}f_s$. The listener is still ($v_L = 0$). Source moving ${towards ? "towards: use $v - v_s$ (higher pitch)" : "away: use $v + v_s$ (lower pitch)"}.`,
      solution: `$$f_L = \\frac{v}{v ${towards ? "-" : "+"} v_s}f_s = \\frac{340}{340 ${towards ? "-" : "+"} ${vs}}(${fs}) = ${tex(fL)}\\ \\text{Hz}$$`,
    };
  },
};

const internalR: Generator = {
  id: "internal-resistance",
  title: "Emf & internal resistance",
  topic: "g12-circuits",
  make(seed) {
    const r = seededRandom(seed);
    const emf = pick(r, [6, 9, 12, 1.5, 3, 24]);
    const rint = pick(r, [0.2, 0.5, 1, 1.5, 2]);
    const R = int(r, 2, 20);
    const I = emf / (R + rint);
    const t = int(r, 0, 2);
    if (t === 0) {
      return {
        q: `A battery with an emf of $${tex(emf)}\\ \\text{V}$ and internal resistance $${tex(rint)}\\ \\Omega$ is connected to a $${R}\\ \\Omega$ resistor. Calculate the current in the circuit.`,
        answer: ans(I, 3),
        unit: "A",
        hint: "$\\varepsilon = I(R + r)$",
        solution: `$$I = \\frac{\\varepsilon}{R + r} = \\frac{${tex(emf)}}{${R} + ${tex(rint)}} = ${tex(I, 3)}\\ \\text{A}$$`,
      };
    }
    if (t === 1) {
      const V = I * R;
      return {
        q: `A battery (emf $${tex(emf)}\\ \\text{V}$, internal resistance $${tex(rint)}\\ \\Omega$) is connected to a $${R}\\ \\Omega$ resistor. Calculate the terminal potential difference (the voltmeter reading across the battery).`,
        answer: ans(V),
        unit: "V",
        hint: "First $I = \\frac{\\varepsilon}{R + r}$. Then $V_{terminal} = IR = \\varepsilon - Ir$.",
        solution: `$$I = \\frac{${tex(emf)}}{${R} + ${tex(rint)}} = ${tex(I, 3)}\\ \\text{A}$$\n$$V = \\varepsilon - Ir = ${tex(emf)} - (${tex(I, 3)})(${tex(rint)}) = ${tex(V)}\\ \\text{V}$$`,
      };
    }
    const V = I * R;
    return {
      q: `A voltmeter across a battery reads $${tex(emf)}\\ \\text{V}$ with the switch open, and $${tex(round(V, 2))}\\ \\text{V}$ when a current of $${tex(round(I, 3), 3)}\\ \\text{A}$ flows. Calculate the internal resistance of the battery.`,
      answer: ans(rint),
      unit: "Ω",
      rtol: 0.03,
      hint: "With the switch open the voltmeter reads the emf. Lost volts $= \\varepsilon - V = Ir$.",
      solution: `$$\\varepsilon = V + Ir \\;\\Rightarrow\\; r = \\frac{\\varepsilon - V}{I} = \\frac{${tex(emf)} - ${tex(round(V, 2))}}{${tex(round(I, 3), 3)}} = ${tex(rint)}\\ \\Omega$$`,
    };
  },
};

const rms: Generator = {
  id: "rms",
  title: "AC & rms values",
  topic: "g12-electrodynamics",
  make(seed) {
    const r = seededRandom(seed);
    const t = int(r, 0, 2);
    if (t === 0) {
      const Vmax = pick(r, [12, 24, 100, 170, 311, 340]);
      const Vrms = Vmax / Math.SQRT2;
      return {
        q: `An AC generator produces a peak (maximum) voltage of $${Vmax}\\ \\text{V}$. Calculate the rms voltage.`,
        answer: ans(Vrms),
        unit: "V",
        hint: "$V_{rms} = \\frac{V_{max}}{\\sqrt{2}}$",
        solution: `$$V_{rms} = \\frac{V_{max}}{\\sqrt{2}} = \\frac{${Vmax}}{\\sqrt{2}} = ${tex(Vrms)}\\ \\text{V}$$`,
      };
    }
    if (t === 1) {
      const P = pick(r, [60, 100, 800, 1200, 2000]);
      const Vrms = 230;
      const Irms = P / Vrms;
      const Imax = Irms * Math.SQRT2;
      return {
        q: `A $${P}\\ \\text{W}$ appliance is connected to the $230\\ \\text{V}$ (rms) mains. Calculate the **peak** current in the appliance.`,
        answer: ans(Imax, 3),
        unit: "A",
        hint: "$P_{ave} = V_{rms}I_{rms}$, then $I_{max} = \\sqrt{2}\\,I_{rms}$.",
        solution: `$$I_{rms} = \\frac{P_{ave}}{V_{rms}} = \\frac{${P}}{230} = ${tex(Irms, 3)}\\ \\text{A}$$\n$$I_{max} = \\sqrt{2}\\,I_{rms} = ${tex(Imax, 3)}\\ \\text{A}$$`,
      };
    }
    const Vrms = pick(r, [12, 120, 230]);
    const R = int(r, 10, 100);
    const P = (Vrms * Vrms) / R;
    return {
      q: `A $${R}\\ \\Omega$ resistor is connected to an AC supply of $${Vrms}\\ \\text{V}$ rms. Calculate the average power dissipated.`,
      answer: ans(P),
      unit: "W",
      hint: "$P_{ave} = \\frac{V_{rms}^2}{R}$",
      solution: `$$P_{ave} = \\frac{V_{rms}^2}{R} = \\frac{(${Vrms})^2}{${R}} = ${tex(P)}\\ \\text{W}$$`,
    };
  },
};

const photoelectric: Generator = {
  id: "photoelectric",
  title: "The photoelectric effect",
  topic: "g12-photoelectric",
  make(seed) {
    const r = seededRandom(seed);
    const [metal, W0] = pick(r, [["sodium", 3.65e-19], ["potassium", 3.68e-19], ["calcium", 4.65e-19], ["zinc", 6.9e-19], ["caesium", 3.43e-19]] as const);
    const t = int(r, 0, 2);
    if (t === 0) {
      const f0 = W0 / CONST.h;
      return {
        q: `The work function of ${metal} is $${sciTex(W0)}\\ \\text{J}$. Calculate its threshold frequency.`,
        answer: sciAns(f0),
        unit: "Hz",
        hint: "$W_0 = hf_0$",
        solution: `$$f_0 = \\frac{W_0}{h} = \\frac{${sciTex(W0)}}{6{,}63 \\times 10^{-34}} = ${sciTex(f0)}\\ \\text{Hz}$$`,
      };
    }
    const nm = pick(r, [200, 220, 250, 280, 300, 320, 350]);
    const E = (CONST.h * CONST.c) / (nm * 1e-9);
    const Ek = E - W0;
    if (Ek <= 0) {
      return {
        q: `Light of wavelength $${nm}\\ \\text{nm}$ shines on a metal. Calculate the energy of one photon.`,
        answer: sciAns(E),
        unit: "J",
        hint: "$E = \\frac{hc}{\\lambda}$",
        solution: `$$E = \\frac{hc}{\\lambda} = \\frac{(6{,}63 \\times 10^{-34})(3 \\times 10^{8})}{${nm} \\times 10^{-9}} = ${sciTex(E)}\\ \\text{J}$$`,
      };
    }
    if (t === 1) {
      return {
        q: `Ultraviolet light of wavelength $${nm}\\ \\text{nm}$ shines on ${metal} (work function $${sciTex(W0)}\\ \\text{J}$). Calculate the maximum kinetic energy of the ejected electrons.`,
        answer: sciAns(Ek),
        unit: "J",
        hint: "$E = W_0 + E_{k(max)}$ and $E = \\frac{hc}{\\lambda}$.",
        solution: `$$E = \\frac{hc}{\\lambda} = \\frac{(6{,}63 \\times 10^{-34})(3 \\times 10^{8})}{${nm} \\times 10^{-9}} = ${sciTex(E)}\\ \\text{J}$$\n$$E_{k(max)} = E - W_0 = ${sciTex(E)} - ${sciTex(W0)} = ${sciTex(Ek)}\\ \\text{J}$$`,
      };
    }
    const v = Math.sqrt((2 * Ek) / CONST.me);
    return {
      q: `Light of wavelength $${nm}\\ \\text{nm}$ ejects electrons from ${metal} (work function $${sciTex(W0)}\\ \\text{J}$). Calculate the maximum speed of the ejected electrons. ($m_e = 9{,}11 \\times 10^{-31}\\ \\text{kg}$)`,
      answer: sciAns(v),
      unit: "m·s⁻¹",
      rtol: 0.015,
      hint: "Find $E_{k(max)} = \\frac{hc}{\\lambda} - W_0$, then $E_k = \\tfrac{1}{2}mv^2$.",
      solution: `$$E_{k(max)} = \\frac{hc}{\\lambda} - W_0 = ${sciTex(E)} - ${sciTex(W0)} = ${sciTex(Ek)}\\ \\text{J}$$\n$$v = \\sqrt{\\frac{2E_k}{m_e}} = \\sqrt{\\frac{2(${sciTex(Ek)})}{9{,}11 \\times 10^{-31}}} = ${sciTex(v)}\\ \\text{m·s}^{-1}$$`,
    };
  },
};

export const PHYSICS_GENERATORS: Generator[] = [
  eqMotion, speedVelocity, mechEnergy, waveEquation, echo, photonEnergy, chargeSharing, resistors,
  vectorResultant, newton2, gravitation, snell, coulomb, faraday, power11,
  momentum, projectile, workEnergy, doppler, internalR, rms, photoelectric,
];
