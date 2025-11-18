"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ColorPreset {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  accentColor: string;
  description: string;
}

interface ColorPresetsProps {
  onPresetSelect: (preset: Omit<ColorPreset, "name" | "description">) => void;
}

const COLOR_PRESETS: ColorPreset[] = [
  {
    name: "Classique",
    primaryColor: "#1A2B4B",
    secondaryColor: "#2C3E50",
    backgroundColor: "#F8F7F2",
    accentColor: "#FFD700",
    description: "Élégant et professionnel",
  },
  {
    name: "Premium",
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
    backgroundColor: "#f8f9ff",
    accentColor: "#FFD700",
    description: "Sophistiqué et moderne",
  },
  {
    name: "Nature",
    primaryColor: "#2d5016",
    secondaryColor: "#4a7c59",
    backgroundColor: "#f0f8f0",
    accentColor: "#90EE90",
    description: "Fraîcheur et naturel",
  },
  {
    name: "Chaleureux",
    primaryColor: "#8B4513",
    secondaryColor: "#A0522D",
    backgroundColor: "#FFF8DC",
    accentColor: "#FFA500",
    description: "Confortable et accueillant",
  },
  {
    name: "Minimaliste",
    primaryColor: "#2C2C2C",
    secondaryColor: "#404040",
    backgroundColor: "#FFFFFF",
    accentColor: "#E0E0E0",
    description: "Simple et épuré",
  },
  {
    name: "Festif",
    primaryColor: "#DC143C",
    secondaryColor: "#B22222",
    backgroundColor: "#FFF0F5",
    accentColor: "#FFD700",
    description: "Dynamique et festif",
  },
  {
    name: "Océan",
    primaryColor: "#006994",
    secondaryColor: "#0080A3",
    backgroundColor: "#F0F8FF",
    accentColor: "#87CEEB",
    description: "Fraîcheur marine",
  },
  {
    name: "Luxe",
    primaryColor: "#4B0082",
    secondaryColor: "#6A0DAD",
    backgroundColor: "#F8F8FF",
    accentColor: "#DDA0DD",
    description: "Raffiné et luxueux",
  },
];

export function ColorPresets({ onPresetSelect }: ColorPresetsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Presets de Couleurs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {COLOR_PRESETS.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              className="h-auto p-3 flex flex-col items-start gap-2"
              onClick={() =>
                onPresetSelect({
                  primaryColor: preset.primaryColor,
                  secondaryColor: preset.secondaryColor,
                  backgroundColor: preset.backgroundColor,
                  accentColor: preset.accentColor,
                })
              }
            >
              <div className="flex items-center gap-2 w-full">
                <div className="flex gap-1">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: preset.primaryColor }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: preset.secondaryColor }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: preset.backgroundColor }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: preset.accentColor }}
                  />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {preset.name}
                </Badge>
              </div>
              <div className="text-xs text-gray-600 text-left">
                {preset.description}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

