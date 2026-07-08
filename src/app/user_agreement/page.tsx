import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - PhoText",
  description: "PhoText Terms of Service and User Agreement.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
      <div className="mt-8 prose prose-gray max-w-none">
        <p>
          By using PhoText, you agree to these terms. PhoText provides an
          AI-powered image text editing service. You are responsible for the
          content you upload and edit.
        </p>
        <h2>Use of Service</h2>
        <p>
          You may use PhoText for lawful purposes only. You agree not to misuse
          the service or help anyone else do so.
        </p>
        <h2>Intellectual Property</h2>
        <p>
          All fonts distributed by the platform and any content produced are
          free for commercial use. You retain all rights to your images.
        </p>
        <h2>Limitation of Liability</h2>
        <p>
          PhoText is provided &quot;as is&quot; without warranty of any kind. We are not
          liable for any damages arising from the use of this service.
        </p>
      </div>
    </div>
  );
}
