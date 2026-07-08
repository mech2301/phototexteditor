import Link from "next/link";

const featureLinks = [
  { label: "Edit Text in Image", href: "/" },
  { label: "Translate Image", href: "/ImageTranslator" },
  { label: "Photo Scanner", href: "/image_scanner" },
  { label: "Font Identifier", href: "/FontFinder" },
  { label: "PDF Text Editor", href: "/pdf_text_editor" },
  { label: "AI Image Editor", href: "/ai_image_editor" },
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

const aboutLinks = [
  { label: "About", href: "/about" },
  { label: "Terms of Service", href: "/user_agreement" },
  { label: "Privacy Policy", href: "/privacy" },
];

const helpLinks = [
  { label: "FAQ", href: "/#faq" },
  { label: "Contact Support", href: "/about" },
  { label: "Parameter Access and Embed", href: "/tutorial/en/integration" },
];

const languageLinks = [
  { label: "English", href: "https://photext.ai/" },
  { label: "简体中文", href: "#" },
  { label: "日本語", href: "#" },
  { label: "한국어", href: "#" },
  { label: "Русский", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <Link href="/" className="text-xl font-bold text-gray-900">
              PhoText
            </Link>
            <p className="mt-2 text-sm text-gray-500">AI-Powered Image Text Editor</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">Features</h4>
            <ul className="space-y-2">
              {featureLinks.slice(0, 8).map((link) => (
                <li key={link.href}><Link href={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">More Tools</h4>
            <ul className="space-y-2">
              {featureLinks.slice(8).map((link) => (
                <li key={link.href}><Link href={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">About</h4>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{link.label}</Link></li>
              ))}
            </ul>
            <h4 className="font-semibold text-sm text-gray-900 mt-6 mb-3">Help</h4>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">Language</h4>
            <ul className="space-y-2">
              {languageLinks.map((link) => (
                <li key={link.label}><a href={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{link.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">2024-2026 &copy; PhoText - Official Site. All Rights Reserved.</p>
          <div className="flex gap-4">
            <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              Feedback
            </button>
            <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
