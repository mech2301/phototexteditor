import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Text in Image Online with PhoText",
  description: "Step-by-step guide to edit text in images online using PhoText AI-powered editor.",
};

export default function EditTextTutorial() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Edit Text in Image Online with PhoText</h1>
      <div className="mt-8 prose prose-gray max-w-none">
        <p>Learn how to edit text in images using PhoText&apos;s AI-powered editor. Follow these simple steps:</p>
        <ol>
          <li>Upload your image to PhoText</li>
          <li>Wait for AI to detect text regions</li>
          <li>Click on any text to edit it</li>
          <li>Adjust font, color, size as needed</li>
          <li>Download your edited image</li>
        </ol>
      </div>
    </div>
  );
}
