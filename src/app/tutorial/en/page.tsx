import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tutorials - PhoText",
  description: "Learn how to use PhoText with step-by-step tutorials.",
};

export default function TutorialsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Tutorials</h1>
      <p className="mt-4 text-lg text-gray-600">
        Learn how to use PhoText with our step-by-step guides.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Edit Text in Image Online", href: "/tutorial/en/edit_text_in_image_online_tutorial" },
          { title: "How to Remove Text from Images", href: "/tutorial/en/how_to_remove_text" },
          { title: "How to Add Text to Image", href: "/tutorial/en/how_to_add_text_or_watermark_to_image" },
          { title: "How to Translate Text in Image", href: "/tutorial/en/translate_text_and_save_as_new_image" },
          { title: "Parameter Access and Embed", href: "/tutorial/en/integration" },
        ].map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="p-4 bg-white rounded-xl border border-border hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">{t.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
