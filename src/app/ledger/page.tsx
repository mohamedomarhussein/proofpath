"use client";

import Link from "next/link";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { getTask } from "@/lib/tasks";
import { getName, loadSubmissions, type Submission } from "@/lib/store";

export default function Ledger() {
  const [entries, setEntries] = useState<Submission[]>([]);
  const [qrs, setQrs] = useState<Record<string, string>>({});
  const [origin, setOrigin] = useState("");
  const [name, setNameState] = useState("Hassan");

  useEffect(() => {
    const o = window.location.origin;
    setOrigin(o);
    setNameState(getName("candidate", "Hassan"));
    const list = Object.values(loadSubmissions()).filter((s) => s.token);
    setEntries(list);
    list.forEach(async (s) => {
      const img = await QRCode.toDataURL(`${o}/verify/${s.token}`, { width: 220, margin: 1 });
      setQrs((prev) => ({ ...prev, [s.taskId]: img }));
    });
  }, []);

  const earned = entries.reduce((sum, s) => sum + (getTask(s.taskId)?.payKES || 0), 0);

  return (
    <main className="mx-auto max-w-xl p-4 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Work Ledger</h1>
        <div className="flex gap-3 text-sm text-emerald-700 underline">
          <Link href="/tasks">Tasks</Link>
          <Link href="/review">Review</Link>
        </div>
      </div>
      <p className="mt-1 text-gray-600">
        {name}&apos;s verified work history. Employers can scan any entry to check it.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-emerald-50 p-3">
          <div className="text-2xl font-bold text-emerald-800">{entries.length}</div>
          <div className="text-xs text-emerald-900">verified tasks</div>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3">
          <div className="text-2xl font-bold text-emerald-800">KES {earned}</div>
          <div className="text-xs text-emerald-900">earned</div>
        </div>
      </div>

      {entries.length === 0 && (
        <p className="mt-6 text-gray-600">
          No verified entries yet. Complete a task, then approve it at{" "}
          <Link href="/review" className="text-emerald-700 underline">/review</Link>.
        </p>
      )}

      <ul className="mt-6 space-y-4">
        {entries.map((s) => {
          const task = getTask(s.taskId);
          const url = `${origin}/verify/${s.token}`;
          return (
            <li key={s.taskId} className="rounded-xl border bg-white p-4 text-gray-900">
              <div className="flex justify-between gap-2">
                <p className="font-medium">{task?.title}</p>
                <span className="whitespace-nowrap text-emerald-700">{s.total}/100</span>
              </div>
              <p className="text-xs text-gray-500">
                {task?.clientName} · Level {task?.level} · reviewed by {s.reviewerName}
                {s.status === "adjusted" ? " (score adjusted)" : ""}
              </p>
              <div className="mt-3 flex items-center gap-4">
                {qrs[s.taskId] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrs[s.taskId]} alt="QR code to verify this entry" className="h-28 w-28" />
                )}
                <div className="text-sm">
                  <Link href={`/verify/${s.token}`} target="_blank" className="font-medium text-emerald-700 underline">
                    Open verify page
                  </Link>
                  <button
                    onClick={() => navigator.clipboard?.writeText(url)}
                    className="mt-2 block text-gray-600 underline"
                  >
                    Copy verify link
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
