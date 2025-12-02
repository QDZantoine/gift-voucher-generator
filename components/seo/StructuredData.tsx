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
 */

import { RestaurantJsonLd } from "./RestaurantJsonLd";
import { OrganizationJsonLd } from "./OrganizationJsonLd";

interface StructuredDataProps {
  includeRestaurant?: boolean;
  includeOrganization?: boolean;
}

export function StructuredData({
  includeRestaurant = true,
  includeOrganization = true,
}: StructuredDataProps) {
  return (
    <>
      {includeOrganization && <OrganizationJsonLd />}
      {includeRestaurant && <RestaurantJsonLd />}
    </>
  );
}
