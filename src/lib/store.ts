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
}

const KEY = "proofpath:submissions";

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
}

export function resetSubmissions() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

// Level 1 is always open. Level N opens after 2 passed tasks in level N-1.
export function isLevelUnlocked(level: number, subs: Record<string, Submission>) {
  if (level === 1) return true;
  const passed = TASKS.filter((t) => t.level === level - 1 && subs[t.id]?.passed).length;
  return passed >= 2;
}
