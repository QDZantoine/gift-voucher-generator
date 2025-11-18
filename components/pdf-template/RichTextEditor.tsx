"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Link,
  Image as ImageIcon,
  Type,
  Palette,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Saisissez votre texte...",
  className = "",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const insertLink = useCallback(() => {
    if (linkUrl && linkText) {
      const linkHtml = `<a href="${linkUrl}" target="_blank">${linkText}</a>`;
      execCommand("insertHTML", linkHtml);
      setLinkUrl("");
      setLinkText("");
      setIsLinkDialogOpen(false);
    }
  }, [linkUrl, linkText, execCommand]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      execCommand("insertText", text);
    },
    [execCommand]
  );

  const insertImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = `<img src="${e.target?.result}" alt="Image" style="max-width: 100%; height: auto;" />`;
          execCommand("insertHTML", img);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [execCommand]);

  const toolbarButtons = [
    {
      icon: Bold,
      command: "bold",
      title: "Gras",
    },
    {
      icon: Italic,
      command: "italic",
      title: "Italique",
    },
    {
      icon: Underline,
      command: "underline",
      title: "Souligné",
    },
  ];

  const alignmentButtons = [
    {
      icon: AlignLeft,
      command: "justifyLeft",
      title: "Aligner à gauche",
    },
    {
      icon: AlignCenter,
      command: "justifyCenter",
      title: "Centrer",
    },
    {
      icon: AlignRight,
      command: "justifyRight",
      title: "Aligner à droite",
    },
  ];

  const listButtons = [
    {
      icon: List,
      command: "insertUnorderedList",
      title: "Liste à puces",
    },
    {
      icon: ListOrdered,
      command: "insertOrderedList",
      title: "Liste numérotée",
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm">Éditeur de Texte Riche</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Barre d'outils */}
        <div className="flex flex-wrap gap-1 p-2 border rounded-lg bg-gray-50">
          {/* Formatage de texte */}
          <div className="flex gap-1">
            {toolbarButtons.map((button) => (
              <Button
                key={button.command}
                variant="ghost"
                size="sm"
                onClick={() => execCommand(button.command)}
                title={button.title}
                className="h-8 w-8 p-0"
              >
                <button.icon className="w-4 h-4" />
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Alignement */}
          <div className="flex gap-1">
            {alignmentButtons.map((button) => (
              <Button
                key={button.command}
                variant="ghost"
                size="sm"
                onClick={() => execCommand(button.command)}
                title={button.title}
                className="h-8 w-8 p-0"
              >
                <button.icon className="w-4 h-4" />
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Listes */}
          <div className="flex gap-1">
            {listButtons.map((button) => (
              <Button
                key={button.command}
                variant="ghost"
                size="sm"
                onClick={() => execCommand(button.command)}
                title={button.title}
                className="h-8 w-8 p-0"
              >
                <button.icon className="w-4 h-4" />
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Outils avancés */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => execCommand("formatBlock", "blockquote")}
              title="Citation"
              className="h-8 w-8 p-0"
            >
              <Quote className="w-4 h-4" />
            </Button>

            <Popover open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  title="Insérer un lien"
                  className="h-8 w-8 p-0"
                >
                  <Link className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="linkText">Texte du lien</Label>
                    <Input
                      id="linkText"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      placeholder="Texte à afficher"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkUrl">URL</Label>
                    <Input
                      id="linkUrl"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://exemple.com"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={insertLink}>
                      Insérer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsLinkDialogOpen(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="sm"
              onClick={insertImage}
              title="Insérer une image"
              className="h-8 w-8 p-0"
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Zone d'édition */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          className="min-h-[200px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
          dangerouslySetInnerHTML={{ __html: value }}
          suppressContentEditableWarning={true}
        />

        {!value && (
          <div className="absolute top-3 left-3 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

