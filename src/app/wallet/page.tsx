"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { COUNTRIES, type Status, type WorkType } from "@/lib/readiness";
import { getTask } from "@/lib/tasks";
import { loadSubmissions } from "@/lib/store";

const KEY = "proofpath:wallet";
const ORDER: Status[] = ["not_started", "in_progress", "done"];
const LABEL: Record<Status, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  done: "Done",
};
const STYLE: Record<Status, string> = {
  not_started: "bg-gray-100 text-gray-700",
  in_progress: "bg-amber-100 text-amber-800",
  done: "bg-emerald-100 text-emerald-800",
};

export default function Wallet() {
  const [loaded, setLoaded] = useState(false);
  const [country, setCountry] = useState("kenya");
  const [workType, setWorkType] = useState<WorkType>("local");
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [earned, setEarned] = useState(0);
  const [paidOut, setPaidOut] = useState(0);
  const [stage, setStage] = useState<"idle" | "sending" | "done">("idle");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (saved.country && COUNTRIES[saved.country]) setCountry(saved.country);
      if (saved.workType) setWorkType(saved.workType);
      if (saved.status) setStatus(saved.status);
      if (saved.paidOut) setPaidOut(saved.paidOut);
    } catch {}
    const total = Object.values(loadSubmissions())
      .filter((s) => s.token)
      .reduce((sum, s) => sum + (getTask(s.taskId)?.payKES || 0), 0);
    setEarned(total);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ country, workType, status, paidOut }));
    } catch {}
  }, [loaded, country, workType, status, paidOut]);

  const c = COUNTRIES[country];
  const steps = c.steps.filter((s) => s.appliesTo.includes(workType));
  const doneCount = steps.filter((s) => status[s.id] === "done").length;
  const pct = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;
  const nextStep = steps.find((s) => status[s.id] !== "done");

  const balance = earned - paidOut;
  const walletReady = status["mobile-money"] === "done";
  const canPayout = balance > 0 && walletReady;

  function cycle(id: string) {
    const cur = status[id] || "not_started";
    setStatus({ ...status, [id]: ORDER[(ORDER.indexOf(cur) + 1) % ORDER.length] });
  }

  function payout() {
    setStage("sending");
    setTimeout(() => {
      setPaidOut(paidOut + balance);
      setStage("done");
    }, 1500);
  }

  return (
    <main className="mx-auto max-w-xl p-4 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Access Wallet</h1>
        <div className="flex gap-3 text-sm text-emerald-700 underline">
          <Link href="/tasks">Tasks</Link>
          <Link href="/ledger">Ledger</Link>
        </div>
      </div>
      <p className="mt-1 text-gray-600">Get ready to be paid. Each step unlocks real work.</p>

      <p className="mt-3 rounded-lg bg-amber-50 p-2 text-sm text-amber-900">
        Guidance only, not legal advice. Rules change and depend on your situation. Always confirm with a legal aid
        organisation, UNHCR or the official office.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <label className="text-sm">
          Country
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 w-full rounded-lg border bg-white p-2 text-gray-900"
          >
            {Object.entries(COUNTRIES).map(([k, v]) => (
              <option key={k} value={k}>
                {v.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Type of work
          <select
            value={workType}
            onChange={(e) => setWorkType(e.target.value as WorkType)}
            className="mt-1 w-full rounded-lg border bg-white p-2 text-gray-900"
          >
            <option value="local">Local work</option>
            <option value="remote">Remote work</option>
          </select>
        </label>
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-sm">
          <span>Readiness</span>
          <span>
            {doneCount}/{steps.length} ({pct}%)
          </span>
        </div>
        <div className="mt-1 h-3 w-full rounded-full bg-gray-200">
          <div className="h-3 rounded-full bg-emerald-600" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {nextStep && (
        <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
          <strong>Next action:</strong> {nextStep.nextAction}
        </p>
      )}
      {!nextStep && steps.length > 0 && (
        <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
          All steps done. You are ready to take on work.
        </p>
      )}

      <ul className="mt-4 space-y-3">
        {steps.map((s) => {
          const st = status[s.id] || "not_started";
          return (
            <li key={s.id} className="rounded-xl border bg-white p-3 text-gray-900">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">
                  {s.id === "mobile-money" ? c.wallet && s.title : s.title}
                </p>
                <button
                  onClick={() => cycle(s.id)}
                  className={`whitespace-nowrap rounded-full px-3 py-1 text-xs ${STYLE[st]}`}
                >
                  {LABEL[st]}
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-600">{s.why}</p>
              {st !== "done" && <p className="mt-2 text-sm text-gray-800">→ {s.nextAction}</p>}
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs text-gray-500">Tap a status to change it: not started, in progress, done.</p>

      <section className="mt-8 rounded-xl border bg-white p-4 text-gray-900">
        <h2 className="text-lg font-semibold">Your earnings</h2>
        <p className="mt-1 text-3xl font-bold text-emerald-700">KES {balance}</p>
        <p className="text-sm text-gray-600">From verified tasks in your Work Ledger (demo amounts).</p>

        {earned === 0 && (
          <p className="mt-3 text-sm text-gray-700">
            Complete a task and get it approved at <Link href="/review" className="text-emerald-700 underline">/review</Link>{" "}
            to earn your first payment.
          </p>
        )}
        {earned > 0 && !walletReady && (
          <p className="mt-3 rounded-lg bg-amber-100 p-2 text-sm text-amber-900">
            Payout locked. Mark &quot;Register a mobile money wallet&quot; as <strong>Done</strong> to unlock it.
          </p>
        )}

        <button
          onClick={payout}
          disabled={!canPayout || stage === "sending"}
          className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
        >
          {stage === "sending" ? `Sending to ${c.wallet}...` : `Withdraw to ${c.wallet}`}
        </button>

        {stage === "done" && (
          <div className="mt-4 rounded-xl border-2 border-emerald-600 p-4 text-center">
            <p className="text-xs font-semibold text-gray-500">SIMULATED PAYMENT. NO REAL MONEY MOVED.</p>
            <p className="mt-1 text-lg font-bold text-emerald-700">Payment received ✓</p>
            <p className="text-sm text-gray-700">
              {c.wallet}: KES {paidOut} credited to your wallet for verified work.
            </p>
          </div>
        )}
      </section>

      <button
        onClick={() => {
          setStatus({});
          setPaidOut(0);
          setStage("idle");
        }}
        className="mt-8 text-sm text-gray-500 underline"
      >
        Reset wallet demo
      </button>
    </main>
  );
}
