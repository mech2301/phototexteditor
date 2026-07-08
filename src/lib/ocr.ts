export interface OCRWord {
  text: string;
  bbox: { x0: number; y0: number; x1: number; y1: number };
}

export interface OCRResult {
  words: OCRWord[];
  text: string;
}

function downscaleImage(file: File, maxDim: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w <= maxDim && h <= maxDim) {
        resolve(url);
        return;
      }
      const scale = Math.min(maxDim / w, maxDim / h);
      w = Math.round(w * scale);
      h = Math.round(h * scale);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      c.getContext("2d")!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.9));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to decode image")); };
    img.src = url;
  });
}

// Server-side OCR via API route
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

// Client-side Tesseract.js (primary path)
export async function ocrTesseract(image: File): Promise<OCRResult> {
  let imgSrc: string | File = image;
  try {
    imgSrc = await downscaleImage(image, 2000);
  } catch {
    imgSrc = image;
  }

  const { createWorker } = await import("tesseract.js");

  const worker = await createWorker("eng", 1, {
    logger: (m: any) => console.log("Tesseract:", m.status, m.progress),
    errorHandler: (err: any) => console.error("Tesseract error:", err),
  });

  const { data } = await worker.recognize(imgSrc, {}, { text: true, blocks: true });
  await worker.terminate();

  if (typeof imgSrc === "string" && imgSrc.startsWith("blob:")) {
    URL.revokeObjectURL(imgSrc);
  }

  const words: OCRWord[] = [];
  if (data.blocks) {
    for (const block of data.blocks) {
      if (!block.paragraphs) continue;
      for (const paragraph of block.paragraphs) {
        for (const line of paragraph.lines || []) {
          for (const word of line.words || []) {
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
  return { words, text: data.text || "" };
}

// Auto: try client-side Tesseract first, fall back to server API
export async function detectText(image: File): Promise<OCRResult> {
  try {
    const result = await ocrTesseract(image);
    if (result.words.length > 0) {
      console.log(`OCR (client) found ${result.words.length} words`);
      return result;
    }
  } catch (e) {
    console.warn("Client OCR failed, trying server:", e);
  }

  const result = await ocrServer(image);
  if (result.words.length > 0) {
    console.log(`OCR (server) found ${result.words.length} words`);
    return result;
  }
  throw new Error("No text found by OCR");
}
