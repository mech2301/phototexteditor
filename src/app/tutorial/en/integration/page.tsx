import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parameter Access and Embed - PhoText",
  description: "Learn how to integrate and embed PhoText into your applications.",
};

export default function IntegrationTutorial() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Parameter Access and Embed</h1>
      <div className="mt-8 prose prose-gray max-w-none">
        <p>Learn how to integrate PhoText into your applications.</p>
        <h2>URL Parameters</h2>
        <p>You can pass parameters via URL to customize the editor experience.</p>
        <h2>Embed API</h2>
        <p>Use our embed API to integrate the editor directly into your website.</p>
      </div>
    </div>
  );
}
