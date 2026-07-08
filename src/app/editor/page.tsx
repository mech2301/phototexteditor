"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  ArrowLeft,
  Download,
  Upload,
  Loader2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { detectText, type OCRResult } from "@/lib/ocr";
import { initCanvas, drawBoundingBoxes, downloadCanvas } from "@/lib/canvas";
import { Canvas, Textbox } from "fabric";

export default function EditorPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [editText, setEditText] = useState("");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(20);
  const [fontColor, setFontColor] = useState("#000000");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setLoading(true);
    setStatusText("Running OCR text detection...");

    try {
      const result = await detectText(file);
      setOcrResult(result);
      setStatusText(`Found ${result.words.length} text regions`);

      if (canvasRef.current && url) {
        const canvas = await initCanvas(canvasRef.current, url, 800, 600);
        fabricCanvasRef.current = canvas;

        const img = new Image();
        img.onload = () => {
          const sx = 800 / img.width;
          const sy = 600 / img.height;
          const s = Math.min(sx, sy) * 0.9;
          drawBoundingBoxes(canvas, result.words, s, s);
          canvas.renderAll();

          canvas.on("selection:created", (e: any) => {
            const obj = e.selected?.[0];
            if ((obj as any)?.data?.originalText) {
              const t = (obj as any).data.originalText as string;
              setSelectedText(t);
              setEditText(t);
            }
          });
        };
        img.src = url;
      }
    } catch (err) {
      setStatusText("OCR failed. Try a different image.");
      console.error(err);
    }
    setLoading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".bmp"] },
    maxSize: 10 * 1024 * 1024,
  });

  const handleDownload = async (format: "png" | "jpeg" | "webp") => {
    if (fabricCanvasRef.current) {
      await downloadCanvas(fabricCanvasRef.current, format);
    }
  };

  const handleApplyEdit = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      const textbox = new Textbox(editText, {
        left: (active.left || 0) + 4,
        top: (active.top || 0) + 4,
        width: (active.width || 100) * (active.scaleX || 1) - 8,
        fontSize,
        fontFamily,
        fill: fontColor,
        borderColor: "#6366f1",
        cornerColor: "#6366f1",
        cornerSize: 8,
        transparentCorners: false,
      });
      canvas.remove(active);
      canvas.add(textbox);
      canvas.setActiveObject(textbox);
      canvas.renderAll();
    }
    setSelectedText("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-border px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload("png")}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover"
          >
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="bg-white rounded-xl border border-border p-4 min-h-[500px]">
          {!imageUrl ? (
            <div
              {...getRootProps()}
              className="w-full h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition-colors"
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
                JPG, PNG, JPEG, WEBP, PDF
              </p>
            </div>
          ) : (
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    <p className="mt-2 text-sm text-gray-600">{statusText}</p>
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} className="w-full rounded-lg" />
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-border p-4 space-y-4">
          <h3 className="font-semibold text-gray-900">Edit</h3>

          {selectedText ? (
            <>
              <div>
                <label className="text-xs text-gray-500">Original Text</label>
                <p className="text-sm text-gray-700 mt-1">{selectedText}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">New Text</label>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm"
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
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Font Size</label>
                <input
                  type="range"
                  min="8"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full mt-1"
                />
                <span className="text-xs text-gray-400">{fontSize}px</span>
              </div>
              <div>
                <label className="text-xs text-gray-500">Color</label>
                <input
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="w-full mt-1 h-10 rounded border border-border"
                />
              </div>
              <button
                onClick={handleApplyEdit}
                className="w-full py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover"
              >
                Apply
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-400">
              Click on detected text in the image to edit it.
            </p>
          )}

          <div className="pt-4 border-t border-border">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Tools
            </h4>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg border border-border hover:bg-gray-50 text-gray-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {statusText && (
            <div className="text-xs text-gray-400 bg-gray-50 rounded p-2">
              {statusText}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => handleDownload("png")}
              className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              PNG
            </button>
            <button
              onClick={() => handleDownload("jpeg")}
              className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              JPEG
            </button>
            <button
              onClick={() => handleDownload("webp")}
              className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              WebP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
