export interface GoogleFont {
  family: string;
  category: string;
  variants: string[];
}

let fontCache: GoogleFont[] | null = null;

export async function getGoogleFonts(): Promise<GoogleFont[]> {
  if (fontCache) return fontCache;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY;
  const url = apiKey
    ? `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`
    : "https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity";

  try {
    const res = await fetch(url);
    const data = await res.json();
    fontCache = (data.items || []).map((f: any) => ({
      family: f.family,
      category: f.category,
      variants: f.variants,
    }));
  } catch {
    fontCache = [
      { family: "Arial", category: "sans-serif", variants: ["regular", "bold", "italic"] },
      { family: "Times New Roman", category: "serif", variants: ["regular", "bold", "italic"] },
      { family: "Helvetica", category: "sans-serif", variants: ["regular", "bold"] },
      { family: "Courier New", category: "monospace", variants: ["regular", "bold"] },
      { family: "Georgia", category: "serif", variants: ["regular", "bold", "italic"] },
      { family: "Verdana", category: "sans-serif", variants: ["regular", "bold"] },
      { family: "Trebuchet MS", category: "sans-serif", variants: ["regular", "bold"] },
      { family: "Impact", category: "sans-serif", variants: ["regular"] },
      { family: "Comic Sans MS", category: "script", variants: ["regular", "bold"] },
      { family: "Palatino Linotype", category: "serif", variants: ["regular", "bold"] },
    ];
  }
  return fontCache!;
}

export function suggestMatchingFont(
  detectedFont: string,
  fonts: GoogleFont[]
): GoogleFont[] {
  const query = detectedFont.toLowerCase();
  const matched = fonts.filter(
    (f) =>
      f.family.toLowerCase().includes(query) ||
      f.category.includes(query) ||
      query.includes(f.family.toLowerCase())
  );
  return matched.slice(0, 5);
}
