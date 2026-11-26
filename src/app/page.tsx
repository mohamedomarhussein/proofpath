import Link from "next/link";
import DemoButton from "@/components/DemoButton";
import AboutSections from "@/components/AboutSections";
import ImpactSections from "@/components/ImpactSections";

const STEPS = [
  { icon: "🛠️", title: "Do real work", text: "Short, real micro-tasks in translation, data entry and bookkeeping. No certificates needed to start." },
  { icon: "🧑‍🏫", title: "AI + human review", text: "AI grades against a clear rubric. A human mentor approves or adjusts every score." },
  { icon: "🔏", title: "Signed proof", text: "Each approved task becomes a tamper-proof ledger entry anyone can verify with a QR scan." },
  { icon: "💼", title: "Get paid and hired", text: "Work-readiness checklist, mobile-money payout, and job matches with a clear skill gap." },
];

const CRITERIA = [
  { n: "01", title: "Credential and skills verification", text: "Signed Work Ledger with a public VALID / INVALID check.", href: "/ledger" },
  { n: "02", title: "Access and compliance readiness", text: "Country checklist for ID, right to work, mobile money and contracts.", href: "/wallet" },
  { n: "03", title: "Practical and market fit", text: "Portfolio, role matching and a free path to close the top skill gap.", href: "/hire" },
  { n: "04", title: "Social and SDG impact", text: "Employers rank candidates by verified work, not paperwork.", href: "/employer" },
];

const SDGS = ["SDG 4 Quality education", "SDG 8 Decent work", "SDG 10 Reduced inequalities", "SDG 16 Strong institutions", "SDG 17 Partnerships"];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-600 text-white">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="pp-fade-up inline-block rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs tracking-wide">
              Work passport for people without papers
            </p>
            <h1 className="pp-fade-up pp-delay-1 mt-4 text-5xl font-extrabold leading-tight md:text-6xl">
              Your work is
              <span className="block bg-gradient-to-r from-emerald-200 to-yellow-200 bg-clip-text text-transparent">
                your proof.
              </span>
            </h1>
            <p className="pp-fade-up pp-delay-2 mt-4 max-w-md text-lg text-emerald-50/90">
              No paperwork? No problem. Start working today, and let your verified work history speak for you.
            </p>

            <div className="pp-fade-up pp-delay-3 mt-8 flex max-w-sm flex-col gap-3">
              <Link
                href="/onboarding"
                className="rounded-xl bg-white px-5 py-3 text-center font-semibold text-emerald-800 shadow-lg transition hover:scale-[1.02]"
              >
                Start building my proof →
              </Link>
              <div className="rounded-xl [&_button]:border-white/60 [&_button]:bg-white/10 [&_button]:text-white [&_button]:backdrop-blur">
                <DemoButton />
              </div>
              <p className="text-xs text-emerald-100/80">
                Demo Mode loads a sample journey for Hassan, a displaced teacher, in seconds.
              </p>
            </div>
          </div>

          {/* Floating credential card */}
          <div className="pp-float mx-auto w-full max-w-sm">
            <div className="rounded-2xl bg-white p-5 text-gray-900 shadow-2xl ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Work credential</span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">VALID ✓</span>
              </div>
              <p className="mt-3 text-2xl font-bold">Hassan</p>
              <p className="text-sm text-gray-500">Arabic–English translation · Level 2</p>
              <div className="mt-4 space-y-2 text-xs">
                {[["Accuracy", 80], ["Completeness", 80], ["Clarity", 75]].map(([l, v]) => (
                  <div key={l as string}>
                    <div className="flex justify-between text-gray-600"><span>{l}</span><span>{v}</span></div>
                    <div className="h-1.5 rounded-full bg-gray-100">
                      <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <div>
                  <p className="text-xs text-gray-500">Reviewed by Amina (NGO mentor)</p>
                  <p className="text-lg font-bold text-emerald-700">85/100</p>
                </div>
                <div className="grid h-14 w-14 grid-cols-5 gap-0.5 rounded-md bg-gray-900 p-1.5" aria-hidden>
                  {Array.from({ length: 25 }).map((_, i) => (
                    <span key={i} className={[0,1,2,4,5,6,10,12,14,18,20,22,23,24,8,16].includes(i) ? "bg-white" : "bg-gray-900"} />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-emerald-100/80">Sample credential for the demo</p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-4 px-6 py-6 text-center">
          {[["0", "certificates needed"], ["1 scan", "to verify any entry"], ["4", "languages supported"]].map(([a, b]) => (
            <div key={b}>
              <p className="text-2xl font-extrabold text-emerald-700 md:text-3xl">{a}</p>
              <p className="text-xs text-gray-500 md:text-sm">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-3xl font-bold">From no papers to hired, in four steps</h2>
        <p className="mt-2 max-w-xl text-gray-600">Experience is the real credential. ProofPath lets people earn it first.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-sm font-bold text-emerald-600/60">0{i + 1}</span>
              </div>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CRITERIA */}
      <section className="bg-emerald-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-3xl font-bold">One flow. Every barrier covered.</h2>
          <p className="mt-2 max-w-xl text-gray-600">Tap any card to see that part of the product live.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {CRITERIA.map((c) => (
              <Link key={c.n} href={c.href} className="group rounded-2xl border border-emerald-100 bg-white p-5 transition hover:border-emerald-400 hover:shadow-md">
                <span className="text-sm font-bold text-emerald-600">{c.n}</span>
                <h3 className="mt-1 font-semibold">{c.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{c.text}</p>
                <span className="mt-3 inline-block text-sm font-medium text-emerald-700 transition group-hover:translate-x-1">Open →</span>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {SDGS.map((s) => (
              <span key={s} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200">{s}</span>
            ))}
          </div>
        </div>
      </section>

      <AboutSections />
      <ImpactSections />
      {/* FINAL CTA */}
      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Skills are universal. Paperwork should not be the barrier.</h2>
        <div className="mx-auto mt-6 flex max-w-xs flex-col gap-3">
          <Link href="/onboarding" className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-emerald-700">
            Start building my proof
          </Link>
          <Link href="/employer" className="rounded-xl border px-5 py-3 font-semibold text-gray-800 transition hover:bg-gray-100">
            I am an employer
          </Link>
        </div>
        <p className="mx-auto mt-8 max-w-lg text-xs text-gray-500">
          Hackathon prototype. Credentials confirm that a record is authentic and unchanged, not a person&apos;s identity or legal status. Roles, candidates and payments in the demo are samples or simulated.
        </p>
      </section>
    </div>
  );
}
