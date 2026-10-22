"use client";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, FlaskConical } from "lucide-react";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { Spotlight } from "@/components/aceternity/spotlight";
import { FlipWords } from "@/components/aceternity/flip-words";
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect";
import { MovingBorderLink } from "@/components/aceternity/moving-border";
import { gsap, motionAllowed, useGSAP } from "@/lib/gsap";

/**
 * Hero: Aceternity aurora + spotlight, and a GSAP timeline that throws a ball
 * straight up – its velocity arrows shrink, flip at the top, and the
 * velocity-time graph draws itself alongside.
 */
export function Hero({ stats }: { stats: { lessons: number; tools: number; exam: number } }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = root.current;
    if (!el) return;
    const paths = el.querySelectorAll<SVGPathElement>("[data-draw]");
    const fades = el.querySelectorAll("[data-fade]");
    const pops = el.querySelectorAll("[data-pop]");
    const ball = el.querySelector("[data-ball]");
    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = motionAllowed() ? `${len}` : "0";
    });
    if (!motionAllowed()) {
      gsap.set(fades, { opacity: 1, y: 0 });
      gsap.set(pops, { opacity: 1, scale: 1 });
      return;
    }
    gsap.from(fades, { opacity: 0, y: 24, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 0.2 });
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.5, delay: 0.6 });
    tl.set(pops, { opacity: 0, scale: 0.6 })
      .set(ball, { y: 0 })
      .fromTo(paths, { strokeDashoffset: (_i, t: SVGPathElement) => t.getTotalLength() }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.2, ease: "power2.inOut" })
      .to(ball, { y: -190, duration: 1.1, ease: "power2.out" })
      .to(ball, { y: 0, duration: 1.1, ease: "power2.in" })
      .to(pops, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.12, ease: "back.out(2)" }, "-=1.6")
      .to({}, { duration: 3 });
  }, { scope: root });

  // Velocity-time graph: t ∈ [0; 4,1] s → x 170..390, v ∈ [-20; 20] m·s⁻¹ → y 270..30
  const T = (t: number) => 170 + t * 53;
  const V = (v: number) => 150 - v * 6;
  // Ball snapshots on the way up: height ∝ 20t − 4,9t², arrow ∝ velocity
  const snaps = [0, 0.5, 1, 1.5, 2.04].map((t) => ({ y: 250 - (20 * t - 4.9 * t * t) * 9.3, v: 20 - 9.8 * t }));

  return (
    <AuroraBackground className="border-b border-line">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="#818cf8" />
      <div ref={root} className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 pt-16 pb-20 md:pt-24 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p data-fade className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 text-sm font-semibold text-muted backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-waves" /> CAPS Physical Sciences · Grade 10, 11 &amp; 12
          </p>
          <h1 className="font-display text-4xl leading-[1.08] font-bold tracking-tight text-fg sm:text-5xl lg:text-6xl">
            <TextGenerateEffect words="Physics and Chemistry you can play with." highlight={["Physics", "Chemistry", "play"]} />
          </h1>
          <p data-fade className="mt-5 max-w-xl text-lg text-muted">
            Bite-sized lessons on{" "}
            <FlipWords words={["Newton's laws", "momentum", "circuits", "the mole", "waves", "the Doppler effect", "organic molecules", "equilibrium", "acids & bases", "galvanic cells"]} className="inline-block font-semibold text-brand" />
            {" "}— with simulations you control, a virtual lab, questions that never run out, instant feedback and exam questions with memos. Paper 1 and Paper 2, every topic.
          </p>
          <div data-fade className="mt-8 flex flex-wrap gap-3">
            <MovingBorderLink href="/learn">Start learning <ArrowRight className="h-4 w-4" /></MovingBorderLink>
            <Link href="/toolkit" className="inline-flex items-center gap-2 rounded-2xl border border-line bg-surface/70 px-6 py-3 font-semibold backdrop-blur transition hover:border-brand/50">
              <FlaskConical className="h-4 w-4 text-memory" /> Open the virtual lab
            </Link>
          </div>
          <dl data-fade className="mt-10 grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-4">
            {[[String(stats.lessons), "lessons"], [String(stats.tools), "simulations & labs"], ["∞", "practice questions"], [String(stats.exam), "exam questions"]].map(([a, b]) => (
              <div key={b}>
                <dt className="sr-only">{b}</dt>
                <dd className="font-display text-3xl font-bold text-fg">{a}</dd>
                <dd className="text-sm text-muted">{b}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div data-fade className="relative">
          <div className="decorative absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-brand/30 via-waves/20 to-mech/30 blur-2xl" aria-hidden />
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3 text-xs text-muted">
              <span className="font-mono font-semibold">QUESTION 3 · VERTICAL PROJECTILE MOTION</span>
              <span className="ml-auto rounded-md bg-mech px-2 py-0.5 font-semibold text-white">Sketch v vs t</span>
            </div>
            <svg viewBox="0 0 400 300" className="diagram" role="img" aria-label="Animation: a ball thrown upwards at 20 metres per second slows down, stops at the top and falls back, while its velocity-time graph is drawn as a straight line with gradient minus 9,8">
              {/* ground and the ball's path */}
              <line x1="20" x2="140" y1="262" y2="262" stroke="var(--graph-axis)" strokeWidth="2" />
              <line x1="70" x2="70" y1="60" y2="262" stroke="var(--graph-grid)" strokeDasharray="4 4" />
              {snaps.map((s, i) => (
                <g key={i} data-pop style={{ opacity: 0, transformOrigin: `95px ${s.y}px` }}>
                  <circle cx="95" cy={s.y} r="4" fill="var(--curve-ghost)" />
                  {s.v > 0.3 && <path d={`M95,${s.y} V${s.y - s.v * 2.2} m-4,6 l4,-6 l4,6`} fill="none" stroke="var(--t-mech)" strokeWidth="2.5" strokeLinecap="round" />}
                  {i === 4 && <text x="103" y={s.y + 4} fontSize="11" fontWeight="700" fill="var(--t-mech)" stroke="var(--surface)" strokeWidth="3" paintOrder="stroke">v = 0</text>}
                </g>
              ))}
              <g data-ball><circle cx="70" cy="250" r="9" fill="var(--t-mech)" /><circle cx="67" cy="247" r="3" fill="white" opacity="0.6" /></g>
              {/* v-t graph */}
              {[-20, -10, 0, 10, 20].map((v) => <line key={v} x1={T(0)} x2={T(4.1)} y1={V(v)} y2={V(v)} stroke="var(--graph-grid)" />)}
              <path data-draw d={`M${T(0)},${V(0)} H${T(4.1)}`} stroke="var(--graph-axis)" strokeWidth="1.5" />
              <path data-draw d={`M${T(0)},${V(-22)} V${V(22)}`} stroke="var(--graph-axis)" strokeWidth="1.5" />
              <text x={T(4.1)} y={V(0) - 6} textAnchor="end" className="tick" fontSize="11">t (s)</text>
              <text x={T(0) + 5} y={V(21.5)} className="tick" fontSize="11">v (m·s⁻¹)</text>
              <path data-draw d={`M${T(0)},${V(20)} L${T(4.08)},${V(-20)}`} fill="none" stroke="var(--curve-1)" strokeWidth="3.5" strokeLinecap="round" />
              <g data-pop style={{ opacity: 0, transformOrigin: `${T(2.04)}px ${V(0)}px` }}>
                <circle cx={T(2.04)} cy={V(0)} r="5" fill="var(--curve-1)" />
                <text x={T(2.04) + 7} y={V(0) - 8} fontSize="12" fontWeight="800" fill="var(--curve-1)" stroke="var(--surface)" strokeWidth="3" paintOrder="stroke">top: t = 2,04 s</text>
              </g>
              <g data-pop style={{ opacity: 0, transformOrigin: `${T(3)}px ${V(-14)}px` }}>
                <text x={T(2.4)} y={V(-13)} fontSize="12" fontWeight="700" fill="var(--text-muted)">gradient = g = −9,8</text>
              </g>
              <g data-pop style={{ opacity: 0, transformOrigin: `${T(0.3)}px ${V(20)}px` }}>
                <text x={T(0) + 8} y={V(20) + 4} fontSize="12" fontWeight="800" fill="var(--curve-1)" stroke="var(--surface)" strokeWidth="3" paintOrder="stroke">vᵢ = 20</text>
              </g>
            </svg>
            <div data-pop className="absolute right-4 bottom-4 w-60 rounded-xl border border-line bg-elevated p-3 shadow-2xl" style={{ opacity: 0 }}>
              <div className="text-[10px] font-bold tracking-wider text-mech uppercase">Live from the projectile lab</div>
              <div className="mt-1 font-mono text-xs">v_f = v_i + gΔt</div>
              <div className="font-mono text-xs">0 = 20 + (−9,8)Δt → Δt = 2,04 s</div>
              <div className="mt-1 text-xs text-muted">Change the speed and watch it move.</div>
            </div>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
