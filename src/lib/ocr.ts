export interface OCRWord {
  text: string;
  bbox: { x0: number; y0: number; x1: number; y1: number };
}

export interface OCRResult {
  words: OCRWord[];
  text: string;
}

// Tesseract.js - client-side OCR
export async function ocrTesseract(image: File | string): Promise<OCRResult> {
  const Tesseract = await import("tesseract.js");

  const worker = await Tesseract.default.createWorker("eng", 1, {
    logger: (m: any) => console.log("Tesseract:", m.status, m.progress),
    errorHandler: (err: any) => console.error("Tesseract error:", err),
  });

  const { data } = await worker.recognize(image);
  await worker.terminate();

  const words: OCRWord[] = [];
  const blocks = data.blocks;
  if (blocks) {
    for (const block of blocks) {
      if (!block.paragraphs) continue;
      for (const paragraph of block.paragraphs) {
        for (const line of paragraph.lines) {
          for (const word of line.words) {
            words.push({
              text: word.text,
              bbox: {
                x0: word.bbox.x0,
                y0: word.bbox.y0,
                x1: word.bbox.x1,
                y1: word.bbox.y1,
              },
            });
          }
        }
      }
    }
  }
  return { words, text: data.text };
}

// OCR.space API fallback
export async function ocrSpace(image: File): Promise<OCRResult> {
  const apiKey = process.env.NEXT_PUBLIC_OCR_SPACE_API_KEY || "";
  if (!apiKey) throw new Error("OCR.space API key not configured");

  const formData = new FormData();
  formData.append("file", image);
  formData.append("language", "eng");
  formData.append("isOverlayRequired", "true");

  const res = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: { apikey: apiKey },
    body: formData,
  });
  const data = await res.json();
  const words: OCRWord[] = [];
  if (data.ParsedResults?.[0]?.TextOverlay?.Lines) {
    for (const line of data.ParsedResults[0].TextOverlay.Lines) {
      if (line.Words) {
        for (const w of line.Words) {
          words.push({
            text: w.WordText,
            bbox: {
              x0: w.Left,
              y0: w.Top,
              x1: w.Left + w.Width,
              y1: w.Top + w.Height,
            },
          });
        }
      }
    }
  }
  return {
    words,
    text: data.ParsedResults?.[0]?.ParsedText || "",
  };
}

// Auto: try Tesseract first, fallback to OCR.space
export async function detectText(image: File): Promise<OCRResult> {
  const result = await ocrTesseract(image);
  if (result.words.length > 0) {
    console.log(`OCR found ${result.words.length} words`);
    return result;
  }
  throw new Error("No text found by OCR");
}
