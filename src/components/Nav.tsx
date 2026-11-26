"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/onboarding", label: "Profile" },
  { href: "/tasks", label: "Tasks" },
  { href: "/review", label: "Review" },
  { href: "/ledger", label: "Ledger" },
  { href: "/wallet", label: "Wallet" },
  { href: "/hire", label: "Hire" },
  { href: "/employer", label: "Employer" },
];

export default function Nav() {
  const path = usePathname();
  if (path.startsWith("/verify")) return null; // employers see the verify page clean

  return (
    <nav className="sticky top-0 z-20 border-b border-emerald-100/70 bg-white/80 shadow-sm backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2">
        <Link href="/" className="group flex shrink-0 items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-extrabold text-white shadow-md transition group-hover:rotate-6">
            P
          </span>
          <span className="hidden text-lg font-extrabold tracking-tight text-emerald-900 sm:block">
            Proof<span className="text-emerald-600">Path</span>
          </span>
        </Link>

        <div className="flex flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {LINKS.map((l) => {
            const active = path === l.href || path.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/30"
                    : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-800"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
