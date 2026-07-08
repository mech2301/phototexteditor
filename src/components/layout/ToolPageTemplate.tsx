"use client";

import Link from "next/link";
import { useDropzone } from "react-dropzone";

interface ToolPageTemplateProps {
  title: string;
  description: string;
  items?: { name: string; href: string }[];
}

export function ToolPageTemplate({ title, description, items }: ToolPageTemplateProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpg", ".png", ".webp", ".jpeg", ".bmp"] },
    maxFiles: 1,
    onDrop: () => { window.location.href = "/editor"; },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">{description}</p>
        </div>

        <div {...getRootProps()} className="max-w-lg mx-auto bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center cursor-pointer hover:border-[#FF6583] hover:bg-pink-50/30 transition-all">
          <input {...getInputProps()} />
          <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
          <p className="mt-4 text-gray-600">{isDragActive ? "Drop your image here" : "Click to upload or drag and drop"}</p>
          <p className="mt-2 text-xs text-gray-400">Supports JPG, PNG, WEBP, BMP</p>
        </div>

        {items && (
          <div className="mt-12">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 text-center">Related Tools</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {items.map((item) => (
                <Link key={item.href} href={item.href} className="px-4 py-2 text-sm bg-white rounded-lg border border-gray-200 text-gray-600 hover:border-[#FF6583] hover:text-[#FF6583] transition-colors">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
