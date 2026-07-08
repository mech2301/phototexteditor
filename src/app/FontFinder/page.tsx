import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Font Identifier - Identify Fonts in Images - PhoText",
  description: "Identify fonts in images with AI. Upload an image and find matching fonts instantly.",
};

export default function FontFinderPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Font Identifier</h1>
      <p className="mt-4 text-lg text-gray-600">
        Identify fonts in images using AI recognition. Get instant font matches
        from our vast library.
      </p>
      <Link
        href="/editor"
        className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors"
      >
        Identify Font
      </Link>
    </div>
  );
}
