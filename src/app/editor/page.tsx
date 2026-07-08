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
import { detectText, type OCRResult } from "@/lib/ocr";
import {
  initCanvas,
  drawBoundingBoxes,
  downloadCanvas,
  replaceActiveObject,
  addTextBoxToCanvas,
} from "@/lib/canvas";
import { Canvas, Rect } from "fabric";

type Tool = "select" | "rect";

export default function EditorPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [ocrCount, setOcrCount] = useState(0);
  const [selectedText, setSelectedText] = useState("");
  const [editText, setEditText] = useState("");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(20);
  const [fontColor, setFontColor] = useState("#000000");
  const [hasImage, setHasImage] = useState(false);
  const [tool, setTool] = useState<Tool>("select");
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const drawStart = useRef<{ x: number; y: number } | null>(null);
  const drawRectRef = useRef<Rect | null>(null);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      fabricRef.current?.dispose();
    };
  }, [imageUrl]);

  const setupCanvasEvents = useCallback((canvas: Canvas) => {
    canvas.on("selection:created", (e: any) => {
      const obj = e.selected?.[0];
      const originalText = (obj as any)?.originalText;
      if (originalText !== undefined) {
        setSelectedText(originalText);
        setEditText(originalText);
      } else if (
        obj?.constructor?.name === "Textbox" ||
        (obj as any)?.isType?.("Textbox")
      ) {
        setSelectedText(obj.text || "");
        setEditText(obj.text || "");
      }
    });

    canvas.on("selection:updated", (e: any) => {
      const obj = e.selected?.[0];
      const originalText = (obj as any)?.originalText;
      if (originalText !== undefined) {
        setSelectedText(originalText);
        setEditText(originalText);
      } else if (
        obj?.constructor?.name === "Textbox" ||
        (obj as any)?.isType?.("Textbox")
      ) {
        setSelectedText(obj.text || "");
        setEditText(obj.text || "");
      }
    });

    canvas.on("selection:cleared", () => {
      setSelectedText("");
      setEditText("");
    });
  }, []);

  const loadImage = useCallback(
    async (file: File) => {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setHasImage(false);
      setOcrCount(0);
      setSelectedText("");
      setLoading(true);
      setStatusText("Loading image...");

      if (!canvasRef.current) return;

      try {
        const { canvas, scale } = await initCanvas(canvasRef.current, url);
        fabricRef.current = canvas;
        setHasImage(true);
        setupCanvasEvents(canvas);

        setStatusText("Running OCR text detection...");
        let result: OCRResult | null = null;
        try {
          result = await detectText(file);
        } catch (err: any) {
          console.warn("OCR failed:", err?.message || err);
        }

        if (result && result.words.length > 0) {
          setOcrCount(result.words.length);
          drawBoundingBoxes(canvas, result.words, scale);
          canvas.renderAll();
          setStatusText(
            `Detected ${result.words.length} text regions — click a blue box to edit`
          );
        } else {
          setOcrCount(0);
          setStatusText(
            'No text detected. Use "Select Region" tool to mark text manually, then click the box to edit.'
          );
        }
      } catch (err: any) {
        console.error("Failed to load image:", err);
        setStatusText("Failed to load image. Try another file.");
      }
      setLoading(false);
    },
    [setupCanvasEvents]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) loadImage(file);
    },
    [loadImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".bmp"] },
    maxSize: 10 * 1024 * 1024,
    noClick: hasImage,
    noKeyboard: hasImage,
  });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (tool !== "rect" || !fabricRef.current || !canvasRef.current) return;
      const canvas = fabricRef.current;
      const el = canvasRef.current;
      const b = el.getBoundingClientRect();
      const x = (e.clientX - b.left) * (el.width / b.width);
      const y = (e.clientY - b.top) * (el.height / b.height);
      drawStart.current = { x, y };
      setIsDrawing(true);

      const shape = new Rect({
        left: x,
        top: y,
        width: 1,
        height: 1,
        fill: "rgba(99, 102, 241, 0.15)",
        stroke: "#6366f1",
        strokeWidth: 2,
        strokeDashArray: [6, 3] as number[],
        selectable: false,
        evented: false,
      });
      canvas.add(shape);
      drawRectRef.current = shape;
      canvas.renderAll();
    },
    [tool]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !drawStart.current || !drawRectRef.current || !fabricRef.current || !canvasRef.current) return;
      const canvas = fabricRef.current;
      const el = canvasRef.current;
      const r = el.getBoundingClientRect();
      const pointer = {
        x: (e.clientX - r.left) * (el.width / r.width),
        y: (e.clientY - r.top) * (el.height / r.height),
      };

      const x = Math.min(drawStart.current.x, pointer.x);
      const y = Math.min(drawStart.current.y, pointer.y);
      const w = Math.abs(pointer.x - drawStart.current.x);
      const h = Math.abs(pointer.y - drawStart.current.y);

      drawRectRef.current.set({ left: x, top: y, width: w, height: h });
      canvas.renderAll();
    },
    [isDrawing]
  );

  const handleMouseUp = useCallback(() => {
    if (tool !== "rect" || !isDrawing || !drawRectRef.current || !fabricRef.current) return;
    const canvas = fabricRef.current;
    const sel = drawRectRef.current;

    if (sel.width! < 10 || sel.height! < 10) {
      canvas.remove(sel);
      canvas.renderAll();
    } else {
      sel.set({ strokeDashArray: undefined, selectable: true, evented: true });
      (sel as any).isBbox = true;
      (sel as any).originalText = "[selected region]";
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

  const handleDownload = async (format: "png" | "jpeg" | "webp") => {
    if (fabricRef.current) {
      downloadCanvas(fabricRef.current, format);
    }
  };

  const handleApplyEdit = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;

    replaceActiveObject(canvas, editText, {
      fontSize,
      fontFamily,
      fill: fontColor,
    });
  };

  const handleAddText = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const cx = canvas.width! / 2;
    const cy = canvas.height! / 2;
    const tb = addTextBoxToCanvas(canvas, "New Text", cx - 100, cy - 20, {
      fontSize,
      fontFamily,
      fill: fontColor,
    });
    setSelectedText("New Text");
    setEditText("New Text");
  };

  const handleDeleteSelected = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      const isBbox = (active as any).isBbox === true;
      canvas.remove(active);
      canvas.renderAll();
      setSelectedText("");
      if (isBbox) setOcrCount((c) => Math.max(0, c - 1));
    }
  };

  const handleNewImage = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    fabricRef.current?.dispose();
    setImageUrl(null);
    setHasImage(false);
    setOcrCount(0);
    setSelectedText("");
    setStatusText("");
    drawRectRef.current = null;
    drawStart.current = null;
    setIsDrawing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-border px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          {hasImage && (
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setTool("select")}
                className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
                  tool === "select"
                    ? "bg-white shadow-sm text-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Select & edit text"
              >
                <MousePointerClick className="w-3.5 h-3.5" /> Select
              </button>
              <button
                onClick={() => setTool("rect")}
                className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
                  tool === "rect"
                    ? "bg-white shadow-sm text-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Draw region over text"
              >
                <Square className="w-3.5 h-3.5" /> Region
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasImage && (
            <>
              <button
                onClick={handleNewImage}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-gray-50"
              >
                <Upload className="w-4 h-4" /> New Image
              </button>
              <button
                onClick={() => handleDownload("png")}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover"
              >
                <Download className="w-4 h-4" /> Download
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 min-h-0">
        <div className="bg-white rounded-xl border border-border p-4 min-h-[400px] flex items-center justify-center overflow-hidden">
          {!hasImage ? (
            <div
              {...getRootProps()}
              className="w-full h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition-colors"
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-600">
                {isDragActive
                  ? "Drop image here..."
                  : "Drag and drop an image here or"}
              </p>
              <p className="mt-2 px-6 py-2 bg-primary text-white rounded-lg text-sm">
                Open Image
              </p>
              <p className="mt-2 text-xs text-gray-400">
                JPG, PNG, JPEG, WEBP, BMP
              </p>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {loading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    <p className="mt-2 text-sm text-gray-600 px-4">
                      {statusText}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      First-time OCR downloads ~4MB of language data
                    </p>
                  </div>
                </div>
              )}
              <canvas
                ref={canvasRef}
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
            {ocrCount > 0 && (
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                {ocrCount} selected
              </span>
            )}
          </div>

          {hasImage && (
            <div className="flex gap-2">
              <button
                onClick={handleAddText}
                className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Text
              </button>
            </div>
          )}

          {selectedText !== "" ? (
            <>
              <div>
                <label className="text-xs text-gray-500">New Text</label>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm"
                  placeholder="Type replacement text..."
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Font</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm"
                >
                  <option>Arial</option>
                  <option>Times New Roman</option>
                  <option>Courier New</option>
                  <option>Georgia</option>
                  <option>Verdana</option>
                  <option>Impact</option>
                  <option>Helvetica</option>
                  <option>Trebuchet MS</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">
                  Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="8"
                  max="120"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Color</label>
                <input
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="w-full mt-1 h-10 rounded border border-border cursor-pointer"
                />
              </div>
              <button
                onClick={handleApplyEdit}
                className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm"
              >
                Replace Text
              </button>
            </>
          ) : (
            hasImage && (
              <div className="text-sm text-gray-400 space-y-2">
                <p>
                  <strong>To edit text in the image:</strong>
                </p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Click a blue box (auto-detected text)</li>
                  <li>
                    Or click <strong>&quot;Region&quot;</strong> tool above, then
                    drag over the text
                  </li>
                  <li>Type replacement text and click Apply</li>
                </ol>
              </div>
            )
          )}

          {hasImage && (
            <div className="pt-4 border-t border-border">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Tools
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteSelected}
                  className="p-2 rounded-lg border border-border hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-600 transition-colors"
                  title="Delete selected"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {statusText && (
            <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 leading-relaxed">
              {statusText}
            </div>
          )}

          {hasImage && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleDownload("png")}
                className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                PNG
              </button>
              <button
                onClick={() => handleDownload("jpeg")}
                className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                JPEG
              </button>
              <button
                onClick={() => handleDownload("webp")}
                className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                WebP
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
