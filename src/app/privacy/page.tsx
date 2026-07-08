import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - PhoText",
  description: "PhoText Privacy Policy - how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
      <div className="mt-8 prose prose-gray max-w-none">
        <p>
          We do not collect user photos, device information, or geolocation for
          targeted advertising or data resale. Edited images are automatically
          cleared after 3 days (30 days for logged-in users).
        </p>
        <h2>Data Collection</h2>
        <p>
          We only collect minimal information necessary to provide the service.
          Your images are processed in real-time and not stored permanently.
        </p>
        <h2>Data Security</h2>
        <p>
          All image processing is done with end-to-end encryption. We implement
          industry-standard security measures to protect your data.
        </p>
        <h2>Contact</h2>
        <p>
          If you have questions about this privacy policy, please contact us
          through our support channels.
        </p>
      </div>
    </div>
  );
}
