import { NextResponse } from "next/server";
import { askJSON, isMockMode } from "@/lib/claude";
import { TASKS } from "@/lib/tasks";
import type { ExtractResult } from "@/lib/types";

type Cat = ExtractResult["suggestedTasks"][number]["category"];

// Offline fallback: reads the person's text instead of returning fixed output.
const RULES: { cat: Cat; skill: string; words: string[] }[] = [
  { cat: "technology", skill: "Software and IT", words: ["softwar", "develo", "program", "coding", "code", "web", "react", "python", "javascript", "computer", "it support", "app "] },
  { cat: "engineering", skill: "Engineering and technical work", words: ["engineer", "construction", "electric", "mechanic", "civil", "survey", "plumb"] },
  { cat: "health-admin", skill: "Health administration", words: ["nurse", "clinic", "hospital", "patient", "health", "medical", "pharmac"] },
  { cat: "education", skill: "Teaching and lesson planning", words: ["teach", "tutor", "school", "lesson", "lectur", "pupil"] },
  { cat: "bookkeeping", skill: "Bookkeeping and accounting", words: ["account", "bookkeep", "ledger", "audit", "financ", "payroll"] },
  { cat: "data-entry", skill: "Data entry and spreadsheets", words: ["data entry", "excel", "spreadsheet", "typing", "records", "register"] },
  { cat: "translation", skill: "Translation and languages", words: ["translat", "interpret", "arabic", "swahili", "somali", "french", "bilingual"] },
  { cat: "customer-support", skill: "Customer support", words: ["customer", "call cent", "sales", "shop", "client service"] },
  { cat: "writing", skill: "Writing and content", words: ["writ", "journalis", "editor", "blog", "content", "copy"] },
];

function mockExtract(text: string): ExtractResult {
  const lower = text.toLowerCase();
  const sentences = text.split(/[.!?\n]+/).map((s) => s.trim()).filter(Boolean);
  const years = Math.max(0, ...[...lower.matchAll(/(\d+)\s*\+?\s*years?/g)].map((m) => Number(m[1])));
  const level = years >= 5 ? "advanced" : years >= 2 ? "intermediate" : /many|senior|experienc|expert/.test(lower) ? "intermediate" : "beginner";

  const found = RULES.map((r) => {
    const hit = r.words.find((w) => lower.includes(w));
    if (!hit) return null;
    const evidence = (sentences.find((s) => s.toLowerCase().includes(hit)) || text).slice(0, 120);
    return { rule: r, evidence };
  }).filter(Boolean) as { rule: (typeof RULES)[number]; evidence: string }[];

  const top = found.slice(0, 4);
  if (top.length === 0) {
    return {
      summary: "We could not match specific skills yet. Add more detail about what you have done, then try again.",
      skills: [],
      suggestedTasks: TASKS.filter((t) => t.level === 1).slice(0, 2).map((t) => ({ title: t.title, category: t.category as Cat })),
      mock: true,
    };
  }

  const suggestedTasks = top
    .map((f) => TASKS.find((t) => t.category === f.rule.cat && t.level === 1))
    .filter(Boolean)
    .slice(0, 3)
    .map((t) => ({ title: t!.title, category: t!.category as Cat }));

  return {
    summary: `Based on what you wrote, your strongest areas are: ${top.map((f) => f.rule.skill).join(", ")}.`,
    skills: top.map((f) => ({ name: f.rule.skill, level: level as "beginner" | "intermediate" | "advanced", evidence: f.evidence })),
    suggestedTasks,
    mock: true,
  };
}

const SYSTEM = `You extract work skills from a person's background story for a platform that helps people with missing or foreign paperwork.
Rules:
- Only list skills supported by what the person actually wrote. Never invent certificates, employers or degrees.
- "evidence" must point to something they said.
- suggestedTasks: pick 2 to 3 low-risk starter tasks. category must be one of: translation, data-entry, bookkeeping, customer-support, writing, technology, engineering, health-admin, education.
- level must be one of: beginner, intermediate, advanced.
- Write "summary" and "evidence" in the requested language.
- Reply with ONLY valid JSON, no markdown, matching:
{"summary": string, "skills": [{"name": string, "level": string, "evidence": string}], "suggestedTasks": [{"title": string, "category": string}]}`;

export async function POST(req: Request) {
  const { background, language } = await req.json();

  if (typeof background !== "string" || background.trim().length < 10) {
    return NextResponse.json({ error: "Please tell us a bit more about your background." }, { status: 400 });
  }

  if (isMockMode()) return NextResponse.json(mockExtract(background));

  try {
    const result = await askJSON<ExtractResult>(
      SYSTEM,
      `Language for the reply: ${language}\n\nBackground:\n${background.slice(0, 4000)}`
    );
    return NextResponse.json(result);
  } catch (e) {
    console.error("extract-skills failed, using offline fallback:", e);
    return NextResponse.json(mockExtract(background));
  }
}
