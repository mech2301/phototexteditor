"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

const navItems = [
  { label: "AI Image Editor", href: "/ai_image_editor" },
  { label: "Translate Image", href: "/ImageTranslator" },
  { label: "Photo Scanner", href: "/image_scanner" },
  { label: "Font Identifier", href: "/FontFinder" },
];

const moreItems = [
  { label: "Resize Image", href: "/resize_image" },
  { label: "Image to PDF", href: "/image_to_pdf" },
  { label: "PDF to Images", href: "/pdf_to_images" },
  { label: "Remove Text", href: "/image_remove_text" },
  { label: "Replace Text", href: "/image_replace_text" },
  { label: "Poster Text Edit", href: "/poster_change_text" },
  { label: "E-commerce Text Edit", href: "/ecommerce_main_image_change_text" },
  { label: "Screenshot Text Edit", href: "/wechat_alipay_screenshot_change_text" },
  { label: "Payment Screenshot Edit", href: "/payment_screenshot_change_text" },
  { label: "Certificate Text Edit", href: "/certificate_image_change_text" },
  { label: "Fix Text in Image", href: "/fix_text_in_image" },
  { label: "PDF Text Editor", href: "/pdf_text_editor" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
            PhoText
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              More <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {moreOpen && (
              <div
                className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-border py-2 z-50 max-h-80 overflow-y-auto"
                onMouseLeave={() => setMoreOpen(false)}
              >
                {moreItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/editor"
            className="text-sm px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            Get Started
          </Link>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <details className="text-sm">
            <summary className="text-gray-600 cursor-pointer">More</summary>
            <div className="mt-2 ml-2 space-y-2">
              {moreItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-gray-500 hover:text-gray-900"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
          <div className="pt-2 flex gap-3">
            <Link href="/login" className="text-sm text-gray-600">
              Log in
            </Link>
            <Link
              href="/editor"
              className="text-sm px-4 py-2 bg-primary text-white rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
