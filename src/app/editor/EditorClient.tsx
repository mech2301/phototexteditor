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
    setSkewX(obj.skewX || 0);
    if (obj.shadow) {
      setShadowEnabled(true);
    } else {
      setShadowEnabled(false);
    }
  }, []);

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
        const h = Math.min(w * 0.75, 600);
        canvasEl.width = w;
        canvasEl.height = h;

        const canvas = new FabricCanvas(canvasEl, {
          width: w, height: h, backgroundColor: "#ffffff", preserveObjectStacking: true,
        });
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
        canvas.on("selection:cleared", () => {
          setSelectedText("");
          setEditText("");
        });

        setStatusText("Running OCR\u2026");
        try {
          const { detectText } = await getOCR();
          const result = await detectText(file);
          if (!disposed && result.words.length > 0) {
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
    const { Textbox: FabricTextbox, Shadow: FabricShadow } = fabric;

    if (active.isBbox) {
      const tb = new FabricTextbox(editText, {
        left: (active.left || 0) + 2,
        top: (active.top || 0) + 2,
        width: Math.max(((active.width || 100) * (active.scaleX || 1)) - 4, 50),
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
  }, [editText, fontSize, fontFamily, fontColor, fontWeight, italic, underline, strikethrough, textAlign, lineHeight, charSpacing, opacity, strokeWidth, shadowEnabled, getFabric]);

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
