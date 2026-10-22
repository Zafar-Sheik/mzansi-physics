"use client";
import { createContext, useContext, useId, useMemo, useRef } from "react";

export interface View {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

interface Scale {
  view: View;
  W: number;
  H: number;
  sx: (x: number) => number;
  sy: (y: number) => number;
}

const ScaleCtx = createContext<Scale | null>(null);
const useScale = () => {
  const s = useContext(ScaleCtx);
  if (!s) throw new Error("Plot children must be inside <Plot>");
  return s;
};

/** 1, 2 or 5 × 10ⁿ – a tick spacing that reads well. */
export function niceStep(span: number, target = 8) {
  const raw = span / target;
  const p = 10 ** Math.floor(Math.log10(raw));
  const m = raw / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
}

const fmtTick = (v: number) => String(Math.round(v * 1000) / 1000).replace("-", "−");

/**
 * Cartesian plane in SVG. Children (Curve, Dot, Asymptote…) use the plane's
 * scale through context. `onPoint` reports the pointer position in graph units.
 */
export function Plot({ view, width = 480, height = 360, label, children, onPoint, onDrag, className, ticks = true, xStep, yStep, xLabel = "x", yLabel = "y" }: {
  view: View;
  width?: number;
  height?: number;
  label: string;
  children?: React.ReactNode;
  onPoint?: (p: { x: number; y: number } | null) => void;
  /** Pointer down / move (while pressed) / up, in graph units – for draggable points. */
  onDrag?: (p: { x: number; y: number }, phase: "down" | "move" | "up") => void;
  className?: string;
  ticks?: boolean;
  /** Override the automatic tick spacing (e.g. 90 for trig graphs in degrees). */
  xStep?: number;
  yStep?: number;
  xLabel?: string;
  yLabel?: string;
}) {
  const pressed = useRef(false);
  const clip = useId().replace(/:/g, "");
  const svg = useRef<SVGSVGElement>(null);
  const scale = useMemo<Scale>(() => {
    const sx = (x: number) => ((x - view.xMin) / (view.xMax - view.xMin)) * width;
    const sy = (y: number) => height - ((y - view.yMin) / (view.yMax - view.yMin)) * height;
    return { view, W: width, H: height, sx, sy };
  }, [view, width, height]);
  const { sx, sy } = scale;
  const xs = xStep ?? niceStep(view.xMax - view.xMin, width / 55);
  const ys = yStep ?? niceStep(view.yMax - view.yMin, height / 45);
  const gx: number[] = [];
  for (let v = Math.ceil(view.xMin / xs) * xs; v <= view.xMax + 1e-9; v += xs) gx.push(Math.round(v / xs) * xs);
  const gy: number[] = [];
  for (let v = Math.ceil(view.yMin / ys) * ys; v <= view.yMax + 1e-9; v += ys) gy.push(Math.round(v / ys) * ys);
  const ox = Math.min(Math.max(sx(0), 0), width);
  const oy = Math.min(Math.max(sy(0), 0), height);

  const toGraph = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = svg.current!.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * width;
    const py = ((e.clientY - r.top) / r.height) * height;
    return { x: view.xMin + (px / width) * (view.xMax - view.xMin), y: view.yMin + ((height - py) / height) * (view.yMax - view.yMin) };
  };
  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svg.current) return;
    const g = toGraph(e);
    onPoint?.(g);
    if (onDrag && e.type === "pointerdown") {
      pressed.current = true;
      svg.current.setPointerCapture?.(e.pointerId);
      onDrag(g, "down");
    } else if (onDrag && pressed.current) onDrag(g, "move");
  };
  const up = (e: React.PointerEvent<SVGSVGElement>) => {
    if (onDrag && pressed.current && svg.current) onDrag(toGraph(e), "up");
    pressed.current = false;
  };
  const interactive = Boolean(onPoint || onDrag);

  return (
    <svg ref={svg} viewBox={`0 0 ${width} ${height}`} className={`diagram touch-none select-none rounded-xl border border-line bg-surface ${className ?? ""}`} role="img" aria-label={label}
      onPointerMove={interactive ? move : undefined} onPointerDown={interactive ? move : undefined} onPointerUp={interactive ? up : undefined} onPointerCancel={interactive ? up : undefined}
      onPointerLeave={onPoint ? () => onPoint(null) : undefined}>
      <defs>
        <clipPath id={clip}><rect x="0" y="0" width={width} height={height} /></clipPath>
        <marker id={`${clip}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--graph-axis)" /></marker>
      </defs>
      <g className="grid">
        {gx.map((v) => <line key={`x${v}`} x1={sx(v)} x2={sx(v)} y1={0} y2={height} />)}
        {gy.map((v) => <line key={`y${v}`} y1={sy(v)} y2={sy(v)} x1={0} x2={width} />)}
      </g>
      <line className="axis" x1={0} x2={width} y1={oy} y2={oy} markerEnd={`url(#${clip}-arrow)`} />
      <line className="axis" x1={ox} x2={ox} y1={height} y2={0} markerEnd={`url(#${clip}-arrow)`} />
      <text x={width - 10} y={oy - 6} textAnchor="end" className="tick" fontStyle="italic" fontSize="12">{xLabel}</text>
      <text x={ox + 6} y={12} className="tick" fontStyle="italic" fontSize="12">{yLabel}</text>
      {ticks && (
        <g>
          {gx.filter((v) => Math.abs(v) > 1e-9).map((v) => <text key={`tx${v}`} x={sx(v)} y={Math.min(oy + 13, height - 3)} textAnchor="middle" className="tick">{fmtTick(v)}</text>)}
          {gy.filter((v) => Math.abs(v) > 1e-9).map((v) => <text key={`ty${v}`} x={Math.max(ox - 4, 18)} y={sy(v) + 3.5} textAnchor="end" className="tick">{fmtTick(v)}</text>)}
          <text x={ox - 4} y={oy + 13} textAnchor="end" className="tick">0</text>
        </g>
      )}
      <ScaleCtx.Provider value={scale}>
        <g clipPath={`url(#${clip})`}>{children}</g>
      </ScaleCtx.Provider>
    </svg>
  );
}

/** Sample a function into an SVG path, breaking at asymptotes and undefined points. */
export function functionPath(f: (x: number) => number, s: Scale, from?: number, to?: number, samples = 480) {
  const { view, sx, sy } = s;
  const a = Math.max(from ?? view.xMin, view.xMin);
  const b = Math.min(to ?? view.xMax, view.xMax);
  const span = view.yMax - view.yMin;
  const lo = view.yMin - 4 * span;
  const hi = view.yMax + 4 * span;
  let d = "";
  let pen = false;
  let prev: number | null = null;
  for (let k = 0; k <= samples; k++) {
    const x = a + ((b - a) * k) / samples;
    const y = f(x);
    if (!Number.isFinite(y) || (prev !== null && Math.abs(y - prev) > 3 * span && Math.sign(y) !== Math.sign(prev))) {
      pen = false;
      prev = Number.isFinite(y) ? y : null;
      if (!Number.isFinite(y)) continue;
    }
    const yc = Math.min(hi, Math.max(lo, y));
    d += `${pen ? "L" : "M"}${sx(x).toFixed(2)},${sy(yc).toFixed(2)}`;
    pen = true;
    prev = y;
  }
  return d;
}

export function Curve({ f, colour = "var(--curve-1)", dashed, from, to, width = 2.5, label }: { f: (x: number) => number; colour?: string; dashed?: boolean; from?: number; to?: number; width?: number; label?: string }) {
  const s = useScale();
  const d = useMemo(() => functionPath(f, s, from, to), [f, s, from, to]);
  return <path d={d} className="curve" stroke={colour} strokeWidth={width} strokeDasharray={dashed ? "6 5" : undefined} aria-label={label} />;
}

export function Dot({ x, y, colour = "var(--curve-1)", label, r = 5, hollow, dx = 8, dy = -8 }: { x: number; y: number; colour?: string; label?: string; r?: number; hollow?: boolean; dx?: number; dy?: number }) {
  const { sx, sy } = useScale();
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return (
    <g>
      <circle cx={sx(x)} cy={sy(y)} r={r} fill={hollow ? "var(--surface)" : colour} stroke={colour} strokeWidth={2} />
      {label && (
        <text x={sx(x) + dx} y={sy(y) + dy} fontSize="12" fontWeight="700" fill={colour} stroke="var(--surface)" strokeWidth="3" paintOrder="stroke">{label}</text>
      )}
    </g>
  );
}

/** Dashed vertical (x = c) or horizontal (y = c) line, used for asymptotes and axes of symmetry. */
export function Guide({ x, y, colour = "var(--text-muted)", label }: { x?: number; y?: number; colour?: string; label?: string }) {
  const { sx, sy, W, H } = useScale();
  if (x !== undefined) {
    return (
      <g>
        <line x1={sx(x)} x2={sx(x)} y1={0} y2={H} stroke={colour} strokeDasharray="5 5" strokeWidth={1.6} />
        {label && <text x={sx(x) + 5} y={14} fontSize="11" fill={colour} fontWeight="600" stroke="var(--surface)" strokeWidth="3" paintOrder="stroke">{label}</text>}
      </g>
    );
  }
  if (y !== undefined) {
    return (
      <g>
        <line y1={sy(y)} y2={sy(y)} x1={0} x2={W} stroke={colour} strokeDasharray="5 5" strokeWidth={1.6} />
        {label && <text x={W - 6} y={sy(y) - 5} textAnchor="end" fontSize="11" fill={colour} fontWeight="600" stroke="var(--surface)" strokeWidth="3" paintOrder="stroke">{label}</text>}
      </g>
    );
  }
  return null;
}

export function Segment({ x1, y1, x2, y2, colour = "var(--curve-3)", dashed, width = 2, cap = "round" }: { x1: number; y1: number; x2: number; y2: number; colour?: string; dashed?: boolean; width?: number; cap?: "round" | "butt" }) {
  const { sx, sy } = useScale();
  return <line x1={sx(x1)} y1={sy(y1)} x2={sx(x2)} y2={sy(y2)} stroke={colour} strokeWidth={width} strokeDasharray={dashed ? "5 4" : undefined} strokeLinecap={cap} />;
}

/** Shade the x-axis where a condition holds (for inequalities). */
export function AxisBand({ from, to, colour = "var(--success)" }: { from: number; to: number; colour?: string }) {
  const { sx, sy, view } = useScale();
  const a = Math.max(from, view.xMin);
  const b = Math.min(to, view.xMax);
  if (b <= a) return null;
  return <rect x={sx(a)} y={sy(0) - 4} width={sx(b) - sx(a)} height={8} rx={4} fill={colour} opacity={0.75} />;
}

/** Shade the region between two curves (or a curve and the x-axis) over [from, to]. */
export function AreaBetween({ f, g = () => 0, from, to, colour = "var(--curve-1)", opacity = 0.15 }: { f: (x: number) => number; g?: (x: number) => number; from: number; to: number; colour?: string; opacity?: number }) {
  const { sx, sy, view } = useScale();
  const a = Math.max(from, view.xMin);
  const b = Math.min(to, view.xMax);
  if (b <= a) return null;
  const n = 80;
  const top: string[] = [];
  const bottom: string[] = [];
  for (let k = 0; k <= n; k++) {
    const x = a + ((b - a) * k) / n;
    top.push(`${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)}`);
    bottom.unshift(`${sx(x).toFixed(1)},${sy(g(x)).toFixed(1)}`);
  }
  return <polygon points={[...top, ...bottom].join(" ")} fill={colour} opacity={opacity} />;
}

export function useGraphScale() {
  return useScale();
}

/** A polyline through data points in graph units (simulation traces, titration curves…). */
export function Polyline({ points, colour = "var(--curve-1)", width = 2.5, dashed, fill }: { points: [number, number][]; colour?: string; width?: number; dashed?: boolean; fill?: string }) {
  const { sx, sy } = useScale();
  if (points.length < 2) return null;
  const d = points.map(([x, y], i) => `${i ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join("");
  return <path d={fill ? `${d}L${sx(points[points.length - 1][0]).toFixed(1)},${sy(0).toFixed(1)}L${sx(points[0][0]).toFixed(1)},${sy(0).toFixed(1)}Z` : d} fill={fill ?? "none"} className={fill ? undefined : "curve"} stroke={fill ? "none" : colour} strokeWidth={width} strokeDasharray={dashed ? "6 5" : undefined} />;
}

/** A text label placed in graph units. */
export function Label({ x, y, children, colour = "var(--text-muted)", anchor = "start", size = 11 }: { x: number; y: number; children: React.ReactNode; colour?: string; anchor?: "start" | "middle" | "end"; size?: number }) {
  const { sx, sy } = useScale();
  return <text x={sx(x)} y={sy(y)} textAnchor={anchor} fontSize={size} fontWeight="700" fill={colour} stroke="var(--surface)" strokeWidth="3" paintOrder="stroke">{children}</text>;
}
