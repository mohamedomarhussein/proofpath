const VALUES = [
  { icon: "🤝", title: "Dignity first", text: "Everyone starts with respect, whatever documents they have or lost." },
  { icon: "🔍", title: "Proof over paperwork", text: "What you can do, shown through real work, is the credential." },
  { icon: "🧑‍⚖️", title: "Humans in the loop", text: "AI helps, but a person reviews every score before it is signed." },
  { icon: "🪪", title: "Honest by design", text: "We state our limits: guidance is not legal advice, and demo payments are simulated." },
  { icon: "📱", title: "Built for real access", text: "Mobile-first, lightweight, and available in English, Kiswahili, Soomaali and Arabic." },
];

const AUDIENCE = [
  { icon: "🎓", who: "Displaced people and refugees", text: "Trained professionals whose certificates were lost, left behind, or never recognized." },
  { icon: "🧰", who: "Informal workers", text: "People with years of real experience but no formal record to show for it." },
  { icon: "🏢", who: "Employers", text: "Teams that want to check a candidate's work in seconds, without chasing embassy letters." },
  { icon: "🌍", who: "NGOs and training partners", text: "Organizations that mentor, co-sign credentials, and connect people to opportunity." },
];

const ROADMAP = [
  { tag: "Now", title: "Working prototype", items: ["Real micro-tasks with AI + human grading", "Signed ledger with QR verify", "Readiness checklist and simulated payout", "Job matching and skill-gap guidance"] },
  { tag: "Next", title: "Pilot with partners", items: ["Reviewer login for NGO mentors", "Real mobile-money payouts (M-Pesa Daraja)", "Employer accounts and candidate consent", "Review of guidance by legal aid partners"] },
  { tag: "Later", title: "Scale across borders", items: ["More countries and work types", "More skill areas and paid client tasks", "Offline-friendly task drafts", "Open, portable credential standard"] },
];

export default function AboutSections() {
  return (
    <>
      {/* PROBLEM */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">The problem</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">Talent without proof</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["📄", "Papers are lost or not recognized", "Certificates stay behind, or foreign ones are not accepted, so skilled people are treated as unskilled."],
            ["🚪", "Every door asks for a document", "Work authorization, ID, banking and mobile money each add a barrier before the first paycheck."],
            ["🔁", "No experience, no job. No job, no experience.", "Without a verifiable history, people cannot break into formal or remote work."],
          ].map(([i, t, d]) => (
            <div key={t} className="rounded-2xl border bg-white p-5 shadow-sm">
              <span className="text-3xl">{i}</span>
              <h3 className="mt-3 font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-gray-600">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VISION + MISSION */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 text-white">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-16 md:grid-cols-2">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-200">Our vision</p>
            <p className="mt-3 text-2xl font-bold leading-snug">
              A world where people are recognized for what they can do, not for the papers they were able to carry.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-200">Our mission</p>
            <p className="mt-3 text-lg leading-relaxed text-emerald-50">
              To help people with missing, foreign or unrecognized paperwork prove their skills through real work, get
              ready to be paid, and reach employers who can trust the proof.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">What we stand for</p>
        <h2 className="mt-2 text-3xl font-bold">Our values</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <span className="text-3xl">{v.icon}</span>
              <h3 className="mt-3 font-semibold">{v.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="bg-emerald-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">Who it is for</p>
          <h2 className="mt-2 text-3xl font-bold">Built for both sides of the table</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {AUDIENCE.map((a) => (
              <div key={a.who} className="flex gap-4 rounded-2xl border border-emerald-100 bg-white p-5">
                <span className="text-3xl">{a.icon}</span>
                <div>
                  <h3 className="font-semibold">{a.who}</h3>
                  <p className="mt-1 text-sm text-gray-600">{a.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">Where we are going</p>
        <h2 className="mt-2 text-3xl font-bold">Roadmap</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {ROADMAP.map((r, i) => (
            <div key={r.tag} className={`rounded-2xl border p-5 ${i === 0 ? "border-emerald-400 bg-white shadow-md" : "bg-white/70"}`}>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${i === 0 ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                {r.tag}
              </span>
              <h3 className="mt-3 font-semibold">{r.title}</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                {r.items.map((x) => (
                  <li key={x}>{i === 0 ? "✓" : "○"} {x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
