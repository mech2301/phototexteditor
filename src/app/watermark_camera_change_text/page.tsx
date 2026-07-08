import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Watermark Camera Text Edit - PhoText",
  description: "Edit text in camera watermarks and timestamps. Modify date, time, and camera info.",
};

export default function WatermarkCameraPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Watermark Camera Text Edit</h1>
      <p className="mt-4 text-lg text-gray-600">
        Edit text in camera watermarks and timestamps. Update dates, camera
        models, and settings information.
      </p>
      <Link href="/editor" className="mt-8 inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors">
        Edit Watermark
      </Link>
    </div>
  );
}
