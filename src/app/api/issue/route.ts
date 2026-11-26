import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getTask, PASS_MARK } from "@/lib/tasks";
import { sign } from "@/lib/ledger";

const clamp = (n: unknown) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));

export async function POST(req: Request) {
  const b = await req.json();
  const task = getTask(b.taskId);
  if (!task) return NextResponse.json({ error: "Unknown task." }, { status: 404 });

  const finalScore = clamp(b.finalTotal);
  if (finalScore < PASS_MARK) {
    return NextResponse.json({ error: `Score is below the pass mark (${PASS_MARK}).` }, { status: 400 });
  }

  const name = String(b.candidateName || "").trim().slice(0, 60) || "Candidate";
  const reviewer = String(b.reviewerName || "").trim().slice(0, 60) || "Reviewer";
  const aiScore = clamp(b.aiScore);

  // Task details come from the server's own list, never from the browser.
  const credential = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    id: `urn:uuid:${randomUUID()}`,
    type: ["VerifiableCredential", "ProofPathWorkCredential"],
    issuer: "ProofPath (hackathon demo)",
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      name,
      task: task.title,
      category: task.category,
      level: task.level,
      client: task.clientName,
      scores: {
        accuracy: clamp(b.accuracy),
        completeness: clamp(b.completeness),
        clarity: clamp(b.clarity),
        final: finalScore,
      },
      aiScore,
      reviewedBy: reviewer,
      humanAdjusted: finalScore !== aiScore,
    },
  };

  return NextResponse.json({ token: sign(credential) });
}
