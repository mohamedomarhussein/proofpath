export interface Task {
  id: string;
  level: 1 | 2 | 3;
  category: "translation" | "data-entry" | "bookkeeping";
  title: string;
  instructions: string;
  source: string;
  referenceAnswer: string;
  keywords: string[];
  minLength: number;
  payKES: number;
  clientName: string;
}

export const LEVEL_NAMES = { 1: "Starter", 2: "Trusted", 3: "Pro" } as const;
export const PASS_MARK = 60;

export const TASKS: Task[] = [
  {
    id: "t1",
    level: 1,
    category: "translation",
    title: "Translate a school notice (Arabic to English)",
    instructions: "Translate this notice into clear English.",
    source: "المدرسة مفتوحة من الأحد إلى الخميس. يجب على الطلاب الوصول قبل الساعة الثامنة صباحاً وإحضار دفاترهم.",
    referenceAnswer: "The school is open from Sunday to Thursday. Students must arrive before eight o'clock in the morning and bring their notebooks.",
    keywords: ["sunday", "thursday", "students", "eight", "notebooks"],
    minLength: 60,
    payKES: 100,
    clientName: "Sample client: Community Learning Hub",
  },
  {
    id: "t2",
    level: 1,
    category: "data-entry",
    title: "Clean a messy student list",
    instructions: "Rewrite each line as: Name, Age, Class. Use proper capital letters and remove extra spaces.",
    source: "ali hassan ,12, class 4\nFATUMA  omar,11 ,CLASS 3\nabdi ,  10,class 4",
    referenceAnswer: "Ali Hassan, 12, Class 4\nFatuma Omar, 11, Class 3\nAbdi, 10, Class 4",
    keywords: ["ali hassan", "fatuma omar", "abdi", "class 4", "class 3"],
    minLength: 40,
    payKES: 100,
    clientName: "Sample client: Community Learning Hub",
  },
  {
    id: "t3",
    level: 2,
    category: "translation",
    title: "Translate a work message (Swahili to English)",
    instructions: "Translate this message into professional English. Note: 'saa kumi jioni' means 4 PM.",
    source: "Tafadhali tuma ripoti ya mauzo ya wiki hii kabla ya Ijumaa saa kumi jioni.",
    referenceAnswer: "Please send this week's sales report before Friday at 4 PM.",
    keywords: ["report", "sales", "week", "friday", "4"],
    minLength: 40,
    payKES: 250,
    clientName: "Sample client: Small Shop Co-op",
  },
  {
    id: "t4",
    level: 2,
    category: "bookkeeping",
    title: "Find a shop's cash balance",
    instructions: "A shop starts with 3,000 cash. It sells goods for 5,000 cash, buys stock for 2,000 cash, and pays rent of 1,500. Write each entry and the closing cash balance.",
    source: "Opening cash: 3,000\nSale: +5,000\nStock purchase: -2,000\nRent: -1,500",
    referenceAnswer: "Opening 3,000 + sale 5,000 - stock 2,000 - rent 1,500 = closing cash balance 4,500.",
    keywords: ["4500", "sale", "stock", "rent"],
    minLength: 50,
    payKES: 250,
    clientName: "Sample client: Small Shop Co-op",
  },
  {
    id: "t5",
    level: 3,
    category: "bookkeeping",
    title: "Reconcile a ledger with a bank statement",
    instructions: "The ledger shows receipts of 12,000, 8,500 and 4,200. The bank statement shows deposits of 12,000 and 8,500, and a bank charge of 300. Which item is missing from the bank, what is not yet in the ledger, and what is the adjusted balance?",
    source: "Ledger receipts: 12,000 | 8,500 | 4,200\nBank deposits: 12,000 | 8,500\nBank charge: 300",
    referenceAnswer: "The 4,200 receipt is a deposit in transit (in the ledger, not yet at the bank). The 300 bank charge is not yet in the ledger. Adjusted ledger balance: 24,700 - 300 = 24,400.",
    keywords: ["4200", "300", "24400", "transit"],
    minLength: 80,
    payKES: 500,
    clientName: "Sample client: Local NGO Finance Desk",
  },
  {
    id: "t6",
    level: 3,
    category: "data-entry",
    title: "Extract invoice data and total",
    instructions: "Extract the supplier, each item with quantity and unit price, and calculate the total.",
    source: "Invoice from Baraka Supplies dated 3 March: 20 exercise books at 50 each, and 10 pens at 20 each.",
    referenceAnswer: "Supplier: Baraka Supplies. 20 exercise books x 50 = 1,000. 10 pens x 20 = 200. Total: 1,200.",
    keywords: ["baraka", "exercise books", "pens", "1200"],
    minLength: 60,
    payKES: 500,
    clientName: "Sample client: Local NGO Finance Desk",
  },
];

export function getTask(id: string) {
  return TASKS.find((t) => t.id === id);
}
