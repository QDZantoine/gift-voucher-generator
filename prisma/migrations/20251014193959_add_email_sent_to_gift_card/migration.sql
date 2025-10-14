-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GiftCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "numberOfPeople" INTEGER NOT NULL,
    "recipientName" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "purchaserName" TEXT NOT NULL,
    "purchaserEmail" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "purchaseDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" DATETIME NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "createdOnline" BOOLEAN NOT NULL DEFAULT true,
    "stripePaymentId" TEXT,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "GiftCard_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_GiftCard" ("amount", "code", "createdAt", "createdBy", "createdOnline", "expiryDate", "id", "isUsed", "numberOfPeople", "productType", "purchaseDate", "purchaserEmail", "purchaserName", "recipientEmail", "recipientName", "stripePaymentId", "usedAt") SELECT "amount", "code", "createdAt", "createdBy", "createdOnline", "expiryDate", "id", "isUsed", "numberOfPeople", "productType", "purchaseDate", "purchaserEmail", "purchaserName", "recipientEmail", "recipientName", "stripePaymentId", "usedAt" FROM "GiftCard";
DROP TABLE "GiftCard";
ALTER TABLE "new_GiftCard" RENAME TO "GiftCard";
CREATE UNIQUE INDEX "GiftCard_code_key" ON "GiftCard"("code");
CREATE INDEX "GiftCard_code_idx" ON "GiftCard"("code");
CREATE INDEX "GiftCard_createdBy_idx" ON "GiftCard"("createdBy");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
