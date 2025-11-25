"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  label?: string;
  accept?: string;
}

export function ImageUpload({
  onImageUpload,
  currentImage,
  label = "Télécharger une image",
  accept = "image/*",
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner un fichier image valide");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("L'image ne doit pas dépasser 5MB");
        return;
      }

      setIsUploading(true);

      try {
        // Simuler l'upload vers un service d'images (Cloudinary, AWS S3, etc.)
        // Pour l'instant, on utilise une URL de base64
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onImageUpload(result);
          toast.success("Image téléchargée avec succès");
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Erreur lors du téléchargement:", error);
        toast.error("Erreur lors du téléchargement de l'image");
        setIsUploading(false);
      }
    },
    [onImageUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleRemoveImage = useCallback(() => {
    onImageUpload("");
    toast.success("Image supprimée");
  }, [onImageUpload]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {currentImage ? (
          <div className="space-y-3">
            <div className="relative w-full h-32 rounded-lg border overflow-hidden">
              <Image
                src={currentImage}
                alt="Image téléchargée"
                fill
                className="object-cover"
                unoptimized
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              Cliquez sur &quot;Changer&quot; pour remplacer cette image
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">
              Glissez-déposez une image ici ou cliquez pour sélectionner
            </p>
            <p className="text-xs text-gray-500 mb-3">
              PNG, JPG, GIF jusqu&apos;à 5MB
            </p>
            <Input
              type="file"
              accept={accept}
              onChange={handleFileInputChange}
              className="hidden"
              id="image-upload"
              disabled={isUploading}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("image-upload")?.click()}
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Téléchargement..." : "Sélectionner"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
