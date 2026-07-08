import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Image to PDF - Convert Images to PDF Online - PhoText",
  description: "Convert JPG, PNG, WEBP images to PDF documents online for free.",
};

export default function ImageToPdfPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Image to PDF</h1>
      <p className="mt-4 text-lg text-gray-600">
        Convert your images to PDF documents online. Free, fast, and secure.
      </p>
      <Link href="/editor" className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors">
        Convert Now
      </Link>
    </div>
  );
}
