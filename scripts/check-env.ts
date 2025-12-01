import "dotenv/config";

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
  example?: string;
}

const requiredEnvVars: EnvVar[] = [
  {
    name: "RESEND_API_KEY",
    required: true,
    description: "Clé API Resend pour l'envoi d'emails",
    example: "re_NfwjV4y...",
  },
  {
    name: "EMAIL_FROM",
    required: false,
    description: "Adresse email expéditrice (utilise le domaine vérifié)",
    example: "Restaurant Influences <noreply@influences-bayonne.fr>",
  },
  {
    name: "EMAIL_REPLY_TO",
    required: false,
    description: "Adresse email pour les réponses",
    example: "contact@influences-bayonne.fr",
  },
  {
    name: "DATABASE_URL",
    required: true,
    description: "URL de connexion à la base de données PostgreSQL",
  },
  {
    name: "STRIPE_SECRET_KEY",
    required: true,
    description: "Clé secrète Stripe (sk_live_... pour production)",
  },
  {
    name: "STRIPE_PUBLISHABLE_KEY",
    required: true,
    description: "Clé publique Stripe (pk_live_... pour production)",
  },
  {
    name: "STRIPE_WEBHOOK_SECRET",
    required: true,
    description: "Secret du webhook Stripe (whsec_...)",
  },
  {
    name: "NEXTAUTH_SECRET",
    required: true,
    description: "Secret pour NextAuth.js (généré aléatoirement)",
  },
  {
    name: "NEXTAUTH_URL",
    required: true,
    description: "URL de base de l'application",
    example: "https://influences-bayonne.fr",
  },
];

function checkEnvVars() {
  console.log("🔍 Vérification des variables d'environnement\n");

  let allValid = true;
  const missing: string[] = [];
  const present: string[] = [];
  const warnings: string[] = [];

  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar.name];

    if (!value) {
      if (envVar.required) {
        console.error(`❌ ${envVar.name} - MANQUANTE (requise)`);
        console.error(`   ${envVar.description}`);
        if (envVar.example) {
          console.error(`   Exemple: ${envVar.example}`);
        }
        missing.push(envVar.name);
        allValid = false;
      } else {
        console.warn(`⚠️  ${envVar.name} - Non définie (optionnelle)`);
        console.warn(`   ${envVar.description}`);
        if (envVar.example) {
          console.warn(`   Recommandé: ${envVar.example}`);
        }
        warnings.push(envVar.name);
      }
    } else {
      // Masquer les valeurs sensibles
      const displayValue =
        envVar.name.includes("KEY") || envVar.name.includes("SECRET")
          ? `${value.substring(0, 10)}...${value.substring(value.length - 4)}`
          : value.length > 50
          ? `${value.substring(0, 50)}...`
          : value;

      console.log(`✅ ${envVar.name}`);
      console.log(`   Valeur: ${displayValue}`);

      // Vérifications spécifiques
      if (envVar.name === "RESEND_API_KEY") {
        if (value.startsWith("re_test_")) {
          console.warn(`   ⚠️  Clé de TEST - Les emails ne seront pas réellement envoyés`);
        } else if (value.startsWith("re_")) {
          console.log(`   ✅ Format de clé valide`);
        } else {
          console.error(`   ❌ Format de clé invalide (devrait commencer par "re_")`);
          allValid = false;
        }
      }

      if (envVar.name === "EMAIL_FROM") {
        if (!value.includes("@influences-bayonne.fr")) {
          console.warn(
            `   ⚠️  N'utilise pas le domaine vérifié "influences-bayonne.fr"`
          );
        } else {
          console.log(`   ✅ Utilise le domaine vérifié`);
        }
      }

      if (envVar.name === "STRIPE_SECRET_KEY") {
        if (value.startsWith("sk_test_")) {
          console.warn(`   ⚠️  Clé de TEST Stripe`);
        } else if (value.startsWith("sk_live_")) {
          console.log(`   ✅ Clé de PRODUCTION Stripe`);
        } else {
          console.error(`   ❌ Format de clé Stripe invalide`);
          allValid = false;
        }
      }

      if (envVar.name === "STRIPE_PUBLISHABLE_KEY") {
        if (value.startsWith("pk_test_")) {
          console.warn(`   ⚠️  Clé publique de TEST Stripe`);
        } else if (value.startsWith("pk_live_")) {
          console.log(`   ✅ Clé publique de PRODUCTION Stripe`);
        } else {
          console.error(`   ❌ Format de clé Stripe invalide`);
          allValid = false;
        }
      }

      present.push(envVar.name);
    }
    console.log("");
  }

  // Résumé
  console.log("=".repeat(60));
  console.log("📊 RÉSUMÉ");
  console.log("=".repeat(60));
  console.log(`✅ Variables présentes: ${present.length}/${requiredEnvVars.length}`);
  console.log(`❌ Variables manquantes (requises): ${missing.length}`);
  console.log(`⚠️  Variables manquantes (optionnelles): ${warnings.length}`);
  console.log("");

  if (allValid) {
    console.log("✅ Toutes les variables requises sont configurées!");
  } else {
    console.error("❌ Certaines variables requises sont manquantes.");
    console.error("\n💡 Pour Coolify, ajoutez ces variables dans:");
    console.error("   Settings > Environment Variables");
  }

  return allValid;
}

checkEnvVars();

