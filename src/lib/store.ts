import { TASKS } from "./tasks";

export interface Submission {
  taskId: string;
  answer: string;
  accuracy: number;
  completeness: number;
  clarity: number;
  total: number;
  feedback: string;
  confidence: "high" | "medium" | "low";
  passed: boolean;
  mock?: boolean;
  status: "pending_review" | "approved" | "adjusted";
  createdAt: string;
  reviewerScore?: number;
  reviewerName?: string;
  token?: string;
}

const KEY = "proofpath:submissions";
const CID = "proofpath:candidateId";

export function loadSubmissions(): Record<string, Submission> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveSubmission(s: Submission) {
  try {
    const all = loadSubmissions();
    all[s.taskId] = s;
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {}
  void syncWithServer(s);
}

export function resetSubmissions() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(CID);
  } catch {}
}

export function getName(key: "candidate" | "reviewer", fallback: string) {
  try {
    return localStorage.getItem(`proofpath:${key}`) || fallback;
  } catch {
    return fallback;
  }
}

export function setName(key: "candidate" | "reviewer", value: string) {
  try {
    localStorage.setItem(`proofpath:${key}`, value);
  } catch {}
}

export function isLevelUnlocked(level: number, subs: Record<string, Submission>) {
  if (level === 1) return true;
  const passed = TASKS.filter((t) => t.level === level - 1 && subs[t.id]?.passed).length;
  return passed >= 2;
}

// One request at a time, so it never creates duplicate candidates.
let queue: Promise<unknown> = Promise.resolve();

export function syncWithServer(push?: Submission): Promise<boolean> {
  const run = queue.then(
    () => doSync(push),
    () => doSync(push)
  );
  queue = run.catch(() => {});
  return run;
}

async function doSync(push?: Submission): Promise<boolean> {
  try {
    const res = await fetch("/api/db/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidateId: localStorage.getItem(CID),
        name: getName("candidate", "Candidate"),
        push: push ? [push] : [],
      }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (!data.enabled) return false;
    if (data.candidateId) localStorage.setItem(CID, data.candidateId);

    const local = loadSubmissions();
    let changed = false;
    for (const s of (data.submissions || []) as Submission[]) {
      const cur = local[s.taskId];
      const serverNewer = cur && new Date(s.createdAt).getTime() >= new Date(cur.createdAt).getTime();
      if (!cur || (s.token && s.token !== cur.token && serverNewer)) {
        local[s.taskId] = s;
        changed = true;
      }
    }
    if (changed) localStorage.setItem(KEY, JSON.stringify(local));
    return changed;
  } catch {
    return false;
  }
}
