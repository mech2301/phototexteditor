"use client";

import { useState } from "react";

const faqs = [
  { q: "How do I match the same font", a: 'After selecting the text, click "Identify Font" in the font section of the editing panel to recognize and match similar fonts.' },
  { q: "Spots during manual editing?", a: "When manually editing, the background removal tool offers multiple schemes to achieve the best seamless background restoration. If there are spots, try a different removal result, or use AI conversational editing for a smarter and easier experience, absolutely no spots will appear." },
  { q: "How do I fix just one word in a line?", a: "When manually editing, you can precisely select the text in the image to edit it, or manually erase the target text and add new text at the corresponding position. The simplest and fastest way is to use conversational AI editing." },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative bg-gray-50 py-20">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">FAQ</h2>
        <div className="mt-10 space-y-0">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-200">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-4 text-left">
                <h4 className="text-base font-medium text-gray-900">{faq.q}</h4>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${openIndex === i ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
