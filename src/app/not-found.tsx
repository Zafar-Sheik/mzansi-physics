import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <div className="font-mono text-sm text-danger">Error 404: page has undergone total internal reflection.</div>
      <h1 className="mt-3 font-display text-5xl font-bold">404</h1>
      <p className="mt-3 text-lg text-muted">This page has a velocity of zero and a displacement of… nowhere. Like an electron jumping to a higher energy level, it has left its usual place.</p>
      <Link href="/" className="mt-6 inline-block rounded-xl bg-brand px-5 py-2.5 font-semibold text-white">Return to ground state</Link>
    </div>
  );
}
