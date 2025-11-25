import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Migration des GiftCard vers la relation MenuType...\n");

  try {
    // Récupérer tous les bons cadeaux qui n'ont pas encore de menuTypeId
    const giftCards = await prisma.giftCard.findMany({
      where: {
        OR: [
          { menuTypeId: null },
          { menuTypeId: undefined },
        ],
      },
    });

    console.log(`📊 ${giftCards.length} bon(s) cadeau(x) à migrer\n`);

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const giftCard of giftCards) {
      if (!giftCard.productType) {
        console.log(`⏭️  GiftCard ${giftCard.code}: pas de productType, ignoré`);
        skipped++;
        continue;
      }

      try {
        // Chercher le MenuType correspondant par nom
        const menuType = await prisma.menuType.findUnique({
          where: { name: giftCard.productType },
        });

        if (!menuType) {
          console.log(
            `⚠️  GiftCard ${giftCard.code}: MenuType "${giftCard.productType}" non trouvé`
          );
          skipped++;
          continue;
        }

        // Mettre à jour le GiftCard avec le menuTypeId
        await prisma.giftCard.update({
          where: { id: giftCard.id },
          data: { menuTypeId: menuType.id },
        });

        console.log(
          `✅ GiftCard ${giftCard.code}: lié à MenuType "${menuType.name}" (${menuType.id})`
        );
        migrated++;
      } catch (error) {
        console.error(
          `❌ Erreur lors de la migration du GiftCard ${giftCard.code}:`,
          error
        );
        errors++;
      }
    }

    console.log("\n✨ Migration terminée !");
    console.log(`   ✅ Migrés: ${migrated}`);
    console.log(`   ⏭️  Ignorés: ${skipped}`);
    console.log(`   ❌ Erreurs: ${errors}`);
  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error("Erreur:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });




