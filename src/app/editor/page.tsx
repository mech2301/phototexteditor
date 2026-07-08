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
import { Canvas, Textbox } from "fabric";

export default function EditorPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [ocrCount, setOcrCount] = useState(0);
  const [selectedText, setSelectedText] = useState("");
  const [editText, setEditText] = useState("");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(20);
  const [fontColor, setFontColor] = useState("#000000");
  const [hasImage, setHasImage] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      fabricRef.current?.dispose();
    };
  }, [imageUrl]);

  const loadImage = useCallback(async (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setImageFile(file);
    setHasImage(false);
    setCanvasReady(false);
    setOcrCount(0);
    setSelectedText("");

    if (!canvasRef.current) return;

    setStatusText("Loading image...");
    try {
      const { canvas, scale } = await initCanvas(canvasRef.current, url);
      fabricRef.current = canvas;
      setHasImage(true);
      setCanvasReady(true);

      canvas.on("selection:created", (e: any) => {
        const obj = e.selected?.[0];
        const originalText = (obj as any)?.originalText;
        if (originalText) {
          setSelectedText(originalText);
          setEditText(originalText);
        } else if ((obj as any)?.isType?.("Textbox")) {
          setSelectedText(obj.text || "");
          setEditText(obj.text || "");
        }
      });

      canvas.on("selection:updated", (e: any) => {
        const obj = e.selected?.[0];
        const originalText = (obj as any)?.originalText;
        if (originalText) {
          setSelectedText(originalText);
          setEditText(originalText);
        } else if ((obj as any)?.isType?.("Textbox")) {
          setSelectedText(obj.text || "");
          setEditText(obj.text || "");
        }
      });

      canvas.on("selection:cleared", () => {
        setSelectedText("");
        setEditText("");
      });

      setStatusText("Running OCR text detection...");
      setLoading(true);

      let result: OCRResult | null = null;
      try {
        result = await detectText(file);
      } catch (err) {
        console.warn("OCR failed, continuing without detection:", err);
      }

      if (result && result.words.length > 0) {
        setOcrCount(result.words.length);
        drawBoundingBoxes(canvas, result.words, scale);
        canvas.renderAll();
        setStatusText(`Detected ${result.words.length} text regions — click one to edit`);
      } else {
        setOcrCount(0);
        setStatusText("No text detected. Use 'Add Text' to add text manually.");
      }
    } catch (err) {
      console.error("Failed to load image:", err);
      setStatusText("Failed to load image. Try another file.");
    }
    setLoading(false);
  }, []);

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

    replaceActiveObject(canvas, editText, { fontSize, fontFamily, fill: fontColor });
  };

  const handleAddText = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const centerX = canvas.width! / 2;
    const centerY = canvas.height! / 2;
    addTextBoxToCanvas(canvas, "Your Text", centerX - 100, centerY - 20, {
      fontSize,
      fontFamily,
      fill: fontColor,
    });
    setSelectedText("");
    setEditText("Your Text");
  };

  const handleDeleteSelected = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      canvas.remove(active);
      canvas.renderAll();
      setSelectedText("");
    }
  };

  const handleNewImage = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    fabricRef.current?.dispose();
    setImageUrl(null);
    setImageFile(null);
    setHasImage(false);
    setCanvasReady(false);
    setOcrCount(0);
    setSelectedText("");
    setStatusText("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-border px-4 py-3 flex items-center justify-between shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex items-center gap-2">
          {hasImage && (
            <button
              onClick={handleNewImage}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-gray-50"
            >
              <Upload className="w-4 h-4" /> New Image
            </button>
          )}
          {hasImage && (
            <button
              onClick={() => handleDownload("png")}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              <Download className="w-4 h-4" /> Download
            </button>
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
                    <p className="mt-2 text-sm text-gray-600">{statusText}</p>
                  </div>
                </div>
              )}
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Edit</h3>
            {ocrCount > 0 && (
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                {ocrCount} detected
              </span>
            )}
          </div>

          {hasImage && (
            <button
              onClick={handleAddText}
              className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Text
            </button>
          )}

          {selectedText !== "" ? (
            <>
              <div>
                <label className="text-xs text-gray-500">New Text</label>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm"
                  placeholder="Enter new text..."
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
                className="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
              >
                Apply
              </button>
            </>
          ) : (
            hasImage && (
              <p className="text-sm text-gray-400">
                Click on text in the image or use{" "}
                <strong>&quot;Add Text&quot;</strong> above to add new text.
              </p>
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
