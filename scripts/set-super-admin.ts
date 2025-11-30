import { getPrismaClient } from "../lib/prisma";

const prisma = getPrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("❌ Veuillez fournir un email: npx tsx scripts/set-super-admin.ts email@example.com");
    process.exit(1);
  }

  console.log(`🔍 Recherche de l'utilisateur: ${email}\n`);

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    console.error(`❌ Utilisateur non trouvé: ${email}`);
    process.exit(1);
  }

  console.log("✅ Utilisateur trouvé:");
  console.log(`  - Nom: ${user.name || "Non défini"}`);
  console.log(`  - Email: ${user.email}`);
  console.log(`  - Rôle actuel: ${user.role || "Non défini"}\n`);

  if (user.role === "SUPER_ADMIN") {
    console.log("ℹ️  L'utilisateur est déjà SUPER_ADMIN.");
    process.exit(0);
  }

  console.log("🔄 Promotion en SUPER_ADMIN...\n");

  await prisma.user.update({
    where: { id: user.id },
    data: { role: "SUPER_ADMIN" },
  });

  console.log("✅ Utilisateur promu en SUPER_ADMIN avec succès!");
  console.log(`   ${user.email} est maintenant SUPER_ADMIN.\n`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });




