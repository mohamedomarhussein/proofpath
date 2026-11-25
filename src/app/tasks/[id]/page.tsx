"use client";

import Link from "next/link";
import { use, useState } from "react";
import { getTask, PASS_MARK } from "@/lib/tasks";
import { saveSubmission, type Submission } from "@/lib/store";

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const task = getTask(id);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Submission | null>(null);

  if (!task) {
    return (
      <main className="mx-auto max-w-xl p-4">
        <p>Task not found.</p>
        <Link href="/tasks" className="text-emerald-700 underline">
          Back to tasks
        </Link>
      </main>
    );
  }

  async function submit() {
    if (!task) return;
    setBusy(true);
    setError("");
    try {
      let language = "English";
      try {
        const p = JSON.parse(localStorage.getItem("proofpath:profile") || "{}");
        language = { en: "English", sw: "Kiswahili", so: "Soomaali", ar: "Arabic" }[p.language as string] || "English";
      } catch {}

      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: task.id, answer, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      const sub: Submission = {
        taskId: task.id,
        answer,
        accuracy: data.accuracy,
        completeness: data.completeness,
        clarity: data.clarity,
        total: data.total,
        feedback: data.feedback,
        confidence: data.confidence,
        passed: data.passed,
        mock: data.mock,
        status: "pending_review",
        createdAt: new Date().toISOString(),
      };
      saveSubmission(sub);
      setResult(sub);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl p-4 pb-16">
      <Link href="/tasks" className="text-sm text-emerald-700 underline">
        ← Back to ladder
      </Link>
      <p className="mt-3 text-xs text-gray-500">
        Level {task.level} · {task.category} · KES {task.payKES}
      </p>
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <p className="mt-1 text-sm text-gray-500">{task.clientName}</p>
      <p className="mt-3 text-gray-800">{task.instructions}</p>

      <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-gray-100 p-3 text-gray-900" dir="auto">
        {task.source}
      </pre>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={6}
        placeholder="Write your answer here"
        className="mt-4 w-full rounded-xl border p-3 text-base text-gray-900"
        dir="auto"
      />

      <button
        onClick={submit}
        disabled={busy || answer.trim().length < 2}
        className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Grading..." : "Submit for grading"}
      </button>

      {error && <p className="mt-3 text-red-600">{error}</p>}

      {result && (
        <section className="mt-8 space-y-4 rounded-xl border bg-white p-4 text-gray-900">
          {result.mock && (
            <p className="rounded-lg bg-amber-100 p-2 text-sm text-amber-900">
              Mock grading: add your API key to .env.local for real AI grading.
            </p>
          )}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Score: {result.total}/100</h2>
            <span className={`rounded-full px-3 py-1 text-sm ${result.passed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
              {result.passed ? "Passed" : `Pass mark is ${PASS_MARK}`}
            </span>
          </div>
          <Bar label="Accuracy" value={result.accuracy} />
          <Bar label="Completeness" value={result.completeness} />
          <Bar label="Clarity" value={result.clarity} />
          <p dir="auto">{result.feedback}</p>
          <p className="text-xs text-gray-500">
            AI confidence: {result.confidence}. A human reviewer will check this grade before it enters your Work Ledger.
          </p>
          <Link href="/tasks" className="block rounded-xl border px-4 py-3 text-center font-medium">
            Back to the ladder
          </Link>
        </section>
      )}
    </main>
  );
}
