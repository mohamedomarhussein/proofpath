export type Category = "translation" | "data-entry" | "bookkeeping";

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
];

// Free or free-to-audit options. Confirm the exact course page before your demo.
export const COURSES: Record<Category, Course[]> = {
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
  translation: "translation",
  "data-entry": "data entry",
  bookkeeping: "bookkeeping",
};
