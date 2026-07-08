"use client";

import Link from "next/link";
import { useDropzone } from "react-dropzone";

export function Hero() {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpg", ".png", ".webp", ".jpeg", ".bmp", ".pdf"] },
    maxFiles: 1,
    onDrop: (files) => {
      if (files[0]) window.location.href = "/editor";
    },
  });

  return (
    <section className="relative overflow-hidden bg-gray-50">
      <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              Edit Text in Image Online
            </h1>
            <div className="flex items-center gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
            </div>
            <p className="mt-4 text-lg text-gray-600 max-w-xl">
              The Easiest way to Edit Text in Image, Click Text in Image to Edit it, without needing PS skills.
            </p>
            <div className="mt-8">
              <div {...getRootProps()} className="inline-flex flex-col items-start gap-3 cursor-pointer">
                <input {...getInputProps()} />
                <div className="flex items-center gap-3">
                  <span className="px-6 py-3 bg-[#FF6583] text-white rounded-xl text-base font-semibold hover:bg-[#e55a76] transition-colors shadow-lg flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    Open Image
                  </span>
                  <span className="text-sm text-gray-400">{isDragActive ? "Drop here" : "or drag & drop"}</span>
                </div>
                <span className="text-xs text-gray-400">JPG, PNG, JPEG, WEBP, PDF</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
              <img src="/img/before-after.png" alt="Before and after comparison" className="w-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23f1f5f9' width='600' height='400'/%3E%3Ctext x='300' y='200' text-anchor='middle' fill='%2394a3b8' font-size='18'%3EBefore / After%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
