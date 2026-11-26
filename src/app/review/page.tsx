"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTask, PASS_MARK } from "@/lib/tasks";
import { getName, loadSubmissions, saveSubmission, setName, type Submission } from "@/lib/store";

export default function Review() {
  const [subs, setSubs] = useState<Record<string, Submission>>({});
  const [candidate, setCandidate] = useState("Hassan");
  const [reviewer, setReviewer] = useState("Amina (NGO mentor)");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    setSubs(loadSubmissions());
    setCandidate(getName("candidate", "Hassan"));
    setReviewer(getName("reviewer", "Amina (NGO mentor)"));
  }, []);

  const all = Object.values(subs);
  const pending = all.filter((s) => s.status === "pending_review");
  const reviewed = all.filter((s) => s.status !== "pending_review");

  async function approve(sub: Submission) {
    const finalScore = scores[sub.taskId] ?? sub.total;
    setBusyId(sub.taskId);
    setError("");
    try {
      const res = await fetch("/api/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: sub.taskId,
          candidateName: candidate,
          reviewerName: reviewer,
          accuracy: sub.accuracy,
          completeness: sub.completeness,
          clarity: sub.clarity,
          aiScore: sub.total,
          finalTotal: finalScore,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not issue credential");
      saveSubmission({
        ...sub,
        total: finalScore,
        passed: finalScore >= PASS_MARK,
        reviewerScore: finalScore,
        reviewerName: reviewer,
        token: data.token,
        status: finalScore !== sub.total ? "adjusted" : "approved",
      });
      setSubs(loadSubmissions());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusyId("");
    }
  }

  return (
    <main className="mx-auto max-w-xl p-4 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reviewer dashboard</h1>
        <div className="flex gap-3 text-sm text-emerald-700 underline">
          <Link href="/tasks">Tasks</Link>
          <Link href="/ledger">Ledger</Link>
        </div>
      </div>
      <p className="mt-1 text-gray-600">
        A human checks every AI grade. Only approved work enters the Work Ledger.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <label className="text-sm">
          Candidate name
          <input
            value={candidate}
            onChange={(e) => {
              setCandidate(e.target.value);
              setName("candidate", e.target.value);
            }}
            className="mt-1 w-full rounded-lg border p-2 text-gray-900"
          />
        </label>
        <label className="text-sm">
          Reviewer name
          <input
            value={reviewer}
            onChange={(e) => {
              setReviewer(e.target.value);
              setName("reviewer", e.target.value);
            }}
            className="mt-1 w-full rounded-lg border p-2 text-gray-900"
          />
        </label>
      </div>

      {error && <p className="mt-3 text-red-600">{error}</p>}

      <h2 className="mt-6 text-lg font-semibold">Waiting for review ({pending.length})</h2>
      {pending.length === 0 && (
        <p className="mt-2 text-gray-600">
          Nothing to review. Submit a task first at <Link href="/tasks" className="text-emerald-700 underline">/tasks</Link>.
        </p>
      )}

      <ul className="mt-3 space-y-4">
        {pending.map((s) => {
          const task = getTask(s.taskId);
          const finalScore = scores[s.taskId] ?? s.total;
          const canApprove = finalScore >= PASS_MARK;
          return (
            <li key={s.taskId} className="rounded-xl border bg-white p-4 text-gray-900">
              <p className="font-medium">{task?.title}</p>
              <p className="text-xs text-gray-500">
                Level {task?.level} · {task?.category}
              </p>

              <p className="mt-3 text-xs font-semibold text-gray-500">CANDIDATE ANSWER</p>
              <pre className="whitespace-pre-wrap rounded-lg bg-gray-100 p-2 text-sm" dir="auto">{s.answer}</pre>

              <p className="mt-3 text-sm">
                AI: accuracy {s.accuracy}, completeness {s.completeness}, clarity {s.clarity} → <strong>{s.total}/100</strong>
              </p>
              <p className="mt-1 text-sm text-gray-700" dir="auto">{s.feedback}</p>
              {s.confidence !== "high" && (
                <p className="mt-2 rounded-lg bg-amber-100 p-2 text-sm text-amber-900">
                  Low AI confidence ({s.confidence}). Please check this one carefully.
                </p>
              )}

              <div className="mt-3 flex items-end gap-2">
                <label className="text-sm">
                  Final score
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={finalScore}
                    onChange={(e) => setScores({ ...scores, [s.taskId]: Number(e.target.value) })}
                    className="mt-1 block w-24 rounded-lg border p-2"
                  />
                </label>
                <button
                  onClick={() => approve(s)}
                  disabled={!canApprove || busyId === s.taskId}
                  className="flex-1 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
                >
                  {busyId === s.taskId ? "Signing..." : finalScore !== s.total ? "Adjust & approve" : "Approve"}
                </button>
              </div>
              {!canApprove && (
                <p className="mt-2 text-sm text-gray-600">
                  Below the pass mark ({PASS_MARK}), so it cannot enter the ledger. Raise the score if the AI was too harsh.
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {reviewed.length > 0 && (
        <>
          <h2 className="mt-8 text-lg font-semibold">Reviewed ({reviewed.length})</h2>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {reviewed.map((s) => (
              <li key={s.taskId}>
                {getTask(s.taskId)?.title}: {s.total}/100 ({s.status}) by {s.reviewerName}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
