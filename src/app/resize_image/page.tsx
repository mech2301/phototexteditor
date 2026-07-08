import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resize Image Online Free - PhoText",
  description: "Resize images online for free. Adjust width, height, and maintain aspect ratio.",
};

export default function ResizeImagePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Resize Image</h1>
      <p className="mt-4 text-lg text-gray-600">
        Resize images online for free. Adjust dimensions while maintaining
        quality and aspect ratio.
      </p>
      <Link
        href="/editor"
        className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors"
      >
        Resize Now
      </Link>
    </div>
  );
}
