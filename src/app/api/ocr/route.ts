import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const apiKey = process.env.OCR_SPACE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OCR API key not configured" },
        { status: 500 }
      );
    }

    const ocrFormData = new FormData();
    ocrFormData.append("file", file);
    ocrFormData.append("language", "eng");
    ocrFormData.append("isOverlayRequired", "true");

    const res = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: { apikey: apiKey },
      body: ocrFormData,
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "OCR processing failed" },
      { status: 500 }
    );
  }
}
