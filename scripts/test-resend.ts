import "dotenv/config";
import { Resend } from "resend";

async function testResend() {
  console.log("🧪 Test de configuration Resend\n");

  // 1. Vérifier la clé API
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("❌ RESEND_API_KEY n'est pas définie dans .env");
    console.log("\n💡 Solution:");
    console.log("   1. Allez sur https://resend.com/api-keys");
    console.log("   2. Créez une nouvelle clé API");
    console.log("   3. Ajoutez-la dans votre .env: RESEND_API_KEY=re_...");
    process.exit(1);
  }

  console.log("✅ RESEND_API_KEY trouvée");
  const keyType = apiKey.startsWith("re_test_") 
    ? "TEST (⚠️ les emails ne seront pas envoyés)" 
    : apiKey.startsWith("re_live_") 
    ? "PRODUCTION" 
    : apiKey.startsWith("re_")
    ? "PRODUCTION (nouveau format)"
    : "INCONNU";
  console.log(`   Type: ${keyType}`);
  console.log(`   Préfixe: ${apiKey.substring(0, 10)}...\n`);

  // 2. Vérifier EMAIL_FROM
  const emailFrom = process.env.EMAIL_FROM || "Restaurant Influences <noreply@influences-bayonne.fr>";
  console.log(`📧 EMAIL_FROM: ${emailFrom}\n`);

  // 3. Tester l'envoi
  const resend = new Resend(apiKey);
  
  const testEmail = process.env.TEST_EMAIL || "test@example.com";
  console.log(`📤 Tentative d'envoi d'un email de test à: ${testEmail}`);
  console.log("   (Si vous utilisez une clé de test, l'email ne sera pas envoyé)\n");

  try {
    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: [testEmail],
      subject: "Test Resend - Influences Bayonne",
      html: "<h1>Test d'envoi d'email</h1><p>Si vous recevez cet email, Resend fonctionne correctement!</p>",
    });

    if (error) {
      console.error("❌ Erreur lors de l'envoi:");
      console.error(JSON.stringify(error, null, 2));
      
      // Erreurs communes
      if (typeof error === 'object' && error !== null) {
        const err = error as any;
        if (err.message?.includes("domain")) {
          console.log("\n💡 Solution: Votre domaine n'est pas vérifié");
          console.log("   1. Allez sur https://resend.com/domains");
          console.log("   2. Vérifiez que 'influences-bayonne.fr' est vérifié");
          console.log("   3. Si non, ajoutez les enregistrements DNS requis");
        }
        if (err.message?.includes("API key")) {
          console.log("\n💡 Solution: Votre clé API est invalide");
          console.log("   1. Allez sur https://resend.com/api-keys");
          console.log("   2. Vérifiez que la clé est active");
          console.log("   3. Créez une nouvelle clé si nécessaire");
        }
      }
      process.exit(1);
    }

    if (data) {
      console.log("✅ Email envoyé avec succès!");
      console.log(`   ID: ${data.id}`);
      console.log("\n💡 Vérifiez:");
      console.log("   1. Votre boîte email (et les spams)");
      console.log("   2. Le dashboard Resend: https://resend.com/emails");
    }
  } catch (error) {
    console.error("❌ Exception lors de l'envoi:");
    console.error(error);
    process.exit(1);
  }
}

testResend();

