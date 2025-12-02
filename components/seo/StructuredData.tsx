/**
 * Composant regroupant toutes les données structurées JSON-LD
 * pour le référencement SEO
 */

import { RestaurantJsonLd } from "./RestaurantJsonLd";
import { OrganizationJsonLd } from "./OrganizationJsonLd";
import { GiftCardProductJsonLd } from "./GiftCardProductJsonLd";

interface StructuredDataProps {
  includeRestaurant?: boolean;
  includeOrganization?: boolean;
  includeProduct?: boolean;
  productPrice?: number;
}

export function StructuredData({
  includeRestaurant = true,
  includeOrganization = true,
  includeProduct = true,
  productPrice,
}: StructuredDataProps) {
  return (
    <>
      {includeOrganization && <OrganizationJsonLd />}
      {includeRestaurant && <RestaurantJsonLd />}
      {includeProduct && <GiftCardProductJsonLd price={productPrice} />}
    </>
  );
}


