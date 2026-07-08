import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "E-commerce Image Text Edit - PhoText",
  description: "Edit text in e-commerce product images. Update prices, titles, and descriptions easily.",
};

export default function EcommerceTextEditPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">E-commerce Image Text Edit</h1>
      <p className="mt-4 text-lg text-gray-600">
        Edit text in e-commerce main images. Update prices, product titles, and
        promotional text effortlessly.
      </p>
      <Link href="/editor" className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors">
        Edit Now
      </Link>
    </div>
  );
}
