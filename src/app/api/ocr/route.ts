import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { createWorker } = await import("tesseract.js");

    const worker = await createWorker("eng", 1, {
      cachePath: "/tmp/tessdata",
      cacheMethod: "readWriteOnly",
    });

    const { data } = await worker.recognize(buffer);
    await worker.terminate();

    const words: { text: string; bbox: { x0: number; y0: number; x1: number; y1: number } }[] = [];
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

    return NextResponse.json({ words, text: data.text || "" });
  } catch (error: any) {
    console.error("OCR route error:", error);
    return NextResponse.json(
      { error: error?.message || "OCR processing failed" },
      { status: 500 }
    );
  }
}
