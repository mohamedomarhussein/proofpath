import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { verify } from "@/lib/ledger";
import { getTask, PASS_MARK } from "@/lib/tasks";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const clamp = (n: unknown) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));

function toClient(r: any) {
  return {
    taskId: r.task_id,
    answer: r.answer,
    accuracy: r.accuracy,
    completeness: r.completeness,
    clarity: r.clarity,
    total: r.total,
    feedback: r.feedback || "",
    confidence: r.confidence || "low",
    passed: r.passed,
    mock: r.mock,
    status: r.status,
    createdAt: r.updated_at,
    reviewerScore: r.token ? r.total : undefined,
    reviewerName: r.reviewer_name || undefined,
    token: r.token || undefined,
  };
}

export async function POST(req: Request) {
  const supabase = db();
  if (!supabase) return NextResponse.json({ enabled: false });

  const body = await req.json().catch(() => ({}));
  let candidateId: string | null =
    typeof body.candidateId === "string" && UUID.test(body.candidateId) ? body.candidateId : null;
  const name = String(body.name || "Candidate").trim().slice(0, 60) || "Candidate";
  const push: any[] = Array.isArray(body.push) ? body.push.slice(0, 5) : [];

  try {
    if (candidateId) {
      const { data } = await supabase.from("candidates").select("id").eq("id", candidateId).maybeSingle();
      if (!data) candidateId = null;
    }

    if (!candidateId && push.length === 0) {
      return NextResponse.json({ enabled: true, candidateId: null, submissions: [] });
    }

    if (!candidateId) {
      const { data, error } = await supabase.from("candidates").insert({ name }).select("id").single();
      if (error) throw error;
      candidateId = data.id;
    } else if (push.length) {
      await supabase.from("candidates").update({ name }).eq("id", candidateId);
    }

    const rows = push
      .filter((s) => getTask(s?.taskId) && typeof s.answer === "string")
      .map((s) => {
        const v = typeof s.token === "string" ? verify(s.token) : { valid: false };
        const approved = v.valid && (s.status === "approved" || s.status === "adjusted");
        const total = clamp(s.total);
        return {
          candidate_id: candidateId,
          task_id: s.taskId,
          answer: s.answer.slice(0, 3000),
          accuracy: clamp(s.accuracy),
          completeness: clamp(s.completeness),
          clarity: clamp(s.clarity),
          total,
          feedback: String(s.feedback || "").slice(0, 1000),
          confidence: ["high", "medium", "low"].includes(s.confidence) ? s.confidence : "low",
          passed: total >= PASS_MARK,
          mock: !!s.mock,
          status: approved ? s.status : "pending_review",
          reviewer_name: approved ? String(s.reviewerName || "").slice(0, 60) : null,
          token: approved ? s.token : null,
          updated_at: new Date().toISOString(),
        };
      });

    if (rows.length) {
      const { error } = await supabase.from("submissions").upsert(rows, { onConflict: "candidate_id,task_id" });
      if (error) throw error;
    }

    const { data: all, error } = await supabase.from("submissions").select("*").eq("candidate_id", candidateId);
    if (error) throw error;
    return NextResponse.json({ enabled: true, candidateId, submissions: (all || []).map(toClient) });
  } catch (e) {
    console.error("db sync failed:", e);
    return NextResponse.json({ enabled: false });
  }
}
