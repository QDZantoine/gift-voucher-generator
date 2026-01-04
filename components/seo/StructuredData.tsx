/**
 * Composant regroupant toutes les données structurées JSON-LD
 * pour le référencement SEO
 *
 * Pour un restaurant qui génère des bons cadeaux, nous utilisons :
 * - Organization : Informations sur l'organisation
 * - Restaurant : Informations sur le restaurant (LocalBusiness)
 *
 * Product snippets ne sont pas appropriés car nous ne vendons pas de produits,
 * mais générons des bons cadeaux (service).
 *
 * IMPORTANT : Utilise un script JSON-LD unifié avec @graph pour éviter
 * l'erreur "L'avis contient plusieurs notes cumulées" de Google Search Console.
 * Toutes les entités sont regroupées dans un seul script pour garantir
 * qu'il n'y a qu'un seul AggregateRating.
 */

import { UnifiedStructuredData } from "./UnifiedStructuredData";

interface StructuredDataProps {
  includeRestaurant?: boolean;
  includeOrganization?: boolean;
}

export function StructuredData({
  includeRestaurant = true,
  includeOrganization = true,
}: StructuredDataProps) {
  // Utilise le composant unifié qui fusionne tout en un seul script JSON-LD
  // Cela évite les doublons d'AggregateRating détectés par Google Search Console
  if (includeRestaurant && includeOrganization) {
    return <UnifiedStructuredData />;
  }

  // Fallback pour les cas où on ne veut qu'une seule entité (non recommandé)
  // Dans ce cas, on utilise toujours le composant unifié mais on pourrait
  // filtrer les entités si nécessaire à l'avenir
  return <UnifiedStructuredData />;
}
