-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExclusionPeriod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ExclusionPeriod" ("createdAt", "endDate", "id", "isActive", "name", "startDate", "updatedAt") SELECT "createdAt", "endDate", "id", "isActive", "name", "startDate", "updatedAt" FROM "ExclusionPeriod";
DROP TABLE "ExclusionPeriod";
ALTER TABLE "new_ExclusionPeriod" RENAME TO "ExclusionPeriod";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
