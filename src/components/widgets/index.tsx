"use client";
import dynamic from "next/dynamic";
import type { WidgetName } from "@/content/types";

const loading = () => <div className="h-64 animate-pulse rounded-2xl border border-line bg-surface-2" />;

/** Widgets are code-split so each lesson only downloads what it uses. */
const REGISTRY: Record<WidgetName, React.ComponentType<Record<string, unknown>>> = {
  sorter: dynamic(() => import("./sorter").then((m) => m.Sorter as never), { loading }),
  drill: dynamic(() => import("./drill").then((m) => m.Drill as never), { loading }),
  "motion-lab": dynamic(() => import("./motion-lab").then((m) => m.MotionLab as never), { loading }),
  "projectile-lab": dynamic(() => import("./projectile-lab").then((m) => m.ProjectileLab as never), { loading }),
  "energy-lab": dynamic(() => import("./energy-lab").then((m) => m.EnergyLab as never), { loading }),
  "vector-lab": dynamic(() => import("./vector-lab").then((m) => m.VectorLab as never), { loading }),
  "incline-lab": dynamic(() => import("./incline-lab").then((m) => m.InclineLab as never), { loading }),
  "collision-lab": dynamic(() => import("./collision-lab").then((m) => m.CollisionLab as never), { loading }),
  "gravity-lab": dynamic(() => import("./gravity-lab").then((m) => m.GravityLab as never), { loading }),
  "wave-lab": dynamic(() => import("./wave-lab").then((m) => m.WaveLab as never), { loading }),
  "pulse-lab": dynamic(() => import("./pulse-lab").then((m) => m.PulseLab as never), { loading }),
  "em-spectrum": dynamic(() => import("./em-spectrum").then((m) => m.EmSpectrum as never), { loading }),
  "refraction-lab": dynamic(() => import("./refraction-lab").then((m) => m.RefractionLab as never), { loading }),
  "diffraction-lab": dynamic(() => import("./diffraction-lab").then((m) => m.DiffractionLab as never), { loading }),
  "doppler-lab": dynamic(() => import("./doppler-lab").then((m) => m.DopplerLab as never), { loading }),
  "circuit-lab": dynamic(() => import("./circuit-lab").then((m) => m.CircuitLab as never), { loading }),
  "charge-lab": dynamic(() => import("./charge-lab").then((m) => m.ChargeLab as never), { loading }),
  "magnet-lab": dynamic(() => import("./magnet-lab").then((m) => m.MagnetLab as never), { loading }),
  "generator-lab": dynamic(() => import("./generator-lab").then((m) => m.GeneratorLab as never), { loading }),
  "photoelectric-lab": dynamic(() => import("./photoelectric-lab").then((m) => m.PhotoelectricLab as never), { loading }),
  "atom-builder": dynamic(() => import("./atom-builder").then((m) => m.AtomBuilder as never), { loading }),
  "periodic-table": dynamic(() => import("./periodic-table").then((m) => m.PeriodicTable as never), { loading }),
  "particle-box": dynamic(() => import("./particle-box").then((m) => m.ParticleBox as never), { loading }),
  "gas-lab": dynamic(() => import("./gas-lab").then((m) => m.GasLab as never), { loading }),
  "equation-balancer": dynamic(() => import("./equation-balancer").then((m) => m.EquationBalancer as never), { loading }),
  "mole-lab": dynamic(() => import("./mole-lab").then((m) => m.MoleLab as never), { loading }),
  "molecule-shapes": dynamic(() => import("./molecule-shapes").then((m) => m.MoleculeShapes as never), { loading }),
  "energy-profile": dynamic(() => import("./energy-profile").then((m) => m.EnergyProfile as never), { loading }),
  "rate-lab": dynamic(() => import("./rate-lab").then((m) => m.RateLab as never), { loading }),
  "equilibrium-lab": dynamic(() => import("./equilibrium-lab").then((m) => m.EquilibriumLab as never), { loading }),
  "titration-lab": dynamic(() => import("./titration-lab").then((m) => m.TitrationLab as never), { loading }),
  "cell-lab": dynamic(() => import("./cell-lab").then((m) => m.CellLab as never), { loading }),
  "organic-namer": dynamic(() => import("./organic-namer").then((m) => m.OrganicNamer as never), { loading }),
  "property-chart": dynamic(() => import("./property-chart").then((m) => m.PropertyChart as never), { loading }),
  "data-sheet": dynamic(() => import("./data-sheet").then((m) => m.DataSheet as never), { loading }),
};

export function Widget({ name, props }: { name: WidgetName; props?: Record<string, unknown> }) {
  const C = REGISTRY[name];
  if (!C) return <p className="text-danger">Unknown widget: {name}</p>;
  return <C {...(props ?? {})} />;
}
