import { getPrismaClient } from "../lib/prisma";

const prisma = getPrismaClient();

const defaultMenuTypes = [
  {
    name: "Menu Influences",
    description: "Menu signature du restaurant",
    amount: 45,
    isActive: true,
  },
  {
    name: "Menu Dégustation",
    description: "Menu découverte avec plusieurs plats",
    amount: 65,
    isActive: true,
  },
  {
    name: "Menu Influences - Classique",
    description: "Menu Influences version classique",
    amount: 45,
    isActive: true,
  },
  {
    name: "Menu Carte Blanche",
    description: "Menu surprise du chef",
    amount: 85,
    isActive: true,
  },
  {
    name: "Brunch",
    description: "Brunch du week-end",
    amount: 35,
    isActive: true,
  },
];

async function main() {
  console.log("🌱 Initialisation des types de menus par défaut...");

  for (const menuType of defaultMenuTypes) {
    try {
      const existing = await prisma.menuType.findUnique({
        where: { name: menuType.name },
      });

      if (existing) {
        console.log(`⏭️  "${menuType.name}" existe déjà, ignoré`);
      } else {
        await prisma.menuType.create({
          data: menuType,
        });
        console.log(`✅ "${menuType.name}" créé avec succès`);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la création de "${menuType.name}":`, error);
    }
  }

  console.log("✨ Initialisation terminée !");
}

main()
  .catch((e) => {
    console.error("Erreur:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

