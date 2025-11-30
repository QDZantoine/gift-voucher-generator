import { getPrismaClient } from "../lib/prisma";

const prisma = getPrismaClient();

async function createAdmin() {
  const email = process.argv[2] || "admin@influences.com";
  const password = process.argv[3] || "admin123456";
  const name = process.argv[4] || "Administrateur";

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`❌ L'utilisateur ${email} existe déjà`);
      return;
    }

    // Créer l'utilisateur avec BetterAuth
    const user = await prisma.user.create({
      data: {
        email,
        name,
        emailVerified: true,
      },
    });

    // Créer le compte avec le mot de passe
    await prisma.account.create({
      data: {
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: password, // BetterAuth gère le hachage automatiquement
      },
    });

    console.log("✅ Utilisateur admin créé avec succès!");
    console.log("📧 Email:", email);
    console.log("🔑 Mot de passe:", password);
    console.log("👤 Nom:", name);
    console.log("");
    console.log("🔗 Connectez-vous sur: http://localhost:3000/login");
    console.log(
      "💡 Note: Utilisez l'interface web pour vous connecter avec BetterAuth"
    );
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
