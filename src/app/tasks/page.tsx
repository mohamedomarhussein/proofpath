"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TASKS, LEVEL_NAMES } from "@/lib/tasks";
import { loadSubmissions, isLevelUnlocked, resetSubmissions, type Submission } from "@/lib/store";

export default function Tasks() {
  const [subs, setSubs] = useState<Record<string, Submission>>({});

  useEffect(() => {
    setSubs(loadSubmissions());
  }, []);

  const earned = TASKS.filter((t) => subs[t.id]?.passed).reduce((sum, t) => sum + t.payKES, 0);

  return (
    <main className="mx-auto max-w-xl p-4 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Trust Ladder</h1>
        <Link href="/onboarding" className="text-sm text-emerald-700 underline">
          Profile
        </Link>
      </div>
      <p className="mt-1 text-gray-600">Complete real tasks to unlock better-paid work.</p>
      <p className="mt-2 rounded-lg bg-emerald-50 p-2 text-sm text-emerald-900">
        Earned so far (pending review): <strong>KES {earned}</strong>
      </p>

      {([1, 2, 3] as const).map((level) => {
        const levelTasks = TASKS.filter((t) => t.level === level);
        const unlocked = isLevelUnlocked(level, subs);
        const done = levelTasks.filter((t) => subs[t.id]?.passed).length;
        return (
          <section key={level} className={`mt-6 ${unlocked ? "" : "opacity-50"}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Level {level}: {LEVEL_NAMES[level]} {unlocked ? "" : "🔒"}
              </h2>
              <span className="text-sm text-gray-600">
                {done}/{levelTasks.length}
              </span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-emerald-600"
                style={{ width: `${(done / levelTasks.length) * 100}%` }}
              />
            </div>

            <ul className="mt-3 space-y-2">
              {levelTasks.map((t) => {
                const s = subs[t.id];
                const card = (
                  <div className="rounded-xl border bg-white p-3 text-gray-900">
                    <div className="flex justify-between gap-2">
                      <span className="font-medium">{t.title}</span>
                      <span className="whitespace-nowrap text-sm text-emerald-700">KES {t.payKES}</span>
                    </div>
                    <div className="mt-1 flex gap-2 text-xs text-gray-600">
                      <span>{t.category}</span>
                      {s && (
                        <span className={s.passed ? "text-emerald-700" : "text-amber-700"}>
                          {s.passed ? `Passed (${s.total})` : `Try again (${s.total})`}
                        </span>
                      )}
                    </div>
                  </div>
                );
                return (
                  <li key={t.id}>
                    {unlocked ? <Link href={`/tasks/${t.id}`}>{card}</Link> : card}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <button
        onClick={() => {
          resetSubmissions();
          setSubs({});
        }}
        className="mt-8 text-sm text-gray-500 underline"
      >
        Reset demo progress
      </button>
    </main>
  );
}
