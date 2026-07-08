"use client";

const steps = [
  {
    num: "1",
    title: "Upload Image",
    desc: "Select the image you want to edit text and upload it to PhoText. Supports JPG, PNG, WEBP, BMP and PDF formats.",
    icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",
  },
  {
    num: "2",
    title: "Edit Text",
    desc: "Click text in your image you want to fix and replace it with the new text. AI automatically matches font, color, size, and position.",
    icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
  },
  {
    num: "3",
    title: "Download",
    desc: "When finished editing, click the Download button to save the edited image in original quality.",
    icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          How to Edit Text In Image?
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6583] to-[#e55a76] flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
