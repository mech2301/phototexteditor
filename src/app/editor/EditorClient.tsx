"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
} from "@mui/material";
import {
  ArrowBackIos,
  Download,
  CloudUpload,
} from "@mui/icons-material";
import Link from "next/link";
import LeftPanel from "@/components/editor/LeftPanel";
import CanvasArea from "@/components/editor/CanvasArea";
import TextProperties from "@/components/editor/TextProperties";

export default function EditorClient() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [activeTab, setActiveTab] = useState("text");
  const [selectedText, setSelectedText] = useState("");
  const [editText, setEditText] = useState("");
  const [tool, setTool] = useState("select");
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [filename, setFilename] = useState("");

  // Text properties
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState("#000000");
  const [fontWeight, setFontWeight] = useState(400);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [strikethrough, setStrikethrough] = useState(false);
  const [textAlign, setTextAlign] = useState("left");
  const [lineHeight, setLineHeight] = useState(1.2);
  const [charSpacing, setCharSpacing] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [skewX, setSkewX] = useState(0);
  const [shadowEnabled, setShadowEnabled] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  const drawStart = useRef<{ x: number; y: number } | null>(null);
  const drawRectRef = useRef<any>(null);
  const fileRef = useRef<File | null>(null);
  const imageInfoRef = useRef({ scale: 1, left: 0, top: 0 });

  const getFabric = useCallback(async () => {
    const fabric = await import("fabric");
    return fabric;
  }, []);

  const getOCR = useCallback(async () => {
    const ocr = await import("@/lib/ocr");
    return ocr;
  }, []);

  const sampleTextColor = useCallback(async (obj: any, imgUrl: string): Promise<string> => {
    if (!obj.isBbox || !imgUrl) return "#000000";
    const { scale: sc, left: imgOffX, top: imgOffY } = imageInfoRef.current;
    const origX = Math.round((obj.left - imgOffX) / sc);
    const origY = Math.round((obj.top - imgOffY) / sc);
    const origW = Math.max(Math.round((obj.width * obj.scaleX) / sc), 4);
    const origH = Math.max(Math.round((obj.height * obj.scaleY) / sc), 4);
    if (origW < 4 || origH < 4) return "#000000";
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image(); i.onload = () => resolve(i); i.onerror = reject; i.src = imgUrl;
    });
    const off = document.createElement("canvas");
    off.width = origW; off.height = origH;
    const octx = off.getContext("2d")!;
    octx.drawImage(img, origX, origY, origW, origH, 0, 0, origW, origH);
    const d = octx.getImageData(0, 0, origW, origH).data;
    const total = d.length / 4;
    let rSum = 0, gSum = 0, bSum = 0;
    for (let i = 0; i < d.length; i += 4) { rSum += d[i]; gSum += d[i+1]; bSum += d[i+2]; }
    const bgLum = (0.299 * rSum + 0.587 * gSum + 0.114 * bSum) / total;
    if (bgLum > 140) {
      let dr = 0, dg = 0, db = 0, dn = 0;
      for (let i = 0; i < d.length; i += 4) {
        const lum = 0.299 * d[i] + 0.587 * d[i+1] + 0.114 * d[i+2];
        if (lum < bgLum - 30) { dr += d[i]; dg += d[i+1]; db += d[i+2]; dn++; }
      }
      if (dn < 5) return "#000000";
      return "#" + [dr, dg, db].map(v => Math.round(v/dn).toString(16).padStart(2,"0")).join("");
    } else {
      let lr = 0, lg = 0, lb = 0, ln = 0;
      for (let i = 0; i < d.length; i += 4) {
        const lum = 0.299 * d[i] + 0.587 * d[i+1] + 0.114 * d[i+2];
        if (lum > bgLum + 30) { lr += d[i]; lg += d[i+1]; lb += d[i+2]; ln++; }
      }
      if (ln < 5) return "#FFFFFF";
      return "#" + [lr, lg, lb].map(v => Math.round(v/ln).toString(16).padStart(2,"0")).join("");
    }
  }, []);

  const estimateFontWeight = useCallback(async (obj: any, imgUrl: string): Promise<number> => {
    if (!obj.isBbox || !imgUrl) return 400;
    const { scale: sc, left: imgOffX, top: imgOffY } = imageInfoRef.current;
    const origX = Math.round((obj.left - imgOffX) / sc);
    const origY = Math.round((obj.top - imgOffY) / sc);
    const origW = Math.max(Math.round((obj.width * obj.scaleX) / sc), 4);
    const origH = Math.max(Math.round((obj.height * obj.scaleY) / sc), 4);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image(); i.onload = () => resolve(i); i.onerror = reject; i.src = imgUrl;
    });
    const off = document.createElement("canvas");
    off.width = origW; off.height = origH;
    const octx = off.getContext("2d")!;
    octx.drawImage(img, origX, origY, origW, origH, 0, 0, origW, origH);
    const d = octx.getImageData(0, 0, origW, origH).data;
    let lumSum = 0;
    for (let i = 0; i < d.length; i += 4) {
      lumSum += 0.299 * d[i] + 0.587 * d[i+1] + 0.114 * d[i+2];
    }
    const bgLum = lumSum / (d.length / 4);
    let textPixels = 0;
    const thr = 30;
    for (let i = 0; i < d.length; i += 4) {
      const lum = 0.299 * d[i] + 0.587 * d[i+1] + 0.114 * d[i+2];
      if (bgLum > 140 ? lum < bgLum - thr : lum > bgLum + thr) textPixels++;
    }
    const ratio = textPixels / (origW * origH);
    return ratio > 0.45 ? 700 : ratio > 0.30 ? 500 : 400;
  }, []);

  const syncFromObj = useCallback(async (obj: any) => {
    const origText = obj.originalText || obj.text || "";
    setSelectedText(origText);
    setEditText(origText);

    let detectedFamily = "Arial";
    let detectedSize = Math.round((obj.height || 24) * 1.4) || 24;
    let detectedColor = "#000000";
    let detectedWeight = 400;

    if (obj.isBbox && imageUrl) {
      try { detectedColor = await sampleTextColor(obj, imageUrl); setFontColor(detectedColor); } catch { setFontColor("#000000"); }
      try { detectedWeight = await estimateFontWeight(obj, imageUrl); setFontWeight(detectedWeight); } catch { setFontWeight(400); }
      try {
        const { getGoogleFonts } = await import("@/lib/fonts");
        const fonts = await getGoogleFonts();
        const sans = fonts.find(f => f.category === "sans-serif");
        if (sans) detectedFamily = sans.family;
      } catch {}
      // Use a CSS font-family stack so the browser falls back to a system
      // sans-serif if the detected Google Font is not installed on the device.
      setFontFamily(detectedFamily + ", Arial, Helvetica, sans-serif");
      setFontSize(detectedSize);
    } else {
      detectedColor = obj.fill || "#000000";
      detectedWeight = obj.fontWeight ?? 400;
      detectedFamily = obj.fontFamily || "Arial";
      detectedSize = obj.fontSize || Math.round((obj.height || 24) * 1.4) || 24;
      setFontColor(detectedColor);
      setFontWeight(detectedWeight);
      setFontFamily(detectedFamily);
      setFontSize(detectedSize);
    }

    // Store all analyzed properties on the Fabric object for cloning in handleApply
    obj._fontFamily = detectedFamily;
    obj._fontSize = detectedSize;
    obj._fontColor = detectedColor;
    obj._fontWeight = detectedWeight;

    setItalic(obj.fontStyle === "italic");
    setUnderline(!!obj.underline);
    setStrikethrough(!!obj.linethrough);
    setTextAlign(obj.textAlign || "left");
    setLineHeight(obj.lineHeight || 1.2);
    setCharSpacing(obj.charSpacing || 0);
    setOpacity((obj.opacity ?? 1) * 100);
    // Bbox strokeWidth is a UI overlay border (2px), NOT a text style.
    // Never clone it — the original text in the image has no stroke.
    setStrokeWidth(obj.isBbox ? 0 : (obj.strokeWidth || 0));
    setRotation(obj.angle || 0);
    setSkewX(obj.skewX || 0);
    if (obj.shadow) {
      setShadowEnabled(true);
    } else {
      setShadowEnabled(false);
    }
  }, [imageUrl, sampleTextColor]);

  // Process image
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
        const { Canvas: FabricCanvas, Rect: FabricRect, Image: FabricImage } = fabric;

        const parent = canvasEl.parentElement;
        const w = parent?.clientWidth || 800;

        // Load image first to get its natural dimensions
        const imgEl = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("Failed to load image"));
          img.src = url;
        });
        if (disposed) return;

        // Scale to fill width, scroll vertically if needed
        const viewH = window.innerHeight;
        const s = (w / imgEl.width) * 0.95;
        const imgDisplayH = imgEl.height * s;
        const minH = Math.max(viewH - 56 - 48, 400);
        const canvasH = Math.max(Math.ceil(imgDisplayH) + 40, minH);

        canvasEl.width = w;
        canvasEl.height = canvasH;

        const canvas = new FabricCanvas(canvasEl, {
          width: w, height: canvasH, backgroundColor: "#ffffff", preserveObjectStacking: true,
        });
        fabricRef.current = canvas;

        imageInfoRef.current = {
          scale: s,
          left: (w - imgEl.width * s) / 2,
          top: (canvasH - imgEl.height * s) / 2,
        };
        const fimg = new FabricImage(imgEl, {
          scaleX: s, scaleY: s,
          left: (w - imgEl.width * s) / 2,
          top: (canvasH - imgEl.height * s) / 2,
        });
        canvas.clear();
        canvas.add(fimg);
        canvas.renderAll();

        canvas.on("selection:created", (e: any) => {
          const o = e.selected?.[0];
          if (o) syncFromObj(o);
        });
        canvas.on("selection:updated", (e: any) => {
          const o = e.selected?.[0];
          if (o) syncFromObj(o);
        });
        canvas.on("selection:cleared", () => {
          setSelectedText("");
          setEditText("");
        });

        setStatusText("Running OCR\u2026");
        try {
          const { detectText } = await getOCR();
          const result = await detectText(file);
          if (!disposed && result.words.length > 0) {
            const { scale: sc, left: imgOffX, top: imgOffY } = imageInfoRef.current;
            for (const word of result.words) {
              const rect = new FabricRect({
                left: word.bbox.x0 * sc + imgOffX, top: word.bbox.y0 * sc + imgOffY,
                width: Math.max((word.bbox.x1 - word.bbox.x0) * sc, 10),
                height: Math.max((word.bbox.y1 - word.bbox.y0) * sc, 10),
                fill: "rgba(99,102,241,0.12)", stroke: "#6366f1", strokeWidth: 2,
                strokeUniform: true, selectable: true, evented: true,
              });
              (rect as any).isBbox = true;
              (rect as any).originalText = word.text;
              canvas.add(rect);
            }
            canvas.renderAll();
            if (!disposed) setStatusText(`Detected ${result.words.length} text regions`);
          } else if (!disposed) {
            setStatusText('No text detected. Use Mark Tool.');
          }
        } catch {
          if (!disposed) setStatusText('OCR unavailable. Use Mark Tool.');
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
    setFilename(file.name);
    setSelectedText("");
    setEditText("");
    setImageUrl(URL.createObjectURL(file));
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
    if (!fabricRef.current) return;
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
  }, [getPointer, getFabric]);

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
    if (!isDrawing || !drawRectRef.current || !fabricRef.current) return;
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
    }
    drawRectRef.current = null;
    drawStart.current = null;
    setIsDrawing(false);
  }, [isDrawing, syncFromObj]);

  const handleApply = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    const fabric = await getFabric();
    const { Textbox: FabricTextbox, Shadow: FabricShadow, Rect: FabricRect } = fabric;

    if (active.isBbox) {
      const bboxLeft = Math.round(active.left || 0);
      const bboxTop = Math.round(active.top || 0);
      const bboxW = Math.round((active.width || 1) * (active.scaleX || 1));
      const bboxH = Math.round((active.height || 1) * (active.scaleY || 1));

      // Background-colored rect to cover old text (sample from original image)
      if (imageUrl) {
        try {
          const { scale: sc, left: imgOffX, top: imgOffY } = imageInfoRef.current;
          const origX = Math.max(Math.round((bboxLeft - imgOffX) / sc) - 1, 0);
          const origY = Math.max(Math.round((bboxTop - imgOffY) / sc) - 1, 0);
          const origW = Math.max(Math.round(bboxW / sc) + 2, 4);
          const origH = Math.max(Math.round(bboxH / sc) + 2, 4);
          const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const i = new Image(); i.onload = () => resolve(i); i.onerror = reject; i.src = imageUrl!;
          });
          const off = document.createElement("canvas");
          off.width = origW; off.height = origH;
          const octx = off.getContext("2d")!;
          octx.drawImage(img, origX, origY, origW, origH, 0, 0, origW, origH);
          const d = octx.getImageData(0, 0, origW, origH).data;
          let r = 0, g = 0, b = 0, n = 0;
          for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i+1]; b += d[i+2]; n++; }
          const bgColor = "#" + [r, g, b].map(v => Math.round(v/n).toString(16).padStart(2,"0")).join("");
          const cover = new FabricRect({
            left: bboxLeft - 1, top: bboxTop - 1, width: bboxW + 2, height: bboxH + 2,
            fill: bgColor, selectable: false, evented: false,
          });
          canvas.add(cover);
          canvas.sendToBack(cover);
        } catch (e) { console.warn("Cover rect failed:", e); }
      }

      // Auto-fit: shrink fontSize if replacement text overflows bbox width
      let fittedSize = fontSize;
      const tempCtx = document.createElement("canvas").getContext("2d")!;
      const weightStr = fontWeight >= 700 ? "bold" : fontWeight >= 500 ? "500" : "normal";
      tempCtx.font = `${weightStr} ${fittedSize}px ${fontFamily}`;
      let textW = tempCtx.measureText(editText || " ").width;
      while (textW > Math.max(bboxW - 4, 1) && fittedSize > 8) {
        fittedSize -= 1;
        tempCtx.font = `${weightStr} ${fittedSize}px ${fontFamily}`;
        textW = tempCtx.measureText(editText || " ").width;
      }

      // RC2: shift vertical position so the visual text fills the bbox
      // Fabric renders text with baseline at ~top + fontSize, pushing the
      // cap-height line down.  Offset by (fontSize - bboxH) / 2 so the
      // visible glyphs sit inside the original bbox.
      const vertOffset = Math.round((fittedSize - bboxH) / 2);

      const tb = new FabricTextbox(editText, {
        // Position and size — cloned from bbox native geometry
        left: bboxLeft,
        top: bboxTop + vertOffset,
        width: Math.max(bboxW, 10),
        // RC3: prevent Fabric from overriding narrow widths
        minWidth: 0,
        // Font properties — from React state (set by syncFromObj + user edits)
        fontSize: fittedSize, fontFamily, fill: fontColor, padding: 0,
        fontWeight, fontStyle: italic ? "italic" : "normal",
        underline, linethrough: strikethrough,
        // RC4: center text within the bbox for a natural single-word look
        textAlign: "center", charSpacing,
        // RC5: clone origin reference points from the bbox object
        originX: active.originX || "left",
        originY: active.originY || "top",
        // Cloned from the original bbox object's native Fabric properties
        angle: Math.round(active.angle || 0),
        scaleX: active.scaleX ?? 1,
        scaleY: active.scaleY ?? 1,
        flipX: !!active.flipX,
        flipY: !!active.flipY,
        skewX: active.skewX ?? 0,
        skewY: active.skewY ?? 0,
        opacity: active.opacity ?? 1,
        strokeWidth, stroke: strokeWidth > 0 ? fontColor : undefined,
        lineHeight: 1,
        borderColor: "#FF6583", cornerColor: "#FF6583", cornerSize: 8,
        transparentCorners: false, editable: true,
      });
      // Clone shadow from the original object
      if (active.shadow) {
        try { tb.set("shadow", new FabricShadow(active.shadow)); } catch {}
      }
      canvas.remove(active);
      canvas.add(tb);
      canvas.setActiveObject(tb);
    } else {
      active.set("text", editText);
      active.set("fontSize", fontSize);
      active.set("fontFamily", fontFamily);
      active.set("fill", fontColor);
      active.set("fontWeight", fontWeight);
      active.set("fontStyle", italic ? "italic" : "normal");
      active.set("underline", underline);
      active.set("linethrough", strikethrough);
      active.set("textAlign", textAlign);
      active.set("lineHeight", lineHeight);
      active.set("charSpacing", charSpacing);
      active.set("opacity", opacity / 100);
      active.set("strokeWidth", strokeWidth);
      active.set("stroke", strokeWidth > 0 ? fontColor : "");
      if (shadowEnabled) {
        try { active.set("shadow", new FabricShadow({ color: "rgba(0,0,0,0.3)", blur: 10, offsetX: 5, offsetY: 5 })); } catch {}
      } else {
        active.set("shadow", undefined);
      }
    }
    canvas.renderAll();
  }, [editText, fontSize, fontFamily, fontColor, fontWeight, italic, underline, strikethrough, textAlign, lineHeight, charSpacing, opacity, strokeWidth, shadowEnabled, getFabric, imageUrl]);

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
      borderColor: "#FF6583", cornerColor: "#FF6583", cornerSize: 8,
      transparentCorners: false, editable: true,
    });
    if (shadowEnabled) {
      try { tb.set("shadow", new FabricShadow({ color: "rgba(0,0,0,0.3)", blur: 10, offsetX: 5, offsetY: 5 })); } catch {}
    }
    canvas.add(tb);
    canvas.setActiveObject(tb);
    canvas.renderAll();
    syncFromObj(tb);
  }, [fontSize, fontFamily, fontColor, fontWeight, italic, underline, strikethrough, textAlign, lineHeight, charSpacing, opacity, strokeWidth, shadowEnabled, getFabric, syncFromObj]);

  const handleDownload = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.discardActiveObject();
    canvas.renderAll();
    const dataUrl = canvas.toDataURL({ format: "png", quality: 1, multiplier: 2 });
    const link = document.createElement("a");
    link.download = filename ? filename.replace(/\.[^.]+$/, "") + "-edited.png" : "photext-edited.png";
    link.href = dataUrl;
    link.click();
  }, [filename]);

  const cursor = tool !== "select" ? "crosshair" : "default";

  const showDropzone = !imageUrl;

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f5f5f5" }}>
      {/* AppBar */}
      <AppBar
        position="relative"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: "white" }}
      >
        <Toolbar variant="dense" sx={{ minHeight: 56, px: 1.5 }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }}>
            <IconButton size="small" edge="start" sx={{ mr: 0.5 }}>
              <ArrowBackIos sx={{ fontSize: 16 }} />
            </IconButton>
          </Link>
          <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
            PhoText
          </Typography>
          {filename && (
            <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
              {filename}
            </Typography>
          )}
          <Box sx={{ flex: 1 }} />
          {imageUrl && (
            <>
              <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                {statusText}
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<Download sx={{ fontSize: 16 }} />}
                onClick={handleDownload}
                disabled={loading}
                sx={{
                  textTransform: "none",
                  fontSize: 13,
                  bgcolor: "#FF6583",
                  "&:hover": { bgcolor: "#e55a76" },
                }}
              >
                Download
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left panel (tabs) */}
        {imageUrl && (
          <LeftPanel activeTab={activeTab} onTabChange={setActiveTab} disabled={loading} />
        )}

        {showDropzone ? (
          <Box
            {...getRootProps()}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              bgcolor: "white",
              m: 2,
              borderRadius: 2,
              border: "2px dashed",
              borderColor: isDragActive ? "#FF6583" : "divider",
              "&:hover": { borderColor: "#FF6583" },
              transition: "border-color 0.2s",
            }}
          >
            <input {...getInputProps()} />
            <CloudUpload sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
            <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
              {isDragActive ? "Drop image here" : "Drag & drop an image here"}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ mb: 1 }}>
              or click to browse
            </Typography>
            <Typography variant="caption" color="text.disabled">
              JPG, PNG, JPEG, WEBP, BMP
            </Typography>
          </Box>
        ) : (
          <CanvasArea
            canvasRef={canvasRef}
            tool={tool}
            onToolChange={setTool}
            loading={loading}
            statusText={statusText}
            imageUrl={imageUrl}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            cursor={cursor}
            zoom={zoom}
            onZoomChange={setZoom}
          />
        )}

        {/* Right panel */}
        {imageUrl && activeTab === "text" && (
          <Drawer
            variant="permanent"
            anchor="right"
            sx={{
              width: 300,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: 300,
                boxSizing: "border-box",
                borderLeft: "1px solid",
                borderColor: "divider",
                bgcolor: "white",
                top: 56,
                height: "calc(100% - 56px)",
              },
            }}
          >
            <TextProperties
              fontFamily={fontFamily}
              onFontFamilyChange={setFontFamily}
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              fontColor={fontColor}
              onFontColorChange={setFontColor}
              fontWeight={fontWeight}
              onFontWeightChange={setFontWeight}
              italic={italic}
              onItalicChange={setItalic}
              underline={underline}
              onUnderlineChange={setUnderline}
              strikethrough={strikethrough}
              onStrikethroughChange={setStrikethrough}
              textAlign={textAlign}
              onTextAlignChange={setTextAlign}
              lineHeight={lineHeight}
              onLineHeightChange={setLineHeight}
              charSpacing={charSpacing}
              onCharSpacingChange={setCharSpacing}
              opacity={opacity}
              onOpacityChange={setOpacity}
              strokeWidth={strokeWidth}
              onStrokeWidthChange={setStrokeWidth}
              rotation={rotation}
              onRotationChange={setRotation}
              skewX={skewX}
              onSkewXChange={setSkewX}
              originalText={selectedText}
              editText={editText}
              onEditTextChange={setEditText}
              shadowEnabled={shadowEnabled}
              onShadowToggle={setShadowEnabled}
              selectedText={selectedText}
              onApply={handleApply}
              onAddText={handleAddText}
            />
          </Drawer>
        )}
      </Box>
    </Box>
  );
}
