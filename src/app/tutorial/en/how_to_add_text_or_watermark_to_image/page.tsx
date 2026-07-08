import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Add Text to Image Online - PhoText",
  description: "Step-by-step guide to add text or watermarks to images online.",
};

export default function AddTextTutorial() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">How to Add Text to Image Online</h1>
      <div className="mt-8 prose prose-gray max-w-none">
        <p>Add custom text or watermarks to your images with full control over font, color, and position.</p>
        <ol>
          <li>Upload your image</li>
          <li>Click the &quot;Add Text&quot; button</li>
          <li>Type your text and customize appearance</li>
          <li>Position the text on your image</li>
          <li>Download the result</li>
        </ol>
      </div>
    </div>
  );
}
