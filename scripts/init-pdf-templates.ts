import { getPrismaClient } from "../lib/prisma";
import { DEFAULT_TEMPLATES } from "../lib/pdf-templates";

async function main() {
  const db = getPrismaClient();

  console.log("📄 Initialisation des templates PDF par défaut...");

  // Vérifier si des templates existent déjà
  const existingTemplates = await db.pDFTemplate.findMany();

  if (existingTemplates.length > 0) {
    console.log(`ℹ️  ${existingTemplates.length} template(s) déjà présent(s) en base de données`);
    console.log("✅ Pas besoin d'initialiser");
    return;
  }

  // Créer les templates par défaut
  for (const template of DEFAULT_TEMPLATES) {
    await db.pDFTemplate.create({
      data: {
        name: template.name,
        description: template.description,
        productType: template.productType,
        html: template.html,
        css: template.css,
        isActive: template.isActive,
      },
    });
    console.log(`✅ Template créé: ${template.name}`);
  }

  console.log(`\n✅ ${DEFAULT_TEMPLATES.length} template(s) initialisé(s) avec succès !`);
}

main()
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });








