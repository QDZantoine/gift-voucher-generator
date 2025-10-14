import puppeteer from "puppeteer";
import {
  PDFTemplate,
  DEFAULT_TEMPLATES,
  replaceTemplateVariables,
  GiftCardTemplateData,
} from "./pdf-templates";

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
}

export async function generateGiftCardPDF(
  giftCard: GiftCardData
): Promise<Buffer> {
  // Trouver le template approprié
  let template: PDFTemplate | undefined;

  if (giftCard.templateId) {
    // Utiliser un template spécifique
    const defaultTemplates = DEFAULT_TEMPLATES.map((t, index) => ({
      ...t,
      id: `template-${index}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    template = defaultTemplates.find((t) => t.id === giftCard.templateId);
  } else {
    // Trouver le template par type de produit
    const defaultTemplates = DEFAULT_TEMPLATES.map((t, index) => ({
      ...t,
      id: `template-${index}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    template = defaultTemplates.find(
      (t) => t.productType === giftCard.productType && t.isActive
    );
  }

  // Fallback vers le template par défaut
  if (!template) {
    template = DEFAULT_TEMPLATES.map((t, index) => ({
      ...t,
      id: `template-${index}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))[0];
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
  const processedHtml = replaceTemplateVariables(template.html, templateData);

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bon Cadeau Restaurant Influences</title>
        <style>${template.css}</style>
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
