const LIVE = [
  { icon: "💻", name: "Technology", example: "IT support troubleshooting and fixing a code bug" },
  { icon: "📐", name: "Engineering", example: "Material estimates and basic electrical calculations" },
  { icon: "🩺", name: "Health administration", example: "Intake summaries and appointment scheduling" },
  { icon: "🎓", name: "Education", example: "Explaining concepts and writing lesson plans" },
  { icon: "📒", name: "Bookkeeping", example: "Cash balance, ledger and bank reconciliation" },
  { icon: "🗂️", name: "Data entry", example: "Clean records, extract invoice data" },
  { icon: "🌐", name: "Translation", example: "Arabic, Swahili and English notices and messages" },
  { icon: "🎧", name: "Customer support", example: "Polite replies, refunds, order problems" },
  { icon: "✍️", name: "Writing", example: "Proofreading and product descriptions" },
];

const NEXT = [
  { icon: "🧵", name: "Trades and crafts" },
  { icon: "🚚", name: "Logistics and sales" },
  { icon: "🌾", name: "Agriculture" },
  { icon: "🎨", name: "Design and media" },
  { icon: "⚖️", name: "Legal aid support" },
];

export default function SkillAreas() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">Skill areas</p>
      <h2 className="mt-2 text-3xl font-bold md:text-4xl">Not just teaching: work for every field</h2>
      <p className="mt-2 max-w-2xl text-gray-600">
        Hassan is a teacher in our demo, but the same flow works for any skill that can be shown through a real task.
        Nine areas are live today, from technology and engineering to health administration. Each has its own tasks,
        sample roles and free courses.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LIVE.map((s) => (
          <div key={s.name} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-start justify-between">
              <span className="text-3xl">{s.icon}</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">Live</span>
            </div>
            <h3 className="mt-2 font-semibold">{s.name}</h3>
            <p className="mt-1 text-sm text-gray-600">{s.example}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm font-semibold text-gray-700">Coming next</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {NEXT.map((s) => (
          <span key={s.name} className="rounded-full border border-dashed border-gray-300 bg-white/70 px-4 py-2 text-sm text-gray-600">
            {s.icon} {s.name}
          </span>
        ))}
      </div>

      <p className="mt-6 text-xs text-gray-500">
        Health tasks are administrative only and give no medical advice. Engineering tasks are basic practical
        calculations and do not replace professional licensing.
      </p>
    </section>
  );
}
