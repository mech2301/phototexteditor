import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Poster Text Edit Online - PhoText",
  description: "Edit text in posters and flyers online. Change titles, dates, and descriptions with AI.",
};

export default function PosterChangeTextPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Poster Text Edit</h1>
      <p className="mt-4 text-lg text-gray-600">
        Edit text in posters and flyers. Perfect for updating event details,
        prices, and promotional content.
      </p>
      <Link href="/editor" className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors">
        Edit Poster
      </Link>
    </div>
  );
}
