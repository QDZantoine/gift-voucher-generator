import { getPrismaClient } from "../lib/prisma";

async function main() {
  const db = getPrismaClient();

  console.log("🧹 Nettoyage des templateId orphelins...");

  // Mettre à NULL tous les templateId dans GiftCard et MenuType
  const updatedGiftCards = await db.giftCard.updateMany({
    where: {
      templateId: {
        not: null,
      },
    },
    data: {
      templateId: null,
    },
  });

  const updatedMenuTypes = await db.menuType.updateMany({
    where: {
      templateId: {
        not: null,
      },
    },
    data: {
      templateId: null,
    },
  });

  console.log(`✅ ${updatedGiftCards.count} GiftCards mis à jour`);
  console.log(`✅ ${updatedMenuTypes.count} MenuTypes mis à jour`);
  console.log("✅ Nettoyage terminé !");
}

main()
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });






