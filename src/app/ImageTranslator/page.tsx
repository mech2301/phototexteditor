import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Translate Image - Online Image Translator - PhoText",
  description: "Translate text in images to any language while preserving the original layout and style.",
};

export default function ImageTranslatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Translate Image</h1>
      <p className="mt-4 text-lg text-gray-600">
        Translate text in images to any language. AI preserves font, color,
        size, and layout for natural-looking translations.
      </p>
      <Link
        href="/editor"
        className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors"
      >
        Translate Now
      </Link>
    </div>
  );
}
