import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Leave Note Image Text Edit - PhoText",
  description: "Edit text in leave notes and absence documents. Update dates, reasons, and employee details.",
};

export default function LeaveNotePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Leave Note Image Text Edit</h1>
      <p className="mt-4 text-lg text-gray-600">
        Edit text in leave notes and absence documents. Update dates, reasons,
        and employee information.
      </p>
      <Link href="/editor" className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors">
        Edit Note
      </Link>
    </div>
  );
}
