"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/onboarding", label: "1 Profile" },
  { href: "/tasks", label: "2 Tasks" },
  { href: "/review", label: "3 Review" },
  { href: "/ledger", label: "4 Ledger" },
  { href: "/wallet", label: "5 Wallet" },
  { href: "/hire", label: "6 Hire" },
  { href: "/employer", label: "7 Employer" },
];

export default function Nav() {
  const path = usePathname();
  if (path.startsWith("/verify")) return null; // employers see the verify page clean
  return (
    <nav className="sticky top-0 z-10 border-b bg-white print:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-1 overflow-x-auto p-2">
        <Link href="/" className="mr-2 font-bold text-emerald-700">
          ProofPath
        </Link>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-sm ${
              path.startsWith(l.href) ? "bg-emerald-600 text-white" : "text-gray-700"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
