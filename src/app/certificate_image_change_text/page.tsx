import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Certificate Image Text Edit - PhoText",
  description: "Edit text in certificates and documents. Update names, titles, dates with font matching.",
};

export default function CertificateTextEditPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Certificate Image Text Edit</h1>
      <p className="mt-4 text-lg text-gray-600">
        Edit text in certificates and official documents. Update names, titles,
        dates, and serial numbers with exact font matching.
      </p>
      <Link href="/editor" className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors">
        Edit Certificate
      </Link>
    </div>
  );
}
