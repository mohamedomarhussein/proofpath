import Link from "next/link";
import DemoButton from "@/components/DemoButton";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-xl flex-col justify-center gap-4 p-6">
      <h1 className="text-4xl font-bold text-emerald-700">ProofPath</h1>
      <p className="text-lg text-gray-700">
        No paperwork? No problem. Start working today, and let your verified work history speak for you.
      </p>
      <Link
        href="/onboarding"
        className="rounded-xl bg-emerald-600 px-4 py-3 text-center font-semibold text-white"
      >
        Get started
      </Link>
      <DemoButton />
      <p className="text-xs text-gray-500">
        Demo Mode fills in a sample journey for &quot;Hassan&quot; so you can see the whole product in seconds.
      </p>
    </main>
  );
}
