"use client";

import { use, useEffect, useState } from "react";

interface Cred {
  issuer: string;
  issuanceDate: string;
  credentialSubject: {
    name: string;
    task: string;
    category: string;
    level: number;
    client: string;
    scores: { accuracy: number; completeness: number; clarity: number; final: number };
    reviewedBy: string;
    humanAdjusted: boolean;
  };
}

export default function Verify({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [state, setState] = useState<"loading" | "valid" | "invalid" | "error">("loading");
  const [cred, setCred] = useState<Cred | null>(null);

  useEffect(() => {
    fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.valid && d.credential?.credentialSubject) {
          setCred(d.credential);
          setState("valid");
        } else {
          setState("invalid");
        }
      })
      .catch(() => setState("error"));
  }, [token]);

  if (state === "loading") return <main className="p-6 text-center text-gray-600">Checking...</main>;
  if (state === "error") return <main className="p-6 text-center text-gray-600">Could not reach the server. Try again.</main>;

  if (state === "invalid" || !cred) {
    return (
      <main className="mx-auto max-w-xl p-6 text-center">
        <div className="rounded-2xl bg-red-600 p-8 text-white">
          <div className="text-5xl font-extrabold">INVALID</div>
          <p className="mt-2">This record was changed or was not issued by ProofPath. Do not trust it.</p>
        </div>
      </main>
    );
  }

  const c = cred.credentialSubject;
  return (
    <main className="mx-auto max-w-xl p-6">
      <div className="rounded-2xl bg-emerald-600 p-8 text-center text-white">
        <div className="text-5xl font-extrabold">VALID ✓</div>
        <p className="mt-2">Signed by {cred.issuer} and not altered.</p>
      </div>

      <div className="mt-4 space-y-2 rounded-xl border bg-white p-4 text-gray-900">
        <p className="text-sm text-gray-500">Candidate</p>
        <p className="text-xl font-semibold">{c.name}</p>
        <p className="text-sm text-gray-500">Completed task</p>
        <p className="font-medium">{c.task}</p>
        <p className="text-sm text-gray-600">
          {c.client} · Level {c.level} · {c.category}
        </p>
        <p className="pt-2 text-sm">
          Accuracy {c.scores.accuracy} · Completeness {c.scores.completeness} · Clarity {c.scores.clarity}
        </p>
        <p className="text-lg font-semibold text-emerald-700">Final score: {c.scores.final}/100</p>
        <p className="text-sm text-gray-600">
          Reviewed by {c.reviewedBy}
          {c.humanAdjusted ? " (human adjusted the AI score)" : " (human confirmed the AI score)"}
        </p>
        <p className="text-xs text-gray-500">Issued {new Date(cred.issuanceDate).toLocaleDateString()}</p>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        This confirms the record is authentic and unchanged. It does not confirm the person&apos;s identity or replace a legal credential.
      </p>
    </main>
  );
}
