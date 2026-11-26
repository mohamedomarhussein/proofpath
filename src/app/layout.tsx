import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import DbSync from "@/components/DbSync";

export const metadata: Metadata = {
  title: "ProofPath",
  description: "Your work is your proof.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Nav />
        <DbSync />
        {children}
      </body>
    </html>
  );
}
