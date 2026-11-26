"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TASKS, getTask } from "@/lib/tasks";
import { getName, loadSubmissions, type Submission } from "@/lib/store";
import { COUNTRIES, type Status, type WorkType } from "@/lib/readiness";
import { ROLES, COURSES, CATEGORY_LABEL, type Requirement } from "@/lib/jobs";

const GRADUATE_AT = 3;

function reqLabel(r: Requirement) {
  return `${r.minTasks} verified ${CATEGORY_LABEL[r.key]} task${r.minTasks > 1 ? "s" : ""}${
    r.minLevel > 1 ? ` at Level ${r.minLevel}+` : ""
  }`;
}

export default function Hire() {
  const [entries, setEntries] = useState<Submission[]>([]);
  const [name, setNameState] = useState("Hassan");
  const [country, setCountry] = useState("kenya");
  const [workType, setWorkType] = useState<WorkType>("local");
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    setNameState(getName("candidate", "Hassan"));
    setEntries(Object.values(loadSubmissions()).filter((s) => s.token && s.passed));
    try {
      const w = JSON.parse(localStorage.getItem("proofpath:wallet") || "{}");
      if (w.country && COUNTRIES[w.country]) setCountry(w.country);
      if (w.workType) setWorkType(w.workType);
      if (w.status) setStatus(w.status);
    } catch {}
  }, []);

  const count = entries.length;
  const earned = entries.reduce((sum, s) => sum + (getTask(s.taskId)?.payKES || 0), 0);
  const avg = count ? Math.round(entries.reduce((sum, s) => sum + s.total, 0) / count) : 0;
  const maxLevel = entries.reduce((m, s) => Math.max(m, getTask(s.taskId)?.level || 0), 0);
  const categories = [...new Set(entries.map((s) => getTask(s.taskId)?.category).filter(Boolean))] as string[];

  const steps = COUNTRIES[country].steps.filter((s) => s.appliesTo.includes(workType));
  const readyPct = steps.length
    ? Math.round((steps.filter((s) => status[s.id] === "done").length / steps.length) * 100)
    : 0;

  function meets(r: Requirement) {
    return (
      entries.filter((s) => {
        const t = getTask(s.taskId);
        return t && t.category === r.key && t.level >= r.minLevel;
      }).length >= r.minTasks
    );
  }

  const roles = ROLES.map((role) => {
    const checks = role.requirements.map((r) => ({ r, met: meets(r) }));
    const pct = Math.round((checks.filter((c) => c.met).length / checks.length) * 100);
    const accessOk = !role.remote || (status["mobile-money"] === "done" && status["platform"] === "done");
    return { role, checks, pct, accessOk };
  }).sort((a, b) => b.pct - a.pct);

  const bestOpen = roles.find((r) => r.pct < 100);
  const topGap = bestOpen?.checks.find((c) => !c.met)?.r;
  const gapTask = topGap
    ? TASKS.find(
        (t) =>
          t.category === topGap.key &&
          t.level >= topGap.minLevel &&
          !entries.some((s) => s.taskId === t.id)
      )
    : undefined;
  const gapCourse = topGap ? COURSES[topGap.key][0] : undefined;

  if (count < GRADUATE_AT) {
    return (
      <main className="mx-auto max-w-xl p-4 pb-16">
        <h1 className="text-2xl font-bold">Ready for Hire</h1>
        <p className="mt-1 text-gray-600">
          Complete {GRADUATE_AT} verified tasks to graduate and unlock your profile and job matches.
        </p>
        <div className="mt-4 rounded-xl border bg-white p-4 text-gray-900">
          <p className="text-3xl font-bold text-emerald-700">
            {count}/{GRADUATE_AT}
          </p>
          <p className="text-sm text-gray-600">verified tasks so far</p>
          <div className="mt-2 h-3 w-full rounded-full bg-gray-200">
            <div className="h-3 rounded-full bg-emerald-600" style={{ width: `${(count / GRADUATE_AT) * 100}%` }} />
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-700">
          Do tasks at <Link href="/tasks" className="text-emerald-700 underline">/tasks</Link>, then approve them at{" "}
          <Link href="/review" className="text-emerald-700 underline">/review</Link>.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl p-4 pb-16">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold">Ready for Hire 🎓</h1>
        <div className="flex gap-3 text-sm text-emerald-700 underline">
          <Link href="/ledger">Ledger</Link>
          <Link href="/wallet">Wallet</Link>
        </div>
      </div>

      <section className="mt-4 rounded-2xl bg-emerald-600 p-5 text-white">
        <p className="text-sm opacity-90">ProofPath graduate</p>
        <p className="text-3xl font-bold">{name}</p>
        <p className="mt-1 text-sm">
          Skills proven through real work: {categories.map((c) => c.replace("-", " ")).join(", ")}
        </p>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          <div><div className="text-xl font-bold">{count}</div><div className="text-xs">verified</div></div>
          <div><div className="text-xl font-bold">{avg}</div><div className="text-xs">avg score</div></div>
          <div><div className="text-xl font-bold">L{maxLevel}</div><div className="text-xs">top level</div></div>
          <div><div className="text-xl font-bold">{readyPct}%</div><div className="text-xs">work-ready</div></div>
        </div>
        <p className="mt-3 text-xs opacity-90">KES {earned} earned through verified work (demo amounts)</p>
      </section>

      <h2 className="mt-8 text-lg font-semibold">Portfolio: verified work</h2>
      <ul className="mt-2 space-y-2">
        {entries.map((s) => {
          const t = getTask(s.taskId);
          return (
            <li key={s.taskId} className="rounded-xl border bg-white p-3 text-gray-900">
              <div className="flex justify-between gap-2">
                <span className="font-medium">{t?.title}</span>
                <span className="whitespace-nowrap text-emerald-700">{s.total}/100</span>
              </div>
              <p className="text-xs text-gray-500">
                {t?.clientName} · Level {t?.level} · reviewed by {s.reviewerName}
              </p>
              <Link href={`/verify/${s.token}`} target="_blank" className="text-sm text-emerald-700 underline print:hidden">
                Verify this entry
              </Link>
              <p className="hidden break-all text-xs text-gray-500 print:block">
                {origin}/verify/{s.token?.slice(0, 24)}...
              </p>
            </li>
          );
        })}
      </ul>
      <button
        onClick={() => window.print()}
        className="mt-3 w-full rounded-xl border px-4 py-3 font-medium print:hidden"
      >
        Save profile as PDF / Print
      </button>

      <h2 className="mt-8 text-lg font-semibold print:hidden">Your job matches</h2>
      <ul className="mt-2 space-y-3 print:hidden">
        {roles.map(({ role, checks, pct, accessOk }) => (
          <li key={role.id} className="rounded-xl border bg-white p-4 text-gray-900">
            <div className="flex justify-between gap-2">
              <p className="font-medium">{role.title}</p>
              <span className={`whitespace-nowrap font-bold ${pct === 100 ? "text-emerald-700" : "text-amber-700"}`}>
                {pct}% match
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {role.employer} · {role.remote ? "Remote" : "Local"}
            </p>
            <p className="mt-1 text-sm text-gray-700">{role.summary}</p>
            <ul className="mt-2 space-y-1 text-sm">
              {checks.map(({ r, met }) => (
                <li key={reqLabel(r)} className={met ? "text-emerald-700" : "text-gray-700"}>
                  {met ? "✓" : "○"} {reqLabel(r)}
                </li>
              ))}
              <li className={accessOk ? "text-emerald-700" : "text-amber-700"}>
                {accessOk
                  ? "✓ Work access ready"
                  : "○ Work access: finish the mobile money and payment account steps in your Access Wallet"}
              </li>
            </ul>
          </li>
        ))}
      </ul>

      <section className="mt-8 rounded-xl border-2 border-emerald-600 bg-white p-4 text-gray-900 print:hidden">
        <h2 className="text-lg font-semibold">Your top skill gap</h2>
        {!topGap ? (
          <p className="mt-1 text-sm text-gray-700">You meet every requirement for the sample roles. Great work.</p>
        ) : (
          <>
            <p className="mt-1 text-sm text-gray-700">
              To unlock <strong>{bestOpen?.role.title}</strong>, you still need{" "}
              <strong>{reqLabel(topGap)}</strong>.
            </p>
            {gapTask && (
              <p className="mt-3 text-sm">
                <strong>Cheapest step (free, 10 minutes):</strong> complete{" "}
                <Link href={`/tasks/${gapTask.id}`} className="text-emerald-700 underline">
                  {gapTask.title}
                </Link>{" "}
                on ProofPath.
              </p>
            )}
            {gapCourse && (
              <p className="mt-2 text-sm">
                <strong>To go deeper:</strong> {gapCourse.title} on{" "}
                <a href={gapCourse.url} target="_blank" rel="noreferrer" className="text-emerald-700 underline">
                  {gapCourse.provider}
                </a>
                . {gapCourse.cost}, about {gapCourse.weeks} weeks.
              </p>
            )}
          </>
        )}
      </section>

      <p className="mt-6 text-xs text-gray-500">
        Roles are samples for the demo. Matches are based on verified work in your ledger and are not a promise of a
        job. Course availability and pricing can change, so confirm on the provider&apos;s site.
      </p>
    </main>
  );
}
