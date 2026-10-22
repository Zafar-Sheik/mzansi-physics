import type { Metadata } from "next";
import { Toolkit } from "@/components/pages/toolkit";

export const metadata: Metadata = { title: "Virtual lab", description: "Physics and chemistry simulations: motion, projectiles, collisions, waves, light, circuits, magnets, atoms, gases, reactions, equilibrium, titrations and cells – plus the data sheets and endless drills." };

export default function ToolkitPage() {
  return <Toolkit />;
}
