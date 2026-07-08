"use client";

import { Canvas as FabricCanvas, Rect, Textbox, Image as FabricImage } from "fabric";

export function initCanvas(
  canvasEl: HTMLCanvasElement,
  imageUrl: string,
  width: number,
  height: number
) {
  const canvas = new FabricCanvas(canvasEl, {
    width,
    height,
    backgroundColor: "#ffffff",
    preserveObjectStacking: true,
  });

  return new Promise<FabricCanvas>((resolve) => {
    FabricImage.fromURL(imageUrl).then((img) => {
      const scale = Math.min(width / img.width!, height / img.height!) * 0.9;
      img.set({ scaleX: scale, scaleY: scale, left: 0, top: 0 });
      canvas.add(img);
      canvas.renderAll();
      resolve(canvas);
    }).catch(() => {
      resolve(canvas);
    });
  });
}

export function drawBoundingBoxes(
  canvas: FabricCanvas,
  words: Array<{ text: string; bbox: { x0: number; y0: number; x1: number; y1: number } }>,
  scaleX: number,
  scaleY: number
) {
  return words.map((word) => {
    const rect = new Rect({
      left: word.bbox.x0 * scaleX,
      top: word.bbox.y0 * scaleY,
      width: (word.bbox.x1 - word.bbox.x0) * scaleX,
      height: (word.bbox.y1 - word.bbox.y0) * scaleY,
      fill: "rgba(99, 102, 241, 0.1)",
      stroke: "#6366f1",
      strokeWidth: 1,
      strokeDashArray: [4, 4] as number[],
      selectable: true,
      evented: true,
    });
    (rect as any).data = { originalText: word.text };
    canvas.add(rect);
    return rect;
  });
}

export function downloadCanvas(
  canvas: FabricCanvas,
  format: "png" | "jpeg" | "webp" = "png"
) {
  const dataUrl = canvas.toDataURL({
    format,
    quality: 1,
    multiplier: 2,
  });
  const link = document.createElement("a");
  link.download = `photext-edited.${format}`;
  link.href = dataUrl;
  link.click();
}
