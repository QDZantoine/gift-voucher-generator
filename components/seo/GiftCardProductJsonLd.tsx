/**
 * JSON-LD Schema.org pour les Bons Cadeaux
 * @see https://schema.org/Product
 * @see https://schema.org/Offer
 */

interface GiftCardProductJsonLdProps {
  name?: string;
  price?: number;
  description?: string;
}

export function GiftCardProductJsonLd({
  name = "Bon Cadeau Restaurant Influences",
  price,
  description = "Offrez une expérience gastronomique inoubliable avec nos bons cadeaux personnalisés. Valable 1 an.",
}: GiftCardProductJsonLdProps = {}) {
  // Construire l'objet offers selon les bonnes pratiques Google
  // Propriétés requises : price, priceCurrency
  // Propriétés recommandées : url, availability, priceValidUntil
  const offers: {
    "@type": string;
    url: string;
    priceCurrency: string;
    price: string;
    availability: string;
    priceValidUntil: string;
    priceSpecification?: {
      "@type": string;
      price: string;
      priceCurrency: string;
      minPrice: string;
      maxPrice: string;
      valueAddedTaxIncluded: boolean;
    };
  } = {
    "@type": "Offer",
    url: "https://influences-bayonne.fr",
    priceCurrency: "EUR",
    price: "35.00", // Prix minimum par défaut (sera remplacé si un prix valide est fourni)
    availability: "https://schema.org/InStock",
    priceValidUntil: new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    ).toISOString(),
  };

  // Vérifier si un prix valide est fourni
  const hasValidPrice =
    price !== undefined &&
    price !== null &&
    typeof price === "number" &&
    !isNaN(price) &&
    price > 0;

  // Pour Google, offers est obligatoire pour les Product snippets
  // Si pas de prix spécifique, utiliser un prix minimum (35€ pour 1 personne)
  // et indiquer que c'est un prix variable avec priceSpecification
  if (hasValidPrice) {
    offers.price = price.toFixed(2);
  } else {
    // Prix minimum par défaut (menu le moins cher pour 1 personne)
    offers.price = "35.00";
    // Ajouter priceSpecification pour indiquer que le prix est variable
    offers.priceSpecification = {
      "@type": "UnitPriceSpecification",
      price: "35.00",
      priceCurrency: "EUR",
      minPrice: "35.00",
      maxPrice: "170.00", // Menu le plus cher pour 2 personnes
      valueAddedTaxIncluded: true,
    };
  }

  const structuredData: {
    "@context": string;
    "@type": string;
    "@id": string;
    name: string;
    description: string;
    image: string[];
    brand: {
      "@type": string;
      name: string;
      logo: string;
    };
    category: string;
    offers: typeof offers;
    additionalProperty: Array<{
      "@type": string;
      name: string;
      value: string;
    }>;
    aggregateRating: {
      "@type": string;
      ratingValue: string;
      ratingCount: string;
      bestRating: string;
      worstRating: string;
    };
  } = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "https://influences-bayonne.fr/#giftcard",
    name,
    description,
    image: [
      "https://influences-bayonne.fr/images/logo-bleu.svg",
      "https://influences-bayonne.fr/opengraph-image",
    ],
    brand: {
      "@type": "Brand",
      name: "Restaurant Influences",
      logo: "https://influences-bayonne.fr/images/logo-bleu.svg",
    },
    category: "Gift Card",
    // offers est toujours inclus (obligatoire pour Google Product snippets)
    // Avec un prix minimum si pas de prix spécifique
    offers,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Validité",
        value: "1 an",
      },
      {
        "@type": "PropertyValue",
        name: "Type",
        value: "Bon Cadeau Numérique",
      },
      {
        "@type": "PropertyValue",
        name: "Livraison",
        value: "Email instantané",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "85",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
