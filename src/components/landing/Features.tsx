const features = [
  {
    title: "AI Text Editing",
    desc: "Supports conversational image editing. Based on next-gen AI 'Semantic Understanding + Smart Background Repair + Style Transfer' all-in-one solution. Automatically executes the full process without manual selection, manual erasing, typing, or adjusting font/color/position.",
    icon: "sparkles",
  },
  {
    title: "AI Font Matching",
    desc: "Supports AI recognition of fonts in images, providing a vast library of fonts for use.",
    icon: "search",
  },
  {
    title: "Background Seamless Restoration",
    desc: "Automatically restores background during text modification. No ghosts, white edges, or color blocks. Perfectly restores complex textures like wood, fabric, and lighting.",
    icon: "layers",
  },
  {
    title: "Perfect Style Matching",
    desc: "AI analyzes the original image to match font, color, weight, perspective, shadow, and gloss, making edits invisible.",
    icon: "typography",
  },
  {
    title: "High-Precision OCR",
    desc: "Supports recognition of text in all languages within images. Accurately recognizes slanted, curved, small text, complex backgrounds, and mixed layouts, restoring geometric features.",
    icon: "scan",
  },
  {
    title: "Powerful Image Editing",
    desc: "In addition to text editing, offers features like filters, stickers, and word art. Supports processing and exporting high-resolution images, preserving original quality.",
    icon: "quality",
  },
  {
    title: "Minimalist Experience",
    desc: "Smooth operation on both Web and App. Intuitive interface, no learning required. Eliminates the tedious steps of 'smudge - recognize - select font - align', offering a 'what you input is what you get' experience.",
    icon: "touch",
  },
  {
    title: "High Cost-Performance",
    desc: "Basic features are free. Generous free trial quota for advanced features. Transparent and reasonable pricing with no hidden costs.",
    icon: "savings",
  },
  {
    title: "Privacy & Security",
    desc: "We do not collect user photos, device information, or geolocation for targeted advertising or data resale. Edited images are automatically cleared after 3 days (30 days for logged-in users).",
    icon: "security",
  },
  {
    title: "Free for Commercial Use",
    desc: "All fonts distributed by the platform and any content produced are free for commercial use, with no copyright concerns.",
    icon: "business",
  },
];

const icons: Record<string, string> = {
  sparkles: "M14.5 2l1.8 5.7L22 9.5l-5.7 1.8L14.5 17l-1.8-5.7L7 9.5l5.7-1.8zM5 12l.9 2.6L8.5 15l-2.6.9L5 18.5l-.9-2.6L1.5 15l2.6-.9z",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  typography: "M11 4H4v3h5.5l-3 10H4v3h8v-3H9.5l3-10H20V4h-7z",
  scan: "M3 7V5a2 2 0 012-2h2M3 17v2a2 2 0 002 2h2M17 3h2a2 2 0 012 2v2M17 21h2a2 2 0 002-2v-2M7 12h10M7 8h10M7 16h6",
  quality: "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z",
  touch: "M17 11V7a4 4 0 00-8 0v4m-2 0h12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7z",
  savings: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2-6h10a2 2 0 012 2v1m-2 4h-4m0 0l-2 2m2-2l2-2",
  security: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  business: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
};

export function Features() {
  return (
    <section className="relative bg-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          Why Choose PhoText?
        </h2>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="group bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300">
              <svg className="w-10 h-10 text-[#FF6583] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={icons[f.icon]} />
              </svg>
              <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
