export interface InpaintResult {
  imageUrl: string;
  success: boolean;
}

export async function inpaintTextRemoval(
  imageFile: File,
  maskRegion: { x: number; y: number; width: number; height: number }
): Promise<InpaintResult> {
  const iopaintUrl = process.env.NEXT_PUBLIC_IOPAINT_URL;
  if (!iopaintUrl) {
    throw new Error("IOPaint URL not configured. Set NEXT_PUBLIC_IOPAINT_URL");
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  const maskCanvas = document.createElement("canvas");
  const img = new Image();
  const imgUrl = URL.createObjectURL(imageFile);
  await new Promise<void>((resolve) => {
    img.onload = () => {
      maskCanvas.width = img.width;
      maskCanvas.height = img.height;
      const ctx = maskCanvas.getContext("2d")!;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, img.width, img.height);
      ctx.fillStyle = "white";
      ctx.fillRect(maskRegion.x, maskRegion.y, maskRegion.width, maskRegion.height);
      resolve();
    };
    img.src = imgUrl;
  });

  const maskBlob = await new Promise<Blob>((resolve) =>
    maskCanvas.toBlob((b) => resolve(b!), "image/png")
  );
  formData.append("mask", maskBlob, "mask.png");

  const res = await fetch(`${iopaintUrl}/inpaint`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(`Inpainting failed: ${res.statusText}`);

  const resultBlob = await res.blob();
  return {
    imageUrl: URL.createObjectURL(resultBlob),
    success: true,
  };
}

// Basic canvas-only inpainting (no AI) as fallback
export function inpaintBasic(
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number
): string {
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let py = y; py < y + height; py++) {
    for (let px = x; px < x + width; px++) {
      const i = (py * canvas.width + px) * 4;
      const sampleLeft = (py * canvas.width + Math.max(0, px - 2)) * 4;
      const sampleRight = (py * canvas.width + Math.min(canvas.width - 1, px + 2)) * 4;
      data[i] = (data[sampleLeft] + data[sampleRight]) / 2;
      data[i + 1] = (data[sampleLeft + 1] + data[sampleRight + 1]) / 2;
      data[i + 2] = (data[sampleLeft + 2] + data[sampleRight + 2]) / 2;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}
