export type Level = "beginner" | "intermediate" | "advanced";

export interface ExtractResult {
  summary: string;
  skills: { name: string; level: Level; evidence: string }[];
  suggestedTasks: {
    title: string;
    category: "translation" | "data-entry" | "bookkeeping";
  }[];
  mock?: boolean;
}
