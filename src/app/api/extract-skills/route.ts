import { NextResponse } from "next/server";
import { askJSON, isMockMode } from "@/lib/claude";
import type { ExtractResult } from "@/lib/types";

const MOCK: ExtractResult = {
  summary:
    "Experienced primary-school teacher with strong Arabic and English, solid classroom organisation, and basic computer skills.",
  skills: [
    { name: "Arabic–English translation", level: "intermediate", evidence: "Taught bilingual classes for 8 years" },
    { name: "Lesson planning", level: "advanced", evidence: "Planned weekly curricula for 40 pupils" },
    { name: "Record keeping", level: "intermediate", evidence: "Kept attendance and grade registers" },
    { name: "Basic spreadsheets", level: "beginner", evidence: "Used Excel for grade sheets" },
  ],
  suggestedTasks: [
    { title: "Translate a short paragraph (Arabic to English)", category: "translation" },
    { title: "Clean a small student-records spreadsheet", category: "data-entry" },
  ],
  mock: true,
};

const SYSTEM = `You extract work skills from a person's background story for a platform that helps people with missing or foreign paperwork.
Rules:
- Only list skills supported by what the person actually wrote. Never invent certificates, employers or degrees.
- "evidence" must point to something they said.
- suggestedTasks: pick 2 to 3 low-risk starter tasks. category must be one of: translation, data-entry, bookkeeping.
- level must be one of: beginner, intermediate, advanced.
- Write "summary" and "evidence" in the requested language.
- Reply with ONLY valid JSON, no markdown, matching:
{"summary": string, "skills": [{"name": string, "level": string, "evidence": string}], "suggestedTasks": [{"title": string, "category": string}]}`;

export async function POST(req: Request) {
  const { background, language } = await req.json();

  if (typeof background !== "string" || background.trim().length < 10) {
    return NextResponse.json({ error: "Please tell us a bit more about your background." }, { status: 400 });
  }

  if (isMockMode()) return NextResponse.json(MOCK);

  try {
    const result = await askJSON<ExtractResult>(
      SYSTEM,
      `Language for the reply: ${language}\n\nBackground:\n${background.slice(0, 4000)}`
    );
    return NextResponse.json(result);
  } catch (e) {
    console.error("extract-skills failed, using mock:", e);
    return NextResponse.json(MOCK);
  }
}
