"use client";

import { Canvas as FabricCanvas, Rect, Textbox, Image as FabricImage } from "fabric";

export function initCanvas(
  canvasEl: HTMLCanvasElement,
  imageUrl: string
): Promise<{ canvas: FabricCanvas; scale: number }> {
  const parent = canvasEl.parentElement;
  const width = parent?.clientWidth || 800;
  const height = Math.min(width * 0.75, 600);

  canvasEl.width = width;
  canvasEl.height = height;

  const canvas = new FabricCanvas(canvasEl, {
    width,
    height,
    backgroundColor: "#ffffff",
    preserveObjectStacking: true,
  });

  return new Promise((resolve, reject) => {
    const imgEl = new Image();
    imgEl.crossOrigin = "anonymous";
    imgEl.onload = () => {
      const scale = Math.min(width / imgEl.width, height / imgEl.height) * 0.9;
      const fabricImg = new FabricImage(imgEl, {
        scaleX: scale,
        scaleY: scale,
        left: (width - imgEl.width * scale) / 2,
        top: (height - imgEl.height * scale) / 2,
      });
      canvas.clear();
      canvas.add(fabricImg);
      canvas.renderAll();
      resolve({ canvas, scale });
    };
    imgEl.onerror = () => reject(new Error("Failed to load image"));
    imgEl.src = imageUrl;
  });
}

export function drawBoundingBoxes(
  canvas: FabricCanvas,
  words: Array<{ text: string; bbox: { x0: number; y0: number; x1: number; y1: number } }>,
  scale: number
) {
  canvas.remove(...canvas.getObjects().filter((o) => (o as any).isBbox));
  return words.map((word) => {
    const rect = new Rect({
      left: word.bbox.x0 * scale,
      top: word.bbox.y0 * scale,
      width: (word.bbox.x1 - word.bbox.x0) * scale,
      height: (word.bbox.y1 - word.bbox.y0) * scale,
      fill: "rgba(99, 102, 241, 0.12)",
      stroke: "#6366f1",
      strokeWidth: 2,
      strokeUniform: true,
      selectable: true,
      evented: true,
    });
    (rect as any).isBbox = true;
    (rect as any).originalText = word.text;
    canvas.add(rect);
    return rect;
  });
}

export function downloadCanvas(
  canvas: FabricCanvas,
  format: "png" | "jpeg" | "webp" = "png"
) {
  canvas.discardActiveObject();
  canvas.renderAll();
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

export function addTextBoxToCanvas(
  canvas: FabricCanvas,
  text: string,
  left: number,
  top: number,
  options?: { fontSize?: number; fontFamily?: string; fill?: string }
) {
  const tb = new Textbox(text, {
    left,
    top,
    width: 200,
    fontSize: options?.fontSize || 20,
    fontFamily: options?.fontFamily || "Arial",
    fill: options?.fill || "#000000",
    borderColor: "#6366f1",
    cornerColor: "#6366f1",
    cornerSize: 8,
    transparentCorners: false,
    editable: true,
  });
  canvas.add(tb);
  canvas.setActiveObject(tb);
  canvas.renderAll();
  return tb;
}

export function replaceActiveObject(
  canvas: FabricCanvas,
  newText: string,
  options?: { fontSize?: number; fontFamily?: string; fill?: string }
) {
  const active = canvas.getActiveObject();
  if (!active) return null;

  const isBbox = (active as any).isBbox === true;

  if (isBbox) {
    const tb = new Textbox(newText, {
      left: active.left,
      top: active.top,
      width: (active.width || 100) * (active.scaleX || 1),
      fontSize: options?.fontSize || 20,
      fontFamily: options?.fontFamily || "Arial",
      fill: options?.fill || "#000000",
      borderColor: "#6366f1",
      cornerColor: "#6366f1",
      cornerSize: 8,
      transparentCorners: false,
      editable: true,
    });
    canvas.remove(active);
    canvas.add(tb);
    canvas.setActiveObject(tb);
    canvas.renderAll();
    return tb;
  }

  if ((active as any).isType?.("Textbox")) {
    active.set("text", newText);
    if (options?.fontSize) active.set("fontSize", options.fontSize);
    if (options?.fontFamily) active.set("fontFamily", options.fontFamily);
    if (options?.fill) active.set("fill", options.fill);
    canvas.renderAll();
    return active;
  }

  return null;
}
