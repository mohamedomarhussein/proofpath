"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getTask } from "@/lib/tasks";
import { resetSubmissions, saveSubmission, setName } from "@/lib/store";

const REVIEWER = "Amina (NGO mentor)";

// Scores the AI "gave". t3 is adjusted upward by the human reviewer.
const DEMO = [
  { taskId: "t1", accuracy: 95, completeness: 100, clarity: 90, final: null as number | null },
  { taskId: "t2", accuracy: 90, completeness: 100, clarity: 85, final: null as number | null },
  { taskId: "t3", accuracy: 80, completeness: 80, clarity: 75, final: 85 as number | null },
];

export default function DemoButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setBusy(true);
    setError("");
    try {
      resetSubmissions();
      setName("candidate", "Hassan");
      setName("reviewer", REVIEWER);

      for (const d of DEMO) {
        const task = getTask(d.taskId);
        if (!task) continue;
        const aiTotal = Math.round(d.accuracy * 0.5 + d.completeness * 0.3 + d.clarity * 0.2);
        const finalTotal = d.final ?? aiTotal;

        const res = await fetch("/api/issue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taskId: d.taskId,
            candidateName: "Hassan",
            reviewerName: REVIEWER,
            accuracy: d.accuracy,
            completeness: d.completeness,
            clarity: d.clarity,
            aiScore: aiTotal,
            finalTotal,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not issue credential");

        saveSubmission({
          taskId: d.taskId,
          answer: task.referenceAnswer,
          accuracy: d.accuracy,
          completeness: d.completeness,
          clarity: d.clarity,
          total: finalTotal,
          feedback:
            finalTotal !== aiTotal
              ? "Reviewer raised the score: the wording differs from the reference but the meaning is correct."
              : "Great work. Your answer covers all the key points clearly.",
          confidence: "high",
          passed: true,
          status: finalTotal !== aiTotal ? "adjusted" : "approved",
          createdAt: new Date().toISOString(),
          reviewerScore: finalTotal,
          reviewerName: REVIEWER,
          token: data.token,
        });
      }

      // Wallet: ID done, everything else left for the live demo
      localStorage.setItem(
        "proofpath:wallet",
        JSON.stringify({ country: "kenya", workType: "local", status: { identity: "done" }, paidOut: 0 })
      );
      localStorage.setItem("proofpath:profile", JSON.stringify({ language: "en" }));

      router.push("/ledger");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        onClick={load}
        disabled={busy}
        className="w-full rounded-xl border-2 border-emerald-600 px-4 py-3 font-semibold text-emerald-700 disabled:opacity-50"
      >
        {busy ? "Loading Hassan's journey..." : "Demo Mode: load Hassan's journey"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
