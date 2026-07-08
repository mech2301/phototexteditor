"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />
      <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
          Edit Text in Image Online
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          The Easiest way to Edit Text in Image, Click Text in Image to Edit it,
          without needing PS skills.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/editor"
            className="px-8 py-3 bg-primary text-white rounded-xl text-lg font-medium hover:bg-primary-hover transition-colors shadow-lg shadow-indigo-200"
          >
            Open Image
          </Link>
          <p className="text-sm text-gray-400">JPG, PNG, JPEG, WEBP, PDF</p>
        </div>
        <div className="mt-12 relative">
          <div className="relative mx-auto max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-border">
            <img
              src="/images/editor-preview.png"
              alt="PhoText Editor Preview"
              className="w-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect fill='%23f1f5f9' width='800' height='400'/%3E%3Ctext x='400' y='200' text-anchor='middle' fill='%2394a3b8' font-size='20'%3EEditor Preview%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
