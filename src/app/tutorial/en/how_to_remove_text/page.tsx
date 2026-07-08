import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Remove Text or Watermark from Images - PhoText",
  description: "Step-by-step guide to remove text or watermarks from images online.",
};

export default function RemoveTextTutorial() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">How to Remove Text or Watermark from Images</h1>
      <div className="mt-8 prose prose-gray max-w-none">
        <p>Remove unwanted text or watermarks from images with AI-powered background restoration.</p>
        <ol>
          <li>Upload your image containing text or watermark</li>
          <li>Select the text region using the removal tool</li>
          <li>AI automatically restores the background</li>
          <li>Download the cleaned image</li>
        </ol>
      </div>
    </div>
  );
}
