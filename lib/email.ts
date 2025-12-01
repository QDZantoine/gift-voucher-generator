import { Resend } from "resend";

// Types d'erreurs Resend spécifiques
interface ResendError {
  name: string;
  message: string;
}

// Configuration Resend avec lazy initialization
let resendInstance: Resend | null = null;

function getResendInstance(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is required");
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

// Interface améliorée pour les données d'email
export interface EmailData {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
  tags?: Array<{
    name: string;
    value: string;
  }>;
  headers?: Record<string, string>;
  replyTo?: string;
}

// Interface pour le résultat d'envoi
export interface EmailResult {
  success: boolean;
  emailId?: string;
  error?: string;
  retryCount?: number;
}

// Validation des emails
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Fonction d'envoi d'email avec retry logic et gestion d'erreurs avancée
export async function sendEmailWithRetry(
  emailData: EmailData,
  maxRetries: number = 3
): Promise<EmailResult> {
  // Vérifier la configuration Resend
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("❌ RESEND_API_KEY n'est pas configurée");
    return {
      success: false,
      error: "RESEND_API_KEY environment variable is required",
      retryCount: 0,
    };
  }

  // Mode test si la clé Resend est une clé de test
  if (apiKey.startsWith("re_test_")) {
    console.warn(
      "⚠️ Mode TEST activé - Les emails ne seront pas réellement envoyés"
    );
    console.warn(
      "   Utilisez une clé de production (re_live_...) pour envoyer de vrais emails"
    );
    // Simuler un délai d'envoi
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      emailId: `test-${Date.now()}`,
      retryCount: 0,
    };
  }

  console.log("📧 Tentative d'envoi d'email via Resend...");
  console.log(
    `   De: ${process.env.EMAIL_FROM || "noreply@influences-bayonne.fr"}`
  );
  console.log(
    `   À: ${
      Array.isArray(emailData.to) ? emailData.to.join(", ") : emailData.to
    }`
  );
  console.log(`   Sujet: ${emailData.subject}`);

  const resend = getResendInstance();

  // Validation des emails
  const recipients = Array.isArray(emailData.to)
    ? emailData.to
    : [emailData.to];
  for (const email of recipients) {
    if (!validateEmail(email)) {
      return {
        success: false,
        error: `Invalid email address: ${email}`,
      };
    }
  }

  // Configuration de l'email avec bonnes pratiques
  // Utiliser EMAIL_FROM de .env (important pour la production avec domaine vérifié)
  const defaultFrom =
    process.env.EMAIL_FROM ||
    "Restaurant Influences <noreply@influences-bayonne.fr>";
  const defaultReplyTo =
    process.env.EMAIL_REPLY_TO || "contact@influences-bayonne.fr";

  const emailOptions = {
    from: defaultFrom,
    to: recipients,
    subject: emailData.subject,
    html: emailData.html,
    text: emailData.text,
    attachments: emailData.attachments,
    tags: [
      { name: "category", value: "gift_card" },
      { name: "source", value: "restaurant_influences" },
      ...(emailData.tags || []),
    ].map((tag) => ({
      name: tag.name.replace(/[^a-zA-Z0-9_-]/g, "_"),
      value: tag.value.replace(/[^a-zA-Z0-9_-]/g, "_"),
    })),
    headers: {
      "X-Entity-Ref-ID": `gift-card-${Date.now()}`,
      ...emailData.headers,
    },
    replyTo: emailData.replyTo || defaultReplyTo,
  };

  // Retry logic avec gestion d'erreurs spécifiques
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📤 Tentative ${attempt}/${maxRetries} d'envoi d'email...`);
      const { data, error } = await resend.emails.send(emailOptions);

      if (!error && data) {
        console.log(`✅ Email envoyé avec succès! ID: ${data.id}`);
        return {
          success: true,
          emailId: data.id,
          retryCount: attempt - 1,
        };
      }

      // Gestion des erreurs spécifiques
      // L'erreur Resend peut avoir différentes structures
      console.error(`❌ Erreur Resend (tentative ${attempt}):`, {
        error: error,
        errorType: typeof error,
        errorString: JSON.stringify(error, null, 2),
      });

      const resendError = error as ResendError;

      // Si l'erreur n'a pas de structure attendue, logger tout
      if (!resendError.name && !resendError.message) {
        console.error("❌ Structure d'erreur inattendue:", error);
        return {
          success: false,
          error: `Unexpected error: ${JSON.stringify(error)}`,
          retryCount: attempt - 1,
        };
      }

      // Erreurs de validation - ne pas retry
      if (resendError.name === "validation_error") {
        console.error(
          "❌ Erreur de validation - pas de retry:",
          resendError.message
        );
        return {
          success: false,
          error: `Validation error: ${resendError.message}`,
          retryCount: attempt - 1,
        };
      }

      // Champs manquants - ne pas retry
      if (resendError.name === "missing_required_field") {
        console.error("❌ Champ requis manquant:", resendError.message);
        return {
          success: false,
          error: `Missing required field: ${resendError.message}`,
          retryCount: attempt - 1,
        };
      }

      // Erreurs d'application - retry possible
      if (resendError.name === "application_error" && attempt < maxRetries) {
        const delay = 1000 * Math.pow(2, attempt - 1); // Exponential backoff
        console.warn(
          `⚠️ Tentative ${attempt} échouée, retry dans ${delay}ms:`,
          resendError.message
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Autres erreurs ou max retries atteint
      console.error(
        `❌ Échec définitif après ${attempt} tentatives:`,
        resendError.message
      );
      return {
        success: false,
        error: resendError.message,
        retryCount: attempt - 1,
      };
    } catch (error) {
      console.error(`❌ Erreur inattendue (tentative ${attempt}):`, error);

      if (attempt === maxRetries) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          retryCount: attempt - 1,
        };
      }

      // Attendre avant le prochain retry
      const delay = 1000 * attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return {
    success: false,
    error: "Max retries exceeded",
    retryCount: maxRetries,
  };
}

// Fonction d'envoi d'email simple (backward compatibility)
export async function sendEmail(emailData: EmailData) {
  const result = await sendEmailWithRetry(emailData);

  if (!result.success) {
    throw new Error(result.error || "Failed to send email");
  }

  return { id: result.emailId };
}

// Template HTML pour l'email de bon cadeau
export function generateGiftCardEmailHTML(giftCard: {
  code: string;
  productType: string;
  numberOfPeople: number;
  recipientName: string;
  amount: number;
  expiryDate: string;
  purchaseDate: string;
  customMessage?: string;
}) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Votre Bon Cadeau Restaurant Influences</title>
      <style>
        body {
          font-family: 'Lato', Arial, sans-serif;
          line-height: 1.6;
          color: #1A2B4B;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #F8F7F2;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background: linear-gradient(135deg, #F8F7F2 0%, #F0EFE8 100%);
          border-radius: 10px;
        }
        .logo {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: bold;
          color: #1A2B4B;
          margin-bottom: 5px;
        }
        .subtitle {
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #1A2B4B;
          opacity: 0.7;
        }
        .gift-card {
          background: white;
          border-radius: 15px;
          padding: 30px;
          margin: 20px 0;
          box-shadow: 0 10px 30px rgba(26, 43, 75, 0.1);
          text-align: center;
        }
        .gift-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }
        .code {
          font-family: 'Courier New', monospace;
          font-size: 24px;
          font-weight: bold;
          color: #1A2B4B;
          background: #F8F7F2;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          letter-spacing: 2px;
        }
        .details {
          text-align: left;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px solid #F0EFE8;
        }
        .detail-label {
          font-weight: 600;
          color: #1A2B4B;
        }
        .detail-value {
          color: #1A2B4B;
        }
        .amount {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: bold;
          color: #1A2B4B;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding: 20px;
          background: #1A2B4B;
          color: white;
          border-radius: 10px;
        }
        .footer h3 {
          font-family: 'Playfair Display', serif;
          margin-bottom: 15px;
        }
        .contact-info {
          font-size: 14px;
          line-height: 1.8;
        }
        .validity {
          background: #FFF3CD;
          border: 1px solid #FFEAA7;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          text-align: center;
        }
        .validity strong {
          color: #856404;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">influences</div>
        <div class="subtitle">Cuisine Moderne</div>
      </div>

      <div class="gift-card">
        <div class="gift-icon">🎁</div>
        <h1 style="font-family: 'Playfair Display', serif; color: #1A2B4B; margin-bottom: 20px;">
          Votre Bon Cadeau
        </h1>
        
        <div class="code">${giftCard.code}</div>
        
        <div class="amount">${giftCard.amount.toFixed(2)} €</div>
        
        ${
          giftCard.customMessage
            ? `
        <div class="validity" style="background: #E8F5E8; border-color: #4CAF50; margin: 20px 0;">
          <strong>💌 Message personnalisé :</strong><br>
          "${giftCard.customMessage}"
        </div>
        `
            : ""
        }
        
        <div class="details">
          <div class="detail-row">
            <span class="detail-label">Destinataire :</span>
            <span class="detail-value">${giftCard.recipientName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Menu :</span>
            <span class="detail-value">${giftCard.productType}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Nombre de personnes :</span>
            <span class="detail-value">${giftCard.numberOfPeople}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date d'achat :</span>
            <span class="detail-value">${new Date(
              giftCard.purchaseDate
            ).toLocaleDateString("fr-FR")}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date d'expiration :</span>
            <span class="detail-value">${new Date(
              giftCard.expiryDate
            ).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>

        <div class="validity">
          <strong>⚠️ Important :</strong><br>
          Ce bon cadeau est valable 1 an à partir de la date d'achat.<br>
          Il n'est pas valable pendant les périodes spéciales (Féria de Bayonne, Nouvel An, Noël, Saint-Valentin).
        </div>
      </div>

      <div class="footer">
        <h3>Restaurant Influences</h3>
        <div class="contact-info">
          19 Rue Vieille Boucherie<br>
          64100 Bayonne<br>
          05 59 01 75 04<br><br>
          <strong>Horaires :</strong><br>
          Du Mardi au Samedi Soir<br>
          Vendredi et Samedi Midi
        </div>
      </div>
    </body>
    </html>
  `;
}

// Template HTML pour l'email de confirmation d'achat (pour l'acheteur)
export function generatePurchaseConfirmationEmailHTML(data: {
  purchaserName: string;
  recipientName: string;
  recipientEmail: string;
  code: string;
  productType: string;
  numberOfPeople: number;
  amount: number;
  expiryDate: string;
  purchaseDate: string;
  customMessage?: string;
}) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de votre achat - Restaurant Influences</title>
      <style>
        body {
          font-family: 'Lato', Arial, sans-serif;
          line-height: 1.6;
          color: #1A2B4B;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #F8F7F2;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background: linear-gradient(135deg, #F8F7F2 0%, #F0EFE8 100%);
          border-radius: 10px;
        }
        .logo {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: bold;
          color: #1A2B4B;
          margin-bottom: 5px;
        }
        .subtitle {
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #1A2B4B;
          opacity: 0.7;
        }
        .confirmation-card {
          background: white;
          border-radius: 15px;
          padding: 30px;
          margin: 20px 0;
          box-shadow: 0 10px 30px rgba(26, 43, 75, 0.1);
        }
        .success-icon {
          font-size: 48px;
          text-align: center;
          margin-bottom: 20px;
        }
        .details {
          text-align: left;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px solid #F0EFE8;
        }
        .detail-label {
          font-weight: 600;
          color: #1A2B4B;
        }
        .detail-value {
          color: #1A2B4B;
        }
        .amount {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: bold;
          color: #1A2B4B;
          margin: 20px 0;
          text-align: center;
        }
        .info-box {
          background: #E8F5E8;
          border: 1px solid #4CAF50;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding: 20px;
          background: #1A2B4B;
          color: white;
          border-radius: 10px;
        }
        .footer h3 {
          font-family: 'Playfair Display', serif;
          margin-bottom: 15px;
        }
        .contact-info {
          font-size: 14px;
          line-height: 1.8;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">influences</div>
        <div class="subtitle">Cuisine Moderne</div>
      </div>

      <div class="confirmation-card">
        <div class="success-icon">✅</div>
        <h1 style="font-family: 'Playfair Display', serif; color: #1A2B4B; margin-bottom: 20px; text-align: center;">
          Merci pour votre achat !
        </h1>
        
        <p style="text-align: center; color: #1A2B4B; margin-bottom: 30px;">
          Bonjour ${data.purchaserName},<br><br>
          Votre bon cadeau a été créé avec succès et envoyé au destinataire.
        </p>
        
        <div class="amount">${data.amount.toFixed(2)} €</div>
        
        <div class="details">
          <div class="detail-row">
            <span class="detail-label">Code du bon cadeau :</span>
            <span class="detail-value" style="font-family: 'Courier New', monospace; font-weight: bold;">${
              data.code
            }</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Menu :</span>
            <span class="detail-value">${data.productType}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Nombre de personnes :</span>
            <span class="detail-value">${data.numberOfPeople}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date d'achat :</span>
            <span class="detail-value">${new Date(
              data.purchaseDate
            ).toLocaleDateString("fr-FR")}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date d'expiration :</span>
            <span class="detail-value">${new Date(
              data.expiryDate
            ).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>

        ${
          data.customMessage
            ? `
        <div class="info-box">
          <strong>💌 Message personnalisé :</strong><br>
          "${data.customMessage}"
        </div>
        `
            : ""
        }

        <div class="info-box">
          <strong>📧 Email envoyé</strong><br>
          Le bon cadeau avec le PDF a été envoyé au destinataire.
        </div>
      </div>

      <div class="footer">
        <h3>Restaurant Influences</h3>
        <div class="contact-info">
          19 Rue Vieille Boucherie<br>
          64100 Bayonne<br>
          05 59 01 75 04<br><br>
          <strong>Horaires :</strong><br>
          Du Mardi au Samedi Soir<br>
          Vendredi et Samedi Midi
        </div>
      </div>
    </body>
    </html>
  `;
}
