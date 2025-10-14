/**
 * Génère un code unique pour un bon cadeau
 * Format: INF-XXXX-XXXX
 *
 * - INF : Préfixe pour "Influences"
 * - XXXX : 4 caractères alphanumériques (majuscules, sans caractères ambigus)
 * - XXXX : 4 caractères alphanumériques (majuscules, sans caractères ambigus)
 *
 * Caractères exclus pour éviter la confusion : 0, O, I, 1, L
 */

const ALLOWED_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateGiftCardCode(): string {
  const part1 = generateRandomString(4);
  const part2 = generateRandomString(4);
  return `INF-${part1}-${part2}`;
}

function generateRandomString(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * ALLOWED_CHARS.length);
    result += ALLOWED_CHARS[randomIndex];
  }
  return result;
}

/**
 * Vérifie si un code de bon cadeau est valide (format uniquement)
 */
export function isValidGiftCardCode(code: string): boolean {
  const pattern = /^INF-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return pattern.test(code);
}

/**
 * Génère un code unique en vérifiant qu'il n'existe pas déjà en base
 */
export async function generateUniqueCode(
  checkExists: (code: string) => Promise<boolean>
): Promise<string> {
  let code: string;
  let exists: boolean;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    code = generateGiftCardCode();
    exists = await checkExists(code);
    attempts++;

    if (attempts >= maxAttempts) {
      throw new Error(
        "Impossible de générer un code unique après plusieurs tentatives"
      );
    }
  } while (exists);

  return code;
}

