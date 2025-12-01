import { getPrismaClient } from "../lib/prisma";

const prisma = getPrismaClient();

async function clearGiftCards() {
  try {
    console.log("🗑️  Suppression de tous les bons cadeaux...");

    // Compter le nombre de bons cadeaux avant suppression
    const countBefore = await prisma.giftCard.count();
    console.log(`   📊 Nombre de bons cadeaux à supprimer: ${countBefore}`);

    if (countBefore === 0) {
      console.log("✅ Aucun bon cadeau à supprimer");
      return;
    }

    // Demander confirmation si en mode interactif
    if (process.stdin.isTTY) {
      console.log("\n⚠️  ATTENTION: Cette action est irréversible !");
      console.log("   Tous les bons cadeaux seront définitivement supprimés.\n");
    }

    // Supprimer tous les bons cadeaux
    const result = await prisma.giftCard.deleteMany({});

    console.log(`\n✅ ${result.count} bon(s) cadeau(x) supprimé(s) avec succès`);
    console.log("   La base de données est maintenant vide pour les bons cadeaux.\n");

    // Vérifier qu'il n'en reste plus
    const countAfter = await prisma.giftCard.count();
    if (countAfter === 0) {
      console.log("✅ Vérification: Aucun bon cadeau restant");
    } else {
      console.log(`⚠️  Attention: ${countAfter} bon(s) cadeau(x) restant(s)`);
    }
  } catch (error) {
    console.error("❌ Erreur lors de la suppression des bons cadeaux:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
clearGiftCards();


