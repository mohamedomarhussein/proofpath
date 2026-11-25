"use client";

import { useState } from "react";
import type { ExtractResult } from "@/lib/types";

const LANGS = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "sw", label: "Kiswahili", dir: "ltr" },
  { code: "so", label: "Soomaali", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
] as const;

const UI = {
  en: { title: "Tell us about your work", hint: "Describe what you have done and what you can do. Any language is fine.", btn: "Find my skills", loading: "Reading your story...", skills: "Your skills", next: "Suggested first tasks", demo: "Load demo (Hassan)" },
  sw: { title: "Tuambie kuhusu kazi yako", hint: "Eleza ulichofanya na unachoweza kufanya. Lugha yoyote inafaa.", btn: "Tafuta ujuzi wangu", loading: "Tunasoma hadithi yako...", skills: "Ujuzi wako", next: "Kazi za kuanzia", demo: "Pakia demo (Hassan)" },
  so: { title: "Noo sheeg shaqadaada", hint: "Sharax waxa aad samaysay iyo waxa aad awooddo. Luqad kasta way fiicantahay.", btn: "Raadi xirfadahayga", loading: "Waxaan akhrinaa sheekadaada...", skills: "Xirfadahaaga", next: "Hawlaha ugu horreeya", demo: "Rar demo (Hassan)" },
  ar: { title: "أخبرنا عن عملك", hint: "صف ما قمت به وما يمكنك فعله. أي لغة مقبولة.", btn: "اكتشف مهاراتي", loading: "نقرأ قصتك...", skills: "مهاراتك", next: "المهام الأولى المقترحة", demo: "تحميل العرض (حسن)" },
} as const;

const HASSAN =
  "I am Hassan. I taught primary school in Mogadishu for 8 years. I taught in Arabic and English, planned lessons for 40 pupils, and kept attendance and grade registers in Excel. I fled in 2022 and now live in a camp. I lost all my certificates.";

export default function Onboarding() {
  const [lang, setLang] = useState<(typeof LANGS)[number]>(LANGS[0]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ExtractResult | null>(null);
  const t = UI[lang.code];

  async function submit() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/extract-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ background: text, language: lang.label }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data);
      try {
        localStorage.setItem("proofpath:profile", JSON.stringify({ ...data, language: lang.code }));
      } catch {}
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main dir={lang.dir} className="mx-auto max-w-xl p-4 pb-16">
      <div className="mb-4 flex flex-wrap gap-2">
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l)}
            className={`rounded-full border px-4 py-2 text-sm ${l.code === lang.code ? "bg-emerald-600 text-white" : "bg-white text-gray-800"}`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <h1 className="text-2xl font-bold">{t.title}</h1>
      <p className="mt-1 text-gray-600">{t.hint}</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={7}
        className="mt-4 w-full rounded-xl border p-3 text-base text-gray-900"
      />

      <div className="mt-3 flex gap-2">
        <button
          onClick={submit}
          disabled={busy || text.trim().length < 10}
          className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
        >
          {busy ? t.loading : t.btn}
        </button>
        <button onClick={() => setText(HASSAN)} className="rounded-xl border px-4 py-3 text-sm">
          {t.demo}
        </button>
      </div>

      {error && <p className="mt-3 text-red-600">{error}</p>}

      {result && (
        <section className="mt-8 space-y-6">
          {result.mock && (
            <p className="rounded-lg bg-amber-100 p-2 text-sm text-amber-900">
              Mock mode: add your API key to .env.local for real AI results.
            </p>
          )}
          <p className="text-gray-800">{result.summary}</p>

          <div>
            <h2 className="mb-2 text-lg font-semibold">{t.skills}</h2>
            <ul className="space-y-2">
              {result.skills.map((s) => (
                <li key={s.name} className="rounded-xl border bg-white p-3 text-gray-900">
                  <div className="flex justify-between">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-sm text-emerald-700">{s.level}</span>
                  </div>
                  <p className="text-sm text-gray-600">{s.evidence}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">{t.next}</h2>
            <ul className="list-disc space-y-1 ps-5">
              {result.suggestedTasks.map((task) => (
                <li key={task.title}>{task.title}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
