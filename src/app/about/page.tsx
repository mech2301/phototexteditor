import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - PhoText",
  description: "Learn about PhoText - the AI-powered image text editor.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">About PhoText</h1>
      <p className="mt-4 text-lg text-gray-600">
        PhoText is an AI-powered online tool that allows users to edit text in
        images directly through a web browser, without requiring Photoshop
        skills. Our mission is to make image text editing as simple as selecting
        text in a document.
      </p>
      <p className="mt-4 text-lg text-gray-600">
        Powered by advanced AI technology, PhoText provides features like
        automatic text detection, smart background restoration, font matching,
        and conversational editing - all while ensuring your privacy and data
        security.
      </p>
    </div>
  );
}
