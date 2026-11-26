import { NextResponse } from "next/server";
import { verify } from "@/lib/ledger";

export async function POST(req: Request) {
  const { token } = await req.json();
  if (typeof token !== "string") return NextResponse.json({ valid: false });
  return NextResponse.json(verify(token));
}
