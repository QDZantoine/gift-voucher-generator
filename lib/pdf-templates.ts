export interface PDFTemplate {
  id: string;
  name: string;
  productType: string;
  description: string;
  html: string;
  css: string;
  variables: TemplateVariable[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateVariable {
  name: string;
  key: string;
  type: "text" | "number" | "date" | "currency";
  defaultValue: string;
  description: string;
  required: boolean;
}

export interface GiftCardTemplateData {
  code: string;
  productType: string;
  numberOfPeople: number;
  recipientName: string;
  amount: number;
  expiryDate: string;
  purchaseDate: string;
  customMessage?: string;
}

// Templates par défaut
export const DEFAULT_TEMPLATES: Omit<
  PDFTemplate,
  "id" | "createdAt" | "updatedAt"
>[] = [
  {
    name: "Menu Influences - Classique",
    productType: "Menu Influences",
    description: "Template élégant pour le menu principal",
    isActive: true,
    variables: [
      {
        name: "Message personnalisé",
        key: "customMessage",
        type: "text",
        defaultValue: "",
        description: "Message optionnel du donateur",
        required: false,
      },
    ],
    html: `
      <div class="container">
        <div class="header">
          <div class="logo">influences</div>
          <div class="subtitle">Cuisine Moderne</div>
        </div>
        
        <div class="content">
          <span class="gift-icon">🎁</span>
          <h1 class="title">Bon Cadeau</h1>
          
          <div class="code">{{code}}</div>
          
          <div class="amount">{{amount}} €</div>
          
          <p class="message">Cher(e) {{recipientName}},<br>
          Vous avez reçu un bon cadeau du Restaurant Influences.<br>
          Préparez-vous à une expérience culinaire inoubliable !</p>
          
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
              ⚠️ <strong>Important :</strong> Ce bon cadeau est valable 1 an à partir de la date d'achat.<br>
              Il n'est pas valable pendant les périodes spéciales (Féria de Bayonne, Nouvel An, Noël, Saint-Valentin).
            </p>
          </div>
        </div>
        
        <div class="footer">
          <h3 class="footer-title">Restaurant Influences</h3>
          <div class="contact-info">
            19 Rue Vieille Boucherie<br>
            64100 Bayonne<br>
            05 59 01 75 04<br><br>
            <strong>Horaires :</strong><br>
            Du Mardi au Samedi Soir<br>
            Vendredi et Samedi Midi
          </div>
        </div>
      </div>
    `,
    css: `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400;700&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Lato', sans-serif;
        background-color: #F8F7F2;
        color: #1A2B4B;
        padding: 8px;
        line-height: 1.3;
        page-break-inside: avoid;
      }
      
      .container {
        max-width: 90%;
        width: 100%;
        margin: 0 auto;
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(26, 43, 75, 0.1);
        page-break-inside: avoid;
      }
      
      .header {
        background: linear-gradient(135deg, #1A2B4B 0%, #2C3E50 100%);
        color: #F8F7F2;
        padding: 20px;
        text-align: center;
        page-break-inside: avoid;
      }
      
      .logo {
        font-family: 'Playfair Display', serif;
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 6px;
        letter-spacing: 1px;
      }
      
      .subtitle {
        font-size: 11px;
        letter-spacing: 2px;
        text-transform: uppercase;
        opacity: 0.8;
        font-weight: 300;
      }
      
      .content {
        padding: 25px;
        text-align: center;
        page-break-inside: avoid;
      }
      
      .gift-icon {
        font-size: 45px;
        margin-bottom: 12px;
        display: block;
      }
      
      .title {
        font-family: 'Playfair Display', serif;
        font-size: 26px;
        color: #1A2B4B;
        margin-bottom: 16px;
        font-weight: 700;
      }
      
      .code {
        font-family: 'Courier New', monospace;
        font-size: 20px;
        font-weight: bold;
        color: #1A2B4B;
        background-color: #F8F7F2;
        padding: 12px 20px;
        border-radius: 8px;
        display: inline-block;
        margin-bottom: 15px;
        letter-spacing: 2px;
        border: 2px solid #E0E0E0;
      }
      
      .amount {
        font-family: 'Playfair Display', serif;
        font-size: 32px;
        font-weight: bold;
        color: #1A2B4B;
        margin: 15px 0;
      }
      
      .message {
        font-size: 14px;
        margin: 15px 0;
        color: #1A2B4B;
        font-style: italic;
        line-height: 1.4;
      }
      
      .custom-message {
        background-color: #FFF3CD;
        border: 2px solid #FFEAA7;
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
        background-color: #F8F7F2;
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
        color: #1A2B4B;
      }
      
      .detail-value {
        color: #1A2B4B;
      }
      
      .validity {
        background-color: #FFF3CD;
        border: 2px solid #FFEAA7;
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
      }
      
      .footer {
        background: linear-gradient(135deg, #1A2B4B 0%, #2C3E50 100%);
        color: #F8F7F2;
        padding: 18px;
        text-align: center;
        page-break-inside: avoid;
        page-break-before: avoid;
      }
      
      .footer-title {
        font-family: 'Playfair Display', serif;
        font-size: 18px;
        margin-bottom: 10px;
        font-weight: 700;
      }
      
      .contact-info {
        font-size: 12px;
        line-height: 1.4;
        opacity: 0.9;
      }
      
      /* Contrôles de pagination */
      @media print {
        body {
          padding: 10px;
        }
        
        .container {
          max-width: 100%;
          margin: 0;
          box-shadow: none;
        }
        
        .header, .content, .footer {
          page-break-inside: avoid;
        }
        
        .footer {
          page-break-before: avoid;
        }
      }
    `,
  },
  {
    name: "Menu Dégustation - Premium",
    productType: "Menu Dégustation",
    description: "Template sophistiqué pour le menu dégustation",
    isActive: true,
    variables: [
      {
        name: "Message personnalisé",
        key: "customMessage",
        type: "text",
        defaultValue: "",
        description: "Message optionnel du donateur",
        required: false,
      },
    ],
    html: `
      <div class="container premium">
        <div class="header premium-header">
          <div class="logo">influences</div>
          <div class="subtitle">Menu Dégustation</div>
          <div class="premium-badge">PREMIUM</div>
        </div>
        
        <div class="content">
          <span class="gift-icon">🍽️</span>
          <h1 class="title">Bon Cadeau Dégustation</h1>
          
          <div class="code premium-code">{{code}}</div>
          
          <div class="amount premium-amount">{{amount}} €</div>
          
          <p class="message">Cher(e) {{recipientName}},<br>
          Vous avez reçu un bon cadeau pour une expérience gastronomique exceptionnelle.<br>
          Découvrez nos créations culinaires d'exception !</p>
          
          {{#if customMessage}}
          <div class="custom-message premium-message">
            <p><strong>Message personnalisé :</strong></p>
            <p class="message-text">{{customMessage}}</p>
          </div>
          {{/if}}
          
          <div class="details premium-details">
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
              ⚠️ <strong>Important :</strong> Ce bon cadeau est valable 1 an à partir de la date d'achat.<br>
              Il n'est pas valable pendant les périodes spéciales (Féria de Bayonne, Nouvel An, Noël, Saint-Valentin).
            </p>
          </div>
        </div>
        
        <div class="footer">
          <h3 class="footer-title">Restaurant Influences</h3>
          <div class="contact-info">
            19 Rue Vieille Boucherie<br>
            64100 Bayonne<br>
            05 59 01 75 04<br><br>
            <strong>Horaires :</strong><br>
            Du Mardi au Samedi Soir<br>
            Vendredi et Samedi Midi
          </div>
        </div>
      </div>
    `,
    css: `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400;700&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Lato', sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #1A2B4B;
        padding: 8px;
        line-height: 1.3;
        page-break-inside: avoid;
      }
      
      .container.premium {
        max-width: 90%;
        width: 100%;
        margin: 0 auto;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        border: 2px solid #667eea;
        page-break-inside: avoid;
      }
      
      .header.premium-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        text-align: center;
        position: relative;
        page-break-inside: avoid;
      }
      
      .premium-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        background: #FFD700;
        color: #1A2B4B;
        padding: 5px 10px;
        border-radius: 10px;
        font-weight: bold;
        font-size: 9px;
        letter-spacing: 1px;
      }
      
      .logo {
        font-family: 'Playfair Display', serif;
        font-size: 34px;
        font-weight: 700;
        margin-bottom: 6px;
        letter-spacing: 1px;
      }
      
      .subtitle {
        font-size: 12px;
        letter-spacing: 2px;
        text-transform: uppercase;
        opacity: 0.9;
        font-weight: 300;
      }
      
      .content {
        padding: 25px;
        text-align: center;
        page-break-inside: avoid;
      }
      
      .gift-icon {
        font-size: 45px;
        margin-bottom: 12px;
        display: block;
      }
      
      .title {
        font-family: 'Playfair Display', serif;
        font-size: 28px;
        color: #667eea;
        margin-bottom: 16px;
        font-weight: 700;
      }
      
      .code.premium-code {
        font-family: 'Courier New', monospace;
        font-size: 20px;
        font-weight: bold;
        color: #667eea;
        background: linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%);
        padding: 12px 20px;
        border-radius: 10px;
        display: inline-block;
        margin-bottom: 15px;
        letter-spacing: 2px;
        border: 2px solid #667eea;
      }
      
      .amount.premium-amount {
        font-family: 'Playfair Display', serif;
        font-size: 34px;
        font-weight: bold;
        color: #667eea;
        margin: 15px 0;
        text-shadow: 2px 2px 4px rgba(102, 126, 234, 0.3);
      }
      
      .message {
        font-size: 14px;
        margin: 15px 0;
        color: #1A2B4B;
        font-style: italic;
        line-height: 1.4;
      }
      
      .custom-message.premium-message {
        background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
        border: 2px solid #FFD700;
        border-radius: 10px;
        padding: 15px;
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
      
      .details.premium-details {
        background: linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%);
        border: 2px solid #667eea;
        border-radius: 12px;
        padding: 16px;
        margin: 18px 0;
        text-align: left;
        page-break-inside: avoid;
      }
      
      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
        border-bottom: 1px solid #667eea;
        font-size: 13px;
      }
      
      .detail-row:last-child {
        border-bottom: none;
      }
      
      .detail-label {
        font-weight: bold;
        color: #667eea;
      }
      
      .detail-value {
        color: #1A2B4B;
        font-weight: 500;
      }
      
      .validity {
        background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
        border: 2px solid #FFD700;
        border-radius: 10px;
        padding: 15px;
        margin: 16px 0;
        text-align: center;
        page-break-inside: avoid;
      }
      
      .validity-text {
        color: #856404;
        font-size: 12px;
        line-height: 1.3;
        font-weight: 500;
      }
      
      .footer {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 18px;
        text-align: center;
        page-break-inside: avoid;
        page-break-before: avoid;
      }
      
      .footer-title {
        font-family: 'Playfair Display', serif;
        font-size: 18px;
        margin-bottom: 10px;
        font-weight: 700;
      }
      
      .contact-info {
        font-size: 12px;
        line-height: 1.4;
        opacity: 0.9;
      }
      
      /* Contrôles de pagination */
      @media print {
        body {
          padding: 10px;
        }
        
        .container.premium {
          max-width: 100%;
          margin: 0;
          box-shadow: none;
        }
        
        .header, .content, .footer {
          page-break-inside: avoid;
        }
        
        .footer {
          page-break-before: avoid;
        }
      }
    `,
  },
];

// Fonction pour remplacer les variables dans le template
export function replaceTemplateVariables(
  template: string,
  data: GiftCardTemplateData,
  customTexts?: {
    restaurantName?: string;
    restaurantSubtitle?: string;
    giftCardTitle?: string;
    welcomeMessage?: string;
    validityMessage?: string;
    footerTitle?: string;
    contactInfo?: string;
    openingHours?: string;
    giftIcon?: string;
    restaurantLogoUrl?: string;
  }
): string {
  let result = template;

  // Variables de base
  result = result.replace(/\{\{code\}\}/g, data.code);
  result = result.replace(/\{\{productType\}\}/g, data.productType);
  result = result.replace(
    /\{\{numberOfPeople\}\}/g,
    data.numberOfPeople.toString()
  );
  result = result.replace(/\{\{recipientName\}\}/g, data.recipientName);
  result = result.replace(/\{\{amount\}\}/g, data.amount.toFixed(2));
  result = result.replace(
    /\{\{expiryDate\}\}/g,
    new Date(data.expiryDate).toLocaleDateString("fr-FR")
  );
  result = result.replace(
    /\{\{purchaseDate\}\}/g,
    new Date(data.purchaseDate).toLocaleDateString("fr-FR")
  );

  // Variables de texte personnalisées
  if (customTexts) {
    result = result.replace(
      /\{\{restaurantName\}\}/g,
      customTexts.restaurantName || "Restaurant"
    );
    result = result.replace(
      /\{\{restaurantSubtitle\}\}/g,
      customTexts.restaurantSubtitle || "Cuisine"
    );
    result = result.replace(
      /\{\{giftCardTitle\}\}/g,
      customTexts.giftCardTitle || "Bon Cadeau"
    );
    result = result.replace(/\{\{giftIcon\}\}/g, customTexts.giftIcon || "🎁");
    result = result.replace(
      /\{\{footerTitle\}\}/g,
      customTexts.footerTitle || "Restaurant"
    );
    result = result.replace(
      /\{\{contactInfo\}\}/g,
      customTexts.contactInfo || ""
    );
    result = result.replace(
      /\{\{openingHours\}\}/g,
      customTexts.openingHours || ""
    );
    result = result.replace(
      /\{\{restaurantLogoUrl\}\}/g,
      customTexts.restaurantLogoUrl || ""
    );

    // Messages avec remplacement des variables
    if (customTexts.welcomeMessage) {
      let welcomeMsg = customTexts.welcomeMessage;
      welcomeMsg = welcomeMsg.replace(
        /\{\{recipientName\}\}/g,
        data.recipientName
      );
      result = result.replace(/\{\{welcomeMessage\}\}/g, welcomeMsg);
    }

    if (customTexts.validityMessage) {
      result = result.replace(
        /\{\{validityMessage\}\}/g,
        customTexts.validityMessage
      );
    }
  }

  // Variables optionnelles
  if (data.customMessage) {
    result = result.replace(
      /\{\{#if customMessage\}\}([\s\S]*?)\{\{\/if\}\}/g,
      "$1"
    );
    result = result.replace(/\{\{customMessage\}\}/g, data.customMessage);
  } else {
    result = result.replace(
      /\{\{#if customMessage\}\}([\s\S]*?)\{\{\/if\}\}/g,
      ""
    );
  }

  return result;
}
