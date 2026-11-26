export type Category = "translation" | "data-entry" | "bookkeeping" | "customer-support" | "writing" | "technology" | "engineering" | "health-admin" | "education";

export interface Requirement {
  key: Category;
  minTasks: number;
  minLevel: 1 | 2 | 3;
}

export interface Role {
  id: string;
  title: string;
  employer: string;
  remote: boolean;
  summary: string;
  requirements: Requirement[]; // listed from most to least important
}

export interface Course {
  title: string;
  provider: string;
  url: string;
  cost: string;
  weeks: number;
}

export const ROLES: Role[] = [
  {
    id: "r1",
    title: "Remote Arabic–English Translator",
    employer: "Sample role (demo): Community Learning Hub",
    remote: true,
    summary: "Translate short notices and messages for a learning non-profit.",
    requirements: [{ key: "translation", minTasks: 2, minLevel: 1 }],
  },
  {
    id: "r2",
    title: "Data Entry Clerk",
    employer: "Sample role (demo): Small Shop Co-op",
    remote: false,
    summary: "Clean and enter customer and stock records.",
    requirements: [{ key: "data-entry", minTasks: 2, minLevel: 1 }],
  },
  {
    id: "r3",
    title: "Remote Junior Bookkeeper",
    employer: "Sample role (demo): Small Shop Co-op",
    remote: true,
    summary: "Record sales and expenses and report the cash balance.",
    requirements: [
      { key: "bookkeeping", minTasks: 1, minLevel: 2 },
      { key: "data-entry", minTasks: 1, minLevel: 1 },
    ],
  },
  {
    id: "r4",
    title: "NGO Finance Assistant",
    employer: "Sample role (demo): Local NGO Finance Desk",
    remote: false,
    summary: "Reconcile ledgers with bank statements and process invoices.",
    requirements: [
      { key: "bookkeeping", minTasks: 1, minLevel: 3 },
      { key: "data-entry", minTasks: 1, minLevel: 3 },
    ],
  },
  {
    id: "r7",
    title: "Remote IT Support Assistant",
    employer: "Sample role (demo): Community IT Help Desk",
    remote: true,
    summary: "Help users solve everyday computer and software problems.",
    requirements: [{ key: "technology", minTasks: 2, minLevel: 1 }],
  },
  {
    id: "r8",
    title: "Junior Technical Assistant",
    employer: "Sample role (demo): Local Builders Cooperative",
    remote: false,
    summary: "Do site measurements, material estimates and basic calculations.",
    requirements: [{ key: "engineering", minTasks: 2, minLevel: 1 }],
  },
  {
    id: "r9",
    title: "Clinic Administrative Assistant",
    employer: "Sample role (demo): Community Health Clinic Office",
    remote: false,
    summary: "Prepare patient files and manage appointment schedules.",
    requirements: [{ key: "health-admin", minTasks: 2, minLevel: 1 }],
  },
  {
    id: "r10",
    title: "Remote Tutor and Learning Assistant",
    employer: "Sample role (demo): After-School Learning Centre",
    remote: true,
    summary: "Explain concepts simply and prepare short lesson plans.",
    requirements: [{ key: "education", minTasks: 2, minLevel: 1 }],
  },
  {
    id: "r5",
    title: "Remote Customer Support Agent",
    employer: "Sample role (demo): Online Shop Support Desk",
    remote: true,
    summary: "Answer customer messages politely and solve order problems.",
    requirements: [{ key: "customer-support", minTasks: 2, minLevel: 1 }],
  },
  {
    id: "r6",
    title: "Content and Copy Assistant",
    employer: "Sample role (demo): Market Traders Group",
    remote: true,
    summary: "Proofread notices and write short product descriptions.",
    requirements: [{ key: "writing", minTasks: 2, minLevel: 1 }],
  },
];

// Free or free-to-audit options. Confirm the exact course page before your demo.
export const COURSES: Record<Category, Course[]> = {
  "customer-support": [
    { title: "Customer service fundamentals", provider: "Coursera (free to audit)", url: "https://www.coursera.org", cost: "Free to audit", weeks: 2 },
  ],
  writing: [
    { title: "Grammar and clear writing", provider: "Khan Academy (free)", url: "https://www.khanacademy.org", cost: "Free", weeks: 3 },
  ],
  technology: [
    { title: "IT support basics", provider: "Coursera (free to audit)", url: "https://www.coursera.org", cost: "Free to audit", weeks: 4 },
    { title: "Learn to code", provider: "freeCodeCamp (free)", url: "https://www.freecodecamp.org", cost: "Free", weeks: 6 },
  ],
  engineering: [
    { title: "Physics and electricity basics", provider: "Khan Academy (free)", url: "https://www.khanacademy.org", cost: "Free", weeks: 4 },
  ],
  "health-admin": [
    { title: "Healthcare administration basics", provider: "Coursera (free to audit)", url: "https://www.coursera.org", cost: "Free to audit", weeks: 3 },
  ],
  education: [
    { title: "Teaching and learning basics", provider: "OpenLearn (free)", url: "https://www.open.edu/openlearn", cost: "Free", weeks: 3 },
  ],
  translation: [
    { title: "Translation and localisation basics", provider: "Coursera (free to audit)", url: "https://www.coursera.org", cost: "Free to audit", weeks: 3 },
  ],
  "data-entry": [
    { title: "Spreadsheets for beginners (Excel or Google Sheets)", provider: "Coursera (free to audit)", url: "https://www.coursera.org", cost: "Free to audit", weeks: 2 },
  ],
  bookkeeping: [
    { title: "Bookkeeping basics", provider: "Alison (free)", url: "https://alison.com", cost: "Free", weeks: 2 },
    { title: "Accounting and financial statements", provider: "Khan Academy (free)", url: "https://www.khanacademy.org", cost: "Free", weeks: 3 },
  ],
};

export const CATEGORY_LABEL: Record<Category, string> = {
  "customer-support": "customer support",
  writing: "writing",
  technology: "technology",
  engineering: "engineering",
  "health-admin": "health administration",
  education: "education",
  translation: "translation",
  "data-entry": "data entry",
  bookkeeping: "bookkeeping",
};
