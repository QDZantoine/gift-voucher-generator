import { prismaBase } from "../lib/prisma";

async function testMenuTypes() {
  console.log("🧪 Test de récupération des MenuTypes...\n");

  try {
    // Test 1: Vérifier que prismaBase est disponible
    console.log("1️⃣ Vérification de prismaBase...");
    if (!prismaBase) {
      console.error("❌ prismaBase n'est pas défini");
      process.exit(1);
    }
    console.log("✅ prismaBase est défini");

    // Test 2: Vérifier que menuType est disponible
    console.log("\n2️⃣ Vérification de prismaBase.menuType...");
    if (!prismaBase.menuType) {
      console.error("❌ prismaBase.menuType n'est pas disponible");
      process.exit(1);
    }
    console.log("✅ prismaBase.menuType est disponible");

    // Test 3: Compter les menu types
    console.log("\n3️⃣ Comptage des menu types...");
    const count = await prismaBase.menuType.count();
    console.log(`✅ Nombre de menu types: ${count}`);

    // Test 4: Récupérer tous les menu types
    console.log("\n4️⃣ Récupération de tous les menu types...");
    const menuTypes = await prismaBase.menuType.findMany({
      orderBy: { name: "asc" },
    });
    console.log(`✅ ${menuTypes.length} menu type(s) récupéré(s)`);

    if (menuTypes.length > 0) {
      console.log("\n📋 Liste des menu types:");
      menuTypes.forEach((mt) => {
        console.log(`   - ${mt.name} (${mt.amount}€) - ${mt.isActive ? "Actif" : "Inactif"}`);
      });
    } else {
      console.log("\n⚠️  Aucun menu type trouvé dans la base de données");
      console.log("   Exécutez: npx tsx scripts/init-menu-types.ts");
    }

    // Test 5: Test avec pagination
    console.log("\n5️⃣ Test avec pagination...");
    const paginated = await prismaBase.menuType.findMany({
      skip: 0,
      take: 5,
      orderBy: { name: "asc" },
    });
    console.log(`✅ ${paginated.length} menu type(s) récupéré(s) avec pagination`);

    // Test 6: Test avec recherche
    console.log("\n6️⃣ Test avec recherche...");
    const searchResults = await prismaBase.menuType.findMany({
      where: {
        OR: [
          { name: { contains: "Menu", mode: "insensitive" } },
        ],
      },
    });
    console.log(`✅ ${searchResults.length} résultat(s) de recherche`);

    console.log("\n✨ Tous les tests sont passés avec succès!");
  } catch (error) {
    console.error("\n❌ Erreur lors des tests:", error);
    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
    }
    process.exit(1);
  } finally {
    await prismaBase.$disconnect();
  }
}

testMenuTypes();

