"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";

type Tool = "select" | "rect";
type Align = "left" | "center" | "right" | "justify";
type Tab = "text";

const ALL_FONTS = [
  { label: "Arial", value: "Arial", cat: "sans" },
  { label: "Helvetica", value: "Helvetica", cat: "sans" },
  { label: "Verdana", value: "Verdana", cat: "sans" },
  { label: "Tahoma", value: "Tahoma", cat: "sans" },
  { label: "Trebuchet MS", value: "Trebuchet MS", cat: "sans" },
  { label: "Times New Roman", value: "Times New Roman", cat: "serif" },
  { label: "Georgia", value: "Georgia", cat: "serif" },
  { label: "Garamond", value: "Garamond", cat: "serif" },
  { label: "Palatino Linotype", value: "Palatino Linotype", cat: "serif" },
  { label: "Courier New", value: "Courier New", cat: "mono" },
  { label: "Lucida Console", value: "Lucida Console", cat: "mono" },
  { label: "Consolas", value: "Consolas", cat: "mono" },
  { label: "Impact", value: "Impact", cat: "display" },
  { label: "Comic Sans MS", value: "Comic Sans MS", cat: "display" },
  { label: "Papyrus", value: "Papyrus", cat: "display" },
];

const CATS = [
  { key: "all", label: "All Fonts" },
  { key: "sans", label: "Sans Serif" },
  { key: "serif", label: "Serif" },
  { key: "mono", label: "Monospace" },
  { key: "display", label: "Display" },
];

export default function EditorClient() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [ocrCount, setOcrCount] = useState(0);
  const [selectedText, setSelectedText] = useState("");
  const [editText, setEditText] = useState("");
  const [tab] = useState<Tab>("text");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState("#000000");
  const [fontWeight, setFontWeight] = useState(400);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [strikethrough, setStrikethrough] = useState(false);
  const [textAlign, setTextAlign] = useState<Align>("left");
  const [lineHeight, setLineHeight] = useState(1.2);
  const [charSpacing, setCharSpacing] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [shadowEnabled, setShadowEnabled] = useState(false);
  const [shadowBlur, setShadowBlur] = useState(10);
  const [shadowOffset, setShadowOffset] = useState(5);
  const [tool, setTool] = useState<Tool>("select");
  const [isDrawing, setIsDrawing] = useState(false);
  const [fontFilter, setFontFilter] = useState("");
  const [fontCat, setFontCat] = useState("all");
  const [showOriginal, setShowOriginal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  const drawStart = useRef<{ x: number; y: number } | null>(null);
  const drawRectRef = useRef<any>(null);
  const fileRef = useRef<File | null>(null);
  const pendingUpdate = useRef<any>(null);

  const getFabric = useCallback(async () => {
    const fabric = await import("fabric");
    return fabric;
  }, []);

  const getOCR = useCallback(async () => {
    const ocr = await import("@/lib/ocr");
    return ocr;
  }, []);

  const syncFromObj = useCallback((obj: any) => {
    setSelectedText(obj.originalText || obj.text || "");
    setEditText(obj.originalText || obj.text || "");
    setFontFamily(obj.fontFamily || "Arial");
    setFontSize(obj.fontSize || 24);
    setFontColor(obj.fill || "#000000");
    setFontWeight(obj.fontWeight ?? 400);
    setItalic(obj.fontStyle === "italic");
    setUnderline(!!obj.underline);
    setStrikethrough(!!obj.linethrough);
    setTextAlign(obj.textAlign || "left");
    setLineHeight(obj.lineHeight || 1.2);
    setCharSpacing(obj.charSpacing || 0);
    setOpacity((obj.opacity ?? 1) * 100);
    setStrokeWidth(obj.strokeWidth || 0);
    setRotation(obj.angle || 0);
    setPosX(Math.round(obj.left || 0));
    setPosY(Math.round(obj.top || 0));
    if (obj.shadow) {
      setShadowEnabled(true);
      setShadowBlur(obj.shadow.blur || 10);
      setShadowOffset(obj.shadow.offsetX || 5);
    } else {
      setShadowEnabled(false);
    }
  }, []);

  const applyCurrentStyles = useCallback((target: any, text: string, fabric: any) => {
    const { Textbox: FabricTextbox, Shadow: FabricShadow } = fabric;
    const isBbox = target.isBbox;
    if (isBbox) {
      const tb = new FabricTextbox(text, {
        left: (target.left || 0) + 2,
        top: (target.top || 0) + 2,
        width: Math.max(((target.width || 100) * (target.scaleX || 1)) - 4, 50),
        fontSize, fontFamily, fill: fontColor,
        fontWeight, fontStyle: italic ? "italic" : "normal",
        underline, linethrough: strikethrough,
        textAlign, lineHeight, charSpacing,
        opacity: opacity / 100, strokeWidth,
        stroke: strokeWidth > 0 ? fontColor : undefined,
        borderColor: "#6366f1", cornerColor: "#6366f1", cornerSize: 8,
        transparentCorners: false, editable: true,
      });
      if (shadowEnabled) {
        try { tb.set("shadow", new FabricShadow({ color: "rgba(0,0,0,0.3)", blur: shadowBlur, offsetX: shadowOffset, offsetY: shadowOffset })); } catch {}
      }
      return tb;
    }
    target.set("text", text);
    target.set("fontSize", fontSize);
    target.set("fontFamily", fontFamily);
    target.set("fill", fontColor);
    target.set("fontWeight", fontWeight);
    target.set("fontStyle", italic ? "italic" : "normal");
    target.set("underline", underline);
    target.set("linethrough", strikethrough);
    target.set("textAlign", textAlign);
    target.set("lineHeight", lineHeight);
    target.set("charSpacing", charSpacing);
    target.set("opacity", opacity / 100);
    target.set("strokeWidth", strokeWidth);
    target.set("stroke", strokeWidth > 0 ? fontColor : "");
    if (shadowEnabled) {
      try { target.set("shadow", new FabricShadow({ color: "rgba(0,0,0,0.3)", blur: shadowBlur, offsetX: shadowOffset, offsetY: shadowOffset })); } catch {}
    } else {
      target.set("shadow", undefined);
    }
    return target;
  }, [fontSize, fontFamily, fontColor, fontWeight, italic, underline, strikethrough, textAlign, lineHeight, charSpacing, opacity, strokeWidth, shadowEnabled, shadowBlur, shadowOffset]);

  // Process image on file select
  useEffect(() => {
    if (!imageUrl || !fileRef.current || !canvasRef.current) return;
    const file = fileRef.current;
    const url = imageUrl;
    const canvasEl = canvasRef.current;
    let disposed = false;

    (async () => {
      setLoading(true);
      setStatusText("Loading image\u2026");
      try {
        const fabric = await getFabric();
        const { Canvas: FabricCanvas, Rect: FabricRect, Textbox: FabricTextbox, Image: FabricImage } = fabric;

        const parent = canvasEl.parentElement;
        const w = parent?.clientWidth || 800;
        const h = Math.min(w * 0.75, 600);
        canvasEl.width = w;
        canvasEl.height = h;

        const canvas = new FabricCanvas(canvasEl, { width: w, height: h, backgroundColor: "#ffffff", preserveObjectStacking: true });
        fabricRef.current = canvas;

        await new Promise<void>((resolve, reject) => {
          const imgEl = new Image();
          imgEl.crossOrigin = "anonymous";
          imgEl.onload = () => {
            if (disposed) return resolve();
            const s = Math.min(w / imgEl.width, h / imgEl.height) * 0.9;
            const fimg = new FabricImage(imgEl, {
              scaleX: s, scaleY: s,
              left: (w - imgEl.width * s) / 2,
              top: (h - imgEl.height * s) / 2,
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
          const o = e.selected?.[0];
          if (o) syncFromObj(o);
        });
        canvas.on("selection:updated", (e: any) => {
          const o = e.selected?.[0];
          if (o) syncFromObj(o);
        });
        canvas.on("selection:cleared", () => { setSelectedText(""); setEditText(""); });
        canvas.on("object:moving", (e: any) => {
          if (e.target) { setPosX(Math.round(e.target.left || 0)); setPosY(Math.round(e.target.top || 0)); }
        });

        setStatusText("Running OCR\u2026");
        try {
          const { detectText } = await getOCR();
          const result = await detectText(file);
          if (!disposed && result.words.length > 0) {
            setOcrCount(result.words.length);
            for (const word of result.words) {
              const rect = new FabricRect({
                left: word.bbox.x0, top: word.bbox.y0,
                width: Math.max(word.bbox.x1 - word.bbox.x0, 10),
                height: Math.max(word.bbox.y1 - word.bbox.y0, 10),
                fill: "rgba(99,102,241,0.12)", stroke: "#6366f1", strokeWidth: 2,
                strokeUniform: true, selectable: true, evented: true,
              });
              (rect as any).isBbox = true;
              (rect as any).originalText = word.text;
              canvas.add(rect);
            }
            canvas.renderAll();
            if (!disposed) setStatusText(`Detected ${result.words.length} text regions \u2014 click to edit`);
          } else if (!disposed) {
            setOcrCount(0);
            setStatusText('No text detected. Use "Region" tool.');
          }
        } catch {
          if (!disposed) { setOcrCount(0); setStatusText('OCR unavailable. Use "Region" tool.'); }
        }
      } catch (err: any) {
        if (!disposed) setStatusText("Error: " + (err.message || "unknown"));
      }
      if (!disposed) setLoading(false);
    })();

    return () => { disposed = true; };
  }, [imageUrl, getFabric, getOCR, syncFromObj]);

  useEffect(() => {
    return () => {
      if (fabricRef.current) { try { fabricRef.current.dispose(); } catch {} fabricRef.current = null; }
    };
  }, [imageUrl]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (fabricRef.current) { try { fabricRef.current.dispose(); } catch {} fabricRef.current = null; }
    fileRef.current = file;
    setOcrCount(0); setSelectedText(""); setEditText("");
    setImageUrl(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".bmp"] }, maxSize: 10 * 1024 * 1024,
    noClick: !!imageUrl, noKeyboard: !!imageUrl,
  });

  const getPointer = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const el = canvasRef.current;
    const b = el.getBoundingClientRect();
    return { x: (e.clientX - b.left) * (el.width / b.width), y: (e.clientY - b.top) * (el.height / b.height) };
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
      fill: "rgba(99,102,241,0.15)", stroke: "#6366f1", strokeWidth: 2, strokeDashArray: [6, 3],
      selectable: false, evented: false,
    });
    canvas.add(shape);
    drawRectRef.current = shape;
  }, [tool, getPointer, getFabric]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawStart.current || !drawRectRef.current || !fabricRef.current) return;
    const { x, y } = getPointer(e);
    drawRectRef.current.set({
      left: Math.min(drawStart.current.x, x), top: Math.min(drawStart.current.y, y),
      width: Math.abs(x - drawStart.current.x), height: Math.abs(y - drawStart.current.y),
    });
    fabricRef.current.renderAll();
  }, [isDrawing, getPointer]);

  const handleMouseUp = useCallback(() => {
    if (tool !== "rect" || !isDrawing || !drawRectRef.current || !fabricRef.current) return;
    const sel = drawRectRef.current;
    if ((sel.width || 0) < 10 || (sel.height || 0) < 10) {
      fabricRef.current.remove(sel);
    } else {
      sel.set({ strokeDashArray: undefined, selectable: true, evented: true });
      sel.isBbox = true;
      sel.originalText = "[region]";
      fabricRef.current.setActiveObject(sel);
      fabricRef.current.renderAll();
      syncFromObj(sel);
      setOcrCount((c) => c + 1);
    }
    drawRectRef.current = null;
    drawStart.current = null;
    setIsDrawing(false);
    setTool("select");
  }, [tool, isDrawing, syncFromObj]);

  const handleApply = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    const fabric = await getFabric();
    const newObj = applyCurrentStyles(active, editText, fabric);
    if (active.isBbox) {
      canvas.remove(active);
      canvas.add(newObj);
      canvas.setActiveObject(newObj);
    }
    canvas.renderAll();
  }, [editText, applyCurrentStyles, getFabric]);

  const handleAddText = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const fabric = await getFabric();
    const { Textbox: FabricTextbox, Shadow: FabricShadow } = fabric;
    const cx = canvas.width! / 2;
    const cy = canvas.height! / 2;
    const tb = new FabricTextbox("New Text", {
      left: cx - 100, top: cy - 20, width: 200,
      fontSize, fontFamily, fill: fontColor,
      fontWeight, fontStyle: italic ? "italic" : "normal",
      underline, linethrough: strikethrough,
      textAlign, lineHeight, charSpacing,
      opacity: opacity / 100, strokeWidth,
      stroke: strokeWidth > 0 ? fontColor : undefined,
      borderColor: "#6366f1", cornerColor: "#6366f1", cornerSize: 8,
      transparentCorners: false, editable: true,
    });
    if (shadowEnabled) {
      try { tb.set("shadow", new FabricShadow({ color: "rgba(0,0,0,0.3)", blur: shadowBlur, offsetX: shadowOffset, offsetY: shadowOffset })); } catch {}
    }
    canvas.add(tb);
    canvas.setActiveObject(tb);
    canvas.renderAll();
    syncFromObj(tb);
  }, [fontSize, fontFamily, fontColor, fontWeight, italic, underline, strikethrough, textAlign, lineHeight, charSpacing, opacity, strokeWidth, shadowEnabled, shadowBlur, shadowOffset, getFabric, syncFromObj]);

  const handleDelete = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      const wasBbox = active.isBbox === true;
      canvas.remove(active);
      canvas.renderAll();
      setSelectedText(""); setEditText("");
      if (wasBbox) setOcrCount((c) => Math.max(0, c - 1));
    }
  }, []);

  const handleDownload = useCallback((fmt: "png" | "jpeg" | "webp" = "png") => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.discardActiveObject(); canvas.renderAll();
    const d = canvas.toDataURL({ format: fmt, quality: 1, multiplier: 2 });
    const l = document.createElement("a");
    l.download = `photext-edited.${fmt}`; l.href = d; l.click();
  }, []);

  const handleNewImage = useCallback(() => {
    if (fabricRef.current) { try { fabricRef.current.dispose(); } catch {} fabricRef.current = null; }
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null); setOcrCount(0); setSelectedText(""); setEditText(""); setStatusText("");
    drawRectRef.current = null; drawStart.current = null; setIsDrawing(false);
  }, [imageUrl]);

  const filteredFonts = ALL_FONTS.filter((f) => {
    if (fontCat !== "all" && f.cat !== fontCat) return false;
    if (fontFilter && !f.label.toLowerCase().includes(fontFilter.toLowerCase())) return false;
    return true;
  });

  const handleStyleToggle = useCallback((style: "bold" | "italic" | "underline" | "strike") => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active || active.isBbox) return;
    switch (style) {
      case "bold": setFontWeight((w) => w === 700 ? 400 : 700); break;
      case "italic": setItalic((v) => !v); break;
      case "underline": setUnderline((v) => !v); break;
      case "strike": setStrikethrough((v) => !v); break;
    }
  }, []);

  const updateObject = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active || active.isBbox) return;
    const fabric = await getFabric();
    applyCurrentStyles(active, active.text || editText, fabric);
    canvas.renderAll();
  }, [editText, applyCurrentStyles]);

  useEffect(() => {
    if (pendingUpdate.current) clearTimeout(pendingUpdate.current);
    pendingUpdate.current = setTimeout(updateObject, 150);
    return () => { if (pendingUpdate.current) clearTimeout(pendingUpdate.current); };
  }, [fontFamily, fontSize, fontColor, fontWeight, italic, underline, strikethrough, textAlign, lineHeight, charSpacing, opacity, strokeWidth, shadowEnabled, shadowBlur, shadowOffset, rotation, updateObject]);

  const btnClass = (active: boolean) =>
    `p-1.5 rounded text-sm font-medium transition-colors ${active ? "bg-indigo-100 text-indigo-700" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`;
  const sliderClass = "w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-600";
  const rangeClass = "w-full text-xs text-gray-400 text-right";

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </Link>
          <div className="w-px h-5 bg-gray-200" />
          <Link href="/" className="text-sm font-semibold text-gray-800">PhoText</Link>
        </div>
        <div className="flex items-center gap-2">
          {imageUrl && !loading && (
            <>
              {statusText && <span className="text-xs text-gray-400">{statusText}</span>}
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <button onClick={() => handleDownload("png")} className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 border-r border-gray-200">PNG</button>
                <button onClick={() => handleDownload("jpeg")} className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 border-r border-gray-200">JPEG</button>
                <button onClick={() => handleDownload("webp")} className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">WebP</button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {imageUrl ? (
          <div className="flex flex-1 overflow-hidden">
            <div className="w-72 lg:w-80 bg-white border-r border-gray-200 overflow-y-auto shrink-0 flex flex-col">
              <div className="flex border-b border-gray-200">
                {["text"].map((t) => (
                  <button key={t} className="flex-1 py-2.5 text-xs font-semibold text-gray-900 border-b-2 border-indigo-600 uppercase tracking-wide">
                    {t === "text" ? "Text" : t}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Font</label>
                  <div className="flex gap-1">
                    <div className="relative flex-1">
                      <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white appearance-none cursor-pointer">
                        {filteredFonts.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>
                    </div>
                    <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 text-gray-500" title="Identify font">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </button>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {CATS.map((c) => (
                      <button key={c.key} onClick={() => setFontCat(c.key)}
                        className={`px-2 py-0.5 rounded text-[11px] ${fontCat === c.key ? "bg-indigo-100 text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Style</label>
                  <div className="flex gap-1">
                    <button onClick={() => handleStyleToggle("bold")} className={btnClass(fontWeight === 700)} title="Bold"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg></button>
                    <button onClick={() => handleStyleToggle("italic")} className={btnClass(italic)} title="Italic"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg></button>
                    <button onClick={() => handleStyleToggle("underline")} className={btnClass(underline)} title="Underline"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg></button>
                    <button onClick={() => handleStyleToggle("strike")} className={btnClass(strikethrough)} title="Strikethrough"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg></button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Color</label>
                    <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)}
                      className="w-full h-8 rounded border border-gray-300 cursor-pointer p-0.5" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Size: {fontSize}px</label>
                    <input type="range" min="6" max="200" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className={sliderClass} />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Weight: {fontWeight}</label>
                  <input type="range" min="100" max="900" step="100" value={fontWeight} onChange={(e) => setFontWeight(Number(e.target.value))} className={sliderClass} />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Stroke: {strokeWidth}px</label>
                  <input type="range" min="0" max="20" value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} className={sliderClass} />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Spacing: {charSpacing}</label>
                  <input type="range" min="-100" max="500" value={charSpacing} onChange={(e) => setCharSpacing(Number(e.target.value))} className={sliderClass} />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Opacity: {opacity}%</label>
                  <input type="range" min="5" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className={sliderClass} />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Align</label>
                  <div className="flex gap-1">
                    {(["left", "center", "right", "justify"] as Align[]).map((a) => (
                      <button key={a} onClick={() => setTextAlign(a)} className={btnClass(textAlign === a)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          {a === "left" && <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/>}
                          {a === "center" && <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/>}
                          {a === "right" && <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/>}
                          {a === "justify" && <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/>}
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Line Height: {lineHeight.toFixed(1)}</label>
                  <input type="range" min="0.5" max="3" step="0.1" value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} className={sliderClass} />
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <label className="text-xs text-gray-500 mb-1 block">Position</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div><span className="text-[10px] text-gray-400">X</span><input type="number" value={posX} onChange={(e) => setPosX(Number(e.target.value))} className="w-full px-1.5 py-1 border border-gray-300 rounded text-xs" /></div>
                    <div><span className="text-[10px] text-gray-400">Y</span><input type="number" value={posY} onChange={(e) => setPosY(Number(e.target.value))} className="w-full px-1.5 py-1 border border-gray-300 rounded text-xs" /></div>
                    <div><span className="text-[10px] text-gray-400">Rot</span><input type="number" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full px-1.5 py-1 border border-gray-300 rounded text-xs" /></div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={shadowEnabled} onChange={(e) => setShadowEnabled(e.target.checked)} className="rounded" />
                    Shadow
                  </label>
                  {shadowEnabled && (
                    <div className="mt-2 space-y-2 pl-4">
                      <div><label className="text-[11px] text-gray-400">Blur: {shadowBlur}</label><input type="range" min="0" max="50" value={shadowBlur} onChange={(e) => setShadowBlur(Number(e.target.value))} className={sliderClass} /></div>
                      <div><label className="text-[11px] text-gray-400">Offset: {shadowOffset}</label><input type="range" min="0" max="30" value={shadowOffset} onChange={(e) => setShadowOffset(Number(e.target.value))} className={sliderClass} /></div>
                    </div>
                  )}
                </div>

                {selectedText && (
                  <div className="border-t border-gray-100 pt-3">
                    <label className="text-xs text-gray-500 mb-1 block">Text</label>
                    <input value={editText} onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs mb-2" />
                    <div className="text-[11px] text-gray-400 mb-2">
                      Original: <span className="text-gray-600">{selectedText}</span>
                    </div>
                    <button onClick={handleApply}
                      className="w-full py-2 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 transition-colors">
                      Replace Text
                    </button>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button onClick={handleAddText}
                    className="flex-1 py-2 border-2 border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
                    + Add Text
                  </button>
                  <button onClick={handleDelete}
                    className="py-2 px-3 border border-gray-300 rounded text-xs text-gray-500 hover:text-red-600 hover:border-red-300 transition-colors" title="Delete selected">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
                    <button onClick={() => setTool("select")}
                      className={`flex-1 py-1.5 rounded text-xs flex items-center justify-center gap-1 transition-colors ${tool === "select" ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
                      Select
                    </button>
                    <button onClick={() => setTool("rect")}
                      className={`flex-1 py-1.5 rounded text-xs flex items-center justify-center gap-1 transition-colors ${tool === "rect" ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                      Region
                    </button>
                  </div>
                </div>

                <button onClick={handleNewImage}
                  className="w-full py-2 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  New Image
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center bg-gray-100 p-4 overflow-hidden">
              <div className="relative max-w-full max-h-full">
                {loading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
                    <div className="text-center">
                      <svg className="w-6 h-6 animate-spin text-indigo-600 mx-auto" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      <p className="mt-2 text-xs text-gray-500">{statusText}</p>
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef}
                  className="max-w-full max-h-full rounded-lg shadow-sm"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  style={{ cursor: tool === "rect" ? "crosshair" : "default" }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div {...getRootProps()}
              className="w-full max-w-lg h-80 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 transition-colors bg-white">
              <input {...getInputProps()} />
              <svg className="w-12 h-12 text-gray-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
              <p className="text-base text-gray-500 mb-1">{isDragActive ? "Drop image here" : "Drag & drop an image here"}</p>
              <p className="text-xs text-gray-400 mb-3">or click to browse</p>
              <p className="text-[11px] text-gray-300">JPG, PNG, JPEG, WEBP, BMP</p>
            </div>
          </div>
        )}
      </div>

      {imageUrl && !loading && statusText && (
        <div className="bg-gray-100 border-t border-gray-200 px-4 py-1.5 text-xs text-gray-500 shrink-0">{statusText}</div>
      )}
    </div>
  );
}
