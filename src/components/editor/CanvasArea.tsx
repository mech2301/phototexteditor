"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import {
  ToggleButtonGroup,
  ToggleButton,
  ButtonGroup,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import {
  Crop54Outlined,
  CircleOutlined,
  ArrowRightAltOutlined,
  ZoomOut,
  ZoomIn,
  Compare,
  InfoOutlined,
} from "@mui/icons-material";

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  tool: string;
  onToolChange: (t: string) => void;
  loading: boolean;
  statusText: string;
  imageUrl: string | null;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  cursor: string;
  zoom: number;
  onZoomChange: (z: number) => void;
}

export default function CanvasArea({
  canvasRef,
  tool,
  onToolChange,
  loading,
  statusText,
  imageUrl,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  cursor,
  zoom,
  onZoomChange,
}: Props) {
  const [markTool, setMarkTool] = useState("rect");

  const handleMarkChange = (_: any, val: string | null) => {
    if (val) setMarkTool(val);
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f5f5f5",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Canvas */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "relative", maxWidth: "100%", maxHeight: "100%" }}>
          {loading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: "rgba(255,255,255,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                borderRadius: 1,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {statusText}
              </Typography>
            </Box>
          )}
          <canvas
            ref={canvasRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            style={{
              cursor,
              maxWidth: "100%",
              maxHeight: "100%",
              borderRadius: 4,
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          />
        </Box>
      </Box>

      {/* Bottom toolbar */}
      {imageUrl && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "white",
          }}
        >
          {/* Mark Tool */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
              Mark Tool
            </Typography>
            <ToggleButtonGroup
              value={markTool}
              exclusive
              onChange={handleMarkChange}
              size="small"
              sx={{
                "& .MuiToggleButton-root": {
                  border: "1px solid",
                  borderColor: "divider",
                  px: 1,
                  py: 0.3,
                  textTransform: "none",
                  fontSize: 12,
                },
              }}
            >
              <ToggleButton value="rect">
                <Crop54Outlined sx={{ fontSize: 16, mr: 0.3 }} /> Rect
              </ToggleButton>
              <ToggleButton value="circle">
                <CircleOutlined sx={{ fontSize: 16, mr: 0.3 }} /> Circle
              </ToggleButton>
              <ToggleButton value="arrow">
                <ArrowRightAltOutlined sx={{ fontSize: 16, mr: 0.3 }} /> Arrow
              </ToggleButton>
            </ToggleButtonGroup>
            <Tooltip title="You can mark areas to tell AI what to modify">
              <IconButton size="small">
                <InfoOutlined sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Zoom */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ButtonGroup size="small" variant="outlined">
              <Button onClick={() => onZoomChange(Math.max(10, zoom - 10))}>
                <ZoomOut sx={{ fontSize: 16 }} />
              </Button>
              <Button disabled sx={{ px: 1.5, fontWeight: 600, fontSize: 13 }}>
                {zoom}%
              </Button>
              <Button onClick={() => onZoomChange(Math.min(400, zoom + 10))}>
                <ZoomIn sx={{ fontSize: 16 }} />
              </Button>
            </ButtonGroup>

            <Button
              variant="outlined"
              size="small"
              startIcon={<Compare sx={{ fontSize: 16 }} />}
              sx={{ textTransform: "none", fontSize: 12 }}
            >
              Compare
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
