import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Translate Text in Image - PhoText",
  description: "Step-by-step guide to translate text in images while preserving the original layout.",
};

export default function TranslateTextTutorial() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">How to Translate Text in Image</h1>
      <div className="mt-8 prose prose-gray max-w-none">
        <p>Translate text in images to any language while maintaining the original style and layout.</p>
        <ol>
          <li>Upload the image containing text to translate</li>
          <li>AI detects and extracts the text</li>
          <li>Select target language for translation</li>
          <li>AI replaces text with translated version</li>
          <li>Download the translated image</li>
        </ol>
      </div>
    </div>
  );
}
