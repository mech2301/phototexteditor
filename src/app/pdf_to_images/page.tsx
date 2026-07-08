import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PDF to Images - Convert PDF to Images Online - PhoText",
  description: "Convert PDF pages to JPG, PNG images online for free.",
};

export default function PdfToImagesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">PDF to Images</h1>
      <p className="mt-4 text-lg text-gray-600">
        Convert PDF documents to high-quality images. Extract every page as a
        separate image.
      </p>
      <Link href="/editor" className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors">
        Convert Now
      </Link>
    </div>
  );
}
