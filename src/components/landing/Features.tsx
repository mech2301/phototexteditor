const features = [
  {
    title: "AI Text Editing",
    desc: "Supports conversational image editing. Based on next-gen AI 'Semantic Understanding + Smart Background Repair + Style Transfer' all-in-one solution.",
  },
  {
    title: "AI Font Matching",
    desc: "Supports AI recognition of fonts in images, providing a vast library of fonts for use.",
  },
  {
    title: "Background Seamless Restoration",
    desc: "Automatically restores background during text modification. No ghosts, white edges, or color blocks.",
  },
  {
    title: "Perfect Style Matching",
    desc: "AI analyzes the original image to match font, color, weight, perspective, shadow, and gloss, making edits invisible.",
  },
  {
    title: "High-Precision OCR",
    desc: "Supports recognition of text in all languages within images. Accurately recognizes slanted, curved, small text, complex backgrounds.",
  },
  {
    title: "Powerful Image Editing",
    desc: "Offers features like filters, stickers, and word art. Supports processing and exporting high-resolution images.",
  },
  {
    title: "Minimalist Experience",
    desc: "Smooth operation on both Web and App. Intuitive interface, no learning required.",
  },
  {
    title: "High Cost-Performance",
    desc: "Basic features are free. Generous free trial quota for advanced features.",
  },
  {
    title: "Privacy & Security",
    desc: "We do not collect user photos, device information, or geolocation for advertising or data resale.",
  },
  {
    title: "Free for Commercial Use",
    desc: "All fonts distributed by the platform and any content produced are free for commercial use.",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          Why Choose PhoText?
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-xl p-6 border border-border hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
