import puppeteer from "puppeteer";
import {
  PDFTemplate,
  DEFAULT_TEMPLATES,
  replaceTemplateVariables,
  GiftCardTemplateData,
} from "./pdf-templates";
import { getPrismaClient } from "./prisma";

export interface GiftCardData {
  code: string;
  productType: string;
  numberOfPeople: number;
  recipientName: string;
  amount: number;
  expiryDate: string;
  purchaseDate: string;
  customMessage?: string;
  templateId?: string;
  // Template personnalisé (utilisé si fourni, sinon recherche par ID/productType)
  template?: {
    html: string;
    css: string;
  };
}

export async function generateGiftCardPDF(
  giftCard: GiftCardData
): Promise<Buffer> {
  let templateHtml: string;
  let templateCss: string;

  // Si un template personnalisé est fourni, l'utiliser directement
  if (giftCard.template) {
    templateHtml = giftCard.template.html;
    templateCss = giftCard.template.css;
  } else {
    // Sinon, trouver le template approprié
    let template: PDFTemplate | undefined;

    // 1. Chercher d'abord dans la base de données
    if (giftCard.templateId) {
      try {
        const db = getPrismaClient();
        const dbTemplate = await db.pDFTemplate.findUnique({
          where: { id: giftCard.templateId },
        });

        if (dbTemplate) {
          template = {
            id: dbTemplate.id,
            name: dbTemplate.name,
            description: dbTemplate.description || "",
            productType: dbTemplate.productType,
            html: dbTemplate.html,
            css: dbTemplate.css,
            variables: [], // Pas utilisé pour l'instant
            isActive: dbTemplate.isActive,
            createdAt: dbTemplate.createdAt,
            updatedAt: dbTemplate.updatedAt,
          };
        }
      } catch (error) {
        console.error("Error fetching template from database:", error);
      }
    }

    // 2. Si pas trouvé en BDD, chercher dans les templates par défaut
    if (!template) {
      const defaultTemplates = DEFAULT_TEMPLATES.map((t, index) => ({
        ...t,
        id: `template-${index}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      if (giftCard.templateId) {
        // Chercher par ID dans les templates par défaut
        template = defaultTemplates.find((t) => t.id === giftCard.templateId);
      } else {
        // Chercher par type de produit
        template = defaultTemplates.find(
          (t) => t.productType === giftCard.productType && t.isActive
        );
      }
    }

    // 3. Fallback vers le premier template par défaut
    if (!template) {
      template = DEFAULT_TEMPLATES.map((t, index) => ({
        ...t,
        id: `template-${index}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))[0];
    }

    templateHtml = template.html;
    templateCss = template.css;
  }

  // Préparer les données pour le template
  const templateData: GiftCardTemplateData = {
    code: giftCard.code,
    productType: giftCard.productType,
    numberOfPeople: giftCard.numberOfPeople,
    recipientName: giftCard.recipientName,
    amount: giftCard.amount,
    expiryDate: giftCard.expiryDate,
    purchaseDate: giftCard.purchaseDate,
    customMessage: giftCard.customMessage,
  };

  // Remplacer les variables dans le template
  const processedHtml = replaceTemplateVariables(templateHtml, templateData);

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bon Cadeau Restaurant Influences</title>
        <style>${templateCss}</style>
    </head>
    <body>${processedHtml}</body>
    </html>
  `;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0.15in",
        right: "0.15in",
        bottom: "0.15in",
        left: "0.15in",
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
