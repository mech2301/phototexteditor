import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Photo Scanner - Scan Text from Images - PhoText",
  description: "Scan and extract text from photos, documents, and screenshots with high-precision OCR.",
};

export default function PhotoScannerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Photo Scanner</h1>
      <p className="mt-4 text-lg text-gray-600">
        Scan and extract text from photos, documents, and screenshots using
        high-precision OCR. Supports 100+ languages.
      </p>
      <Link
        href="/editor"
        className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors"
      >
        Scan Now
      </Link>
    </div>
  );
}
