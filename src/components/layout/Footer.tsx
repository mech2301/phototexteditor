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
  { label: "Certificate Text Edit", href: "/certificate_image_change_text" },
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
  { label: "Integration", href: "/tutorial/en/integration" },
];

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              PhoText
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              AI-Powered Image Text Editor
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-3">Features</h3>
            <ul className="space-y-2">
              {featureLinks.slice(0, 8).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-3">More Tools</h3>
            <ul className="space-y-2">
              {featureLinks.slice(8).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-3">About</h3>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="font-semibold text-sm text-gray-900 mt-6 mb-3">Help</h3>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            2024-2026 &copy; PhoText - Official Site. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>Language:</span>
            <select className="bg-transparent border border-border rounded px-2 py-1 text-xs">
              <option>English</option>
              <option>简体中文</option>
              <option>日本語</option>
              <option>한국어</option>
              <option>Русский</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
