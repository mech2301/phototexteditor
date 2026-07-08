"use client";

const steps = [
  {
    num: "1",
    title: "Upload",
    desc: "Select the image you want to edit text and upload it to PhoText.",
  },
  {
    num: "2",
    title: "Edit Text",
    desc: "Click text in your image you want to fix and replace it with the new text you want. You can also adjust the font, color, size, and position of the text as needed.",
  },
  {
    num: "3",
    title: "Download",
    desc: 'When you are finish editing text, click the "Download" button at the top to save the new image.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          How to Edit Text In Image?
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold mx-auto">
                {step.num}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <img
            src="/images/editor-demo.png"
            alt="Editor Demo"
            className="rounded-xl shadow-lg border border-border max-w-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='400'%3E%3Crect fill='%23f8fafc' width='700' height='400'/%3E%3Ctext x='350' y='200' text-anchor='middle' fill='%2394a3b8' font-size='18'%3EEditor Interface%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
      </div>
    </section>
  );
}
