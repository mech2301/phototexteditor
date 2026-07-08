"use client";

import Link from "next/link";
import { useState } from "react";

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
  { label: "Remove Text from Image", href: "/image_remove_text" },
  { label: "Replace Text in Image", href: "/image_replace_text" },
  { label: "Poster Text Edit", href: "/poster_change_text" },
  { label: "E-commerce Main Image Text Edit", href: "/ecommerce_main_image_change_text" },
  { label: "WhatsApp/PayPal Screenshot Text Edit", href: "/wechat_alipay_screenshot_change_text" },
  { label: "Payment Screenshot Text Edit", href: "/payment_screenshot_change_text" },
  { label: "Watermark Camera Text Edit", href: "/watermark_camera_change_text" },
  { label: "Exam Score Screenshot Text Edit", href: "/exam_score_screenshot_change_text" },
  { label: "Leave Note Image Text Edit", href: "/leave_note_image_change_text" },
  { label: "Certificate Image Text Edit", href: "/certificate_image_change_text" },
  { label: "Call/SMS Screenshot Text Edit", href: "/call_sms_image_change_text" },
  { label: "Ticket Screenshot Text Edit", href: "/ticket_image_change_text" },
  { label: "Fix Text in Image", href: "/fix_text_in_image" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/photext.ai.png" alt="PhoText" className="h-5" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <span className="text-xl font-bold text-gray-900">PhoText</span>
        </Link>

        <div className="hidden md:flex items-center gap-5">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap">
              {item.label}
            </Link>
          ))}
          <div className="relative">
            <button onClick={() => setMoreOpen(!moreOpen)} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              More <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {moreOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto"
                onMouseLeave={() => setMoreOpen(false)}>
                {moreItems.map((item) => (
                  <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-gray-800 hover:text-gray-900 transition-colors">
            Log in
          </Link>
          <Link href="/editor" className="text-sm px-5 py-2.5 bg-[#FF6583] text-white rounded-lg hover:bg-[#e55a76] transition-colors font-semibold">
            Get Started
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="block text-sm text-gray-600 hover:text-gray-900">{item.label}</Link>
          ))}
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">More Tools</p>
            {moreItems.map((item) => (
              <Link key={item.href} href={item.href} className="block text-sm text-gray-600 hover:text-gray-900 py-1">{item.label}</Link>
            ))}
          </div>
          <div className="pt-3 flex gap-3">
            <Link href="/login" className="text-sm font-semibold text-gray-800">Log in</Link>
            <Link href="/editor" className="text-sm px-4 py-1.5 bg-[#FF6583] text-white rounded-lg font-semibold">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
