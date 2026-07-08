"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Button,
  Slider,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Chip,
  Tooltip,
  Input,
} from "@mui/material";
import {
  Troubleshoot,
  FileUploadOutlined,
  Search,
  PaletteOutlined,
  RemoveCircleOutlined,
  AddCircleOutlined,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  HelpOutlined,
} from "@mui/icons-material";

const FONT_CATEGORIES = [
  "Preset",
  "Local Fonts",
  "Sans Serif",
  "Serif",
  "Display",
  "Handwriting",
  "Monospace",
  "Other",
];

const ALL_FONTS = [
  { label: "Arial", value: "Arial", cat: "Sans Serif" },
  { label: "Helvetica", value: "Helvetica", cat: "Sans Serif" },
  { label: "Verdana", value: "Verdana", cat: "Sans Serif" },
  { label: "Tahoma", value: "Tahoma", cat: "Sans Serif" },
  { label: "Trebuchet MS", value: "Trebuchet MS", cat: "Sans Serif" },
  { label: "Times New Roman", value: "Times New Roman", cat: "Serif" },
  { label: "Georgia", value: "Georgia", cat: "Serif" },
  { label: "Garamond", value: "Garamond", cat: "Serif" },
  { label: "Palatino Linotype", value: "Palatino Linotype", cat: "Serif" },
  { label: "Courier New", value: "Courier New", cat: "Monospace" },
  { label: "Lucida Console", value: "Lucida Console", cat: "Monospace" },
  { label: "Consolas", value: "Consolas", cat: "Monospace" },
  { label: "Impact", value: "Impact", cat: "Display" },
  { label: "Comic Sans MS", value: "Comic Sans MS", cat: "Display" },
  { label: "Papyrus", value: "Papyrus", cat: "Display" },
];

interface Props {
  fontFamily: string;
  onFontFamilyChange: (v: string) => void;
  fontSize: number;
  onFontSizeChange: (v: number) => void;
  fontColor: string;
  onFontColorChange: (v: string) => void;
  fontWeight: number;
  onFontWeightChange: (v: number) => void;
  italic: boolean;
  onItalicChange: (v: boolean) => void;
  underline: boolean;
  onUnderlineChange: (v: boolean) => void;
  strikethrough: boolean;
  onStrikethroughChange: (v: boolean) => void;
  textAlign: string;
  onTextAlignChange: (v: string) => void;
  lineHeight: number;
  onLineHeightChange: (v: number) => void;
  charSpacing: number;
  onCharSpacingChange: (v: number) => void;
  opacity: number;
  onOpacityChange: (v: number) => void;
  strokeWidth: number;
  onStrokeWidthChange: (v: number) => void;
  rotation: number;
  onRotationChange: (v: number) => void;
  skewX: number;
  onSkewXChange: (v: number) => void;
  originalText: string;
  editText: string;
  onEditTextChange: (v: string) => void;
  shadowEnabled: boolean;
  onShadowToggle: (v: boolean) => void;
  selectedText: string;
  onApply: () => void;
  onAddText: () => void;
}

function SliderRow({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.3 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {value}{suffix || ""}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <IconButton size="small" onClick={() => onChange(Math.max(min, value - (step || 1)))}>
          <RemoveCircleOutlined sx={{ fontSize: 16 }} />
        </IconButton>
        <Slider
          value={value}
          onChange={(_, v) => onChange(v as number)}
          min={min}
          max={max}
          step={step || 1}
          size="small"
          sx={{ mx: 0.5 }}
        />
        <IconButton size="small" onClick={() => onChange(Math.min(max, value + (step || 1)))}>
          <AddCircleOutlined sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  );
}

const COLOR_SWATCHES = ["#FF6B6B", "#FFB84D", "#4ECB71", "#4DABF7", "#A66CFF", "#000000", "#FFFFFF"];

export default function TextProperties({
  fontFamily, onFontFamilyChange,
  fontSize, onFontSizeChange,
  fontColor, onFontColorChange,
  fontWeight, onFontWeightChange,
  italic, onItalicChange,
  underline, onUnderlineChange,
  strikethrough, onStrikethroughChange,
  textAlign, onTextAlignChange,
  lineHeight, onLineHeightChange,
  charSpacing, onCharSpacingChange,
  opacity, onOpacityChange,
  strokeWidth, onStrokeWidthChange,
  rotation, onRotationChange,
  skewX, onSkewXChange,
  originalText, editText, onEditTextChange,
  shadowEnabled, onShadowToggle,
  selectedText, onApply, onAddText,
}: Props) {
  const [fontCat, setFontCat] = useState("Preset");
  const [format, setFormat] = useState<string[]>(() => {
    const arr: string[] = [];
    if (italic) arr.push("italic");
    if (underline) arr.push("underline");
    if (strikethrough) arr.push("strikethrough");
    return arr;
  });

  const handleFormat = (_: any, val: string[]) => {
    setFormat(val || []);
    onItalicChange(val?.includes("italic") || false);
    onUnderlineChange(val?.includes("underline") || false);
    onStrikethroughChange(val?.includes("strikethrough") || false);
  };

  const filteredFonts = fontCat === "Preset"
    ? ALL_FONTS
    : fontCat === "Local Fonts"
    ? []
    : ALL_FONTS.filter((f) => f.cat === fontCat);

  return (
    <Box sx={{ px: 2, py: 1.5, overflow: "auto", height: "100%" }}>
      {/* Font */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: "block" }}>
          Font
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5, mb: 0.5 }}>
          <Select
            value={fontFamily}
            onChange={(e) => onFontFamilyChange(e.target.value)}
            size="small"
            fullWidth
            sx={{ fontSize: 13, "& .MuiSelect-select": { py: 0.8 } }}
          >
            {filteredFonts.map((f) => (
              <MenuItem key={f.value} value={f.value} sx={{ fontSize: 13 }}>
                {f.label}
              </MenuItem>
            ))}
            {filteredFonts.length === 0 && (
              <MenuItem disabled sx={{ fontSize: 13 }}>No fonts available</MenuItem>
            )}
          </Select>
          <Tooltip title="Identify font">
            <IconButton size="small" sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
              <Troubleshoot sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Font categories */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.3, mb: 0.5 }}>
          <IconButton size="small" sx={{ p: 0.2 }}>
            <KeyboardArrowLeft sx={{ fontSize: 16 }} />
          </IconButton>
          <Box sx={{ display: "flex", gap: 0.3, overflow: "auto", flex: 1 }}>
            {FONT_CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                size="small"
                onClick={() => setFontCat(cat)}
                variant={fontCat === cat ? "filled" : "outlined"}
                sx={{
                  fontSize: 11,
                  height: 24,
                  cursor: "pointer",
                  bgcolor: fontCat === cat ? "rgba(255,101,131,0.12)" : "transparent",
                  color: fontCat === cat ? "#FF6583" : "text.secondary",
                  borderColor: fontCat === cat ? "#FF6583" : "divider",
                  "&:hover": { bgcolor: fontCat === cat ? "rgba(255,101,131,0.18)" : "action.hover" },
                }}
              />
            ))}
          </Box>
          <IconButton size="small" sx={{ p: 0.2 }}>
            <KeyboardArrowRight sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Upload font + Search */}
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Button
            size="small"
            startIcon={<FileUploadOutlined sx={{ fontSize: 14 }} />}
            sx={{ textTransform: "none", fontSize: 11, color: "text.secondary", flex: 1 }}
          >
            Upload font
          </Button>
          <IconButton size="small" sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
            <Search sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      {/* Color */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.3, display: "block" }}>
          Color
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          {COLOR_SWATCHES.map((c) => (
            <Box
              key={c}
              onClick={() => onFontColorChange(c)}
              sx={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                bgcolor: c,
                border: "2px solid",
                borderColor: fontColor === c ? "#FF6583" : "transparent",
                cursor: "pointer",
                "&:hover": { opacity: 0.8 },
                boxShadow: c === "#FFFFFF" ? "inset 0 0 0 1px rgba(0,0,0,0.12)" : "none",
              }}
            />
          ))}
          <IconButton size="small" sx={{ ml: 0.5 }}>
            <PaletteOutlined sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
        <Input
          type="color"
          value={fontColor}
          onChange={(e) => onFontColorChange(e.target.value)}
          sx={{ width: "100%", mt: 0.5, height: 28, "& input": { cursor: "pointer", p: 0 } }}
        />
      </Box>

      <SliderRow label="Size" value={fontSize} onChange={onFontSizeChange} min={1} max={400} suffix="px" />
      <SliderRow label="Weight" value={fontWeight} onChange={onFontWeightChange} min={100} max={900} step={100} />
      <SliderRow label="Stroke" value={strokeWidth} onChange={onStrokeWidthChange} min={0} max={20} suffix="px" />
      <SliderRow label="Spacing" value={charSpacing} onChange={onCharSpacingChange} min={-100} max={500} />
      <SliderRow label="Opacity" value={opacity} onChange={onOpacityChange} min={0} max={100} suffix="%" />

      {/* Format */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.3, display: "block" }}>
          Format
        </Typography>
        <ToggleButtonGroup
          value={format}
          onChange={handleFormat}
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              border: "1px solid",
              borderColor: "divider",
              px: 1.5,
              py: 0.3,
              textTransform: "none",
            },
          }}
        >
          <ToggleButton value="bold" onClick={() => onFontWeightChange(fontWeight === 700 ? 400 : 700)}>
            <FormatBold sx={{ fontSize: 16 }} />
          </ToggleButton>
          <ToggleButton value="italic">
            <FormatItalic sx={{ fontSize: 16 }} />
          </ToggleButton>
          <ToggleButton value="underline">
            <FormatUnderlined sx={{ fontSize: 16 }} />
          </ToggleButton>
          <ToggleButton value="strikethrough">
            <StrikethroughS sx={{ fontSize: 16 }} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Text Align */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.3, display: "block" }}>
          Text Align
        </Typography>
        <ToggleButtonGroup
          value={textAlign}
          exclusive
          onChange={(_, v) => v && onTextAlignChange(v)}
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              border: "1px solid",
              borderColor: "divider",
              px: 1.5,
              py: 0.3,
              textTransform: "none",
            },
          }}
        >
          <ToggleButton value="left"><FormatAlignLeft sx={{ fontSize: 16 }} /></ToggleButton>
          <ToggleButton value="center"><FormatAlignCenter sx={{ fontSize: 16 }} /></ToggleButton>
          <ToggleButton value="right"><FormatAlignRight sx={{ fontSize: 16 }} /></ToggleButton>
          <ToggleButton value="justify"><FormatAlignJustify sx={{ fontSize: 16 }} /></ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <SliderRow label="Line Height" value={Math.round(lineHeight * 10)} onChange={(v) => onLineHeightChange(v / 10)} min={5} max={40} />

      <Divider sx={{ mb: 1.5 }} />

      {/* Position */}
      <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: "block" }}>
        Position
      </Typography>
      <SliderRow label="Rotation" value={rotation} onChange={onRotationChange} min={-180} max={180} suffix="°" />
      <SliderRow label="Skew X" value={skewX} onChange={onSkewXChange} min={-45} max={45} suffix="°" />

      <Divider sx={{ mb: 1.5 }} />

      {/* Original Text */}
      <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.3, display: "block" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          Original Text
          <Tooltip title="Original recognized text">
            <HelpOutlined sx={{ fontSize: 14, color: "text.disabled" }} />
          </Tooltip>
        </Box>
      </Typography>
      <Typography
        variant="body2"
        color={selectedText ? "text.primary" : "text.disabled"}
        sx={{ fontSize: 12, mb: 1, fontStyle: selectedText ? "normal" : "italic" }}
      >
        {selectedText || "No Text Selected"}
      </Typography>

      {/* Shadow */}
      <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.3, display: "block" }}>
        Shadow
      </Typography>
      <Typography
        variant="body2"
        color="text.disabled"
        sx={{ fontSize: 12, mb: 1, fontStyle: "italic" }}
      >
        {selectedText ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <input
              type="checkbox"
              checked={shadowEnabled}
              onChange={(e) => onShadowToggle(e.target.checked)}
            />
            <Typography variant="caption">Enable Shadow</Typography>
          </Box>
        ) : "No Text Selected"}
      </Typography>

      {/* Effect */}
      <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.3, display: "block" }}>
        Effect
      </Typography>
      <Typography
        variant="body2"
        color="text.disabled"
        sx={{ fontSize: 12, mb: 1, fontStyle: "italic" }}
      >
        {selectedText ? "No effects available" : "No Text Selected"}
      </Typography>

      <Divider sx={{ my: 1.5 }} />

      {/* Add Text */}
      <Button
        fullWidth
        variant="outlined"
        onClick={onAddText}
        sx={{
          textTransform: "none",
          fontSize: 13,
          borderStyle: "dashed",
          borderColor: "divider",
          color: "text.secondary",
          py: 0.8,
        }}
      >
        + Add Text
      </Button>
    </Box>
  );
}
