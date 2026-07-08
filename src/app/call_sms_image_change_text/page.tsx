import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Call/SMS Screenshot Text Edit - PhoText",
  description: "Edit text in call logs and SMS screenshots. Update phone numbers, names, and messages.",
};

export default function CallSmsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Call/SMS Screenshot Text Edit</h1>
      <p className="mt-4 text-lg text-gray-600">
        Edit text in call logs and SMS screenshots. Modify phone numbers,
        contact names, dates, and message content.
      </p>
      <Link href="/editor" className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors">
        Edit Now
      </Link>
    </div>
  );
}
