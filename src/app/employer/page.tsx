"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTask } from "@/lib/tasks";
import { getName, loadSubmissions } from "@/lib/store";
import { CATEGORY_LABEL, type Category } from "@/lib/jobs";

interface Entry {
  category: Category;
  level: number;
  score: number;
  title?: string;
  token?: string;
}
interface Cand {
  name: string;
  sample: boolean;
  entries: Entry[];
}

// Fictional candidates so the ranking has something to compare against.
const SAMPLES: Cand[] = [
  {
    name: "Amina K.",
    sample: true,
    entries: [
      { category: "bookkeeping", level: 3, score: 90 },
      { category: "bookkeeping", level: 2, score: 88 },
      { category: "data-entry", level: 1, score: 92 },
      { category: "data-entry", level: 3, score: 85 },
    ],
  },
  {
    name: "Joseph M.",
    sample: true,
    entries: [
      { category: "translation", level: 1, score: 80 },
      { category: "translation", level: 2, score: 75 },
      { category: "data-entry", level: 1, score: 70 },
    ],
  },
  {
    name: "Layla S.",
    sample: true,
    entries: [
      { category: "data-entry", level: 1, score: 65 },
      { category: "translation", level: 1, score: 72 },
    ],
  },
];

const CATS: Category[] = ["translation", "data-entry", "bookkeeping"];

export default function Employer() {
  const [live, setLive] = useState<Cand | null>(null);
  const [title, setTitle] = useState("Arabic–English Translator");
  const [category, setCategory] = useState<Category>("translation");
  const [minLevel, setMinLevel] = useState(1);
  const [minTasks, setMinTasks] = useState(2);
  const [posted, setPosted] = useState<{ title: string; category: Category; minLevel: number; minTasks: number } | null>(null);

  useEffect(() => {
    const entries: Entry[] = Object.values(loadSubmissions())
      .filter((s) => s.token && s.passed)
      .map((s) => {
        const t = getTask(s.taskId);
        return {
          category: (t?.category || "data-entry") as Category,
          level: t?.level || 1,
          score: s.total,
          title: t?.title,
          token: s.token,
        };
      });
    if (entries.length) setLive({ name: getName("candidate", "Hassan"), sample: false, entries });
  }, []);

  const all = [...(live ? [live] : []), ...SAMPLES];

  const ranked = posted
    ? all.map((c) => {
        const q = c.entries.filter((e) => e.category === posted.category && e.level >= posted.minLevel);
        const strength = Math.round(q.reduce((sum, e) => sum + (e.score * e.level) / 10, 0));
        const avg = q.length ? Math.round(q.reduce((s, e) => s + e.score, 0) / q.length) : 0;
        return { c, q, strength, avg, qualifies: q.length >= posted.minTasks };
      })
    : [];
  const matches = ranked.filter((r) => r.qualifies).sort((a, b) => b.strength - a.strength);
  const others = ranked.filter((r) => !r.qualifies);

  return (
    <main className="mx-auto max-w-xl p-4 pb-16">
      <h1 className="text-2xl font-bold">Employer view</h1>
      <p className="mt-1 text-gray-600">
        Post a role and see candidates whose work history is verified. No certificates needed.
      </p>

      <section className="mt-4 space-y-3 rounded-xl border bg-white p-4 text-gray-900">
        <label className="block text-sm">
          Role title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border p-2"
          />
        </label>
        <div className="grid grid-cols-3 gap-2">
          <label className="text-sm">
            Skill
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="mt-1 w-full rounded-lg border bg-white p-2"
            >
              {CATS.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Min level
            <select
              value={minLevel}
              onChange={(e) => setMinLevel(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border bg-white p-2"
            >
              {[1, 2, 3].map((n) => (
                <option key={n} value={n}>
                  Level {n}+
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Min tasks
            <select
              value={minTasks}
              onChange={(e) => setMinTasks(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border bg-white p-2"
            >
              {[1, 2, 3].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          onClick={() => setPosted({ title, category, minLevel, minTasks })}
          disabled={title.trim().length < 3}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
        >
          Post role and find candidates
        </button>
      </section>

      {posted && (
        <>
          <p className="mt-4 rounded-lg bg-emerald-50 p-2 text-sm text-emerald-900">
            Role posted (demo): <strong>{posted.title}</strong>, needs {posted.minTasks} verified{" "}
            {CATEGORY_LABEL[posted.category]} task{posted.minTasks > 1 ? "s" : ""}
            {posted.minLevel > 1 ? ` at Level ${posted.minLevel}+` : ""}.
          </p>

          <h2 className="mt-6 text-lg font-semibold">Ranked candidates ({matches.length})</h2>
          {matches.length === 0 && (
            <p className="mt-2 text-sm text-gray-600">
              No candidates meet this yet. Try lowering the level or number of tasks.
              {!live && (
                <>
                  {" "}
                  Tip: load Hassan from the{" "}
                  <Link href="/" className="text-emerald-700 underline">
                    home page
                  </Link>
                  .
                </>
              )}
            </p>
          )}

          <ul className="mt-2 space-y-3">
            {matches.map((r, i) => (
              <li key={r.c.name} className="rounded-xl border bg-white p-4 text-gray-900">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">
                      #{i + 1} {r.c.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {r.c.sample ? "Sample candidate (fictional data)" : "Live: verified in ProofPath ledger"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-700">{r.strength}</p>
                    <p className="text-xs text-gray-500">ledger strength</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  {r.q.length} matching verified task{r.q.length > 1 ? "s" : ""} · average score {r.avg} · top level{" "}
                  {Math.max(...r.q.map((e) => e.level))}
                </p>
                {!r.c.sample && (
                  <ul className="mt-2 space-y-1 text-sm">
                    {r.q.map((e) => (
                      <li key={e.token}>
                        {e.title} ({e.score}){" "}
                        <Link href={`/verify/${e.token}`} target="_blank" className="text-emerald-700 underline">
                          Verify
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {others.length > 0 && (
            <>
              <h2 className="mt-6 text-sm font-semibold text-gray-600">Not matching yet</h2>
              <ul className="mt-1 space-y-1 text-sm text-gray-600">
                {others.map((r) => (
                  <li key={r.c.name}>
                    {r.c.name}: {r.q.length}/{posted.minTasks} matching tasks
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}

      <p className="mt-8 text-xs text-gray-500">
        Ledger strength = sum of (score × task level) ÷ 10, counting only tasks that match the role. It rewards harder
        verified work. A real version would add employer login and candidate consent before sharing a profile.
      </p>
    </main>
  );
}
