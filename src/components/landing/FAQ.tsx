"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How do I match the same font?",
    a: 'After selecting the text, click "Identify Font" in the font section of the editing panel to recognize and match similar fonts.',
  },
  {
    q: "Spots during manual editing?",
    a: "When manually editing, the background removal tool offers multiple schemes to achieve the best seamless background restoration. If there are spots, try a different removal result, or use AI conversational editing for a smarter and easier experience.",
  },
  {
    q: "How do I fix just one word in a line?",
    a: "When manually editing, you can precisely select the text in the image to edit it, or manually erase the target text and add new text at the corresponding position. The simplest and fastest way is to use conversational AI editing.",
  },
  {
    q: "What is the maximum image size supported?",
    a: "Currently, it supports processing images with a maximum size of 2560x2560 pixels. Images exceeding this limit will be compressed.",
  },
  {
    q: "Is there an app version?",
    a: "PhoText is accessible via web browsers on both desktop and mobile devices.",
  },
  {
    q: "Is it free to use?",
    a: "Yes! Basic features are free with generous free trial quota for advanced features.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-border overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {faq.q}
                <svg
                  className={`w-4 h-4 transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
