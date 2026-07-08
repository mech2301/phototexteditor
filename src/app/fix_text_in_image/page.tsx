import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fix Text in Image Online - PhoText",
  description: "Fix typos, errors, and damaged text in images with AI-powered text restoration.",
};

export default function FixTextInImagePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Fix Text in Image</h1>
      <p className="mt-4 text-lg text-gray-600">
        Fix typos, errors, and damaged text in images. AI-powered restoration
        ensures natural-looking results.
      </p>
      <Link href="/editor" className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors">
        Fix Text
      </Link>
    </div>
  );
}
