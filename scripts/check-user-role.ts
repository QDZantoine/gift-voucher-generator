import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("❌ Veuillez fournir un email: npx tsx scripts/check-user-role.ts email@example.com");
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
      createdAt: true,
    },
  });

  if (!user) {
    console.error(`❌ Utilisateur non trouvé: ${email}`);
    process.exit(1);
  }

  console.log("✅ Utilisateur trouvé:");
  console.log(`  - ID: ${user.id}`);
  console.log(`  - Nom: ${user.name || "Non défini"}`);
  console.log(`  - Email: ${user.email}`);
  console.log(`  - Rôle: ${user.role || "Non défini"}`);
  console.log(`  - Créé le: ${user.createdAt}\n`);

  if (!user.role || user.role === "") {
    console.log("⚠️  L'utilisateur n'a pas de rôle défini.");
    console.log("🔄 Mise à jour avec le rôle ADMIN...\n");
    
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" },
    });
    
    console.log("✅ Rôle mis à jour avec succès!");
  }
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



