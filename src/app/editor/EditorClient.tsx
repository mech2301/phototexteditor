"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  ArrowLeft,
  Download,
  Upload,
  Loader2,
  Trash2,
  Plus,
  MousePointerClick,
  Square,
} from "lucide-react";
import Link from "next/link";

type Tool = "select" | "rect";

export default function EditorClient() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [ocrCount, setOcrCount] = useState(0);
  const [selectedText, setSelectedText] = useState("");
  const [editText, setEditText] = useState("");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(20);
  const [fontColor, setFontColor] = useState("#000000");
  const [tool, setTool] = useState<Tool>("select");
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  const drawStart = useRef<{ x: number; y: number } | null>(null);
  const drawRectRef = useRef<any>(null);
  const fileRef = useRef<File | null>(null);

  // Canvas ref check to ensure it's mounted
  const canvasReady = useRef(false);

  // Dynamically import Fabric
  const getFabric = useCallback(async () => {
    const fabric = await import("fabric");
    return fabric;
  }, []);

  // Dynamically import OCR
  const getOCR = useCallback(async () => {
    const ocr = await import("@/lib/ocr");
    return ocr;
  }, []);

  // Process image when imageUrl changes and canvas is ready
  useEffect(() => {
    if (!imageUrl || !fileRef.current || !canvasRef.current) return;
    canvasReady.current = true;

    const file = fileRef.current;
    const url = imageUrl;
    const canvasEl = canvasRef.current;
    let disposed = false;

    (async () => {
      setLoading(true);
      setStatusText("Loading image...");

      try {
        const fabric = await getFabric();
        const { Canvas: FabricCanvas, Rect: FabricRect, Textbox: FabricTextbox, Image: FabricImage } = fabric;

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

        fabricRef.current = canvas;

        await new Promise<void>((resolve, reject) => {
          const imgEl = new Image();
          imgEl.crossOrigin = "anonymous";
          imgEl.onload = () => {
            if (disposed) return resolve();
            const s = Math.min(width / imgEl.width, height / imgEl.height) * 0.9;
            const fimg = new FabricImage(imgEl, {
              scaleX: s,
              scaleY: s,
              left: (width - imgEl.width * s) / 2,
              top: (height - imgEl.height * s) / 2,
            });
            canvas.clear();
            canvas.add(fimg);
            canvas.renderAll();
            resolve();
          };
          imgEl.onerror = () => reject(new Error("Failed to load image"));
          imgEl.src = url;
        });

        if (disposed) return;

        canvas.on("selection:created", (e: any) => {
          const obj = e.selected?.[0];
          const origText = obj?.originalText;
          if (origText) { setSelectedText(origText); setEditText(origText); }
          else if (obj?.constructor?.name === "Textbox" || obj?.isType?.("Textbox")) { setSelectedText(obj.text || ""); setEditText(obj.text || ""); }
        });

        canvas.on("selection:updated", (e: any) => {
          const obj = e.selected?.[0];
          const origText = obj?.originalText;
          if (origText) { setSelectedText(origText); setEditText(origText); }
          else if (obj?.constructor?.name === "Textbox" || obj?.isType?.("Textbox")) { setSelectedText(obj.text || ""); setEditText(obj.text || ""); }
        });

        canvas.on("selection:cleared", () => { setSelectedText(""); setEditText(""); });

        // Run OCR
        setStatusText("Running OCR...");
        try {
          const { detectText } = await getOCR();
          const result = await detectText(file);
          if (!disposed && result.words.length > 0) {
            setOcrCount(result.words.length);
            for (const word of result.words) {
              const { bbox } = word;
              const rect = new FabricRect({
                left: bbox.x0 * (canvasEl.width / width),
                top: bbox.y0 * (canvasEl.height / height),
                width: Math.max((bbox.x1 - bbox.x0) * (canvasEl.width / width), 10),
                height: Math.max((bbox.y1 - bbox.y0) * (canvasEl.height / height), 10),
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
            }
            canvas.renderAll();
            if (!disposed) setStatusText(`Detected ${result.words.length} text regions \u2014 click a blue box to edit`);
          } else if (!disposed) {
            setOcrCount(0);
            setStatusText('No text detected. Use "Region" tool to mark text manually.');
          }
        } catch (err) {
          if (!disposed) {
            console.warn("OCR skipped:", err);
            setOcrCount(0);
            setStatusText('OCR unavailable. Use "Region" tool or "Add Text".');
          }
        }
      } catch (err: any) {
        if (!disposed) {
          console.error("Init error:", err);
          setStatusText("Failed to load image: " + (err.message || "unknown error"));
        }
      }
      if (!disposed) setLoading(false);
    })();

    return () => { disposed = true; };
  }, [imageUrl, getFabric, getOCR]);

  // Cleanup on unmount or imageUrl change
  useEffect(() => {
    return () => {
      if (fabricRef.current) {
        try { fabricRef.current.dispose(); } catch {}
        fabricRef.current = null;
      }
    };
  }, [imageUrl]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Dispose previous canvas
    if (fabricRef.current) {
      try { fabricRef.current.dispose(); } catch {}
      fabricRef.current = null;
    }

    fileRef.current = file;
    setOcrCount(0);
    setSelectedText("");
    setEditText("");
    setStatusText("");

    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".bmp"] },
    maxSize: 10 * 1024 * 1024,
    noClick: !!imageUrl,
    noKeyboard: !!imageUrl,
  });

  const getPointer = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const el = canvasRef.current;
    const b = el.getBoundingClientRect();
    return {
      x: (e.clientX - b.left) * (el.width / b.width),
      y: (e.clientY - b.top) * (el.height / b.height),
    };
  }, []);

  const handleMouseDown = useCallback(async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== "rect" || !fabricRef.current) return;
    const fabric = await getFabric();
    const { Rect: FabricRect } = fabric;
    const canvas = fabricRef.current;
    const { x, y } = getPointer(e);
    drawStart.current = { x, y };
    setIsDrawing(true);

    const shape = new FabricRect({
      left: x, top: y, width: 1, height: 1,
      fill: "rgba(99, 102, 241, 0.15)",
      stroke: "#6366f1",
      strokeWidth: 2,
      strokeDashArray: [6, 3],
      selectable: false,
      evented: false,
    });
    canvas.add(shape);
    drawRectRef.current = shape;
  }, [tool, getPointer, getFabric]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawStart.current || !drawRectRef.current || !fabricRef.current) return;
    const canvas = fabricRef.current;
    const { x, y } = getPointer(e);
    const left = Math.min(drawStart.current.x, x);
    const top = Math.min(drawStart.current.y, y);
    drawRectRef.current.set({ left, top, width: Math.abs(x - drawStart.current.x), height: Math.abs(y - drawStart.current.y) });
    canvas.renderAll();
  }, [isDrawing, getPointer]);

  const handleMouseUp = useCallback(() => {
    if (tool !== "rect" || !isDrawing || !drawRectRef.current || !fabricRef.current) return;
    const canvas = fabricRef.current;
    const sel = drawRectRef.current;
    if ((sel.width || 0) < 10 || (sel.height || 0) < 10) {
      canvas.remove(sel);
    } else {
      sel.set({ strokeDashArray: undefined, selectable: true, evented: true });
      sel.isBbox = true;
      sel.originalText = "[selected region]";
      canvas.setActiveObject(sel);
      canvas.renderAll();
      setSelectedText("[selected region]");
      setEditText("");
      setOcrCount((c) => c + 1);
    }
    drawRectRef.current = null;
    drawStart.current = null;
    setIsDrawing(false);
    setTool("select");
  }, [tool, isDrawing]);

  const handleApplyEdit = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    const fabric = await getFabric();
    const { Textbox: FabricTextbox } = fabric;

    if (active.isBbox) {
      const tb = new FabricTextbox(editText, {
        left: (active.left || 0) + 2,
        top: (active.top || 0) + 2,
        width: Math.max(((active.width || 100) * (active.scaleX || 1)) - 4, 50),
        fontSize, fontFamily, fill: fontColor,
        borderColor: "#6366f1", cornerColor: "#6366f1", cornerSize: 8,
        transparentCorners: false, editable: true,
      });
      canvas.remove(active);
      canvas.add(tb);
      canvas.setActiveObject(tb);
    } else if (active.constructor?.name === "Textbox" || active.isType?.("Textbox")) {
      active.set("text", editText);
      active.set("fontSize", fontSize);
      active.set("fontFamily", fontFamily);
      active.set("fill", fontColor);
    }
    canvas.renderAll();
  }, [editText, fontSize, fontFamily, fontColor, getFabric]);

  const handleAddText = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const fabric = await getFabric();
    const { Textbox: FabricTextbox } = fabric;
    const cx = canvas.width! / 2;
    const cy = canvas.height! / 2;
    const tb = new FabricTextbox("New Text", {
      left: cx - 100, top: cy - 20, width: 200,
      fontSize, fontFamily, fill: fontColor,
      borderColor: "#6366f1", cornerColor: "#6366f1", cornerSize: 8,
      transparentCorners: false, editable: true,
    });
    canvas.add(tb);
    canvas.setActiveObject(tb);
    canvas.renderAll();
    setSelectedText("New Text");
    setEditText("New Text");
  }, [fontSize, fontFamily, fontColor, getFabric]);

  const handleDownload = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.discardActiveObject();
    canvas.renderAll();
    const dataUrl = canvas.toDataURL({ format: "png", quality: 1, multiplier: 2 });
    const link = document.createElement("a");
    link.download = "photext-edited.png";
    link.href = dataUrl;
    link.click();
  }, []);

  const handleDeleteSelected = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      const isBbox = active.isBbox === true;
      canvas.remove(active);
      canvas.renderAll();
      setSelectedText("");
      if (isBbox) setOcrCount((c) => Math.max(0, c - 1));
    }
  }, []);

  const handleNewImage = useCallback(() => {
    if (fabricRef.current) {
      try { fabricRef.current.dispose(); } catch {}
      fabricRef.current = null;
    }
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setOcrCount(0);
    setSelectedText("");
    setEditText("");
    setStatusText("");
    drawRectRef.current = null;
    drawStart.current = null;
    setIsDrawing(false);
  }, [imageUrl]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-border px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          {imageUrl && (
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
              <button onClick={() => setTool("select")}
                className={`p-1.5 rounded-md text-xs flex items-center gap-1 ${tool === "select" ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"}`}>
                <MousePointerClick className="w-3.5 h-3.5" /> Select
              </button>
              <button onClick={() => setTool("rect")}
                className={`p-1.5 rounded-md text-xs flex items-center gap-1 ${tool === "rect" ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"}`}>
                <Square className="w-3.5 h-3.5" /> Region
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {imageUrl && (
            <>
              <button onClick={handleNewImage}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-gray-50">
                <Upload className="w-4 h-4" /> New Image
              </button>
              <button onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover">
                <Download className="w-4 h-4" /> Download
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 min-h-0">
        <div className="bg-white rounded-xl border border-border p-4 min-h-[400px] flex items-center justify-center overflow-hidden">
          {!imageUrl ? (
            <div {...getRootProps()}
              className="w-full h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition-colors">
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-600">{isDragActive ? "Drop image here..." : "Drag and drop an image here or"}</p>
              <p className="mt-2 px-6 py-2 bg-primary text-white rounded-lg text-sm">Open Image</p>
              <p className="mt-2 text-xs text-gray-400">JPG, PNG, JPEG, WEBP, BMP</p>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {loading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    <p className="mt-2 text-sm text-gray-600 px-4">{statusText}</p>
                  </div>
                </div>
              )}
              <canvas ref={canvasRef}
                className="max-w-full max-h-full rounded-lg"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ cursor: tool === "rect" ? "crosshair" : "default" }}
              />
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Edit</h3>
            {ocrCount > 0 && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{ocrCount} selected</span>}
          </div>

          {imageUrl && (
            <button onClick={handleAddText}
              className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors">
              <Plus className="w-4 h-4" /> Add Text
            </button>
          )}

          {selectedText !== "" ? (
            <>
              <div>
                <label className="text-xs text-gray-500">New Text</label>
                <input value={editText} onChange={(e) => setEditText(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm" placeholder="Type replacement text..." autoFocus />
              </div>
              <div>
                <label className="text-xs text-gray-500">Font</label>
                <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm">
                  <option>Arial</option><option>Times New Roman</option><option>Courier New</option>
                  <option>Georgia</option><option>Verdana</option><option>Impact</option>
                  <option>Helvetica</option><option>Trebuchet MS</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Size: {fontSize}px</label>
                <input type="range" min="8" max="120" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full mt-1" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Color</label>
                <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)}
                  className="w-full mt-1 h-10 rounded border border-border cursor-pointer" />
              </div>
              <button onClick={handleApplyEdit}
                className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm">
                Replace Text
              </button>
            </>
          ) : imageUrl && (
            <div className="text-sm text-gray-400 space-y-2">
              <p><strong>To edit text in the image:</strong></p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Click a blue box (auto-detected text)</li>
                <li>Or click <strong>&quot;Region&quot;</strong> above, then drag over the text</li>
                <li>Type replacement text and click Replace Text</li>
              </ol>
            </div>
          )}

          {imageUrl && (
            <div className="pt-4 border-t border-border">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Tools</h4>
              <div className="flex gap-2">
                <button onClick={handleDeleteSelected}
                  className="p-2 rounded-lg border border-border hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-600 transition-colors" title="Delete selected">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {statusText && (
            <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 leading-relaxed">{statusText}</div>
          )}

          {imageUrl && (
            <div className="flex gap-2 pt-2">
              <button onClick={() => {
                const canvas = fabricRef.current;
                if (!canvas) return;
                canvas.discardActiveObject(); canvas.renderAll();
                const d = canvas.toDataURL({ format: "jpeg", quality: 0.95, multiplier: 2 });
                const l = document.createElement("a"); l.download = "photext-edited.jpg"; l.href = d; l.click();
              }} className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800">JPEG</button>
              <button onClick={() => {
                const canvas = fabricRef.current;
                if (!canvas) return;
                canvas.discardActiveObject(); canvas.renderAll();
                const d = canvas.toDataURL({ format: "webp", quality: 1, multiplier: 2 });
                const l = document.createElement("a"); l.download = "photext-edited.webp"; l.href = d; l.click();
              }} className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800">WebP</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
