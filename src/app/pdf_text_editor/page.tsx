import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PDF Text Editor - Edit Text in PDF Online - PhoText",
  description: "Edit text in PDF files online. Click to edit text in PDF documents without needing any software.",
};

export default function PdfTextEditorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">PDF Text Editor</h1>
      <p className="mt-4 text-lg text-gray-600">
        Edit text in PDF documents online. Click on any text in your PDF to edit
        it directly, just like editing a Word document.
      </p>
      <Link
        href="/editor"
        className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors"
      >
        Edit PDF
      </Link>
    </div>
  );
}
