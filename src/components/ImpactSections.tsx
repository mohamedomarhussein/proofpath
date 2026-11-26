import Link from "next/link";

const FLOW = [
  { href: "/onboarding", icon: "🗣️", title: "Tell your story", text: "Describe your background in English, Kiswahili, Soomaali or Arabic. AI finds the skills you can back up, and never invents certificates." },
  { href: "/tasks", icon: "🛠️", title: "Do real tasks", text: "Climb the Trust Ladder from Starter to Pro. Each task is a small piece of real work with a clear rubric." },
  { href: "/review", icon: "🧑‍🏫", title: "A human checks it", text: "A mentor approves or adjusts the AI score. Only reviewed work can enter your record." },
  { href: "/ledger", icon: "🔏", title: "Get signed proof", text: "Every approved task becomes a tamper-proof entry with a QR code. Employers verify it in seconds." },
  { href: "/wallet", icon: "👛", title: "Get ready to be paid", text: "A country checklist covers ID, right to work, mobile money and contracts, then unlocks your first payout." },
  { href: "/hire", icon: "💼", title: "Get matched", text: "A portfolio, job matches and the single skill gap to close next, with a free way to close it." },
];

const BEFORE_AFTER = [
  ["Certificates lost or not recognized", "Skills proven through real, reviewed work"],
  ["Employers cannot check your background", "One QR scan shows VALID or INVALID"],
  ["No idea what blocks you from getting paid", "A clear checklist with a next action for each step"],
  ["Unsure which jobs fit you", "Matches with a percentage and the exact gap"],
  ["Needs experience to get a job, a job to get experience", "Experience is earned first, then trusted"],
];

const HELPS = [
  { icon: "🙋", who: "Candidates", points: ["Start today with no paperwork", "Build a record that travels with you", "Know your next step, always", "Learn the readiness steps by doing them"] },
  { icon: "🏢", who: "Employers", points: ["See verified work, not just claims", "Check any entry in seconds", "Rank candidates by ledger strength", "Hire with less risk and less admin"] },
  { icon: "🌍", who: "NGOs and partners", points: ["Co-sign credentials as mentors", "Direct people to the right legal aid", "Track progress from task to income", "Sponsor onboarding and training"] },
];

const RIPPLE = [
  { icon: "💵", title: "Income", text: "A first payment turns skills into earnings, which supports a household." },
  { icon: "📚", title: "Learning", text: "Gap analysis points people to free courses, so upskilling follows demand." },
  { icon: "⚖️", title: "Fairness", text: "Opportunity depends on proven ability instead of which papers survived the journey." },
  { icon: "🔐", title: "Trust", text: "Signed records give employers and institutions a reliable way to say yes." },
  { icon: "🤝", title: "Partnerships", text: "Employers, NGOs, legal aid and mobile-money providers work from one shared record." },
];

const SDG = [
  ["SDG 8", "Decent work", "Paid micro-work that leads to formal and remote jobs"],
  ["SDG 4", "Quality education", "Learning by doing, plus free courses for the top gap"],
  ["SDG 10", "Reduced inequalities", "Skills count even when documents are missing"],
  ["SDG 16", "Strong institutions", "Verifiable, tamper-evident records anyone can check"],
  ["SDG 17", "Partnerships", "Employers, NGOs and training providers in one flow"],
];

export default function ImpactSections() {
  return (
    <>
      {/* SEE IT IN ACTION */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">How it works</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">See it in action</h2>
        <p className="mt-2 max-w-xl text-gray-600">Six screens, one journey. Tap any card to open it.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FLOW.map((f, i) => (
            <Link key={f.href} href={f.href} className="group relative rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-400 hover:shadow-md">
              <span className="absolute right-4 top-3 text-4xl font-black text-emerald-600/10">{i + 1}</span>
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{f.text}</p>
              <span className="mt-3 inline-block text-sm font-medium text-emerald-700 transition group-hover:translate-x-1">Open →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="bg-emerald-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">The problem we solve</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">From blocked to ready</h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
            <div className="grid grid-cols-2 bg-gray-50 text-xs font-bold uppercase tracking-wider">
              <div className="p-4 text-red-700">Without ProofPath</div>
              <div className="p-4 text-emerald-700">With ProofPath</div>
            </div>
            {BEFORE_AFTER.map(([b, a]) => (
              <div key={b} className="grid grid-cols-2 border-t text-sm">
                <div className="p-4 text-gray-600"><span className="mr-2 text-red-500">✕</span>{b}</div>
                <div className="bg-emerald-50/50 p-4 font-medium text-gray-900"><span className="mr-2 text-emerald-600">✓</span>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT HELPS */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">How it helps</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">Value for everyone involved</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {HELPS.map((h) => (
            <div key={h.who} className="rounded-2xl border bg-white p-6 shadow-sm">
              <span className="text-3xl">{h.icon}</span>
              <h3 className="mt-3 text-lg font-semibold">{h.who}</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                {h.points.map((p) => (
                  <li key={p} className="flex gap-2"><span className="text-emerald-600">✓</span>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* COMMUNITY IMPACT */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 text-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-200">Community impact</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">When one person is trusted, a community moves</h2>
          <p className="mt-2 max-w-2xl text-emerald-50/90">
            Each verified task is small. Together they create income, learning and trust that spread beyond one person.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {RIPPLE.map((r) => (
              <div key={r.title} className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <span className="text-2xl">{r.icon}</span>
                <h3 className="mt-2 font-semibold">{r.title}</h3>
                <p className="mt-1 text-xs text-emerald-50/90">{r.text}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-12 text-lg font-semibold">Aligned with the Sustainable Development Goals</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {SDG.map(([n, t, d]) => (
              <div key={n} className="rounded-xl bg-white p-4 text-gray-900">
                <p className="text-xs font-bold text-emerald-600">{n}</p>
                <p className="font-semibold">{t}</p>
                <p className="mt-1 text-xs text-gray-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
