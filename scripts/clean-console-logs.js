#!/usr/bin/env node

/**
 * Script pour nettoyer les console.log dans les fichiers sources
 * Garde les console.error et console.warn pour le debugging
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, "..");

// Directories à traiter
const dirsToProcess = ["app", "components", "lib", "contexts"];

// Directories à exclure
const excludeDirs = ["node_modules", ".next", "dist", "build", "scripts"];

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      // Skip excluded directories
      if (!excludeDirs.includes(file)) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      }
    } else if (
      /\.(ts|tsx|js|jsx)$/.test(file) &&
      !file.endsWith(".d.ts")
    ) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

function cleanConsoleLogs() {
  console.log("🧹 Nettoyage des console.log...\n");

  let totalRemoved = 0;
  let filesModified = 0;

  for (const dir of dirsToProcess) {
    const dirPath = path.join(rootDir, dir);
    try {
      const files = getAllFiles(dirPath);

      for (const file of files) {
        const content = readFileSync(file, "utf8");
        let newContent = content;

        // Count console.log before removal
        const beforeCount = (content.match(/console\.log/g) || []).length;

        // Remove console.log statements
        // Pattern 1: Simple console.log on one line
        newContent = newContent.replace(/^\s*console\.log\([^)]*\);?\s*$/gm, "");

        // Pattern 2: console.log with line breaks
        newContent = newContent.replace(/\s*console\.log\([^;]*\);?\n?/g, "");

        // Clean up multiple empty lines
        newContent = newContent.replace(/\n{3,}/g, "\n\n");

        if (newContent !== content) {
          writeFileSync(file, newContent, "utf8");
          const removed = beforeCount - (newContent.match(/console\.log/g) || []).length;
          if (removed > 0) {
            totalRemoved += removed;
            filesModified++;
            console.log(`✅ ${path.relative(rootDir, file)} (${removed} supprimés)`);
          }
        }
      }
    } catch (error) {
      console.error(`Erreur lors du traitement de ${dir}:`, error.message);
    }
  }

  console.log(
    `\n🎉 Terminé ! ${totalRemoved} console.log supprimés dans ${filesModified} fichiers.`
  );
}

cleanConsoleLogs();

