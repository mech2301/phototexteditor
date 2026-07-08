import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Image Editor - Easy & Free Online Image Editor - PhoText",
  description:
    "Edit images through simple conversations. Intelligent features: automatic recognition, smart correction, smart generation, one-click removal & replacement, style transfer.",
};

export default function AIImageEditorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">AI Image Editor</h1>
      <p className="mt-4 text-lg text-gray-600">
        Edit images through simple conversations while offering intelligent
        features such as automatic recognition, smart correction, smart
        generation & filling, one-click removal & replacement, artistic style
        transfer, text layout & design, etc.
      </p>
      <Link
        href="/editor"
        className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors"
      >
        Start Editing
      </Link>
    </div>
  );
}
