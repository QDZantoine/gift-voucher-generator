import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Mise à jour des rôles utilisateurs...\n");

  // Mettre à jour tous les utilisateurs avec ADMIN par défaut
  // Note: Si le champ role n'existe pas encore, cette requête échouera
  // Dans ce cas, utilisez d'abord `npx prisma db push` pour synchroniser le schéma
  const result = await prisma.user.updateMany({
    data: {
      role: "ADMIN",
    },
  });

  console.log(`✅ ${result.count} utilisateur(s) mis à jour avec le rôle ADMIN\n`);

  // Afficher tous les utilisateurs avec leurs rôles
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  console.log("📋 Liste des utilisateurs :");
  users.forEach((user) => {
    console.log(`  - ${user.email} (${user.name || "Sans nom"}) : ${user.role || "ADMIN"}`);
  });

  console.log("\n✅ Mise à jour terminée !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

