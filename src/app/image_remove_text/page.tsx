import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Remove Text from Image Online Free - PhoText",
  description: "Remove unwanted text, watermarks, or logos from images online. Background restoration included.",
};

export default function RemoveTextPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Remove Text from Image</h1>
      <p className="mt-4 text-lg text-gray-600">
        Remove unwanted text, watermarks, or logos from images. AI-powered
        background restoration ensures seamless results.
      </p>
      <Link href="/editor" className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors">
        Remove Text
      </Link>
    </div>
  );
}
