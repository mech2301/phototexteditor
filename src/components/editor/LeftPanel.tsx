"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import {
  CropRotate,
  PictureInPicture,
  AddBoxOutlined,
  Exposure,
  ArtTrack,
  AutoAwesome,
} from "@mui/icons-material";

const TABS = [
  { key: "adjust", icon: <CropRotate />, label: "Adjust" },
  { key: "removal", icon: <PictureInPicture />, label: "Removal" },
  { key: "add", icon: <AddBoxOutlined />, label: "Add" },
  { key: "effects", icon: <Exposure />, label: "Effects" },
  { key: "text", icon: <ArtTrack />, label: "Text" },
  { key: "ai", icon: <AutoAwesome />, label: "AI" },
];

interface Props {
  activeTab: string;
  onTabChange: (key: string) => void;
  disabled?: boolean;
}

export default function LeftPanel({ activeTab, onTabChange, disabled }: Props) {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 72,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 72,
          boxSizing: "border-box",
          borderRight: "1px solid",
          borderColor: "divider",
          bgcolor: "#fafafa",
          top: 56,
          height: "calc(100% - 56px)",
          overflow: "hidden",
        },
      }}
    >
      <List disablePadding sx={{ pt: 0.5 }}>
        {TABS.map((t) => {
          const selected = activeTab === t.key;
          return (
            <ListItem key={t.key} disablePadding sx={{ display: "block" }}>
              <Tooltip title={t.label} placement="right">
                <span>
                  <ListItemButton
                    selected={selected}
                    disabled={disabled}
                    onClick={() => onTabChange(t.key)}
                    sx={{
                      minHeight: 56,
                      px: 0,
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      "&.Mui-selected": {
                        bgcolor: "rgba(0,0,0,0.06)",
                      },
                      "&.Mui-disabled": {
                        opacity: 0.35,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        justifyContent: "center",
                        color: selected ? "#FF6583" : "text.secondary",
                        fontSize: 24,
                      }}
                    >
                      {t.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={t.label}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: 10,
                            fontWeight: selected ? 600 : 400,
                            color: selected ? "#FF6583" : "text.secondary",
                            textAlign: "center",
                            lineHeight: 1.2,
                            mt: 0.3,
                          },
                        },
                      }}
                    />
                  </ListItemButton>
                </span>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
