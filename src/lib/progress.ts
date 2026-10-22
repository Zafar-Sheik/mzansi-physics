"use client";
import { createPersistedStore, useStore } from "./store";
import { todayKey } from "./utils";
import { TOPICS } from "./topics";
import type { Topic } from "@/content/types";

export interface Progress {
  xp: number;
  completedLessons: Record<string, { at: number; quizScore?: number }>;
  /** lesson slug -> chunk ids that have been read */
  chunks: Record<string, string[]>;
  quizzes: Record<string, { correct: number; total: number }>;
  /** exam question id -> best self-marked score */
  exams: Record<string, { score: number; total: number; at: number }>;
  /** sequence / match / sorter puzzles solved */
  puzzles: Record<string, number>;
  /** mock paper id -> attempts (oldest first, last 10 kept) */
  mocks: Record<string, MockAttempt[]>;
  /** topic -> generated drill questions answered */
  drills: Record<string, { right: number; tried: number }>;
  badges: string[];
  /** yyyy-mm-dd -> xp earned that day */
  activity: Record<string, number>;
  stats: { cardsReviewed: number; arenaRounds: number; games: number; calculations: number; focusSessions: number; toolsUsed: number };
}

export interface MockAttempt {
  score: number;
  total: number;
  at: number;
  /** minutes used */
  minutes: number;
  quick: boolean;
  /** topic -> [score, total] */
  byTopic: Record<string, [number, number]>;
}

export const EMPTY_PROGRESS: Progress = {
  xp: 0,
  completedLessons: {},
  chunks: {},
  quizzes: {},
  exams: {},
  puzzles: {},
  mocks: {},
  drills: {},
  badges: [],
  activity: {},
  stats: { cardsReviewed: 0, arenaRounds: 0, games: 0, calculations: 0, focusSessions: 0, toolsUsed: 0 },
};

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

/** A fun name for the badge you earn by finishing every lesson in a topic. */
const TOPIC_BADGE_NAMES: Record<Topic, string> = {
  "g10-motion": "On the Move",
  "g10-energy": "Energy Saver",
  "g10-waves": "Wave Rider",
  "g10-sound": "Sound Check",
  "g10-em": "Photon Finder",
  "g10-magnetism": "Magnetic Personality",
  "g10-electrostatics": "Static Shock",
  "g10-circuits": "Circuit Breaker",
  "g10-matter": "Matter Master",
  "g10-states": "State Shifter",
  "g10-atom": "Atom Smasher",
  "g10-periodic": "Table Tamer",
  "g10-bonding": "Bond, Chemical Bond",
  "g10-change": "Change Maker",
  "g10-reactions": "Solution Seeker",
  "g10-mole": "Mole Hunter",
  "g10-hydrosphere": "Water Wise",
  "g11-vectors": "Vector Voyager",
  "g11-newton": "Newton's Apprentice",
  "g11-gravitation": "Gravity Guru",
  "g11-optics": "Light Bender",
  "g11-wavefronts": "Wavefront Wizard",
  "g11-electrostatics": "Field Marshal",
  "g11-electromagnetism": "Faraday's Friend",
  "g11-circuits": "Ohm Sweet Ohm",
  "g11-molecules": "Shape Shifter",
  "g11-imf": "Sticky Situation",
  "g11-gases": "Gas Giant",
  "g11-stoichiometry": "Stoich Star",
  "g11-energy-change": "Heat Seeker",
  "g11-reactions": "Redox Ranger",
  "g11-lithosphere": "Gold Digger",
  "g12-momentum": "Unstoppable Force",
  "g12-projectile": "Sky High",
  "g12-work-energy": "Power House",
  "g12-doppler": "Siren Song",
  "g12-circuits": "Internal Affairs",
  "g12-electrodynamics": "Dynamo",
  "g12-photoelectric": "Einstein's Light",
  "g12-organic": "Carbon Captain",
  "g12-rates": "Speed Demon",
  "g12-equilibrium": "Le Chatelier's Champion",
  "g12-acids": "pH Phenom",
  "g12-electrochem": "Cell Mate",
  "g12-fertilisers": "Green Fingers",
};

export const BADGES: BadgeDef[] = [
  { id: "first-lesson", name: "First Steps", description: "Completed your first lesson.", emoji: "👟" },
  ...TOPICS.map((t) => ({ id: t.topic, name: TOPIC_BADGE_NAMES[t.topic], description: `Completed Grade ${t.grade} ${t.title}.`, emoji: t.emoji })),
  { id: "matric-ready", name: "Physical Sciences Pro", description: "Completed every lesson in the course.", emoji: "🎓" },
  { id: "card-shark", name: "Card Shark", description: "Reviewed 100 flashcards.", emoji: "🃏" },
  { id: "arena", name: "Arena Champion", description: "Finished 5 Quiz Arena rounds.", emoji: "🏟️" },
  { id: "examiner", name: "Exam Ready", description: "Self-marked 5 exam-style questions.", emoji: "📝" },
  { id: "calculator", name: "Number Cruncher", description: "Got 50 typed answers right.", emoji: "🧮" },
  { id: "tinkerer", name: "Lab Rat", description: "Experimented with 10 simulations.", emoji: "🔬" },
  { id: "gamer", name: "Game On", description: "Played 5 revision games.", emoji: "🎮" },
  { id: "streak-3", name: "On a Roll", description: "Learned on 3 days in a row.", emoji: "🔥" },
  { id: "streak-7", name: "Unstoppable", description: "Learned on 7 days in a row.", emoji: "⚡" },
  { id: "focus", name: "Deep Focus", description: "Finished 3 focus-timer sessions.", emoji: "🎧" },
  { id: "perfect-quiz", name: "Sharp Shooter", description: "Got 100% on a quiz.", emoji: "🎯" },
  { id: "mock-paper", name: "Dress Rehearsal", description: "Wrote and marked a mock paper.", emoji: "🕰️" },
  { id: "distinction", name: "Distinction", description: "Scored 80% or more on a mock paper.", emoji: "🏅" },
];

/** Badge id awarded for finishing every lesson of a topic (badge ids match topic ids). */
export const TOPIC_BADGES: Record<string, string> = Object.fromEntries(TOPICS.map((t) => [t.topic, t.topic]));

export const progressStore = createPersistedStore<Progress>("physicsmzansi:progress", EMPTY_PROGRESS);
export const useProgress = () => useStore(progressStore);

type Listener = (e: { type: "xp"; amount: number; reason: string } | { type: "badge"; badge: BadgeDef }) => void;
const rewardListeners = new Set<Listener>();
export function onReward(l: Listener) {
  rewardListeners.add(l);
  return () => {
    rewardListeners.delete(l);
  };
}

export function levelFor(xp: number) {
  // Each level needs a little more XP than the last: 100, 250, 450, 700 ...
  let level = 1;
  let need = 100;
  let floor = 0;
  while (xp >= floor + need) {
    floor += need;
    level++;
    need += 50;
  }
  return { level, into: xp - floor, need };
}

export function streak(activity: Record<string, number>): number {
  let count = 0;
  const d = new Date();
  if (!activity[todayKey(d)]) d.setDate(d.getDate() - 1);
  while (activity[todayKey(d)]) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

function award(p: Progress, id: string): Progress {
  if (p.badges.includes(id)) return p;
  const badge = BADGES.find((b) => b.id === id);
  if (badge) setTimeout(() => rewardListeners.forEach((l) => l({ type: "badge", badge })), 0);
  return { ...p, badges: [...p.badges, id] };
}

function checkBadges(p: Progress, topicLessons?: Record<string, string[]>): Progress {
  let next = p;
  const stats = { ...EMPTY_PROGRESS.stats, ...next.stats };
  if (Object.keys(next.completedLessons).length >= 1) next = award(next, "first-lesson");
  if (stats.cardsReviewed >= 100) next = award(next, "card-shark");
  if (stats.arenaRounds >= 5) next = award(next, "arena");
  if (Object.keys(next.exams ?? {}).length >= 5) next = award(next, "examiner");
  if (stats.calculations >= 50) next = award(next, "calculator");
  if (stats.toolsUsed >= 10) next = award(next, "tinkerer");
  if (stats.games >= 5) next = award(next, "gamer");
  if (stats.focusSessions >= 3) next = award(next, "focus");
  const s = streak(next.activity);
  if (s >= 3) next = award(next, "streak-3");
  if (s >= 7) next = award(next, "streak-7");
  if (Object.values(next.quizzes).some((q) => q.total > 0 && q.correct === q.total)) next = award(next, "perfect-quiz");
  const mocks = Object.values(next.mocks ?? {}).flat();
  if (mocks.length) next = award(next, "mock-paper");
  if (mocks.some((m) => m.total > 0 && m.score / m.total >= 0.8)) next = award(next, "distinction");
  if (topicLessons) {
    let all = true;
    for (const [topic, slugs] of Object.entries(topicLessons)) {
      const done = slugs.length > 0 && slugs.every((s2) => next.completedLessons[s2]);
      if (done && TOPIC_BADGES[topic]) next = award(next, TOPIC_BADGES[topic]);
      all = all && done;
    }
    if (all && Object.keys(topicLessons).length) next = award(next, "matric-ready");
  }
  return next;
}

let topicIndex: Record<string, string[]> | undefined;
export function registerTopicIndex(idx: Record<string, string[]>) {
  topicIndex = idx;
}

function mutate(fn: (p: Progress) => Progress) {
  progressStore.set((p) => checkBadges(fn({ ...EMPTY_PROGRESS, ...p, stats: { ...EMPTY_PROGRESS.stats, ...p.stats } }), topicIndex));
}

export function addXp(amount: number, reason: string) {
  if (amount <= 0) return;
  mutate((p) => {
    const day = todayKey();
    return { ...p, xp: p.xp + amount, activity: { ...p.activity, [day]: (p.activity[day] ?? 0) + amount } };
  });
  rewardListeners.forEach((l) => l({ type: "xp", amount, reason }));
}

export function markChunk(lesson: string, chunk: string) {
  const p = progressStore.get();
  if (p.chunks[lesson]?.includes(chunk)) return;
  mutate((s) => ({ ...s, chunks: { ...s.chunks, [lesson]: [...(s.chunks[lesson] ?? []), chunk] } }));
  addXp(5, "Section read");
}

export function completeLesson(lesson: string, xp: number) {
  const p = progressStore.get();
  if (p.completedLessons[lesson]) return false;
  mutate((s) => ({ ...s, completedLessons: { ...s.completedLessons, [lesson]: { at: Date.now() } } }));
  addXp(xp, "Lesson complete");
  return true;
}

export function recordQuiz(id: string, correct: number, total: number) {
  const prev = progressStore.get().quizzes[id];
  mutate((s) => ({ ...s, quizzes: { ...s.quizzes, [id]: { correct: Math.max(correct, prev?.correct ?? 0), total } } }));
  if (!prev) addXp(correct * 10, "Quiz");
}

export function recordExam(id: string, score: number, total: number) {
  const prev = progressStore.get().exams?.[id];
  mutate((s) => ({ ...s, exams: { ...s.exams, [id]: { score: Math.max(score, prev?.score ?? 0), total, at: Date.now() } } }));
  if (!prev) addXp(10 + score * 2, "Exam question marked");
}

/** Sequence, match and sorter puzzles: XP the first time only. */
export function solvePuzzle(id: string, xp = 15) {
  const prev = progressStore.get().puzzles?.[id];
  mutate((s) => ({ ...s, puzzles: { ...s.puzzles, [id]: (prev ?? 0) + 1 } }));
  if (!prev) addXp(xp, "Puzzle solved");
}

export function bumpStat(stat: keyof Progress["stats"], by = 1) {
  mutate((s) => ({ ...s, stats: { ...s.stats, [stat]: (s.stats[stat] ?? 0) + by } }));
}

/** A finished, self-marked mock paper. */
export function recordMock(id: string, attempt: MockAttempt) {
  mutate((s) => ({ ...s, mocks: { ...s.mocks, [id]: [...(s.mocks?.[id] ?? []), attempt].slice(-10) } }));
  addXp(30 + Math.round((attempt.score / Math.max(1, attempt.total)) * 50), "Mock paper marked");
}

/** One generated drill question answered (feeds the weak-spot coach). */
export function recordDrill(topic: string, correct: boolean) {
  mutate((s) => {
    const d = s.drills?.[topic] ?? { right: 0, tried: 0 };
    return { ...s, drills: { ...s.drills, [topic]: { right: d.right + (correct ? 1 : 0), tried: d.tried + 1 } } };
  });
}
