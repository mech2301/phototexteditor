"use client";

const examples = [
  {
    title: "Document Date Correction",
    desc: "Correct wrong dates on a document sample while keeping the original font and layout.",
    img: "/images/fix_date_in_invoice.webp",
  },
  {
    title: "Chat Bubble Text Edit",
    desc: "Edit text in chat bubbles on a sample image, naturally matching the original style.",
    img: "/images/edit_text_in_chatbox.webp",
  },
  {
    title: "Table Text Correction",
    desc: "Fix number and text entry errors on a report sample while preserving the table layout.",
    img: "/images/fix_text_in_table.webp",
  },
  {
    title: "Certificate Text Correction",
    desc: "Correct names and titles on a certificate sample, keeping the exact font size and style.",
    img: "/images/fix_text_in_certificate.webp",
  },
  {
    title: "Document Text Correction",
    desc: "Fix typos in names and text on a document sample, matching the original typography.",
    img: "/images/fix_text_in_invoice.webp",
  },
];

export function Examples() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          AI Text Edit Examples
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((ex) => (
            <div
              key={ex.title}
              className="rounded-xl overflow-hidden border border-border bg-white hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                <img
                  src={ex.img}
                  alt={ex.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f1f5f9' width='400' height='300'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%2394a3b8' font-size='14'%3EExample Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{ex.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{ex.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
