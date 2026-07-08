"use client";

import { useState } from "react";

const examples = [
  { id: 1, title: "Document Date Correction", desc: "Correct wrong dates on a document sample while keeping the original font and layout.", img: "/img/ai_guide/fix_date_in_invoice.webp" },
  { id: 2, title: "Chat Bubble Text Edit", desc: "Edit text in chat bubbles on a sample image, naturally matching the original style.", img: "/img/ai_guide/edit_text_in_chatbox.webp" },
  { id: 3, title: "Table Text Correction", desc: "Fix number and text entry errors on a report sample while preserving the table layout.", img: "/img/ai_guide/fix_text_in_table.webp" },
  { id: 4, title: "Certificate Text Correction", desc: "Correct names and titles on a certificate sample, keeping the exact font size and style.", img: "/img/ai_guide/fix_text_in_certificate.webp" },
  { id: 5, title: "Document Text Correction", desc: "Fix typos in names and text on a document sample, matching the original typography.", img: "/img/ai_guide/fix_text_in_invoice.webp" },
];

export function Examples() {
  const [selected, setSelected] = useState(0);

  return (
    <section className="relative bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          AI Text Edit Examples
        </h2>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-3">
            {examples.map((ex, i) => (
              <button key={ex.id} onClick={() => setSelected(i)}
                className={`w-full text-left p-4 rounded-xl transition-all ${selected === i ? "bg-white border-gray-200 shadow-lg" : "hover:bg-gray-100"}`}>
                <h3 className={`font-semibold ${selected === i ? "text-[#FF6583]" : "text-gray-900"}`}>{ex.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{ex.desc}</p>
              </button>
            ))}
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-lg bg-white">
            <div className="aspect-[16/10] bg-gray-100 relative">
              <img src={examples[selected].img} alt={examples[selected].title} className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='375'%3E%3Crect fill='%23f1f5f9' width='600' height='375'/%3E%3Ctext x='300' y='190' text-anchor='middle' fill='%2394a3b8' font-size='16'%3EExample%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
