import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  try {
    const res = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.GOOGLE_FONTS_API_KEY}&sort=popularity`
    );
    const data = await res.json();
    const items = (data.items || [])
      .filter(
        (f: any) =>
          f.family.toLowerCase().includes(query.toLowerCase()) ||
          f.category.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10)
      .map((f: any) => ({
        family: f.family,
        category: f.category,
        variants: f.variants,
      }));

    return NextResponse.json({ fonts: items });
  } catch {
    return NextResponse.json(
      { fonts: [] },
      { status: 200 }
    );
  }
}
