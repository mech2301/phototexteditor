export interface OCRWord {
  text: string;
  bbox: { x0: number; y0: number; x1: number; y1: number };
}

export interface OCRResult {
  words: OCRWord[];
  text: string;
}

// Server-side OCR via API route (recommended — no browser download)
export async function ocrServer(image: File): Promise<OCRResult> {
  const formData = new FormData();
  formData.append("file", image);

  const res = await fetch("/api/ocr", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `OCR server error: ${res.status}`);
  }
  return res.json();
}

// Client-side Tesseract.js — used as fallback
export async function ocrTesseract(image: File | string): Promise<OCRResult> {
  const { createWorker } = await import("tesseract.js");

  const worker = await createWorker("eng", 1, {
    logger: (m: any) => console.log("Tesseract:", m.status, m.progress),
    errorHandler: (err: any) => console.error("Tesseract error:", err),
  });

  const { data } = await worker.recognize(image, {}, { text: true, blocks: true });
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

// Auto: try server API first, fall back to client-side Tesseract
export async function detectText(image: File): Promise<OCRResult> {
  try {
    const result = await ocrServer(image);
    if (result.words.length > 0) {
      console.log(`OCR (server) found ${result.words.length} words`);
      return result;
    }
  } catch (e) {
    console.warn("Server OCR failed, falling back to client Tesseract:", e);
  }

  const result = await ocrTesseract(image);
  if (result.words.length > 0) {
    console.log(`OCR (client) found ${result.words.length} words`);
    return result;
  }
  throw new Error("No text found by OCR");
}
