import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Screenshot Text Edit Online - PhoText",
  description: "Edit text in WhatsApp, PayPal, and payment screenshots. Update names, amounts, and dates.",
};

export default function ScreenshotTextEditPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Screenshot Text Edit</h1>
      <p className="mt-4 text-lg text-gray-600">
        Edit text in chat and payment screenshots. Modify names, amounts, dates,
        and messages with perfect style matching.
      </p>
      <Link href="/editor" className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors">
        Edit Screenshot
      </Link>
    </div>
  );
}
