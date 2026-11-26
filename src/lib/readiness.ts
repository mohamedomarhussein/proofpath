export type Status = "not_started" | "in_progress" | "done";
export type WorkType = "local" | "remote";

export interface Step {
  id: string;
  title: string;
  why: string;
  nextAction: string;
  appliesTo: WorkType[];
}

export interface Country {
  name: string;
  wallet: string;
  steps: Step[];
}

export const COUNTRIES: Record<string, Country> = {
  kenya: {
    name: "Kenya",
    wallet: "M-Pesa",
    steps: [
      {
        id: "identity",
        title: "Have a recognised ID document",
        why: "Banks, mobile money and employers usually ask for ID.",
        nextAction: "Ask UNHCR or your registration centre which ID you hold, and how to replace any lost documents.",
        appliesTo: ["local", "remote"],
      },
      {
        id: "work-auth",
        title: "Confirm your right to work",
        why: "Rules depend on your status and can change.",
        nextAction: "Ask a legal aid organisation or your NGO partner what permit or letter you need before accepting paid work.",
        appliesTo: ["local", "remote"],
      },
      {
        id: "mobile-money",
        title: "Register a mobile money wallet (M-Pesa)",
        why: "This is how you receive your first payment.",
        nextAction: "Take your ID to a Safaricom shop or agent and ask which documents they accept for registration.",
        appliesTo: ["local", "remote"],
      },
      {
        id: "contract",
        title: "Learn contract basics",
        why: "A clear agreement protects you from unpaid work and scams.",
        nextAction: "Before starting, write down the pay, deadline and payment method, and keep a copy. Never pay a fee to get work.",
        appliesTo: ["local", "remote"],
      },
      {
        id: "tax",
        title: "Ask about tax registration",
        why: "Formal jobs and some clients ask for a tax number.",
        nextAction: "Ask a legal aid organisation or the tax authority whether you need a tax number (KRA PIN) for your type of work.",
        appliesTo: ["local", "remote"],
      },
      {
        id: "platform",
        title: "Open a payment account for remote clients",
        why: "Overseas clients often pay through online platforms.",
        nextAction: "Check which payment services (for example Wise, Payoneer or PayPal) accept your documents, and whether they can send money to M-Pesa.",
        appliesTo: ["remote"],
      },
    ],
  },
  uganda: {
    name: "Uganda",
    wallet: "MTN MoMo / Airtel Money",
    steps: [
      {
        id: "identity",
        title: "Have a recognised ID document",
        why: "SIM registration, mobile money and employers usually ask for ID.",
        nextAction: "Ask UNHCR or the refugee settlement office which ID or attestation you hold, and how to replace lost documents.",
        appliesTo: ["local", "remote"],
      },
      {
        id: "work-auth",
        title: "Confirm your right to work",
        why: "Rules depend on your status and can change.",
        nextAction: "Ask a legal aid organisation or your NGO partner what permit or letter you need before accepting paid work.",
        appliesTo: ["local", "remote"],
      },
      {
        id: "mobile-money",
        title: "Register a mobile money wallet (MTN MoMo or Airtel Money)",
        why: "This is how you receive your first payment.",
        nextAction: "Register your SIM with your ID, then visit an MTN or Airtel agent and ask which documents they accept for a wallet.",
        appliesTo: ["local", "remote"],
      },
      {
        id: "contract",
        title: "Learn contract basics",
        why: "A clear agreement protects you from unpaid work and scams.",
        nextAction: "Before starting, write down the pay, deadline and payment method, and keep a copy. Never pay a fee to get work.",
        appliesTo: ["local", "remote"],
      },
      {
        id: "tax",
        title: "Ask about tax registration",
        why: "Formal jobs and some clients ask for a tax number.",
        nextAction: "Ask a legal aid organisation or the tax authority whether you need a tax number (TIN) for your type of work.",
        appliesTo: ["local", "remote"],
      },
      {
        id: "platform",
        title: "Open a payment account for remote clients",
        why: "Overseas clients often pay through online platforms.",
        nextAction: "Check which payment services accept your documents, and whether they can send money to mobile money.",
        appliesTo: ["remote"],
      },
    ],
  },
};
