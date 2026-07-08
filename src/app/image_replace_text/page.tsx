import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Replace Text in Image Online - PhoText",
  description: "Replace text in images while preserving the original font, color, and style.",
};

export default function ReplaceTextPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Replace Text in Image</h1>
      <p className="mt-4 text-lg text-gray-600">
        Replace existing text in images with new text. AI automatically matches
        the original font, color, size, and position.
      </p>
      <Link href="/editor" className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors">
        Replace Text
      </Link>
    </div>
  );
}
