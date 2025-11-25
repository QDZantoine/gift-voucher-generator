"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { ColorPresets } from "./ColorPresets";
import { Save, Palette, Type, Image as ImageIcon, Layout, Eye } from "lucide-react";
import Image from "next/image";
import { PDFTemplate, GiftCardTemplateData } from "@/lib/pdf-templates";
import { SerializedEditorState } from "lexical";
import { Editor as ShadcnEditor } from "@/components/blocks/editor-00/editor";

interface TemplateStyle {
  // Couleurs
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;

  // Typographie
  titleFont: string;
  bodyFont: string;
  titleSize: number;
  bodySize: number;

  // Layout
  borderRadius: number;
  padding: number;
  margin: number;

  // Images
  logoUrl?: string;
  backgroundImage?: string;
  giftIcon: string;

  // Restaurant branding
  restaurantLogoType: "text" | "logo";
  restaurantLogoUrl?: string;

  // Textes modifiables
  restaurantName: string;
  restaurantSubtitle: string;
  giftCardTitle: string;
  welcomeMessage: string;
  validityMessage: string;
  footerTitle: string;
  contactInfo: string;
  openingHours: string;

  // Rich text (Lexical serialized state)
  welcomeMessageState?: SerializedEditorState;
  validityMessageState?: SerializedEditorState;
  restaurantSubtitleState?: SerializedEditorState;
  giftCardTitleState?: SerializedEditorState;
  footerTitleState?: SerializedEditorState;
  contactInfoState?: SerializedEditorState;
  openingHoursState?: SerializedEditorState;
}

interface VisualTemplateEditorProps {
  template: PDFTemplate;
  onSave: (template: PDFTemplate) => void;
  onCancel: () => void;
  previewData: GiftCardTemplateData;
  menuTypes?: Array<{ id: string; name: string; amount: number }>;
}

const DEFAULT_STYLES: TemplateStyle = {
  primaryColor: "#1A2B4B",
  secondaryColor: "#2C3E50",
  backgroundColor: "#F8F7F2",
  textColor: "#1A2B4B",
  accentColor: "#FFD700",
  titleFont: "Playfair Display",
  bodyFont: "Lato",
  titleSize: 26,
  bodySize: 14,
  borderRadius: 10,
  padding: 25,
  margin: 8,
  giftIcon: "🎁",
  restaurantLogoType: "text",
  restaurantLogoUrl: undefined,
  restaurantName: "influences",
  restaurantSubtitle: "Cuisine Moderne",
  giftCardTitle: "Bon Cadeau",
  welcomeMessage:
    "Cher(e) {{recipientName}},<br>Vous avez reçu un bon cadeau du Restaurant Influences.<br>Préparez-vous à une expérience culinaire inoubliable !",
  validityMessage:
    "⚠️ <strong>Important :</strong> Ce bon cadeau est valable 1 an à partir de la date d'achat.<br>Il n'est pas valable pendant les périodes spéciales (Féria de Bayonne, Nouvel An, Noël, Saint-Valentin).",
  footerTitle: "Restaurant Influences",
  contactInfo: "19 Rue Vieille Boucherie<br>64100 Bayonne<br>05 59 01 75 04",
  openingHours:
    "<strong>Horaires :</strong><br>Du Mardi au Samedi Soir<br>Vendredi et Samedi Midi",
  welcomeMessageState: undefined,
  validityMessageState: undefined,
  restaurantSubtitleState: undefined,
  giftCardTitleState: undefined,
  footerTitleState: undefined,
  contactInfoState: undefined,
  openingHoursState: undefined,
};

const FONT_OPTIONS = [
  { value: "Playfair Display", label: "Playfair Display (Élégant)" },
  { value: "Lato", label: "Lato (Moderne)" },
  { value: "Roboto", label: "Roboto (Clean)" },
  { value: "Open Sans", label: "Open Sans (Lisible)" },
  { value: "Montserrat", label: "Montserrat (Contemporain)" },
  { value: "Poppins", label: "Poppins (Friendly)" },
];

const GIFT_ICONS = ["🎁", "🍽️", "💎", "⭐", "🌟", "✨", "🎉", "🎊"];

export function VisualTemplateEditor({
  template,
  onSave,
  onCancel,
  previewData,
  menuTypes = [],
}: VisualTemplateEditorProps) {
  const [styles, setStyles] = useState<TemplateStyle>(DEFAULT_STYLES);
  const [activeTab, setActiveTab] = useState("content");
  const [previewScale, setPreviewScale] = useState(0.8);

  // États éditables du template
  const [templateName, setTemplateName] = useState(template.name);
  const [templateDescription, setTemplateDescription] = useState(
    template.description
  );
  const [templateProductType, setTemplateProductType] = useState(
    template.productType
  );
  const [templateIsActive, setTemplateIsActive] = useState(template.isActive);

  // Helpers: minimal conversion between Lexical serialized state and HTML
  const serializedToHTML = useCallback(
    (state?: SerializedEditorState): string => {
      if (!state) return "";
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const root = (state as any).root as { children?: unknown[] };
        if (!root || !Array.isArray(root.children)) return "";
        const paragraphs = root.children
          .map((p: unknown) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const paragraph = p as any;
            if (!paragraph || !Array.isArray(paragraph.children)) return "";
            const text = paragraph.children
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((n: any) => (typeof n.text === "string" ? n.text : ""))
              .join("");
            return `<p>${text}</p>`;
          })
          .join("");
        return paragraphs;
      } catch {
        return "";
      }
    },
    []
  );

  const htmlToSerialized = useCallback(
    (html: string): SerializedEditorState => {
      // Parser le HTML et créer des paragraphes Lexical
      // Gérer les <br> comme des sauts de ligne
      // Gérer les <strong> comme du texte en gras

      // Diviser par <br> pour créer des paragraphes
      const parts = html.split(/<br\s*\/?>/gi);

      const paragraphs = parts.map((part) => {
        const textNodes = [];

        // Parser les balises strong
        const strongRegex = /<strong>(.*?)<\/strong>/gi;
        let lastIndex = 0;
        let match;

        const cleanPart = part.trim();

        while ((match = strongRegex.exec(cleanPart)) !== null) {
          // Texte avant le strong
          if (match.index > lastIndex) {
            const beforeText = cleanPart.substring(lastIndex, match.index);
            if (beforeText) {
              textNodes.push({
                detail: 0,
                format: 0, // format: 0 = normal
                mode: "normal",
                style: "",
                text: beforeText,
                type: "text",
                version: 1,
              });
            }
          }

          // Texte en gras
          textNodes.push({
            detail: 0,
            format: 1, // format: 1 = bold
            mode: "normal",
            style: "",
            text: match[1],
            type: "text",
            version: 1,
          });

          lastIndex = strongRegex.lastIndex;
        }

        // Texte restant après le dernier strong
        if (lastIndex < cleanPart.length) {
          const remainingText = cleanPart.substring(lastIndex);
          if (remainingText) {
            textNodes.push({
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: remainingText,
              type: "text",
              version: 1,
            });
          }
        }

        // Si aucun strong n'a été trouvé et qu'il y a du texte
        if (textNodes.length === 0 && cleanPart) {
          textNodes.push({
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: cleanPart,
            type: "text",
            version: 1,
          });
        }

        return {
          children:
            textNodes.length > 0
              ? textNodes
              : [
                  {
                    detail: 0,
                    format: 0,
                    mode: "normal",
                    style: "",
                    text: "",
                    type: "text",
                    version: 1,
                  },
                ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        };
      });

      return {
        root: {
          children: paragraphs,
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      } as SerializedEditorState;
    },
    []
  );

  // Générer le CSS basé sur les styles
  const generateCSS = useCallback((style: TemplateStyle) => {
    return `
      @import url('https://fonts.googleapis.com/css2?family=${style.titleFont.replace(
        " ",
        "+"
      )}:wght@400;700&family=${style.bodyFont.replace(
      " ",
      "+"
    )}:wght@300;400;700&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: '${style.bodyFont}', sans-serif;
        background-color: ${style.backgroundColor};
        color: ${style.textColor};
        padding: ${style.margin}px;
        line-height: 1.3;
        page-break-inside: avoid;
      }
      
      .container {
        max-width: 90%;
        width: 100%;
        margin: 0 auto;
        background: white;
        border-radius: ${style.borderRadius}px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(26, 43, 75, 0.1);
        page-break-inside: avoid;
      }
      
      .header {
        background: linear-gradient(135deg, ${style.primaryColor} 0%, ${
      style.secondaryColor
    } 100%);
        color: white;
        padding: 20px;
        text-align: center;
        page-break-inside: avoid;
      }
      
      .logo {
        font-family: '${style.titleFont}', serif;
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 6px;
        letter-spacing: 1px;
        /* Permettre aux styles inline de prendre le dessus */
        color: inherit !important;
      }
      
      .subtitle {
        font-size: 11px;
        letter-spacing: 2px;
        text-transform: uppercase;
        opacity: 0.8;
        font-weight: 300;
        /* Permettre aux styles inline de prendre le dessus */
        color: inherit !important;
      }
      
      .content {
        padding: ${style.padding}px;
        text-align: center;
        page-break-inside: avoid;
      }
      
      .gift-icon {
        font-size: 45px;
        margin-bottom: 12px;
        display: block;
      }
      
      .title {
        font-family: '${style.titleFont}', serif;
        font-size: ${style.titleSize}px;
        color: ${style.primaryColor};
        margin-bottom: 16px;
        font-weight: 700;
        /* Permettre aux styles inline de prendre le dessus */
        color: inherit !important;
      }
      
      .code {
        font-family: 'Courier New', monospace;
        font-size: 20px;
        font-weight: bold;
        color: ${style.primaryColor};
        background-color: ${style.backgroundColor};
        padding: 12px 20px;
        border-radius: 8px;
        display: inline-block;
        margin-bottom: 15px;
        letter-spacing: 2px;
        border: 2px solid #E0E0E0;
      }
      
      .amount {
        font-family: '${style.titleFont}', serif;
        font-size: 32px;
        font-weight: bold;
        color: ${style.primaryColor};
        margin: 15px 0;
      }
      
      .message {
        font-size: ${style.bodySize}px;
        margin: 15px 0;
        color: ${style.textColor};
        font-style: italic;
        line-height: 1.4;
        /* Permettre aux styles inline de prendre le dessus */
        color: inherit !important;
      }
      
      .custom-message {
        background-color: #FFF3CD;
        border: 2px solid ${style.accentColor};
        border-radius: 8px;
        padding: 12px;
        margin: 15px 0;
        text-align: left;
        page-break-inside: avoid;
      }
      
      .message-text {
        font-style: italic;
        color: #856404;
        margin-top: 6px;
        font-size: 13px;
      }
      
      .details {
        background-color: ${style.backgroundColor};
        border-radius: 10px;
        padding: 16px;
        margin: 18px 0;
        text-align: left;
        page-break-inside: avoid;
      }
      
      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
        border-bottom: 1px solid #E0E0E0;
        font-size: 13px;
      }
      
      .detail-row:last-child {
        border-bottom: none;
      }
      
      .detail-label {
        font-weight: bold;
        color: ${style.primaryColor};
      }
      
      .detail-value {
        color: ${style.textColor};
      }
      
      .validity {
        background-color: #FFF3CD;
        border: 2px solid ${style.accentColor};
        border-radius: 8px;
        padding: 12px;
        margin: 16px 0;
        text-align: center;
        page-break-inside: avoid;
      }
      
      .validity-text {
        color: #856404;
        font-size: 12px;
        line-height: 1.3;
        font-weight: 500;
        /* Permettre aux styles inline de prendre le dessus */
        color: inherit !important;
      }
      
      .footer {
        background: linear-gradient(135deg, ${style.primaryColor} 0%, ${
      style.secondaryColor
    } 100%);
        color: white;
        padding: 18px;
        text-align: center;
        page-break-inside: avoid;
        page-break-before: avoid;
      }
      
      .footer-title {
        font-family: '${style.titleFont}', serif;
        font-size: 18px;
        margin-bottom: 10px;
        font-weight: 700;
        /* Permettre aux styles inline de prendre le dessus */
        color: inherit !important;
      }
      
      .contact-info {
        font-size: 12px;
        line-height: 1.4;
        opacity: 0.9;
        /* Permettre aux styles inline de prendre le dessus */
        color: inherit !important;
      }
    `;
  }, []);

  // Générer le HTML de prévisualisation
  const generatePreviewHTML = useCallback(() => {
    const css = generateCSS(styles);

    // Créer un HTML personnalisé avec les textes modifiables
    const welcomeHTML = styles.welcomeMessageState
      ? serializedToHTML(styles.welcomeMessageState)
      : styles.welcomeMessage.replace(
          /\{\{recipientName\}\}/g,
          previewData.recipientName
        );
    const validityHTML = styles.validityMessageState
      ? serializedToHTML(styles.validityMessageState)
      : styles.validityMessage;
    const customHtml = `
      <div class="container">
        <div class="header">
          <div class="logo">
            ${
              styles.restaurantLogoType === "logo" && styles.restaurantLogoUrl
                ? `<img src="${styles.restaurantLogoUrl}" alt="Logo restaurant" style="max-height: 60px; max-width: 200px; object-fit: contain;" />`
                : styles.restaurantName
            }
          </div>
          <div class="subtitle">${
            styles.restaurantSubtitleState
              ? serializedToHTML(styles.restaurantSubtitleState)
              : styles.restaurantSubtitle
          }</div>
        </div>
        
        <div class="content">
          <span class="gift-icon">${styles.giftIcon}</span>
          <h1 class="title">${
            styles.giftCardTitleState
              ? serializedToHTML(styles.giftCardTitleState)
              : styles.giftCardTitle
          }</h1>
          
          <div class="code">{{code}}</div>
          
          <div class="amount">{{amount}} €</div>
          
          <div class="message">${welcomeHTML}</div>
          
          {{#if customMessage}}
          <div class="custom-message">
            <p><strong>Message personnalisé :</strong></p>
            <p class="message-text">{{customMessage}}</p>
          </div>
          {{/if}}
          
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Type de menu :</span>
              <span class="detail-value">{{productType}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Nombre de personnes :</span>
              <span class="detail-value">{{numberOfPeople}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date d'achat :</span>
              <span class="detail-value">{{purchaseDate}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date d'expiration :</span>
              <span class="detail-value">{{expiryDate}}</span>
            </div>
          </div>
          
          <div class="validity">
            <p class="validity-text">
              ${validityHTML}
            </p>
          </div>
        </div>
        
        <div class="footer">
          <h3 class="footer-title">${
            styles.footerTitleState
              ? serializedToHTML(styles.footerTitleState)
              : styles.footerTitle
          }</h3>
          <div class="contact-info">
            ${
              styles.contactInfoState
                ? serializedToHTML(styles.contactInfoState)
                : styles.contactInfo
            }<br><br>
            ${
              styles.openingHoursState
                ? serializedToHTML(styles.openingHoursState)
                : styles.openingHours
            }
          </div>
        </div>
      </div>
    `;

    const html = customHtml
      .replace(/\{\{code\}\}/g, previewData.code)
      .replace(/\{\{productType\}\}/g, previewData.productType)
      .replace(/\{\{numberOfPeople\}\}/g, previewData.numberOfPeople.toString())
      .replace(/\{\{recipientName\}\}/g, previewData.recipientName)
      .replace(/\{\{amount\}\}/g, previewData.amount.toFixed(2))
      .replace(
        /\{\{expiryDate\}\}/g,
        new Date(previewData.expiryDate).toLocaleDateString("fr-FR")
      )
      .replace(
        /\{\{purchaseDate\}\}/g,
        new Date(previewData.purchaseDate).toLocaleDateString("fr-FR")
      )
      .replace(/\{\{customMessage\}\}/g, previewData.customMessage || "");

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Prévisualisation Template</title>
        <style>${css}</style>
      </head>
      <body>${html}</body>
      </html>
    `;
  }, [styles, previewData, generateCSS, serializedToHTML]);

  const handleStyleChange = (
    key: keyof TemplateStyle,
    value: string | number
  ) => {
    setStyles((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Générer le HTML personnalisé avec les valeurs réelles des styles
    const welcomeHTML = styles.welcomeMessageState
      ? serializedToHTML(styles.welcomeMessageState)
      : styles.welcomeMessage;
    const validityHTML = styles.validityMessageState
      ? serializedToHTML(styles.validityMessageState)
      : styles.validityMessage;
    const restaurantSubtitleHTML = styles.restaurantSubtitleState
      ? serializedToHTML(styles.restaurantSubtitleState)
      : styles.restaurantSubtitle;
    const giftCardTitleHTML = styles.giftCardTitleState
      ? serializedToHTML(styles.giftCardTitleState)
      : styles.giftCardTitle;
    const footerTitleHTML = styles.footerTitleState
      ? serializedToHTML(styles.footerTitleState)
      : styles.footerTitle;
    const contactInfoHTML = styles.contactInfoState
      ? serializedToHTML(styles.contactInfoState)
      : styles.contactInfo;
    const openingHoursHTML = styles.openingHoursState
      ? serializedToHTML(styles.openingHoursState)
      : styles.openingHours;

    const customHtml = `
      <div class="container">
        <div class="header">
          <div class="logo">
            ${
              styles.restaurantLogoType === "logo" && styles.restaurantLogoUrl
                ? `<img src="${styles.restaurantLogoUrl}" alt="Logo restaurant" style="max-height: 60px; max-width: 200px; object-fit: contain;" />`
                : styles.restaurantName
            }
          </div>
          <div class="subtitle">${restaurantSubtitleHTML}</div>
        </div>
        
        <div class="content">
          <span class="gift-icon">${styles.giftIcon}</span>
          <h1 class="title">${giftCardTitleHTML}</h1>
          
          <div class="code">{{code}}</div>
          
          <div class="amount">{{amount}} €</div>
          
          <p class="message">${welcomeHTML}</p>
          
          {{#if customMessage}}
          <div class="custom-message">
            <p><strong>Message personnalisé :</strong></p>
            <p class="message-text">{{customMessage}}</p>
          </div>
          {{/if}}
          
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Type de menu :</span>
              <span class="detail-value">{{productType}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Nombre de personnes :</span>
              <span class="detail-value">{{numberOfPeople}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date d'achat :</span>
              <span class="detail-value">{{purchaseDate}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date d'expiration :</span>
              <span class="detail-value">{{expiryDate}}</span>
            </div>
          </div>
          
          <div class="validity">
            <p class="validity-text">
              ${validityHTML}
            </p>
          </div>
        </div>
        
        <div class="footer">
          <h3 class="footer-title">${footerTitleHTML}</h3>
          <div class="contact-info">
            ${contactInfoHTML}<br><br>
            ${openingHoursHTML}
          </div>
        </div>
      </div>
    `;

    const updatedTemplate: PDFTemplate = {
      ...template,
      name: templateName,
      description: templateDescription,
      productType: templateProductType,
      isActive: templateIsActive,
      html: customHtml,
      css: generateCSS(styles),
      updatedAt: new Date(),
    };
    onSave(updatedTemplate);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 md:p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-[95vw] max-h-[98vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Éditeur Visuel de Template</h2>
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(98vh-80px)] overflow-hidden">
          {/* Panneau de contrôle - Pleine largeur maintenant */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col overflow-hidden min-h-0"
            >
              <TabsList className="grid w-full grid-cols-5 flex-shrink-0 bg-white">
                <TabsTrigger
                  value="content"
                  className="text-xs flex items-center gap-1"
                >
                  <Type className="w-4 h-4" />
                  <span className="hidden sm:inline">Contenu</span>
                </TabsTrigger>
                <TabsTrigger
                  value="colors"
                  className="text-xs flex items-center gap-1"
                >
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">Couleurs</span>
                </TabsTrigger>
                <TabsTrigger
                  value="layout"
                  className="text-xs flex items-center gap-1"
                >
                  <Layout className="w-4 h-4" />
                  <span className="hidden sm:inline">Mise en page</span>
                </TabsTrigger>
                <TabsTrigger
                  value="images"
                  className="text-xs flex items-center gap-1"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Images</span>
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="text-xs flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Prévisualisation</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="content"
                className="flex-1 min-h-0 mt-0 overflow-hidden"
              >
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    <Card className="border-2 border-blue-100 bg-blue-50/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          ⚙️ Configuration du Template
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label
                            htmlFor="templateName"
                            className="text-sm font-medium"
                          >
                            Nom du template
                          </Label>
                          <Input
                            id="templateName"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="Ex: Menu Influences - Classique"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="productType"
                            className="text-sm font-medium"
                          >
                            Type de menu associé
                          </Label>
                          <Select
                            value={templateProductType}
                            onValueChange={setTemplateProductType}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Sélectionnez un type de menu" />
                            </SelectTrigger>
                            <SelectContent>
                              {menuTypes.map((menuType) => (
                                <SelectItem
                                  key={menuType.id}
                                  value={menuType.name}
                                >
                                  {menuType.name} - {menuType.amount.toFixed(2)}
                                  €/pers.
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label
                            htmlFor="description"
                            className="text-sm font-medium"
                          >
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            value={templateDescription}
                            onChange={(e) =>
                              setTemplateDescription(e.target.value)
                            }
                            placeholder="Ex: Template élégant pour le menu principal"
                            rows={2}
                            className="mt-1"
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex-1">
                            <Label
                              htmlFor="isActive"
                              className="text-sm font-medium cursor-pointer"
                            >
                              Template actif
                            </Label>
                            <p className="text-xs text-gray-500 mt-1">
                              {templateIsActive
                                ? "Ce template sera utilisé pour générer les PDF"
                                : "Ce template est désactivé"}
                            </p>
                          </div>
                          <Switch
                            id="isActive"
                            checked={templateIsActive}
                            onCheckedChange={setTemplateIsActive}
                          />
                        </div>
                        {templateIsActive && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-xs text-green-800">
                              ✓ Ce template sera utilisé pour les bons cadeaux
                              de type <strong>{templateProductType}</strong>
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          🏢 Identité du Restaurant
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="restaurantLogoType">
                            Type d&apos;affichage du nom
                          </Label>
                          <Select
                            value={styles.restaurantLogoType}
                            onValueChange={(value: "text" | "logo") =>
                              handleStyleChange("restaurantLogoType", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Titre texte</SelectItem>
                              <SelectItem value="logo">Logo image</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {styles.restaurantLogoType === "text" ? (
                          <div>
                            <Label htmlFor="restaurantName">
                              Nom du Restaurant
                            </Label>
                            <Input
                              id="restaurantName"
                              value={styles.restaurantName}
                              onChange={(e) =>
                                handleStyleChange(
                                  "restaurantName",
                                  e.target.value
                                )
                              }
                              placeholder="Nom de votre restaurant"
                            />
                          </div>
                        ) : (
                          <div>
                            <Label htmlFor="restaurantLogo">
                              Logo du Restaurant
                            </Label>
                            <div className="space-y-2">
                              {styles.restaurantLogoUrl && (
                                <div className="flex items-center space-x-2">
                                  <div className="relative h-12 w-24">
                                    <Image
                                      src={styles.restaurantLogoUrl}
                                      alt="Logo restaurant"
                                      fill
                                      className="object-contain border rounded"
                                    />
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleStyleChange("restaurantLogoUrl", "")
                                    }
                                  >
                                    Supprimer
                                  </Button>
                                </div>
                              )}
                              <ImageUpload
                                onImageUpload={(url) =>
                                  handleStyleChange("restaurantLogoUrl", url)
                                }
                                accept="image/jpeg,image/png,image/svg+xml"
                              />
                              <p className="text-xs text-gray-500">
                                Formats acceptés : JPEG, PNG, SVG (max 2MB)
                              </p>
                            </div>
                          </div>
                        )}
                        <div>
                          <Label>Sous-titre</Label>
                          <div className="border rounded">
                            <ShadcnEditor
                              editorSerializedState={
                                styles.restaurantSubtitleState ||
                                htmlToSerialized(styles.restaurantSubtitle)
                              }
                              onSerializedChange={(value) =>
                                setStyles((prev) => ({
                                  ...prev,
                                  restaurantSubtitleState: value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Titre du Bon Cadeau</Label>
                          <div className="border rounded">
                            <ShadcnEditor
                              editorSerializedState={
                                styles.giftCardTitleState ||
                                htmlToSerialized(styles.giftCardTitle)
                              }
                              onSerializedChange={(value) =>
                                setStyles((prev) => ({
                                  ...prev,
                                  giftCardTitleState: value,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          💬 Messages Personnalisés
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Message d&apos;Accueil</Label>
                          <div className="border rounded">
                            <ShadcnEditor
                              editorSerializedState={
                                styles.welcomeMessageState ||
                                htmlToSerialized(styles.welcomeMessage)
                              }
                              onSerializedChange={(value) =>
                                setStyles((prev) => ({
                                  ...prev,
                                  welcomeMessageState: value,
                                }))
                              }
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Utilisez {"{{ recipientName }}"} pour le nom du
                            destinataire
                          </p>
                        </div>
                        <div>
                          <Label>Message de Validité</Label>
                          <div className="border rounded">
                            <ShadcnEditor
                              editorSerializedState={
                                styles.validityMessageState ||
                                htmlToSerialized(styles.validityMessage)
                              }
                              onSerializedChange={(value) =>
                                setStyles((prev) => ({
                                  ...prev,
                                  validityMessageState: value,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          📞 Informations de Contact
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Titre du Pied de Page</Label>
                          <div className="border rounded">
                            <ShadcnEditor
                              editorSerializedState={
                                styles.footerTitleState ||
                                htmlToSerialized(styles.footerTitle)
                              }
                              onSerializedChange={(value) =>
                                setStyles((prev) => ({
                                  ...prev,
                                  footerTitleState: value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Informations de Contact</Label>
                          <div className="border rounded">
                            <ShadcnEditor
                              editorSerializedState={
                                styles.contactInfoState ||
                                htmlToSerialized(styles.contactInfo)
                              }
                              onSerializedChange={(value) =>
                                setStyles((prev) => ({
                                  ...prev,
                                  contactInfoState: value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Horaires d&apos;Ouverture</Label>
                          <div className="border rounded">
                            <ShadcnEditor
                              editorSerializedState={
                                styles.openingHoursState ||
                                htmlToSerialized(styles.openingHours)
                              }
                              onSerializedChange={(value) =>
                                setStyles((prev) => ({
                                  ...prev,
                                  openingHoursState: value,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          🎁 Icône du Bon Cadeau
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-4 gap-2">
                          {GIFT_ICONS.map((icon) => (
                            <Button
                              key={icon}
                              variant={
                                styles.giftIcon === icon ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                handleStyleChange("giftIcon", icon)
                              }
                              className="text-lg"
                            >
                              {icon}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent
                value="colors"
                className="flex-1 min-h-0 mt-0 overflow-hidden"
              >
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    <ColorPresets
                      onPresetSelect={(preset) => {
                        setStyles((prev) => ({
                          ...prev,
                          ...preset,
                        }));
                      }}
                    />

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          🎨 Palette de Couleurs
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="primaryColor">
                            Couleur Principale
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="primaryColor"
                              type="color"
                              value={styles.primaryColor}
                              onChange={(e) =>
                                handleStyleChange(
                                  "primaryColor",
                                  e.target.value
                                )
                              }
                              className="w-12 h-8 p-1"
                            />
                            <Input
                              value={styles.primaryColor}
                              onChange={(e) =>
                                handleStyleChange(
                                  "primaryColor",
                                  e.target.value
                                )
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="secondaryColor">
                            Couleur Secondaire
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="secondaryColor"
                              type="color"
                              value={styles.secondaryColor}
                              onChange={(e) =>
                                handleStyleChange(
                                  "secondaryColor",
                                  e.target.value
                                )
                              }
                              className="w-12 h-8 p-1"
                            />
                            <Input
                              value={styles.secondaryColor}
                              onChange={(e) =>
                                handleStyleChange(
                                  "secondaryColor",
                                  e.target.value
                                )
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="backgroundColor">
                            Couleur de Fond
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="backgroundColor"
                              type="color"
                              value={styles.backgroundColor}
                              onChange={(e) =>
                                handleStyleChange(
                                  "backgroundColor",
                                  e.target.value
                                )
                              }
                              className="w-12 h-8 p-1"
                            />
                            <Input
                              value={styles.backgroundColor}
                              onChange={(e) =>
                                handleStyleChange(
                                  "backgroundColor",
                                  e.target.value
                                )
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="accentColor">
                            Couleur d&apos;Accent
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="accentColor"
                              type="color"
                              value={styles.accentColor}
                              onChange={(e) =>
                                handleStyleChange("accentColor", e.target.value)
                              }
                              className="w-12 h-8 p-1"
                            />
                            <Input
                              value={styles.accentColor}
                              onChange={(e) =>
                                handleStyleChange("accentColor", e.target.value)
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent
                value="layout"
                className="flex-1 min-h-0 mt-0 overflow-hidden"
              >
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          📝 Typographie
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="titleFont">Police du Titre</Label>
                          <Select
                            value={styles.titleFont}
                            onValueChange={(value) =>
                              handleStyleChange("titleFont", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {FONT_OPTIONS.map((font) => (
                                <SelectItem key={font.value} value={font.value}>
                                  {font.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="bodyFont">Police du Corps</Label>
                          <Select
                            value={styles.bodyFont}
                            onValueChange={(value) =>
                              handleStyleChange("bodyFont", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {FONT_OPTIONS.map((font) => (
                                <SelectItem key={font.value} value={font.value}>
                                  {font.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="titleSize">
                            Taille du Titre (px)
                          </Label>
                          <Input
                            id="titleSize"
                            type="number"
                            value={styles.titleSize}
                            onChange={(e) =>
                              handleStyleChange(
                                "titleSize",
                                parseInt(e.target.value)
                              )
                            }
                            min="16"
                            max="48"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bodySize">Taille du Corps (px)</Label>
                          <Input
                            id="bodySize"
                            type="number"
                            value={styles.bodySize}
                            onChange={(e) =>
                              handleStyleChange(
                                "bodySize",
                                parseInt(e.target.value)
                              )
                            }
                            min="10"
                            max="20"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          📏 Espacements
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="borderRadius">
                            Rayon des Bordures (px)
                          </Label>
                          <Input
                            id="borderRadius"
                            type="number"
                            value={styles.borderRadius}
                            onChange={(e) =>
                              handleStyleChange(
                                "borderRadius",
                                parseInt(e.target.value)
                              )
                            }
                            min="0"
                            max="30"
                          />
                        </div>
                        <div>
                          <Label htmlFor="padding">
                            Espacement Interne (px)
                          </Label>
                          <Input
                            id="padding"
                            type="number"
                            value={styles.padding}
                            onChange={(e) =>
                              handleStyleChange(
                                "padding",
                                parseInt(e.target.value)
                              )
                            }
                            min="10"
                            max="50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="margin">Marge Externe (px)</Label>
                          <Input
                            id="margin"
                            type="number"
                            value={styles.margin}
                            onChange={(e) =>
                              handleStyleChange(
                                "margin",
                                parseInt(e.target.value)
                              )
                            }
                            min="0"
                            max="30"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent
                value="images"
                className="flex-1 min-h-0 mt-0 overflow-hidden"
              >
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    <ImageUpload
                      label="Logo du Restaurant"
                      currentImage={styles.logoUrl}
                      onImageUpload={(url) => handleStyleChange("logoUrl", url)}
                    />

                    <ImageUpload
                      label="Image de Fond"
                      currentImage={styles.backgroundImage}
                      onImageUpload={(url) =>
                        handleStyleChange("backgroundImage", url)
                      }
                    />
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent
                value="preview"
                className="flex-1 min-h-0 mt-0 overflow-hidden"
              >
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          👁️ Prévisualisation en temps réel
                        </h3>
                        <p className="text-sm text-gray-500">
                          Aperçu de votre template PDF
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Zoom</label>
                        <select
                          className="h-9 rounded border px-3 text-sm bg-white"
                          value={previewScale}
                          onChange={(e) =>
                            setPreviewScale(parseFloat(e.target.value))
                          }
                        >
                          <option value={0.5}>50%</option>
                          <option value={0.6}>60%</option>
                          <option value={0.7}>70%</option>
                          <option value={0.8}>80%</option>
                          <option value={0.9}>90%</option>
                          <option value={1}>100%</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-center bg-gray-100 p-8 rounded-lg">
                      <div
                        className="bg-white rounded shadow-lg inline-block origin-top-left"
                        style={{
                          transform: `scale(${previewScale})`,
                          transformOrigin: "top center",
                        }}
                      >
                        <iframe
                          srcDoc={generatePreviewHTML()}
                          className="w-[720px] h-[980px] border-0 rounded"
                          title="Prévisualisation Template"
                        />
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
